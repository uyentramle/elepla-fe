import React, { useState, useEffect } from "react";
import { Typography, Input, Button, Modal, Form, notification } from "antd";
import {
  fetchAllQuestions,
  fetchQuestionsByChapter,
  fetchQuestionsByLesson,
  IQuestion,
} from "@/data/academy-staff/QuestionBankData";
import { getUserId } from "@/data/apiClient"; // Import hàm getUserId
import FilterSection from "@/layouts/teacher/Components/FilterSection/FilterSection";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { createExam } from "@/data/client/ExamData";

const { Title } = Typography;

const ExamPage: React.FC = () => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [filters, setFilters] = useState<{ chapterId?: string; lessonId?: string }>({});
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [examTitle, setExamTitle] = useState("");
  const [examTime, setExamTime] = useState("");

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
      userId: getUserId() || "", // Thay thế bằng hàm getUserId
      questionIds: selectedQuestions,
    };

    const response = await createExam(examData);
    if (response) {
      notification.success({ message: "Tạo bài kiểm tra thành công!" });
      setIsModalVisible(false);
      setSelectedQuestions([]); // Reset danh sách câu hỏi
    } else {
      notification.error({ message: "Tạo bài kiểm tra thất bại!" });
    }
  };

  return (
    <div>
      <Title level={2} className="my-4">Tạo Bài kiểm tra</Title>
      <div className="mb-4 flex justify-between">
        <Input
          type="text"
          placeholder="Tìm kiếm..."
          suffix={<SearchOutlined />}
          className="mr-4"
        />
        <Button type="primary" onClick={showModal}>
          <PlusOutlined className="mr-2" />
          Thêm bài kiểm tra
        </Button>
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
            <Input value={examTitle} onChange={(e) => setExamTitle(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Thời gian làm bài (phút)"
            name="time"
            rules={[{ required: true, message: "Vui lòng nhập thời gian làm bài" }]}
          >
            <Input
              value={examTime}
              onChange={(e) => setExamTime(e.target.value)}
              placeholder="Ví dụ: 60"
            />
          </Form.Item>
          <Form.Item>
            <div className="flex justify-end">
              <Button type="default" onClick={handleCancel} className="mr-2">
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExamPage;
