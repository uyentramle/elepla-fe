import React, { useState, useEffect } from "react";
import { Modal, Spin, Select, Button, message } from "antd";
import { PlanbookDetail } from "@/api/ApiGetAllPlanbook";
import apiClient from "@/data/apiClient"; // Import your configured apiClient

const { Option } = Select;

interface PlanbookDetailModalProps {
  visible: boolean;
  loading: boolean;
  planbook: PlanbookDetail | null;
  onClose: () => void;
}

const PlanbookDetailModal: React.FC<PlanbookDetailModalProps> = ({
  visible,
  loading,
  planbook,
  onClose,
}) => {
  const [collections, setCollections] = useState<{ collectionId: string; collectionName: string }[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isFetchingCollections, setIsFetchingCollections] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      fetchCollections();
    }
  }, [visible]);

  const fetchCollections = async () => {
    const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
    if (!userId) {
      message.error("Không tìm thấy userId.");
      return;
    }

    setIsFetchingCollections(true);
    try {
      const response = await apiClient.get(
        `https://elepla-be-production.up.railway.app/api/PlanbookCollection/GetPlanbookCollectionsByTeacherId`,
        {
          params: {
            teacherId: userId,
            pageIndex: 0,
            pageSize: 10,
          },
        }
      );
      if (response.data.success) {
        setCollections(response.data.data.items);
      } else {
        message.error("Lấy danh sách bộ sưu tập thất bại.");
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
      message.error("Có lỗi xảy ra khi lấy danh sách bộ sưu tập.");
    } finally {
      setIsFetchingCollections(false);
    }
  };

  const handleAddToCollection = async () => {
    if (!selectedCollection || !planbook?.planbookId) {
      message.error("Vui lòng chọn bộ sưu tập hoặc dữ liệu giáo án không hợp lệ.");
      return;
    }

    setIsAdding(true);
    try {
        const response = await apiClient.post(
        "https://elepla-be-production.up.railway.app/api/Planbook/ClonePlanbook",
        {
          planbookId: planbook.planbookId,
          collectionId: selectedCollection,
        },
      );

      if (response.data.success) {
        message.success("Đã thêm giáo án vào bộ sưu tập thành công!");
        setSelectedCollection(null);
      } else {
        message.error(response.data.message || "Thêm vào bộ sưu tập thất bại.");
      }
    } catch (error) {
      console.error("Error adding to collection:", error);
      message.error("Có lỗi xảy ra khi thêm vào bộ sưu tập.");
    } finally {
      setIsAdding(false);
    }
  };
  return (
    <Modal
      title={planbook?.title || "Chi tiết giáo án"}
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
    >
      {loading ? (
        <div className="flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : planbook ? (
        <div>
          <p>
            <strong>Trường:</strong> {planbook.schoolName}
          </p>
          <p>
            <strong>Giáo viên:</strong> {planbook.teacherName}
          </p>
          <p>
            <strong>Môn học:</strong> {planbook.subject}
          </p>
          <p>
            <strong>Lớp:</strong> {planbook.className}
          </p>
          <p>
            <strong>Thời lượng:</strong> {planbook.durationInPeriods} tiết
          </p>
          <p>
            <strong>Mục tiêu kiến thức:</strong> {planbook.knowledgeObjective}
          </p>
          <p>
            <strong>Mục tiêu kỹ năng:</strong> {planbook.skillsObjective}
          </p>
          <p>
            <strong>Mục tiêu phẩm chất:</strong> {planbook.qualitiesObjective}
          </p>
          <p>
            <strong>Công cụ giảng dạy:</strong> {planbook.teachingTools}
          </p>
          <p>
            <strong>Ghi chú:</strong> {planbook.notes}
          </p>
          <p>
            <strong>Hoạt động:</strong>
          </p>
          <ul>
            {planbook.activities.map((activity) => (
              <li key={activity.activityId}>
                <strong>{activity.title}</strong>: {activity.content}
              </li>
            ))}
          </ul>

          {/* Thêm vào bộ sưu tập */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Thêm vào bộ sưu tập</h3>
            <Select
              placeholder="Chọn bộ sưu tập"
              style={{ width: "100%" }}
              onChange={(value) => setSelectedCollection(value)}
              disabled={isAdding || isFetchingCollections}
            >
              {collections.map((collection) => (
                <Option key={collection.collectionId} value={collection.collectionId}>
                  {collection.collectionName}
                </Option>
              ))}
            </Select>
            <Button
              type="primary"
              className="mt-4"
              onClick={handleAddToCollection}
              loading={isAdding}
              disabled={!selectedCollection || isAdding}
            >
              Thêm vào
            </Button>
          </div>
        </div>
      ) : (
        <p>Không thể tải dữ liệu giáo án.</p>
      )}
    </Modal>
  );
};

export default PlanbookDetailModal;