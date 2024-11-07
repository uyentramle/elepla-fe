import React from "react";
import { Input, Table, Typography } from 'antd';
import { SearchOutlined, FlagFilled, FlagTwoTone, FlagOutlined } from "@ant-design/icons";
import feedbackData, { IFeedbackData } from "@/data/academy-staff/FeedbackData";

const { Title } = Typography;

const SystemFeedbackManagementPage: React.FC = () => {
    const [feedbacks, setFeedbacks] = React.useState<IFeedbackData[]>(feedbackData);
    const [searchTerm, setSearchTerm] = React.useState('');
    
    const filteredFeedbacks = feedbacks.filter((f) => {
        const matchesSearch = `${f.planbookName} ${f.username}`.toLowerCase().includes(searchTerm.toLowerCase());
        return f.type === 'system' && matchesSearch; 
    });    

    const handleFlagToggle = (id: string) => {
        setFeedbacks((prevFeedbacks) =>
            prevFeedbacks.map((feedback) =>
                feedback.id === id ? { ...feedback, isFlagged: !feedback.isFlagged } : feedback
            )
        );
    };

    const columns = [
        {
            title: 'No.',
            dataIndex: '1',
            render: (_text: any, _record: any, index: number) => index + 1,
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
    ];

    return (
        <>
            <Title level={2} className="my-4">Đánh giá - phản hồi hệ thống</Title>

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
        </>
    );
};

export default SystemFeedbackManagementPage;