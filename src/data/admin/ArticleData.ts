import axios from 'axios';

export interface IViewListArticle {
    id: string;
    url: string;
    title: string;
    excerpt: string;
    status: string;
    thumb: string;

    created_at: string;
    created_by: string;
    updated_at: string | undefined;
    updated_by: string | undefined;
    deleted_at: string | undefined;
    deleted_by: string | undefined;
    isDelete: boolean;
}

export const getViewListArticle = async (): Promise<IViewListArticle[]> => {
    try {
        const response = await axios.get('https://localhost:7052/api/Article/GetAllArticle', {
            params: {
                pageIndex: 0,
                pageSize: 10,
            },
            headers: {
                'accept': '*/*',
            },
        });

        const articles = response.data.data.items.map((article: any) => ({
            id: article.articleId,
            url: article.url,
            title: article.title,
            excerpt: article.excerpt,
            status: article.status,
            thumb: article.thumb || '',
            created_at: article.createdAt,
            created_by: article.createdBy || '',
            updated_at: article.updatedAt || undefined,
            updated_by: article.updatedBy || undefined,
            deleted_at: article.deletedAt || undefined,
            deleted_by: article.deletedBy || undefined,
            isDelete: article.isDelete,
        }));

        return articles;
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
};

export const deleteArticle = async (articleId: string): Promise<boolean> => {
    try {
        const response = await axios.delete(`https://localhost:7052/api/Article/DeleteArticle?id=${articleId}`, {
            headers: {
                'accept': '*/*',
            },
        });
        return response.status === 200;
    } catch (error) {
        console.error('Error deleting article:', error);
        return false;
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import blog2Thumb_1 from "/assets/img/blog/4.png";
import blog2Thumb_2 from "/assets/img/blog/5.png";
import blog2Thumb_3 from "/assets/img/blog/6.png";
import blog2Thumb_4 from "/assets/img/blog/7.png";

export interface IArticle {
    id: string;
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
    categoryId: string;
}

const article_data: IArticle[] = [
    {
        id: "1",
        title: "Hầu Hết Mọi Người Đều Mắc Phải Những Sai Lầm Sau Khi Thiết Kế Bài Giảng Trực Tuyến",
        url: "inner-blog-2",
        content: `Nội dung bài giảng là một trong những yếu tố then chốt quyết định tới sự thành công của bài học. Để tạo được một bài giảng e-learning không hề khó nhưng để có thể khiến nó trở nên thu hút thì không phải chuyện đơn giản. Hầu hết các giáo viên khi mới tập làm quen thiết kế bài giảng e-learning đều vấp phải những sai lầm sau.

1. Nội dung bài giảng không thống nhất
Sai lầm đầu tiên mà rất nhiều người mắc phải đó là thiết kế các bài giảng e-learning không thống nhất, nội dung không có tính liên kết giữa các phần dẫn đến tình trạng học viên không hiểu bài, khó tiếp thu và khó theo được bài giảng.

Để tránh được tình trạng rời rạc trong nội dung bài học, thầy cô cần xâu chuỗi, đảm bảo các phần trong bài học có tính liên kết, tạo nên một tổng thể hoàn chỉnh. Cố gắng hạn chế không truyền đạt quá nhiều thông tin bên lề, không quan trọng hoặc không liên quan tới nội dung bài giảng.

2. Quá nhiều chữ (text) trong một bài giảng
Sai lầm thứ hai trong thiết kế bài giảng trực tuyến mà rất nhiều người mắc phải đó là vẫn “bê nguyên” cách học truyền thống thông thường: cố gắng cho học sinh viết nhiều chữ nhất có thể. Nội dung bài giảng e-learning là sự kết hợp giữa các slide với những hình ảnh, âm thanh, text khác nhau.

Bạn chỉ nên điền một lượng text vừa phải, ghi lại những thông tin trọng tâm và quan trọng nhất của bài giảng rồi dùng hình ảnh, âm thanh...để phụ trợ cho bài học. Điều này không chỉ giúp cho học viên ghi nhớ bài giảng nhanh hơn, mà còn tạo nên sự sôi nổi trong lớp học, hữu ích hơn nhiều so với việc soạn thảo bài giảng với các đoạn text dài nhàm chán.

3. Bài giảng thiếu tính năng tương tác
Khi soạn bài giảng e-learning rất nhiều thầy cô chỉ mải chú trọng tới câu chữ, hình ảnh trong bài giảng mà quên việc tạo nên những câu hỏi quiz và các hình thức tương tác trực tuyến khác trong lớp học. Dù kiến thức trong bài giảng có hay tới mấy nếu như bạn chỉ chăm chăm nói một chiều thì cũng khó có thể biết được học viên có thực sự hiểu bài và hứng thú với bài giảng đó hay không.

Do vậy, để tạo nên được một bài giảng trực tuyến hấp dẫn cần phải có tính tương tác hai chiều giữa người dạy học, và ngược lại. Khi thiết kế bài giảng, thầy cô nên có thêm mọt số phần tương tác như: gọi học viên lên bảng làm bài tập, tạo câu hỏi trắc nghiệm,...

4. Bài giảng dài dòng, khó hiểu
Thêm một lỗi nữa khi soạn giảng e-learning mà nhiều thầy cô mắc phải đó là bài giảng quá dài dòng, khó hiểu. Để hạn chế được điều này thầy cô chỉ nên đưa ra những thông tin trọng tâm trong bài giảng để học viên có thể dễ dàng ghi nhớ.

Ngoài ra, câu cú nên mạch lạc, tránh sai lỗi chính tả, sử dụng từ ngữ địa phương, từ tối nghĩa (trừ trường hợp bắt buộc phải sử dụng từ ngữ chuyên ngành) để học viên có thể dễ dàng nắm bắt.

Và điều quan trọng nhất, các thầy cô nên sử dụng những phần mềm dạy học trực tuyến tích hợp cả chức năng dạy học và soạn giảng đi kèm, để có thể hỗ trợ công việc soạn giảng tốt nhất.

Tìm hiểu thông tin về phần mềm dạy học trực tuyến e-learning: TẠI ĐÂY

Trên đây là một số lỗi sai cơ bản khi thiết kế bài giảng e-learning. Hy vọng bài viết vừa rồi đã cung cấp cho bạn thêm những thông tin hữu ích. Nếu như bạn vẫn còn băn khoăn thắc mắc nào liên quan đến dạy học trực tuyến thì đừng ngần ngại nhấc máy lên gọi cho chúng tôi đễ được hỗ trợ tốt nhất nhé!`,
        status: "Public",
        thumb: blog2Thumb_1,
        createdAt: new Date("2020-01-28"),
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
        categoryId: "1",
    },
    {
        id: "2",
        title: "Quisque suscipit ipsum est, eu venen leo",
        url: "inner-blog-2",
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
        categoryId: "1",

    },
    {
        id: "3",
        title: "When MTV ax quiz prog Flock by graced",
        url: "inner-blog-2",
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
        categoryId: "1",

    },
    {
        id: "4",
        title: "Flock by when MTV ax quiz prog quiz graced",
        url: "inner-blog-2",
        content: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
        status: "Private",
        thumb: blog2Thumb_4,
        createdAt: new Date("2020-01-28"),
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
        categoryId: "1",
    },
    {
        id: "5",
        title: "Quisque suscipit ipsum est, eu venen leo",
        url: "inner-blog-2",
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
        categoryId: "1",

    },
    {
        id: "6",
        title: "When MTV ax quiz prog Flock by graced",
        url: "inner-blog-2",
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
        categoryId: "1",

    },
    {
        id: "7",
        title: "Flock by when MTV ax quiz prog quiz graced",
        url: "inner-blog-2",
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
        categoryId: "1",

    },
    {
        id: "8",
        title: "Quisque suscipit ipsum est, eu venen leo",
        url: "inner-blog-2",
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
        categoryId: "2",

    },
    {
        id: "9",
        title: "When MTV ax quiz prog Flock by graced 2",
        url: "inner-blog-2",
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
        categoryId: "2",

    },
    {
        id: "10",
        title: "Flock by when MTV ax quiz prog quiz graced",
        url: "inner-blog-2",
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
        categoryId: "2",

    },
    {
        id: "11",
        title: "Quisque suscipit ipsum est, eu venen leo",
        url: "inner-blog-2",
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
        categoryId: "2",

    },
    {
        id: "12",
        title: "When MTV ax quiz prog Flock by graced 2 ",
        url: "inner-blog-2",
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
        categoryId: "2",

    },
    {
        id: "13",
        title: "Flock by when MTV ax quiz prog quiz graced 2",
        url: "inner-blog-2",
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
        categoryId: "2",

    },
    {
        id: "14",
        title: "Quisque suscipit ipsum est, eu venen leo",
        url: "inner-blog-2",
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
        categoryId: "3",
    },
    {
        id: "15",
        title: "When MTV ax quiz prog Flock by graced 3",
        url: "inner-blog-2",
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
        categoryId: "3",

    },
];

export default article_data;