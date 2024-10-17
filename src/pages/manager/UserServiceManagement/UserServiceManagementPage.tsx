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
    const [filterPackage, setFilterPackage] = useState<'All' | 'Free' | 'Basic' | 'Premium'>('All');

    const filteredUserServices = userServices.filter((c) => {
        const matchesSearch = `${c.username}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            filterStatus === 'All' ||
            (filterStatus === 'Active' && c.isActivated) ||
            (filterStatus === 'Inactive' && !c.isActivated);

        const matchesPackage =
            filterPackage === 'All' ||
            (filterPackage === 'Free' && c.packageName === 'Gói miễn phí') ||
            (filterPackage === 'Basic' && c.packageName === 'Gói cơ bản') ||
            // (filterPackage === 'Standard' && c.packageName === 'Gói tiêu chuẩn') ||
            (filterPackage === 'Premium' && c.packageName === 'Gói cao cấp');
        return matchesSearch && matchesStatus && matchesPackage;
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
            render: (text: string) => <span className="font-semibold">{text}</span>,
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
            render: (startDate: Date) => (
                <span>{new Date(startDate).toLocaleDateString()}</span>
            ),
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (endDate: Date) => (
                <span>{new Date(endDate).toLocaleDateString()}</span>
            ),
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
                    <div className="mr-4">
                        <Select
                            id="package-filter"
                            className="w-48"
                            value={filterPackage}
                            onChange={(value) => setFilterPackage(value as 'All' | 'Free' | 'Basic' | 'Premium')}
                        >
                            <Option value="All">Tất cả các gói</Option>
                            <Option value="Free">Gói miễn phí</Option>
                            <Option value="Basic">Gói cơ bản</Option>
                            <Option value="Premium">Gói cao cấp</Option>
                        </Select>
                    </div>
                    <div className="mr-4">
                        <Select
                            id="status-filter"
                            className="w-48"
                            value={filterStatus}
                            onChange={(value) => setFilterStatus(value as 'Active' | 'Inactive' | 'All')}
                        >
                            <Option value="All">Tất cả trạng thái</Option>
                            <Option value="Active">Đang sử dụng</Option>
                            <Option value="Inactive">Đã hủy</Option>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table
                    columns={columns}
                    dataSource={filteredUserServices}
                    rowKey={(record) => record.userId}
                    pagination={{ pageSize: 10 }}
                />
            </div>
        </>
    );
};

export default UserServiceManagementPage;
