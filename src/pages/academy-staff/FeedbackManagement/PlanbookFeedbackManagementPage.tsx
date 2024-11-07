import React from "react";
import { Button, Input, Modal, Table, Typography, message, } from 'antd';
import { SearchOutlined, FlagFilled, FlagTwoTone, FlagOutlined, DeleteOutlined, } from "@ant-design/icons";
import feedbackData, { IFeedbackData } from "@/data/academy-staff/FeedbackData";

const { Title } = Typography;

const PlanbookFeedbackManagementPage: React.FC = () => {
    const [feedbacks, setFeedbacks] = React.useState<IFeedbackData[]>(feedbackData);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
    const [feedbackToDelete, setFeedbackToDelete] = React.useState<IFeedbackData | null>(null);
    
    const filteredFeedbacks = feedbacks.filter((f) => {
        const matchesSearch = `${f.planbookName} ${f.username}`.toLowerCase().includes(searchTerm.toLowerCase());
        return f.type === 'planbook' && matchesSearch; 
    });    

    const handleFlagToggle = (id: string) => {
        setFeedbacks((prevFeedbacks) =>
            prevFeedbacks.map((feedback) =>
                feedback.id === id ? { ...feedback, isFlagged: !feedback.isFlagged } : feedback
            )
        );
    };

    const handleDeleteFeedback = async () => {
        try {
            if (!feedbackToDelete) return;
            setDeleteModalVisible(false);

            const response = { data: { success: true } };
            if (response.data.success) {
                message.success('Đã xóa đánh giá thành công');
                const updatedFeedbacks = feedbacks.filter((feedback) => feedback.id !== feedbackToDelete.id);
                setFeedbacks(updatedFeedbacks);
            } else {
                message.error('Không xóa được đánh giá');
            }
        } catch (error) {
            console.error('Lỗi khi xóa đánh giá:', error);
            message.error('Không xóa được đánh giá');
        }
    };

    const handleDeleteModal = (feedback: IFeedbackData) => {
        setFeedbackToDelete(feedback);
        setDeleteModalVisible(true);
    };

    const handleCancelDeleteModal = () => {
        setDeleteModalVisible(false);
        setFeedbackToDelete(null);
    };

    const columns = [
        {
            title: 'No.',
            dataIndex: '1',
            render: (_text: any, _record: any, index: number) => index + 1,
        },
        {
            title: 'Tên kế hoạch giảng dạy',
            dataIndex: 'planbookName',
            key: 'planbookName',
            render: (text: string) => <span className="font-semibold">{text}</span>,
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'username',
            key: 'username',
            render: (text: string) => <span className="font-semibold">{text}</span>,
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
            render: (text: string) => <span>{text}</span>,
        },
        {
            title: 'Điểm',
            dataIndex: 'rate',
            key: 'rate',
            render: (text: number) => text + "/5",
        },
        {
            title: 'Ngày',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: Date) => new Date(text).toLocaleDateString(),
        },
        {
            title: <FlagFilled />,
            dataIndex: 'isFlagged',
            key: 'isFlagged',
            render: (text: boolean, record: IFeedbackData) => (
                <span onClick={() => handleFlagToggle(record.id)}>
                    {text ? <FlagTwoTone style={{ color: 'red' }} /> : <FlagOutlined />}
                </span>
            ),
        },
        {
            title: 'Xóa',
            key: 'delete',
            render: (_text: any, record: IFeedbackData) => (
                <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    className="bg-red-500"
                    onClick={() => handleDeleteModal(record)}
                >
                    Xóa
                </Button>
            ),
        },
    ];

    return (
        <>
            <Title level={2} className="my-4">Đánh giá - phản hồi kế hoạch giảng dạy</Title>

            <div className="mb-4 flex justify-between">
                <div className="flex">
                    <div className="relative mr-4">
                        <Input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            suffix={<SearchOutlined />}
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table
                    columns={columns}
                    dataSource={filteredFeedbacks}
                    rowKey="id"
                />
            </div>

            <Modal
                title="Xác nhận xóa đánh giá"
                open={deleteModalVisible}
                onOk={handleDeleteFeedback}
                onCancel={handleCancelDeleteModal}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn xóa đánh giá này?</p>
            </Modal>
        </>
    );
};

export default PlanbookFeedbackManagementPage;