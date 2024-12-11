//ScheduleData.ts
import apiClient from "@/data/apiClient";
import { getUserId } from "@/data/apiClient";

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


export const fetchTeachingSchedules = async (pageIndex = 0, pageSize = 10): Promise<IViewSchedule[]> => {
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

        console.log("userId", userId)

        const { success, data, message } = response.data;

        if (!success) {
            throw new Error(message || "Failed to fetch teaching schedules.");
        }

        // Ánh xạ dữ liệu API sang định dạng IViewSchedule
        return data.items.map((item: any) => ({
            id: item.scheduleId,
            title: item.title,
            description: item.description,
            date: new Date(item.date).toISOString().split("T")[0], // Chuyển đổi ngày
            startTime: item.startTime,
            endTime: item.endTime,
            className: item.className,
            teacher: item.teacherName,
            planbookId: undefined, // Nếu API có trả về, thay đổi cho phù hợp
            planbookTitle: item.planbookTitle,
        }));
    } catch (error) {
        console.error("Error fetching teaching schedules:", error);
        throw error;
    }
};



const event_data: IViewSchedule[] = [
    {
        id: "1",
        title: "Math Class",
        description: "Trigonometry lesson",
        date: "18/11/2024",
        startTime: "09:00",
        endTime: "10:30",
        className: "Math",
        teacher: "Mr. A",
        planbookId: "123",
        planbookTitle: "Math 10",
    },
    {
        id: "2",
        title: "English Class",
        description: "Reading lesson",
        date: "19/11/2024",
        startTime: "10:30",
        endTime: "12:00",
        className: "English",
        teacher: "Mr. B",
        planbookId: "124",
        planbookTitle: "English 10",
    },
    {
        id: "3",
        title: "Physics Class",
        description: "Mechanics lesson",
        date: "21/11/2024",
        startTime: "13:00",
        endTime: "14:30",
        className: "Physics",
        teacher: "Mr. C",
        planbookId: "125",
        planbookTitle: "Physics 10",
    },
    {
        id: "4",
        title: "Chemistry Class",
        description: "Chemical reactions lesson",
        date: "25/11/2024",
        startTime: "14:30",
        endTime: "16:00",
        className: "Chemistry",
        teacher: "Mr. D",
        planbookId: "126",
        planbookTitle: "Chemistry 10",
    },
    {
        id: "5",
        title: "Biology Class",
        description: "Human body lesson",
        date: "26/11/2024",
        startTime: "16:00",
        endTime: "17:30",
        className: "Biology",
        teacher: "Mr. E",
        planbookId: "127",
        planbookTitle: "Biology 10",
    },
    {
        id: "fgd3",
        title: "Physics Class",
        description: "Mechanics lesson",
        date: "21/11/2024",
        startTime: "15:00",
        endTime: "16:30",
        className: "Physics",
        teacher: "Mr. C",
        planbookId: "125",
        planbookTitle: "Physics 10",
    },
    {
        id: "2sgsd",
        title: "English Class",
        description: "Reading lesson",
        date: "21/11/2024",
        startTime: "10:30",
        endTime: "12:00",
        className: "English",
        teacher: "Mr. B",
        planbookId: "124",
        planbookTitle: "English 10",
    },
];

export default event_data;

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