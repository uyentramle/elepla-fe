import apiClient from '@/data/apiClient';
// import apiclient from 'apiclient';

export interface IViewListCategory {
    id: string;
    name: string;
    url: string;
    description: string;
    status: boolean;
    created_at: string;
    created_by: string;
    updated_at: string | undefined;
    updated_by: string | undefined;
    deleted_at: string | undefined;
    deleted_by: string | undefined;
    isDelete: boolean;
}

export const fetchListCategory = async (): Promise<IViewListCategory[]> => {
    try {
        const response = await apiClient.get('/Category/GetAllCategory?pageIndex=0&pageSize=100');
        if (response.data.success) {
            return response.data.data.items.map((category: any) => ({
                id: category.categoryId,
                name: category.name,
                url: category.url,
                description: category.description,
                status: category.status,
                created_at: category.createdAt,
                created_by: category.createdBy || '',
                updated_at: category.updatedAt || undefined,
                updated_by: category.updatedBy || undefined,
                deleted_at: category.deletedAt || undefined,
                deleted_by: category.deletedBy || undefined,
                isDelete: category.isDelete,
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};

export const deleteCategory = async (id: string): Promise<boolean> => {
    try {
        const response = await apiClient.delete(`/Category/DeleteCategory`, {
            data: { id }  // Include the id as part of the request body
        });
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error deleting category:', error);
        return false;
    }
};

export interface ICategoryForm {
    id: string | undefined;
    name: string;
    url: string | undefined;
    description: string | undefined;
    status: boolean;
}

export const createCategory = async (category: ICategoryForm): Promise<boolean> => {
    try {
        const response = await apiClient.post('/Category/CreateCategory', category);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error creating category:', error);
        return false;
    }
};

export const updateCategory = async (category: ICategoryForm): Promise<boolean> => {
    try {
        const response = await apiClient.put('/Category/UpdateCategory', category);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error updating category:', error);
        return false;
    }
};

export const countCategories = async (): Promise<number> => {
    const categories = await fetchListCategory();
    return categories.length;
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ICategory {
    id: string;
    name: string;
    url: string;
    description: string;
    status: boolean;
    thumb: string;

    createdAt: Date;
    createdBy: string;
    updatedAt: Date | null;
    updatedBy: string | null;
    deletedAt: Date | null;
    deletedBy: string | null;
    isDelete: boolean;
}

const category_data: ICategory[] = [
    {
        id: "1",
        name: 'React',
        url: 'react',
        description: 'ReactJS is a JavaScript library for building user interfaces.',
        status: true,
        thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png',

        createdAt: new Date(),
        createdBy: 'Admin',
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
    {
        id: "2",
        name: 'NodeJS',
        url: 'nodejs',
        description: 'Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser.',
        status: true,
        thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1280px-Node.js_logo.svg.png',

        createdAt: new Date(),
        createdBy: 'Admin',
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
    {
        id: "3",
        name: 'TypeScript',
        url: 'typescript',
        description: 'TypeScript is a strongly typed, object oriented, compiled language. It was designed by Anders Hejlsberg (designer of C#) at Microsoft.',
        status: true,
        thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1280px-Typescript_logo_2020.svg.png',

        createdAt: new Date(),
        createdBy: 'Admin',
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
];

export default category_data;