import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, List, Typography, Avatar } from 'antd';
import { FileTextOutlined, DatabaseOutlined, BookOutlined, MessageOutlined } from '@ant-design/icons';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from 'recharts';
import { countPlanbooks } from '@/data/academy-staff/PlanbookData';
import { countPlanBookFeedback, fetchPlanBookFeedbackList, IViewListFeedback } from '@/data/academy-staff/FeedbackData';
import { fetchSystemFeedbackList, classifyFeedbackByRate } from '@/data/academy-staff/FeedbackData';

import { countQuestions } from '@/data/academy-staff/QuestionBankData';
import { fetchChapterList, IViewListChapter } from '@/data/academy-staff/ChapterData';
import { fetchAllQuestions } from '@/data/academy-staff/QuestionBankData';

const { Text } = Typography;

const COLORS = ['#55bfc7', '#00C49F', '#FFBB28', '#9e5493', '#e8744c', '#FF6666'];

const DashBoardStaffPage: React.FC = () => {
  const [planbookCount, setPlanbookCount] = useState<number>(0);
  const [feedbackCount, setFeedbackCount] = useState<number>(0);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [chapterStats, setChapterStats] = useState<{ name: string; value: number }[]>([]);
  const [recentFeedback, setRecentFeedback] = useState<IViewListFeedback[]>([]);
  const [questionBankStats, setQuestionBankStats] = useState<{ name: string; value: number }[]>([]);
  const [feedbackStats, setFeedbackStats] = useState<{ name: string; value: number }[]>([]);

  const [topRatedPlanbooks, setTopRatedPlanbooks] = useState<{
    title: string;
    stars: number;
    type: string;
    author: string;
    avatar: string;
  }[]>([]);

  // const feedbackStats = [
  //   { name: 'Hài lòng', value: 120 },
  //   { name: 'Bình thường', value: 30 },
  //   { name: 'Không hài lòng', value: 10 },
  // ];

  useEffect(() => {
    // Fetch tổng hợp dữ liệu
    const fetchDashboardData = async () => {
      try {
        // Fetch số liệu
        const [planbookTotal, feedbackTotal, questionTotal, chapterList, feedbackList, questionData] = await Promise.all([
          countPlanbooks(),
          countPlanBookFeedback(),
          countQuestions(),
          fetchChapterList(),
          fetchPlanBookFeedbackList(),
          fetchAllQuestions(0, 500),
        ]);

        // Tổng số liệu
        setPlanbookCount(planbookTotal);
        setFeedbackCount(feedbackTotal);
        setQuestionCount(questionTotal);

        // Thống kê chương
        const chapterStats = chapterList.reduce((acc: Record<string, number>, chapter: IViewListChapter) => {
          acc[chapter.subject] = (acc[chapter.subject] || 0) + 1;
          return acc;
        }, {});
        setChapterStats(Object.entries(chapterStats).map(([name, value]) => ({ name, value })));

        // Phản hồi gần đây
        const sortedFeedback = feedbackList.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentFeedback(sortedFeedback.slice(0, 4));

        // Top kế hoạch bài dạy
        const aggregatedRatings = feedbackList.reduce<
          Record<string, { stars: number; title: string; type: string; author: string; avatar: string }>
        >((acc, feedback) => {
          const { planbookName, rate, type, username, avatar } = feedback;
          if (!planbookName) return acc;

          if (!acc[planbookName]) {
            acc[planbookName] = { title: planbookName, stars: rate, type, author: username, avatar };
          } else {
            acc[planbookName].stars += rate;
          }

          return acc;
        }, {});

        const sortedPlanbooks = Object.values(aggregatedRatings)
          .sort((a, b) => b.stars - a.stars)
          .slice(0, 3);
        setTopRatedPlanbooks(sortedPlanbooks);

        // Thống kê ngân hàng câu hỏi
        const questionStats = questionData.data.items.reduce<Record<string, number>>((acc, question) => {
          acc[question.subject] = (acc[question.subject] || 0) + 1;
          return acc;
        }, {});
        const formattedQuestionStats = Object.entries(questionStats)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 3);
        setQuestionBankStats(formattedQuestionStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const feedbackList = await fetchSystemFeedbackList(); // Lấy danh sách phản hồi
        const classifiedFeedback = classifyFeedbackByRate(feedbackList); // Phân loại phản hồi
        setFeedbackStats([
          { name: 'Hài lòng', value: classifiedFeedback.greaterThanThree },
          { name: 'Bình thường', value: classifiedFeedback.equalToThree },
          { name: 'Không hài lòng', value: classifiedFeedback.lessThanThree },
        ]);
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      }
    };

    fetchFeedbackData();
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
            <Statistic title="Ngân hàng câu hỏi" value={questionCount} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Đánh giá kế hoạch bài dạy" value={feedbackCount} prefix={<DatabaseOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
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

        <Col span={12}>
          <Card title="Phản hồi gần đây">
            <List
              itemLayout="horizontal"
              dataSource={recentFeedback}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<MessageOutlined style={{ fontSize: '20px', color: '#1890ff' }} />}
                    title={<Text strong>{item.username}</Text>}
                    description={item.content}
                  />
                  <div>
                    {Array.from({ length: item.rate }, (_, i) => (
                      <span key={i} style={{ color: '#fadb14' }}>★</span>
                    ))}
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
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

        <Col span={12}>
            <Card title="Kế hoạch được yêu thích">
              <List
                itemLayout="horizontal"
                dataSource={topRatedPlanbooks}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<FileTextOutlined style={{ fontSize: '20px', color: '#1890ff' }} />}
                      title={<Text strong>{item.title}</Text>}
                      description={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            src={item.avatar}
                            size={24} // Kích thước nhỏ hơn
                            style={{ marginRight: 8 }}
                          />
                          <Text>{item.author}</Text>
                        </div>
                      }
                    />
                    <div>
                      {Array.from({ length: Math.min(item.stars, 5) }, (_, i) => (
                        <span key={i} style={{ color: '#fadb14' }}>★</span>
                      ))}
                      {item.stars > 5 && (
                        <Text type="secondary" style={{ fontSize: '12px', marginLeft: 8 }}>
                          +{item.stars - 5}
                        </Text>
                      )}
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

export default DashBoardStaffPage;
