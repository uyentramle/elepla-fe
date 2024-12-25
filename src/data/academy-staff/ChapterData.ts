import apiClient from '@/data/apiClient';
// import apiclient from 'apiclient';

export interface IViewListChapter {
    chapterId: string;
    name: string;
    description: string | undefined;
    subjectInCurriculumId: string;
    subjectInCurriculum: string;
    subjectId: string;
    subject: string;
    gradeId: string;
    grade: string;
    curriculumId: string;
    curriculum: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string | undefined;
    updatedBy: string | undefined;
    deletedAt: string | undefined;
    deletedBy: string | undefined;
    isDelete: boolean;
}

export const fetchChapterList = async (): Promise<IViewListChapter[]> => {
    try {
        const response = await apiClient.get('/Chapter/GetAllChapter', {
            params: {
                pageIndex: -1,
            },
        });
        if (response.data.success) {
            return response.data.data.items.map((chapter: any) => ({
                chapterId: chapter.chapterId,
                name: chapter.name,
                description: chapter.description,
                subjectInCurriculumId: chapter.subjectInCurriculumId,
                subjectInCurriculum: chapter.subjectInCurriculum,
                subjectId: chapter.subjectId,
                subject: chapter.subject,
                gradeId: chapter.gradeId,
                grade: chapter.grade,
                curriculumId: chapter.curriculumId,
                curriculum: chapter.curriculum,
                createdAt: chapter.createdAt,
                createdBy: chapter.createdBy || '',
                updatedAt: chapter.updatedAt || undefined,
                updatedBy: chapter.updatedBy || undefined,
                deletedAt: chapter.deletedAt || undefined,
                deletedBy: chapter.deletedBy || undefined,
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
        const response = await apiClient.get(`/Chapter/GetAllChapterBySubjectInCurriculumId?subjectInCurriculumId=${subjectInCurriculumId}`);
        if (response.data.success) {
            return response.data.data.items.map((chapter: any) => ({
                chapterId: chapter.chapterId,
                name: chapter.name,
                description: chapter.description,
                createdAt: chapter.createdAt,
                createdBy: chapter.createdBy || '',
                updatedAt: chapter.updatedAt || undefined,
                updatedBy: chapter.updatedBy || undefined,
                deletedAt: chapter.deletedAt || undefined,
                deletedBy: chapter.deletedBy || undefined,
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
        const response = await apiClient.delete(`/Chapter/DeleteChapter?chapterId=${chapterId}`);
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
        const response = await apiClient.post('/Chapter/CreateChapter', chapter);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error creating chapter:', error);
        return false;
    }
};

export const updateChapter = async (chapter: IChapterForm): Promise<boolean> => {
    try {
        const response = await apiClient.put('/Chapter/UpdateChapter', chapter);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error updating chapter:', error);
        return false;
    }
};

export const getAllChapterBySubjectInCurriculumId = async (subjectInCurriculumId: string): Promise<IViewListChapter[]> => {
    try {
        const response = await apiClient.get(`/Chapter/GetAllChapterBySubjectInCurriculumId`, {
            params: {
                subjectInCurriculumId
            }
    });
        if (response.data.success) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching chapter list:', error);
        return [];
    }
}

interface CreateChapter {
    name: string;
    description: string;
    subjectInCurriculumId: string;
}

export const createChapterFunction = async (chapter: CreateChapter): Promise<boolean> => {
    try {
        const response = await apiClient.post('/Chapter/CreateChapter', chapter);
        if (response.data.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error creating chapter:', error);
        return false;
    }
}

interface UpdateChapter {
    chapterId: string;
    name: string;
    description: string;
    subjectInCurriculumId: string;
}

export const updateChapterFunction = async (chapter: UpdateChapter): Promise<boolean> => {
    try {
        const response = await apiClient.put('/Chapter/UpdateChapter', chapter);
        if (response.data.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error updating chapter:', error);
        return false;
    }
}

export const getChapteById = async (chapterId: string): Promise<IViewListChapter> => {
    try {
        const response = await apiClient.get(`/Chapter/GetChapterById?chapterId=${chapterId}`);
        if (response.data.success) {
            return response.data.data;
        }
        return {} as IViewListChapter;
    } catch (error) {
        console.error('Error fetching chapter:', error);
        return {} as IViewListChapter;
    }
}