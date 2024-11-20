//LessonData.ts
import apiClient from '@/data/apiClient';

export interface IViewListLesson {
    id: string;
    name: string;
    chapterName: string;
}

export const fetchLessonList = async (): Promise<IViewListLesson[]> => {
    try {
        const response = await apiClient.get('/Lesson/GetAllLesson?pageIndex=0&pageSize=50');
        if (response.data?.success && Array.isArray(response.data?.data)) {
            return response.data.data.map((lesson: any) => ({
                id: lesson.lessonId,
                name: lesson.name,
                chapterName: lesson.chapterName || '',
            }));
        }
        console.warn('API response does not contain expected structure or data is not an array.');
        return [];
    } catch (error) {
        console.error('Error fetching lesson list:', error);
        return [];
    }
};

export const fetchLessonsByChapterId = async (chapterId: string): Promise<IViewListLesson[]> => {
    try {
        const response = await apiClient.get(`/Lesson/GetAllLessonByChapterId?chapterId=${chapterId}`);
        if (response.data?.success && Array.isArray(response.data?.data)) {
            return response.data.data.map((lesson: any) => ({
                id: lesson.lessonId,
                name: lesson.name,
                chapterName: lesson.chapterName || '',
            }));
        }
        console.warn('API response does not contain expected structure or data is not an array.');
        return [];
    } catch (error) {
        console.error('Error fetching lessons by chapter ID:', error);
        return [];
    }
};
