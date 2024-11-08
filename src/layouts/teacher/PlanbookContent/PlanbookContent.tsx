import React, { useState } from 'react';
import { Button, Card, Input, Form, } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const PlanbookContent: React.FC = () => {
  const [activities, setActivities] = useState([
    { title: '', objective: '', content: '', product: '', implementation: '' },
  ]);

  const addActivity = () => {
    setActivities([...activities, { title: '', objective: '', content: '', product: '', implementation: '' }]);
  };

  const removeActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">
        KHUNG KẾ HOẠCH BÀI DẠY
      </h1>
      <p className="text-center mb-8">
        (Kèm theo Công văn số 5512/BGDĐT-GDTrH ngày 18 tháng 12 năm 2020 của Bộ GDĐT)
      </p>

      <Form layout="vertical" className="max-w-4xl mx-auto bg-white p-6 rounded shadow-md">

        {/* Field 1: General Information */}
        <Card className="mb-6" title="Thông tin chung">
          <Form.Item label="Trường">
            <Input placeholder="Tên Trường" />
          </Form.Item>
          <Form.Item label="Tổ">
            <Input placeholder="Tên Tổ" />
          </Form.Item>
          <Form.Item label="Họ và tên giáo viên">
            <Input placeholder="Họ và tên giáo viên" />
          </Form.Item>
          <Form.Item label="Tên bài dạy">
            <Input placeholder="Tên bài dạy" />
          </Form.Item>
          <Form.Item label="Môn học/Hoạt động giáo dục và lớp">
            <Input placeholder="Môn học/Hoạt động giáo dục và lớp" />
          </Form.Item>
          <Form.Item label="Thời gian thực hiện (số tiết)">
            <Input placeholder="Thời gian thực hiện" />
          </Form.Item>
        </Card>

        {/* AI and Template Buttons */}
        <div className="flex justify-end gap-4 mb-4">
          <Button type="primary" className="bg-blue-600 text-white">Dùng AI</Button>
          <Button type="primary" className="bg-blue-600 text-white">Sử dụng giáo án mẫu</Button>
        </div>

        {/* Field 2: Objectives */}
        <Card className="mb-6" title="I. Mục tiêu">
          <Form.Item label="Mục tiêu kiến thức">
            <Input.TextArea rows={2} placeholder="Nêu cụ thể nội dung kiến thức học sinh cần học..." />
          </Form.Item>
          <Form.Item label="Mục tiêu kỹ năng">
            <Input.TextArea rows={2} placeholder="Nêu cụ thể yêu cầu học sinh làm được gì..." />
          </Form.Item>
          <Form.Item label="Mục tiêu phẩm chất">
            <Input.TextArea rows={2} placeholder="Nêu cụ thể yêu cầu về hành vi, thái độ..." />
          </Form.Item>
        </Card>

        {/* Field 3: Teaching Tools */}
        <Card className="mb-6" title="II. Thiết bị dạy học và học liệu">
          <Form.Item label="Thiết bị dạy học và học liệu">
            <Input.TextArea rows={3} placeholder="Nêu cụ thể các thiết bị dạy học..." />
          </Form.Item>
        </Card>

        {/* Field 4: Teaching Activities */}
        <Card title="III. Tiến trình dạy học">
          {activities.map((activity, index) => (
            <Card key={index} className="mb-4" title={`Hoạt động ${index + 1}`}>
              <Form.Item label="Tên hoạt động">
                <Input
                  placeholder="Tên hoạt động"
                  value={activity.title}
                  onChange={(e) => {
                    const newActivities = [...activities];
                    newActivities[index].title = e.target.value;
                    setActivities(newActivities);
                  }}
                />
              </Form.Item>
              <Form.Item label="Mục tiêu">
                <Input.TextArea
                  rows={2}
                  placeholder="Nêu mục tiêu của hoạt động"
                  value={activity.objective}
                  onChange={(e) => {
                    const newActivities = [...activities];
                    newActivities[index].objective = e.target.value;
                    setActivities(newActivities);
                  }}
                />
              </Form.Item>
              <Form.Item label="Nội dung">
                <Input.TextArea
                  rows={2}
                  placeholder="Nêu nội dung yêu cầu của hoạt động"
                  value={activity.content}
                  onChange={(e) => {
                    const newActivities = [...activities];
                    newActivities[index].content = e.target.value;
                    setActivities(newActivities);
                  }}
                />
              </Form.Item>
              <Form.Item label="Sản phẩm">
                <Input.TextArea
                  rows={2}
                  placeholder="Mô tả sản phẩm của hoạt động"
                  value={activity.product}
                  onChange={(e) => {
                    const newActivities = [...activities];
                    newActivities[index].product = e.target.value;
                    setActivities(newActivities);
                  }}
                />
              </Form.Item>
              <Form.Item label="Cách thức thực hiện">
                <Input.TextArea
                  rows={3}
                  placeholder="Mô tả cách thức thực hiện"
                  value={activity.implementation}
                  onChange={(e) => {
                    const newActivities = [...activities];
                    newActivities[index].implementation = e.target.value;
                    setActivities(newActivities);
                  }}
                />
              </Form.Item>
              <Button
                type="dashed"
                danger
                icon={<MinusCircleOutlined />}
                onClick={() => removeActivity(index)}
                className="w-full mb-2"
              >
                Xóa hoạt động
              </Button>
            </Card>
          ))}
          <Button type="dashed" onClick={addActivity} icon={<PlusOutlined />} className="w-full mb-6">
            Thêm hoạt động
          </Button>
        </Card>

        {/* Save/Cancel Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Button type="default" className="hover:border-red-500 hover:text-red-500">
            Hủy
          </Button>
          <Button type="primary" className="bg-blue-600 text-white">
            Lưu
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PlanbookContent;