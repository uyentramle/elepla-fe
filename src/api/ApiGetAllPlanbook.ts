import apiClient from "@/data/apiClient"; // axios instance đã cấu hình

// Định nghĩa kiểu dữ liệu trả về từ API
export interface PlanbookItem {
  planbookId: string;
  title: string;
  schoolName: string;
  teacherName: string;
  subject: string;
  className: string;
  isPublic: boolean;
  createdAt: string;
  lessonName: string;
  notes:string;
}

export interface PlanbookResponse {
  totalItemsCount: number;
  pageSize: number;
  totalPagesCount: number;
  pageIndex: number;
  next: boolean;
  previous: boolean;
  items: PlanbookItem[];
}

// Định nghĩa kiểu dữ liệu trả về từ API
export interface Activity {
  activityId: string;
  title: string;
  objective: string;
  content: string;
  product: string;
  implementation: string;
}

export interface PlanbookDetail {
  planbookId: string;
  lessonName:string;
  title: string;
  isPublic: boolean;
  schoolName: string;
  teacherName: string;
  subject: string;
  className: string;
  durationInPeriods: number;
  knowledgeObjective: string;
  skillsObjective: string;
  qualitiesObjective: string;
  teachingTools: string;
  notes:string;
  activities: Activity[];
  
}

export const getAllPlanbooks = async (
  pageIndex: number = 0,
  pageSize: number = 50
): Promise<PlanbookItem[]> => {
  try {
    const response = await apiClient.get(
      `https://elepla-be-production.up.railway.app/api/Planbook/GetAllPlanbooks`,
      {
        params: { pageIndex, pageSize }, // Gửi tham số truy vấn
      }
    );

    console.log("API Response:", response.data); // Log toàn bộ phản hồi

    if (response.data.success) {
      const planbooks = response.data.data.items; // Truy cập vào `items`
      console.log("Planbooks:", planbooks); // Log danh sách planbooks
      return planbooks; // Trả về danh sách Planbooks
    } else {
      console.error("Failed to fetch planbooks:", response.data.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching planbooks:", error);
    throw error; // Throw error để xử lý tại thành phần gọi
  }
};

export const getPlanbookById = async (planbookId: string): Promise<PlanbookDetail> => {
  try {
    const response = await apiClient.get(
      `https://elepla-be-production.up.railway.app/api/Planbook/GetPlanbookById`,
      {
        params: { planbookId },
      }
    );

    if (response.data.success) {
      return response.data.data;
    } else {
      console.error("Failed to fetch planbook details:", response.data.message);
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error fetching planbook details:", error);
    throw error;
  }
};