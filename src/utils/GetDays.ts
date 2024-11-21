//GetDay.ts
import dayjs from "dayjs";

export interface SelectedDay {
    date: number;
    month: number;
    year: number;
  }  

//Get month week (0-4) 5weeks total
const weekOfMonth = () => {
    const d = new Date();
    const date = d.getDate();
    const day = d.getDay();
    const weekOfMonth = Math.ceil((date - 1 - day) / 7);
    return weekOfMonth;
};

//Now object (date (1-31), day (0-6), month (0-11), year, week)
export const now = {
    date: dayjs().date(),
    day: dayjs().day(),
    month: dayjs().month(),
    year: dayjs().year(),
    weekOfMonth: weekOfMonth()
};

//Get Dayjs array of week per month (default month = today)
export const months = (month = dayjs().month()) => {
    const year = dayjs().year();
    const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
    let currentMonthCount = 0 - firstDayOfTheMonth;
    const daysMatrix = new Array(5).fill([]).map(() => {
        return new Array(7).fill([null]).map(() => {
            currentMonthCount++;
            return dayjs(new Date(year, month, currentMonthCount));
        });
    });
    return daysMatrix;
};

//Get month name by month number (id)
export const monthName = (m: number) => {
    const date = new Date();
    date.setMonth(m - 1);

    return date.toLocaleString("vi-VN", {
        month: "long"
    });
};

//Get day name by number (id)
export const dayName = (d: number) => {
    const days = [
        "Chủ Nhật",
        "Thứ Hai",
        "Thứ Ba",
        "Thứ Tư",
        "Thứ Năm",
        "Thứ Sáu",
        "Thứ Bảy"
    ];

    return days[d];
};

//Function to capitalize first letter of a string
export const capFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
