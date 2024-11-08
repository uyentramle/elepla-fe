import React, { useEffect, ChangeEvent } from "react";
import { Button, Form, Input, Switch, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import curriculumData, { ICurriculumFramework } from '@/data/admin/CurriculumFramworkData';

const { Title } = Typography;

const CurriculumFrameworkFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const [formData, setFormData] = React.useState<ICurriculumFramework>({
        id: "",
        name: "",
        description: "",
        is_approved: true,
    });
    const navigate = useNavigate();

    // Fetch curriculum data if editing
    useEffect(() => {
        if (id) {
            const curriculumFramework = curriculumData.find((cr) => cr.id === id);
            if (curriculumFramework) {
                setFormData(curriculumFramework);
                form.setFieldsValue(curriculumFramework);
            }
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

    // Handle switch toggle
    const handleSwitchChange = (checked: boolean) => {
        setFormData((prevState) => ({
            ...prevState,
            is_approved: checked,
        }));
    };

    const handleSubmit = () => {
        if (id) {
            // Edit logic
            const updatedCurriculums = curriculumData.map((curriculumFramework) =>
                curriculumFramework.id === id
                    ? { ...curriculumFramework, ...formData }
                    : curriculumFramework
            );
            console.log("Updated Curriculums:", updatedCurriculums);
        } else {
            // Add new curriculum logic
            const newCurriculumFramework: ICurriculumFramework = {
                ...formData,
            };
            console.log("New CurriculumFramework:", newCurriculumFramework);
            curriculumData.push(newCurriculumFramework);
        }
        navigate(-1);
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

                <Form.Item
                    label="Trạng thái"
                    name="is_approved"
                    valuePropName="checked"
                >
                    <Switch
                        checked={formData.is_approved}
                        onChange={handleSwitchChange}
                    />
                </Form.Item>

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
            </Form>
        </>
    );
};

export default CurriculumFrameworkFormPage;
