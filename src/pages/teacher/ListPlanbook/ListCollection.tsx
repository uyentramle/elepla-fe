import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Card, Modal } from 'antd';
import { FolderOpenOutlined, PlusCircleOutlined, UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import collection_data, { CollectionItem } from "@/data/teacher/PlanbookCollectionData";

const { Search } = Input;
const { Option } = Select;

const fetchCollectionData = async (): Promise<CollectionItem[]> => {
  // Here, you will replace this with an API call when the backend is ready
  return collection_data;
};

const ListCollection: React.FC = () => {
  const [isGridView, setIsGridView] = useState(true);
  const [sortOrder, setSortOrder] = useState('newest');
  const [filteredData, setFilteredData] = useState<CollectionItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCollectionTitle, setNewCollectionTitle] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCollectionData();
      setFilteredData(data);
    };
    loadData();
  }, []);

  const handleItemClick = (collectionId: string) => {
    navigate(`/teacher/list-collection/list-planbook/${collectionId}`); // Navigate to the ListPlanbook page
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

  const toggleView = () => setIsGridView(!isGridView);

  const handleAddCollection = () => {
    if (newCollectionTitle.trim()) {
      const newCollection: CollectionItem = {
        collectionId: String(filteredData.length + 1),
        name: newCollectionTitle,
        createDay: new Date(),
        updateDay: new Date(),
      };
      setFilteredData([...filteredData, newCollection]);
      setNewCollectionTitle('');
      setIsModalVisible(false);
    }
  };

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
          <Card key={item.collectionId} className="flex flex-col items-center justify-center p-6 border rounded-md shadow-md hover:shadow-lg transition-all h-32"
                onClick={() => handleItemClick(item.collectionId)} // Handle click to navigate
          >
            <div className="flex flex-col items-center justify-center h-full">
            <FolderOpenOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
            <h2 className="text-sm font-semibold mt-2 text-center">{item.name}</h2>
            </div>
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
    </div>
  );
};

export default ListCollection;
