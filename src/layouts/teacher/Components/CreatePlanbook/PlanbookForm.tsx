import React, { useEffect, useState } from "react";
import { Form, Input, Button, InputNumber, message, Spin, Switch } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import apiClient from "@/data/apiClient"; // Import client để xử lý API
import { getActiveUserPackageByUserId, ServicePackage } from "@/data/manager/UserPackageDatas";

interface PlanbookFormProps {
  lessonId: string | null | undefined;
  collectionId: string | null | undefined;
  onPlanbookCreated: () => void;
  
}

const PlanbookForm: React.FC<PlanbookFormProps> = ({
  lessonId,
  collectionId,
  onPlanbookCreated,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [userPackage, setUserPackage] = useState<ServicePackage  | null>(null);

  const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
  useEffect(() => {
    const fetchUserPackage = async () => {
      try {
        console.log("Fetching user package with userId:", userId); // Debug: In ra userId trước khi gọi API
        if (!userId) {
          console.error("UserId is missing."); // Debug: Xác nhận nếu userId không tồn tại
          message.error("UserId không hợp lệ. Không thể lấy thông tin gói người dùng.");
          return;
        }
        
        const data = await getActiveUserPackageByUserId(userId);
        console.log("Fetched user package:", data); // Debug: Xem dữ liệu trả về từ API
        setUserPackage(data);
      } catch (error) {
        console.error("Error fetching user package:", error); // Debug: In lỗi nếu API thất bại
        message.error("Không thể lấy thông tin gói người dùng.");
      }
    };
  
    fetchUserPackage();
  }, [userId]);

  // Xử lý gửi form
  const handleSubmit = async (values: any) => {
    setLoading(true); // Bắt đầu loading
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
        onPlanbookCreated(); // Gọi callback khi tạo thành công
        form.resetFields(); // Reset form sau khi thành công
      } else {
        message.error(response.data.message || "Không thể tạo kế hoạch giảng dạy.");
      }
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi tạo kế hoạch giảng dạy.");
    }finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleUseAI = async () => {
    if (!lessonId) {
      message.error("Không có lessonId hợp lệ.");
      return;
    }
    if(!userPackage?.useAI){
      message.warning("Nâng cấp tài khoảng để sử dụng chức năng này");
      return;
    }
    setLoading(true); // Bắt đầu loading
    try {
      console.log("Gửi yêu cầu tới API với lessonId:", lessonId); // Log trước khi gửi yêu cầu
  
      const response = await apiClient.post(
        `https://elepla-be-production.up.railway.app/api/Planbook/CreatePlanbookUsingAI?lessonId=${lessonId}`
      );
  
      console.log("Kết quả trả về từ API:", response.data); // Log kết quả trả về từ API
  
      if (response.data.success) {
        const aiData = response.data.data;
        console.log("Dữ liệu AI:", aiData); // Log dữ liệu AI nhận được
  
        // Xử lý dữ liệu từ AI
        const processedData = {
          title: aiData.title || "",
          schoolName: aiData.schoolName || "",
          teacherName: aiData.teacherName || "",
          subject: aiData.subject || "",
          className: aiData.className || "",
          durationInPeriods: aiData.durationInPeriods || 1,
          knowledgeObjective: aiData.knowledgeObjective || "",
          skillsObjective: aiData.skillsObjective || "",
          qualitiesObjective: aiData.qualitiesObjective || "",
          teachingTools: aiData.teachingTools || "",
          notes: aiData.notes || "",
          isPublic: aiData.isPublic ?? false,
          activities: aiData.activities?.map((activity: any) => ({
            title: activity.title || "",
            objective: activity.objective || "",
            content: activity.content || "",
            product: activity.product || "",
            implementation: activity.implementation || "",
          })) || [],
        };
  
        console.log("Dữ liệu sau khi xử lý:", processedData); // Log dữ liệu sau khi xử lý
  
        // Điền dữ liệu vào form
        form.setFieldsValue(processedData);
        message.success("Dữ liệu từ AI đã được tải thành công!");
      } else {
        message.error(response.data.message || "Không thể lấy dữ liệu từ AI.");
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi sử dụng AI:", error); // Log lỗi nếu có
      message.error("Có lỗi xảy ra khi sử dụng AI.");
    }finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleUseTemplate = async () => {
    if (!lessonId) {
      message.error("Không có lessonId hợp lệ.");
      return;
    }
    if(!userPackage?.useTemplate){
      message.warning("Nâng cấp tài khoảng để sử dụng chức năng này");
      return;
    }
    try {
      const response = await apiClient.post(
        `https://elepla-be-production.up.railway.app/api/Planbook/CreatePlanbookFromTemplate?lessonId=${lessonId}`
      );
  
      if (response.data.success) {
        const templateData = response.data.data;
  
        // Xử lý dữ liệu từ mẫu
        const processedData = {
          title: templateData.title || "",
          schoolName: templateData.schoolName || "",
          teacherName: templateData.teacherName || "",
          subject: templateData.subject || "",
          className: templateData.className || "",
          durationInPeriods: templateData.durationInPeriods || 1,
          knowledgeObjective: templateData.knowledgeObjective || "",
          skillsObjective: templateData.skillsObjective || "",
          qualitiesObjective: templateData.qualitiesObjective || "",
          teachingTools: templateData.teachingTools || "",
          notes: templateData.notes || "",
          isPublic: templateData.isPublic ?? false,
          activities: templateData.activities?.map((activity: any) => ({
            title: activity.title || "",
            objective: activity.objective || "",
            content: activity.content || "",
            product: activity.product || "",
            implementation: activity.implementation || "",
          })) || [],
        };
  
        // Điền dữ liệu vào form
        form.setFieldsValue(processedData);
        message.success("Dữ liệu từ giáo án mẫu đã được tải thành công!");
      } else {
        message.error(response.data.message || "Không thể lấy dữ liệu từ giáo án mẫu.");
      }
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi sử dụng giáo án mẫu.");
    }
  };
  
  

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
          <Spin spinning={loading} tip="Đang xử lý...">
      <h1 className="text-2xl font-bold mb-4 text-center">KHUNG KẾ HOẠCH BÀI DẠY</h1>
      <p className="text-center mb-8">
        (Kèm theo Công văn số 5512/BGDĐT-GDTrH ngày 18 tháng 12 năm 2020 của Bộ GDĐT)
      </p>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        {/* AI and Template Buttons */}
        <div className="flex justify-end gap-4 mb-4">
          <Button type="primary" className="bg-blue-600 text-white" onClick={handleUseAI}>
            
            Dùng AI
          </Button>
          <Button
            type="primary"
            className="bg-green-600 text-white"
            onClick={handleUseTemplate}
          >
            Sử dụng giáo án mẫu
          </Button>
        </div>

        {/* Public/Private Toggle */}
        <Form.Item label="Chế độ hiển thị" name="isPublic" valuePropName="checked">
          <Switch checkedChildren="Công khai" unCheckedChildren="Riêng tư" />
        </Form.Item>

        {/* Title */}
        <Form.Item label="TÊN BÀI DẠY" name="title" rules={[{ required: true, message: "Hãy nhập tiêu đề" }]}>
          <Input placeholder="Nhập tiêu đề" />
        </Form.Item>

        {/* School Name */}
        <Form.Item label="Tên trường" name="schoolName" rules={[{ required: true, message: "Hãy nhập tên trường" }]}>
          <Input placeholder="Nhập tên trường" />
        </Form.Item>

        {/* Teacher Name */}
        <Form.Item label="Họ và tên giáo viên" name="teacherName" rules={[{ required: true, message: "Hãy nhập tên giáo viên" }]}>
          <Input placeholder="Nhập tên giáo viên" />
        </Form.Item>

        {/* Subject */}
        <Form.Item label="Môn học/Hoạt động giáo dục" name="subject" rules={[{ required: true, message: "Hãy nhập môn học" }]}>
          <Input placeholder="Nhập môn học" />
        </Form.Item>

        {/* Class Name */}
        <Form.Item label="Lớp" name="className" rules={[{ required: true, message: "Hãy nhập lớp" }]}>
          <Input placeholder="Nhập lớp" />
        </Form.Item>

        {/* Duration */}
        <Form.Item label="Thời gian thực hiện ( số tiết)" name="durationInPeriods" rules={[{ required: true, message: "Hãy nhập thời lượng" }]}>
          <InputNumber min={1} placeholder="Nhập thời lượng" className="w-full" />
        </Form.Item>

        {/* Objectives */}
        <Form.Item label="Mục tiêu" name="knowledgeObjective" rules={[{ required: true, message: "Hãy nhập mục tiêu kiến thức" }]}>
          <Input.TextArea rows={3} placeholder="Nhập mục tiêu kiến thức" />
        </Form.Item>
        <Form.Item label="Về năng lực" name="skillsObjective" rules={[{ required: true, message: "Hãy nhập mục tiêu kỹ năng" }]}>
          <Input.TextArea rows={3} placeholder="Nhập mục tiêu kỹ năng" />
        </Form.Item>
        <Form.Item label="Về phẩm chất" name="qualitiesObjective" rules={[{ required: true, message: "Hãy nhập mục tiêu phẩm chất" }]}>
          <Input.TextArea rows={3} placeholder="Nhập mục tiêu phẩm chất" />
        </Form.Item>

        {/* Teaching Tools */}
        <Form.Item label="Thiết bị dạy học và học liệu" name="teachingTools" rules={[{ required: true, message: "Hãy nhập công cụ giảng dạy" }]}>
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
                    <Input.TextArea placeholder="Nhập tiêu đề hoạt động" />
                  </Form.Item>
                  <Form.Item
                    label="Mục tiêu"
                    name={[field.name, "objective"]}
                    rules={[{ required: true, message: "Hãy nhập mục tiêu" }]}
                  >
                    <Input.TextArea placeholder="Nhập mục tiêu" />
                  </Form.Item>
                  <Form.Item
                    label="Nội dung"
                    name={[field.name, "content"]}
                    rules={[{ required: true, message: "Hãy nhập nội dung" }]}
                  >
                    <Input.TextArea placeholder="Nhập nội dung" />
                  </Form.Item>
                  <Form.Item
                    label="Sản phẩm"
                    name={[field.name, "product"]}
                    rules={[{ required: true, message: "Hãy nhập sản phẩm" }]}
                  >
                    <Input.TextArea placeholder="Nhập sản phẩm" />
                  </Form.Item>
                  <Form.Item
                    label="Tổ chức thực hiện"
                    name={[field.name, "implementation"]}
                    rules={[{ required: true, message: "Hãy nhập cách tổ chức thực hiện" }]}
                  >
                    <Input.TextArea rows={2} placeholder="Nhập cách tổ chức thực hiện" />
                  </Form.Item>
                  <MinusCircleOutlined
                    onClick={() => remove(field.name)}
                    className="text-red-600"
                  />
                </div>
              ))}
              <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                Thêm hoạt động
              </Button>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="bg-blue-600 text-white">
            Lưu kế hoạch bài dạy
          </Button>
        </Form.Item>
      </Form>
      </Spin>

    </div>
  );
};

export default PlanbookForm;
