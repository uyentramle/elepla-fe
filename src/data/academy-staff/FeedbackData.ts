import apiClient from '@/data/apiClient';
// import apiclient from 'apiclient';

export interface IViewListFeedback {
    id: string;
    content: string | undefined;
    rate: number;
    type: string;
    isFlagged: boolean;
    flagCount: number;
    teacherId: string;
    username: string;
    avatar: string;
    planbookName: string | undefined;
    createdAt: string;
}



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
                flagCount: feedback.flagCount,
                teacherId: feedback.teacherId,
                username: feedback.teacherName,
                avatar: feedback.avatar,
                planbookName: feedback.planbookTitle,
                createdAt: feedback.createdAt,
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching feedback list:', error);
        return [];
    }
};

export const classifyFeedbackByRate = (feedbackList: IViewListFeedback[]) => {
    const result = {
        greaterThanThree: 0,
        equalToThree: 0,
        lessThanThree: 0,
    };

    feedbackList.forEach((feedback) => {
        if (feedback.rate > 3) {
            result.greaterThanThree += 1;
        } else if (feedback.rate === 3) {
            result.equalToThree += 1;
        } else {
            result.lessThanThree += 1;
        }
    });

    return result;
};

// Sử dụng hàm này:
(async () => {
    const feedbackList = await fetchSystemFeedbackList();
    const classifiedFeedback = classifyFeedbackByRate(feedbackList);

    console.log('Feedback classification:', classifiedFeedback);
})();


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
                flagCount: feedback.flagCount,
                teacherId: feedback.teacherId,
                username: feedback.teacherName,
                avatar: feedback.avatar,
                planbookName: feedback.planbookTitle,
                createdAt: feedback.createdAt,
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching feedback list:', error);
        return [];
    }
};

export const getTotalRate = async (): Promise<number> => {
    try {
        const feedbackList = await fetchPlanBookFeedbackList();
        const totalRate = feedbackList.reduce((sum, feedback) => sum + feedback.rate, 0);
        return totalRate;
    } catch (error) {
        console.error('Error calculating total rate:', error);
        return 0;
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


export const countFeedbackByRate = async (rate: number): Promise<number> => {
    try {
        // Fetch the list of planbook feedback
        const feedbackList = await fetchPlanBookFeedbackList();

        // Filter the feedback items by the specified rate
        const filteredFeedback = feedbackList.filter(feedback => feedback.rate === rate);

        // Return the count of filtered feedback items
        return filteredFeedback.length;
    } catch (error) {
        console.error(`Error counting feedback with rate ${rate}:`, error);
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
