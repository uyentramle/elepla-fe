import React, { useState } from "react";
import { now, months, dayName } from "@/utils/GetDays";
import dayjs, { Dayjs } from "dayjs";
import { IViewSchedule } from "@/data/client/ScheduleData";
interface WeeklyEventProps {
    events: IViewSchedule[]; // Nhận danh sách sự kiện từ cha
}

const WeeklyEvent: React.FC<WeeklyEventProps> = ({ events }) => {
    const [days,] = useState<Dayjs[]>(months()[now.weekOfMonth]);

    // Render cột thời gian và các sự kiện
    const renderEventsForWeek = () => {
        return days.map((day, index) => {
            // Lọc các sự kiện trong ngày
            const eventsForDay = events.filter((event) => {
                const eventDate = dayjs(event.date, "YYYY-MM-DD"); // Định dạng từ API
                return (
                    eventDate.date() === day.date() &&
                    eventDate.month() === day.month() &&
                    eventDate.year() === day.year()
                );
            });
    
            // Sắp xếp các sự kiện theo thời gian bắt đầu
            const sortedEvents = eventsForDay.sort((a, b) => {
                const startA = dayjs(a.startTime, "HH:mm");
                const startB = dayjs(b.startTime, "HH:mm");
                return startA.isBefore(startB) ? -1 : 1;
            });
    
            return (
                <div key={index} className="mt-4 p-4 bg-white rounded shadow">
                    <h2 className="font-semibold mb-2">
                        {`${dayName(day.day())} ${day.date()}/${day.month() + 1}/${day.year()}`}
                    </h2>
                    {sortedEvents.map((event, eventIndex) => (
                        <div key={eventIndex} className="p-2 mb-2 bg-blue-100 rounded">
                            <strong>{event.title}</strong>
                            <p dangerouslySetInnerHTML={{ __html: event.description || "" }}></p>
                            <p>{event.startTime} - {event.endTime}</p>
                        </div>
                    ))}
                </div>
            );
        });
    };

    return (
        <div className="mt-2">
            {renderEventsForWeek()}
        </div>
    );
};

export default WeeklyEvent;