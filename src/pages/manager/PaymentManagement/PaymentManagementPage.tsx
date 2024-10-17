import React, { useState } from "react";
import { SearchOutlined, } from '@ant-design/icons';
import { Input, Table, Select, Typography } from 'antd';

import payment_data from "@/data/manager/UserPaymentData";

const { Option } = Select;
const { Title } = Typography;

const PaymentManagementPage: React.FC = () => {
    const [userPayments] = useState(payment_data);
    const [searchTerm, setSearchTerm] = useState('');
    // const [filterStatus, setFilterStatus] = useState<'Active' | 'Inactive' | 'All'>('All');
    const [filterPackage, setFilterPackage] = useState<'All' | 'Free' | 'Basic' | 'Premium'>('All');

    const filteredUserPayments = userPayments.filter((c) => {
        const matchesSearch = `${c.username}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPackage =
            filterPackage === 'All' ||
            (filterPackage === 'Free' && c.packageName === 'Gói miễn phí') ||
            (filterPackage === 'Basic' && c.packageName === 'Gói cơ bản') ||
            // (filterPackage === 'Standard' && c.packageName === 'Gói tiêu chuẩn') ||
            (filterPackage === 'Premium' && c.packageName === 'Gói cao cấp');
        return matchesSearch && matchesPackage;
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
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (totalAmount: number) => (
                <span>{totalAmount.toLocaleString()} đ</span>
            ),
        },
        {
            title: 'Mã giao dịch',
            dataIndex: 'transactionCode',
            key: 'transactionCode',
        },
        {
            title: 'Ngày thanh toán',
            dataIndex: 'paymentDate',
            key: 'paymentDate',
            render: (paymentDate: Date) => (
                <span>{new Date(paymentDate).toLocaleDateString()}</span>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
    ];

    return (
        <>
            <Title level={2} className="my-4">Thống kê thanh toán</Title>
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
                    {/* <div>
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
                    </div> */}
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table
                    columns={columns}
                    dataSource={filteredUserPayments}
                    rowKey={(record) => record.paymentId}
                />
            </div>
        </>
    );
};

export default PaymentManagementPage;