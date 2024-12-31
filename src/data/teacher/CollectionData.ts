import apiClient from '../apiClient';

export interface Collection {
    collectionId: string;
    collectionName: string;
    isSaved: boolean;
    teacherId: string;
    planbookCount: number;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    deletedAt: Date;
    deletedBy: string;
    isDeleted: boolean;
}

export const getCreatedPlanbookCollectionsByTeacherId = async (teacherId: string): Promise<Collection[]> => {
    try {
        const response = await apiClient.get(
            `PlanbookCollection/GetCreatedPlanbookCollectionsByTeacherId`,
            {
                params: {
                    teacherId,
                    pageIndex: -1,
                }
            },
        );
        if (response.data.success) {
            return response.data.data.items;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error calling DeletePlanbookTemplate API:', error);
        return [];
    }
};

export const getSavedPlanbookCollectionsByTeacherId = async (teacherId: string): Promise<Collection[]> => {
    try {
        const response = await apiClient.get(
            `PlanbookCollection/GetSavedPlanbookCollectionsByTeacherId`,
            {
                params: {
                    teacherId,
                    pageIndex: -1,
                }
            },
        );
        if (response.data.success) {
            return response.data.data.items;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error calling DeletePlanbookTemplate API:', error);
        return [];
    }
};

export const createPlanbookCollection = async (collectionName: string, isSaved: boolean, teacherId: string): Promise<boolean> => {
    try {
        const response = await apiClient.post(`PlanbookCollection/CreatePlanbookCollection`, {
            collectionName,
            isSaved,
            teacherId
        });
        if (response.data.success) {
            return true;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error calling CreatePlanbookCollection API:', error);
        return false;
    }
};

export const deletePlanbookCollection = async (collectionId: string, teacherId: string): Promise<boolean> => {
    try {
        const response = await apiClient.delete(`PlanbookCollection/DeletePlanbookCollection`, {
            params: {
                collectionId,
                teacherId
            }
        });
        if (response.data.success) {
            return true;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error calling DeletePlanbookCollection API:', error);
        return false;
    }
};

export const updatePlanbookCollection = async (collectionId: string, collectionName: string, teacherId: string): Promise<boolean> => {
    try {
        const response = await apiClient.put(`PlanbookCollection/UpdatePlanbookCollection`, {
            collectionId,
            collectionName,
            teacherId
        });
        if (response.data.success) {
            return true;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error calling EditPlanbookCollection API:', error);
        return false;
    }
};
