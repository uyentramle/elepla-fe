import React, { useEffect, ChangeEvent } from "react";
import { Button, Form, Input, message, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { IGradeForm, createGrade, updateGrade, fetchGradeList } from "@/data/admin/GradeData";

const { Title } = Typography;

const GradeFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const [formData, setFormData] = React.useState<IGradeForm>({
        id: "",
        name: "",
        description: "",
    });
    const navigate = useNavigate();

    // Fetch grade data if editing
    useEffect(() => {
        if (id) {
            fetchGradeList().then((gradeData) => {
                const grade = gradeData.find((cr) => cr.gradeId === id);
                if (grade) {
                    setFormData(grade);
                    form.setFieldsValue(grade);
                }
            }).catch((error) => {
                console.error("Error fetching grade:", error);
                message.error("Lỗi lấy dữ liệu.");
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

    // Handle content change for ReactQuill
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
                success = await updateGrade(formData);
                if (success) {
                    message.success("Cập nhật khối lớp thành công.");
                } else {
                    message.error("Lỗi cập nhật khối lớp.");
                }
            } else {
                success = await createGrade(formData);
                if (success) {
                    message.success("Tạo khối lớp thành công.");
                } else {
                    message.error("Lỗi tạo khối lớp.");
                }
            }
            if (success) {
                navigate('/admin/grades');
            }
        } catch (error) {
            console.error("Error creating grade:", error);
            message.error("Lỗi tạo khối lớp.");
        }
    };

    return (
        <>
            <Title level={2} className="my-4">{id ? "Chỉnh sửa khối lớp" : "Thêm mới khối lớp"}</Title>

            <Form
                form={form}
                initialValues={formData}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Tên khối lớp"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên khối lớp!" }]}
                >
                    <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full"
                    />
                </Form.Item>

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

                {/* <Form.Item
                    label="Trạng thái"
                    name="is_approved"
                    valuePropName="checked"
                >
                    <Switch
                        checked={formData.is_approved}
                        onChange={handleSwitchChange}
                    />
                </Form.Item> */}

                <Form.Item>
                    <div className="flex space-x-4 justify-center pt-4">
                        <Button type="primary" htmlType="submit">
                            {id ? "Cập nhật" : "Thêm mới"}
                        </Button>
                        <Button type="default" onClick={() => navigate('/admin/grades')}>
                            Quay lại
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </>
    );
};

export default GradeFormPage;
