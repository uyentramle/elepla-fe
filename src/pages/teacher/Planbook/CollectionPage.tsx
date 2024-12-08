import React, { useState, useEffect } from 'react';
import { Dropdown, Menu, Input, Select, Button, Modal, Spin, Form, message } from 'antd';
import { FolderOpenOutlined, EditOutlined, DeleteOutlined, UnorderedListOutlined, AppstoreOutlined, EllipsisOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getCreatedPlanbookCollectionsByTeacherId, createPlanbookCollection, deletePlanbookCollection, updatePlanbookCollection, Collection } from '@/data/teacher/CollectionData';
import { getUserId } from '@/data/apiClient';

const { Option } = Select;

const CollectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'recentUpdate'>('newest');
  const [isGridView, setIsGridView] = useState(true);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCreatedPlanbookCollectionsByTeacherId(getUserId()!);
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isCreateModalVisible, isDeleteModalVisible, isEditModalVisible]);

  useEffect(() => {
    if (isCreateModalVisible) {
      form.resetFields(); // Reset form mỗi khi modal mở
    }
  }, [isCreateModalVisible, form]);


  const filteredCollections = collections
    .filter((collection) =>
      collection.collectionName.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleCreateCollection = async (collectionName: string) => {
    try {
      const response = await createPlanbookCollection(collectionName, false, getUserId()!);

      if (response) {
        setIsCreateModalVisible(false);
        message.success('Thêm bộ sưu tập thành công');
      } else {
        message.error('Tên bộ sưu tập đã tồn tại');
      }
    } catch (error) {
      console.error("Error creating collection:", error);
      message.error('Thêm bộ sưu tập thất bại');
    }
  }

  const handleDeleteCollection = async (collectionId: string) => {
    try {
      const response = await deletePlanbookCollection(collectionId, getUserId()!);
      if (response) {
        message.success('Xóa bộ sưu tập thành công');
      } else {
        message.error('Xóa bộ sưu tập thất bại');
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
      message.error('Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setIsDeleteModalVisible(false);
    }
  }

  const handleUpdateCollection = async (collectionId: string, collectionName: string) => {
    try {
      const response = await updatePlanbookCollection(collectionId, collectionName, getUserId()!);
      if (response) {
        setIsEditModalVisible(false);
        message.success('Cập nhật bộ sưu tập thành công');
      } else {
        message.error('Tên bộ sưu tập đã tồn tại');
      }
    } catch (error) {
      console.error("Error updating collection:", error);
      message.error('Có lỗi xảy ra, vui lòng thử lại sau');
    }
  }

  const handleItemClick = (collectionId: string) => {
    navigate(`/teacher/list-collection/${collectionId}`);
  };

  // Mở modal chỉnh sửa
  const openEditModal = (collectionId: string, currentName: string) => {
    setIsEditModalVisible(true); // Mở modal sửa
    setIsCreateModalVisible(false); // Đảm bảo modal tạo không mở
    form.setFieldsValue({ collectionId: collectionId, collectionName: currentName }); // Set giá trị hiện tại vào form
  };

  const handleMenuClick = (key: string, collectionId: string, currentName: string) => {
    switch (key) {
      case "edit":
        openEditModal(collectionId, currentName); // Mở modal sửa
        break;
      case "delete":
        setIsDeleteModalVisible(true); // Hiển thị Modal xác nhận
        setSelectedCollection(collectionId); // Lưu ID bộ sưu tập được chọn
        break;
      default:
        break;
    }
  };

  const toggleView = () => setIsGridView(!isGridView);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-center">Bộ sưu tập của tôi</h1>

      {/* Search and Sort */}
      <div className="flex justify-between mb-6">
        <div className="flex justify-center">
          <div className="mb-4 w-[400px]">
            <Input
              type="text"
              placeholder="Tìm kiếm bộ sưu tập..."
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
          <Button
            icon={isGridView ? <UnorderedListOutlined /> : <AppstoreOutlined />} onClick={toggleView}>
            {isGridView ? 'Danh sách' : 'Lưới'}
          </Button>
          <Button
            className="inline-flex items-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={() => setIsCreateModalVisible(true)}
          >
            <PlusOutlined />
            Thêm bộ sưu tập
          </Button>
        </div>
      </div>

      {/* Collection Items */}
      <div className={isGridView ? 'grid grid-cols-4 gap-6' : 'flex flex-col gap-4'}>
        {filteredCollections.map(item => (
          <div
            key={item.collectionId}
            className="relative group p-4 bg-gray-500 text-white rounded-lg shadow-md hover:shadow-xl transform hover:rotate-1 hover:scale-105 transition-all duration-300"
            onClick={() => handleItemClick(item.collectionId)}
          >
            {/* Background effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-100 to-blue-300 opacity-20 rounded-lg group-hover:opacity-30 transition-opacity duration-300"></div>

            {/* Icon */}
            <div className="relative z-10 flex flex-col items-center">
              <FolderOpenOutlined className="text-5xl text-white group-hover:text-blue-900 transition-colors duration-300" />
              <h2 className="mt-4 text-center text-lg group-hover:text-blue-900 font-semibold">{item.collectionName}</h2>
            </div>

            {/* Dropdown & Actions */}
            <div className="absolute top-3 right-5 z-10">
              <Dropdown
                overlay={
                  <Menu onClick={({ key, domEvent }) => {
                    domEvent.stopPropagation(); // Ngừng sự kiện lan truyền
                    handleMenuClick(key, item.collectionId, item.collectionName);
                  }}>
                    {/* Chức năng sửa */}
                    <Menu.Item key="edit" icon={<EditOutlined />}>
                      Sửa
                    </Menu.Item>

                    {/* Chức năng xóa */}
                    <Menu.Item key="delete" danger icon={<DeleteOutlined />}>
                      Xóa
                    </Menu.Item>
                  </Menu>
                }
                trigger={['click']}  // Dropdown sẽ hiển thị khi nhấn vào
                placement="bottomLeft"  // Đặt menu sổ xuống về phía bên trái
              >
                <EllipsisOutlined className="text-white hover:text-gray-300 text-xl cursor-pointer"
                  onClick={(e) => e.stopPropagation()}  // Ngừng sự kiện lan truyền
                />
              </Dropdown>

            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adding New Collection */}
      <Modal
        title={isEditModalVisible ? "Sửa tên bộ sưu tập" : "Tạo bộ sưu tập mới"}
        className="text-center"
        visible={isEditModalVisible || isCreateModalVisible}
        onCancel={() => { setIsCreateModalVisible(false); setIsEditModalVisible(false); }}
        onOk={form.submit} // Sử dụng form.submit để gửi dữ liệu
        okText={isEditModalVisible ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            if (isEditModalVisible) {
              // Nếu là sửa, gọi hàm cập nhật
              handleUpdateCollection(values.collectionId, values.collectionName);
            } else {
              // Nếu là tạo mới, gọi hàm tạo
              handleCreateCollection(values.collectionName);
            }
          }}
          initialValues={{
            collectionName: "", // Không cần dùng state, giá trị này sẽ được set từ `form.setFieldsValue`
          }}
        >
          {/* Trường ẩn cho collectionId */}
          <Form.Item name="collectionId" style={{ display: 'none' }}>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            name="collectionName"
            rules={[{ required: true, message: "Vui lòng nhập tên bộ sưu tập" }]}
          >
            <Input
              placeholder="Nhập tên bộ sưu tập"
              style={{ fontSize: '16px', borderRadius: '8px' }}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xác nhận xóa"
        visible={isDeleteModalVisible}
        onOk={() => selectedCollection && handleDeleteCollection(selectedCollection)} // Thực hiện xóa khi người dùng nhấn "Đồng ý"
        onCancel={() => setIsDeleteModalVisible(false)} // Đóng Modal nếu người dùng hủy
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }} // Nút Xóa màu đỏ
      >
        <p>Bạn có chắc muốn xóa bộ sưu tập này không?</p>
      </Modal>
    </div>
  );
};

export default CollectionPage;
