import axios from 'axios';

export interface IViewListChapter {
    id: string;
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

export const fetchChapterList = async (): Promise<IViewListChapter[]> => {
    try {
        const response = await axios.get('https://elepla-be-production.up.railway.app/api/Chapter/GetAllChapter?pageIndex=0&pageSize=50');
        if (response.data.success) {
            return response.data.data.items.map((chapter: any) => ({
                id: chapter.chapterId,
                name: chapter.name,
                description: chapter.description,
                created_at: chapter.createdAt,
                created_by: chapter.createdBy || '',
                updated_at: chapter.updatedAt || undefined,
                updated_by: chapter.updatedBy || undefined,
                deleted_at: chapter.deletedAt || undefined,
                deleted_by: chapter.deletedBy || undefined,
                isDelete: chapter.isDelete,
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching chapter list:', error);
        return [];
    }
};

export const fetchChaptersBySubjectInCurriculumId = async (subjectInCurriculumId: string): Promise<IViewListChapter[]> => {
    try {
        const response = await axios.get(`https://elepla-be-production.up.railway.app/api/Chapter/GetAllChapterBySubjectInCurriculumId?subjectInCurriculumId=${subjectInCurriculumId}`);
        if (response.data.success) {
            return response.data.data.items.map((chapter: any) => ({
                id: chapter.chapterId,
                name: chapter.name,
                description: chapter.description,
                created_at: chapter.createdAt,
                created_by: chapter.createdBy || '',
                updated_at: chapter.updatedAt || undefined,
                updated_by: chapter.updatedBy || undefined,
                deleted_at: chapter.deletedAt || undefined,
                deleted_by: chapter.deletedBy || undefined,
                isDelete: chapter.isDelete,
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching chapter list:', error);
        return [];
    }
};

export const deleteChapter = async (chapterId: string): Promise<boolean> => {
    try {
        const response = await axios.delete(`https://elepla-be-production.up.railway.app/api/Chapter/DeleteChapter?chapterId=${chapterId}`);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error deleting chapter:', error);
        return false;        
    }
};

export interface IChapterForm {
    id: string | undefined;
    name: string;
    description: string | undefined;
}

export const createChapter = async (chapter: IChapterForm): Promise<boolean> => {
    try {
        const response = await axios.post('https://elepla-be-production.up.railway.app/api/Chapter/CreateChapter', chapter);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error creating chapter:', error);
        return false;
    }
};

export const updateChapter = async (chapter: IChapterForm): Promise<boolean> => {
    try {
        const response = await axios.put('https://elepla-be-production.up.railway.app/api/Chapter/UpdateChapter', chapter);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error updating chapter:', error);
        return false;
    }
};
