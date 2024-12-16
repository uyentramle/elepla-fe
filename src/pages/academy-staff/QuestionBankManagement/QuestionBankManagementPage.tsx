import React, { useState, useEffect } from "react";
import { Typography, Input, Button, Modal, message, Dropdown, Menu } from "antd";
import {
  fetchAllQuestions,
  fetchQuestionsByChapter,
  fetchQuestionsByLesson,
  deleteQuestion,
  IQuestion,
} from "@/data/academy-staff/QuestionBankData";
import FilterSection from "@/layouts/teacher/Components/FilterSection/FilterSection";
import { Link } from "react-router-dom";
import { PlusOutlined, SearchOutlined, MoreOutlined } from "@ant-design/icons";

const { Title } = Typography;

const QuestionBankManagementPage: React.FC = () => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [filters, setFilters] = useState<{ chapterId?: string; lessonId?: string }>({});

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

  const handleDelete = async (questionId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa câu hỏi này không?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          const response = await deleteQuestion(questionId);
          if (response.success) {
            message.success("Xóa câu hỏi thành công.");
            loadQuestions();
          } else {
            message.error(response.message || "Xóa câu hỏi thất bại.");
          }
        } catch (error) {
          message.error("Lỗi xảy ra khi xóa câu hỏi.");
        }
      },
    });
  };

  const menu = (questionId: string) => (
    <Menu>
      <Menu.Item key="edit">
        <Button type="text" onClick={() => message.info("Chức năng chỉnh sửa sẽ được phát triển sau.")}>
          Chỉnh sửa
        </Button>
      </Menu.Item>
      <Menu.Item key="delete">
        <Button type="text" danger onClick={() => handleDelete(questionId)}>
          Xóa
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Title level={2} className="my-4">Quản lý Ngân hàng Câu hỏi</Title>
      <div className="mb-4 flex justify-between">
        <Input
          type="text"
          placeholder="Tìm kiếm..."
          suffix={<SearchOutlined />}
          className="mr-4"
        />
        <Button type="primary">
          <Link to="/academy-staff/question-banks/add-new" className="flex items-center">
            <PlusOutlined className="mr-2" />
            Thêm mới
          </Link>
        </Button>
      </div>

      <FilterSection onFilterChange={handleFilterChange} />

      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p>{error}</p>
      ) : questions.length > 0 ? (
        <div>
          <Button type="primary" onClick={() => setShowAnswers(!showAnswers)} className="mb-4">
            {showAnswers ? "Ẩn đáp án" : "Hiển thị đáp án"}
          </Button>
          <div className="question-list">
            {questions.map((question, index) => (
              <div key={question.questionId} className="mb-6 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <Title level={5}>
                    Câu {index + 1}: {question.question}
                  </Title>
                  <Dropdown overlay={menu(question.questionId)} trigger={['click']}>
                    <MoreOutlined className="cursor-pointer text-lg" />
                  </Dropdown>
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
    </div>
  );
};

export default QuestionBankManagementPage;
