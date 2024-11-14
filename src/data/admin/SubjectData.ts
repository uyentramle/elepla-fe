import apiClient from '@/data/apiClient';
// import axios from 'axios';

export interface IViewListSubject {
    subjectId: string;
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

export const fetchSubjectList = async (): Promise<IViewListSubject[]> => {
    try {
        const response = await apiClient.get('Subject/GetAllSubject?pageIndex=0&pageSize=30');
        if (response.data.success) {
            return response.data.data.items.map((subject: any) => ({
                subjectId: subject.subjectId,
                name: subject.name,
                description: subject.description,
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
        console.error('Error fetching subject list:', error);
        return [];
    }
};

export const deleteSubject = async (subjectId: string): Promise<boolean> => {
    try {
        const response = await apiClient.delete(`Subject/DeleteSubject?subjectId=${subjectId}`);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error deleting subject:', error);
        return false;        
    }
};

export interface ISubjectForm {
    subjectId: string | undefined;
    name: string;
    description: string | undefined;
}

export const createSubject = async (subject: ISubjectForm): Promise<boolean> => {
    try {
        const response = await apiClient.post('Subject/CreateSubject', subject);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error creating subject:', error);
        return false;
    }
};

export const updateSubject = async (subject: ISubjectForm): Promise<boolean> => {
    try {
        const response = await apiClient.put('Subject/UpdateSubject', subject);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error updating subject:', error);
        return false;
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export interface ISubject {
    id: string;
    name: string;
    description: string | undefined;
    is_approved: boolean;
}

const SubjectData: ISubject[] = [
    {
        id: '1',
        name: 'Toán',
        description: 'Môn học về toán học',
        is_approved: true
    },
    {
        id: '2',
        name: 'Văn',
        description: '',
        is_approved: true
    },
    
];

export default SubjectData;