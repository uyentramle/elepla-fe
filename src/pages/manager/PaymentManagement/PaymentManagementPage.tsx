import React, { useEffect, useMemo, useState } from "react";
import { SearchOutlined, } from '@ant-design/icons';
import { Input, Table, Select, Typography, Row, Col, Card, message, } from 'antd';
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
import { IViewListPayment, fetchListPayment, fetchRevenueByMonth, fetchRevenueByQuarter, fetchRevenueByYear } from "@/data/manager/UserPaymentData";
import { IViewListUserPackage, fetchUserPackageList } from "@/data/manager/UserPackageData";
import { IViewListServicePackage, fetchServicePackages } from "@/data/manager/ServicePackageData";
import { Link } from "react-router-dom";

const { Option } = Select;
const { Title } = Typography;
const COLORS = ['#FFBB28', '#55bfc7', '#e8744c', '#00C49F', '#9e5493', '#FF6666'];

const PaymentManagementPage: React.FC = () => {
    const [userPayments, setUserPayments] = useState<IViewListPayment[]>([]);
    const [userServices, setUserServices] = useState<IViewListUserPackage[]>([]);
    const [servicePackages, setServicePackages] = useState<IViewListServicePackage[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([]);
    // const [filterStatus, setFilterStatus] = useState<'Active' | 'Inactive' | 'All'>('All');
    const [filterPackage, setFilterPackage] = useState('All');
    const [timeFrame, setTimeFrame] = useState("month");

    const handleTimeFrameChange = (value: string) => {
        setTimeFrame(value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const payments = await fetchListPayment();
                const services = await fetchUserPackageList();
                const packages = await fetchServicePackages();
                setUserPayments(payments);
                setUserServices(services);
                setServicePackages(packages);

                let revenueResponse;
                const year = dayjs().year();
                if (timeFrame === "month") {
                    revenueResponse = await fetchRevenueByMonth(year);
                } else if (timeFrame === "quarter") {
                    revenueResponse = await fetchRevenueByQuarter(year);
                } else if (timeFrame === "year") {
                    revenueResponse = await fetchRevenueByYear();
                }
                setRevenueData(revenueResponse || []);
            } catch (error) {
                message.error('Lỗi khi tải dữ liệu từ server.');
            }
        };

        fetchData();
    }, [timeFrame]);

    const filteredUserPayments = userPayments.filter((c) => {
        const matchesSearch = `${c.fullName}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPackage =
            filterPackage === 'All' ||
            servicePackages.some(pkg => filterPackage === pkg.packageName && c.packageName === pkg.packageName);
        return matchesSearch && matchesPackage;
    });

    const packageDistribution = useMemo(() => {
        const counts = { Free: 0, Basic: 0, Premium: 0 };
        userServices.forEach(service => {
            const serviceDate = dayjs(service.startDate);
            console.log(`Checking service: ${service.packageName}, startDate: ${service.startDate}`); // Kiểm tra giá trị của packageName và startDate

            if (
                (timeFrame === "month" && serviceDate.isSame(dayjs(), "month")) ||
                (timeFrame === "quarter" && serviceDate.isAfter(dayjs().subtract(3, "month"))) ||
                (timeFrame === "year" && serviceDate.isAfter(dayjs().subtract(6, "month")))
            ) {
                if (service.packageName === 'Gói miễn phí') counts.Free++;
                if (service.packageName === 'Gói cơ bản') counts.Basic++;
                if (service.packageName === 'Gói cao cấp') counts.Premium++;
            }
        });
        const total = counts.Free + counts.Basic + counts.Premium;
        console.log('Counts:', counts);
        console.log('Total:', total);

        return [
            { name: 'Gói miễn phí', value: (counts.Free / total) * 100 },
            { name: 'Gói cơ bản', value: (counts.Basic / total) * 100 },
            { name: 'Gói cao cấp', value: (counts.Premium / total) * 100 },
        ];
    }, [userServices, timeFrame]);

    console.log('packageDistribution:', packageDistribution);

    const serviceStatus = useMemo(() => {
        const activeServices = userServices.filter(
            (service) =>
            ((timeFrame === "month" && dayjs(service.startDate).isSame(dayjs(), "month")) ||
                (timeFrame === "quarter" && dayjs(service.startDate).isAfter(dayjs().subtract(3, "month"))) ||
                (timeFrame === "year" && dayjs(service.startDate).isAfter(dayjs().subtract(6, "month"))))
        );
        return [
            { name: "Đang sử dụng", value: activeServices.filter((service) => service.isActivated).length },
            { name: "Đã hết hạn", value: activeServices.filter((service) => !service.isActivated && dayjs(service.endDate).isBefore(dayjs())).length },
            // { name: "Đã hủy", value: 0 },
        ];
    }, [userServices, timeFrame]);

    const columns = [
        {
            title: 'No.',
            dataIndex: '1',
            render: (_text: any, _record: any, index: number) => index + 1,
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'fullName',
            key: 'fullName',
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
            dataIndex: 'paymentId',
            key: 'paymentId',
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
            // render: (text: string, _record: any) => (
            // render: (text: string) => (
            //     // <span style={{ color: text === 'Thành công' ? 'green' : 'red' }}>
            //     <span>
            //         {text}
            //     </span>
            // ),
            render: (status: string) => {
                let statusText = '';
                let color = '';

                // Xử lý các trạng thái
                switch (status) {
                    case 'Paid':
                        statusText = 'Đã thanh toán';
                        color = 'green';
                        break;
                    case 'Failed':
                        statusText = 'Hủy thanh toán';
                        color = 'red';
                        break;
                    case 'Pending':
                        statusText = 'Đang chờ thanh toán';
                        color = 'orange';
                        break;
                    default:
                        statusText = 'Không xác định';
                        color = 'gray';
                }

                return <span style={{ color }}>{statusText}</span>;
            },
        },
    ];

    return (
        <>
            <Title level={2} className="my-4">Thống kê thanh toán</Title>

            <Row gutter={[16, 16]} className="mb-6">
                <Col span={24} className="mt-2">
                    <span className='mr-2'>Thống kê theo:</span>
                    <Select
                        defaultValue="month"
                        onChange={handleTimeFrameChange}
                        style={{ width: 200 }}
                    >
                        <Option value="month">1 tháng</Option>
                        <Option value="quarter">3 tháng</Option>
                        <Option value="year">năm</Option>
                    </Select>
                </Col>
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
                                    label={({ value }) => `${value.toFixed(2)}%`} // Định dạng số thập phân 2 chữ số
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
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="revenue" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Trạng thái dịch vụ">
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
                            onChange={(value) => setFilterPackage(value)}
                        >
                            <Option value="All">Tất cả các gói</Option>
                            {servicePackages
                                .filter(pkg => pkg.packageName !== 'Gói miễn phí')  // Loại bỏ gói miễn phí
                                .map(pkg => (
                                    <Option key={pkg.packageId} value={pkg.packageName}>
                                        {pkg.packageName}
                                    </Option>
                                ))
                            }
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