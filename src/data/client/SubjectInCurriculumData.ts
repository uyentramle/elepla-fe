//SubjectInCurriculumData.ts
import apiClient from '@/data/apiClient';

export interface IViewListSubjectInCurriculum {
    id: string;
    name: string;
    subject: string;
    grade: string;
    curriculum: string;
    description: string;
    chapters: string[];
}

export const fetchSubjectInCurriculumList = async (): Promise<IViewListSubjectInCurriculum[]> => {
    try {
        const response = await apiClient.get('/SubjectInCurriculum/GetAllSubjectInCurriculum?pageIndex=0&pageSize=50');
        if (response.data.success) {
            return response.data.data.items.map((subject: any) => ({
                id: subject.subjectInCurriculumId,
                name: subject.name,
                subject: subject.subject,
                grade: subject.grade,
                curriculum: subject.curriculum,
                description: subject.description,
                chapters: subject.chapters,
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching subjects in curriculum list:', error);
        return [];
    }
};

export const fetchSubjectInCurriculumById = async (id: string): Promise<IViewListSubjectInCurriculum | null> => {
    try {
        const response = await apiClient.get(`/SubjectInCurriculum/GetSubjectInCurriculumById?subjectInCurriculumId=${id}`);
        if (response.data.success) {
            const subject = response.data.data;
            return {
                id: subject.subjectInCurriculumId,
                name: subject.name,
                subject: subject.subject,
                grade: subject.grade,
                curriculum: subject.curriculum,
                description: subject.description,
                chapters: subject.chapters,
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching subject in curriculum by ID:', error);
        return null;
    }
};
