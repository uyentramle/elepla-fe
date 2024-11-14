import axios from 'axios';

export interface IViewListLesson {
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

export const fetchLessonList = async (): Promise<IViewListLesson[]> => {
    try {
        const response = await axios.get('https://elepla-be-production.up.railway.app/api/Lesson/GetAllLesson?pageIndex=0&pageSize=50');
        if (response.data.success) {
            return response.data.data.items.map((lesson: any) => ({
                id: lesson.lessonId,
                name: lesson.name,
                description: lesson.description,
                created_at: lesson.createdAt,
                created_by: lesson.createdBy || '',
                updated_at: lesson.updatedAt || undefined,
                updated_by: lesson.updatedBy || undefined,
                deleted_at: lesson.deletedAt || undefined,
                deleted_by: lesson.deletedBy || undefined,
                isDelete: lesson.isDelete,
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching lesson list:', error);
        return [];
    }
};

export const fetchLessonsBySubjectInCurriculumId = async (subjectInCurriculumId: string): Promise<IViewListLesson[]> => {
    try {
        const response = await axios.get(`https://elepla-be-production.up.railway.app/api/Lesson/GetAllLessonBySubjectInCurriculumId?subjectInCurriculumId=${subjectInCurriculumId}`);
        if (response.data.success) {
            return response.data.data.items.map((lesson: any) => ({
                id: lesson.lessonId,
                name: lesson.name,
                description: lesson.description,
                created_at: lesson.createdAt,
                created_by: lesson.createdBy || '',
                updated_at: lesson.updatedAt || undefined,
                updated_by: lesson.updatedBy || undefined,
                deleted_at: lesson.deletedAt || undefined,
                deleted_by: lesson.deletedBy || undefined,
                isDelete: lesson.isDelete,
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching lesson list:', error);
        return [];
    }
};

export const deleteLesson = async (lessonId: string): Promise<boolean> => {
    try {
        const response = await axios.delete(`https://elepla-be-production.up.railway.app/api/Lesson/DeleteLesson?lessonId=${lessonId}`);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error deleting lesson:', error);
        return false;        
    }
};

export interface ILessonForm {
    id: string | undefined;
    name: string;
    description: string | undefined;
}

export const createLesson = async (lesson: ILessonForm): Promise<boolean> => {
    try {
        const response = await axios.post('https://elepla-be-production.up.railway.app/api/Lesson/CreateLesson', lesson);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error creating lesson:', error);
        return false;
    }
};

export const updateLesson = async (lesson: ILessonForm): Promise<boolean> => {
    try {
        const response = await axios.put('https://elepla-be-production.up.railway.app/api/Lesson/UpdateLesson', lesson);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error updating lesson:', error);
        return false;
    }
};
