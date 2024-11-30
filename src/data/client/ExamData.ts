//ExamData.ts
import apiClient from "@/data/apiClient";
import { getUserId } from "@/data/apiClient"; // Import hàm getUserId

// Giao diện cho yêu cầu tạo bài kiểm tra
export interface ICreateExamRequest {
    title: string;
    time: string; // Thời gian làm bài, ví dụ: "60 phút"
    userId: string; // ID của người dùng (lấy từ token)
    questionIds: string[]; // Danh sách ID các câu hỏi được chọn
}

// Giao diện cho phản hồi từ API
export interface ICreateExamResponse {
    id: string; // ID của bài kiểm tra vừa tạo
    title: string;
    time: string;
    userId: string;
    questionIds: string[]; // Các ID câu hỏi đã lưu trong bài kiểm tra
    createdAt: string; // Thời gian tạo
}

export interface IExam {
    id: string; // ID của bài kiểm tra
    title: string;
    time?: string; // Nếu cần thêm các thuộc tính khác từ API
  }

  export interface IExamAnswer {
    answerId: string;
    answerText: string;
    isCorrect: boolean; // Chuyển từ "True"/"False" sang boolean
  }

  export interface IExamQuestion {
    questionId: string;
    question: string;
    type: string; // Loại câu hỏi (vd: multiple_choice)
    plum: string; // Độ khó
    index: number; // Số thứ tự câu hỏi
    answers: IExamAnswer[];
  }
  
  export interface IExamDetails {
    examId: string;
    title: string;
    time: string; // Thời gian làm bài kiểm tra
    userId: string; // ID người tạo bài kiểm tra
    questions: IExamQuestion[];
    createdAt: string;
    createdBy?: string;
    updatedAt?: string | null;
    updatedBy?: string | null;
    deletedAt?: string | null;
    deletedBy?: string | null;
    isDeleted?: boolean;
  }

  export const getExamDetailsById = async (examId: string): Promise<IExamDetails | null> => {
    try {
      // Gửi yêu cầu tới API
      const response = await apiClient.get(`/Exam/GetExamById`, {
        params: { examId }, // Gửi examId dưới dạng query parameter
      });
  
      // Kiểm tra phản hồi thành công
      if (response.data && response.data.success) {
        const examDetails = response.data.data;
  
        // Chuyển đổi isCorrect từ string ("True"/"False") sang boolean
        const transformedDetails: IExamDetails = {
          ...examDetails,
          questions: examDetails.questions.map((question: any) => ({
            ...question,
            answers: question.answers.map((answer: any) => ({
              ...answer,
              isCorrect: answer.isCorrect === "True", // Chuyển đổi thành boolean
            })),
          })),
        };
  
        return transformedDetails;
      }
  
      // Trường hợp phản hồi không thành công
      console.error("API response indicates failure:", response.data.message);
      return null;
    } catch (error) {
      // Xử lý lỗi khi gửi yêu cầu
      console.error("Error fetching exam details:", error);
      return null;
    }
  };

// Hàm lấy danh sách bài kiểm tra theo userId
export const getExamsByUserId = async (): Promise<IExam[] | null> => {
    try {
      // Lấy userId từ token
      const userId = getUserId();
      if (!userId) {
        console.error("User ID not found in token.");
        return null;
      }
  
      // Gọi API
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: any[];
      }>(`Exam/GetExamsByUserId?userId=${userId}`);
  
      // Chuyển đổi `examId` thành `id`
      const exams: IExam[] = response.data.data.map((exam) => ({
        id: exam.examId,
        title: exam.title,
        time: exam.time, // Nếu cần
      }));
  
      return exams;
    } catch (error) {
      console.error("Error fetching exams:", error);
      return null;
    }
  };

  

// Hàm gọi API để tạo bài kiểm tra
export const createExam = async (
    examData: ICreateExamRequest
): Promise<ICreateExamResponse | null> => {
    try {
        const response = await apiClient.post<ICreateExamResponse>(
            "Exam/CreateExam", // Endpoint API
            examData // Dữ liệu gửi đi
        );
        return response.data; // Trả về dữ liệu từ phản hồi API
    } catch (error) {
        console.error("Error creating exam:", error);
        return null; // Xử lý lỗi và trả về null
    }
};