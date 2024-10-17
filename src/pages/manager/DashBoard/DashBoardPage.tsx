import React, { useMemo, useState } from 'react';
import { Row, Col, Card, Statistic, List, Typography, } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from 'recharts';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import payment_data from "@/data/manager/UserPaymentData";
import user_services_data from "@/data/manager/UserPackageData";

const { Title, Text } = Typography;
const COLORS = ['#FFBB28', '#55bfc7', '#e8744c', '#00C49F', '#9e5493', '#FF6666'];


const DashBoardManagerPage: React.FC = () => {
    const [userPayments] = useState(payment_data);
    const [userServices] = useState(user_services_data);

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

    const packageStatistics = useMemo(() => {
        const packageCount: { [key: string]: { name: string; count: number; price: number } } = {};

        userServices.forEach((service) => {
            if (!packageCount[service.packageId]) {
                const packageInfo = userPayments.find(p => p.packageId === service.packageId);
                packageCount[service.packageId] = {
                    name: service.packageName,
                    count: 1,
                    price: packageInfo?.totalAmount || 0,
                };
            } else {
                packageCount[service.packageId].count++;
            }
        });

        return Object.values(packageCount).sort((a, b) => b.count - a.count);
    }, [userServices, userPayments]);

    return (
        <>
            <Title level={2} className="my-4">Bảng điều khiển</Title>

            <Row gutter={[16, 16]} className="mb-6 pt-2">
                <Col span={8}>
                    <Card className="shadow-md bg-green-100">
                        <Statistic
                            title="Dịch vụ khách hàng đang sử dụng"
                            value={
                                userServices.filter(service =>
                                    service.isActivated).length
                            } />
                        <div className="mt-2 flex items-center justify-between">
                            <Link to={"/manager/user-services"} ><CaretRightOutlined /> Xem chi tiết</Link>
                        </div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card className="shadow-md bg-purple-100">
                        <Statistic
                            title="Người dùng mua gói trong tháng"
                            value={
                                userPayments.filter(payment =>
                                    dayjs(payment.paymentDate)
                                        .isSame(dayjs(), 'month')).length
                            } />
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-green-500">Tăng 1.3% so với tuần trước</span>
                            <Link to={"#"} ><CaretRightOutlined /> Xem chi tiết</Link>
                        </div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card className="shadow-md bg-red-100">
                        <Statistic
                            title="Gói sắp hết hạn trong tháng"
                            value={
                                userServices.filter(service =>
                                    dayjs(service.endDate).isSame(dayjs(), 'month')
                                    && service.isActivated).length
                            } />
                        <div className="mt-2 flex items-center justify-between">
                            <Link to={"#"} ><CaretRightOutlined /> Xem chi tiết</Link>
                        </div>
                    </Card>
                </Col>
            </Row>

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

            <Row gutter={[16, 16]} className="mt-2">
                <Col span={24}>
                    <Card
                        title="Thống kê gói dịch vụ bán chạy"
                        extra={<a href="/manager/service-packages"><CaretRightOutlined /> Quản lý gói dịch vụ</a>}
                    >
                        <List.Item>
                            <div
                                style={{
                                    display: 'flex',
                                    width: '100%',
                                    alignItems: 'center',
                                }}
                            >
                                <div style={{ flex: '1 1 30px' }}>
                                    <Text strong>No. </Text>
                                </div>
                                <div style={{ flex: '1 1 350px' }}>
                                    <Text strong>Tên gói</Text>
                                </div>
                                <div style={{ flex: '1 1 150px' }}>
                                    <Text strong>Giá</Text>
                                </div>
                                <div style={{ flex: '1 1 150px' }}>
                                    <Text strong>Số lượng người dùng</Text>
                                </div>
                            </div>
                        </List.Item>
                        {packageStatistics.length > 0 ? (
                            <List
                                itemLayout="vertical"
                                dataSource={packageStatistics}
                                renderItem={(item, index) => (
                                    <List.Item>
                                        <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                            <div style={{ flex: '0 1 30px' }}>
                                                <Text strong>{index + 1}</Text>
                                            </div>
                                            <div style={{ flex: '1 1 350px', paddingLeft: '10px' }}>
                                                <Text strong>{item.name}</Text>
                                            </div>
                                            <div style={{ flex: '1 1 150px' }}>
                                                {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                            </div>
                                            <div style={{ flex: '1 1 150px' }}>
                                                {item.count}
                                            </div>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Text>Không có dữ liệu.</Text>
                        )}
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default DashBoardManagerPage;
