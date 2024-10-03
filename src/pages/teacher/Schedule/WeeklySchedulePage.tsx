import React from "react";
import WeeklySchedule from "@/layouts/teacher/Components/Calendar/WeeklySchedule";
import { Typography } from "antd";


const { Title } = Typography;

const WeeklySchedulePage: React.FC = () => {
    return (
        <div>
            <Title level={2} className="my-4" style={{ textAlign: 'center' }}>Lịch hàng tuần</Title>

            <WeeklySchedule />
        </div>
    );
};

export default WeeklySchedulePage;