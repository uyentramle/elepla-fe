// Desc: Dashboard page for admin
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, List, Typography, Avatar, Spin, } from "antd";
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
import { countUsers, getUsersSortedByCreationDate, categorizeUsersByRole, getUsersLastLogin } from '@/data/admin/UserData';
import { Link } from "react-router-dom";

const { Text } = Typography;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];


const DashBoardPage: React.FC = () => {
    const [articleCount, setArticleCount] = useState<number>(0);
    const [categoryCount, setCategoryCount] = useState<number>(0);
    const [userCount, setUserCount] = useState<number>(0);
    const [curriculums, setCurriculums] = React.useState<IViewListCurriculum[]>([]);
    const [articleStats, setArticleStats] = useState<any[]>([]);
    const [categoryUserStats, setCategoryUserStats] = useState<any[]>([]);
    const [recentUsers, setRecentUsers] = useState<any[]>([]);
    const [lastLoginUsers, setLastLoginUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [articleCountRes, categoryCountRes, userCountRes, curriculumsRes,
                    articleStatsRes, categoryUserStatsRes, recentUsersRes, lastLoginUsersRes] = await Promise.all([
                        countArticles(),
                        countCategories(),
                        countUsers(),
                        fetchCurriculumList(),
                        countArticlesByCategory(),
                        categorizeUsersByRole(),
                        getUsersSortedByCreationDate(),
                        getUsersLastLogin(),
                    ]);

                setArticleCount(articleCountRes);
                setCategoryCount(categoryCountRes);
                setUserCount(userCountRes);

                curriculumsRes.splice(5);
                setCurriculums(curriculumsRes);

                setArticleStats(Object.keys(articleStatsRes).map(key => ({ name: key, value: articleStatsRes[key] })));

                if (categoryUserStatsRes) {
                    setCategoryUserStats(Object.keys(categoryUserStatsRes).map(key => ({ name: key, value: categoryUserStatsRes[key].length })));
                }

                if (recentUsersRes) {
                    recentUsersRes.splice(9);
                    setRecentUsers(recentUsersRes.map(user => ({
                        ...user,
                        value: 1,
                    })));
                }

                if (lastLoginUsersRes) {
                    lastLoginUsersRes.splice(5);
                    setLastLoginUsers(lastLoginUsersRes.map(user => ({
                        ...user,
                        value: 1,
                    })));
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" className="dashboard-loading" />
            </div>
        );
    }

    return (
        <>
            <h2 className="my-4 text-2xl font-bold">Bảng điều khiển</h2>
            {/* Khối thống kê tổng quan */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col span={8}>
                    <Card>
                        <Link to="/admin/users">
                            <Statistic title="Người dùng" value={userCount} prefix={<UserOutlined />} />
                        </Link>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Link to="/admin/articles">
                            <Statistic title="Bài viết" value={articleCount} prefix={<BookOutlined />} />
                        </Link>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Link to="/admin/categories">
                            <Statistic title="Danh mục bài viết" value={categoryCount} prefix={<TagsOutlined />} />
                        </Link>
                    </Card>
                </Col>
            </Row>

            {/* Khối biểu đồ */}
            <Row gutter={[16, 16]} className="mb-6">
                {/* Biểu đồ phân loại người dùng */}
                <Col span={12}>
                    <Card title="Phân loại người dùng theo role">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryUserStats}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {categoryUserStats.map((_, index) => (
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

            {/* Khối thông tin */}
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    {/* Danh sách thống kê khung chương trình và môn học */}
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

                    <Card title="Người dùng đăng nhập gần đây" className="mt-4">
                        <List
                            itemLayout="horizontal"
                            dataSource={lastLoginUsers}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar icon={item.avatar ?
                                                <img src={item.avatar} alt="avatar" /> :
                                                <UserOutlined />
                                            } />}
                                        title={<Text strong>{item.firstName} {item.lastName}</Text>}
                                        description={`Đăng nhập lần cuối: ${new Date(item.lastLogin).toLocaleString('vi-VN')}`}
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
                            dataSource={recentUsers}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar icon={item.avatar ?
                                                <img src={item.avatar} alt="avatar" /> :
                                                <UserOutlined />
                                            } />}
                                        title={<Text strong>{item.firstName} {item.lastName}</Text>}
                                        description={<>Ngày tạo: {new Date(item.createdAt).toLocaleString('vi-VN')}</>}
                                    />
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
