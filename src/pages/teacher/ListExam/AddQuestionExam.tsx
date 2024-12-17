import React, { useState, useEffect } from "react";
import { Typography, Input, Button } from "antd";
import {
  fetchAllQuestions,
  fetchQuestionsByChapter,
  fetchQuestionsByLesson,
  IQuestion,
} from "@/data/academy-staff/QuestionBankData";
import FilterSection from "@/layouts/teacher/Components/FilterSection/FilterSection";
import { SearchOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface AddQuestionExamProps {
    onAddQuestions: (selectedQuestions: IQuestion[]) => void; // Sử dụng IQuestion[]
  }

const AddQuestionExam: React.FC<AddQuestionExamProps> = ({ onAddQuestions }) => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [filters, setFilters] = useState<{ chapterId?: string; lessonId?: string }>({});
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const handleSelectQuestion = (questionId: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId) // Bỏ chọn nếu đã chọn trước đó
        : [...prev, questionId] // Thêm vào danh sách nếu chưa chọn
    );
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      let response;

      if (filters.lessonId) {
        response = await fetchQuestionsByLesson(filters.lessonId, 0, 50);
      } else if (filters.chapterId) {
        response = await fetchQuestionsByChapter(filters.chapterId, 0, 50);
      } else {
        response = await fetchAllQuestions(0, 50);
      }

      if (response.success) {
        setQuestions(response.data.items);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Lỗi khi tải dữ liệu từ API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [filters]);

  const handleFilterChange = (newFilters: {
    gradeId?: string;
    curriculumId?: string;
    subjectId?: string;
    chapterId?: string;
    lessonId?: string;
  }) => {
    setFilters({
      chapterId: newFilters.chapterId,
      lessonId: newFilters.lessonId,
    });
  };

  const handleAddQuestions = () => {
    const selectedQuestionObjects = questions.filter((q) =>
      selectedQuestions.includes(q.questionId)
    );
    onAddQuestions(selectedQuestionObjects);
  };

  return (
    <div>
      <Title level={2} className="my-4">
        Thêm câu hỏi
      </Title>
      <div className="mb-4 flex justify-between">
        <Input
          type="text"
          placeholder="Tìm kiếm..."
          suffix={<SearchOutlined />}
          className="mr-4"
        />
      </div>
      <FilterSection onFilterChange={handleFilterChange} />
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p>{error}</p>
      ) : questions.length > 0 ? (
        <div>
          <Button
            type="primary"
            onClick={() => setShowAnswers(!showAnswers)}
            style={{ marginTop: "12px", marginBottom: "12px" }}
          >
            {showAnswers ? "Ẩn đáp án" : "Hiển thị đáp án"}
          </Button>
          <div className="question-list">
            {questions.map((question, index) => (
              <div key={question.questionId} className="mb-6 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <Title level={5}>
                    <input
                      type="checkbox"
                      onChange={() => handleSelectQuestion(question.questionId)}
                      checked={selectedQuestions.includes(question.questionId)}
                      className="mr-2"
                    />
                    Câu {index + 1}: {question.question}
                  </Title>
                </div>
                <ul className="pl-6 list-disc">
                  {question.answers.map((answer, i) => (
                    <li key={answer.answerId} className="mb-2">
                      <span>
                        {String.fromCharCode(65 + i)}. {answer.answerText}
                      </span>
                      {showAnswers && answer.isCorrect && (
                        <strong className="ml-2 text-green-600">(Đúng)</strong>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Button
            type="primary"
            onClick={handleAddQuestions}
            disabled={selectedQuestions.length === 0}
            style={{ marginTop: "12px" }}
          >
            Thêm câu hỏi đã chọn
          </Button>
        </div>
      ) : (
        <p>Không có câu hỏi nào trong ngân hàng.</p>
      )}
    </div>
  );
};

export default AddQuestionExam;
