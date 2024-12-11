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
    commentCount: number;
    averageRate: number;
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
            return {
                planbookId: '',
                title: '',
                schoolName: '',
                teacherName: '',
                subject: '',
                className: '',
                durationInPeriods: 0,
                knowledgeObjective: '',
                skillsObjective: '',
                qualitiesObjective: '',
                teachingTools: '',
                notes: '',
                isDefault: false,
                isPublic: false,
                collectionId: '',
                collectionName: '',
                lessonId: '',
                lessonName: '',
                commentCount: 0,
                averageRate: 0,
                activities: [],
                createdAt: '',
                createdBy: '',
                updatedAt: '',
                updatedBy: '',
                deletedAt: '',
                deletedBy: '',
                isDeleted: false,
            }
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
    curriculum: string;
    grade: string;
    className: string;
    isPublic: boolean;
    collectionId: string;
    collectionName: string;
    lessonId: string;
    lessonName: string;
    chapterName: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedAt: string;
    deletedBy: string;
    isDeleted: boolean;
}

export const getAllPlanbooks = async (): Promise<Planbook[]> => {
    try {
        const response = await apiClient.get(`Planbook/GetAllPlanbooks`, {
            params: {
                pageIndex: -1,
            }
        });
        if (response.data.success) {
            return response.data.data.items;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error calling GetAllPlanbooks API:', error);
        return [];
    }
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

export const savePlanbook = async (collectionId: string, planbookId: string): Promise<boolean> => {
    try {
        const response = await apiClient.post(`Planbook/SavePlanbook`, {
            collectionId,
            planbookId
        });
        if (response.data.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error calling SavePlanbook API:', error);
        return false;
    }
}

export const unsavePlanbook = async  (collectionId: string, planbookId: string): Promise<boolean> => {
    try {
        const response = await apiClient.post(`Planbook/UnsavePlanbook`, {
            collectionId,
            planbookId
        });
        if (response.data.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error calling UnsavePlanbook API:', error);
        return false;
    }
}

export const clonePlanbook = async (planbookId: string, collectionId: string): Promise<boolean> => {
    try {
        const response = await apiClient.post(`Planbook/ClonePlanbook`, {
            planbookId,
            collectionId
        });
        if (response.data.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error calling ClonePlanbook API:', error);
        return false;
    }
}

export const exportPlanbookToWord = async (planbookId: string): Promise<void> => {
    await exportPlanbook('Planbook/ExportPlanbookToWord', planbookId, 'docx');
};

export const exportPlanbookToPdf = async (planbookId: string): Promise<void> => {
    await exportPlanbook('Planbook/ExportPlanbookToPdf', planbookId, 'pdf');
};

const exportPlanbook = async (url: string, planbookId: string, fileExtension: string): Promise<void> => {
    try {
        const response = await apiClient.get(url, {
            params: { planbookId },
            responseType: 'blob', // Đảm bảo rằng response sẽ trả về dạng Blob
        });

        if (response.status === 200) {
            const fileBlob = response.data; // Trả về Blob của file

            // Tạo URL tạm thời cho file Blob
            const link = document.createElement("a");
            link.href = URL.createObjectURL(fileBlob);
            link.download = `${planbookId}_Planbook.${fileExtension}`; // Đặt tên file với phần mở rộng
            document.body.appendChild(link);
            link.click(); // Mô phỏng click để tải file
            document.body.removeChild(link); // Xóa liên kết sau khi tải xong
        } else {
            console.error(`Failed to export planbook to ${fileExtension.toUpperCase()}:`, response.statusText);
        }
    } catch (error) {
        console.error(`Error calling ExportPlanbookTo${fileExtension.toUpperCase()} API:`, error);
    }
};


export const countPlanbooks = async (): Promise<number> => {
    try {
        const planbooks = await getAllPlanbooks();
        return planbooks.length;
    } catch (error) {
        console.error('Error counting planbooks:', error);
        return 0;
    }
};