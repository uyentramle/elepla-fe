import { useState } from "react";
import { now, months, capFirstLetter, monthName, dayName, SelectedDay } from "@/utils/GetDays";
import Day from "./Day";
import { ArrowLeftOutlined, ArrowRightOutlined, CalendarOutlined } from "@ant-design/icons";
import { Dayjs } from "dayjs";
import { Button } from "antd";

let index: number = now.weekOfMonth;
let month: number = now.month;
let unselected: SelectedDay = {
    date: -1,
    month: -1,
    year: -1
};

const WeeklySchedule: React.FC = () => {
    //States
    const [days, setDays] = useState<Dayjs[]>(months()[now.weekOfMonth]);
    const [selected, setSelected] = useState<SelectedDay>(unselected);

    //Function to set selected date state
    const selectDay = (d: number, m: number, y: number): void => {
        if (d === selected.date && m === selected.month && y === selected.year) {
            setSelected(unselected);
            return;
        }
        setSelected({ date: d, month: m, year: y });
    };

    //Function to navidate between weeks (back and forth)
    const navigate = (nav: boolean): void => {
        //Forth
        if (nav) {
            index++;
            if (index > 4) {
                index = 0;
                month++;
                //same week validation
                if (days[0].date() === months(month)[index][0].date()) {
                    index++;
                }
            }
        } else {
            index--;
            if (index < 0) {
                index = 4;
                month--;
                //same week valiadtion
                if (days[0].date() === months(month)[index][0].date()) {
                    index--;
                }
            }
        }
        //set week days with month and index values obtained from validations
        setDays(months(month)[index]);
    };

    //Function to reset to today
    const reset = (): void => {
        setDays(months()[now.weekOfMonth]);
        index = now.weekOfMonth;
        month = now.month;
    };

    return (
        <div className="mb-40 w-full max-w-6xl mx-auto bg-gray-100 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <ArrowLeftOutlined
                    onClick={() => navigate(false)}
                    className="text-xl cursor-pointer p-2 hover:bg-blue-200 rounded"
                />
                <h1 className="dark ms-5">
                    {capFirstLetter(monthName(days[0].month() + 1))} {days[0].year()}
                </h1>
                <h1 className="text-xl font-semibold">
                    {capFirstLetter(monthName(days[0].month() + 1))} {days[0].year()}
                </h1>
                <ArrowRightOutlined
                    onClick={() => navigate(true)}
                    className="text-xl cursor-pointer p-2 hover:bg-blue-200 rounded"
                />
                <Button
                    // className="ml-4 px-4 py-2 rounded-lg flex items-center"
                    type="primary"
                    onClick={reset}
                >
                    <CalendarOutlined className="mb-2" />
                    Hôm nay
                </Button>
            </div>
            <div className="flex justify-evenly">
                {days.map((day) => (
                    <Day
                        key={day.day()}
                        day={dayName(day.day())}
                        date={day.date()}
                        month={day.month()}
                        year={day.year()}
                        today={
                            day.date() === now.date &&
                            day.month() === now.month &&
                            day.year() === now.year
                        }
                        handlerSelect={selectDay}
                        selected={
                            day.date() === selected.date &&
                            day.month() === selected.month &&
                            day.year() === selected.year
                        }
                    />
                ))}
            </div>
        </div>
    );
};

export default WeeklySchedule;
