// WeeklySchedule.tsx
import { useState, useEffect } from "react";
import { Modal } from "antd";
import { now, months, capFirstLetter, monthName, dayName, SelectedDay } from "@/utils/GetDays";
import Day from "./Day";
import { ArrowLeftOutlined, ArrowRightOutlined, CalendarOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { Button } from "antd";
import { Link } from "react-router-dom";
import event_data, { IViewSchedule } from '@/data/client/ScheduleData';

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
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<IViewSchedule | null>(null);

    // Set initial selected date to today
    useEffect(() => {
        setSelected({ date: now.date, month: now.month, year: now.year });
    }, []);

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

    // Xử lý khi click vào sự kiện
    const handleEventClick = (event: IViewSchedule): void => {
        setSelectedEvent(event);
        setIsModalVisible(true);
    };

    // Đóng modal
    const handleModalClose = (): void => {
        setIsModalVisible(false);
        setSelectedEvent(null);
    };

    return (
        <div className="mb-10 w-full max-w-6xl mx-auto p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <Link to="/teacher/schedule/create">
                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                    >
                        Thêm sự kiện
                    </Button>
                </Link>
                <ArrowLeftOutlined
                    onClick={() => navigate(false)}
                    className="text-xl cursor-pointer p-2 hover:bg-blue-200 rounded"
                />
                <h1 className="text-xl font-semibold">
                    {capFirstLetter(monthName(days[0].month() + 1))} {days[0].year()}
                </h1>
                <ArrowRightOutlined
                    onClick={() => navigate(true)}
                    className="text-xl cursor-pointer p-2 hover:bg-blue-200 rounded"
                />
                <Button
                    // className="ml-4 px-4 py-2 rounded-lg flex items-center"
                    type="default"
                    icon={<CalendarOutlined />}
                    onClick={reset}
                >
                    Hôm nay
                </Button>
            </div>
            <div className="flex justify-evenly">
                {days.map((day) => {
                    // Lọc sự kiện cho từng ngày
                    const eventsForDay = event_data.filter((event) => {
                        const eventDate = dayjs(event.date, "DD/MM/YYYY");
                        return (
                            eventDate.date() === day.date() &&
                            eventDate.month() === day.month() &&
                            eventDate.year() === day.year()
                        );
                    });

                    return (
                        <Day
                            key={day.date()} // Đảm bảo sử dụng key duy nhất cho mỗi ngày
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
                            events={eventsForDay} // Truyền danh sách sự kiện cho ngày đó
                            onEventClick={handleEventClick} // Truyền hàm xử lý vào Day
                        />
                    );
                })}
            </div>

            {/* Modal hiển thị thông tin chi tiết */}
            {selectedEvent && (
                <Modal
                    title="Thông tin sự kiện"
                    visible={isModalVisible}
                    onCancel={handleModalClose}
                    footer={null}
                >
                    <div className="py-2">
                        <p><strong>Tiêu đề:</strong> {selectedEvent.title}</p>
                        <p><strong>Ngày:</strong> {selectedEvent.date}</p>
                        <p><strong>Thời gian:</strong> {selectedEvent.startTime} - {selectedEvent.endTime}</p>
                        <p><strong>Lớp học:</strong> {selectedEvent.className}</p>
                        <p><strong>Mô tả:</strong> {selectedEvent.description}</p>
                    </div>

                    <Link to={`/teacher/schedule/edit/${selectedEvent.id}`}>
                        <Button type="default" icon={<EditOutlined />} className="mt-4" >Chỉnh sửa</Button>
                    </Link>
                </Modal>
            )}
        </div>
    );
};

export default WeeklySchedule;
