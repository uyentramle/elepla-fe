import React, { useMemo, useState } from "react";
import { SearchOutlined, } from '@ant-design/icons';
import { Input, Table, Select, Typography, Row, Col, Card, } from 'antd';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import dayjs from 'dayjs';
import payment_data from "@/data/manager/UserPaymentData";
import user_services_data from "@/data/manager/UserPackageData";
import { Link } from "react-router-dom";

const { Option } = Select;
const { Title } = Typography;
const COLORS = ['#FFBB28', '#55bfc7', '#e8744c', '#00C49F', '#9e5493', '#FF6666'];

const PaymentManagementPage: React.FC = () => {
    const [userPayments] = useState(payment_data);
    const [userServices] = useState(user_services_data);
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

    const packageDistribution = useMemo(() => {
        const counts = { Free: 0, Basic: 0, Premium: 0 };
        userServices.forEach(service => {
            // if (service.packageName === 'Gói miễn phí') counts.Free++;
            if (service.packageName === 'Gói cơ bản') counts.Basic++;
            if (service.packageName === 'Gói cao cấp') counts.Premium++;
        });
        const total = counts.Free + counts.Basic + counts.Premium;
        return [
            // { name: 'Gói miễn phí', value: (counts.Free / total) * 100 },
            { name: 'Gói cơ bản', value: (counts.Basic / total) * 100 },
            { name: 'Gói cao cấp', value: (counts.Premium / total) * 100 },
        ];
    }, [userServices]);

    const lastThreeMonths = Array.from({ length: 3 }, (_, i) => dayjs().subtract(i, 'month').format('MMMM YYYY')).reverse();
    const revenueData = lastThreeMonths.map((month) => {
        const totalRevenue = userPayments
            .filter(payment => dayjs(payment.paymentDate).format('MMMM YYYY') === month)
            .reduce((sum, payment) => sum + payment.totalAmount, 0);
        return { month, revenue: totalRevenue };
    });

    const serviceStatus = [
        { name: 'Đang sử dụng', value: userServices.filter(service => service.isActivated).length },
        { name: 'Đã hết hạn', value: userServices.filter(service => !service.isActivated && dayjs(service.endDate).isBefore(dayjs())).length },
        { name: 'Đã hủy', value: 0 }  // Placeholder for canceled services
    ];

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
            render: (text: string, record: any) =>
                <Link to={`/manager/payments/detail/${record.paymentId}`}><b>{text}</b></Link>,
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

            <Row gutter={[16, 16]} className="mb-6">
                <Col span={8}>
                    <Card title="Tỉ lệ gói dịch vụ">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={packageDistribution}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    label
                                >
                                    {packageDistribution.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col span={8}>
                    <Card title="Thống kê doanh thu">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={revenueData}
                                margin={{
                                    top: 5, right: 5, left: 0, bottom: 0
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="revenue" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Trạng thái dịch vụ trong tháng">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={serviceStatus}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#ffc658"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label
                                >
                                    {serviceStatus.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length + 3]}
                                        />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            <Title level={4} className="my-4">Lịch sử thanh toán</Title>

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