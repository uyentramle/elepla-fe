import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Card, Modal, message, Dropdown, Menu, Spin, Avatar, Pagination } from 'antd';
import { FileOutlined, ShareAltOutlined, SearchOutlined, BlockOutlined, EllipsisOutlined, BookOutlined, EditOutlined, DeleteOutlined, PlusOutlined, BookFilled } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { getPlanbookByCollectionId, Planbook, deletePlanbookTemplate } from '@/data/academy-staff/PlanbookData';
import PlanbookDetailForm from '@/pages/academy-staff/PlanbookManagement/PlanbookDetailForm';
import UpdatePlanbookForm from '@/pages/academy-staff/PlanbookManagement/UpdatePlanbookForm';
import CreatePlanbookForm from '@/pages/academy-staff/PlanbookManagement/CreatePlanbookForm';

const { Option } = Select;

const PlanbookPage: React.FC = () => {
  const { id: collectionId } = useParams<{ id: string }>();
  const [planbooks, setPlanbooks] = useState<Planbook[]>([]);  // Khai báo kiểu Planbook[]
  const [selectedPlanbook, setSelectedPlanbook] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'recentUpdate'>('newest');
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false); // State để điều khiển hiển thị của modal
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'Public' | 'Private' | 'All'>('All');
  const [collectionExists, setCollectionExists] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const pageSize = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (collectionId) {
          const response = await getPlanbookByCollectionId(collectionId);
          setPlanbooks(response.items);
          setCollectionExists(response.collectionExists);
        }
      } catch (error) {
        console.error('Error fetching planbooks:', error);
        setCollectionExists(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [collectionId, isEditModalVisible, isCreateModalVisible, isDeleteModalVisible]);

  const filteredPlanbooks = planbooks.filter((planbook) => {
    const matchesSearch = planbook.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'All' ||
      (filterStatus === 'Public' && planbook.isPublic) ||
      (filterStatus === 'Private' && !planbook.isPublic);

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortOrder === 'recentUpdate') {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return 0;
  });

  const startIndex = (currentPage - 1) * pageSize;
  const currentPlanbooks = filteredPlanbooks.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOrder]);

  // Hàm xử lý thay đổi trang
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const handleMenuClick = async (key: string, planbookId: string) => {
    setSelectedPlanbook(planbookId); // Lưu ID Planbook được chọn vào state một lần

    switch (key) {
      case "detail":
        setIsDetailVisible(true); // Mở Modal chi tiết
        break;
      case "edit":
        setIsEditModalVisible(true); // Mở Modal chỉnh sửa
        break;
      case "delete":
        setIsDeleteModalVisible(true); // Hiển thị Modal xác nhận xóa
        break;
      default:
        break;
    }
  };

  const showAddPlanbookModal = () => {
    setIsCreateModalVisible(true);
  };

  const handleAddPlanbook = () => {
    setIsCreateModalVisible(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPlanbook) {
      message.error("Không tìm thấy kế hoạch để xóa");
      return;
    }

    try {
      const response = await deletePlanbookTemplate(selectedPlanbook);
      if (response) {
        message.success('Xóa kế hoạch bài dạy thành công');
      } else {
        message.error('Xóa kế hoạch bài dạy thất bại');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setIsDeleteModalVisible(false); // Đóng Modal
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
    <div>
      {collectionExists ? (
        <>
          <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-semibold mb-4 text-center">Kế hoạch bài dạy</h1>
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
                <Select
                  defaultValue="All"
                  onChange={(value: 'Public' | 'Private' | 'All') => setFilterStatus(value)}
                  className="mb-4"
                  style={{ width: 120 }}
                >
                  <Option value="All">Tất cả</Option>
                  <Option value="Public">Công khai</Option>
                  <Option value="Private">Riêng tư</Option>
                </Select>
                <Button
                  className="inline-flex items-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  onClick={showAddPlanbookModal}
                >
                  <PlusOutlined />
                  Thêm bài dạy
                </Button>
              </div>
            </div>

            {/* Planbook Items with Moving Effect - Unchanged */}
            {planbooks.length > 0 ? (
              <>
                <div className="grid grid-cols-4 gap-6">
                  {currentPlanbooks.map(planbook => (
                    <Card
                      key={planbook.planbookId}
                      className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-white rounded-lg overflow-hidden w-full relative"
                      hoverable
                    >
                      {/* Dropdown menu ở góc trên bên phải */}
                      <Dropdown
                        overlay={
                          <Menu onClick={({ key }) => handleMenuClick(key, planbook.planbookId)}>
                            <Menu.Item key="detail" icon={<BlockOutlined />}>
                              Chi tiết
                            </Menu.Item>
                            <Menu.Item key="edit" icon={<EditOutlined />}>
                              Chỉnh sửa
                            </Menu.Item>
                            <Menu.Item key="delete" danger icon={<DeleteOutlined />}>
                              Xóa
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
              </>
            ) : (
              <div className="flex flex-col justify-center items-center h-80">
                <BookFilled className="text-8xl text-gray-400 mb-6" />
                <div className="flex justify-center items-center">
                  <p className="text-lg text-gray-500">Bạn chưa có kế hoạch bài dạy nào</p>
                </div>
              </div>
            )}

            {/* Pagination */}
            {planbooks.length > pageSize && (
              <div className="flex justify-center mt-6">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredPlanbooks.length}
                  onChange={onPageChange}
                  showSizeChanger={false} // Tắt chức năng thay đổi số lượng item mỗi trang
                />
              </div>
            )}

            {selectedPlanbook && (
              <PlanbookDetailForm planbookId={selectedPlanbook} isVisible={isDetailVisible} onClose={() => setIsDetailVisible(false)} isLibrary={false} />
            )}

            {selectedPlanbook && (
              <UpdatePlanbookForm planbookId={selectedPlanbook} isVisible={isEditModalVisible} onClose={() => setIsEditModalVisible(false)} />
            )}

            {collectionId && (
              <CreatePlanbookForm collectionId={collectionId} isVisible={isCreateModalVisible} onClose={() => setIsCreateModalVisible(false)} onCreate={handleAddPlanbook} />
            )}

            <Modal
              title="Xác nhận xóa"
              visible={isDeleteModalVisible}
              onOk={handleDeleteConfirm} // Thực hiện xóa khi người dùng nhấn "Đồng ý"
              onCancel={() => setIsDeleteModalVisible(false)} // Đóng Modal nếu người dùng hủy
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }} // Nút Xóa màu đỏ
            >
              <p>Bạn có chắc muốn xóa kế hoạch bài dạy này không?</p>
            </Modal>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center bg-gray-100 text-center mt-10">
          <div className="bg-white shadow-md rounded-lg p-8">
            <h1 className="text-3xl font-bold text-red-500 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Không tìm thấy trang</h2>
            <p className="text-gray-600 mb-6">
              Có vẻ như bạn đã nhập một đường dẫn không đúng. Vui lòng kiểm tra lại URL hoặc quay lại trang chính.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanbookPage;