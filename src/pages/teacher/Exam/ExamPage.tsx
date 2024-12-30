import React, { useState, useEffect } from "react";
import { Typography, Button, Modal, Form, notification, Input, Spin, Pagination } from "antd";
import { fetchAllQuestions, fetchQuestionsByUserId, IQuestion } from "@/data/academy-staff/QuestionBankData";
import { getUserId } from "@/data/apiClient";
import { createExam } from "@/data/client/ExamData";
import { PlusOutlined } from "@ant-design/icons";
import Filters from "./Filters"; // Import bộ lọc Filters

const { Title } = Typography;

const ExamPage: React.FC = () => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<IQuestion[]>([]); // State cho câu hỏi đã lọc
  const [currentPage, setCurrentPage] = useState(1); // State cho trang hiện tại
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showAnswers, setShowAnswers] = useState<boolean>(false); // State để hiển thị đáp án
  const [filters, setFilters] = useState({
    searchTerm: "",
    grade: "",
    curriculum: "",
    subject: "",
    chapter: "", // Thêm bộ lọc chương
    lesson: "",  // Thêm bộ lọc bài
  }); // State cho bộ lọc
  const [useMyQuestions, setUseMyQuestions] = useState<boolean>(false); // State để chuyển đổi API

  const itemsPerPage = 5; // Số câu hỏi mỗi trang

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Gọi API lấy câu hỏi
        let response;
        if (useMyQuestions) {
          const userId = getUserId();
          response = await fetchQuestionsByUserId(userId || "");
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

    loadQuestions();
  }, [useMyQuestions]);

  useEffect(() => {
    // Lọc câu hỏi khi bộ lọc thay đổi
    const applyFilters = () => {
      const { searchTerm, grade, curriculum, subject, chapter, lesson } = filters;

      console.log("Filters applied:", filters); // Debug filters

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

      console.log("Filtered Questions:", filtered); // Debug filtered questions
      setFilteredQuestions(filtered);
    };

    applyFilters();
  }, [filters, questions]);

  const handleSelectQuestion = (questionId: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const showModal = () => {
    if (selectedQuestions.length === 0) {
      notification.error({ message: "Vui lòng chọn ít nhất một câu hỏi!" });
    } else {
      setIsModalVisible(true);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSaveExam = async (values: { title: string; time: string }) => {
    const examData = {
      title: values.title,
      time: values.time + " phút",
      userId: getUserId() || "",
      questionIds: selectedQuestions,
    };

    const response = await createExam(examData);
    if (response) {
      notification.success({ message: "Tạo bài kiểm tra thành công!" });
      setIsModalVisible(false);
      setSelectedQuestions([]);
    } else {
      notification.error({ message: "Tạo bài kiểm tra thất bại!" });
    }
  };

  // Function to render the answers with correct answer indicator
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

  const currentPageQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4 text-center">Tạo bài kiểm tra</h1>
      {/* Layout container for search, filters, and create button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4 w-1/2 items-center">
          {/* Filters */}
          <Filters onFiltersChange={(newFilters) => setFilters(newFilters)} />
        </div>

        {/* Create Exam Button */}
        <Button
          type="primary"
          onClick={showModal}
          className="h-9 px-4 flex items-center -mt-5" // Sử dụng negative margin-top
        >
          <PlusOutlined className="mr-2" />
          Thêm bài kiểm tra
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : filteredQuestions.length > 0 ? (
        <div>
          {/* Toggle Source Button */}
          <div className="flex justify-between items-center mb-4">
            <Button
              type="primary"
              onClick={() => setShowAnswers(!showAnswers)}
              className="h-10"
            >
              {showAnswers ? "Ẩn đáp án" : "Hiển thị đáp án"}
            </Button>

            <Button
              type="default"
              onClick={() => setUseMyQuestions((prev) => !prev)}
              className="h-10"
            >
              {useMyQuestions ? "Ngân hàng câu hỏi" : "Câu hỏi của tôi"}
            </Button>
          </div>

          <div className="question-list">
            {currentPageQuestions.map((question, index) => (
              <div key={question.questionId} className="mb-6 p-4 border rounded-lg">
                <Title level={5}>
                  <input
                    type="checkbox"
                    onChange={() => handleSelectQuestion(question.questionId)}
                    checked={selectedQuestions.includes(question.questionId)}
                    className="mr-2"
                  />
                  Câu {(currentPage - 1) * itemsPerPage + index + 1}: {question.question}
                </Title>
                {renderAnswers(question.answers)}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={filteredQuestions.length}
            onChange={(page) => setCurrentPage(page)}
            className="mt-4"
          />
        </div>
      ) : (
        <p>Ngân hàng chưa có câu hỏi.</p>
      )}

      <Modal
        title="Tạo Bài Kiểm Tra"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          onFinish={(values) => handleSaveExam(values)}
          layout="vertical"
          initialValues={{ title: "", time: "" }}
        >
          <Form.Item
            label="Tên bài kiểm tra"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tên bài kiểm tra" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Thời gian làm bài (phút)"
            name="time"
            rules={[{ required: true, message: "Vui lòng nhập thời gian làm bài" }]}
          >
            <Input placeholder="Ví dụ: 60" />
          </Form.Item>
          <Form.Item>
            <div className="flex justify-end">
              <Button type="default" onClick={handleCancel} className="mr-4">
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Lưu bài kiểm tra
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExamPage;
