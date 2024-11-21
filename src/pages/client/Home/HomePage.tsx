// HomePage.tsx
import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { Button } from 'antd';
import {
    RightOutlined,
    UserOutlined,
    FolderOpenOutlined,
    CheckOutlined,
} from '@ant-design/icons';
import Link from 'antd/es/typography/Link';

import intro_data from '@/data/client/IntroData';
import features from '@/data/client/FeatureData';
import packages from '@/data/client/PackageData';
import work_data from '@/data/client/WorkAreaData';
import feedback_data from '@/data/client/FeedbackData';
import { getViewListArticle, IViewListArticle } from '@/data/client/ArticleData';

const { Title, Text } = Typography;

const HomePage: React.FC = () => {
    const [articles, setArticles] = useState<IViewListArticle[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await getViewListArticle();
                setArticles(data);
            } catch (error) {
                console.error('Failed to load articles', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);
    const mainArticles = articles.slice(0, 2);
    const sidebarArticles = articles.slice(2, 6);

    const [currentIndex, setCurrentIndex] = useState(0);
    const feedbacks = feedback_data.filter((item) => item.page === "home_1");

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? feedbacks.length - 1 : prevIndex - 1));
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex === feedbacks.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <>
            {/* Banner Area */}
            <div style={{ backgroundColor: '#F0F4F9' }} className="py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center">
                        <div className="lg:w-6/12 order-first lg:order-1 flex items-center">
                            <div className="text-center lg:text-left mt-5 lg:mt-0">
                                <Title level={4} className="text-xl font-semibold mb-2 animate-fadeIn">
                                    ELEPLA
                                </Title>
                                <div className="text-6xl font-bold mb-4 animate-fadeIn">
                                    <Title level={1}>
                                        Tạo kế hoạch bài dạy bậc THPT theo chuẩn Bộ Giáo Dục và Đào Tạo Việt Nam
                                    </Title>
                                </div>
                                <div className="space-x-4 animate-fadeIn">
                                    <Link href="/planbook-library">
                                        <Button type="primary" className="mb-3">Khám phá kho kế hoạch bài dạy</Button>
                                    </Link>
                                    <Link href="#">
                                        <Button type="default" className="mb-3">Soạn kế hoạch bài dạy miễn phí </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {/* Image Section */}
                        <div className="lg:w-4/12 md:w-8/12 order-last lg:order-2 flex items-center">
                            <div className="pb-20">
                                <img src="https://edumint-nextjs.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F1.bdfb4143.png&w=640&q=75" alt="img" width={400} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Intro Area */}
            <div className="relative mb-28">
                <div className="absolute top-1/2 left-0 w-full" style={{ transform: 'translateY(-50%)' }}>
                    <div className="container mx-auto">
                        <div style={{ backgroundColor: '#195E84' }} className="intro-area-inner intro-home-1 rounded-lg overflow-hidden">
                            <div className="flex flex-wrap">
                                <div className="w-full lg:w-1/3 text-center lg:text-left">
                                    <div className="intro-title p-8">
                                        <Title level={3} style={{ color: '#fff' }}>Nền tảng Giáo dục số</Title>
                                        <p className="text-white mb-5">Soạn kế hoạch bài dạy cho tất cả các môn học trên một nền tảng duy nhất</p>
                                        <ul className="list-none p-0 m-0">
                                            <li className="text-white mb-2 flex items-center">
                                                <CheckOutlined className="mr-2" /> Đơn giản
                                            </li>
                                            <li className="text-white flex items-center">
                                                <CheckOutlined className="mr-2" /> Tiện lợi
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="w-full lg:w-2/3 flex flex-wrap">
                                    <ul className="flex flex-wrap w-full">
                                        {intro_data.filter((item) => item.page === "home_1").map((item) => (
                                            <li key={item.id} className="w-full md:w-1/3 p-4">
                                                <div className="single-intro-inner bg-white p-5 rounded-lg text-center transition duration-300 hover:shadow-lg">
                                                    <div className="thumb mb-3">
                                                        <img src={item.icon} alt="icon" className="inline-block" />
                                                    </div>
                                                    <div className="details">
                                                        <Title level={5} className="text-lg font-medium mb-2">{item.title}</Title>
                                                        <p className="mb-0">{item.desc}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Work Area  */}
            <div className="work-area py-10">
                <section className="container mx-auto px-6">
                    <div className="section-title text-center">
                        <Title level={2} className="title text-3xl">Elepla hoạt động như thế nào để có một kế hoạch bài dạy theo chuẩn Bộ Giáo Dục?</Title>
                        <Text className="mt-6 lg:mt-0 text-gray-600">
                            Công cụ số hóa tạo kế hoạch bài dạy siêu đơn giản, chỉnh sửa nhanh chóng các mẫu kế hoạch bài dạy từ kho bài giảng đa dạng, đảm bảo đúng theo khung kế hoạch giảng dạy theo quy định của Bộ Giáo Dục và Đào tạo
                        </Text>
                    </div>
                    <Row gutter={[16, 16]} className="mt-8">
                        {work_data.map((item) => (
                            <Col key={item.id} lg={6} md={12}>
                                <div className="single-intro-inner bg-gray-100 text-center p-6 shadow-lg rounded-lg">
                                    <div className="thumb relative">
                                        <div className="intro-count absolute top-1 left-1 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                                            {item.id}
                                        </div>
                                        <img src={item.icon} alt="img" className="mx-auto mb-4" />
                                    </div>
                                    <div className="details mt-4">
                                        <h5 className="text-xl font-semibold">{item.title}</h5>
                                        {/* <p className="text-gray-500">{item.description}</p> */}
                                        {/* <Link href="#" className="text-blue-500 inline-flex items-center mt-2">
                                            Read More <RightOutlined className='mx-1' style={{ fontSize: '10px' }} />
                                        </Link> */}
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </section>
            </div>

            {/* Feedback Area */}
            <div className="feedback-area pt-10">
                <div className="container mx-auto">
                    <div className="bg-cover" style={{ backgroundImage: `url(/assets/img/bg/2.png)` }}>
                        <div className="relative">
                            <div className="p-6 rounded-lg shadow-md">
                                <div className="flex items-center mb-2">
                                    <div className="mr-4 relative">
                                        {/* <img src={feedbacks[currentIndex].author_img} alt="Author" className="w-16 h-16 rounded-full m-4" /> */}
                                        <div className="rounded-full bg-white p-2">
                                            <UserOutlined style={{ fontSize: '32px', color: '#195E84' }} className="m-2" />
                                        </div>
                                    </div>
                                    <div>
                                        <Title level={4} style={{ color: 'white' }}>{feedbacks[currentIndex].author_name}</Title>
                                        <Text className="text-white">{feedbacks[currentIndex].designation}</Text>
                                    </div>
                                </div>
                                <Text className="text-white ml-8 pl-8">{feedbacks[currentIndex].desc}</Text>
                            </div>
                            <div className="flex justify-between mt-2">
                                <Button onClick={handlePrevClick} type="dashed" shape="circle" className='bg-transparent text-white m-2'>
                                    ‹
                                </Button>
                                <Button onClick={handleNextClick} type="dashed" shape="circle" className='bg-transparent text-white m-2'>
                                    ›
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Package Area  */}
            <div className="bg-white-100 px-20 pb-10">
                <section className="container mx-auto mt-10">
                    <Title level={2} className="title text-3xl text-center pb-6">
                        Các gói dịch vụ của chúng tôi
                    </Title>
                    <Row gutter={16} className="text-center">
                        {packages.map((item, index) => (
                            <Col key={index} xs={24} md={8}>
                                <Card className="mb-4 shadow-md transition duration-300 ease-in-out hover:-translate-y-1">
                                    <Title level={4}>
                                        {item.name}
                                    </Title>
                                    <Title level={2}>{item.price}</Title>
                                    <Text className="font-bold">
                                        {item.description}
                                    </Text>{' '}
                                    <br />
                                    <Text className="font-semibold">{item.schoolyear}</Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>
            </div>

            {/* Feature Area */}
            <div className="px-20 py-10 text-white" style={{ backgroundColor: '#002147' }}>
                <section className="container mx-auto  rounded-lg p-6">
                    <Row gutter={16}>
                        {features.map((feature, index) => (
                            <Col key={index} xs={24} md={6} className="text-center">
                                {feature.icon}
                                <Title level={4} style={{ color: '#fff' }}>{feature.name}</Title>
                                <Text style={{ color: '#fff' }}>{feature.desc}</Text>
                            </Col>
                        ))}
                    </Row>
                </section>
            </div>

            {/* Article Area  */}
            <div className="blog-area pt-10 pb-10">
                <div className="container mx-auto">
                    <div className="flex justify-center">
                        <div className="text-center">
                            <Title level={4} className="sub-title text-sm text-gray-500 uppercase">Bài đăng mới nhất</Title>
                            <Title level={2} className="title text-3xl">Bài viết - công văn - tổng hợp</Title>
                        </div>
                    </div>
                    <div className="flex flex-wrap">
                        {/* Sidebar Article List */}
                        <div className="w-full lg:w-1/3">
                            {loading ? (
                                <p>Đang tải...</p>
                            ) : (
                                <ul className="single-blog-list-wrap shadow-lg p-6 rounded-lg">
                                    {sidebarArticles.map((article) => (
                                        <li key={article.id} className="border-b pb-4 mb-4 last:border-none last:mb-0 last:pb-0">
                                            <div className="flex items-center">
                                                <div className="date bg-blue-500 text-white text-center p-2 rounded-md w-16 h-16 flex items-center justify-center text-lg">
                                                    {new Date(article.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                                                </div>
                                                <div className="details ml-4">
                                                    <ul className="blog-meta text-sm text-gray-600 my-2">
                                                        <li className="inline mr-4">
                                                            <UserOutlined className="mr-1" /> Đăng bởi Admin
                                                        </li>
                                                        <li className="inline">
                                                            <FolderOpenOutlined className="mr-1" /> Air transport
                                                        </li>
                                                    </ul>
                                                    <Link href={`/articles/${article.id}`}>
                                                        <Title level={5} className="text-lg font-semibold">
                                                            {article.title}
                                                        </Title>
                                                    </Link>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Article Content */}
                        <div className="w-full lg:w-2/3">
                            <div className="flex flex-wrap justify-center">
                                {mainArticles.map((article) => (
                                    <div key={article.id} className="w-full md:w-1/2 p-4">
                                        <div className="single-blog-inner shadow-lg rounded-lg overflow-hidden">
                                            <div className="thumb relative">
                                                <img src={article.thumb} alt="img" className="w-full h-60 object-cover" />
                                                <span className="date bg-blue-700 text-white text-sm py-1 px-3 absolute bottom-4 left-4 rounded-full">
                                                    {new Date(article.created_at).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                            <div className="details p-6">
                                                <ul className="blog-meta text-sm text-gray-600 mb-2">
                                                    <li className="inline mr-4">
                                                        <UserOutlined className="mr-1" /> Đăng bởi ADMIN
                                                    </li>
                                                    <li className="inline">
                                                        <FolderOpenOutlined className="mr-1" /> Air transport
                                                    </li>
                                                </ul>
                                                <Link href={`/articles/${article.id}`}>
                                                    <Title level={4} className="mb-2">
                                                        {article.title}
                                                    </Title>
                                                </Link>
                                                <Link href={`/articles/${article.id}`} className="read-more-text text-primary font-semibold hover:underline">
                                                    XEM THÊM <RightOutlined className="ml-1" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default HomePage;
