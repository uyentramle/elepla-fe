//ScheduleData.ts
import apiClient from "@/data/apiClient";
import { getUserId } from "@/data/apiClient";
import dayjs from 'dayjs';


export interface IScheduleForm {
    id: string | undefined;
    title: string;
    description: string | undefined;
    date: string;
    startTime: string;
    endTime: string;
    className: string | undefined;
    planbookId: string | undefined;
}

export interface IViewSchedule {
    id: string;
    title: string;
    description: string | undefined;
    date: string;
    startTime: string;
    endTime: string;
    className: string | undefined;
    teacher: string;
    planbookId: string | undefined;
    planbookTitle: string | undefined;
}


export const fetchTeachingSchedules = async (pageIndex = -1, pageSize = 10): Promise<IViewSchedule[]> => {
    const userId = getUserId(); // Lấy userId từ token
    if (!userId) {
        throw new Error("User ID not found. Please log in again.");
    }

    try {
        const response = await apiClient.get("TeachingSchedule/GetTeachingSchedulesByUserId", {
            params: {
                userId,
                pageIndex,
                pageSize,
            },
        });

        console.log("userId", userId);

        const { success, data, message } = response.data;

        if (!success) {
            throw new Error(message || "Failed to fetch teaching schedules.");
        }

        // Ánh xạ dữ liệu API sang định dạng IViewSchedule
        return data.items.map((item: any) => {
            const eventDate = dayjs(item.date); // Lấy ngày từ API

            return {
                id: item.scheduleId,
                title: item.title,
                description: item.description,
                date: eventDate.add(1, 'day').toISOString().split("T")[0], 
                startTime: item.startTime,
                endTime: item.endTime,
                className: item.className,
                teacher: item.teacherName,
                planbookId: item.planbookId, // Nếu API có trả về, thay đổi cho phù hợp
                planbookTitle: item.planbookTitle,
            };
        });
    } catch (error) {
        console.error("Error fetching teaching schedules:", error);
        throw error;
    }
};


export interface ICreateSchedule {
    title: string;
    description?: string;
    date: string;
    startTime: string;
    endTime: string;
    className: string;
    teacherId: string;
    planbookId: string;
}

export const createTeachingSchedule = async (schedule: ICreateSchedule): Promise<void> => {
    try {
        // Lấy danh sách các lịch dạy hiện tại
        const currentSchedules = await fetchTeachingSchedules();

        // Kiểm tra trùng khung giờ
        const isConflict = currentSchedules.some((event) => {
            return (
                event.date === schedule.date && // Cùng ngày
                (
                    (schedule.startTime >= event.startTime && schedule.startTime < event.endTime) || // Bắt đầu trong khoảng thời gian
                    (schedule.endTime > event.startTime && schedule.endTime <= event.endTime) || // Kết thúc trong khoảng thời gian
                    (schedule.startTime <= event.startTime && schedule.endTime >= event.endTime) // Bao phủ toàn bộ
                )
            );
        });

        if (isConflict) {
            throw new Error("Khung giờ đã bị trùng với một sự kiện khác.");
        }

        // Gửi yêu cầu tạo sự kiện nếu không có xung đột
        const response = await apiClient.post("TeachingSchedule/AddTeachingSchedule", schedule, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        const { success, message } = response.data;

        if (!success) {
            throw new Error(message || "Failed to create teaching schedule.");
        }
    } catch (error) {
        console.error("Error creating teaching schedule:", error);
        throw error;
    }
};

export const deleteTeachingSchedule = async (scheduleId: string): Promise<void> => {
    try {
        const response = await apiClient.delete(
            "TeachingSchedule/DeleteTeachingSchedule",
            { params: { scheduleId } }
        );

        const { success, message } = response.data;

        if (!success) {
            throw new Error(message || "Failed to delete teaching schedule.");
        }

        console.log("Teaching schedule deleted successfully.");
    } catch (error) {
        console.error("Error deleting teaching schedule:", error);
        throw error;
    }
};

export const fetchTeachingScheduleById = async (scheduleId: string): Promise<IViewSchedule> => {
    try {
        const response = await apiClient.get(`TeachingSchedule/GetTeachingScheduleById`, {
            params: { scheduleId },
        });

        const { success, data, message } = response.data;

        if (!success) {
            throw new Error(message || "Failed to fetch teaching schedule details.");
        }

        return {
            id: data.scheduleId,
            title: data.title,
            description: data.description,
            date: new Date(data.date).toISOString().split("T")[0],
            startTime: data.startTime,
            endTime: data.endTime,
            className: data.className,
            teacher: data.teacherName,
            planbookId: data.planbookId,
            planbookTitle: data.planbookTitle,
        };
    } catch (error) {
        console.error("Error fetching teaching schedule details:", error);
        throw error;
    }
};

export interface IUpdateSchedule {
    scheduleId: string;
    title: string;
    description?: string;
    date: string;
    startTime: string;
    endTime: string;
    className: string;
    teacherId: string;
    planbookId: string;
}

export const updateTeachingSchedule = async (schedule: IUpdateSchedule): Promise<void> => {
    try {
        // Lấy danh sách các lịch dạy hiện tại
        const currentSchedules = await fetchTeachingSchedules();

        // Kiểm tra trùng khung giờ
        const isConflict = currentSchedules.some((event) => {
            return (
                event.date === schedule.date && // Cùng ngày
                event.id !== schedule.scheduleId && // Không phải chính sự kiện đang cập nhật
                (
                    (schedule.startTime >= event.startTime && schedule.startTime < event.endTime) || // Bắt đầu trong khoảng thời gian
                    (schedule.endTime > event.startTime && schedule.endTime <= event.endTime) || // Kết thúc trong khoảng thời gian
                    (schedule.startTime <= event.startTime && schedule.endTime >= event.endTime) // Bao phủ toàn bộ
                )
            );
        });

        if (isConflict) {
            throw new Error("Khung giờ đã bị trùng với một sự kiện khác.");
        }

        // Gửi yêu cầu cập nhật nếu không có xung đột
        const response = await apiClient.put("TeachingSchedule/UpdateTeachingSchedule", schedule, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        const { success, message } = response.data;

        if (!success) {
            throw new Error(message || "Failed to update teaching schedule.");
        }

        console.log("Teaching schedule updated successfully.");
    } catch (error) {
        console.error("Error updating teaching schedule:", error);
        throw error;
    }
};

