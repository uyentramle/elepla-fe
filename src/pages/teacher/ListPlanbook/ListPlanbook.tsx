import React, { useState } from 'react';
import { Input, Select, Button, Card } from 'antd';
import { FolderOpenOutlined, PlusCircleOutlined, UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons';
import collection_data from "@/data/teacher/PlanbookCollectionData";

const { Search } = Input;
const { Option } = Select;

const ListPlanbook: React.FC = () => {
  const [isGridView, setIsGridView] = useState(true);
  const [sortOrder, setSortOrder] = useState('newest'); 
  const [filteredData, setFilteredData] = useState(collection_data);

  // Sort items based on selected order
  const sortItems = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.createDay.getTime() - a.createDay.getTime(); // Sort by createDay descending
      } else if (sortOrder === 'updateNewest') {
        return b.updateDay.getTime() - a.updateDay.getTime(); // Sort by updateDay descending
      }
      return 0; // No sorting
    });
    setFilteredData(sortedData);
  };

  // Handle search input
  const handleSearch = (value: string) => {
    const searchData = collection_data.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(searchData);
  };

  // Update sort order
  const handleSortChange = (value: string) => {
    setSortOrder(value);
    sortItems();
  };

  // Toggle view
  const toggleView = () => setIsGridView(!isGridView);

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
          <Select 
            defaultValue="newest" 
            onChange={handleSortChange} 
            className="min-w-[180px] flex-grow-0"
          >
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
        {/* Add Collection Item */}
        <Card className="flex flex-col items-center justify-center text-lg font-semibold p-6 cursor-pointer border-dashed border-2 hover:bg-blue-50 transition-all h-32">
          <div className="flex flex-col items-center justify-center h-full">
            <PlusCircleOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
            <span className="mt-2 text-xs text-center">Thêm bộ sưu tập</span>
          </div>
        </Card>

        {/* Collection Items */}
        {filteredData.map(item => (
          <Card key={item.id} className="flex flex-col items-center justify-center p-6 border rounded-md shadow-md hover:shadow-lg transition-all h-32">
            <div className="flex flex-col items-center justify-center h-full">
              <FolderOpenOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
              <h2 className="text-sm font-semibold mt-2 text-center">{item.name}</h2>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ListPlanbook;
