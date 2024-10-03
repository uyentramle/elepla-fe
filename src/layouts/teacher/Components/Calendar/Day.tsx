interface Props {
    day: string;
    date: number;
    month: number;
    year: number;
    today: boolean;
    handlerSelect: (d: number, m: number, y: number) => void;
    selected: boolean;
}

const Day: React.FC<Props> = ({
    day,
    date,
    month,
    year,
    today,
    handlerSelect,
    selected
}) => {
    return (
        <div
            className={
                `flex flex-col items-center cursor-pointer 
                ${today ? "border-b-2 border-blue-500"
                    : ""
                }`}
            onClick={() => handlerSelect(date, month, year)}
        >
            <span>{day}</span>
            <span
                className={
                    `mt-2 w-16 h-16 flex items-center justify-center rounded-full transition-colors 
                    ${selected ? "bg-yellow-400" 
                        : today ? "text-blue-500" 
                        : "hover:bg-gray-200"
                    }`
                }
            >
                {date}
            </span>
        </div>
    );
};

export default Day;
