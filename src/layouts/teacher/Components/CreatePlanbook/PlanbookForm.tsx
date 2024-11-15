import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, InputNumber, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { createPlanbook } from '@/api/ApiPlanbook';
import { PlanbookRequest } from '@/data/teacher/PlanbookData';
import axios from 'axios';



interface PlanbookFormProps {
    lessonId: string | null | undefined;
    collectionId: string | null | undefined;
    onPlanbookCreated: () => void; // Định nghĩa props onPlanbookCreated
    [key: string]: any; // Tùy chọn: Cho phép các thuộc tính khác
  }

  const PlanbookForm: React.FC<PlanbookFormProps> = ({ lessonId, collectionId, onPlanbookCreated  }) => { 

    const handleSubmit = async (values: any) => {
        try {
          // const response = await axios.post('http://localhost/api/Planbook/CreatePlanbook', {
            const response = await axios.post('https://elepla-be-production.up.railway.app/api/Planbook/CreatePlanbook', {
            lessonId,
            collectionId,
            ...values,
          });
          if (response.data.success) {
            message.success('Kế hoạch giảng dạy đã được tạo thành công!');
            onPlanbookCreated(); // Gọi hàm để đóng modal và tải lại danh sách

          }
        } catch (error) {
          message.error('Có lỗi xảy ra khi tạo kế hoạch giảng dạy.');
        }
      };

  return (
    <Form onFinish={handleSubmit}>
      {/* Title */}
      <Form.Item
        label="Tiêu đề"
        name="title"
        rules={[{ required: true, message: 'Hãy nhập tiêu đề' }]}
      >
        <Input placeholder="Nhập tiêu đề" />
      </Form.Item>

      {/* School Name */}
      <Form.Item
        label="Tên trường"
        name="schoolName"
        rules={[{ required: true, message: 'Hãy nhập tên trường' }]}
      >
        <Input placeholder="Nhập tên trường" />
      </Form.Item>

      {/* Teacher Name */}
      <Form.Item
        label="Tên giáo viên"
        name="teacherName"
        rules={[{ required: true, message: 'Hãy nhập tên giáo viên' }]}
      >
        <Input placeholder="Nhập tên giáo viên" />
      </Form.Item>

      {/* Subject */}
      <Form.Item
        label="Môn học"
        name="subject"
        rules={[{ required: true, message: 'Hãy nhập môn học' }]}
      >
        <Input placeholder="Nhập môn học" />
      </Form.Item>

      {/* Class Name */}
      <Form.Item
        label="Lớp"
        name="className"
        rules={[{ required: true, message: 'Hãy nhập lớp' }]}
      >
        <Input placeholder="Nhập lớp" />
      </Form.Item>

      {/* Duration */}
      <Form.Item
        label="Thời lượng (tiết)"
        name="durationInPeriods"
        rules={[{ required: true, message: 'Hãy nhập thời lượng' }]}
      >
        <InputNumber min={1} placeholder="Nhập thời lượng" className="w-full" />
      </Form.Item>

      {/* Knowledge Objective */}
      <Form.Item
        label="Mục tiêu kiến thức"
        name="knowledgeObjective"
        rules={[{ required: true, message: 'Hãy nhập mục tiêu kiến thức' }]}
      >
        <Input.TextArea rows={3} placeholder="Nhập mục tiêu kiến thức" />
      </Form.Item>

      {/* Skills Objective */}
      <Form.Item
        label="Mục tiêu kỹ năng"
        name="skillsObjective"
        rules={[{ required: true, message: 'Hãy nhập mục tiêu kỹ năng' }]}
      >
        <Input.TextArea rows={3} placeholder="Nhập mục tiêu kỹ năng" />
      </Form.Item>

      {/* Qualities Objective */}
      <Form.Item
        label="Mục tiêu phẩm chất"
        name="qualitiesObjective"
        rules={[{ required: true, message: 'Hãy nhập mục tiêu phẩm chất' }]}
      >
        <Input.TextArea rows={3} placeholder="Nhập mục tiêu phẩm chất" />
      </Form.Item>

      {/* Teaching Tools */}
      <Form.Item
        label="Công cụ giảng dạy"
        name="teachingTools"
        rules={[{ required: true, message: 'Hãy nhập công cụ giảng dạy' }]}
      >
        <Input.TextArea rows={2} placeholder="Nhập công cụ giảng dạy" />
      </Form.Item>

      {/* Notes */}
      <Form.Item label="Ghi chú" name="notes">
        <Input.TextArea rows={2} placeholder="Nhập ghi chú (không bắt buộc)" />
      </Form.Item>

      {/* Is Default */}
      <Form.Item name="isDefault" valuePropName="checked">
        <Checkbox>Đặt làm kế hoạch mặc định</Checkbox>
      </Form.Item>

      {/* Activities */}
      <Form.List name="activities">
  {(fields, { add, remove }) => (
    <>
      <h3 className="mt-4 font-semibold">Danh sách hoạt động</h3>
      {fields.map((field, index) => (
        <div key={field.key} className="flex items-center gap-4">
          <Form.Item
            name={[field.name, 'title']}
            rules={[{ required: true, message: 'Hãy nhập tiêu đề hoạt động' }]}
          >
            <Input placeholder={`Tiêu đề hoạt động ${index + 1}`} />
          </Form.Item>
          <Form.Item
            name={[field.name, 'objective']}
            rules={[{ required: true, message: 'Hãy nhập mục tiêu' }]}
          >
            <Input placeholder="Mục tiêu" />
          </Form.Item>
          <Form.Item
            name={[field.name, 'content']}
            rules={[{ required: true, message: 'Hãy nhập nội dung' }]}
          >
            <Input placeholder="Nội dung" />
          </Form.Item>
          <Form.Item
            name={[field.name, 'product']}
            rules={[{ required: true, message: 'Hãy nhập sản phẩm' }]}
          >
            <Input placeholder="Sản phẩm" />
          </Form.Item>
          <Form.Item
            name={[field.name, 'implementation']}
            rules={[{ required: true, message: 'Hãy nhập phương pháp thực hiện' }]}
          >
            <Input placeholder="Phương pháp thực hiện" />
          </Form.Item>
          <MinusCircleOutlined onClick={() => remove(field.name)} />
        </div>
      ))}
      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
        Thêm hoạt động
      </Button>
    </>
  )}
</Form.List>

      {/* Submit Button */}
      <Form.Item>
        <Button htmlType="submit">Lưu</Button>
      </Form.Item>
    </Form>
  );
};

export default PlanbookForm;
