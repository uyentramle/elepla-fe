import React, { useRef, useState } from 'react';
import { Button, Rate, Card, Avatar, List, Carousel, Affix, Input } from 'antd';
import { HeartOutlined, HeartFilled, BookOutlined, UserOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { lessonPlans, LessonPlan } from '../../../data/client/LessonPlanData'; // Đảm bảo import đúng đường dẫn
import feedback_data from '../../../data/client/FeedbackData';
const DetailLessonPlan: React.FC = () => {
const [searchTerm, setSearchTerm] = useState('');

  // Lấy lesson plan dựa trên ID (giả sử ID = 1)
  const lessonPlanId = 1; // ID của giáo án muốn hiển thị
  const lessonPlan: LessonPlan | undefined = lessonPlans.find(plan => plan.id === lessonPlanId); // Tìm lesson plan theo ID

  // Nếu không tìm thấy lessonPlan, có thể hiển thị thông báo hoặc điều gì đó khác
  if (!lessonPlan) {
    return <div>Không tìm thấy giáo án.</div>;
  }

  // const feedback = [
  //   { user: "Nguyễn Văn A", comment: "Giáo án rất hay và chi tiết!", rating: 5 },
  //   { user: "Lê Thị B", comment: "Cấu trúc rõ ràng, dễ hiểu", rating: 4.5 },
  // ];

  const chapters = [
    { chapter: 'Chương 1: Đại số cơ bản', lessons: ['Bài 1: Đại số cơ bản', 'Bài 2: Hàm số', 'Bài 3: Đa thức'] },
    { chapter: 'Chương 2: Hình học không gian', lessons: ['Bài 1: Tích phân', 'Bài 2: Hình học không gian'] },
  ];

  const similarLessonPlans = lessonPlans.filter((plan) => plan.subject === lessonPlan.subject && plan.id !== lessonPlan.id);

  // Scroll references
  const descriptionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter lessons based on search
  const filteredLessons = chapters.flatMap((chapter) =>
    chapter.lessons.filter((lesson) => lesson.toLowerCase().includes(searchTerm.toLowerCase()))
  );

   // Lấy dữ liệu feedback từ feedback_data theo trang hiện tại (giả sử "home_1")
   const filteredFeedback = feedback_data.filter(fb => fb.page === "home_1");

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-wrap">
        {/* Left Side - Cover Image and Author Info */}
        <div className="w-full lg:w-1/3">
          <Card
            cover={<img alt={lessonPlan.title} src={lessonPlan.image || "default_image_url"} className="h-64 object-cover" />}
            className="shadow-md"
          >
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center">
                <Avatar src={lessonPlan.avatar} className="mr-2" />
                <p className="text-gray-700 font-semibold text-lg">{lessonPlan.author}</p>
              </div>
              <Button
                icon={lessonPlan.isFavorite ? <HeartFilled /> : <HeartOutlined />}
                type="link"
                style={{ fontSize: '20px', color: lessonPlan.isFavorite ? 'red' : 'black' }}
              />
            </div>
          </Card>
        </div>

        {/* Right Side - Lesson Details */}
        <div className="w-full lg:w-2/3 pl-4">
          <h1 className="text-3xl font-bold">{lessonPlan.title}</h1>
          <div className="flex flex-col space-y-2 text-lg mt-4">
            <div className="flex items-center">
              <BookOutlined className="mr-2" />
              <span>Môn học: {lessonPlan.subject}</span>
            </div>
            <div className="flex items-center">
              <UserOutlined className="mr-2" />
              <span>Lớp: {lessonPlan.grade}</span>
            </div>
            <div className="flex items-center">
              <HeartOutlined className="mr-2" />
              <span>Lượt yêu thích: {lessonPlan.isFavorite ? '1' : '0'}</span>
            </div>
          </div>

          {/* Add to Collection Button */}
          <Button className="mt-6" icon={<PlusOutlined />} type="primary" size="large">
            Thêm vào kho giáo án của tôi
          </Button>
        </div>
      </div>

      {/* Sticky Navbar */}
      <Affix offsetTop={0}>
        <div className="mt-8 bg-white p-2 shadow-md flex justify-around">
          <Button type="link" onClick={() => scrollToSection(descriptionRef)}>
            Mô Tả
          </Button>
          <Button type="link" onClick={() => scrollToSection(contentRef)}>
            Nội Dung
          </Button>
          <Button type="link" onClick={() => scrollToSection(feedbackRef)}>
            Đánh Giá
          </Button>
        </div>
      </Affix>

      {/* Sections */}
      <div ref={descriptionRef} className="mt-8">
        <h2 className="text-2xl font-semibold">Mô Tả:</h2>
        <p className="text-gray-700 leading-relaxed">
          Đây là giáo án Toán lớp 10 với nội dung bao gồm các bài học về đại số, hàm số, và nhiều chương thú vị khác...
        </p>
      </div>

      <div ref={contentRef} className="mt-8">
        <h2 className="text-2xl font-semibold">Nội Dung:</h2>

        {/* Search Lessons */}
        <div className="mt-4 mb-4">
          <Input
            placeholder="Tìm kiếm bài học..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
          />
        </div>

        {/* List of Chapters and Lessons */}
        {chapters.map((chapter) => (
          <div key={chapter.chapter} className="mb-4">
            <h3 className="font-bold text-xl">{chapter.chapter}</h3>
            <List
              itemLayout="horizontal"
              dataSource={chapter.lessons.filter((lesson) =>
                lesson.toLowerCase().includes(searchTerm.toLowerCase())
              )}
              renderItem={(lesson) => (
                <List.Item>
                  <a href="#" className="text-blue-500 hover:underline">{lesson}</a>
                </List.Item>
              )}
            />
          </div>
        ))}

        {/* Message when no lessons match the search */}
        {filteredLessons.length === 0 && (
          <p className="text-gray-500 italic">Không tìm thấy bài học nào khớp với từ khóa tìm kiếm.</p>
        )}
      </div>

      <div ref={feedbackRef} className="mt-12">
  <h2 className="text-2xl font-semibold mb-4">Đánh Giá:</h2>
  <List
    itemLayout="vertical"
    dataSource={filteredFeedback}
    renderItem={(item) => (
      <List.Item className="p-4 mb-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-start">
          {/* Avatar */}
          <Avatar src={item.author_img} size={64} className="mr-4" />

          {/* Feedback Content */}
          <div className="flex-1">
            {/* Name and Rating */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{item.author_name}</h3>
                <p className="text-gray-500 text-sm">{item.designation}</p>
              </div>
              <Rate allowHalf disabled defaultValue={item.rating} className="ml-4" />
            </div>

            {/* Description */}
            <p className="mt-2 text-gray-700 italic leading-relaxed">{item.desc}</p>
          </div>
        </div>
      </List.Item>
    )}
  />
</div>

      {/* Suggested Lesson Plans */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold">Giáo án tương tự:</h2>
        <Carousel dots={false} slidesToShow={3} arrows={true} className="mt-4">
          {similarLessonPlans.map((plan) => (
            <Card
              key={plan.id}
              className="p-2"
              cover={<img alt={plan.title} src={plan.image || "default_image_url"} className="h-40 object-cover" />}
            >
              <Card.Meta title={plan.title} description={`Lớp ${plan.grade}`} />
            </Card>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default DetailLessonPlan;
