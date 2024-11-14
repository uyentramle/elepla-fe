import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, } from "antd";
import { IViewListArticle, getViewListArticle, IViewDetailArticle, getArticleById } from "@/data/client/ArticleData";

const { Meta } = Card;

const ArticleDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Lấy ID từ URL
    const [article, setArticle] = useState<IViewDetailArticle | null>(null);
    // const [relatedArticles, setRelatedArticles] = useState<IViewListArticle[]>([]);
    const [latestArticles, setLatestArticles] = useState<IViewListArticle[]>([]);
    const navigate = useNavigate(); // Điều hướng khi click danh mục

    useEffect(() => {
        // Tìm bài viết dựa trên ID
        const fetchArticle = async () => {
            if (id) {
                const foundArticle = await getArticleById(id);
                setArticle(foundArticle);

                // Nếu tìm thấy bài viết, tìm các bài viết cùng danh mục
                // if (foundArticle) {
                //     const related = article_data.filter(a => a.categoryId === foundArticle.categoryId && a.id !== foundArticle.id);
                //     setRelatedArticles(related);
                // }
            }
        };

        fetchArticle();

        // Lấy 5 bài viết mới nhất
        // const latest = article_data
        //     .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        //     .slice(0, 5);
        // setLatestArticles(latest);
        const fetchLatestArticles = async () => {
            const latestData = await getViewListArticle();
            setLatestArticles(latestData.slice(0, 5)); // Chỉ lấy 5 bài viết mới nhất
        };

        fetchLatestArticles();
    }, [id]);

    if (!article) return <div>Bài viết không tồn tại</div>;

    return (
        <div className="container mx-auto py-10 px-8">
            <Row gutter={16}>
                <Col span={16}>
                    {/* Phần tiêu đề và thông tin bài viết */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
                        <p className="text-gray-600 mb-4">{new Date(article.created_at).toLocaleDateString('vi-VN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                        <img
                            src={article.thumb}
                            alt={article.title}
                            className="w-full h-auto max-w-lg mx-auto object-contain rounded"
                        />
                        <div className="mt-6 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: article.content }}></div>
                    </div>

                    {/* Bài viết liên quan */}
                    {latestArticles.length > 0 && (
                        <div className="mt-10">
                            <h2 className="text-2xl font-bold mb-4">Bài viết liên quan</h2>
                            <Row gutter={[16, 16]} className="flex flex-col">
                                {latestArticles.map((relatedArticle) => (
                                    <Card
                                        key={relatedArticle.id}
                                        hoverable
                                        className="mb-4 w-full p-2"
                                        onClick={() => navigate(`/articles/${relatedArticle.id}`)} // Điều hướng khi click
                                    >
                                        <Row gutter={16}>
                                            <Col xs={6}>
                                                <img
                                                    alt={relatedArticle.title}
                                                    src={relatedArticle.thumb}
                                                    className="object-cover w-full h-full rounded"
                                                />
                                            </Col>
                                            <Col xs={18}>
                                                <Meta
                                                    title={relatedArticle.title}
                                                    description={new Date(relatedArticle.created_at).toLocaleDateString('vi-VN', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                />
                                            </Col>
                                        </Row>
                                    </Card>
                                ))}
                            </Row>
                        </div>
                    )}
                </Col>

                {/* 5 bài viết mới nhất */}
                <Col span={8}>
                    <div className="mb-8 mt-24">
                        <h2 className="text-2xl font-bold mb-4">Bài viết mới nhất</h2>
                        {latestArticles.map((article) => (
                            <Card
                                key={article.id}
                                hoverable
                                className="mb-4"
                                onClick={() => navigate(`/articles/${article.id}`)}
                            >
                                <Meta
                                    title={article.title}
                                    description={new Date(article.created_at).toLocaleDateString('vi-VN', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                />
                            </Card>
                        ))}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ArticleDetailPage;
