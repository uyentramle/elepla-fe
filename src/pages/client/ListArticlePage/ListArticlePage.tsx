import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate để điều hướng
import { Tabs, Card, Row, Col } from "antd";
import category_data from "@/data/admin/CategoryData";
import article_data from "@/data/admin/ArticleData";

const { TabPane } = Tabs;
const { Meta } = Card;

const ListArticlePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  // Hàm lọc bài viết theo danh mục đã chọn
  const filterArticlesByCategory = (selectedCategory: string) => {
    if (selectedCategory === "all") {
      // Nếu chọn tất cả, trả về toàn bộ bài viết
      return article_data;
    }
    // Nếu chọn một danh mục cụ thể, trả về các bài viết có categoryId tương ứng
    return article_data.filter(article => article.categoryId === selectedCategory);
  };

  // Lọc các bài viết theo danh mục đã chọn
  const filteredArticles = filterArticlesByCategory(selectedCategory);

  // Sắp xếp các bài viết theo ngày, bài mới nhất lên đầu
  const sortedArticles = filteredArticles.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Bài viết mới nhất
  const latestArticle = sortedArticles[0];
  const otherArticles = sortedArticles.slice(1);

  // Cập nhật hàm điều hướng
  const handleArticleClick = (articleId: string) => {
    navigate(`/article-detail/${articleId}`); // Điều hướng đến chi tiết bài viết
  };

  // Hàm cắt bớt nội dung bài viết nếu dài hơn 40 ký tự
  const truncateContent = (content: string, maxLength: number) => {
    if (content.length > maxLength) {
      return content.slice(0, maxLength) + "...";
    }
    return content;
  };

  // Render danh sách bài viết còn lại
  const renderOtherArticles = () => {
    return otherArticles.map((article) => (
      <Card
        key={article.id}
        hoverable
        className="w-full p-2 mb-4"
        onClick={() => handleArticleClick(article.id)} // Gọi hàm điều hướng với ID bài viết
      >
        <Row gutter={16}>
          <Col xs={18}>
            <Meta title={article.title} description={article.createdAt.toDateString()} />
            <p className="mt-2 text-gray-500">
              {truncateContent(article.content, 500)} {/* Giới hạn nội dung hiển thị */}
            </p>
          </Col>
          <Col xs={6}>
            <img alt={article.title} src={article.thumb} className="w-full object-cover" />
          </Col>
        </Row>
      </Card>
    ));
  };

  return (
    <div className="container mx-auto py-10">
      {/* Tiêu đề trang */}
      <h1 className="text-4xl font-bold mb-6">Tất cả bài viết</h1>

      {/* Thanh điều hướng danh mục */}
      <div className="mb-4">
        <Tabs
          defaultActiveKey="all"
          onChange={(key) => setSelectedCategory(key)}
          className="flex"
          tabBarGutter={16}
        >
          <TabPane tab="Tất cả" key="all" />
          {category_data.map((category) => (
            // Sử dụng categoryId làm key cho TabPane
            <TabPane tab={category.name} key={category.id} />
          ))}
        </Tabs>
      </div>

      {/* Bài viết mới nhất */}
      {latestArticle && (
        <div className="mb-8 p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Bài viết mới nhất</h2> {/* Tiêu đề bài viết mới nhất */}
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <img alt={latestArticle.title} src={latestArticle.thumb} className="w-full h-full object-cover rounded" />
            </Col>
            <Col xs={24} lg={12}>
              <div className="ml-4">
                <h2 className="text-2xl font-bold">{latestArticle.title}</h2>
                <p className="text-gray-600 mt-2">{latestArticle.createdAt.toDateString()}</p>
                <p className="mt-4">{latestArticle.content}</p>
              </div>
            </Col>
          </Row>
        </div>
      )}

      {/* Danh sách bài viết còn lại */}
      <div className="flex flex-wrap -mx-2">
        {renderOtherArticles()}
      </div>
    </div>
  );
};

export default ListArticlePage;
