import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Card, Modal, message, Dropdown, Menu, Spin, Avatar, Radio, List } from 'antd';
import { FileOutlined, ShareAltOutlined, SearchOutlined, BlockOutlined, EllipsisOutlined, BookOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { getPlanbookByCollectionId, Planbook, unsavePlanbook, clonePlanbook } from '@/data/academy-staff/PlanbookData';
import { getCreatedPlanbookCollectionsByTeacherId, Collection, createPlanbookCollection } from "@/data/teacher/CollectionData";
import PlanbookDetailForm from '@/pages/academy-staff/PlanbookManagement/PlanbookDetailForm';
import { getUserId } from '@/data/apiClient';

const { Option } = Select;

const SavedPlanbookPage: React.FC = () => {
  const { id: collectionId } = useParams<{ id: string }>();
  const [planbooks, setPlanbooks] = useState<Planbook[]>([]);  // Khai báo kiểu Planbook[]
  const [selectedPlanbook, setSelectedPlanbook] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'recentUpdate'>('newest');
  const [isDetailVisible, setIsDetailVisible] = useState(false); // State để điều khiển hiển thị của modal
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isCloneModalVisible, setIsCloneModalVisible] = useState(false); // Hiển thị modal
  const [collections, setCollections] = useState<Collection[]>([]); // Danh sách collections
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [isCreatingNewCollection, setIsCreatingNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [loadingCollections, setLoadingCollections] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (collectionId) {
          const response = await getPlanbookByCollectionId(collectionId);
          setPlanbooks(response);
        }
      } catch (error) {
        console.error('Error fetching planbooks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [collectionId, isDeleteModalVisible]);

  const filteredPlanbooks = planbooks
    .filter((planbook) =>
      planbook.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortOrder === 'recentUpdate') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return 0;
    });

  const handleMenuClick = async (key: string, planbookId: string) => {
    setSelectedPlanbook(planbookId); // Lưu planbookId vào state
    switch (key) {
      case "detail":
        setSelectedPlanbook(planbookId); // Lưu ID Planbook được chọn
        setIsDetailVisible(true); // Mở Modal
        break;
      case "clone":
        handleCloneClick(planbookId);
        break;
      case "unsave":
        setIsDeleteModalVisible(true); // Hiển thị Modal xác nhận
        break;
      default:
        break;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPlanbook) {
      message.error("Không tìm thấy kế hoạch để xóa");
      return;
    }

    try {
      const response = await unsavePlanbook(collectionId!, selectedPlanbook);

      if (response) {
        message.success('Đã bỏ lưu');
      } else {
        message.error('Bỏ lưu thất bại');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setIsDeleteModalVisible(false); // Đóng Modal
    }
  };

  const handleCloneClick = async (planbookId: string) => {
    setIsCloneModalVisible(true); // Hiển thị modal
    setSelectedPlanbook(planbookId); // Lưu planbookId được chọn
    setLoadingCollections(true); // Hiển thị trạng thái loading
    try {
      // Gọi API để lấy danh sách collections
      const response = await getCreatedPlanbookCollectionsByTeacherId(getUserId()!);
      setCollections(response); // Lưu danh sách collections vào state
    } catch (error) {
      console.error("Lỗi khi lấy collections:", error);
    } finally {
      setLoadingCollections(false); // Tắt trạng thái loading
    }
  };

  const handleCloneToCollection = async (collectionId: string) => {
    if (!selectedPlanbook) {
      message.error("Vui lòng chọn bộ sưu tập để lưu Planbook!");
      return;
    }

    try {
      // Gọi API lưu Planbook vào Collection
      const response = await clonePlanbook(selectedPlanbook, collectionId);

      if (response) {
        message.success("Clone Planbook thành công!");
      } else {
        message.error("Clone Planbook thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi lưu Planbook:", error);
    } finally {
      setIsCloneModalVisible(false); // Ẩn modal
    }
  };

  const handleDone = async () => {
    // if (isCreatingNewCollection) {
    //   await handleSaveNewCollection();
    //   return;
    // }

    if (!selectedCollection) {
      message.error("Vui lòng chọn bộ sưu tập để clone Planbook!");
      return;
    }
    await handleCloneToCollection(selectedCollection);
    // setIsSaveModalVisible(false);
  };

  const handleSaveNewCollection = async () => {
    if (!newCollectionName.trim()) {
      message.error("Tên bộ sưu tập không được để trống!");
      return;
    }

    try {
      setLoadingCollections(true); // Hiển thị trạng thái loading
      const success = await createPlanbookCollection(newCollectionName, false, getUserId()!);

      if (success) {
        // Sau khi tạo bộ sưu tập mới, tải lại danh sách từ API
        const response = await getCreatedPlanbookCollectionsByTeacherId(getUserId()!);
        setCollections(response); // Cập nhật danh sách collections

        // Tự động chọn bộ sưu tập mới tạo (giả định API trả về bộ sưu tập mới nhất)
        const latestCollection = response.find(
          (collection) => collection.collectionName === newCollectionName
        );

        if (latestCollection) {
          setSelectedCollection(latestCollection.collectionId);
        }

        // Reset trạng thái
        setIsCreatingNewCollection(false);
        setNewCollectionName("");
      } else {
        message.error("Không thể tạo bộ sưu tập!");
      }
    } catch (error) {
      // console.error(error);
      message.error("Đã xảy ra lỗi khi tạo bộ sưu tập!");
    } finally {
      setLoadingCollections(false); // Ẩn trạng thái loading
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-center">Kế hoạch bài dạy đã lưu</h1>
      {/* Search and Sort - Unchanged */}
      <div className="flex justify-between mb-6 gap-2">
        <div className="flex justify-center">
          <div className="mb-4 w-[400px]">
            <Input
              type="text"
              placeholder="Tìm kiếm bài dạy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              suffix={<SearchOutlined />}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select
            defaultValue="newest"
            onChange={(value: 'newest' | 'oldest' | 'recentUpdate') => setSortOrder(value)}
            className="mb-4"
            style={{ width: 180 }}
          >
            <Option value="newest">Ngày tạo mới nhất</Option>
            <Option value="oldest">Ngày tạo cũ nhất</Option>
            <Option value="recentUpdate">Cập nhật gần nhất</Option>
          </Select>
          {/* <Button
            className="inline-flex items-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={showAddPlanbookModal}
          >
            Thêm bài dạy
          </Button> */}
        </div>
      </div>

      {/* Planbook Items with Moving Effect - Unchanged */}
      <div className="grid grid-cols-4 gap-12">
        {filteredPlanbooks.map(planbook => (
          <Card
            key={planbook.planbookId}
            className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-white rounded-lg overflow-hidden w-[240px] relative"
            hoverable
          >
            {/* Dropdown menu ở góc trên bên phải */}
            <Dropdown
              overlay={
                <Menu onClick={({ key }) => handleMenuClick(key, planbook.planbookId)}>
                  <Menu.Item key="detail" icon={<BlockOutlined />}>
                    Chi tiết
                  </Menu.Item>
                  <Menu.Item key="clone" icon={<EditOutlined />}>
                    Tạo bản sao
                  </Menu.Item>
                  <Menu.Item key="unsave" danger icon={<DeleteOutlined />}>
                    Bỏ lưu
                  </Menu.Item>
                </Menu>
              }
              trigger={['click']}
            >
              <Button
                shape="default"
                icon={<EllipsisOutlined />}
                className="absolute top-2 right-2 border-none"
              />
            </Dropdown>

            {/* Nội dung của card */}
            <div className="flex flex-col items-center text-center h-full">
              {/* Icon ở giữa card */}
              <Avatar
                shape="square"
                size={64}
                icon={<FileOutlined />}
                className="mb-3 bg-blue-100 text-blue-600"
              />

              {/* Tiêu đề */}
              <div className="h-[60px]">
                <h3 className="text-lg font-semibold text-gray-700 line-clamp-2">
                  {planbook.title.length > 40
                    ? `${planbook.title.slice(0, 40)}...`
                    : planbook.title}
                </h3>
              </div>

              {/* Thông tin chi tiết */}
              <div className="flex flex-grow justify-between items-center w-full text-gray-500 text-sm mt-4">
                <div className="flex items-center justify-start w-1/2">
                  <ShareAltOutlined className="mr-2" />
                  <span>{planbook.isPublic ? "Công khai" : "Riêng tư"}</span>
                </div>
                <div className="flex items-center justify-end w-1/2">
                  <BookOutlined className="mr-2" />
                  <span>
                    {planbook.lessonName.includes(':')
                      ? planbook.lessonName.split(':')[0]
                      : planbook.subject}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedPlanbook && (
        <PlanbookDetailForm planbookId={selectedPlanbook} isVisible={isDetailVisible} onClose={() => setIsDetailVisible(false)} isLibrary={true} />
      )}

      <Modal
        title="Xác nhận xóa"
        visible={isDeleteModalVisible}
        onOk={handleDeleteConfirm} // Thực hiện xóa khi người dùng nhấn "Đồng ý"
        onCancel={() => setIsDeleteModalVisible(false)} // Đóng Modal nếu người dùng hủy
        okText="Bỏ lưu"
        cancelText="Hủy"
        okButtonProps={{ danger: true }} // Nút Xóa màu đỏ
      >
        <p>Bạn có chắc muốn bỏ lưu kế hoạch bài dạy này khỏi bộ sưu tập không?</p>
      </Modal>

      <Modal
        className="text-center"
        title={<span style={{ fontSize: 18, fontWeight: "600" }}>Bộ sưu tập</span>}
        visible={isCloneModalVisible}
        onCancel={() => setIsCloneModalVisible(false)}
        footer={[
          isCreatingNewCollection ? (
            <Button key="create" type="primary" onClick={handleSaveNewCollection} loading={loadingCollections}>
              Tạo bộ sưu tập
            </Button>
          ) : (
            <Button key="done" type="primary" onClick={handleDone}>
              Tạo bản sao
            </Button>
          ),
        ]}
      // bodyStyle={{
      //   maxHeight: 400, // Giới hạn chiều cao tối đa
      //   overflowY: "auto", // Thêm thanh cuộn dọc khi nội dung quá dài
      //   padding: "16px",
      // }}
      >
        {loadingCollections ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Radio.Group
              onChange={(e) => setSelectedCollection(e.target.value)}
              value={selectedCollection}
              style={{ width: "100%" }}
            >
              <div
                style={{
                  maxHeight: 400, // Giới hạn chiều cao tối đa của danh sách
                  overflowY: "auto", // Thêm thanh cuộn dọc khi nội dung quá dài
                  border: "1px solid #f0f0f0", // Tùy chọn: Thêm viền để phân biệt rõ phần danh sách
                  borderRadius: 8, // Bo góc
                }}
              >
                <List
                  dataSource={collections}
                  renderItem={(collection) => (
                    <List.Item
                      key={collection.collectionId}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "12px 16px",
                        borderBottom: "1px solid #f0f0f0",
                        cursor: "pointer",
                        borderRadius: 8,
                        transition: "background-color 0.3s",
                      }}
                      onClick={() => setSelectedCollection(collection.collectionId)}
                    >
                      <Radio value={collection.collectionId} style={{ marginRight: 16 }} />
                      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                        {/* <Avatar
                  src={collection.avatar || "https://via.placeholder.com/48"}
                  size={48}
                  style={{ marginRight: 12 }}
                /> */}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 16 }}>{collection.collectionName}</div>
                          {/* <div style={{ fontSize: 12, color: "#888" }}>
                    {collection.contributorsCount} Contributors
                  </div> */}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </Radio.Group>
            {isCreatingNewCollection ? (
              <div style={{ display: "flex", alignItems: "center", marginTop: 16 }} className="gap-1">
                <Input
                  placeholder="Nhập tên bộ sưu tập"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                />
                <Button onClick={() => setIsCreatingNewCollection(false)}>Hủy</Button>
              </div>
            ) : (
              <Button
                type="dashed"
                block
                style={{
                  marginTop: 16,
                  height: 48,
                  fontWeight: 600,
                  fontSize: 16,
                  borderRadius: 8,
                }}
                onClick={() => setIsCreatingNewCollection(true)}
              >
                + Tạo bộ sưu tập mới
              </Button>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default SavedPlanbookPage;