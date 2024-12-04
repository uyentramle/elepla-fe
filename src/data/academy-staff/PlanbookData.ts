import apiClient from "../apiClient";

interface ApiResponse {
    success: boolean;
    message: string;
    data: {
      totalItemsCount: number;
      pageSize: number;
      totalPagesCount: number;
      pageIndex: number;
      next: boolean;
      previous: boolean;
      items: PlanbookTemplate[];
    };
  }

export interface PlanbookTemplate {
    planbookId: string;
    title: string;
    subject: string;
    grade: string;
    curriculum: string;
    chapter: string;
    lesson: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedAt: string;
    deletedBy: string;
    isDeleted: boolean;
}

export interface PlanbookTemplateDetail {
    planbookId: string;
    title: string;
    schoolName: string;
    teacherName: string;
    subject: string;
    className: string;
    durationInPeriods: number;
    knowledgeObjective: string;
    skillsObjective: string;
    qualitiesObjective: string;
    teachingTools: string;
    notes: string;
    isDefault: boolean;
    isPublic: boolean;
    collectionId: string;
    collectionName: string;
    lessonId: string;
    lessonName: string;
    activities: Activity[];
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedAt: string;
    deletedBy: string;
    isDeleted: boolean;
}

interface Activity {
    activityId: string;
    title: string;
    objective: string;
    content: string;
    product: string;
    implementation: string;
    index: number;
    planbookId: string;
}

export const getAllPlanbookTemplates = async (pageIndex: number, pageSize: number): Promise<ApiResponse> => {
    try {
        const response = await apiClient.get(`Planbook/GetAllPlanbookTemplates`, {
            params: {
                pageIndex,
                pageSize
            }
        });
        if (response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error calling PlanbookTemplate API:', error);
        return {
            success: false,
            message: 'Error calling PlanbookTemplate API',
            data: {
                totalItemsCount: 0,
                pageSize: 0,
                totalPagesCount: 0,
                pageIndex: 0,
                next: false,
                previous: false,
                items: []
            }
        };
    }
}

export const getPlanbookById = async (planbookId: string): Promise<PlanbookTemplateDetail> => {
    try {
        const response = await apiClient.get(`Planbook/GetPlanbookById`, {
            params: {
                planbookId
            }
        });
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error calling PlanbookDetail API:', error);
        throw new Error('Error calling PlanbookDetail API');
    }
}

export interface UpdatePlanbookTemplate {
    planbookId: string;
    title: string;
    schoolName: string;
    teacherName: string;
    subject: string;
    className: string;
    durationInPeriods: number;
    knowledgeObjective: string;
    skillsObjective: string;
    qualitiesObjective: string;
    teachingTools: string;
    notes: string;
    isPublic: boolean;
    activities: Activity[];
}

export const mapPlanbookDetailToUpdateTemplate = (
    detail: PlanbookTemplateDetail
): UpdatePlanbookTemplate => {
    return {
        planbookId: detail.planbookId,
        title: detail.title,
        schoolName: detail.schoolName,
        teacherName: detail.teacherName,
        subject: detail.subject,
        className: detail.className,
        durationInPeriods: detail.durationInPeriods,
        knowledgeObjective: detail.knowledgeObjective,
        skillsObjective: detail.skillsObjective,
        qualitiesObjective: detail.qualitiesObjective,
        teachingTools: detail.teachingTools,
        notes: detail.notes,
        isPublic: detail.isPublic, 
        activities: detail.activities || [],
    };
};

export const updatePlanbookTemplate = async (planbook: UpdatePlanbookTemplate): Promise<boolean> => {
    try {
        const response = await apiClient.put(`Planbook/UpdatePlanbook`, planbook);
        if (response.data.success) {
            return true;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error calling UpdatePlanbookTemplate API:', error);
        return false;
    }
}

export interface CreatePlanbookTemplate {
    title: string;
    schoolName: string;
    teacherName: string;
    subject: string;
    className: string;
    durationInPeriods: number;
    knowledgeObjective: string;
    skillsObjective: string;
    qualitiesObjective: string;
    teachingTools: string;
    notes: string;
    isDefault: boolean;
    isPublic: boolean;
    collectionId: string;
    lessonId: string;
    activities: Activity[];
}

export const createPlanbookTemplate = async (planbook: CreatePlanbookTemplate): Promise<boolean> => {
    try {
        const response = await apiClient.post(`Planbook/CreatePlanbook`, planbook);
        if (response.data.success) {
            return true;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error calling CreatePlanbookTemplate API:', error);
        return false;
    }
}

export const deletePlanbookTemplate = async (planbookId: string): Promise<boolean> => {
    try {
        const response = await apiClient.delete(`Planbook/DeletePlanbook`, {
            params: {
                planbookId
            }
        });
        if (response.data.success) {
            return true;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error calling DeletePlanbookTemplate API:', error);
        return false;
    }
}

export interface Planbook {
    planbookId: string;
    title: string;
    schoolName: string;
    teacherName: string;
    subject: string;
    className: string;
    isPublic: boolean;
    collectionId: string;
    collectionName: string;
    lessonId: string;
    lessonName: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedAt: string;
    deletedBy: string;
    isDeleted: boolean;
}

export const getPlanbookByCollectionId = async (collectionId: string): Promise<Planbook[]> => {
    try {
        const response = await apiClient.get(`Planbook/GetPlanbookByCollectionId`, {
            params: {
                collectionId
            }
        });
        if (response.data.success) {
            return response.data.data.items;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error calling GetPlanbookByCollectionId API:', error);
        return [];
    }
}

export const createPlanbookFromTemplate = async (lessonId: string): Promise<CreatePlanbookTemplate | null> => {
    try {
        const response = await apiClient.post(`Planbook/CreatePlanbookFromTemplate?lessonId=${lessonId}`);
        if (response.data.success) {
            return response.data.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error calling CreatePlanbookFromTemplate API:', error);
        return null;
    }
}

export const createPlanbookUsingAI = async (lessonId: string): Promise<CreatePlanbookTemplate | null> => {
    try {
        const response = await apiClient.post(`Planbook/CreatePlanbookUsingAI?lessonId=${lessonId}`);
        if (response.data.success) {
            return response.data.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error calling CreatePlanbookUsingAI API:', error);
        return null;
    }
}