//EventFormPage.tsx
import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, TimePicker, Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography } from "antd";
import ReactQuill from "react-quill";
import dayjs from 'dayjs';
import event_data, { IScheduleForm } from '@/data/client/ScheduleData';

const { Title } = Typography;

const CreateEventPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const [formData, setFormData] = useState<IScheduleForm>({
        id: undefined,
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        className: "",
        planbookId: "",
    });
    const navigate = useNavigate();

    const formatDate = (date: dayjs.Dayjs | undefined) => {
        return date ? date.format("YYYY-MM-DD") : "";
    };

    useEffect(() => {
        if (id) {
            const event = event_data.find((e) => e.id === id);
            if (event) {
                setFormData({
                    ...event,
                    date: formatDate(dayjs(event.date, "YYYY-MM-DD")),
                    startTime: dayjs(event.startTime, "HH:mm").format("HH:mm"),
                    endTime: dayjs(event.endTime, "HH:mm").format("HH:mm"),
                });
                form.setFieldsValue({
                    ...event,
                    date: dayjs(event.date, "YYYY-MM-DD"),
                    startTime: dayjs(event.startTime, "HH:mm"),
                    endTime: dayjs(event.endTime, "HH:mm"),
                });
            }
        }
    }, [id, form]);
    const handleContentChange = (value: string) => {
        setFormData((prevState) => ({
            ...prevState,
            description: value,
        }));
    };

    const handleSubmit = (values: IScheduleForm) => {
        console.log('Form submitted:', values);
        // Logic cập nhật sự kiện hoặc lưu thông tin mới
        navigate(-1); // Điều hướng quay lại trang trước
    };

    return (
        <>
            <div className="container">
                <Title level={2} className="my-4">
                    {id ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện'}
                </Title>
                <Form
                    form={form}
                    initialValues={formData}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    >
                        <Input
                            placeholder="Tiêu đề"
                        />
                    </Form.Item>

                    <div className="flex" style={{ gap: '30px' }}>
                        <Form.Item
                            label="Ngày"
                            name="date"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                        >
                            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="Giờ bắt đầu"
                            name="startTime"
                            rules={[{ required: true, message: 'Vui lòng nhập thời gian bắt đầu!' }]}
                        >
                            <TimePicker format="HH:mm" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="Giờ kết thúc"
                            name="endTime"
                            rules={[{ required: true, message: 'Vui lòng nhập thời gian kết thúc!' }]}
                        >
                            <TimePicker format="HH:mm" style={{ width: '100%' }} />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="Tên lớp"
                        name="className"
                    >
                        <Input placeholder="Tên lớp" />
                    </Form.Item>

                    <Form.Item
                        label="Liên kết kế hoạch giảng dạy"
                        name="planbookId"
                    >
                        <Input placeholder="Chọn kế hoạch giảng dạy của bạn" />
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

                    <Form.Item className="pt-4">
                        <Button type="primary" htmlType="submit" className='mr-4'>
                            Lưu
                        </Button>
                        <Button
                            type="default"
                            onClick={() => navigate(-1)}
                        >
                            Quay lại
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default CreateEventPage;
