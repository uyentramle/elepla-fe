import apiClient from '@/data/apiClient';
// import apiclient from 'apiclient';

export interface IViewListCategory {
    id: string;
    name: string;
    url: string;
    description: string;
    status: boolean;
    isDelete: boolean;
}

export const fetchListCategory = async (): Promise<IViewListCategory[]> => {
    try {
        const response = await apiClient.get('/Category/GetAllCategory?pageIndex=0&pageSize=10');
        if (response.data.success) {
            return response.data.data.items
                .filter((category: any) => category.status && !category.isDelete)
                .map((category: any) => ({
                    id: category.categoryId,
                    name: category.name,
                    url: category.url,
                    description: category.description,
                    status: category.status,
                    isDelete: category.isDelete,
                }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};