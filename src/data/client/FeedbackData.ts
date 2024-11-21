
// FeedbackData.ts

interface DataType {
    id: number;
    page: string;
    desc: string;
    author_img: string;
    author_name: string;
    designation: string;
    rating: number;
}[];

const feedback_data: DataType[] = [
    {
        id: 1,
        page: "home_1",
        desc: "Hệ thống giúp tôi tiết kiệm rất nhiều thời gian trong việc chuẩn bị tài liệu giảng dạy. Các tính năng rất dễ sử dụng và hữu ích.",
        author_img: "/assets/img/1.png",
        author_name: "Nguyễn Lưu Châu",
        designation: "Giáo viên Toán",
        rating: 5,
    },
    {
        id: 2,
        page: "home_1",
        desc: "Tài liệu phong phú và đa dạng, giúp đỡ cho việc soạn kế hoạch bài dạy của tôi. Hệ thống hoạt động rất ổn định.",
        author_img: "/assets/img/1.png",
        author_name: "Trần Trọng Tấn",
        designation: "Giáo viên Công nghệ",
        rating: 5,
    },
    {
        id: 3,
        page: "home_1",
        desc: "Dịch vụ rất tốt, giao diện dễ sử dụng. Tuy nhiên, tôi mong muốn thêm các tính năng lọc tài liệu theo cấp độ chi tiết hơn.",
        author_img: "/assets/img/1.png",
        author_name: "Coleman Kelly",
        designation: "Giáo viên Tiếng Anh",
        rating: 4,
    },
    {
        id: 4,
        page: "home_1",
        desc: "Hệ thống giúp tôi cải thiện chất lượng giảng dạy. Tuy nhiên, tốc độ tải đôi khi hơi chậm vào giờ cao điểm.",
        author_img: "/assets/img/1.png",
        author_name: "Đặng Thị Hương",
        designation: "Giáo viên Hóa Học",
        rating: 4,
    },
    {
        id: 5,
        page: "home_1",
        desc: "Một nền tảng tuyệt vời cho giáo viên. Tôi rất thích tính năng tạo bằng AI.",
        author_img: "/assets/img/1.png",
        author_name: "Ngô Ngọc Lệ",
        designation: "Giáo viên Lịch Sử",
        rating: 5,
    },
];

export default feedback_data;