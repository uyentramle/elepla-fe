interface MenuItem {
   id: number;
   title: string;
   link: string;
   has_dropdown: boolean;
   sub_menus?: {
      link: string;
      title: string;
   }[];
}[];

const menu_data: MenuItem[] = [
   {
      id: 1,
      has_dropdown: false,
      title: "Trang chủ",
      link: "/",
   },
   {
      id: 2,
      has_dropdown: false,
      title: "Kho kế hoạch bài dạy",
      link: "/planbook-library",
      sub_menus: [
         { link: "/course", title: "Course" },
         { link: "/course-details", title: "Course Single" },
      ],
   },
   {
      id: 3,
      has_dropdown: false,
      title: "Ngân hàng câu hỏi",
      link: "/question-bank",
   },
   {
      id: 4,
      has_dropdown: false,
      title: "Gói dịch vụ",
      link: "/package-detail",
   },
   {
      id: 5,
      has_dropdown: false,
      title: " Bài viết ",
      link: "/articles",
   },
   {
      id: 6,
      has_dropdown: false,
      title: "Liên hệ",
      link: "#",
      sub_menus: [
         { link: "/about", title: "About Us" },
      ],
   },
];
export default menu_data;
