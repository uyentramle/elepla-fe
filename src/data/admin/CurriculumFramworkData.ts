import apiClient from '@/data/apiClient';
// import apiclient from 'apiclient';

export interface IViewListCurriculum {
    curriculumId: string;
    name: string;
    description: string | undefined;

    created_at: string;
    created_by: string;
    updated_at: string | undefined;
    updated_by: string | undefined;
    deleted_at: string | undefined;
    deleted_by: string | undefined;
    isDelete: boolean;
}

export const fetchCurriculumList = async (): Promise<IViewListCurriculum[]> => {
    try {
        const response = await apiClient.get('/CurriculumFramework/GetAllCurriculumFramework?pageIndex=0&pageSize=10');
        if (response.data.success) {
            return response.data.data.items.map((curriculum: any) => ({
                curriculumId: curriculum.curriculumId,
                name: curriculum.name,
                description: curriculum.description,
                created_at: curriculum.createdAt,
                created_by: curriculum.createdBy || '',
                updated_at: curriculum.updatedAt || undefined,
                updated_by: curriculum.updatedBy || undefined,
                deleted_at: curriculum.deletedAt || undefined,
                deleted_by: curriculum.deletedBy || undefined,
                isDelete: curriculum.isDelete,
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching curriculum list:', error);
        return [];
    }
};

export const deleteCurriculum = async (curriculumId: string): Promise<boolean> => {
    try {
        const response = await apiClient.delete(`/CurriculumFramework/DeleteCurriculumFramework?curriculumFrameworkId=${curriculumId}`);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error deleting curriculum:', error);
        return false;        
    }
};

export interface ICurriculumFrameworkForm {
    curriculumId: string | undefined;
    name: string;
    description: string | undefined;
}

export const createCurriculum = async (curriculum: ICurriculumFrameworkForm): Promise<boolean> => {
    try {
        const response = await apiClient.post('/CurriculumFramework/CreateCurriculumFramework', curriculum);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error creating curriculum:', error);
        return false;        
    }
};

export const updateCurriculum = async (curriculum: ICurriculumFrameworkForm): Promise<boolean> => {
    try {
        const response = await apiClient.put('/CurriculumFramework/UpdateCurriculumFramework', curriculum);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error updating curriculum:', error);
        return false;
    }
};

export const getAllCurriculumFramework = async (): Promise<IViewListCurriculum[]> => {
    try {
        const response = await apiClient.get('/CurriculumFramework/GetAllCurriculumFramework');
        return response.data.data.items;
    } catch (error) {
        console.error('Error fetching curriculum list:', error);
        return [];
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export interface ICurriculumFramework {
    id: string;
    name: string;
    description: string | undefined;
    is_approved: boolean;
}

const curriculumData: ICurriculumFramework[] = [
    {
        id: '1',
        name: 'Cánh diều',
        description: 'Curriculum Framework 1 Description',
        is_approved: true
    },
    {
        id: '2',
        name: 'Kết nối tri thức',
        description: 'Curriculum Framework 2 Description',
        is_approved: true
    },
    {
        id: '3',
        name: 'Curriculum Framework 3',
        description: 'Curriculum Framework 3 Description',
        is_approved: false
    },
    {
        id: '4',
        name: 'Curriculum Framework 4',
        description: 'Curriculum Framework 4 Description',
        is_approved: false
    },
];

export default curriculumData;