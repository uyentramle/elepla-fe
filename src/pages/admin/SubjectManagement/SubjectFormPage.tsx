import React, { useEffect, ChangeEvent } from "react";
import { Button, Form, Input, message, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { ISubjectForm, createSubject, updateSubject, fetchSubjectList } from "@/data/admin/SubjectData";

const { Title } = Typography;

const SubjectFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const [formData, setFormData] = React.useState<ISubjectForm>({
        subjectId: "",
        name: "",
        description: "",
    });
    const navigate = useNavigate();

    // Fetch subject data if editing
    useEffect(() => {
        if (id) {
            fetchSubjectList().then((subjectData) => {
                const subject = subjectData.find((cr) => cr.subjectId === id);
                if (subject) {
                    setFormData(subject);
                    form.setFieldsValue(subject);
                }
            }).catch((error) => {
                console.error("Error fetching subject:", error);
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
                success = await updateSubject(formData);
                if (success) {
                    message.success("Cập nhật môn học thành công.");
                } else {
                    message.error("Lỗi cập nhật môn học.");
                }
            } else {
                success = await createSubject(formData);
                if (success) {
                    message.success("Tạo môn học thành công.");
                } else {
                    message.error("Lỗi tạo môn học.");
                }
            }
            if (success) {
                navigate('/admin/subjects');
            }
        } catch (error) {
            console.error("Error creating subject:", error);
            message.error("Lỗi tạo môn học.");
        }
    };

    return (
        <>
            <Title level={2} className="my-4">{id ? "Chỉnh sửa môn học" : "Thêm mới môn học"}</Title>

            <Form
                form={form}
                initialValues={formData}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Tên môn học"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên môn học!" }]}
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
                        <Button type="default" onClick={() => navigate('/admin/subjects')}>
                            Quay lại
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </>
    );
};

export default SubjectFormPage;
