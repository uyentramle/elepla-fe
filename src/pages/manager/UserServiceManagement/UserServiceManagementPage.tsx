import React, { useState } from "react";
import { SearchOutlined, } from '@ant-design/icons';
import { Input, Table, Select, Typography } from 'antd';

import user_services_data from "@/data/manager/UserPackageData";

const { Option } = Select;
const { Title } = Typography;

const UserServiceManagementPage: React.FC = () => {
    const [userServices] = useState(user_services_data);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'Active' | 'Inactive' | 'All'>('All');

    const filteredUserServices = userServices.filter((c) => {
        const matchesSearch = `${c.username}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            filterStatus === 'All' ||
            (filterStatus === 'Active' && c.isActivated) ||
            (filterStatus === 'Inactive' && !c.isActivated);

        return matchesSearch && matchesStatus;
    });

    const columns = [
        {
            title: 'No.',
            dataIndex: '1',
            render: (_text: any, _record: any, index: number) => index + 1,
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Tên gói',
            dataIndex: 'packageName',
            key: 'packageName',
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActivated',
            key: 'isActivated',
            render: (isActivated: boolean) => (
                <span style={{ color: isActivated ? 'green' : 'red' }}>
                    {isActivated ? 'Đang sử dụng' : 'Đã hủy'}
                </span>
            ),
        },
    ];

    return (
        <>
            <Title level={2} className="my-4">Tất cả dịch vụ khách hàng mua</Title>
            <div className="my-4 flex justify-between">
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
                    <div>
                        <Select
                            id="status-filter"
                            className="w-48"
                            value={filterStatus}
                            onChange={(value) => setFilterStatus(value as 'Active' | 'Inactive' | 'All')}
                        >
                            <Option value="All">Tất cả</Option>
                            <Option value="Active">Đang sử dụng</Option>
                            <Option value="Inactive">Đã hủy</Option>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table columns={columns} dataSource={filteredUserServices} rowKey="id" />
            </div>
        </>
    );
};

export default UserServiceManagementPage;
