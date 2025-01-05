import React, { useState, useEffect } from "react";
import { Typography, Table, Button, Modal, message, Dropdown, Menu, Spin } from "antd";
import { fetchAllQuestions, deleteQuestion, IQuestion,PlumLevel,QuestionType  } from "@/data/academy-staff/QuestionBankData";
import { Link } from "react-router-dom";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import Filters from "@/pages/teacher/Exam/Filters";

const { Title } = Typography;

const QuestionBankManagementPage: React.FC = () => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: "",
    grade: "",
    curriculum: "",
    subject: "",
    chapter: "",
    lesson: "",
  });

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetchAllQuestions(0, 1000); // Tải tất cả câu hỏi với số lượng lớn
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
  }, []);

  const applyFilters = () => {
    const { searchTerm, grade, curriculum, subject, chapter, lesson } = filters;

    return questions.filter((question) => {
      const matchesSearchTerm =
        searchTerm === "" || question.question.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGrade = grade === "" || question.grade === grade;
      const matchesCurriculum = curriculum === "" || question.curriculum === curriculum;
      const matchesSubject = subject === "" || question.subject === subject;
      const matchesChapter = chapter === "" || question.chapterName === chapter;
      const matchesLesson = lesson === "" || question.lessonName === lesson;

      return matchesSearchTerm && matchesGrade && matchesCurriculum && matchesSubject && matchesChapter && matchesLesson;
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

  const menu = (record: IQuestion) => (
    <Menu>
      <Menu.Item key="1">
        <Button type="text" onClick={() => handleShowDetails(record)}>
          Chi tiết
        </Button>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to={`/academy-staff/question-banks/edit/${record.questionId}`}>
          <Button type="text">Chỉnh sửa</Button>
        </Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Button type="text" danger onClick={() => handleDelete(record.questionId)}>
          Xóa
        </Button>
      </Menu.Item>
    </Menu>
  );

  const handleShowDetails = (record: IQuestion) => {
    setSelectedQuestion(record);
    setIsDetailModalVisible(true);
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const columns = [
    {
      title: "Câu hỏi",
      dataIndex: "question",
      key: "question",
      width: 600,
    },
    {
      title: "Khối lớp",
      dataIndex: "grade",
      key: "grade",
    },
    {
      title: "Môn học",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Khung chương trình",
      dataIndex: "curriculum",
      key: "curriculum",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: IQuestion) => (
        <Dropdown overlay={menu(record)} trigger={["click"]}>
          <MoreOutlined className="cursor-pointer text-lg" />
        </Dropdown>
      ),
    },
  ];

  const handleCloseDetailModal = () => {
    setIsDetailModalVisible(false);
    setSelectedQuestion(null);
  };

  const filteredQuestions = applyFilters();

  const questionTypeMap: Record<QuestionType, string> = {
    "multiple choice": "Câu hỏi trắc nghiệm",
    "True/False": "Câu hỏi đúng sai",
    "Short Answer": "Câu tự luận ngắn",
  };
  
  const plumLevelMap: Record<PlumLevel, string> = {
    easy: "Dễ",
    medium: "Trung bình",
    hard: "Khó",
  };
  

  return (
    <div>
      <Title level={2} className="my-4">
        Quản lý Ngân hàng Câu hỏi
      </Title>
      <div
          className="mb-4 flex justify-between items-center"
          style={{
            alignItems: "center",
            marginBottom: "12px", // Giảm khoảng cách dưới để đẩy toàn bộ hàng lên
          }}
        >
          <Filters
            onFiltersChange={handleFiltersChange}
          />
          <Button
            type="primary"
            style={{
              marginLeft: "16px",
              height: "40px", // Chiều cao nút
              fontSize: "14px",
              padding: "0 20px", // Tăng padding ngang
              marginTop: "-12px", // Đẩy nút lên trên một chút
              display: "flex",
              alignItems: "center",
            }}
          >
            <Link to="/academy-staff/question-banks/add-new" className="flex items-center">
              <PlusOutlined className="mr-2" style={{ fontSize: "16px" }} />
              Thêm mới
            </Link>
          </Button>
        </div>

  {loading ? (
    <div className="flex justify-center items-center h-40">
      <Spin size="large" />
    </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredQuestions}
          rowKey={(record) => record.questionId}
          className="mt-4"
        />
      )}
          <Modal
            title="Chi tiết câu hỏi"
            visible={isDetailModalVisible}
            onCancel={handleCloseDetailModal}
            footer={null}
            width={800}
            bodyStyle={{ padding: "20px" }}
          >
            {selectedQuestion ? (
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 4fr",
                    gap: "4px",
                    lineHeight: "1.6",
                  }}
                >
                  <p><strong>Câu hỏi:</strong></p>
                  <p>{selectedQuestion.question}</p>

                  <p><strong>Loại câu hỏi:</strong></p>
                  <p>{questionTypeMap[selectedQuestion.type]}</p>

                  <p><strong>Độ khó (Plum):</strong></p>
                  <p>{plumLevelMap[selectedQuestion.plum]}</p>

                  <p><strong>Chương:</strong></p>
                  <p>{selectedQuestion.chapterName}</p>

                  <p><strong>Bài:</strong></p>
                  <p>{selectedQuestion.lessonName || "N/A"}</p>

                  <p><strong>Ngày chỉnh sửa:</strong></p>
                  <p>
                    {selectedQuestion.updatedAt
                      ? new Date(selectedQuestion.updatedAt).toLocaleDateString()
                      : "Chưa được chỉnh sửa"}
                  </p>
                </div>

                <p style={{ marginTop: "20px" }}><strong>Câu trả lời:</strong></p>
                <ol
                  type={selectedQuestion.type === "Short Answer" ? "1" : "A"}
                  style={{ paddingLeft: "20px", marginBottom: "10px" }}
                >
                  {selectedQuestion.answers.map((answer, index) => (
                    <li key={answer.answerId} style={{ marginBottom: "5px" }}>
                      {selectedQuestion.type === "Short Answer"
                        ? answer.answerText
                        : `${String.fromCharCode(65 + index)}. ${answer.answerText}`}
                    </li>
                  ))}
                </ol>

                {selectedQuestion.type !== "Short Answer" && (
                  <p>
                    <strong>Câu trả lời đúng:</strong>{" "}
                    {selectedQuestion.answers
                      .map((answer, index) => (answer.isCorrect ? String.fromCharCode(65 + index) : null))
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex justify-center items-center h-32">
                <Spin size="large" />
              </div>
            )}
          </Modal>
    </div>
  );
};

export default QuestionBankManagementPage;
