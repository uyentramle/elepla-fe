import apiClient from '@/data/apiClient';
// import apiclient from 'apiclient';

export interface IViewListSubjectInCurriculum {
    subjectInCurriculumId: string;
    name: string;
    subject: string;
    grade: string;
    curriculum: string;
    description: string;
    chapters: string[];

    created_at: string;
    created_by: string;
    updated_at: string | undefined;
    updated_by: string | undefined;
    deleted_at: string | undefined;
    deleted_by: string | undefined;
    isDelete: boolean;
}

export const fetchSubjectInCurriculumList = async (): Promise<IViewListSubjectInCurriculum[]> => {
    try {
        const response = await apiClient.get('/SubjectInCurriculum/GetAllSubjectInCurriculum?pageIndex=0&pageSize=50');
        if (response.data.success) {
            return response.data.data.items.map((subject: any) => ({
                id: subject.subjectId,
                name: subject.name,
                subject: subject.subjectName,
                grade: subject.gradeName,
                curriculum: subject.curriculumName,
                description: subject.description,
                chapters: subject.chapters,
                created_at: subject.createdAt,
                created_by: subject.createdBy || '',
                updated_at: subject.updatedAt || undefined,
                updated_by: subject.updatedBy || undefined,
                deleted_at: subject.deletedAt || undefined,
                deleted_by: subject.deletedBy || undefined,
                isDelete: subject.isDelete,
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching subjects in curriculum list:', error);
        return [];
    }
};

export const deleteSubjectInCurriculum = async (subjectId: string): Promise<boolean> => {
    try {
        const response = await apiClient.delete(`/SubjectInCurriculum/DeleteSubjectInCurriculum?subjectInCurriculumId=${subjectId}`);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error deleting subject in curriculum:', error);
        return false;        
    }
};

export interface ISubjectInCurriculumForm {
    id: string | undefined;
    name: string;
    description: string | undefined;
}

export const createSubjectInCurriculum = async (subject: ISubjectInCurriculumForm): Promise<boolean> => {
    try {
        const response = await apiClient.post('/SubjectInCurriculum/CreateSubjectInCurriculum', subject);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error creating subject in curriculum:', error);
        return false;
    }
};

export const updateSubjectInCurriculum = async (subject: ISubjectInCurriculumForm): Promise<boolean> => {
    try {
        const response = await apiClient.put('/SubjectInCurriculum/UpdateSubjectInCurriculum', subject);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error updating subject in curriculum:', error);
        return false;
    }
};

export const getAllSubjectInCurriculumByCurriculumAndGrade = async (curriculum: string, grade: string): Promise<IViewListSubjectInCurriculum[]> => {
    try {
        const response = await apiClient.get('/SubjectInCurriculum/GetAllSubjectInCurriculumByCurriculumAndGrade', {
            params: {
                curriculum,
                grade
            }
        });
        if (response.data.success) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching subjects in curriculum list:', error);
        return [];
    }
}