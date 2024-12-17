import apiClient from "@/data/apiClient";

type QuestionType = "multiple choice" | "True/False" | "Short Answer";
type PlumLevel = "easy" | "medium" | "hard";


export interface IQuestion {
    questionId: string;
    question: string;
    type: QuestionType;
    plum: PlumLevel;
    chapterId: string;
    lessonId?: string | null;
    answers: IAnswer[];
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string | null;
    updatedBy?: string | null;
    deletedAt?: string | null;
    deletedBy?: string | null;
    isDeleted?: boolean;
  }

  
export interface IQuestionBank {
  questionId: string;
  question: string;
  type: QuestionType;
  plum: PlumLevel;
  chapterId: string;
  lessonId?: string | null;
  answers: IAnswer[];
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string | null;
  updatedBy?: string | null;
  deletedAt?: string | null;
  deletedBy?: string | null;
  isDeleted?: boolean;
}
  
  export interface IAnswer {
    answerId: string;
    answerText: string;
    isCorrect: boolean;
  }
  
  export interface IQuestionBankResponse {
    success: boolean;
    message: string;
    data: {
      totalItemsCount: number;
      pageSize: number;
      totalPagesCount: number;
      pageIndex: number;
      next: boolean;
      previous: boolean;
      items: IQuestion[];
    };
  }

  export const createQuestion = async (questionData: {
    question: string;
    type: QuestionType;
    plum: PlumLevel;
    chapterId: string;
    lessonId?: string | null;
    answers: { answerText: string; isCorrect: boolean }[];
  }): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post(
        "https://elepla-be-production.up.railway.app/api/QuestionBank/CreateQuestion",
        {
          question: questionData.question,
          type: questionData.type,
          plum: questionData.plum,
          chapterId: questionData.chapterId,
          lessonId: questionData.lessonId || null,
          answers: questionData.answers,
        }
      );
  
      if (response.status === 200 || response.status === 201) {
        return {
          success: true,
          message: "Câu hỏi đã được tạo thành công!",
        };
      } else {
        throw new Error("Lỗi không xác định!");
      }
    } catch (error: any) {
      console.error("Error creating question:", error.response?.data || error.message);
      throw {
        success: false,
        message: error.response?.data?.message || "Lỗi khi tạo câu hỏi!",
      };
    }
  };
  
  export const fetchAllQuestions = async (
    pageIndex: number = 0,
    pageSize: number = 50,
  ): Promise<IQuestionBankResponse> => {
    try {
      let url = `QuestionBank/GetAllQuestionBank?pageIndex=${pageIndex}&pageSize=${pageSize}`;
      const response = await apiClient.get<IQuestionBankResponse>(url);
  
      return {
        ...response.data,
        data: {
          ...response.data.data,
          items: response.data.data.items.map((question) => ({
            ...question,
            answers: question.answers.map((answer: any) => ({
              ...answer,
              isCorrect: answer.isCorrect === "True", // Chuyển đổi thành boolean
            })),
          })),
        },
      };
    } catch (error) {
      console.error("Error fetching question bank:", error);
      throw error;
    }
  };

  export const fetchQuestionsByChapter = async (
    chapterId: string,
    pageIndex: number = 0,
    pageSize: number = 10,
  ): Promise<IQuestionBankResponse> => {
    try {
      const url = `https://elepla-be-production.up.railway.app/api/QuestionBank/GetQuestionByChapterId?chapterId=${chapterId}&pageIndex=${pageIndex}&pageSize=${pageSize}`;
      const response = await apiClient.get<IQuestionBankResponse>(url);
  
      // Map dữ liệu để chuyển đổi `isCorrect` thành boolean
      return {
        ...response.data,
        data: {
          ...response.data.data,
          items: response.data.data.items.map((question) => ({
            ...question,
            answers: question.answers.map((answer: any) => ({
              ...answer,
              isCorrect: answer.isCorrect === "True", // Chuyển đổi giá trị "True" hoặc "False"
            })),
          })),
        },
      };
    } catch (error) {
      console.error("Error fetching questions by chapter:", error);
      throw error;
    }
  };

  export const fetchQuestionsByLesson = async (
    lessonId: string,
    pageIndex: number = 0,
    pageSize: number = 50
  ): Promise<IQuestionBankResponse> => {
    try {
      const url = `QuestionBank/GetQuestionByLessonId?lessonId=${lessonId}&pageIndex=${pageIndex}&pageSize=${pageSize}`;
      const response = await apiClient.get<IQuestionBankResponse>(url);
      return {
        ...response.data,
        data: {
          ...response.data.data,
          items: response.data.data.items.map((question) => ({
            ...question,
            answers: question.answers.map((answer: any) => ({
              ...answer,
              isCorrect: answer.isCorrect === "True", // Chuyển đổi thành boolean
            })),
          })),
        },
      };
    } catch (error) {
      console.error("Error fetching questions by lesson:", error);
      throw error;
    }
  };
  

  export const deleteQuestion = async (questionId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const url = `https://elepla-be-production.up.railway.app/api/QuestionBank/DeleteQuestion?id=${questionId}`;
      const response = await apiClient.delete(url);
  
      // Kiểm tra phản hồi từ server
      if (response.status === 200) {
        return {
          success: true,
          message: "Câu hỏi đã được xóa thành công!",
        };
      } else {
        throw new Error("Lỗi không xác định!");
      }
    } catch (error: any) {
      console.error("Error deleting question:", error.response?.data || error.message);
      throw {
        success: false,
        message: error.response?.data?.message || "Lỗi khi xóa câu hỏi!",
      };
    }
  };
  
  
  