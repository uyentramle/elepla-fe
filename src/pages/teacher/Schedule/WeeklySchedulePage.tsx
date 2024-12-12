import React, { useState, useEffect } from "react";
import WeeklySchedule from "@/layouts/teacher/Components/Calendar/WeeklySchedule";
import WeeklyEvent from "@/layouts/teacher/Components/Calendar/WeeklyEvent";
import { fetchTeachingSchedules, IViewSchedule } from "@/data/client/ScheduleData";
import { Typography, message } from "antd";

const { Title } = Typography;

const WeeklySchedulePage: React.FC = () => {
    const [events, setEvents] = useState<IViewSchedule[]>([]); // Trạng thái lưu danh sách sự kiện
    const [loading, setLoading] = useState<boolean>(true);

    // Gọi API để tải sự kiện
    useEffect(() => {
        const loadEvents = async () => {
            try {
                setLoading(true);
                const schedules = await fetchTeachingSchedules();
                setEvents(schedules);
            } catch (err: any) {
                message.error(err.message || "Không thể tải danh sách sự kiện.");
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, []);

    // Hàm cập nhật danh sách sự kiện sau khi xóa hoặc chỉnh sửa
    const updateEvents = (updatedEvents: IViewSchedule[]) => {
        setEvents(updatedEvents);
    };

    return (
        <>
            <div className="bg-white pt-1 mt-2 rounded-lg">
                <Title level={2} className="my-4" style={{ textAlign: "center" }}>
                    Lịch hàng tuần
                </Title>
                <WeeklySchedule 
                    events={events} 
                    updateEvents={updateEvents} 
                    loading={loading} 
                />
            </div>

            <div className="bg-white pt-1 mt-2 rounded-lg">
                <Title level={2} className="my-4" style={{ textAlign: "center" }}>
                    Sự kiện trong tuần
                </Title>
                <WeeklyEvent events={events} />
            </div>
        </>
    );
};

export default WeeklySchedulePage;
