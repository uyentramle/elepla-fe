import React from "react";
import { Form, Input, Button, InputNumber, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import apiClient from "@/data/apiClient";

interface PlanbookFormProps {
  lessonId: string | null | undefined;
  collectionId: string | null | undefined;
  onPlanbookCreated: () => void;
}

const PlanbookForm: React.FC<PlanbookFormProps> = ({ lessonId, collectionId, onPlanbookCreated }) => {
  const handleSubmit = async (values: any) => {
    try {
      const response = await apiClient.post(
        "https://elepla-be-production.up.railway.app/api/Planbook/CreatePlanbook",
        {
          lessonId,
          collectionId,
          ...values,
        }
      );
      if (response.data.success) {
        message.success("Kế hoạch giảng dạy đã được tạo thành công!");
        onPlanbookCreated();
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo kế hoạch giảng dạy.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">
            KHUNG KẾ HOẠCH BÀI DẠY
        </h1>
      <p className="text-center mb-8">
        (Kèm theo Công văn số 5512/BGDĐT-GDTrH ngày 18 tháng 12 năm 2020 của Bộ GDĐT)
      </p>
      <Form onFinish={handleSubmit} layout="vertical">

        
          {/* AI and Template Buttons */}
        <div className="flex justify-end gap-4 mb-4">
          <Button type="primary" className="bg-blue-600 text-white">Dùng AI</Button>
          <Button type="primary" className="bg-blue-600 text-white">Sử dụng giáo án mẫu</Button>
        </div>
        {/* Title */}
        <Form.Item
          label="TÊN BÀI DẠY"
          name="title"
          rules={[{ required: true, message: "Hãy nhập tiêu đề" }]}
          labelCol={{ style: { fontSize: '18px', fontWeight: 'bold' } }} 
        >
          <Input placeholder="Nhập tiêu đề" />
        </Form.Item>

        {/* School Name */}
        <Form.Item
          label="Tên trường"
          name="schoolName"
          rules={[{ required: true, message: "Hãy nhập tên trường" }]}
        >
          <Input placeholder="Nhập tên trường" />
        </Form.Item>

        {/* Teacher Name */}
        <Form.Item
          label="Họ và tên giáo viên"
          name="teacherName"
          rules={[{ required: true, message: "Hãy nhập tên giáo viên" }]}
        >
          <Input placeholder="Nhập tên giáo viên" />
        </Form.Item>

        {/* Subject */}
        <Form.Item
          label="Môn học/Hoạt động giáo dục: "
          name="subject"
          rules={[{ required: true, message: "Hãy nhập môn học" }]}
        >
          <Input placeholder="Nhập môn học" />
        </Form.Item>

        {/* Class Name */}
        <Form.Item
          label="Lớp"
          name="className"
          rules={[{ required: true, message: "Hãy nhập lớp" }]}
        >
          <Input placeholder="Nhập lớp" />
        </Form.Item>

        {/* Duration */}
        <Form.Item
          label="Thời gian thực hiện ( số tiết)"
          name="durationInPeriods"
          rules={[{ required: true, message: "Hãy nhập thời lượng" }]}
        >
          <InputNumber min={1} placeholder="Nhập thời lượng" className="w-full" />
        </Form.Item>
            {/* Title */}
            <Form.Item
          label="Mục tiêu"
          labelCol={{ style: { fontSize: '18px', fontWeight: 'bold' } }} 
        >
        </Form.Item>

        {/* Objectives */}
        <Form.Item
          label="Về Kiến thức"
          name="knowledgeObjective"
          rules={[{ required: true, message: "Hãy nhập mục tiêu kiến thức" }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập mục tiêu kiến thức" />
        </Form.Item>
        <Form.Item
          label="Về năng lực"
          name="skillsObjective"
          rules={[{ required: true, message: "Hãy nhập mục tiêu kỹ năng" }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập mục tiêu kỹ năng" />
        </Form.Item>
        <Form.Item
          label="Về phẩm chất"
          name="qualitiesObjective"
          rules={[{ required: true, message: "Hãy nhập mục tiêu phẩm chất" }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập mục tiêu phẩm chất" />
        </Form.Item>


        {/* Teaching Tools */}
        <Form.Item
          label="Thiết bị dạy học và học liệu"
          name="teachingTools"
          rules={[{ required: true, message: "Hãy nhập công cụ giảng dạy" }]}
          labelCol={{ style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '30px' } }} // Khoảng cách giữa label và input
          >
          <Input.TextArea rows={2} placeholder="Nhập công cụ giảng dạy" />
        </Form.Item>

        {/* Notes */}
        <Form.Item label="Ghi chú" name="notes">
          <Input.TextArea rows={2} placeholder="Nhập ghi chú (không bắt buộc)" />
        </Form.Item>


        {/* Activities */}
        <Form.List name="activities">
          {(fields, { add, remove }) => (
            <>
              <h2 className="mt-4 font-semibold">Tiến trình dạy học</h2>
              {fields.map((field, index) => (
                <div key={field.key} className="p-4 border rounded-md mb-4">

                  <Form.Item
                    label={`Tiêu đề hoạt động ${index + 1}`}
                    name={[field.name, "title"]}
                    rules={[{ required: true, message: "Hãy nhập tiêu đề hoạt động" }]}
                  >
                    <Input placeholder="Nhập tiêu đề hoạt động" />
                  </Form.Item>
                  <Form.Item
                    label="Mục tiêu"
                    name={[field.name, "objective"]}
                    rules={[{ required: true, message: "Hãy nhập mục tiêu" }]}
                  >
                    <Input placeholder="Nhập mục tiêu" />
                  </Form.Item>
                  <Form.Item
                    label="Nội dung"
                    name={[field.name, "content"]}
                    rules={[{ required: true, message: "Hãy nhập nội dung" }]}
                  >
                    <Input placeholder="Nhập nội dung" />
                  </Form.Item>
                  <Form.Item
                    label="Sản phẩm"
                    name={[field.name, "product"]}
                    rules={[{ required: true, message: "Hãy nhập sản phẩm" }]}
                  >
                    <Input placeholder="Nhập sản phẩm" />
                  </Form.Item>
                  <Form.Item
                    label= "Tổ chức thực hiện"
                    name={[field.name, "implementation"]}
                    rules={[{ required: true, message: "Hãy nhập phương pháp thực hiện" }]}
                  >
                    <Input placeholder="Nhập phương pháp thực hiện" />
                  </Form.Item>
                  <Button
                    type="link"
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(field.name)}
                  >
                    Xóa hoạt động
                  </Button>
                </div>
              ))}
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                className="mt-2"
              >
                Thêm hoạt động
              </Button>
            </>
          )}
        </Form.List>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Lưu kế hoạch bài dạy
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PlanbookForm;