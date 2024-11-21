//ChapterData.ts
import apiClient from '@/data/apiClient';

export interface IViewListChapter {
    id: string;
    name: string;
    description: string | undefined;
    lessons: string[];
    subjectInCurriculum: string;
}

export const fetchChapterList = async (): Promise<IViewListChapter[]> => {
    try {
        const response = await apiClient.get('/Chapter/GetAllChapter?pageIndex=0&pageSize=50');
        if (response.data?.success && Array.isArray(response.data?.data)) {
            return response.data.data.map((chapter: any) => ({
                id: chapter.chapterId,
                name: chapter.name,
                description: chapter.description,
                lessons: chapter.lessons || [],
                subjectInCurriculum: chapter.subjectInCurriculum || '',
            }));
        }
        console.warn('API response does not contain expected structure or data is not an array.');
        return [];
    } catch (error) {
        console.error('Error fetching chapter list:', error);
        return [];
    }
};

export const fetchChaptersBySubjectInCurriculumId = async (subjectInCurriculumId: string): Promise<IViewListChapter[]> => {
    try {
        const response = await apiClient.get(`/Chapter/GetAllChapterBySubjectInCurriculumId?subjectInCurriculumId=${subjectInCurriculumId}`);
        if (response.data?.success && Array.isArray(response.data?.data)) {
            return response.data.data.map((chapter: any) => ({
                id: chapter.chapterId,
                name: chapter.name,
                description: chapter.description,
                lessons: chapter.lessons || [],
                subjectInCurriculum: chapter.subjectInCurriculum || '',
            }));
        }
        console.warn('API response does not contain expected structure or data is not an array.');
        return [];
    } catch (error) {
        console.error('Error fetching chapters by subject in curriculum:', error);
        return [];
    }
};
