import React, { useEffect, ChangeEvent } from "react";
import { Button, Form, Input, message, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { ICurriculumFrameworkForm, createCurriculum, updateCurriculum, fetchCurriculumList } from '@/data/admin/CurriculumFramworkData';

const { Title } = Typography;

const CurriculumFrameworkFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const [formData, setFormData] = React.useState<ICurriculumFrameworkForm>({
        curriculumId: "",
        name: "",
        description: "",
    });
    const navigate = useNavigate();

    // Fetch curriculum data if editing
    useEffect(() => {
        if (id) {
            fetchCurriculumList().then((curriculumData) => {
                const curriculumFramework = curriculumData.find((cr) => cr.curriculumId === id);
                if (curriculumFramework) {
                    setFormData({
                        curriculumId: curriculumFramework.curriculumId,
                        name: curriculumFramework.name,
                        description: curriculumFramework.description,
                    });
                    form.setFieldsValue(curriculumFramework);
                }
            }).catch((error) => {
                console.error("Error fetching curriculum:", error);
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
                success = await updateCurriculum(formData);
                if (success) {
                    message.success('Cập nhật khung chương trình thành công');
                } else {
                    message.error('Lỗi cập nhật khung chương trình.');
                }
            } else {
                // Add new curriculum logic
                success = await createCurriculum(formData);
                if (success) {
                    message.success('Tạo khung chương trình thành công');
                } else {
                    message.error('Lỗi tạo khung chương trình.');
                }
            }
            if (success) navigate('/admin/curriculum-frameworks');
        } catch (error) {
            console.error('Error creating curriculum:', error);
            message.error('Lỗi tạo khung chương trình.');
        }
    };

    return (
        <>
            <Title level={2} className="my-4">{id ? "Chỉnh sửa khung chương trình" : "Thêm mới khung chương trình"}</Title>

            <Form
                form={form}
                initialValues={formData}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Tên chương trình"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên chương trình!" }]}
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

                <div className="pt-4">
                    <Form.Item>
                        <div className="flex space-x-4 justify-center">
                            <Button type="primary" htmlType="submit">
                                {id ? "Cập nhật" : "Thêm mới"}
                            </Button>
                            <Button type="default" onClick={() => navigate('/admin/curriculum-frameworks')}>
                                Quay lại
                            </Button>
                        </div>
                    </Form.Item>
                </div>
            </Form>
        </>
    );
};

export default CurriculumFrameworkFormPage;
