import apiClient from "@/data/apiClient";

// Định nghĩa các kiểu dữ liệu
export type QuestionType = "multiple choice" | "True/False" | "Short Answer";
export type PlumLevel = "easy" | "medium" | "hard";

export interface IAnswer {
  answerId: string;
  answerText: string;
  isCorrect: boolean;
}

export interface IQuestion {
  questionId: string;
  question: string;
  type: QuestionType;
  plum: PlumLevel;
  subject: string;
  curriculum: string;
  grade: string;
  chapterId: string;
  chapterName: string;
  lessonId?: string | null;
  lessonName?: string | null;
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


// Hàm lấy danh sách câu hỏi
export const fetchAllQuestions = async (
  pageIndex: number = 0,
  pageSize: number = 50
): Promise<IQuestionBankResponse> => {
  try {
    const url = `QuestionBank/GetAllQuestionBank?pageIndex=${pageIndex}&pageSize=${pageSize}`;
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

// Hàm đếm tổng số lượng câu hỏi từ QuestionBank
export const countQuestions = async (): Promise<number> => {
  try {
    // Gọi API với pageSize = 1 để lấy thông tin tổng số lượng câu hỏi
    const response = await fetchAllQuestions(0, 1);

    // Trích xuất tổng số lượng câu hỏi từ response
    return response.data.totalItemsCount;
  } catch (error) {
    console.error("Error counting questions:", error);
    throw error;
  }
};

  export const fetchQuestionsByUserId = async (
    userId: string,
    pageIndex: number = 0,
    pageSize: number = 50
  ): Promise<IQuestionBankResponse> => {
    try {
      const url = `https://elepla-be-production.up.railway.app/api/QuestionBank/GetAllQuestionByUserId?userId=${userId}&pageIndex=${pageIndex}&pageSize=${pageSize}`;
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
      console.error("Error fetching questions by userId:", error);
      throw error;
    }
  };

  export const updateQuestion = async (
    updatedQuestion: {
      questionId: string;
      question: string;
      type: QuestionType;
      plum: PlumLevel;
      chapterId: string;
      lessonId?: string | null;
      answers: IAnswer[]; // Đảm bảo luôn là mảng
    }
  ): Promise<IQuestion> => {
    try {
      const url = "https://elepla-be-production.up.railway.app/api/QuestionBank/UpdateQuestion";
  
      const payload = {
        ...updatedQuestion,
        answers: (updatedQuestion.answers || []).map(answer => ({
          answerId: answer.answerId,
          answerText: answer.answerText || "", 
          isCorrect: !!answer.isCorrect, // Chuyển giá trị thành boolean
        })),
      };
  
      const response = await apiClient.put<{
        success: boolean;
        message: string;
        data: IQuestion;
      }>(url, payload);
  
      if (!response.data.success) {
        throw new Error(response.data.message || "Lỗi không xác định.");
      }
  
      const updatedData = response.data.data;
  
      return {
        ...updatedData,
        answers: updatedData.answers?.map(answer => ({
          answerId: answer.answerId,
          answerText: answer.answerText || "", // Giá trị mặc định nếu thiếu
          isCorrect: !!answer.isCorrect, // Chuyển đổi giá trị thành boolean
        })) || [],
      };
    } catch (error) {
      // Không in lỗi ra console, thay vào đó chỉ ném lỗi tiếp
      throw error; // hoặc return giá trị null hoặc giá trị xử lý khác theo nhu cầu
    }
  };
  
  
  // Hàm lấy chi tiết câu hỏi theo ID
  export const fetchQuestionById = async (id: string): Promise<IQuestion> => {
    try {
      const url = `https://elepla-be-production.up.railway.app/api/QuestionBank/GetQuestionBankById?id=${id}`;
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: IQuestion;
      }>(url);
  
      if (response.data.success) {
        return {
          ...response.data.data,
          answers: response.data.data.answers.map((answer: any) => ({
            ...answer,
            isCorrect: answer.isCorrect === "True", // Chuyển đổi thành boolean
          })),
        };
      } else {
        throw new Error(response.data.message || "Lỗi không xác định.");
      }
    } catch (error) {
      console.error("Error fetching question by ID:", error);
      throw error;
    }
  };

  export const createQuestionByStaff = async (questionData: {
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
          ...questionData,
          isDefault: true, // Giá trị cố định cho staff
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
  
  
  export const createQuestionByTeacher = async (questionData: {
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
          isDefault: false, // Always false for this function
          chapterId: questionData.chapterId,
          lessonId: questionData.lessonId || null,
          answers: questionData.answers,
        }
      );
  
      if (response.status === 200 || response.status === 201) {
        return {
          success: true,
          message: "Câu hỏi đã được tạo thành công bởi giáo viên!",
        };
      } else {
        throw new Error("Lỗi không xác định!");
      }
    } catch (error: any) {
      console.error("Error creating question by teacher:", error.response?.data || error.message);
      throw {
        success: false,
        message: error.response?.data?.message || "Lỗi khi giáo viên tạo câu hỏi!",
      };
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