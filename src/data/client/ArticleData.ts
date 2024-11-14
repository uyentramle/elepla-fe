import apiClient from '@/data/apiClient';
// import axios from 'axios';
const defaultThumb = 'https://media.istockphoto.com/id/922745190/photo/blogging-blog-concepts-ideas-with-worktable.jpg?s=612x612&w=0&k=20&c=xR2vOmtg-N6Lo6_I269SoM5PXEVRxlgvKxXUBMeMC_A=';

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
}

export const getViewListArticle = async (): Promise<IViewListArticle[]> => {
    try {
        const response = await apiClient.get('Article/GetAllArticle', {
            params: {
                pageIndex: 0,
                pageSize: 10,
            },
            headers: {
                'accept': '*/*',
            },
        });
        const articles = response.data.data.items
            .filter((article: any) => article.status === 'Public')
            .map((article: any) => ({
                id: article.articleId,
                url: article.url,
                title: article.title,
                excerpt: article.excerpt,
                status: article.status,
                thumb: article.thumb || defaultThumb,
                created_at: article.createdAt,
                created_by: article.createdBy || '',
                updated_at: article.updatedAt || undefined,
                updated_by: article.updatedBy || undefined,
            }));

        return articles;
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
};

export interface IViewDetailArticle {
    id: string;
    slug: string;
    title: string;
    content: string;
    status: string;
    thumb: string;

    categories: string[] | undefined;

    created_at: string;
    created_by: string;
}

export const getArticleById = async (articleId: string): Promise<IViewDetailArticle | null> => {
    try {
        const response = await apiClient.get(`Article/GetArticleById?id=${articleId}`, {
            headers: {
                'accept': '*/*',
            },
        });

        const article = {
            id: response.data.data.articleId,
            slug: response.data.data.url,
            title: response.data.data.title,
            content: response.data.data.content,
            status: response.data.data.status,
            thumb: response.data.data.thumb || defaultThumb,
            categories: response.data.data.categories || [],
            created_at: response.data.data.createdAt,
            created_by: response.data.data.createdBy || '',
        };

        return article;
    } catch (error) {
        console.error('Error fetching article:', error);
        return null;
    }
};
