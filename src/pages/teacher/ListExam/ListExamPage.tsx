import React, { useEffect, useState } from "react";
import { getExamsByUserId, IExam, deleteExamById } from "@/data/client/ExamData";
import { Spin, Radio, List, Modal, Dropdown, Menu, message } from "antd";
import { FileProtectOutlined, AppstoreOutlined, UnorderedListOutlined, MoreOutlined } from "@ant-design/icons";
import { RadioChangeEvent } from "antd/es/radio";
import ExamDetailPage from "./ExamDetailPage"; // Import ExamPage

const ListExamPage: React.FC = () => {
  const [exams, setExams] = useState<IExam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false); // State quản lý Modal
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null); // Lưu examId

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      const data = await getExamsByUserId(); // API lấy danh sách bài kiểm tra
      if (data) {
        setExams(data);
      }
      setLoading(false);
    };

    fetchExams();
  }, []);

  const handleViewModeChange = (e: RadioChangeEvent) => {
    setViewMode(e.target.value);
  };

  const handleItemClick = (examId: string) => {
    setSelectedExamId(examId); // Lưu examId được chọn
    setIsModalOpen(true); // Mở Modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Đóng Modal
    setSelectedExamId(null); // Reset examId
  };

  const handleDeleteExam = async (examId: string) => {
    console.log("Bắt đầu xóa bài kiểm tra:", examId); // Log id của bài kiểm tra
  
    try {
      const success = await deleteExamById(examId);
      console.log("Kết quả xóa bài kiểm tra:", success); // Log kết quả trả về từ API
  
      if (success) {
        setExams((prevExams) => {
          const updatedExams = prevExams.filter((exam) => exam.id !== examId);
          console.log("Danh sách bài kiểm tra sau khi xóa:", updatedExams); // Log danh sách sau khi xóa
          return updatedExams;
        });
        message.success("Xóa bài kiểm tra thành công!");
      } else {
        message.error("Xóa bài kiểm tra thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa bài kiểm tra:", error); // Log lỗi nếu xảy ra
      message.error("Đã xảy ra lỗi khi xóa bài kiểm tra.");
    }
  };
  
  const menu = (examId: string) => (
    <Menu>
      <Menu.Item key="delete" onClick={() => handleDeleteExam(examId)}>
        Xóa
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách bài kiểm tra</h1>
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
      </div>

      {/* Content */}
      {loading ? (
        <Spin size="large" />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="relative flex flex-col items-center p-4 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => handleItemClick(exam.id)} // Thêm sự kiện click
            >
                <Dropdown overlay={menu(exam.id)} trigger={["click"]}>
                  <div onClick={(e) => e.stopPropagation()} className="absolute top-3 right-3 cursor-pointer">
                    <MoreOutlined />
                  </div>
                </Dropdown>
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
          dataSource={exams}
          renderItem={(exam) => (
        <List.Item
          key={exam.id}
          style={{
            borderBottom: "1px solid #f0f0f0",
            padding: "12px 0",
          }}
          onClick={() => handleItemClick(exam.id)}
        >
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

      {/* Modal */}
      <Modal
      title={null} // Xóa tiêu đề
      visible={isModalOpen}
      onCancel={handleModalClose}
      footer={null} // Không có footer
      width="80%" // Đặt kích thước
      closable={false} // Ẩn nút đóng
    >
        {selectedExamId && (
          <ExamDetailPage 
            examId={selectedExamId} 
          />
        )}
    </Modal>
    </div>
  );
};

export default ListExamPage;
