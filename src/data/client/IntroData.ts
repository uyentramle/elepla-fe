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
        title: "Postgraduate",
        desc: "Lorem ipsum dolor"
    },
    {
        id: 2,
        page: "home_1",
        icon: icon_2,
        title: "Engineering",
        desc: "Lorem ipsum dolor"
    },
    {
        id: 3,
        page: "home_1",
        icon: icon_3,
        title: "Accounting",
        desc: "Lorem ipsum dolor"
    },
];

export default intro_data;