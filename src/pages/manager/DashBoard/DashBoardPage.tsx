import React, { useMemo, useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, List, Typography, Select, message } from 'antd';
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
import { IViewListPayment, fetchListPayment, fetchRevenueByMonth, fetchRevenueByQuarter, fetchRevenueByYear } from "@/data/manager/UserPaymentData";
import { IViewListUserPackage, fetchUserPackageList } from "@/data/manager/UserPackageData";

const { Title, Text } = Typography;
const COLORS = ['#FFBB28', '#55bfc7', '#e8744c', '#00C49F', '#9e5493', '#FF6666'];
const { Option } = Select;

const DashBoardManagerPage: React.FC = () => {
    const [userPayments, setUserPayments] = useState<IViewListPayment[]>([]);
    const [userServices, setUserServices] = useState<IViewListUserPackage[]>([]);
    const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([]);
    const [timeFrame, setTimeFrame] = useState("month");

    const handleTimeFrameChange = (value: string) => {
        setTimeFrame(value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const payments = await fetchListPayment();
                const services = await fetchUserPackageList();
                setUserPayments(payments);
                setUserServices(services);

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

    const packageDistribution = useMemo(() => {
        const counts = { Free: 0, Basic: 0, Premium: 0 };
        userServices.forEach(service => {
            const serviceDate = dayjs(service.startDate);
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
        return [
            { name: 'Gói miễn phí', value: (counts.Free / total) * 100 },
            { name: 'Gói cơ bản', value: (counts.Basic / total) * 100 },
            { name: 'Gói cao cấp', value: (counts.Premium / total) * 100 },
        ];
    }, [userServices, timeFrame]);

    // const revenueData = useMemo(() => {
    //     if (timeFrame === "month") {
    //         const lastMonths = Array.from({ length: 1 }, (_, i) => dayjs().subtract(i, 'month').format('MMMM YYYY')).reverse();
    //         return lastMonths.map(month => ({
    //             month,
    //             revenue: userPayments
    //                 .filter(payment => dayjs(payment.paymentDate).format('MMMM YYYY') === month)
    //                 .reduce((sum, payment) => sum + payment.totalAmount, 0)
    //         }));
    //     } else if (timeFrame === "quarter") {
    //         const lastThreeMonths = Array.from({ length: 3 }, (_, i) => dayjs().subtract(i, 'month').format('MMMM YYYY')).reverse();
    //         return lastThreeMonths.map(month => ({
    //             month,
    //             revenue: userPayments
    //                 .filter(payment => dayjs(payment.paymentDate).format('MMMM YYYY') === month)
    //                 .reduce((sum, payment) => sum + payment.totalAmount, 0)
    //         }));
    //     } else if (timeFrame === "year") {
    //         const lastSixMonths = Array.from({ length: 6 }, (_, i) => dayjs().subtract(i, 'month').format('MMMM YYYY')).reverse();
    //         return lastSixMonths.map(month => ({
    //             month,
    //             revenue: userPayments
    //                 .filter(payment => dayjs(payment.paymentDate).format('MMMM YYYY') === month)
    //                 .reduce((sum, payment) => sum + payment.totalAmount, 0)
    //         }));
    //     }
    // }, [userPayments, timeFrame]);

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
                            {/* <span className="text-green-500">Tăng 1.3% so với tuần trước</span> */}
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
                                    // alignItems: 'center',
                                    textAlign: 'left',
                                }}
                            >
                                <div style={{ flex: '0 1 30px' }}>
                                    <Text strong>No. </Text>
                                </div>
                                <div style={{ flex: '1 1 350px', paddingLeft: '20px' }}>
                                    <Text strong>Tên gói</Text>
                                </div>
                                {/* <div style={{ flex: '1 1 150px' }}>
                                    <Text strong>Giá</Text>
                                </div> */}
                                <div style={{ flex: '1 1 150px' }}>
                                    <Text strong>Số lượng người dùng</Text>
                                </div>
                            </div>
                        </List.Item>
                        {/* {packageStatistics.length > 0 ? ( */}
                        <List
                            itemLayout="vertical"
                            dataSource={packageStatistics}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <div style={{ display: 'flex', width: '100%', textAlign: 'left' }}>
                                        <div style={{ flex: '0 1 30px' }}>
                                            <Text strong>{index + 1}</Text>
                                        </div>
                                        <div style={{ flex: '1 1 350px', paddingLeft: '20px' }}>
                                            <Text strong>{item.name}</Text>
                                        </div>
                                        {/* <div style={{ flex: '1 1 150px' }}>
                                            {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </div> */}
                                        <div style={{ flex: '1 1 150px' }}>
                                            {item.count}
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                        {/* ) : (
                            <Text>Không có dữ liệu.</Text>
                        )} */}
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default DashBoardManagerPage;
