import React from 'react';
import { Row, Col, Card, Statistic, List, Avatar, Typography, Image } from 'antd';
import { UserOutlined, StarFilled } from '@ant-design/icons';
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

const COLORS = ['#55bfc7', '#00C49F', '#FFBB28', '#9e5493', '#e8744c', '#FF6666'];

const revenueProductType = [
    { name: 'Sữa bột', value: 812 },
    { name: 'Sữa tươi', value: 256 },
    { name: 'Sữa bột pha sẵn', value: 375 },
    { name: 'Sữa hạt dinh dưỡng', value: 872 },
    { name: 'Thức uống dinh dưỡng', value: 541 },
];

const orderRate = [
    {
        name: 'Tháng 3',
        order: 99,
        preOrder: 11
    },
    {
        name: 'Tháng 4',
        order: 72,
        preOrder: 20
    },
    {
        name: 'Tháng 5',
        order: 122,
        preOrder: 10
    },
    {
        name: 'Tháng 6',
        order: 276,
        preOrder: 89
    },
];

const simpleData = [
    {
        name: 'AAA',
        value: 356
    },
    {
        name: 'BBB',
        value: 287
    },
    {
        name: 'CCC',
        value: 53
    },
];

const { Text } = Typography;

const bestSellingProduct = [
    {
        name: 'Sữa Vinamilk Yoko Gold 1 850g (0-1 tuổi)',
        image: "https://cdn1.concung.com/2024/04/44603-1714120962-trans.png",
        count: 142,
        rate: 4.9,
        price: 449000,
    },
    {
        name: 'Vinamilk Optimum Gold 1, 800g (0 - 6 tháng)',
        image: "https://cdn1.concung.com/2022/05/57283-88154-large_mobile/vinamilk-optimum-gold-1-800g.png",
        count: 122,
        rate: 4.3,
        price: 395000,
    },
    {
        name: 'Vinamilk Optimum Gold 3, 850g, 1-2 tuổi',
        image: "https://cdn1.concung.com/2022/05/57286-88164-large_mobile/vinamilk-optimum-gold-3-850g-1-2-tuoi.png",
        count: 92,
        rate: 4.8,
        price: 369000,
    },
];

const newUsersData = [
    { name: 'Vũ Lan Anh', time: 'Tham gia 12 giờ trước' },
    { name: 'Võ Tấn Ngọc Dũng', time: 'Tham gia 17 giờ trước' },
    { name: 'Vũ Lê Đức Lợi', time: 'Tham gia 19 giờ trước' },
    { name: 'Lê Hoàng Bảo Trân', time: 'Tham gia 25 giờ trước' },
];

const recentFeedbacksData = [
    {
        product: 'Vinamilk Optimum Gold 1, 800g (0 - 6 tháng)',
        image: "https://cdn1.concung.com/2022/05/57283-88154-large_mobile/vinamilk-optimum-gold-1-800g.png",
        name: 'Vũ Lan Anh',
        feedback: 'Sữa chất lượng, con tôi rất thích',
        rating: 5
    },
    {
        product: 'Vinamilk Optimum Gold 1, 800g (0 - 6 tháng)',
        image: "https://cdn1.concung.com/2022/05/57283-88154-large_mobile/vinamilk-optimum-gold-1-800g.png",
        name: 'Võ Tấn Ngọc Dũng',
        feedback: 'Quá là tuyệt vời lun',
        rating: 5
    },
    {
        product: 'Vinamilk Optimum Gold 1, 800g (0 - 6 tháng)',
        image: "https://cdn1.concung.com/2022/05/57283-88154-large_mobile/vinamilk-optimum-gold-1-800g.png",
        name: 'Vũ Lê Đức Lợi',
        feedback: 'Giá cả bán sữa cho mẹ bầu ở đây ổn áp hơn so với nhiều chỗ khác',
        rating: 5
    },
    {
        product: 'Vinamilk Optimum Gold 1, 800g (0 - 6 tháng)',
        image: "https://cdn1.concung.com/2022/05/57283-88154-large_mobile/vinamilk-optimum-gold-1-800g.png",
        name: 'Lê Hoàng Bảo Trân',
        feedback: 'Shop bán hàng chất lượng, không sợ pha ke',
        rating: 5
    },
];

