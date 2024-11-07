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
