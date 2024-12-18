import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, TimePicker, Button, Modal, Select, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography } from "antd";
import ReactQuill from "react-quill";
import dayjs from "dayjs";
import { getPlanbookByCollectionId, Planbook } from '@/data/academy-staff/PlanbookData';
import { getCreatedPlanbookCollectionsByTeacherId, Collection } from '@/data/teacher/CollectionData';
import { getUserId } from '@/data/apiClient';
import { createTeachingSchedule, fetchTeachingScheduleById, updateTeachingSchedule } from "@/data/client/ScheduleData";


const { Title } = Typography;
const { Option } = Select;

const CreateEventPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({
        id: "",
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        className: "",
        planbookId: "",
        planbookTitle: "",
    });

    const [collections, setCollections] = useState<Collection[]>([]);
    const [planbooks, setPlanbooks] = useState<Planbook[]>([]);
    const [selectedCollection, setSelectedCollection] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const userId = getUserId();

    const fetchEventDetails = async () => {
        if (id) {
            try {
                const schedule = await fetchTeachingScheduleById(id);
                setFormData({
                    ...schedule,
                    description: schedule.description || "",
                    className: schedule.className || "",
                    planbookId: schedule.planbookId || "",
                    planbookTitle : schedule.planbookTitle || "",
                });
                
                // Lấy thông tin chi tiết của planbook đã chọn
                const selectedPlanbook = planbooks.find(planbook => planbook.planbookId === schedule.planbookId);
                
                form.setFieldsValue({
                    id: schedule.id,
                    title: schedule.title,
                    date: schedule.date ? dayjs(schedule.date).add(1, 'day') : null,
                    startTime: schedule.startTime ? dayjs(schedule.startTime, "HH:mm") : null,
                    endTime: schedule.endTime ? dayjs(schedule.endTime, "HH:mm") : null,
                    className: schedule.className || "",
                    planbookId: schedule.planbookId || "",
                    planbookTitle: selectedPlanbook ? selectedPlanbook.title : "", // Hiển thị tên planbook đã chọn
                    teacher: schedule.teacher || "",
                    description: schedule.description || "",
                });
            } catch (error) {
                console.error("Error fetching event details:", error);
                message.error("Không thể tải thông tin sự kiện. Vui lòng thử lại.");
            }
        }
    };

    const fetchCollections = async () => {
        if (userId) {
            try {
                const collectionsData = await getCreatedPlanbookCollectionsByTeacherId(userId);
                setCollections(collectionsData);
            } catch (error) {
                console.error("Error fetching collections:", error);
            }
        }
    };

    const handleCollectionSelect = async (value: string) => {
        setSelectedCollection(value);
        try {
            const planbookData = await getPlanbookByCollectionId(value);
            setPlanbooks(planbookData);
        } catch (error) {
            console.error("Error fetching planbooks:", error);
        }
    };

const handlePlanbookSelect = (value: string) => {
    setFormData((prevState) => {
        const selectedPlanbook = planbooks.find(planbook => planbook.planbookId === value);
        return {
            ...prevState,
            planbookId: value,
            planbookTitle: selectedPlanbook ? selectedPlanbook.title : "", // Cập nhật tên planbook
        };
    });
};

    const handleContentChange = (value: string) => {
        setFormData((prevState) => ({
            ...prevState,
            description: value,
        }));
    };

  const handleSubmit = async (values: any) => {
    try {
        if (!values.date) {
            message.error("Vui lòng chọn ngày!");
            return;
        }

        // Sử dụng múi giờ hiện tại (múi giờ của người dùng)
        const localDate = values.date.tz(dayjs.tz.guess()).format("YYYY-MM-DD");

        const scheduleData = {
            scheduleId: id || "",
            title: values.title,
            description: formData.description,
            date: localDate, // Sử dụng ngày với múi giờ của người dùng
            startTime: values.startTime.format("HH:mm"),
            endTime: values.endTime.format("HH:mm"),
            className: values.className,
            teacherId: userId || "",
            planbookId: formData.planbookId || "",
        };

        if (id) {
            await updateTeachingSchedule(scheduleData);
            message.success("Sự kiện đã được cập nhật thành công!");
        } else {
            await createTeachingSchedule(scheduleData);
            message.success("Sự kiện đã được tạo thành công!");
        }
        navigate(-1);
    } catch (error) {
        console.error("Error submitting form:", error);
        message.error("Không thể lưu thông tin sự kiện. Vui lòng thử lại.");
    }
};


    useEffect(() => {
        if (id) {
            fetchEventDetails();
        }
        fetchCollections();
    }, [id, userId]);

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
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                        <Input placeholder="Tiêu đề" />
                    </Form.Item>

                    <div className="flex" style={{ gap: '30px' }}>
                        <Form.Item
                            label="Ngày"
                            name="date"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}>
                            <DatePicker
                                format="YYYY-MM-DD"
                                style={{ width: '100%' }}
                                onChange={(date) => form.setFieldsValue({ date })}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Giờ bắt đầu"
                            name="startTime"
                            rules={[{ required: true, message: 'Vui lòng nhập thời gian bắt đầu!' }]}>
                            <TimePicker format="HH:mm" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="Giờ kết thúc"
                            name="endTime"
                            rules={[{ required: true, message: 'Vui lòng nhập thời gian kết thúc!' }]}>
                            <TimePicker format="HH:mm" style={{ width: '100%' }} />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="Tên lớp"
                        name="className">
                        <Input placeholder="Tên lớp" />
                    </Form.Item>

                    <Form.Item label="Liên kết kế hoạch giảng dạy" name="planbookId">
                        <Button onClick={() => setIsModalOpen(true)}>Chọn kế hoạch giảng dạy</Button>
                        {/* Hiển thị kế hoạch đã chọn */}
                        {formData.planbookId && (
                            <div style={{ marginTop: '10px' }}>
                                <span><strong>Kế hoạch đã chọn: </strong>{formData.planbookTitle}</span>
                            </div>
                        )}
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description">
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

            <Modal
                title="Chọn kế hoạch giảng dạy"
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <div>
                    <p>Chọn bộ sưu tập:</p>
                    <Select
                        placeholder="Chọn bộ sưu tập"
                        style={{ width: "100%" }}
                        onChange={handleCollectionSelect}
                    >
                        {collections.map((collection) => (
                            <Option key={collection.collectionId} value={collection.collectionId}>
                                {collection.collectionName}
                            </Option>
                        ))}
                    </Select>
                </div>

                {selectedCollection && (
                    <div>
                        <p>Chọn kế hoạch giảng dạy:</p>
                        <Select
                            placeholder="Chọn kế hoạch giảng dạy"
                            style={{ width: "100%" }}
                            onChange={handlePlanbookSelect}
                        >
                            {planbooks.map((planbook) => (
                                <Option key={planbook.planbookId} value={planbook.planbookId}>
                                    {planbook.title}
                                </Option>
                            ))}
                        </Select>
                    </div>
                )}

                <div className="mt-4">
                    <Button 
                        type="primary" 
                        onClick={() => {
                            if (formData.planbookId) {
                                setFormData((prevState) => ({
                                    ...prevState,
                                    planbookId: formData.planbookId,
                                }));
                                setIsModalOpen(false);
                            }
                        }}
                    >
                        OK
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default CreateEventPage;
