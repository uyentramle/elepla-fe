import apiClient from "@/data/apiClient";
import { getUserId } from "@/data/apiClient"; // Import hàm getUserId
import { message } from 'antd'; // Import Ant Design message
import { getActiveUserPackageByUserId } from '@/data/manager/UserPackageDatas';

// Giao diện cho yêu cầu tạo bài kiểm tra
export interface ICreateExamRequest {
    title: string;
    time: string; // Thời gian làm bài, ví dụ: "60 phút"
    userId: string; // ID của người dùng (lấy từ token)
    questionIds: string[]; // Danh sách ID các câu hỏi được chọn
}

export interface IQuestion {
  questionId: string;
  question: string;
  type: string; // Example: "multiple_choice"
  plum: string; // Example: "medium", "hard"
  answers: {
    answerId: string;
    answerText: string;
    isCorrect: boolean;
  }[];
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

const handleDownload = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Hàm xuất file Word (không màu)
export const exportExamToWord = async (examId: string, userId: string): Promise<void> => {
  try {
    const userPackage = await getActiveUserPackageByUserId(userId);

    if (!userPackage.exportWord) {
      message.warning('Nâng cấp tài khoản để sử dụng chức năng này');
      return;
    }

    const response = await apiClient.get(
      'https://elepla-be-production.up.railway.app/api/Exam/ExportExamToWordNoColor',
      {
        params: { examId },
        responseType: 'blob',
      }
    );

    if (response.status === 200) {
      handleDownload(response.data, `exam_${examId}.docx`);
      message.success('Xuất file Word thành công!');
    } else {
      message.error('Xuất file thất bại.');
    }
  } catch (error) {
    console.error('Error exporting exam to Word:', error);
    message.error('Có lỗi xảy ra khi xuất file Word.');
  }
};

// Hàm xuất file PDF (không màu)
export const exportExamToPdf = async (examId: string, userId: string): Promise<void> => {
  try {
    const userPackage = await getActiveUserPackageByUserId(userId);

    if (!userPackage.exportPdf) {
      message.warning('Nâng cấp tài khoản để sử dụng chức năng này');
      return;
    }

    const response = await apiClient.get(
      'https://elepla-be-production.up.railway.app/api/Exam/ExportExamToPdfNoColor',
      {
        params: { examId },
        responseType: 'blob',
      }
    );

    if (response.status === 200) {
      handleDownload(response.data, `exam_${examId}.pdf`);
      message.success('Xuất file PDF thành công!');
    } else {
      message.error('Xuất file thất bại.');
    }
  } catch (error) {
    console.error('Error exporting exam to PDF:', error);
    message.error('Có lỗi xảy ra khi xuất file PDF.');
  }
};

// Hàm xuất file Word kèm câu trả lời
export const exportExamWithAnswersToWord = async (examId: string, userId: string): Promise<void> => {
  try {
    const userPackage = await getActiveUserPackageByUserId(userId);

    if (!userPackage.exportWord) {
      message.warning('Nâng cấp tài khoản để sử dụng chức năng này');
      return;
    }

    const response = await apiClient.get(
      'https://elepla-be-production.up.railway.app/api/Exam/ExportExamToWord',
      {
        params: { examId },
        responseType: 'blob',
      }
    );

    if (response.status === 200) {
      handleDownload(response.data, `exam_with_answers_${examId}.docx`);
      message.success('Xuất file Word kèm đáp án thành công!');
    } else {
      message.error('Xuất file thất bại.');
    }
  } catch (error) {
    console.error('Error exporting exam with answers to Word:', error);
    message.error('Có lỗi xảy ra khi xuất file Word kèm đáp án.');
  }
};

// Hàm xuất file PDF kèm câu trả lời
export const exportExamWithAnswersToPdf = async (examId: string, userId: string): Promise<void> => {
  try {
    const userPackage = await getActiveUserPackageByUserId(userId);

    if (!userPackage.exportPdf) {
      message.warning('Nâng cấp tài khoản để sử dụng chức năng này');
      return;
    }

    const response = await apiClient.get(
      'https://elepla-be-production.up.railway.app/api/Exam/ExportExamToPdf',
      {
        params: { examId },
        responseType: 'blob',
      }
    );

    if (response.status === 200) {
      handleDownload(response.data, `exam_with_answers_${examId}.pdf`);
      message.success('Xuất file PDF kèm đáp án thành công!');
    } else {
      message.error('Xuất file thất bại.');
    }
  } catch (error) {
    console.error('Error exporting exam with answers to PDF:', error);
    message.error('Có lỗi xảy ra khi xuất file PDF kèm đáp án.');
  }
};
  

  export const deleteExamById = async (examId: string): Promise<boolean> => {  
    try {
      // Gửi yêu cầu DELETE tới API với examId là query parameter
      const response = await apiClient.delete(
        `https://elepla-be-production.up.railway.app/api/Exam/DeleteExam`,
        {
          params: { examId }, // Truyền examId dưới dạng query parameter
        }
      );
      // Kiểm tra phản hồi thành công
      if (response.data && response.data.success) {
        return true; // Xóa thành công
      }
      // Trường hợp phản hồi không thành công
      return false;
    } catch (error) {
      return false;
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

  
export const updateExam = async (
  examId: string,
  title: string,
  time: string,
  questionIds: string[]
): Promise<boolean> => {
  try {
      const payload = {
          examId,
          title,
          time,
          questionIds,
      };

      const response = await apiClient.put(`/Exam/UpdateExam`, payload);

      if (response.data && response.data.success) {
          console.log("Exam updated successfully:", response.data.data);
          return true;
      }

      console.error("Failed to update exam:", response.data.message);
      return false;
  } catch (error) {
      console.error("Error updating exam:", error);
      return false;
  }
};

export const getExamDetailsById = async (examId: string): Promise<IExamDetails | null> => {
    try {
        const response = await apiClient.get(`/Exam/GetExamById`, {
            params: { examId },
        });

        if (response.data && response.data.success) {
            const examDetails = response.data.data;

            const transformedDetails: IExamDetails = {
                ...examDetails,
                questions: examDetails.questions.map((question: any) => ({
                    ...question,
                    answers: question.answers.map((answer: any) => ({
                        ...answer,
                        isCorrect: answer.isCorrect === "True",
                    })),
                })),
            };

            return transformedDetails;
        }

        console.error("API response indicates failure:", response.data.message);
        return null;
    } catch (error) {
        console.error("Error fetching exam details:", error);
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
