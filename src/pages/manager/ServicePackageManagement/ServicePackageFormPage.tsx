import React, { ChangeEvent, useEffect } from "react";
import { Button, Form, Input, message, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";

import { fetchServicePackage, IServicePackageForm, createServicePackage, updateServicePackage } from "@/data/manager/ServicePackageData";

const { Title } = Typography;

const ServicePackageFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const [formData, setFormData] = React.useState<IServicePackageForm>({
        packageId: "",
        packageName: "",
        description: "",
        price: 0,
        discount: 0,
        startDate: "",
        endDate: "",
        maxLessonPlans: 0,
    });
    const navigate = useNavigate();

    // Fetch service package data if editing
    useEffect(() => {
        if (id) {
            fetchServicePackage(id).then((data) => {
                if (data) {
                    setFormData(data);
                    form.setFieldsValue(data);
                }
            }).catch((error) => {
                console.error("Error fetching service package:", error);
                message.error("Lỗi lấy dữ liệu.");
            });
        }
    }, [id, form]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleContentChange = (value: string) => {
        setFormData((prevState) => ({
            ...prevState,
            description: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            let success = false;
            if (id) {
                success = await updateServicePackage(formData);
                if (success) {
                    message.success("Cập nhật gói dịch vụ thành công");
                } else {
                    message.error("Lỗi khi cập nhật gói dịch vụ.");
                }
            } else {
                success = await createServicePackage(formData);
                if (success) {
                    message.success("Thêm mới gói dịch vụ thành công");
                } else {
                    message.error("Lỗi khi thêm gói dịch vụ.");
                }
            }
            if (success)
                navigate('/manager/service-packages');
        } catch (error) {
            console.error("Failed to submit service package form:", error);
            message.error("Lỗi khi thêm gói dịch vụ.");
        }
    };

    return (
        <>
            <Title level={2} className="my-4">{id ? "Chỉnh sửa gói dịch vụ" : "Thêm mới gói dịch vụ"}</Title>

            <Form
                form={form}
                initialValues={formData}
                layout="vertical"
                onFinish={handleSubmit}
                className="flex flex-wrap"
            >
                <div className="w-full px-4">
                    <div className="w-2/3">
                        <Form.Item
                            label="Tên gói"
                            name="packageName"
                            rules={[{ required: true, message: "Vui lòng nhập tên gói dịch vụ!" }]}
                        >
                            <Input
                                id="packageName"
                                name="packageName"
                                value={formData.packageName}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </Form.Item>
                    </div>

                    <div className="flex w-full">
                        <div className="mb-4 pb-4 w-2/3 mr-4">
                            <Form.Item
                                label="Mô tả"
                                name="description"
                            >
                                <ReactQuill
                                    value={formData.description}
                                    onChange={handleContentChange}
                                    className="h-80 mb-4"
                                />
                            </Form.Item>
                        </div>
                        <div className="w-1/3 flex flex-col px-4">
                            <div className="">
                                <Form.Item
                                    label="Giá (VND)"
                                    name="price"
                                    rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
                                >
                                    <Input
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        addonAfter="VND"
                                    />
                                </Form.Item>
                            </div>

                            <div className="">
                                <Form.Item
                                    label="Giảm giá (%)"
                                    name="discount"
                                >
                                    <Input
                                        id="discount"
                                        name="discount"
                                        value={formData.discount}
                                        onChange={handleChange}
                                        addonAfter="%"
                                    />
                                </Form.Item>
                            </div>

                            <div className="">
                                <Form.Item
                                    label="Bắt đầu"
                                    name="startDate"
                                    rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
                                >
                                    <Input
                                        id="startDate"
                                        name="startDate"
                                        // type="date"
                                        value={formData.startDate ? formData.startDate.split('T')[0] : ''}
                                        onChange={handleChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Kết thúc"
                                    name="endDate"
                                    rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
                                >
                                    <Input
                                        id="endDate"
                                        name="endDate"
                                        // type="date"
                                        value={formData.endDate ? formData.endDate.split('T')[0] : ''}
                                        onChange={handleChange}
                                    />
                                </Form.Item>
                            </div>

                            <div className="">
                                <Form.Item
                                    label="Số lượng tạo Kế hoạch giảng dạy"
                                    name="maxLessonPlans"
                                    rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
                                >
                                    <Input
                                        id="maxLessonPlans"
                                        name="maxLessonPlans"
                                        value={formData.maxLessonPlans}
                                        onChange={handleChange}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex justify-center">
                        <Form.Item>
                            <div className="flex space-x-4">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                >
                                    {id ? "Cập nhật" : "Thêm mới"}
                                </Button>
                                <Button
                                    type="default"
                                    onClick={() => navigate(-1)}
                                >
                                    Quay lại
                                </Button>
                            </div>
                        </Form.Item>
                    </div>
                </div>
            </Form>
        </>
    )
};

export default ServicePackageFormPage;