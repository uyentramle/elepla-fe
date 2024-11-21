//WeeklyEvent.tsx
import React, { useState, } from "react";
import { now, months, dayName } from "@/utils/GetDays";
import dayjs, { Dayjs } from "dayjs";
import event_data from '@/data/client/ScheduleData';

const WeeklyEvent: React.FC = () => {
    const [days,] = useState<Dayjs[]>(months()[now.weekOfMonth]);

    // Render cột thời gian và các sự kiện
    const renderEventsForWeek = () => {
        return days.map((day, index) => {
            const eventsForDay = event_data.filter((event) => {
                const eventDate = dayjs(event.date, "DD/MM/YYYY");
                return (
                    eventDate.date() === day.date() &&
                    eventDate.month() === day.month() &&
                    eventDate.year() === day.year()
                );
            });

            return (
                <div key={index} className="mt-4 p-4 bg-white rounded shadow">
                    <h2 className="font-semibold mb-2">
                        {`${dayName(day.day())} ${day.date()}/${day.month() + 1}/${day.year()}`}
                    </h2>
                    {eventsForDay.length > 0 && (
                        eventsForDay.map((event, eventIndex) => (
                            <div key={eventIndex} className="p-2 mb-2 bg-blue-100 rounded">
                                <strong>{event.title}</strong>
                                <p>{event.description}</p>
                                <p>{event.startTime} - {event.endTime} </p>
                            </div>
                        ))
                    )}
                </div>
            );
        });
    };

    return (
        <>
            <div className="mt-2">
                {renderEventsForWeek()}
            </div>

        </>
    )
};

export default WeeklyEvent;
