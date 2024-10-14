import React, { ChangeEvent, useEffect } from "react";
import { Button, Form, Input, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";

import service_packages_data, { IServicePackage } from "@/data/manager/ServicePackageData";

const { Title } = Typography;

const ServicePackageFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const [formData, setFormData] = React.useState<IServicePackage>({
        packageId: "",
        packageName: "",
        description: "",
        price: 0,
        discount: 0,
        duration: 0,
        maxPlanbook: 0,

        createdAt: new Date(),
        createdBy: "",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    });
    const navigate = useNavigate();

    // Fetch service package data if editing
    useEffect(() => {
        if (id) {
            const servicePackage = service_packages_data.find((servicePackage) => servicePackage.packageId === id);
            if (servicePackage) {
                setFormData(servicePackage);
                form.setFieldsValue(servicePackage);
            }
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

    const handleSubmit = () => {
        if (id) {
            const updatedServicePackages = service_packages_data.map((servicePackage) =>
                servicePackage.packageId === id
                    ? { ...servicePackage, ...formData }
                    : servicePackage
            );

            console.log("Updating service package:", updatedServicePackages);
        } else {
            const newServicePackage: IServicePackage = {
                ...formData,
            };
            console.log("Adding new service package:", newServicePackage);
        }
        navigate('/manager/service-packages');
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
                                    className="h-60 mb-4"
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
                                    label="Thời hạn"
                                    name="duration"
                                >
                                    <Input
                                        id="duration"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                    />
                                </Form.Item>
                            </div>

                            <div className="">
                                <Form.Item
                                    label="Số lượng tạo KHGD"
                                    name="maxPlanbook"
                                >
                                    <Input
                                        id="maxPlanbook"
                                        name="maxPlanbook"
                                        value={formData.maxPlanbook}
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