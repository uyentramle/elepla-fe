import apiClient from '@/data/apiClient';
// import apiclient from 'apiclient';

export interface IViewListSubjectInCurriculum {
    subjectInCurriculumId: string;
    name: string;
    subjectId: string;
    subject: string;
    gradeId: string;
    grade: string;
    curriculumId: string;
    curriculum: string;
    description: string;
    chapters: string[];

    createdAt: string;
    createdBy: string;
    updatedAt: string | undefined;
    updatedBy: string | undefined;
    deletedAt: string | undefined;
    deletedBy: string | undefined;
    isDelete: boolean;
}

export const fetchSubjectInCurriculumList = async (): Promise<IViewListSubjectInCurriculum[]> => {
    try {
        const response = await apiClient.get('/SubjectInCurriculum/GetAllSubjectInCurriculum', {
            params: {
                pageIndex: -1,
            },
        });
        if (response.data.success) {
            return response.data.data.items.map((subject: any) => ({
                subjectInCurriculumId: subject.subjectInCurriculumId,
                name: subject.name,
                subjectId: subject.subjectId,
                subject: subject.subject,
                gradeId: subject.gradeId,
                grade: subject.grade,
                curriculumId: subject.curriculumId,
                curriculum: subject.curriculum,
                description: subject.description,
                chapters: subject.chapters,
                createdAt: subject.createdAt,
                createdBy: subject.createdBy || '',
                updatedAt: subject.updatedAt || undefined,
                updatedBy: subject.updatedBy || undefined,
                deletedAt: subject.deletedAt || undefined,
                deletedBy: subject.deletedBy || undefined,
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

interface CreateSubjectInCurriculum {
    subjectId: string;
    curriculumId: string;
    gradeId: string;
    description: string;
}

export const createSubjectInCurriculumFunction = async (subject: CreateSubjectInCurriculum): Promise<boolean> => {
    try {
        const response = await apiClient.post('/SubjectInCurriculum/CreateSubjectInCurriculum', subject);
        if (response.data.success) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error creating subject in curriculum:', error);
        return false;
    }
};

interface UpdateSubjectInCurriculum {
    subjectInCurriculumId: string;
    subjectId: string;
    curriculumId: string;
    gradeId: string;
    description: string;
}

export const updateSubjectInCurriculumFunction = async (subject: UpdateSubjectInCurriculum): Promise<boolean> => {
    try {
        const response = await apiClient.put('/SubjectInCurriculum/UpdateSubjectInCurriculum', subject);
        if (response.data.success) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error updating subject in curriculum:', error);
        return false;
    }
}

export const getSubjectInCurriculumById = async (subjectInCurriculumId: string): Promise<IViewListSubjectInCurriculum> => {
    try {
        const response = await apiClient.get('/SubjectInCurriculum/GetSubjectInCurriculumById', {
            params: {
                subjectInCurriculumId
            }
        });
        if (response.data.success) {
            return response.data.data;
        }
        return {} as IViewListSubjectInCurriculum;
    } catch (error) {
        console.error('Error fetching subject in curriculum:', error);
        return {} as IViewListSubjectInCurriculum;
    }
}