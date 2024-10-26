import React from "react";
import { Input, Table, Typography } from 'antd';
import { SearchOutlined } from "@ant-design/icons";

const { Title } = Typography;

const SystemFeedbackManagementPage: React.FC = () => {

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
            render: (text: number) => text,
        },
        {
            title: 'Ngày',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: Date) => new Date(text).toLocaleDateString(),
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
                            // value={searchTerm}
                            // onChange={(e) => setSearchTerm(e.target.value)}
                            suffix={<SearchOutlined />}
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table
                    columns={columns}
                    // dataSource={filteredCategorys} 
                    rowKey="id"
                />
            </div>
        </>
    );
};

export default SystemFeedbackManagementPage;