const DashBoardManagerPage: React.FC = () => {

    return (
        <>
            <h2 className="my-4 text-2xl font-bold">Bảng điều khiển</h2>
            <Row gutter={[16, 16]} className="mb-6">
                <Col span={8}>
                    <Card className="shadow-md bg-purple-100">
                        <Statistic title="Đơn hàng" value={2040} />
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-red-500">Giảm 4.3% so với tháng trước</span>
                        </div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card className="shadow-md bg-pink-100">
                        <Statistic title="Sản phẩm" value={1293} />
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-green-500">Tăng 1.3% so với tuần trước</span>
                        </div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card className="shadow-md bg-blue-100">
                        <Statistic title="Người dùng" value={589} />
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-green-500">Tăng 8.5% so với tuần trước</span>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} className="mb-6">
                <Col span={8}>
                    <Card title="Đơn hàng theo nhóm hàng">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={revenueProductType}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#069912"
                                    dataKey="value"
                                    label
                                >
                                    {revenueProductType.map((_, index) => (
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
                    <Card title="Tỉ lệ loại đơn hàng theo tháng">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={orderRate}
                                margin={{
                                    top: 5, right: 5, left: 0, bottom: 0
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="order" fill={COLORS[3]} />
                                <Bar dataKey="preOrder" fill={COLORS[2]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Tỉ lệ...">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={simpleData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#ffc658"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label
                                >
                                    {simpleData.map((_, index) => (
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
            </Row>

            <Row gutter={[16, 16]} className="mb-6">
                <Col span={24}>
                    <Card
                        title="Sản phẩm bán chạy"
                    // extra={<a href="#">Xem thêm</a>}
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
                                    <Text strong># </Text>
                                </div>
                                <div style={{ flex: '1 1 350px' }}>
                                    <Text strong>Tên sản phẩm</Text>
                                </div>
                                <div style={{ flex: '1 1 150px' }}>
                                    <Text strong>Giá</Text>
                                </div>
                                <div style={{ flex: '1 1 150px' }}>
                                    <Text strong>Số lượng đã bán</Text>
                                </div>
                                <div style={{ flex: '1 1 150px' }}>
                                    <Text strong>Điểm đánh giá</Text>
                                </div>
                            </div>
                        </List.Item>
                        <List
                            itemLayout="vertical"
                            dataSource={bestSellingProduct}
                            renderItem={(item) => (
                                <List.Item>
                                    <div
                                        style={{
                                            display: 'flex',
                                            width: '100%',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <div style={{ flex: '0 1 30px' }}>
                                            <img src={item.image} alt={item.name} style={{ width: '100%' }} />
                                        </div>
                                        <div style={{ flex: '1 1 350px', paddingLeft: '10px' }}>
                                            <Text strong>{item.name}</Text>
                                        </div>
                                        <div style={{ flex: '1 1 150px' }}>
                                            {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </div>
                                        <div style={{ flex: '1 1 150px' }}>{item.count}</div>
                                        <div style={{ flex: '1 1 150px' }}>
                                            <StarFilled style={{ color: '#fadb14' }} /> {item.rate}/5
                                            {/* {[...Array(Math.floor(item.rate))].map((_, i) => (
                                                <StarFilled key={i} style={{ color: '#fadb14', marginLeft: '5px' }} />
                                            ))} */}
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} className="mb-6">
                <Col span={12}>
                    <Card title="Người dùng mới" extra={<a href="#">Xem thêm</a>}>
                        <List
                            itemLayout="horizontal"
                            dataSource={newUsersData}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar icon={<UserOutlined />} />}
                                        title={<Text strong>{item.name}</Text>}
                                        description={item.time}
                                    />
                                    <div>
                                        <Text type="success">Đã xác thực số điện thoại</Text>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Phản hồi gần đây" extra={<a href="#">Xem thêm</a>}>
                        <List
                            itemLayout="horizontal"
                            dataSource={recentFeedbacksData}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <Image src={item.image} width={'30px'} />
                                        }
                                        title={<Text strong>{item.product}</Text>}
                                        description={
                                            <div dangerouslySetInnerHTML={{ __html: `<strong>${item.name}</strong><br/> ${item.feedback}` }} />
                                        }
                                    />
                                    <div>
                                        {[...Array(item.rating)].map((_, i) => (
                                            <StarFilled key={i} style={{ color: '#fadb14' }} />
                                        ))}
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default DashBoardManagerPage;
