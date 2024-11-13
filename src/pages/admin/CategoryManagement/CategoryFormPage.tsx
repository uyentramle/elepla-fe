import React, { useEffect, ChangeEvent, useState } from "react";
import { Button, Form, Input, Switch, Typography, message, } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { createCategory, updateCategory, fetchListCategory, ICategoryForm } from "@/data/admin/CategoryData";

const { Title } = Typography;

const CategoryFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const [, setLoading] = useState(false);
    const [formData, setFormData] = useState<ICategoryForm>({
        id: undefined,
        name: "",
        url: "",
        description: "",
        status: true,
    });
    const navigate = useNavigate();

    // Fetch category data if editing
    useEffect(() => {
        if (id) {
            setLoading(true);
            fetchListCategory().then((categories) => {
                const category = categories.find((cat) => cat.id === id);
                if (category) {
                    setFormData(category);
                    form.setFieldsValue(category);
                }
                setLoading(false);
            }).catch((error) => {
                console.error("Error fetching category:", error);
                message.error("Lỗi lấy dữ liệu.");
                setLoading(false);
            });
        }
    }, [id, form]);

    // Handle form input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    // Handle changes in the ReactQuill editor
    const handleContentChange = (value: string) => {
        setFormData((prevState) => ({
            ...prevState,
            description: value,
        }));
    };

    // Handle switch toggle
    const handleSwitchChange = (checked: boolean) => {
        setFormData((prevState) => ({
            ...prevState,
            status: checked,
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let success = false;
            if (id) {
                // Update category
                success = await updateCategory(formData);
                if (success) {
                    message.success("Category updated successfully!");
                } else {
                    message.error("Failed to update category.");
                }
            } else {
                // Create category
                success = await createCategory(formData);
                if (success) {
                    message.success("Category created successfully!");
                } else {
                    message.error("Failed to create category.");
                }
            }
            if (success) navigate('/admin/categories');
        } catch (error) {
            console.error("Error during form submission:", error);
            message.error("An error occurred during the process.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Title level={2} className="my-4">{id ? "Chỉnh sửa danh mục" : "Thêm mới danh mục bài viết"}</Title>

            <Form
                form={form}
                initialValues={formData}
                layout="vertical"
                className="flex flex-wrap"
                onFinish={handleSubmit}
            >
                <div className="w-full px-4">
                    <div className="w-1/2">
                        <Form.Item
                            label="Tên danh mục"
                            name="name"
                            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
                        >
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </Form.Item>
                    </div>

                    <div className="w-1/2">
                        <Form.Item
                            label="Slug"
                            name="url"
                        >
                            <Input
                                id="url"
                                name="url"
                                value={formData.url}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </Form.Item>
                    </div>

                    <div className="mb-4 pb-4">
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

                    <div className="mb-4">
                        <Form.Item
                            name="status"
                            valuePropName="checked"
                        >
                            <span className="mr-4">Trạng thái</span>
                            <Switch
                                id="status"
                                checked={formData.status}
                                onChange={handleSwitchChange}
                            />
                        </Form.Item>
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
                                    onClick={() => navigate('/admin/categories')}
                                >
                                    Quay lại
                                </Button>
                            </div>
                        </Form.Item>
                    </div>
                </div>
            </Form>
        </>
    );
};

export default CategoryFormPage;
