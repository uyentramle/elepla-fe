import apiClient from '@/data/apiClient';
// import apiclient from 'apiclient';

export interface IViewListLesson {
    lessonId: string;
    name: string;
    objectives: string | undefined;
    content: string;
    subjectInCurriculumId: string;
    chapterId: string;
    chapterName: string;
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

export const fetchLessonList = async (): Promise<IViewListLesson[]> => {
    try {
        const response = await apiClient.get('/Lesson/GetAllLesson', {
            params: {
                pageIndex: -1,
            },
        });
        if (response.data.success) {
            return response.data.data.items.map((lesson: any) => ({
                lessonId: lesson.lessonId,
                name: lesson.name,
                objectives: lesson.objectives,
                content: lesson.content,
                subjectInCurriculumId: lesson.subjectInCurriculumId,
                chapterId: lesson.chapterId,
                chapterName: lesson.chapterName,
                subjectId: lesson.subjectId,
                subject: lesson.subject,
                gradeId: lesson.gradeId,
                grade: lesson.grade,
                curriculumId: lesson.curriculumId,
                curriculum: lesson.curriculum,
                createdAt: lesson.createdAt,
                createdBy: lesson.createdBy || '',
                updatedAt: lesson.updatedAt || undefined,
                updatedBy: lesson.updatedBy || undefined,
                deletedAt: lesson.deletedAt || undefined,
                deletedBy: lesson.deletedBy || undefined,
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
        const response = await apiClient.get(`/Lesson/GetAllLessonBySubjectInCurriculumId?subjectInCurriculumId=${subjectInCurriculumId}`);
        if (response.data.success) {
            return response.data.data.items.map((lesson: any) => ({
                lessonId: lesson.lessonId,
                name: lesson.name,
                description: lesson.description,
                createdAt: lesson.createdAt,
                createdBy: lesson.createdBy || '',
                updatedAt: lesson.updatedAt || undefined,
                updatedBy: lesson.updatedBy || undefined,
                deletedAt: lesson.deletedAt || undefined,
                deletedBy: lesson.deletedBy || undefined,
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
        const response = await apiClient.delete(`/Lesson/DeleteLesson?lessonId=${lessonId}`);
        // return response.status === 200 && response.data.success;
        if (response.data.success) {
            return true;
        } else {
            return false;
        }
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
        const response = await apiClient.post('/Lesson/CreateLesson', lesson);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error creating lesson:', error);
        return false;
    }
};

export const updateLesson = async (lesson: ILessonForm): Promise<boolean> => {
    try {
        const response = await apiClient.put('/Lesson/UpdateLesson', lesson);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error updating lesson:', error);
        return false;
    }
};

export const getAllLessonByChapterId = async (chapterId: string): Promise<IViewListLesson[]> => {
    try {
        const response = await apiClient.get(`/Lesson/GetAllLessonByChapterId`, {
            params: {
                chapterId
            }
        });
        if (response.data.success) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching lesson list:', error);
        return [];
    }
};

interface CreateLesson {
    name: string;
    objectives: string;
    content: string;
    chapterId: string;
}

export const createLessonFunction = async (lesson: CreateLesson): Promise<boolean> => {
    try {
        const response = await apiClient.post('/Lesson/CreateLesson', lesson);
        if (response.data.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error creating lesson:', error);
        return false;
    }
}

export const getLessonById = async (lessonId: string): Promise<IViewListLesson> => {
    try {
        const response = await apiClient.get(`/Lesson/GetLessonById?lessonId=${lessonId}`);
        if (response.data.success) {
            return response.data.data;
        }
        return {} as IViewListLesson;
    } catch (error) {
        console.error('Error fetching lesson data:', error);
        return {} as IViewListLesson;
    }
}

interface UpdateLesson {
    lessonId: string;
    name: string;
    objectives: string;
    content: string;
    chapterId: string;
}

export const updateLessonFunction = async (lesson: UpdateLesson): Promise<boolean> => {
    try {
        const response = await apiClient.put('/Lesson/UpdateLesson', lesson);
        if (response.data.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error updating lesson:', error);
        return false;
    }
}