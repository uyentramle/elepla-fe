// UserServiceManagementPage.tsx
import React, { useEffect, useState } from "react";
import {
    SearchOutlined,
    // CaretRightOutlined, 
} from '@ant-design/icons';
import { Input, Table, Select, Typography, Row, Col, Card, Statistic, Spin } from 'antd';
// import { Link } from "react-router-dom";
import dayjs from 'dayjs';

import { fetchUserPackageList, IViewListUserPackage } from "@/data/manager/UserPackageData";
import { fetchListPayment, IViewListPayment } from "@/data/manager/UserPaymentData";
import { fetchServicePackages, IViewListServicePackage } from '@/data/manager/ServicePackageData';

const { Option } = Select;
const { Title } = Typography;

const UserServiceManagementPage: React.FC = () => {
    const [userServices, setUserServices] = useState<IViewListUserPackage[]>([]);
    const [userPayments, setUserPayments] = useState<IViewListPayment[]>([]);
    const [servicePackages, setServicePackages] = useState<IViewListServicePackage[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'Active' | 'Inactive' | 'All'>('All');
    const [filterPackage, setFilterPackage] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedUserServices = await fetchUserPackageList();
                const fetchedUserPayments = await fetchListPayment();
                const packages = await fetchServicePackages();

                if (Array.isArray(fetchedUserServices)) {
                    setUserServices(fetchedUserServices);
                }

                if (fetchedUserPayments) {
                    setUserPayments(fetchedUserPayments);
                }

                if (packages) {
                    setServicePackages(packages);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredUserServices = userServices.filter((c) => {
        const matchesSearch = `${c.fullName}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            filterStatus === 'All' ||
            (filterStatus === 'Active' && c.isActive) ||
            (filterStatus === 'Inactive' && !c.isActive);

        // const matchesPackage =
        //     filterPackage === 'All' ||
        //     servicePackages.some(pkg => filterPackage === pkg.packageName && c.packageName === pkg.packageName);
        const matchesPackage =
            filterPackage === 'All' || c.packageName === filterPackage;

        return matchesSearch && matchesStatus && matchesPackage;
    });

    const columns = [
        {
            title: 'No.',
            key: 'index',
            render: (_text: any, _record: any, index: number) => index + 1,
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'fullName',
            key: 'fullName',
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
            render: (startDate: string) => (
                <span>{dayjs(startDate).format('DD/MM/YYYY')}</span>
            ),
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (endDate: string) => (
                <span>{dayjs(endDate).format('DD/MM/YYYY')}</span>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActivated',
            key: 'isActivated',
            // render: (isActivated: boolean, _record: any) => (
            //     <span style={{ color: isActivated ? 'green' : dayjs().isAfter(dayjs(_record.endDate)) ? 'gray' : 'red' }}>
            //         {isActivated ? 'Đang sử dụng' : dayjs().isAfter(dayjs(_record.endDate)) ? 'Hết hạn' : 'Đã hủy'}
            //     </span>
            // ),
            render: (isActivated: any, record: { endDate: string | number | Date | dayjs.Dayjs | null | undefined; }) => {
                const isExpired = dayjs().isAfter(dayjs(record.endDate));
                const color = isActivated ? 'green' : isExpired ? 'gray' : 'red';
                const status = isActivated ? 'Đang sử dụng' : isExpired ? 'Hết hạn' : 'Đã hủy';
                return <span style={{ color }}>{status}</span>;
            }
        },
    ];

    if (loading) {
        return <Spin size="large" className="flex justify-center mt-20" />;
    }

    return (
        <>
            <Title level={2} className="my-4">Tất cả dịch vụ khách hàng mua</Title>

            <Row gutter={[16, 16]} className="mb-6 pt-2">
                <Col span={8}>
                    <Card className="shadow-md bg-green-100">
                        <Statistic
                            title="Dịch vụ khách hàng đang sử dụng"
                            value={userServices.filter(service => service.isActive).length} />
                        <div className="mt-2 flex items-center justify-between">
                            {/* <Link to={"#userlist"} ><CaretRightOutlined /> Xem chi tiết</Link> */}
                        </div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card className="shadow-md bg-purple-100">
                        <Statistic
                            title="Người dùng mua gói trong tháng"
                            value={
                                userPayments.filter(payment =>
                                    dayjs(payment.createdAt)
                                        .isSame(dayjs(), 'month')).length
                            } />
                        <div className="mt-2 flex items-center justify-between">
                            {/* <span className="text-green-500">Tăng 1.3% so với tuần trước</span> */}
                            {/* <Link to={"#"} ><CaretRightOutlined /> Xem chi tiết</Link> */}
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
                                    && service.isActive).length
                            } />
                        <div className="mt-2 flex items-center justify-between">
                            {/* <Link to={"#"} ><CaretRightOutlined /> Xem chi tiết</Link> */}
                        </div>
                    </Card>
                </Col>
            </Row>

            <Title level={4} id="userlist" className="pt-4">Dịch vụ khách hàng sử dụng</Title>
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
                            {servicePackages.map(pkg => (
                                <Option key={pkg.packageId} value={pkg.packageName}>
                                    {pkg.packageName}
                                </Option>
                            ))}
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
                    // pagination={{ pageSize: 10 }}
                    locale={{ emptyText: 'Không có dữ liệu' }}
                />
            </div>
        </>
    );
};

export default UserServiceManagementPage;
