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

// Hàm lấy danh sách bài kiểm tra theo userId
export const getExamsByUserId = async (): Promise<ICreateExamResponse[] | null> => {
    try {
        // Lấy userId từ token
        const userId = getUserId();
        if (!userId) {
            console.error("User ID not found in token.");
            return null;
        }

        // Gọi API
        const response = await apiClient.get<ICreateExamResponse[]>(
            `Exam/GetExamsByUserId?userId=${userId}`
        );
        return response.data; // Trả về dữ liệu danh sách bài kiểm tra
    } catch (error) {
        console.error("Error fetching exams:", error);
        return null; // Trả về null nếu có lỗi
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