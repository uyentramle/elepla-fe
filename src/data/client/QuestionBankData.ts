//QuestionBankData.ts
import apiClient from '@/data/apiClient';

export interface IViewListQuestionBank {
    id: string;
    question: string;
    type: string;
    plum: string;
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
    answer: string;
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
            answers: data.answers.map((answer: any) => ({
                id: answer.answerId,
                answer: answer.answer,
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
        const response = await apiClient.get(`QuestionBank/GetQuestionByChapterIdAsync?chapterId=${chapterId}`);
        const questions = response.data.data.items
            .map((data: any) => ({
                id: data.questionId,
                question: data.question,
                type: data.type,
                plum: data.plum,
                answers: data.answers.map((answer: any) => ({
                    id: answer.answerId,
                    answer: answer.answer,
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

export const getQuestionByLessonId = async (lessonId: string): Promise<IViewListQuestionBank[]> => {
    try {
        const response = await apiClient.get(`QuestionBank/GetQuestionByLessonIdAsync?lessonId=${lessonId}`);
        const questions = response.data.data.items
            .map((data: any) => ({
                id: data.questionId,
                question: data.question,
                type: data.type,
                plum: data.plum,
                answers: data.answers.map((answer: any) => ({
                    id: answer.answerId,
                    answer: answer.answer,
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

export const getViewDetailQuestionBank = async (questionId: string): Promise<IViewDetailQuestionBank> => {
    try {
        const response = await apiClient.get(`QuestionBank/GetQuestionBankById?id=${questionId}`);
        const data = response.data.data;

        const answers = data.answers.map((answer: any) => ({
            id: answer.answerId,
            answer: answer.answer,
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