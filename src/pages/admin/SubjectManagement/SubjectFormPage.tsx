import React, { useEffect, ChangeEvent } from "react";
import { Button, Form, Input, Switch, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import subjectData, { ISubject } from "@/data/admin/SubjectData";

const { Title } = Typography;

const SubjectFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const [formData, setFormData] = React.useState<ISubject>({
        id: "",
        name: "",
        description: "",
        is_approved: true,
    });
    const navigate = useNavigate();

    // Fetch subject data if editing
    useEffect(() => {
        if (id) {
            const subject = subjectData.find((cr) => cr.id === id);
            if (subject) {
                setFormData(subject);
                form.setFieldsValue(subject);
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
            const updatedSubjects = subjectData.map((subject) =>
                subject.id === id
                    ? { ...subject, ...formData }
                    : subject
            );
            console.log("Updated Subjects:", updatedSubjects);
        } else {
            // Add new subject logic
            const newSubject: ISubject = {
                ...formData,
            };
            console.log("New Subject:", newSubject);
            subjectData.push(newSubject);
        }
        navigate(-1);
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
