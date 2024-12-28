import React, { useState, useEffect } from "react";
import { Typography, Button, Modal, Form, notification, Input } from "antd";
import Filters from "./Filters"; // Import bộ lọc từ thư mục Filters
import {
  fetchAllQuestions,
  IQuestion,
} from "@/data/academy-staff/QuestionBankData";
import { getUserId } from "@/data/apiClient";
import { createExam } from "@/data/client/ExamData";
import { PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

const ExamPage: React.FC = () => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: "",
    grade: "",
    curriculum: "",
  });
  const [showAnswers, setShowAnswers] = useState<boolean>(false); // New state for showing answers

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);

        // Gọi API lấy câu hỏi
        const response = await fetchAllQuestions(0, 50);
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
  }, []);

  const handleFiltersChange = (updatedFilters: {
    searchTerm: string;
    grade: string;
    curriculum: string;
  }) => {
    setFilters(updatedFilters);
  };

  const handleSelectQuestion = (questionId: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesGrade = !filters.grade || question.grade === filters.grade;
    const matchesCurriculum =
      !filters.curriculum || question.curriculum === filters.curriculum;
    const matchesSearch = question.question
      .toLowerCase()
      .includes(filters.searchTerm.toLowerCase());

    return matchesGrade && matchesCurriculum && matchesSearch;
  });

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

  return (
    <div>
      <Title level={2} className="my-4">
        Tạo Bài kiểm tra
      </Title>

      <Filters onFiltersChange={handleFiltersChange} />

      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredQuestions.length > 0 ? (
        <div>
          <Button
            type="primary"
            onClick={showModal}
            style={{ marginTop: "12px", marginBottom: "12px" }}
          >
            <PlusOutlined className="mr-2" />
            Thêm bài kiểm tra
          </Button>
          <div className="question-list">
            {filteredQuestions.map((question, index) => (
              <div
                key={question.questionId}
                className="mb-6 p-4 border rounded-lg"
              >
                <Title level={5}>
                  <input
                    type="checkbox"
                    onChange={() => handleSelectQuestion(question.questionId)}
                    checked={selectedQuestions.includes(question.questionId)}
                    className="mr-2"
                  />
                  Câu {index + 1}: {question.question}
                </Title>
                {/* Render answers with the showAnswers state */}
                {renderAnswers(question.answers)}
              </div>
            ))}
          </div>
          <Button
            type="primary"
            onClick={() => setShowAnswers(!showAnswers)}
            className="mb-4"
          >
            {showAnswers ? "Ẩn đáp án" : "Hiển thị đáp án"}
          </Button>
        </div>
      ) : (
        <p>Không có câu hỏi nào trong ngân hàng.</p>
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
