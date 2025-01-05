import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Card, Row, Col, Spin } from "antd";
import { fetchListCategory } from "@/data/client/CategoryData";
import { getViewListArticle, IViewListArticle } from "@/data/client/ArticleData";

const { TabPane } = Tabs;
const { Meta } = Card;

const ListArticlePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [articles, setArticles] = useState<IViewListArticle[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingArticles, setLoadingArticles] = useState<boolean>(true); // Trạng thái loading cho bài viết
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      setLoadingArticles(true);
      const articleList = await getViewListArticle();
      setArticles(articleList);
      setLoadingArticles(false);
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryList = await fetchListCategory();
      setCategories(categoryList);
    };

    fetchCategories();
  }, []);

  const filterArticlesByCategory = (selectedCategory: string) => {
    if (selectedCategory === "all") {
      return articles;
    }
    return articles;
  };

  const filteredArticles = filterArticlesByCategory(selectedCategory);
  const sortedArticles = (filteredArticles || []).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const latestArticle = sortedArticles[0];
  const otherArticles = sortedArticles.slice(1);

  const handleArticleClick = (articleId: string) => {
    navigate(`/articles/${articleId}`);
  };

  const renderOtherArticles = () => {
    return otherArticles.map((article) => (
      <Card
        key={article.id}
        hoverable
        className="w-full p-2 mb-4"
        onClick={() => handleArticleClick(article.id)}
      >
        <Row gutter={16}>
          <Col xs={18}>
            <Meta
              title={article.title}
              description={new Date(article.created_at).toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
            <p className="mt-2 text-gray-500">{article.excerpt}</p>
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
      <h1 className="text-4xl font-bold mb-6">Tất cả bài viết</h1>

      {/* Tabs cho danh mục */}
      <Tabs
        defaultActiveKey="all"
        onChange={(key) => setSelectedCategory(key)}
        className="flex"
        tabBarGutter={16}
      >
        <TabPane tab="Tất cả" key="all" />
        {categories.map((category) => (
          <TabPane tab={category.name} key={category.id} />
        ))}
      </Tabs>

      {/* Hiển thị spinner khi đang tải bài viết */}
      {loadingArticles ? (
        <Spin size="large" className="mt-10 flex justify-center" />
      ) : (
        <>
          {latestArticle && (
            <div className="mb-8 p-4 bg-white rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold mb-4">Bài viết mới nhất</h2>
              <Row gutter={16}>
                <Col xs={24} lg={12}>
                  <img
                    alt={latestArticle.title}
                    src={latestArticle.thumb}
                    className="w-full h-full object-cover rounded"
                  />
                </Col>
                <Col xs={24} lg={12}>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold">{latestArticle.title}</h2>
                    <p className="text-gray-600 mt-2">
                      {new Date(latestArticle.created_at).toLocaleDateString("vi-VN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <div
                      className="mt-4"
                      dangerouslySetInnerHTML={{ __html: latestArticle.excerpt }}
                    ></div>
                  </div>
                </Col>
              </Row>
            </div>
          )}

          <div className="flex flex-wrap -mx-2">{renderOtherArticles()}</div>
        </>
      )}
    </div>
  );
};

export default ListArticlePage;
