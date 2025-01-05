import React, { useEffect, useState } from "react";
import { getExamsByUserId, IExam, deleteExamById } from "@/data/client/ExamData";
import { Spin, Radio, List, Modal, Dropdown, Menu, message, Popconfirm, Input, Pagination } from "antd";
import { FileProtectOutlined, AppstoreOutlined, UnorderedListOutlined, MoreOutlined, EyeOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { RadioChangeEvent } from "antd/es/radio";
import ExamDetailPage from "./ExamDetailPage";
import UpdateExamPage from "./UpdateExamPage";

const ListExamPage: React.FC = () => {
  const [exams, setExams] = useState<IExam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filteredExams, setFilteredExams] = useState<IExam[]>([]);
  const [isExamDetailReload, setIsExamDetailReload] = useState<boolean>(false);


  const examsPerPage = 12;

  const fetchExams = async () => {
    setLoading(true);
    const data = await getExamsByUserId();
    if (data) {
      setExams(data);
      setFilteredExams(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    const filtered = exams.filter((exam) =>
      exam.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExams(filtered);
    setCurrentPage(1);
  }, [searchTerm, exams]);

  const handleViewModeChange = (e: RadioChangeEvent) => {
    setViewMode(e.target.value);
  };

  const handleShowDetail = (examId: string) => {
    setSelectedExamId(examId);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedExamId(null);
  };

  const handleShowEdit = (examId: string) => {
    setSelectedExamId(examId);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedExamId(null);
  };

  const handleDeleteExam = async (examId: string) => {
    try {
      const success = await deleteExamById(examId);
      if (success) {
        setExams((prevExams) => prevExams.filter((exam) => exam.id !== examId));
        message.success("Xóa bài kiểm tra thành công!");
      } else {
        message.error("Xóa bài kiểm tra thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi xóa bài kiểm tra.");
    }
  };

  const menu = (examId: string) => (
    <Menu>
      <Menu.Item key="detail" onClick={() => handleShowDetail(examId)}>
        <EyeOutlined /> Chi tiết
      </Menu.Item>
      <Menu.Item key="edit" onClick={() => handleShowEdit(examId)}>
        <AppstoreOutlined /> Chỉnh sửa
      </Menu.Item>
      <Menu.Item key="delete">
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa bài kiểm tra này?"
          onConfirm={() => handleDeleteExam(examId)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <DeleteOutlined /> Xóa
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  const currentExams = filteredExams.slice(
    (currentPage - 1) * examsPerPage,
    currentPage * examsPerPage
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">Bài kiểm tra của tôi</h1>
      <div className="flex justify-between items-center mb-6">
        <Radio.Group
          value={viewMode}
          onChange={handleViewModeChange}
          className="flex items-center gap-2"
        >
          <Radio.Button value="grid">
            <AppstoreOutlined /> Dạng lưới
          </Radio.Button>
          <Radio.Button value="list">
            <UnorderedListOutlined /> Dạng danh sách
          </Radio.Button>
        </Radio.Group>

        <Input
          placeholder="Tìm kiếm bài kiểm tra..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-72"
        />
      </div>

      {loading ? (
        <Spin size="large" />
      ) : filteredExams.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <FileProtectOutlined style={{ fontSize: "64px", color: "#ccc" }} />
          <p className="text-gray-500 mt-4">Hiện chưa có bài kiểm tra nào.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentExams.map((exam) => (
            <div
              key={exam.id}
              className="relative flex flex-col items-center p-4 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="absolute top-3 right-3">
                <Dropdown overlay={menu(exam.id)} trigger={["click"]}>
                  <MoreOutlined className="cursor-pointer" />
                </Dropdown>
              </div>
              <div className="bg-gray-100 w-24 h-24 flex items-center justify-center mb-4">
                <FileProtectOutlined style={{ fontSize: "64px", color: "#1890ff" }} />
              </div>
              <h3 className="text-lg font-semibold text-center">{exam.title}</h3>
              <p className="text-sm text-gray-600 text-center">{`Thời gian: ${exam.time || "Không xác định"}`}</p>
            </div>
          ))}
        </div>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={currentExams}
          renderItem={(exam) => (
            <List.Item key={exam.id} style={{ borderBottom: "1px solid #f0f0f0", padding: "12px 0" }}>
              <List.Item.Meta
                avatar={
                  <div className="bg-gray-100 w-16 h-16 flex items-center justify-center">
                    <FileProtectOutlined style={{ fontSize: "40px", color: "#1890ff" }} />
                  </div>
                }
                title={
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{exam.title}</span>
                    <Dropdown overlay={menu(exam.id)} trigger={["click"]}>
                      <MoreOutlined className="cursor-pointer" />
                    </Dropdown>
                  </div>
                }
                description={<span className="text-gray-600">{`Thời gian: ${exam.time || "Không xác định"}`}</span>}
              />
            </List.Item>
          )}
        />
      )}

          {filteredExams.length > examsPerPage && (
            <Pagination
              current={currentPage}
              pageSize={examsPerPage}
              total={filteredExams.length}
              onChange={(page) => setCurrentPage(page)}
              className="mt-6 text-center"
            />
          )}

            <Modal
              open={isDetailModalOpen}
              onCancel={() => {
                handleDetailModalClose();
                setIsExamDetailReload(false); // Reset trạng thái sau khi đóng popup
                console.log(isExamDetailReload);
              }}
              footer={null}
              width="50%"
              bodyStyle={{ 
                padding: "16px", // Giảm padding bên trong
                maxHeight: "90vh", // Chiều cao tối đa, có thể cuộn nếu nội dung vượt quá
                overflowY: "auto", // Bật cuộn dọc nếu cần
                background: "transparent" 
              }}
              style={{ 
                background: "transparent", 
                boxShadow: "none", 
                top: 20 // Điều chỉnh vị trí từ trên xuống, giúp modal không quá dài
              }}
              className="custom-modal-no-padding"
            >
              {selectedExamId && (
                <ExamDetailPage
                  examId={selectedExamId}
                  key={`${selectedExamId}-${Date.now()}`} // Tạo key mới mỗi khi modal mở lại
                />
              )}
            </Modal>

      <Modal
            visible={isEditModalOpen}
            onCancel={handleEditModalClose}
            footer={null}
            width="50%"
            bodyStyle={{ padding: 0, background: "transparent" }}
            style={{ background: "transparent", boxShadow: "none", top: 30}}
            className="custom-modal-no-padding"
          >
            {selectedExamId && (
              <UpdateExamPage
                examId={selectedExamId}
                onExamUpdated={() => {
                  handleEditModalClose();
                  setIsExamDetailReload(true); // Đặt trạng thái để reload ExamDetailPage
                  fetchExams();
                }}
              />
            )}
          </Modal>
    </div>
  );
};

export default ListExamPage;
