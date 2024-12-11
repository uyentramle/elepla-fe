// Dashboard page for academy staff
import React, { useEffect } from 'react';
import { Row, Col, Card, Statistic, List, Typography } from 'antd';
import { FileTextOutlined, MessageOutlined, DatabaseOutlined, BookOutlined, } from '@ant-design/icons';
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

import { countPlanbooks } from '@/data/academy-staff/PlanbookData';
import { countPlanBookFeedback } from '@/data/academy-staff/FeedbackData';

const COLORS = ['#55bfc7', '#00C49F', '#FFBB28', '#9e5493', '#e8744c', '#FF6666'];
const { Text } = Typography;

// Dữ liệu giả lập
const chapterStats = [
    { name: "Toán học", value: 12 },
    { name: "Ngữ văn", value: 8 },
    { name: "Tiếng Anh", value: 15 },
];

const feedbackStats = [
    { name: "Hài lòng", value: 120 },
    { name: "Bình thường", value: 30 },
    { name: "Không hài lòng", value: 10 },
];

const questionBankStats = [
    { name: "Toán học", value: 250 },
    { name: "Ngữ văn", value: 180 },
    { name: "Tiếng Anh", value: 220 },
];

// Thành viên mới (ví dụ feedback)
const recentFeedback = [
    { name: "Nguyễn Văn A", feedback: "Bài học rất bổ ích!", rating: 5 },
    { name: "Trần Thị B", feedback: "Cần cải thiện phần ví dụ thực tế hơn.", rating: 3 },
    { name: "Phạm C", feedback: "Bài giảng dễ hiểu, rất hay!", rating: 4 },
];

const DashBoardStaffPage: React.FC = () => {
    const [planbookCount, setPlanbookCount] = React.useState<number>(0);
    const [feedbackCount, setFeedbackCount] = React.useState<number>(0);

    useEffect(() => {
        countPlanbooks().then((count) => {
            setPlanbookCount(count);
        });

        countPlanBookFeedback().then((count) => {
            setFeedbackCount(count);
        });

    }, []);

    return (
        <>
            <h2 className="my-4 text-2xl font-bold">Bảng điều khiển</h2>
            <Row gutter={[16, 16]} className="mb-6">
                <Col span={8}>
                    <Card>
                        <Statistic title="Kế hoạch bài dạy" value={planbookCount} prefix={<BookOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="Ngân hàng câu hỏi" value={155} prefix={<FileTextOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="Đánh giá kế hoạch bài dạy" value={feedbackCount} prefix={<DatabaseOutlined />} />
                    </Card>
                </Col>
            </Row>

            {/* Khối biểu đồ */}
            <Row gutter={[16, 16]} className="mb-6">
                {/* Biểu đồ phân bổ chương theo môn học */}
                <Col span={12}>
                    <Card title="Phân bổ chương theo môn học">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={chapterStats}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {chapterStats.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                {/* Ngân hàng câu hỏi và kế hoạch bài dạy */}
                <Col span={12}>
                    <Card title="Ngân hàng câu hỏi theo môn học">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={questionBankStats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#ffc658" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                {/* Phản hồi gần đây */}
                <Col span={12}>
                    <Card title="Phản hồi gần đây">
                        <List
                            itemLayout="horizontal"
                            dataSource={recentFeedback}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<MessageOutlined style={{ fontSize: "20px", color: "#1890ff" }} />}
                                        title={<Text strong>{item.name}</Text>}
                                        description={item.feedback}
                                    />
                                    <div>
                                        {Array.from({ length: item.rating }, (_, i) => (
                                            <span key={i} style={{ color: "#fadb14" }}>★</span>
                                        ))}
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                {/* Biểu đồ phản hồi */}
                <Col span={12}>
                    <Card title="Phân tích phản hồi">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={feedbackStats}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {feedbackStats.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default DashBoardStaffPage;
