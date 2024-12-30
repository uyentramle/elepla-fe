import React, { useState, useEffect } from "react";
import { Typography, Button, Pagination, Spin } from "antd";
import {
  fetchAllQuestions,
  fetchQuestionsByUserId,
  IQuestion,
} from "@/data/academy-staff/QuestionBankData";

import { getUserId } from "@/data/apiClient"; // Import getUserId
import Filters from "@/pages/teacher/Exam/Filters"; // Import bộ lọc Filters

const { Title } = Typography;

interface AddQuestionExamProps {
  onAddQuestions: (selectedQuestions: IQuestion[]) => void;
}

const AddQuestionExam: React.FC<AddQuestionExamProps> = ({ onAddQuestions }) => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isMyQuestions, setIsMyQuestions] = useState<boolean>(false);
  const pageSize = 10;
  const [filters, setFilters] = useState({
    searchTerm: "",
    grade: "",
    curriculum: "",
    subject: "",
    chapter: "",
    lesson: "",
  });

  const userId = getUserId();

  const handleSelectQuestion = (questionId: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const loadQuestions = async (pageIndex: number) => {
    try {
      setLoading(true);
      let response;

      if (isMyQuestions) {
        if (!userId) {
          throw new Error("User ID is required to fetch personal questions.");
        }
        response = await fetchQuestionsByUserId(userId, pageIndex - 1, pageSize);
      } else {
        response = await fetchAllQuestions(pageIndex - 1, pageSize);
      }

      if (response.success) {
        setQuestions(response.data.items);
        setTotalQuestions(response.data.totalItemsCount); // Lấy tổng số câu hỏi để phân trang
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while loading questions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions(currentPage);
  }, [isMyQuestions, currentPage]);

  const handleAddQuestions = () => {
    const selectedQuestionObjects = questions.filter((q) =>
      selectedQuestions.includes(q.questionId)
    );
    onAddQuestions(selectedQuestionObjects);
  };

  const applyFilters = () => {
    const { searchTerm, grade, curriculum, subject, chapter, lesson } = filters;

    return questions.filter((question) => {
      const matchesSearchTerm =
        searchTerm === "" ||
        question.question.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGrade = grade === "" || question.grade === grade;
      const matchesCurriculum =
        curriculum === "" || question.curriculum === curriculum;
      const matchesSubject = subject === "" || question.subject === subject;
      const matchesChapter =
        chapter === "" || question.chapterName === chapter;
      const matchesLesson = lesson === "" || question.lessonName === lesson;

      return (
        matchesSearchTerm &&
        matchesGrade &&
        matchesCurriculum &&
        matchesSubject &&
        matchesChapter &&
        matchesLesson
      );
    });
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const filteredQuestions = applyFilters();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4 text-center">Thêm câu hỏi</h1>

      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-4">
          <Filters onFiltersChange={handleFiltersChange} />
        </div>
      </div>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <p>{error}</p>
      ) : filteredQuestions.length > 0 ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <Button
                type="primary"
                onClick={() => setShowAnswers(!showAnswers)}
                style={{ marginRight: "12px" }}
              >
                {showAnswers ? "Ẩn đáp án" : "Hiển thị đáp án"}
              </Button>
              <Button
                type="primary"
                onClick={handleAddQuestions}
                disabled={selectedQuestions.length === 0}
              >
                Thêm câu hỏi đã chọn
              </Button>
            </div>
            <Button
              type="default"
              onClick={() => setIsMyQuestions(!isMyQuestions)}
            >
              {isMyQuestions ? "Ngân hàng câu hỏi" : "Câu hỏi của tôi"}
            </Button>
          </div>
          <div className="question-list">
            {filteredQuestions.map((question, index) => (
              <div
                key={question.questionId}
                className="mb-6 p-4 border rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <Title level={5}>
                    <input
                      type="checkbox"
                      onChange={() =>
                        handleSelectQuestion(question.questionId)
                      }
                      checked={selectedQuestions.includes(
                        question.questionId
                      )}
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
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalQuestions}
            onChange={(page) => setCurrentPage(page)}
            className="mt-4"
          />
        </div>
      ) : (
        <p>Không có câu hỏi nào trong danh mục.</p>
      )}
    </div>
  );
  
};

export default AddQuestionExam;
