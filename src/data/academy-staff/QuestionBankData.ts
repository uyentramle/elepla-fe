export interface IQuestionBank {
    initialQuestionData: {
        questionId?: string;
        question: string;
        type: string;
        plum: string;
        chapterId: string;
        lessonId?: string | null;
        answers: IAnswer[];
    };
};

export interface IAnswer {
    answerId: string;
    answerText: string;
    isCorrect: boolean;
}

const questionBanks: IQuestionBank[] = [
];

export default questionBanks;