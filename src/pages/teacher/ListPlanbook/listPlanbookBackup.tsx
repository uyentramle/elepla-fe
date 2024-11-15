

// import React, { useState, useEffect } from 'react';
// import { Input, Select, Button, Card, Modal, Form } from 'antd';
// import { FileOutlined, PlusCircleOutlined, UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons';
// import { useParams } from 'react-router-dom';
// import planbookData from "@/data/teacher/PlanbookData";
// import TeachingPlanForm from "@/layouts/teacher/PlanbookContent/PlanbookContent"; // Import your TeachingPlanForm component

// const { Search } = Input;
// const { Option } = Select;

// const ListPlanbook: React.FC = () => {
//   const { id: collectionId } = useParams<{ id: string }>();
//   const [isGridView, setIsGridView] = useState(true);
//   const [sortOrder, setSortOrder] = useState('createdAt');
//   const [filteredPlanbooks, setFilteredPlanbooks] = useState(
//     planbookData.filter(planbook => planbook.collectionId === collectionId)
//   );

//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isTeachingPlanFormVisible, setIsTeachingPlanFormVisible] = useState(false);
//   const [form] = Form.useForm();

//   useEffect(() => {
//     sortItems();
//   }, [sortOrder, isGridView]);

//   const sortItems = () => {
//     const sortedData = [...filteredPlanbooks].sort((a, b) => {
//       if (sortOrder === 'createdAt') {
//         return b.createdAt.getTime() - a.createdAt.getTime();
//       } else if (sortOrder === 'updatedAt') {
//         return (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0);
//       }
//       return 0;
//     });
//     setFilteredPlanbooks(sortedData);
//   };

//   const handleSearch = (value: string) => {
//     const searchData = planbookData
//       .filter(planbook => planbook.collectionId === collectionId)
//       .filter(planbook => planbook.title.toLowerCase().includes(value.toLowerCase()));
//     setFilteredPlanbooks(searchData);
//   };

//   const handleSortChange = (value: string) => {
//     setSortOrder(value);
//     sortItems();
//   };

//   const toggleView = () => setIsGridView(!isGridView);

//   const handleAddPlanbook = () => setIsModalVisible(true);

//   const handleCancel = () => {
//     form.resetFields();
//     setIsModalVisible(false);
//   };

//   const handleCreate = () => {
//     form.validateFields().then(values => {
//       console.log("Planbook created with values:", values);
//       setIsModalVisible(false);
//       setIsTeachingPlanFormVisible(true); // Show TeachingPlanForm modal
//       form.resetFields();
//     }).catch(info => {
//       console.log("Validation failed:", info);
//     });
//   };

//   const handleTeachingPlanFormCancel = () => {
//     setIsTeachingPlanFormVisible(false);
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-2xl font-semibold mb-4">Danh sách kế hoạch giảng dạy</h1>

//       {/* Search and Sort */}
//       <div className="flex justify-end mb-6">
//         <div className="flex items-center gap-4">
//           <Search
//             placeholder="Tìm kiếm kế hoạch bài dạy..."
//             onSearch={handleSearch}
//             enterButton
//             className="w-full md:w-1/3"
//           />
//           <Select defaultValue="createdAt" onChange={handleSortChange} className="min-w-[180px] flex-grow-0">
//             <Option value="createdAt">Ngày tạo mới nhất</Option>
//             <Option value="updatedAt">Ngày cập nhật mới nhất</Option>
//           </Select>
//           <Button icon={isGridView ? <UnorderedListOutlined /> : <AppstoreOutlined />} onClick={toggleView}>
//             {isGridView ? 'Danh sách' : 'Lưới'}
//           </Button>
//         </div>
//       </div>

//       {/* Planbook Items with Moving Effect */}
//       <div className={isGridView ? 'grid grid-cols-4 gap-6' : 'flex flex-col gap-4'}>
//         <Card
//           className="flex flex-col items-center justify-center text-lg font-semibold p-6 cursor-pointer border-dashed border-2 hover:bg-blue-50 transition-all h-32 transform hover:scale-105 hover:translate-y-[-0.5rem]"
//           onClick={handleAddPlanbook}
//         >
//           <div className="flex flex-col items-center justify-center h-full">
//             <PlusCircleOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
//             <span className="mt-2 text-xs text-center">Thêm kế hoạch bài dạy</span>
//           </div>
//         </Card>

//         {filteredPlanbooks.map(planbook => (
//           <Card
//             key={planbook.planbookId}
//             className="flex flex-col items-center justify-center p-6 border rounded-md shadow-md hover:shadow-lg transition-all h-32 transform hover:scale-105 hover:translate-y-[-0.5rem]"
//           >
//             <div className="flex flex-col items-center justify-center h-full">
//               <FileOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
//               <h2 className="text-sm font-semibold mt-2 text-center">{planbook.title}</h2>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Modal for Adding New Planbook */}
//       <Modal
//         title="Tạo kế hoạch bài dạy mới"
//         visible={isModalVisible}
//         onCancel={handleCancel}
//         onOk={handleCreate}
//         okText="Tạo"
//         cancelText="Hủy"
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item name="class" label="Chọn lớp" rules={[{ required: true, message: 'Vui lòng chọn lớp' }]}>
//             <Select placeholder="Chọn lớp">
//               <Option value="10">10</Option>
//               <Option value="11">11</Option>
//               <Option value="12">12</Option>
//             </Select>
//           </Form.Item>
          
//           <Form.Item name="curriculum" label="Chọn khung chương trình" rules={[{ required: true, message: 'Vui lòng chọn khung chương trình' }]}>
//             <Select placeholder="Chọn khung chương trình">
//               <Option value="Chân trời sáng tạo">Chân trời sáng tạo</Option>
//               <Option value="Cánh diều">Cánh diều</Option>
//               <Option value="Kết nối tri thức">Kết nối tri thức</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item name="subject" label="Môn học" rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}>
//             <Select placeholder="Chọn môn học">
//               <Option value="Toán">Toán</Option>
//               <Option value="Văn">Văn</Option>
//               <Option value="Vật lý">Vật lý</Option>
//               <Option value="Hóa học">Hóa học</Option>
//               <Option value="Sinh học">Sinh học</Option>
//               <Option value="Lịch sử">Lịch sử</Option>
//               <Option value="Địa lý">Địa lý</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item name="chapter" label="Chương" rules={[{ required: true, message: 'Vui lòng chọn chương' }]}>
//             <Select placeholder="Chọn chương">
//               <Option value="Chương I">Chương I</Option>
//               <Option value="Chương II">Chương II</Option>
//               <Option value="Chương III">Chương III</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item name="lesson" label="Bài" rules={[{ required: true, message: 'Vui lòng chọn bài' }]}>
//             <Select placeholder="Chọn bài">
//               <Option value="Bài 1">Bài 1</Option>
//               <Option value="Bài 2">Bài 2</Option>
//               <Option value="Bài 3">Bài 3</Option>
//             </Select>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Larger Modal for TeachingPlanForm */}
//       <Modal
//         title="Teaching Plan Form"
//         visible={isTeachingPlanFormVisible}
//         onCancel={handleTeachingPlanFormCancel}
//         footer={null}
//         width="80%" // Adjusts modal size to 80% of the viewport width
//       >
//         <TeachingPlanForm /> {/* Render your TeachingPlanForm component */}
//       </Modal>
//     </div>
//   );
// };

// export default ListPlanbook;
