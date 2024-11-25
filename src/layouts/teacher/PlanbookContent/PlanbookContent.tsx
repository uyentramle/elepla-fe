import React, { useState, useEffect } from 'react';
import { Card, Input, Form, Button, message, Switch } from 'antd';
import apiClient from "@/data/apiClient";
import { getActiveUserPackageByUserId, ServicePackage } from '@/data/manager/UserPackageDatas';


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
    planbookId: string;
    isPublic: boolean;
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
  userId: string; // Thêm userId để lấy thông tin gói người dùng
}

const PlanbookContent: React.FC<PlanbookContentProps> = ({ planbookData, userId }) => {
  const [editableData, setEditableData] = useState(planbookData);
  const [userPackage, setUserPackage] = useState<ServicePackage  | null>(null);



  useEffect(() => {
    console.log("Updating editableData:", planbookData);
    setEditableData(planbookData);
  }, [planbookData]);

    // Lấy thông tin gói người dùng khi component được render
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



  const handleInputChange = (field: string, value: any) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

const handleActivityChange = (index: number, field: string, value: any) => {
  const updatedActivities = [...editableData.activities];
  updatedActivities[index] = { ...updatedActivities[index], [field]: value };
  setEditableData((prev) => ({ ...prev, activities: updatedActivities }));
};

const handleSave = async () => {
  try {
    const updatedValues = {
      ...editableData,
      activities: editableData.activities.map((activity: any) => ({
        activityId: activity.activityId || null,
        ...activity,
      })),
    };

    const response = await apiClient.put(
      "https://elepla-be-production.up.railway.app/api/Planbook/UpdatePlanbook",
      updatedValues
    );

    if (response.data.success) {
      message.success("Cập nhật kế hoạch giảng dạy thành công!");
    } else {
      message.error(response.data.message || "Không thể cập nhật kế hoạch giảng dạy.");
    }
  } catch (error) {
    console.error(error);
    message.error("Có lỗi xảy ra khi cập nhật kế hoạch giảng dạy.");
  }
};

  // const handleExit = () => {
  //   console.log("Exiting without saving...");
  //   // Implement the exit functionality here
  // };

  const handleExportPdf = async () => {
    if (!userPackage?.exportPdf) {
      message.warning("Nâng cấp tài khoảng để sử dụng chức năng này");
      return;
    }
    try {
      const response = await apiClient.get(
        `https://elepla-be-production.up.railway.app/api/Planbook/ExportPlanbookToPdf`,
        {
          params: { planbookId: planbookData.planbookId },
          responseType: "blob", // Để xử lý file PDF
        }
      );

      // Tạo URL blob từ dữ liệu phản hồi
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Đặt tên file, có thể tùy chỉnh
      link.setAttribute("download", `${planbookData.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success("Xuất file PDF thành công!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      message.error("Có lỗi xảy ra khi xuất file PDF.");
    }
  };

  const handleExportWord = async () => {
    if(!userPackage?.exportWord){
      message.warning("Nâng cấp tài khoảng để sử dụng chức năng này");
      return;
    }

    try {
      const response = await apiClient.get(
        `https://elepla-be-production.up.railway.app/api/Planbook/ExportPlanbookToWord`,
        {
          params: { planbookId: planbookData.planbookId },
          responseType: "blob", // Để xử lý file Word
        }
      );

      // Tạo URL blob từ dữ liệu phản hồi
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Đặt tên file, có thể tùy chỉnh
      link.setAttribute("download", `${planbookData.title}.docx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success("Xuất file Word thành công!");
    } catch (error) {
      console.error("Error exporting Word:", error);
      message.error("Có lỗi xảy ra khi xuất file Word.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">{editableData.title}</h1>

      <Form.Item label="Chế độ hiển thị" name="isPublic" valuePropName="checked">
  <Switch
    checked={editableData.isPublic}
    onChange={(checked) =>
      setEditableData((prev) => ({ ...prev, isPublic: checked }))
    }
    checkedChildren="Công khai"
    unCheckedChildren="Riêng tư"
  />
</Form.Item>

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
            <Button
              style={{ backgroundColor: "red", color: "white" }}
              onClick={handleExportPdf}
            >
              Xuất file PDF
            </Button>
            <Button
              style={{ backgroundColor: "blue", color: "white" }}
              onClick={handleExportWord}
            >
              Xuất file Word
            </Button>
          </div>
        <div className="flex justify-end gap-4 mt-6">
          {/* <Button type="default" onClick={handleExit}>
            Thoát
          </Button> */}
          <Button type="primary" onClick={handleSave}>
            Lưu
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PlanbookContent;
