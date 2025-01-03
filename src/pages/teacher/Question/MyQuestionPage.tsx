import React, { useState, useEffect } from "react"; 
import { Table, Button, Modal, message, Dropdown, Menu, Select, Input, Spin,Empty  } from "antd";
import { fetchQuestionsByUserId, deleteQuestion, IQuestion, PlumLevel,QuestionType } from "@/data/academy-staff/QuestionBankData";
import { getAllCurriculumFramework, IViewListCurriculum } from "@/data/admin/CurriculumFramworkData";
import { getAllSubject, IViewListSubject } from "@/data/admin/SubjectData";
import { getAllGrade, IViewListGrade } from "@/data/admin/GradeData";
import { Link } from "react-router-dom";
import { PlusOutlined, MoreOutlined, SearchOutlined } from "@ant-design/icons";
import { getUserId } from "@/data/apiClient";


const { Option } = Select;

const MyQuestionPage: React.FC = () => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [filterSubject, setFilterSubject] = useState<string>("");
  const [filterGrade, setFilterGrade] = useState<string>("");
  const [filterCurriculum, setFilterCurriculum] = useState<string>("");
  const [subjectOptions, setSubjectOptions] = useState<IViewListSubject[]>([]);
  const [gradeOptions, setGradeOptions] = useState<IViewListGrade[]>([]);
  const [curriculumOptions, setCurriculumOptions] = useState<IViewListCurriculum[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const pageSize = 10;

  const loadQuestions = async (pageIndex: number) => {
    try {
      setLoading(true);
      const userId = getUserId(); // Lấy userId
      if (!userId) {
        throw new Error("User ID không hợp lệ");
      }
  
      const response = await fetchQuestionsByUserId(userId, pageIndex - 1, pageSize);
      if (response.success) {
        setQuestions(response.data.items);
        setTotalItems(response.data.totalItemsCount);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    loadQuestions(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await getAllSubject();
        setSubjectOptions(response);
      } catch (error) {
        message.error("Không thể tải dữ liệu môn học, vui lòng thử lại sau");
      }
    };

    const fetchGrades = async () => {
      try {
        const response = await getAllGrade();
        setGradeOptions(response);
      } catch (error) {
        message.error("Không thể tải dữ liệu khối lớp, vui lòng thử lại sau");
      }
    };

    const fetchCurriculums = async () => {
      try {
        const response = await getAllCurriculumFramework();
        setCurriculumOptions(response);
      } catch (error) {
        message.error("Không thể tải dữ liệu khung chương trình, vui lòng thử lại sau");
      }
    };

    fetchSubjects();
    fetchGrades();
    fetchCurriculums();
  }, []);

  const filteredQuestions = questions.filter((question) => {
    const matchesSearchTerm = question.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !filterSubject || question.subject === filterSubject;
    const matchesGrade = !filterGrade || question.grade === filterGrade;
    const matchesCurriculum = !filterCurriculum || question.curriculum === filterCurriculum;
    return matchesSearchTerm && matchesSubject && matchesGrade && matchesCurriculum;
  });

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
            loadQuestions(currentPage);
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
        <Button type="text">
          <Link to={`/teacher/question-bank/my-question/edit/${record.questionId}`}>
            Sửa
          </Link>
        </Button>
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

    const questionTypeMap: Record<QuestionType, string> = {
      "multiple choice": "Câu hỏi trắc nghiệm",
      "True/False": "Câu hỏi đúng sai",
      "Short Answer": "Câu trả lời ngắn",
    };
    
    const plumLevelMap: Record<PlumLevel, string> = {
      easy: "Dễ",
      medium: "Trung bình",
      hard: "Khó",
    };
    

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4 text-center">Câu hỏi của tôi</h1>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-4">
          <Input
            placeholder="Tìm kiếm câu hỏi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined />}
          />
            <Select
            id="subject-filter"
            className="w-48 mr-2"
            value={filterSubject}
            onChange={(value) => setFilterSubject(value)}
            placeholder="Chọn môn học"
          >
            <Option value="">Tất cả môn học</Option>
            {subjectOptions.map((option) => (
              <Option key={option.name} value={option.name}>
                {option.name}
              </Option>
            ))}
          </Select>

          <Select
            id="grade-filter"
            className="w-48 mr-2"
            value={filterGrade}
            onChange={(value) => setFilterGrade(value)}
            placeholder="Chọn khối lớp"
          >
            <Option value="">Tất cả lớp</Option>
            {gradeOptions.map((option) => (
              <Option key={option.name} value={option.name}>
                {option.name}
              </Option>
            ))}
          </Select>

          <Select
            id="curriculum-filter"
            className="w-48 mr-2"
            value={filterCurriculum}
            onChange={(value) => setFilterCurriculum(value)}
            placeholder="Chọn khung chương trình"
          >
            <Option value="">Tất cả khung chương trình</Option>
            {curriculumOptions.map((option) => (
              <Option key={option.name} value={option.name}>
                {option.name}
              </Option>
            ))}
          </Select>
        </div>
        <Button type="primary">
          <Link to="/teacher/question-bank/create-question" className="flex items-center">
            <PlusOutlined className="mr-2" />
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
              pagination={{
                current: currentPage,
                pageSize,
                total: totalItems,
                onChange: handlePageChange,
              }}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE} // Hoặc Empty.PRESENTED_IMAGE_DEFAULT
                    description={<span>Không có câu hỏi nào trong danh sách.</span>}
                  />
                ),
              }}
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
              <ol type="A" style={{ paddingLeft: "20px", marginBottom: "10px" }}>
                {selectedQuestion.answers.map((answer, index) => (
                  <li key={answer.answerId} style={{ marginBottom: "5px" }}>
                    {String.fromCharCode(65 + index)}. {answer.answerText}
                  </li>
                ))}
              </ol>

              <p>
                <strong>Câu trả lời đúng:</strong>{" "}
                {selectedQuestion.answers
                  .map((answer, index) => (answer.isCorrect ? String.fromCharCode(65 + index) : null))
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          ) : (
            <div className="flex justify-center items-center h-32">
              <Spin size="large" />
            </div>
          )}
        </Modal>
    </div>
  );
}

export default MyQuestionPage
