import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Card, Modal, message, Dropdown , Menu, Spin } from 'antd';
import { FileOutlined, PlusCircleOutlined, UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
// import axios from 'axios';
import apiClient from "@/data/apiClient"; // Import your configured apiClient
import PlanbookContent from '@/layouts/teacher/PlanbookContent/PlanbookContent';
import CreateLesson from '@/layouts/teacher/Components/CreatePlanbook/CreateLesson';
import PlanbookForm from '@/layouts/teacher/Components/CreatePlanbook/PlanbookForm'



const { Search } = Input;
const { Option } = Select;

interface Planbook {
  planbookId: string;
  title: string;
  lessonName: string;
  createdAt: string;
  updatedAt: string | null;
  collectionId: string;
}

const ListPlanbook: React.FC = () => {
  const { id: collectionId } = useParams<{ id: string }>();
  
  const [isLessonModalVisible, setIsLessonModalVisible] = useState(false);
  const [isPlanbookModalVisible, setIsPlanbookModalVisible] = useState(false);
  const [lessonId, setLessonId] = useState<string | null>(null); // Lưu lessonId được chọn
  const [planbooks, setPlanbooks] = useState<Planbook[]>([]);  // Khai báo kiểu Planbook[]
  const [isGridView, setIsGridView] = useState(true);
  const [sortOrder, setSortOrder] = useState('createdAt');
  const [filteredPlanbooks, setFilteredPlanbooks] = useState<Planbook[]>([]); // Khai báo kiểu Planbook[]
  const [selectedPlanbook, setSelectedPlanbook] = useState(null);
  const [isTeachingPlanFormVisible, setIsTeachingPlanFormVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");


  useEffect(() => {
    const fetchPlanbooks = async () => {
      try {
        // const response = await axios.get('http://localhost/api/Planbook/GetPlanbookByCollectionId', {
          const response = await apiClient.get('https://elepla-be-production.up.railway.app/api/Planbook/GetPlanbookByCollectionId', {
          params: { collectionId },
        });
        console.log("Fetched Planbooks:", response.data.data.items); // Debug
        console.log("TeacherId: ", userId)
        setPlanbooks(response.data.data.items);
        setFilteredPlanbooks(response.data.data.items); // Đặt giá trị cho danh sách được lọc
      } catch (error) {
        console.error(error); // Debug lỗi
        message.error('Không thể tải danh sách kế hoạch bài dạy.');
      }finally {
        setLoading(false);
      }
    };
  
    fetchPlanbooks();
  }, [collectionId, sortOrder]);
  

  const fetchPlanbookById = async (planbookId: string) => {
    console.log("Fetching Planbook ID:", planbookId); // Kiểm tra ID được gửi đi
    // const response = await axios.get(`http://localhost/api/Planbook/GetPlanbookById?planbookId=${planbookId}`);
    const response = await apiClient.get(`https://elepla-be-production.up.railway.app/api/Planbook/GetPlanbookById?planbookId=${planbookId}`);
    if (response.data.success) {
      console.log("Fetched Planbook Data:", response.data.data); // Kiểm tra dữ liệu trả về
      setSelectedPlanbook(response.data.data);
      setIsTeachingPlanFormVisible(true);
    }
  };
  
  
  const handleSearch = (value: string) => {
    const searchData = filteredPlanbooks.filter(planbook =>
      planbook.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPlanbooks(searchData);
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
  };

  const handlePlanbookClick = (planbookId: string) => {
    console.log("Selected Planbook ID:", planbookId);
    fetchPlanbookById(planbookId); // Gửi ID đúng
  };

  const toggleView = () => setIsGridView(!isGridView);

  const handleAddPlanbook = () => {
    console.log("Opening LessonPlanner Modal"); // Debug
    setIsLessonModalVisible(true); // Open LessonPlanner modal
  };

  const handleCreatePlanbook = (selectedLessonId: string) => {
    console.log("Selected Lesson ID:", selectedLessonId); // Debug
    setLessonId(selectedLessonId); // Lưu lessonId
    setIsLessonModalVisible(false); // Đóng modal CreateLesson
    setIsPlanbookModalVisible(true); // Mở modal PlanbookForm
  };

  const handlePlanbookCreated = (): void => {
    // Đóng modal PlanbookForm
    setIsPlanbookModalVisible(false);
  
    // Gọi lại API để lấy danh sách planbook mới nhất
    const fetchPlanbooks = async () => {
      try {
        // const response = await axios.get('http://localhost/api/Planbook/GetPlanbookByCollectionId', {
          const response = await apiClient.get('https://elepla-be-production.up.railway.app/api/Planbook/GetPlanbookByCollectionId', {
          params: { collectionId },
        });
        setPlanbooks(response.data.data.items);
        setFilteredPlanbooks(response.data.data.items); // Cập nhật danh sách đã lọc
      } catch (error) {
        console.error(error);
        message.error('Không thể tải danh sách kế hoạch bài dạy.');
      }
    };
  
    fetchPlanbooks();
  };

    const renderMenu = (planbookId: string) => (
        <Menu>
          <Menu.Item
            key="delete"
            danger
            onClick={(e) => {
              e.domEvent.stopPropagation(); // Ngăn sự kiện lan truyền
              Modal.confirm({
                title: "Xác nhận xóa",
                content: "Bạn có chắc chắn muốn xóa kế hoạch bài dạy này?",
                okText: "Xóa",
                cancelText: "Hủy",
                okType: "danger",
                onOk: () => handleDeletePlanbook(planbookId), // Gọi hàm xóa với planbookId
              });
            }}
          >
            Xóa
          </Menu.Item>
        </Menu>
    );

      const handleDeletePlanbook = async (planbookId: string) => {
        try {
          const response = await apiClient.delete(
            `https://elepla-be-production.up.railway.app/api/Planbook/DeletePlanbook`,
            { params: { planbookId } }
          );
      
          if (response.data.success) {
            message.success("Xóa kế hoạch bài dạy thành công!");
      
            // Cập nhật danh sách sau khi xóa
            setPlanbooks((prevPlanbooks) =>
              prevPlanbooks.filter((planbook) => planbook.planbookId !== planbookId)
            );
            setFilteredPlanbooks((prevFiltered) =>
              prevFiltered.filter((planbook) => planbook.planbookId !== planbookId)
            );
          } else {
            message.error(response.data.message || "Xóa kế hoạch bài dạy thất bại.");
          }
        } catch (error) {
          console.error("Error deleting planbook:", error);
          message.error("Có lỗi xảy ra khi xóa kế hoạch bài dạy.");
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
      <h1 className="text-2xl font-semibold mb-4">Danh sách kế hoạch giảng dạy</h1>

      {/* Search and Sort - Unchanged */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center gap-4">
          <Search
            placeholder="Tìm kiếm kế hoạch bài dạy..."
            onSearch={handleSearch}
            enterButton
            className="w-full md:w-1/3"
          />
          <Select defaultValue="createdAt" onChange={handleSortChange} className="min-w-[180px] flex-grow-0">
            <Option value="createdAt">Ngày tạo mới nhất</Option>
            <Option value="updatedAt">Ngày cập nhật mới nhất</Option>
          </Select>
          <Button icon={isGridView ? <UnorderedListOutlined /> : <AppstoreOutlined />} onClick={toggleView}>
            {isGridView ? 'Danh sách' : 'Lưới'}
          </Button>
        </div>
      </div>

      {/* Planbook Items with Moving Effect - Unchanged */}
      <div className={isGridView ? 'grid grid-cols-4 gap-6' : 'flex flex-col gap-4'}>
        <Card
          className="flex flex-col items-center justify-center text-lg font-semibold p-6 cursor-pointer border-dashed border-2 hover:bg-blue-50 transition-all h-32 transform hover:scale-105 hover:translate-y-[-0.5rem]"
          onClick={handleAddPlanbook} // Trigger LessonPlanner modal on click
        >
          <div className="flex flex-col items-center justify-center h-full">
            <PlusCircleOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
            <span className="mt-2 text-xs text-center">Thêm kế hoạch bài dạy</span>
          </div>
        </Card>

        {filteredPlanbooks.map(planbook => (
          <Card
            key={planbook.planbookId}
            className="flex flex-col items-center justify-center p-6 border rounded-md shadow-md hover:shadow-lg transition-all h-32 transform hover:scale-105 hover:translate-y-[-0.5rem]"
            onClick={() => {
              console.log("Clicked Planbook ID:", planbook.planbookId); // Kiểm tra ID từ đây
              console.log(planbooks.length)
              handlePlanbookClick(planbook.planbookId);
            }}
              >
            <div className="flex flex-col items-center justify-center h-full">
              <FileOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
              <h2 className="text-sm font-semibold mt-2 text-center">
                    {planbook.lessonName.length > 20
                      ? `${planbook.lessonName.slice(0, 70)}...`
                      : planbook.lessonName}
                  </h2>              
              <Dropdown
                overlay={renderMenu(planbook.planbookId)} // Tạo menu cho từng planbook
                trigger={['click']}
              >
                <Button
                  type="text"
                  size="small"
                  className="absolute top-2 right-2"
                  onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click lan truyền lên Card
                  icon={<UnorderedListOutlined />}
                />
              </Dropdown>

            </div>
          </Card>
        ))}
      </div>


      <Modal
          title="Chi tiết kế hoạch bài dạy"
          visible={isTeachingPlanFormVisible}
          onCancel={() => setIsTeachingPlanFormVisible(false)}
          footer={null}
          width="80%"
        >
          {selectedPlanbook && userId && (
            <>
              {console.log("PlanbookData passed to PlanbookContent:", selectedPlanbook)}
              <PlanbookContent 
                planbookData={selectedPlanbook} 
                userId={userId} // Truyền userId vào đây
              />
            </>
          )}
        </Modal>

      {/* Modal for LessonPlanner */}
      <Modal
        title="Tạo kế hoạch giảng dạy"
        visible={isLessonModalVisible}
        onCancel={() => setIsLessonModalVisible(false)}
        footer={null}
      >
        <CreateLesson
          onSubmit={(selectedLessonId) => handleCreatePlanbook(selectedLessonId)} // Gọi khi chọn bài học
        />
      </Modal>

      <Modal
        title="Tạo kế hoạch giảng dạy"
        visible={isPlanbookModalVisible}
        onCancel={() => setIsPlanbookModalVisible(false)}
        footer={null}
        width="80%"
      >
        <PlanbookForm 
          lessonId={lessonId} 
          collectionId={collectionId} 
          onPlanbookCreated={handlePlanbookCreated} // Truyền đúng prop vào đây
        />
      </Modal>

    </div>
  );
};

export default ListPlanbook;