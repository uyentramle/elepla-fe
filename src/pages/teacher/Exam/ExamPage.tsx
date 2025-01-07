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
  const [filteredQuestions, setFilteredQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    searchTerm: "",
    grade: "",
    curriculum: "",
    subject: "",
    chapter: "",
    lesson: "",
  });
  const [useMyQuestions, setUseMyQuestions] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const questionsPerPage = 5;

  const [form] = Form.useForm(); // Sử dụng Form.useForm()

  useEffect(() => {
    setCurrentPage(1);
  }, [useMyQuestions]);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = useMyQuestions
          ? await fetchQuestionsByUserId(getUserId() || "")
          : await fetchAllQuestions(-1, 10);

        if (response.success) {
          setQuestions(response.data.items || []);
          setFilteredQuestions(response.data.items || []);
        } else {
          setError(response.message || "Tải dữ liệu thất bại.");
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

      setFilteredQuestions(filtered);
    };

    applyFilters();
  }, [filters, questions]);

  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

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
      time: values.time + " phút" ,
      userId: getUserId() || "",
      questionIds: selectedQuestions,
    };

    const response = await createExam(examData);
    if (response) {
      notification.success({ message: "Tạo bài kiểm tra thành công!" });
      setIsModalVisible(false);
      setSelectedQuestions([]);
      form.resetFields(); // Reset form sau khi thành công
    } else {
      notification.error({ message: "Tạo bài kiểm tra thất bại!" });
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
    <div>
      <h1 className="text-2xl font-semibold mb-4 text-center">Tạo bài kiểm tra</h1>
      {/* Layout container for search, filters, and create button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4 w-1/2 items-center">
          {/* Filters */}
          <Filters onFiltersChange={(newFilters) => setFilters(newFilters)} />
        </div>
  
        {/* Create Exam Button */}

      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {/* Toggle Source Button */}
          <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
              <Button
                type="primary"
                onClick={() => setShowAnswers(!showAnswers)}
                className="h-10 px-4"
                style={{ width: 140 }} // Cố định chiều rộng
              >
                {showAnswers ? "Ẩn đáp án" : "Hiển thị đáp án"}
              </Button>

              <Button
                type="default"
                onClick={() => setUseMyQuestions((prev) => !prev)}
                className="h-10 px-4"
                style={{ width: 160 }} // Cố định chiều rộng
              >
                {useMyQuestions ? "Ngân hàng câu hỏi" : "Câu hỏi của tôi"}
              </Button>
              </div>

              <Button
                type="primary"
                onClick={showModal}
                className="h-9 px-6 flex items-center -mt-5"
              >
                <PlusOutlined className="mr-2" />
                Thêm bài kiểm tra
              </Button>
            </div>

  
          {filteredQuestions.length > 0 ? (
            <div>
              <div className="question-list">
                {paginatedQuestions.map((question, index) => (
                  <div key={question.questionId} className="mb-6 p-4 border rounded-lg">
                    <Title level={5}>
                      <input
                        type="checkbox"
                        onChange={() => handleSelectQuestion(question.questionId)}
                        checked={selectedQuestions.includes(question.questionId)}
                        className="mr-2"
                      />
                      Câu {(currentPage - 1) * questionsPerPage + index + 1}: {question.question}
                    </Title>
                    {renderAnswers(question.answers)}
                  </div>
                ))}
              </div>
  
              {/* Pagination Component */}
              <div className="flex justify-center mt-4">
                <Pagination
                  current={currentPage}
                  pageSize={questionsPerPage}
                  total={filteredQuestions.length}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                />
              </div>
            </div>
          ) : (
            <p>Danh sách chưa có câu hỏi.</p>
          )}
        </div>
      )}
      <Modal
        title="Tạo Bài Kiểm Tra"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form} // Gắn form vào Form.useForm()
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
                label="Thời gian làm bài"
                name="time"
                rules={[
                  { required: true, message: "Vui lòng nhập thời gian làm bài" },
                  {
                    validator: (_, value) => {
                      if (!value || (Number(value) > 1 && !isNaN(Number(value)))) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Thời gian làm bài phải là số lớn hơn 1")
                      );
                    },
                  },
                ]}
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
