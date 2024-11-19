//Day.tsx
import { IViewSchedule } from '@/data/client/ScheduleData';

interface Props {
    day: string;
    date: number;
    month: number;
    year: number;
    today: boolean;
    handlerSelect: (d: number, m: number, y: number) => void;
    selected: boolean;
    events: IViewSchedule[];
    onEventClick: (event: IViewSchedule) => void;
}

const Day: React.FC<Props> = ({
    day,
    date,
    month,
    year,
    today,
    handlerSelect,
    selected,
    events,
    onEventClick
}) => {
    return (
        <div
            className={`flex flex-col items-center cursor-pointer 
                ${today ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => handlerSelect(date, month, year)}
        >
            <span>{day}</span>
            <span
                className={`mt-2 w-16 h-16 flex items-center justify-center rounded-full transition-colors 
                    ${selected ? "bg-yellow-400" : today ? "text-blue-500" : "hover:bg-gray-200"}`}
            >
                {date}
            </span>
            {/* Hiển thị danh sách sự kiện bên dưới */}
            {events.length > 0 ? (
                <div className="mt-3 w-full text-center">
                    {events.map((event, index) => (
                        <div key={index}
                            className="bg-blue-100 p-1 rounded text-xs py-1 mb-2"
                            onClick={() => onEventClick(event)}
                        >
                            <strong>{event.title}</strong>
                            <br />
                            <span>{event.startTime} - {event.endTime}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mt-3 w-full text-center h-40">
                </div>
            )}
        </div>
    );
};

export default Day;
