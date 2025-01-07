// UserData.ts
import apiClient from '@/data/apiClient';

export interface IAccount {
    userId: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    googleEmail: string;
    facebookEmail: string;
    gender: 'Male' | 'Female' | 'Unknown';
    teach: string;
    status: boolean;
    lastLogin: string;
    avatar: string;
    role: string;
    address: string;
    schoolName: string;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    deletedAt: Date;
    deletedBy: string;
}

interface IApiResponse {
    success: boolean;
    message: string;
    data: {
        totalItemsCount: number;
        pageSize: number;
        totalPagesCount: number;
        pageIndex: number;
        next: boolean;
        previous: boolean;
        items: IAccount[];
    };
}

export const getAllUsers = async (
    pageIndex: number,
    pageSize: number
): Promise<IApiResponse | null> => {
    try {
        const response = await apiClient.get<IApiResponse>(
            'https://elepla-be-production.up.railway.app/api/Account/GetAllUsersForAdmin',
            {
                params: {
                    pageIndex,
                    pageSize
                }
            }
        );

        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error fetching users:', error);

        return null;
    }
};

export const getUsersSortedByCreationDate = async (
    // pageIndex: number,
    // pageSize: number
): Promise<IAccount[] | null> => {
    const response = await getAllUsers(0, 999);
    if (response && response.success) {
        return response.data.items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return null;
};

export const countUsers = async (): Promise<number> => {
    const response = await getAllUsers(1, 1);
    if (response && response.data && response.data.totalItemsCount) {
        return response.data.totalItemsCount;
    }
    return 0;
};

export const categorizeUsersByRole = async (): Promise<{ [role: string]: IAccount[] } | null> => {
    const response = await getAllUsers(0, 1000);
    if (response && response.success) {
        return response.data.items.reduce((acc, user) => {
            if (!acc[user.role]) {
                acc[user.role] = [];
            }
            acc[user.role].push(user);
            return acc;
        }, {} as { [role: string]: IAccount[] });
    }
    return null;
};

export const getUsersLastLogin = async (
    // pageIndex: number,
    // pageSize: number
): Promise<IAccount[] | null> => {
    const response = await getAllUsers(0, 999);
    if (response && response.success) {
        return response.data.items.sort((a, b) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime());
    }
    return null;
};

export interface ListUserToPlanbookShare {
    userId: string;
    fullName: string;
    username: string;
    email: string;
    googleEmail: string;
    facebookEmail: string;
    avatar: string;
}

export interface ListUserPlanbookShare extends ListUserToPlanbookShare {
    isEdited: boolean;
    isOwner: boolean;
}

export const getUserShareByPlanbook = async (planbookId: string): Promise<ListUserPlanbookShare[]> => {
    try {
        const response = await apiClient.get(`Planbook/GetUserSharedByPlanbook`, {
            params: {
                planbookId
            }
        });
        if (response.data.success) {
            return response.data.data;
        } else {
            return [];
        }
    } catch (error) {
        console.log("Error calling GetUserSharedByPlanbook API:", error);
        return [];
    }
}

export const getUserToSharedPlanbook = async (planbookId: string): Promise<ListUserToPlanbookShare[]> => {
    try {
        const response = await apiClient.get(`Planbook/GetUserToSharedPlanbook`, {
            params: {
                planbookId
            }
        });
        if (response.data.success) {
            return response.data.data;
        } else {
            return [];
        }
    } catch (error) {
        console.log("Error calling GetUserToSharePlanbook API:", error);
        return [];
    }
}

export const linkGoogleAccount = async (currentUserId: string, googleToken: string): Promise<boolean> => {
    try {
        console.log("Link Google Account:", currentUserId, googleToken);

        const response = await apiClient.put(`Account/LinkGoogleAccount?currentUserId=${currentUserId}`, {
                googleToken,
                isCredential: false
        });
        
        if (response.data.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Link Google Account Error:", error);
        return false;
    }
};

export const getUserProfile = async (userId: string): Promise<IAccount | null> => {
    try {
        const response = await apiClient.get(`Account/GetUserProfile`, {
            params: {
                userId
            }
        });

        if (response.data.success) {
            return response.data.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}
