import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, TimePicker, Button, Modal, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography } from "antd";
import ReactQuill from "react-quill";
import { getPlanbookByCollectionId, Planbook } from '@/data/academy-staff/PlanbookData'; // Import API để lấy planbook
import { getCreatedPlanbookCollectionsByTeacherId, Collection } from '@/data/teacher/CollectionData'; // Import API lấy bộ sưu tập
import { getUserId } from '@/data/apiClient';

const { Title } = Typography;
const { Option } = Select;

const CreateEventPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({
        id: undefined,
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        className: "",
        planbookId: "",
    });
    const [collections, setCollections] = useState<Collection[]>([]); // Bộ sưu tập
    const [planbooks, setPlanbooks] = useState<Planbook[]>([]); // Danh sách kế hoạch giảng dạy
    const [selectedCollection, setSelectedCollection] = useState<string>(""); // Bộ sưu tập đã chọn
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal hiển thị chọn kế hoạch giảng dạy
    const navigate = useNavigate();
    const userId = getUserId();

    // Lấy danh sách bộ sưu tập từ API
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

    // Khi chọn bộ sưu tập, gọi API lấy kế hoạch giảng dạy
    const handleCollectionSelect = async (value: string) => {
        setSelectedCollection(value);
        try {
            const planbookData = await getPlanbookByCollectionId(value);
            setPlanbooks(planbookData);
        } catch (error) {
            console.error("Error fetching planbooks:", error);
        }
    };

    // Khi chọn một kế hoạch giảng dạy, cập nhật formData
    const handlePlanbookSelect = (value: string) => {
        setFormData((prevState) => ({
            ...prevState,
            planbookId: value,
        }));
    };

    const handleContentChange = (value: string) => {
        setFormData((prevState) => ({
            ...prevState,
            description: value,
        }));
    };

    const handleSubmit = (values: any) => {
        console.log('Form submitted:', values);
        navigate(-1); // Điều hướng quay lại trang trước
    };

    // Fetch dữ liệu khi component mount
    useEffect(() => {
        fetchCollections();
    }, [userId]);

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
                        <Input placeholder="Tiêu đề" />
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
                        <Button onClick={() => setIsModalOpen(true)}>Chọn kế hoạch giảng dạy</Button>
                        {/* Hiển thị kế hoạch đã chọn */}
                        {formData.planbookId && (
                            <div style={{ marginTop: '10px' }}>
                                <span><strong>Kế hoạch đã chọn: </strong>{planbooks.find(planbook => planbook.planbookId === formData.planbookId)?.title}</span>
                            </div>
                        )}
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

            {/* Modal chọn bộ sưu tập và kế hoạch giảng dạy */}
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
                                    // Lưu lại kế hoạch giảng dạy vào formData
                                    setFormData((prevState) => ({
                                        ...prevState,
                                        planbookId: formData.planbookId, // Lưu kế hoạch giảng dạy đã chọn
                                    }));
                                    setIsModalOpen(false); // Đóng Modal
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
