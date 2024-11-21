import icon_1 from "/assets/img/icon/22.png";
import icon_2 from "/assets/img/icon/19.png";
import icon_3 from "/assets/img/icon/21.png";

interface DataType {
    id: number;
    page: string;
    icon: string;
    title: string;
    desc?: string;
    item_bg?: string;
}[];

const intro_data: DataType[] = [
    {
        id: 1,
        page: "home_1",
        icon: icon_1,
        title: "Công cụ số hóa siêu đơn giản",
        desc: "Chỉnh sửa nhanh chóng các mẫu kế hoạch bài dạy có sẵn từ thư viện mẫu"
    },
    {
        id: 2,
        page: "home_1",
        icon: icon_2,
        title: "Quản lý thời khóa biểu hàng tuần",
        desc: "Giáo viên quản lý thời gian biểu theo lịch dạy của mình trong tuần"
    },
    {
        id: 3,
        page: "home_1",
        icon: icon_3,
        title: "Kênh thông tin văn bản công văn",
        desc: "Cập nhập các thông tin, văn bản, công văn về lĩnh vực giáo dục"
    },
];

export default intro_data;