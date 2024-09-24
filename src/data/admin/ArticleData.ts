import blog2Thumb_1 from "/assets/img/blog/4.png";
import blog2Thumb_2 from "/assets/img/blog/5.png";
import blog2Thumb_3 from "/assets/img/blog/6.png";
import blog2Thumb_4 from "/assets/img/blog/7.png";

export interface Article {
    id: number;
    title: string;
    url: string;
    content: string;
    status: string;
    thumb: string;

    createdAt: Date;
    createdBy: string;
    updatedAt: Date | null;
    updatedBy: string | null;
    deletedAt: Date | null;
    deletedBy: string | null;
    isDelete: boolean;
}

const article_data: Article[] = [
    {
        id: 1,
        title: "Flock by when MTV ax quiz prog quiz graced",
        url: "inner_blog_2",
        content: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
        status: "Public",
        thumb: blog2Thumb_1,
        createdAt: new Date("2020-01-28"),
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
    {
        id: 2,
        title: "Quisque suscipit ipsum est, eu venen leo",
        url: "inner_blog_2",
        content: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
        status: "Public",
        thumb: blog2Thumb_2,
        createdAt: new Date("2020-01-29"),
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
    {
        id: 3,
        title: "When MTV ax quiz prog Flock by graced",
        url: "inner_blog_2",
        content: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
        status: "Public",
        thumb: blog2Thumb_3,
        createdAt: new Date("2020-01-30"),
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
    {
        id: 4,
        title: "Flock by when MTV ax quiz prog quiz graced",
        url: "inner_blog_2",
        content: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
        status: "Inactive",
        thumb: blog2Thumb_4,
        createdAt: new Date("2020-01-28"),
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
    {
        id: 5,
        title: "Quisque suscipit ipsum est, eu venen leo",
        url: "inner_blog_2",
        content: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
        status: "Draft",
        thumb: blog2Thumb_1,
        createdAt: new Date("2020-01-29"),
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
    {
        id: 6,
        title: "When MTV ax quiz prog Flock by graced",
        url: "inner_blog_2",
        content: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
        status: "Trash",
        thumb: blog2Thumb_2,
        createdAt: new Date("2020-01-30"),
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
    {
        id: 7,
        title: "Flock by when MTV ax quiz prog quiz graced",
        url: "inner_blog_2",
        content: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
        status: "Public",
        thumb: blog2Thumb_3,
        createdAt: new Date("2020-01-28"),
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
    {
        id: 8,
        title: "Quisque suscipit ipsum est, eu venen leo",
        url: "inner_blog_2",
        content: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
        status: "Public",
        thumb: blog2Thumb_4,
        createdAt: new Date("2020-01-29"),
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
    {
        id: 9,
        title: "When MTV ax quiz prog Flock by graced",
        url: "inner_blog_2",
        content: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
        status: "Public",
        thumb: blog2Thumb_1,
        createdAt: new Date("2020-01-30"),
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
    {
        id: 10,
        title: "Flock by when MTV ax quiz prog quiz graced",
        url: "inner_blog_2",
        content: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
        status: "Public",
        thumb: blog2Thumb_2,
        createdAt: new Date("2020-01-28"),
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
    {
        id: 11,
        title: "Quisque suscipit ipsum est, eu venen leo",
        url: "inner_blog_2",
        content: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
        status: "Public",
        thumb: blog2Thumb_3,
        createdAt: new Date("2020-01-29"),
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
    {
        id: 12,
        title: "When MTV ax quiz prog Flock by graced",
        url: "inner_blog_2",
        content: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
        status: "Public",
        thumb: blog2Thumb_3,
        createdAt: new Date("2020-01-30"),
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
    {
        id: 13,
        title: "Flock by when MTV ax quiz prog quiz graced",
        url: "inner_blog_2",
        content: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
        status: "Public",
        thumb: blog2Thumb_4,
        createdAt: new Date("2020-01-28"),
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
    {
        id: 14,
        title: "Quisque suscipit ipsum est, eu venen leo",
        url: "inner_blog_2",
        content: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
        status: "Public",
        thumb: blog2Thumb_1,
        createdAt: new Date("2020-01-29"),
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
    {
        id: 15,
        title: "When MTV ax quiz prog Flock by graced",
        url: "inner_blog_2",
        content: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
        status: "Public",
        thumb: blog2Thumb_2,
        createdAt: new Date("2020-01-30"),
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
];

export default article_data;