
interface DataType {
    id: number;
    page: string;
    desc: string;
    author_img: string;
    author_name: string;
    designation: string;
}[];

const feedback_data: DataType[] = [
    {
        id: 1,
        page: "home_1",
        desc: "Eugene Freeman sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, elitr, sed diam sed diam volu",
        author_img: "/assets/img/1.png",
        author_name: "Eugene Freeman",
        designation: "Tincidunt",
    },
    {
        id: 2,
        page: "home_1",
        desc: "Jaction Freeman amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed elitr, sed diam diam volu",
        author_img: "/assets/img/1.png",
        author_name: "Jaction Freeman",
        designation: "Tincidunt",
    },
    {
        id: 3,
        page: "home_2",
        desc: "Lorem ipsum dolor sit amet, consect etur adipiscing elit. Duis at est id leo luctus gravida a in ipsum.",
        author_img: "/assets/img/1.png",
        author_name: "Eugene Freeman",
        designation: "Tincidunt",
     },
     {
        id: 4,
        page: "home_2",
        desc: "Lorem ipsum dolor sit amet, consect etur adipiscing elit. Duis at est id leo luctus gravida a in ipsum.",
        author_img: "/assets/img/1.png",
        author_name: "Kelly Coleman",
        designation: "Nulla nec",
     },
];

export default feedback_data;