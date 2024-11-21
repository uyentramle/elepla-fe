import React, { useState, useEffect } from 'react';
import { Card, Input, Form, Button } from 'antd';

interface Activity {
  title: string;
  objective: string;
  content: string;
  product: string;
  implementation: string;
}

interface PlanbookContentProps {
  planbookData: {
    title: string;
    schoolName: string;
    teacherName: string;
    subject: string;
    className: string;
    durationInPeriods: number;
    knowledgeObjective: string;
    skillsObjective: string;
    qualitiesObjective: string;
    teachingTools: string;
    activities: Activity[];
  };
}

const PlanbookContent: React.FC<PlanbookContentProps> = ({ planbookData }) => {
  const [editableData, setEditableData] = useState(planbookData);

  useEffect(() => {
    console.log("Updating editableData:", planbookData);
    setEditableData(planbookData);
  }, [planbookData]);


  const handleInputChange = (field: string, value: string) => {
    setEditableData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleActivityChange = (index: number, field: string, value: string) => {
    const updatedActivities = editableData.activities.map((activity, i) =>
      i === index ? { ...activity, [field]: value } : activity
    );
    setEditableData((prevData) => ({ ...prevData, activities: updatedActivities }));
  };

  const handleSave = () => {
    console.log("Saved data:", editableData);
    // Implement the save functionality here
  };

  const handleExit = () => {
    console.log("Exiting without saving...");
    // Implement the exit functionality here
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">{editableData.title}</h1>

      <Form layout="vertical" className="max-w-4xl mx-auto bg-white p-6 rounded shadow-md">
        <Card className="mb-6" title="Thông tin chung">
          <Form.Item label={<strong>Trường</strong>}>
            <Input
              value={editableData.schoolName}
              onChange={(e) => handleInputChange("schoolName", e.target.value)}
            />
          </Form.Item>
          <Form.Item label={<strong>Giáo viên</strong>}>
            <Input
              value={editableData.teacherName}
              onChange={(e) => handleInputChange("teacherName", e.target.value)}
            />
          </Form.Item>
          <Form.Item label={<strong>Môn học</strong>}>
            <Input
              value={editableData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
            />
          </Form.Item>
          <Form.Item label={<strong>Lớp</strong>}>
            <Input
              value={editableData.className}
              onChange={(e) => handleInputChange("className", e.target.value)}
            />
          </Form.Item>
          <Form.Item label={<strong>Thời gian thực hiện (số tiết)</strong>}>
            <Input
              value={editableData.durationInPeriods}
              onChange={(e) => handleInputChange("durationInPeriods", e.target.value)}
            />
          </Form.Item>
        </Card>

        <Card className="mb-6" title="I. Mục tiêu">
          <Form.Item label={<strong>Mục tiêu kiến thức</strong>}>
            <Input.TextArea
              rows={2}
              value={editableData.knowledgeObjective}
              onChange={(e) => handleInputChange("knowledgeObjective", e.target.value)}
            />
          </Form.Item>
          <Form.Item label={<strong>Mục tiêu kỹ năng</strong>}>
            <Input.TextArea
              rows={2}
              value={editableData.skillsObjective}
              onChange={(e) => handleInputChange("skillsObjective", e.target.value)}
            />
          </Form.Item>
          <Form.Item label={<strong>Mục tiêu phẩm chất</strong>}>
            <Input.TextArea
              rows={2}
              value={editableData.qualitiesObjective}
              onChange={(e) => handleInputChange("qualitiesObjective", e.target.value)}
            />
          </Form.Item>
        </Card>

        <Card className="mb-6" title="II. Thiết bị dạy học và học liệu">
          <Form.Item label={<strong>Thiết bị dạy học và học liệu</strong>}>
            <Input.TextArea
              rows={3}
              value={editableData.teachingTools}
              onChange={(e) => handleInputChange("teachingTools", e.target.value)}
            />
          </Form.Item>
        </Card>

        <Card title="III. Tiến trình dạy học">
          {editableData.activities.map((activity, index) => (
            <Card key={index} className="mb-4" title={`Hoạt động ${index + 1}`}>
              <Form.Item label={<strong>Tên hoạt động</strong>}>
                <Input
                  value={activity.title}
                  onChange={(e) => handleActivityChange(index, "title", e.target.value)}
                />
              </Form.Item>
              <Form.Item label={<strong>Mục tiêu</strong>}>
                <Input.TextArea
                  rows={2}
                  value={activity.objective}
                  onChange={(e) => handleActivityChange(index, "objective", e.target.value)}
                />
              </Form.Item>
              <Form.Item label={<strong>Nội dung</strong>}>
                <Input.TextArea
                  rows={3}
                  value={activity.content}
                  onChange={(e) => handleActivityChange(index, "content", e.target.value)}
                />
              </Form.Item>
              <Form.Item label={<strong>Sản phẩm</strong>}>
                <Input.TextArea
                  rows={2}
                  value={activity.product}
                  onChange={(e) => handleActivityChange(index, "product", e.target.value)}
                />
              </Form.Item>
              <Form.Item label={<strong>Cách thức thực hiện</strong>}>
                <Input.TextArea
                  rows={4}
                  value={activity.implementation}
                  onChange={(e) => handleActivityChange(index, "implementation", e.target.value)}
                />
              </Form.Item>
            </Card>
          ))}
        </Card>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="default" onClick={handleExit}>
            Thoát
          </Button>
          <Button type="primary" onClick={handleSave}>
            Lưu
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PlanbookContent;
