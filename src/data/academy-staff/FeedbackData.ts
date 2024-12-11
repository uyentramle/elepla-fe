import apiClient from '@/data/apiClient';
// import apiclient from 'apiclient';

export interface IViewListFeedback {
    id: string;
    content: string | undefined;
    rate: number;
    type: string;
    isFlagged: boolean;
    username: string;
    planbookName: string | undefined;
    created_at: string;
}

export const fetchPlanBookFeedbackList = async (): Promise<IViewListFeedback[]> => {
    try {
        const response = await apiClient.get('/Feedback/GetPlanbookFeedback?pageIndex=0&pageSize=100');
        if (response.data.success) {
            return response.data.data.items.map((feedback: any) => ({
                id: feedback.feedbackId,
                content: feedback.content,
                rate: feedback.rate,
                type: feedback.type,
                isFlagged: feedback.isFlagged,
                username: feedback.teacherName,
                planbookName: feedback.planbookName,
                created_at: feedback.createdAt,
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching feedback list:', error);
        return [];
    }
};

export const fetchSystemFeedbackList = async (): Promise<IViewListFeedback[]> => {
    try {
        const response = await apiClient.get('/Feedback/GetSystemFeedback?pageIndex=0&pageSize=10');
        if (response.data.success) {
            return response.data.data.items.map((feedback: any) => ({
                id: feedback.feedbackId,
                content: feedback.content,
                rate: feedback.rate,
                type: feedback.type,
                isFlagged: feedback.isFlagged,
                username: feedback.teacherName,
                planbookName: feedback.planbookName,
                created_at: feedback.createdAt,
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching feedback list:', error);
        return [];
    }
};

export const countPlanBookFeedback = async (): Promise<number> => {
    try {
        const feedbackList = await fetchPlanBookFeedbackList();
        return feedbackList.length;
    } catch (error) {
        console.error('Error counting planbook feedback:', error);
        return 0;
    }
};

export const deleteFeedback = async (feedbackId: string): Promise<boolean> => {
    try {
        const response = await apiClient.delete(`/Feedback/HardDeleteFeedback?feedbackId=${feedbackId}`);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Error deleting feedback:', error);
        return false;
    }
};

export interface Feedback {
    feedbackId: string;
    content: string;
    rate: number;
    type: string;
    isFlagged: boolean;
    teacherId: string;
    teacherName: string;
    avatar: string;
    planbookId: string;
    createdAt: string;
    updatedAt: string;
}

export const getFeedbackByPlanbookId = async (planbookId: string): Promise<Feedback[]> => {
    try {
        const response = await apiClient.get(`/Feedback/GetFeedbackByPlanbookId`, {
            params: {
                planbookId,
                pageIndex: -1,
            },
        });
        if (response.data.success) {
            return response.data.data.items;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching feedback list:', error);
        return [];
    }
}

export interface CreateFeedback {
    content: string;
    rate: number;
    type: string;
    teacherId: string;
    planbookId: string;
}

export const submitFeedback = async (data: CreateFeedback): Promise<boolean> => {
    try {
        const response = await apiClient.post('/Feedback/SubmitFeedback', data);
        if (response.data.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return false;
    }
}

export const hardDeleteFeedback = async (feedbackId: string): Promise<boolean> => {
    try {
        const response = await apiClient.delete(`/Feedback/HardDeleteFeedback`, {
            params: {
                feedbackId,
            }
        });
        if (response.data.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error deleting feedback:', error);
        return false;
    }
}

export interface UpdateFeedback {
    feedbackId: string;
    content: string;
    rate: number;
    teacherId: string;
    planbookId: string;
    type: string;
}

export const updateFeedback = async (data: UpdateFeedback): Promise<boolean> => {
    try {
        const response = await apiClient.put('/Feedback/UpdateFeedback', data);
        if (response.data.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error updating feedback:', error);
        return false;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export interface IFeedbackData {
    id: string;
    content: string;
    rate: number;
    type: string;
    isFlagged: boolean;
    userId: string;
    username: string;
    planbookId: string | null;
    planbookName: string | null;
    createdAt: string;
}

const feedbackData: IFeedbackData[] = [
    {
        id: '1',
        content: 'Nội dung phản hồi 1',
        rate: 4,
        type: 'planbook',
        isFlagged: false,
        userId: '1',
        username: 'user1',
        planbookId: '1',
        planbookName: 'Kế hoạch giảng dạy 1',
        createdAt: '2021-08-01',
    },
    {
        id: '2',
        content: 'Nội dung phản hồi 2',
        rate: 3,
        type: 'planbook',
        isFlagged: false,
        userId: '2',
        username: 'user2',
        planbookId: '2',
        planbookName: 'Kế hoạch giảng dạy 2',
        createdAt: '2021-08-02',
    },
    {
        id: '3',
        content: 'Nội dung phản hồi 3',
        rate: 5,
        type: 'system',
        isFlagged: false,
        userId: '3',
        username: 'user3',
        planbookId: null,
        planbookName: null,
        createdAt: '2021-08-03',
    },
];

export default feedbackData;
