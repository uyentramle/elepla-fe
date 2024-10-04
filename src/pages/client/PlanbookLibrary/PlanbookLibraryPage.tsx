import React, { useState } from 'react';
import { Select, Card, Rate, Button, Avatar } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { lessonPlans } from '../../../data/client/LessonPlanData'; // Import from the new file

const { Option } = Select;

const PlanbookLibraryPage: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<string | undefined>(undefined);
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(undefined);

  const handleGradeChange = (value: string) => {
    setSelectedGrade(value);
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
  };

  const toggleFavorite = (id: number) => {
    const updatedPlans = lessonPlans.map((plan) =>
      plan.id === id ? { ...plan, isFavorite: !plan.isFavorite } : plan
    );
    console.log('Updated lesson plans:', updatedPlans); 
  };

  return (
    <div className="p-4">
      {/* Bộ lọc khối lớp và môn học */}
      <div className="flex space-x-4 mb-6">
        <Select
          placeholder="Chọn khối lớp"
          onChange={handleGradeChange}
          className="w-40"
          value={selectedGrade}
        >
          <Option value="10">Lớp 10</Option>
          <Option value="11">Lớp 11</Option>
          <Option value="12">Lớp 12</Option>
        </Select>

        <Select
          placeholder="Chọn môn học"
          onChange={handleSubjectChange}
          className="w-40"
          value={selectedSubject}
        >
          <Option value="Toán">Toán</Option>
          <Option value="Ngữ Văn">Ngữ Văn</Option>
          <Option value="Hóa Học">Hóa Học</Option>
          <Option value="Vật Lý">Vật Lý</Option>
          <Option value="Sinh Học">Sinh Học</Option>
          <Option value="Địa Lý">Địa Lý</Option>
        </Select>
      </div>

      {/* Danh sách giáo án */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {lessonPlans
          .filter(
            (plan) =>
              (!selectedGrade || plan.grade === selectedGrade) &&
              (!selectedSubject || plan.subject === selectedSubject)
          )
          .map((plan) => (
            <Card
              key={plan.id}
              className="p-2 shadow-lg hover:shadow-2xl transition-shadow transform hover:scale-105 duration-300"
              cover={<img alt={plan.title} src="https://chantroisangtao.vn/wp-content/uploads/2024/01/Toan-12-T1-BIT.png" className="h-32 object-cover" />}
            >
              {/* Move the title below the image */}
              <Card.Meta title={plan.title} className="mt-4" />

              {/* Rating below title */}
              <Rate allowHalf disabled defaultValue={plan.rating} className="mt-2" />

              {/* Author and Favorite button at the bottom */}
              <div className="flex items-center justify-between mt-4">
                {/* Author */}
                <div className="flex items-center">
                  <Avatar src={plan.avatar} className="mr-2" />
                  <p className="text-gray-700">{plan.author}</p>
                </div>

                {/* Favorite Button */}
                <Button
                  type="link"
                  icon={plan.isFavorite ? <HeartFilled /> : <HeartOutlined />}
                  onClick={() => toggleFavorite(plan.id)}
                  style={{ fontSize: '16px', color: plan.isFavorite ? 'red' : 'black' }}
                  title={plan.isFavorite ? "Bỏ yêu thích" : "Thêm yêu thích"}
                />
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default PlanbookLibraryPage;
