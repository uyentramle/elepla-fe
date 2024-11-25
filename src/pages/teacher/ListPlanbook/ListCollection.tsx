import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import { Dropdown,Menu, Input, Select, Button, Card, Modal,Spin } from 'antd';
import { FolderOpenOutlined, PlusCircleOutlined, UnorderedListOutlined, AppstoreOutlined, EllipsisOutlined  } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { CollectionItem } from "@/data/teacher/PlanbookCollectionData";
import fetchCollections from '@/api/ApiCollectionItem ';
import { jwtDecode } from 'jwt-decode';
import apiClient from "@/data/apiClient"; // Import your configured apiClient


const { Search } = Input;
const { Option } = Select;

const ListCollection: React.FC = () => {
  const [isGridView, setIsGridView] = useState(true);
  const [sortOrder, setSortOrder] = useState('newest');
  const [filteredData, setFilteredData] = useState<CollectionItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCollectionTitle, setNewCollectionTitle] = useState('');
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingCollectionName, setEditingCollectionName] = useState<string>('');
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Helper to retrieve teacherId from token
  const getTeacherIdFromToken = (): string | null => {
    const token = localStorage.getItem('accessToken');
    if (token) {
    const decodedToken = jwtDecode<{ userId?: string }>(token);
      return decodedToken.userId || null;
    }
    return null;
  };

  // Load collections on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCollections();

        setFilteredData(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleItemClick = (collectionId: string) => {
    navigate(`/teacher/list-collection/list-planbook/${collectionId}`);
  };

// Mở modal chỉnh sửa
const openEditModal = (collectionId: string, currentName: string) => {
  setEditingCollectionId(collectionId);
  setEditingCollectionName(currentName);
  setEditModalVisible(true);
};

// Đóng modal chỉnh sửa
const closeEditModal = () => {
  setEditModalVisible(false);
  setEditingCollectionId(null);
  setEditingCollectionName('');
};

// Lưu tên mới sau khi chỉnh sửa
const handleSaveNewName = async (newName: string) => {
  if (editingCollectionId && newName.trim()) {
    await handleEditCollection(editingCollectionId, newName); // Gọi hàm cập nhật API
    closeEditModal(); // Đóng modal sau khi lưu
  }
};

  const sortItems = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.createDay.getTime() - a.createDay.getTime();
      } else if (sortOrder === 'updateNewest') {
        return b.updateDay.getTime() - a.updateDay.getTime();
      }
      return 0;
    });
    setFilteredData(sortedData);
  };

  const handleSearch = (value: string) => {
    const searchData = filteredData.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(searchData);
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    sortItems();
  };


  const renderMenu = (collectionId: string, currentName: string) => (
    <Menu>
      {/* Chức năng sửa */}
      <Menu.Item
        key="edit"
        onClick={(e) => {
          e.domEvent.stopPropagation(); // Ngăn sự kiện lan truyền
          openEditModal(collectionId, currentName); // Mở modal sửa với ID và tên hiện tại
        }}
      >
        Sửa
      </Menu.Item>
  
      {/* Chức năng xóa */}
      <Menu.Item
        key="delete"
        danger
        onClick={(e) => {
          e.domEvent.stopPropagation(); // Ngăn sự kiện lan truyền
          handleDeleteCollection(collectionId); // Gọi hàm xóa
        }}
      >
        Xóa
      </Menu.Item>
    </Menu>
  );
  

  const toggleView = () => setIsGridView(!isGridView);

  // Create new collection by calling the API
  const handleAddCollection = async () => {
    const teacherId = getTeacherIdFromToken();
    if (newCollectionTitle.trim() && teacherId) {
      try {
        const newCollection = {
          collectionName: newCollectionTitle,
          isSaved: true,
          teacherId: teacherId,
        };

        // Send POST request to API
        // const response = await axios.post('http://localhost/api/PlanbookCollection/CreatePlanbookCollection', newCollection); // api local
        const response = await apiClient.post('https://elepla-be-production.up.railway.app/api/PlanbookCollection/CreatePlanbookCollection', newCollection); // api server

        // Optionally, add the new collection to the displayed list if creation was successful
        if (response.data && response.data.success) {
          setFilteredData([...filteredData, {
            collectionId: response.data.collectionId,
            name: newCollectionTitle,
            createDay: new Date(),
            updateDay: new Date(),
          }]);
          setNewCollectionTitle('');
          setIsModalVisible(false);
        }
      } catch (error) {
        console.error("Error creating new collection:", error);
      }
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    try {
      const teacherId = getTeacherIdFromToken();
      if (!teacherId) {
        console.error("Teacher ID not found in token.");
        return;
      }
      const response = await apiClient.delete(
        `https://elepla-be-production.up.railway.app/api/PlanbookCollection/DeletePlanbookCollection?collectionId=${collectionId}&teacherId=${teacherId}`
      );
  
      if (response.data && response.data.success) {
        // Xóa thành công, cập nhật danh sách
        setFilteredData((prevData) =>
          prevData.filter((item) => item.collectionId !== collectionId)
        );
        console.log("Collection deleted successfully.");
      } else {
        console.error("Failed to delete collection:", response.data?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error occurred while deleting collection:", error);
    }
  };

  const handleEditCollection = async (collectionId: string, newCollectionName: string) => {
    try {
      const teacherId = getTeacherIdFromToken();
      if (!teacherId) {
        console.error("Teacher ID not found in token.");
        return;
      }
  
      const response = await apiClient.put(
        "https://elepla-be-production.up.railway.app/api/PlanbookCollection/UpdatePlanbookCollection",
        {
          collectionId,
          teacherId,
          collectionName: newCollectionName, // Cập nhật tên mới
        }
      );
  
      if (response.data && response.data.success) {
        // Cập nhật danh sách hiện tại
        setFilteredData((prevData) =>
          prevData.map((item) =>
            item.collectionId === collectionId
              ? { ...item, name: newCollectionName } // Chỉ cập nhật tên
              : item
          )
        );
        console.log("Collection updated successfully.");
      } else {
        console.error("Failed to update collection:", response.data?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error occurred while updating collection:", error);
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
      <h1 className="text-2xl font-semibold mb-4">Bộ sưu tập của tôi</h1>

      {/* Search and Sort */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center gap-4">
          <Search
            placeholder="Tìm kiếm bộ sưu tập..."
            onSearch={handleSearch}
            enterButton
            className="w-full md:w-1/3"
          />
          <Select defaultValue="newest" onChange={handleSortChange} className="min-w-[180px] flex-grow-0">
            <Option value="newest">Ngày tạo mới nhất</Option>
            <Option value="updateNewest">Ngày cập nhật mới nhất</Option>
          </Select>
          <Button icon={isGridView ? <UnorderedListOutlined /> : <AppstoreOutlined />} onClick={toggleView}>
            {isGridView ? 'Danh sách' : 'Lưới'}
          </Button>
        </div>
      </div>

      {/* Collection Items */}
      <div className={isGridView ? 'grid grid-cols-4 gap-6' : 'flex flex-col gap-4'}>
        <Card
          className="flex flex-col items-center justify-center text-lg font-semibold p-6 cursor-pointer border-dashed border-2 hover:bg-blue-50 transition-all h-32"
          onClick={() => setIsModalVisible(true)}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <PlusCircleOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
            <span className="mt-2 text-xs text-center">Thêm bộ sưu tập</span>
          </div>
        </Card>
        {filteredData.map(item => (
          <Card
            key={item.collectionId}
            className="flex flex-col items-center justify-center p-6 border rounded-md shadow-md hover:shadow-lg transition-all h-32 relative"
            onClick={() => handleItemClick(item.collectionId)} // Sự kiện click của Card
        >
            <div className="flex flex-col items-center justify-center h-full">
              <FolderOpenOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
              <h2 className="text-sm font-semibold mt-2 text-center">{item.name}</h2>
            </div>
            {/* Dropdown */}
            <Dropdown
                overlay={renderMenu(item.collectionId, item.name)}
                trigger={['click']}
                placement="bottomRight"
              >
                <EllipsisOutlined
                  className="absolute top-2 right-2 text-lg cursor-pointer"
                  onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện click lan truyền
                />
              </Dropdown>
          </Card>
        ))}
      </div>

      {/* Modal for Adding New Collection */}
      <Modal
        title="Tạo bộ sưu tập mới"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleAddCollection}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Input
          placeholder="Nhập tên bộ sưu tập"
          value={newCollectionTitle}
          onChange={(e) => setNewCollectionTitle(e.target.value)}
        />
      </Modal>

      <Modal
          title="Sửa tên bộ sưu tập"
          visible={isEditModalVisible}
          onOk={() => handleSaveNewName(editingCollectionName)} // Lưu tên mới
          onCancel={closeEditModal} // Đóng modal
          okText="Lưu"
          cancelText="Hủy"
        >
          <Input
            placeholder="Nhập tên mới"
            value={editingCollectionName}
            onChange={(e) => setEditingCollectionName(e.target.value)} // Cập nhật tên trong input
          />
        </Modal>

    </div>
  );
};

export default ListCollection;
