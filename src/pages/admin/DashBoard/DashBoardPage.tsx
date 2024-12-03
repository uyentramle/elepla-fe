import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, List, Typography, Avatar } from "antd";
import { UserOutlined, BookOutlined, TagsOutlined, } from '@ant-design/icons';
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
import { countArticles, countArticlesByCategory } from '@/data/admin/ArticleData';
import { countCategories } from '@/data/admin/CategoryData';
import { fetchCurriculumList, IViewListCurriculum } from '@/data/admin/CurriculumFramworkData';

const { Text } = Typography;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Dữ liệu giả để hiển thị
const userStats = [
    { name: "Staff", value: 35 },
    { name: "Giáo viên", value: 240 },
    { name: "Admin", value: 5 },
    { name: "Manager", value: 10 },
];

const DashBoardPage: React.FC = () => {
    const [articleCount, setArticleCount] = useState<number>(0);
    const [categoryCount, setCategoryCount] = useState<number>(0);
    const [curriculums, setCurriculums] = React.useState<IViewListCurriculum[]>([]);
    const [articleStats, setArticleStats] = useState<any[]>([]);

    useEffect(() => {
        const fetchArticleCount = async () => {
            const count = await countArticles();
            setArticleCount(count);
        };
        fetchArticleCount();

        const fetchCategoryCount = async () => {
            const count = await countCategories();
            setCategoryCount(count);
        };
        fetchCategoryCount();

        const fetchCurriculums = async () => {
            const curriculumList = await fetchCurriculumList();
            curriculumList.splice(5);
            setCurriculums(curriculumList);
        };
        fetchCurriculums();

        const fetchArticleStats = async () => {
            const statsObj = await countArticlesByCategory();
            const stats = Object.keys(statsObj).map(key => ({ name: key, value: statsObj[key] }));
            setArticleStats(stats);
        };
        fetchArticleStats();
    }, []);

    return (
        <>
            <h2 className="my-4 text-2xl font-bold">Bảng điều khiển</h2>
            {/* Khối thống kê tổng quan */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col span={8}>
                    <Card>
                        <Statistic title="Người dùng" value={280} prefix={<UserOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="Bài viết" value={articleCount} prefix={<BookOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="Danh mục bài viết" value={categoryCount} prefix={<TagsOutlined />} />
                    </Card>
                </Col>
            </Row>

            {/* Khối biểu đồ */}
            <Row gutter={[16, 16]} className="mb-6">
                {/* Biểu đồ phân loại người dùng */}
                <Col span={12}>
                    <Card title="Phân loại người dùng">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={userStats}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {userStats.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                {/* Biểu đồ bài viết */}
                <Col span={12}>
                    <Card title="Phân loại bài viết">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={articleStats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Danh sách thống kê khung chương trình và môn học */}
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Card title="Khung chương trình" extra={<a href="/admin/curriculum-frameworks">Xem thêm</a>}>
                        <List
                            itemLayout="horizontal"
                            dataSource={curriculums}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={item.name}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Người dùng mới" extra={<a href="/admin/users">Xem thêm</a>}>
                        <List
                            itemLayout="horizontal"
                            dataSource={userStats}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar icon={<UserOutlined />} />}
                                        title={<Text strong>{item.name}</Text>}
                                    // description={item.time}
                                    />
                                    {/* <div>
                                        <Text type="success">Đã xác thực số điện thoại</Text>
                                    </div> */}
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

            </Row>
        </>
    );
};

export default DashBoardPage;
