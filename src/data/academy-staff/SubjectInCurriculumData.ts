import axios from 'axios';

export interface IViewListSubjectInCurriculum {
    id: string;
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
        const response = await axios.get('https://elepla-be-production.up.railway.app/api/SubjectInCurriculum/GetAllSubjectInCurriculum?pageIndex=0&pageSize=50');
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
        const response = await axios.delete(`https://elepla-be-production.up.railway.app/api/SubjectInCurriculum/DeleteSubjectInCurriculum?subjectInCurriculumId=${subjectId}`);
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
        const response = await axios.post('https://elepla-be-production.up.railway.app/api/SubjectInCurriculum/CreateSubjectInCurriculum', subject);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error creating subject in curriculum:', error);
        return false;
    }
};

export const updateSubjectInCurriculum = async (subject: ISubjectInCurriculumForm): Promise<boolean> => {
    try {
        const response = await axios.put('https://elepla-be-production.up.railway.app/api/SubjectInCurriculum/UpdateSubjectInCurriculum', subject);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error updating subject in curriculum:', error);
        return false;
    }
};
