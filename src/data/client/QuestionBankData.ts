//QuestionBankData.ts
import apiClient from '@/data/apiClient';

export interface IViewListQuestionBank {
    id: string;
    question: string;
    type: string;
    plum: string;
    chapterId: string;
    chapterName: string;
    lessonId: string;
    lessonName: string;
    answers: IAnswer[];

    created_at: string;
    created_by: string;
}

export interface IViewDetailQuestionBank {
    id: string;
    question: string;
    type: string;
    plum: string;
    chapterId: string;
    chapterName: string;
    lessonId: string;
    lessonName: string;
    answers: IAnswer[];

    created_at: string;
    created_by: string;
}

export interface IAnswer {
    id: string;
    answerText: string;
    isCorrect: boolean;
}

export const getViewListQuestionBank = async (
    keyword: string = '',
    pageIndex: number = 0,
    pageSize: number = 30
): Promise<IViewListQuestionBank[]> => {
    try {
        const response = await apiClient.get('QuestionBank/GetAllQuestionBank', {
            params: {
                keyword,
                pageIndex,
                pageSize,
            },
            headers: {
                accept: '*/*',
            },
        });

        const questions = response.data.data.items.map((data: any) => ({
            id: data.questionId,
            question: data.question,
            type: data.type,
            plum: data.plum,
            chapterId: data.chapterId,
            chapterName: data.chapterName,
            lessonId: data.lessonId,
            lessonName: data.lessonName,
            answers: data.answers.map((answer: any) => ({
                id: answer.answerId,
                answerText: answer.answerText,
                isCorrect: answer.isCorrect,
            })),
            created_at: data.createdAt,
            created_by: data.createdBy || '',
        }));

        return questions;
    } catch (error) {
        console.error('Error fetching questions:', error);
        return [];
    }
};

export const getQuestionByChapterId = async (chapterId: string): Promise<IViewListQuestionBank[]> => {
    try {
        const response = await apiClient.get(`/QuestionBank/GetQuestionByChapterId?chapterId=${chapterId}&pageIndex=0&pageSize=50`);
        const questions = response.data.data.items
            .map((data: any) => ({
                id: data.questionId,
                question: data.question,
                type: data.type,
                plum: data.plum,
                chapterId: data.chapterId,
                chapterName: data.chapterName,
                lessonId: data.lessonId,
                lessonName: data.lessonName,
                answers: data.answers.map((answer: any) => ({
                    id: answer.answerId,
                    answerText: answer.answerText,
                    isCorrect: answer.isCorrect === 'True', // Chuyển đổi từ chuỗi 'True'/'False' thành boolean true/false
                })),
                created_at: data.createdAt,
                created_by: data.createdBy || '',
            }));

        return questions;
    } catch (error) {
        console.error('Error fetching questions:', error);
        return [];
    }
};

export const getQuestionByLessonId = async (lessonId: string): Promise<IViewListQuestionBank[]> => {
    try {
        console.log("Calling API with lessonId:", lessonId);
        const response = await apiClient.get(`/QuestionBank/GetQuestionByLessonId`, {
            params: {
                lessonId,
                pageIndex: 0,
                pageSize: 50, // Theo yêu cầu API
            },
        });
        
        const questions = response.data.data.items.map((data: any) => {
            // Kiểm tra giá trị của answer.isCorrect
            console.log('Checking answers for question:', data.question);
            const answers = data.answers.map((answer: any) => {
                return {
                    id: answer.answerId,
                    answerText: answer.answerText,
                    isCorrect: answer.isCorrect === 'True', // Chuyển đổi từ chuỗi 'True'/'False' thành boolean true/false
                };
            });

            return {
                id: data.questionId,
                question: data.question,
                type: data.type,
                plum: data.plum,
                chapterId: data.chapterId,
                chapterName: data.chapterName,
                lessonId: data.lessonId,
                lessonName: data.lessonName,
                answers,
                created_at: data.createdAt,
                created_by: data.createdBy || '',
            };
        });

        return questions;
    } catch (error: any) {
        console.error('Error fetching questions:', error.response?.data || error.message);
        return [];
    }
};

export const getViewDetailQuestionBank = async (questionId: string): Promise<IViewDetailQuestionBank> => {
    try {
        const response = await apiClient.get(`QuestionBank/GetQuestionBankById?id=${questionId}`);
        const data = response.data.data;

        const answers = data.answers.map((answer: any) => ({
            id: answer.answerId,
            answerText: answer.answerText,
            isCorrect: answer.isCorrect,
        }));

        return {
            id: data.questionId,
            question: data.question,
            type: data.type,
            plum: data.plum,
            chapterId: data.chapterId,
            chapterName: data.chapterName,
            lessonId: data.lessonId,
            lessonName: data.lessonName,
            answers,
            created_at: data.createdAt,
            created_by: data.createdBy || '',
        };
    } catch (error) {
        console.error('Error fetching question detail:', error);
        return {} as IViewDetailQuestionBank;
    }
};