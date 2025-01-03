import React, { useState, useEffect } from "react";
import { Button, Spin, Checkbox, Pagination } from "antd";
import {
  fetchAllQuestions,
  fetchQuestionsByUserId,
  IQuestion,
} from "@/data/academy-staff/QuestionBankData";
import { getUserId } from "@/data/apiClient";
import Filters from "../Exam/Filters";

interface AddNewQuestionProps {
  onAddQuestions: (selectedQuestions: IQuestion[]) => void;
}

const AddNewQuestion: React.FC<AddNewQuestionProps> = ({ onAddQuestions }) => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [selectedQuestions, setSelectedQuestions] = useState<IQuestion[]>([]);
  const [filters, setFilters] = useState({
    searchTerm: "", // Thêm trường searchTerm
    grade: "",
    curriculum: "",
    subject: "",
    chapter: "",
    lesson: "",
  });
  const [useMyQuestions, setUseMyQuestions] = useState<boolean>(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        setSelectedQuestions([]); // Reset danh sách đã chọn
  
        let response;
        if (useMyQuestions) {
          const userId = getUserId();
          response = await fetchQuestionsByUserId(userId || "");
        } else {
          response = await fetchAllQuestions(0, 50);
        }
  
        if (response.success) {
          setQuestions(response.data.items);
          setCurrentPage(1); // Reset to first page only when fetching new data
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Lỗi khi tải dữ liệu từ API.");
      } finally {
        setLoading(false);
      }
    };
  
    loadQuestions();
  }, [useMyQuestions]);
  
  
  useEffect(() => {
    const applyFilters = () => {
      const { searchTerm, grade, curriculum, subject, chapter, lesson } = filters;
  
      // Lọc dựa trên toàn bộ danh sách `questions`
      const filtered = questions.filter((question) => {
        const matchesSearchTerm =
          searchTerm === "" ||
          question.question.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGrade = grade === "" || question.grade === grade;
        const matchesCurriculum =
          curriculum === "" || question.curriculum === curriculum;
        const matchesSubject = subject === "" || question.subject === subject;
        const matchesChapter = chapter === "" || question.chapterName === chapter;
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
  
      // Cập nhật danh sách đã lọc và reset về trang đầu tiên
      setFilteredQuestions(filtered);
    };
  
    applyFilters();
  }, [filters, questions]);
  
  // Pagination logic: Chỉ phân trang trên danh sách `filteredQuestions`
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuestions = filteredQuestions.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  
  
  

  const handleCheckboxChange = (question: IQuestion, isChecked: boolean) => {
    if (isChecked) {
      setSelectedQuestions((prev) => [...prev, question]);
    } else {
      setSelectedQuestions((prev) =>
        prev.filter((q) => q.questionId !== question.questionId)
      );
    }
  };  
  
  const renderAnswers = (answers: IQuestion["answers"]) => (
    <ul className="pl-6 list-disc">
      {answers.map((answer, i) => (
        <li key={answer.answerId} className="mb-2">
          <span>
            {String.fromCharCode(65 + i)}. {answer.answerText}
          </span>
          {showAnswers && answer.isCorrect && (
            <span className="ml-2 text-green-600">(Đúng)</span>
          )}
        </li>
      ))}
    </ul>
  );

  return (
<div className="max-w-7xl mx-auto p-4">
  <h1 className="text-2xl font-semibold mb-6 text-center">Ngân hàng câu hỏi</h1>
  <div className="flex justify-between items-center mb-6">
    <div className="flex space-x-2 items-center w-2/3">
      {/* Truyền callback để nhận filters */}
      <Filters onFiltersChange={(newFilters) => setFilters(newFilters)} />
    </div>
  </div>

  {/* Nút cố định */}
  <div className="flex justify-between items-center mb-4">
    <div className="flex space-x-2">
      <Button
        type="primary"
        onClick={() => setShowAnswers(!showAnswers)}
        className="h-10 px-4"
      >
        {showAnswers ? "Ẩn đáp án" : "Hiển thị đáp án"}
      </Button>
      <Button
        type="default"
        onClick={() => {
          setUseMyQuestions((prev) => !prev);
        }}
        className="h-10 px-4"
      >
        {useMyQuestions ? "Ngân hàng câu hỏi" : "Câu hỏi của tôi"}
      </Button>
    </div>
        <Button
          type="primary"
          disabled={selectedQuestions.length === 0}
          onClick={() => {
            onAddQuestions(selectedQuestions); // Gửi danh sách các câu hỏi đã chọn
            setSelectedQuestions([]); // Reset danh sách các câu hỏi đã chọn
          }}
          className="h-10 px-4"
        >
          Thêm câu hỏi ({selectedQuestions.length})
        </Button>
  </div>

  {/* Nội dung hiển thị */}
  {loading ? (
    <div className="flex justify-center items-center h-64">
      <Spin size="large" />
    </div>
  ) : error ? (
    <p className="text-red-500 text-center">{error}</p>
  ) : filteredQuestions.length > 0 ? (
    <div>
      <div className="question-list space-y-4">
        {paginatedQuestions.map((question, index) => (
          <div
            key={question.questionId}
            className="p-4 border border-gray-300 rounded-lg flex items-start space-x-4"
          >
            <Checkbox
              checked={selectedQuestions.some(
                (q) => q.questionId === question.questionId
              )}
              onChange={(e) => handleCheckboxChange(question, e.target.checked)}
            />
            <div>
              <h5 className="font-semibold mb-2">
                Câu {startIndex + index + 1}: {question.question}
              </h5>
              {renderAnswers(question.answers)}
            </div>
          </div>
        ))}
      </div>

      <Pagination
        current={currentPage}
        pageSize={itemsPerPage}
        total={filteredQuestions.length}
        onChange={(page) => setCurrentPage(page)}
        className="mt-4 text-center"
      />
    </div>
  ) : (
    <p className="text-gray-500 text-center">Ngân hàng chưa có câu hỏi.</p>
  )}
</div>
  );
  
};

export default AddNewQuestion;
