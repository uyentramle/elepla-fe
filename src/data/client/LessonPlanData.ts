// lessonPlanDetailData.ts

export interface LessonPlan {
    id: number;
    title: string;
    subject: string;
    grade: string;
    author: string;
    rating: number;
    image: string;
    isFavorite: boolean;
    avatar: string;
    
  }
  const src: string = "https://chantroisangtao.vn/wp-content/uploads/2024/01/Toan-12-T1-BIT.png"
  
  export const lessonPlans: LessonPlan[] = [
    {
      id: 1,
      title: "Giáo án Toán Lớp 10",
      subject: "Toán",
      grade: "10",
      author: "Người tạo 1",
      rating: 4.5,
      image: src, 
      isFavorite: false,
      avatar: src,
    },
    {
      id: 2,
      title: "Giáo án Văn Lớp 11",
      subject: "Ngữ Văn",
      grade: "11",
      author: "Người tạo 2",
      rating: 4.0,
      image: src,
      isFavorite: true,
      avatar: src,
    },
    {
      id: 3,
      title: "Giáo án Hóa Học Lớp 12",
      subject: "Hóa Học",
      grade: "12",
      author: "Người tạo 3",
      rating: 3.5,
      image: src,
      isFavorite: false,
      avatar: src,
    },
    {
      id: 4,
      title: "Giáo án Vật Lý Lớp 10",
      subject: "Vật Lý",
      grade: "10",
      author: "Người tạo 4",
      rating: 5.0,
      image: src,
      isFavorite: true,
      avatar: src,
    },
    {
      id: 5,
      title: "Giáo án Sinh Học Lớp 11",
      subject: "Sinh Học",
      grade: "11",
      author: "Người tạo 5",
      rating: 4.2,
      image: src,
      isFavorite: false,
      avatar: src,
    },
    {
      id: 6,
      title: "Giáo án Địa Lý Lớp 12",
      subject: "Địa Lý",
      grade: "12",
      author: "Người tạo 6",
      rating: 3.8,
      image: src,
      isFavorite: false,
      avatar: src,
    },
  ];
  