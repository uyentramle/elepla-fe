import React from "react";
import WeeklySchedule from "@/layouts/teacher/Components/Calendar/WeeklySchedule";
import WeeklyEvent from "@/layouts/teacher/Components/Calendar/WeeklyEvent";
import { Typography } from "antd";


const { Title } = Typography;

const WeeklySchedulePage: React.FC = () => {
    return (
        <>
            <div className="bg-white pt-1 mt-2 rounded-lg">
                <Title level={2} className="my-4" style={{ textAlign: 'center' }}>Lịch hàng tuần</Title>

                <WeeklySchedule />
            </div>

            <div className="bg-white pt-1 mt-2 rounded-lg">
                <Title level={2} className="my-4" style={{ textAlign: 'center' }}>Sự kiện trong tuần</Title>

                <WeeklyEvent />
            </div>
        </>
    );
};

export default WeeklySchedulePage;