import apiClient from '@/data/apiClient';
// import apiclient from 'apiclient';

export interface IViewListGrade {
    gradeId: string;
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

export const fetchGradeList = async (): Promise<IViewListGrade[]> => {
    try {
        const response = await apiClient.get('/Grade/GetAllGrade?pageIndex=0&pageSize=10');
        if (response.data.success) {
            return response.data.data.items.map((grade: any) => ({
                id: grade.gradeId,
                name: grade.name,
                description: grade.description,
                created_at: grade.createdAt,
                created_by: grade.createdBy || '',
                updated_at: grade.updatedAt || undefined,
                updated_by: grade.updatedBy || undefined,
                deleted_at: grade.deletedAt || undefined,
                deleted_by: grade.deletedBy || undefined,
                isDelete: grade.isDelete,
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching grade list:', error);
        return [];
    }
};

export const deleteGrade = async (gradeId: string): Promise<boolean> => {
    try {
        const response = await apiClient.delete(`/Grade/DeleteGrade?gradeId=${gradeId}`);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error deleting grade:', error);
        return false;        
    }
};

export interface IGradeForm {
    id: string | undefined;
    name: string;
    description: string | undefined;
}

export const createGrade = async (grade: IGradeForm): Promise<boolean> => {
    try {
        const response = await apiClient.post('/Grade/CreateGrade', grade);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error creating grade:', error);
        return false;
    }
};

export const updateGrade = async (grade: IGradeForm): Promise<boolean> => {
    try {
        const response = await apiClient.put('/Grade/UpdateGrade', grade);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error updating grade:', error);
        return false;
    }
};

export const getAllGrade = async (): Promise<IViewListGrade[]> => {
    try {
        const response = await apiClient.get('/Grade/GetAllGrade', {
            params: {
                pageIndex: -1,
            }
        });
        if (response.data.success) {
            return response.data.data.items;
        }
        return [];
    } catch (error) {
        console.error('Error fetching grade list:', error);
        return [];
    }
}