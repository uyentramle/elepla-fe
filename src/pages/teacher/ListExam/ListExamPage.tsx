import React, { useEffect, useState } from "react";
import { getExamsByUserId, IExam, deleteExamById } from "@/data/client/ExamData";
import { Spin, Radio, List, Modal, Dropdown, Menu, message, Popconfirm } from "antd";
import { FileProtectOutlined, AppstoreOutlined, UnorderedListOutlined, MoreOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { RadioChangeEvent } from "antd/es/radio";
import ExamDetailPage from "./ExamDetailPage";
import UpdateExamPage from "./UpdateExamPage";
import { getUserId } from "@/data/apiClient";

const ListExamPage: React.FC = () => {
  const [exams, setExams] = useState<IExam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const userId = getUserId();

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      const data = await getExamsByUserId();
      console.log("userId", userId);
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
          dataSource={exams}
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

      {/* Detail Modal */}
      <Modal
          visible={isDetailModalOpen}
          onCancel={handleDetailModalClose}
          footer={null}
          width="50%"
          className="custom-modal"
        >
          {selectedExamId && <ExamDetailPage examId={selectedExamId} />}
        </Modal>

      {/* Edit Modal */}
      <Modal
        visible={isEditModalOpen}
        onCancel={handleEditModalClose}
        footer={null}
        width="50%"
      >
        {selectedExamId && <UpdateExamPage examId={selectedExamId} />}
      </Modal>
    </div>
  );
};

export default ListExamPage;
