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
      title: "Gói dịch vụ",
      link: "/package-detail",
   },
   {
      id: 4,
      has_dropdown: false,
      title: " Bài viết ",
      link: "/articles",
      sub_menus: [
         { link: "/blog", title: "Blog" },
         { link: "/blog-grid", title: "Blog Grid" },
         { link: "/blog-details", title: "Blog-Details", },
      ],
   },
   {
      id: 5,
      has_dropdown: false,
      title: "Hướng dẫn",
      link: "#",
      sub_menus: [
         { link: "/about", title: "About Us" },
         { link: "/event", title: "Event" },
         { link: "/event-details", title: "Event Details" },
         { link: "/team", title: "Instructor" },
         { link: "/team-details", title: "Instructor Details" },
         { link: "/pricing", title: "Pricing" },
         { link: "/gallery", title: "Gallery" },
         { link: "/signin", title: "Sign In" },
         { link: "/signup", title: "Sign Up" },
      ],
   },
   {
      id: 5,
      has_dropdown: false,
      title: "Liên hệ",
      link: "#",
      sub_menus: [
         { link: "/about", title: "About Us" },
      ],
   },
];
export default menu_data;
