import React, { useState, useEffect } from "react";
import { Modal, Button, message,Popconfirm  } from "antd";
import { MessageOutlined, ArrowLeftOutlined, ArrowRightOutlined, CalendarOutlined, EditOutlined, PlusOutlined,DeleteOutlined } from "@ant-design/icons";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { now, months, SelectedDay, dayName, monthName, capFirstLetter } from "@/utils/GetDays";
import { fetchTeachingSchedules, IViewSchedule } from "@/data/client/ScheduleData";
import Day from "./Day"; 
import { deleteTeachingSchedule } from "@/data/client/ScheduleData";
import PlanbookDetailCalendar from './PlanbookDetailCalendar';


interface WeeklyScheduleProps {
    events: IViewSchedule[];
    updateEvents: (updatedEvents: IViewSchedule[]) => void;
    loading: boolean;
}

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);


let index: number = now.weekOfMonth;
let month: number = now.month;
let unselected: SelectedDay = {
    date: -1,
    month: -1,
    year: -1,
};


const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ events, updateEvents }) => {
    const [days, setDays] = useState<Dayjs[]>(months()[now.weekOfMonth]);
    const [selected, setSelected] = useState<SelectedDay>(unselected);
    // const [events, setEvents] = useState<IViewSchedule[]>([]); // Events fetched from API
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<IViewSchedule | null>(null);
    const [isPlanbookModalVisible, setIsPlanbookModalVisible] = useState(false);
    const [selectedPlanbookId, setSelectedPlanbookId] = useState<string | null>(null);

    useEffect(() => {
        const loadEvents = async () => {
        setError(null);
          setIsLoading(true);
          try {
            const data = await fetchTeachingSchedules();      
            const fixedEvents = data.map(event => ({
              ...event,
              date: dayjs.utc(event.date).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD"),
            }));
            updateEvents(fixedEvents);
          } catch (error) {
            console.error("Error fetching events", error);
          } finally {
            setIsLoading(false);
          }
        };
        loadEvents();
      }, []);

    // Set initial selected date to today
    useEffect(() => {
        setSelected({ date: now.date, month: now.month, year: now.year });
    }, []);

    // Function to set selected date state
    const selectDay = (d: number, m: number, y: number): void => {
        if (d === selected.date && m === selected.month && y === selected.year) {
            setSelected(unselected);
            return;
        }
        setSelected({ date: d, month: m, year: y });
    };

    // Function to navigate between weeks
    const navigate = (nav: boolean): void => {
        if (nav) {
            index++;
            if (index > 4) {
                index = 0;
                month++;
                if (days[0].date() === months(month)[index][0].date()) {
                    index++;
                }
            }
        } else {
            index--;
            if (index < 0) {
                index = 4;
                month--;
                if (days[0].date() === months(month)[index][0].date()) {
                    index--;
                }
            }
        }
        setDays(months(month)[index]);
    };

    // Reset to today
    const reset = (): void => {
        setDays(months()[now.weekOfMonth]);
        index = now.weekOfMonth;
        month = now.month;
    };

    // Handle event click
    const handleEventClick = (event: IViewSchedule): void => {
        setSelectedEvent(event);
        setIsModalVisible(true);
    };

    // Close modal
    const handleModalClose = (): void => {
        setIsModalVisible(false);
        setSelectedEvent(null);
    };

    const handleDelete = async (scheduleId: string) => {
        try {
            setIsLoading(true); // Start loading state
            await deleteTeachingSchedule(scheduleId);
            message.success("Sự kiện đã được xóa thành công!");

            // Update events after deletion
            const updatedEvents = events.filter(event => event.id !== scheduleId);
            updateEvents(updatedEvents); // Call the updateEvents function passed via props
        } catch (error: any) {
            message.error(error.message || "Không thể xóa sự kiện. Vui lòng thử lại.");
        } finally {
            setIsLoading(false); // End loading state
        }
    };


    const handlePlanbookView = (planbookId: string | undefined) => {
        if (planbookId) {
            setSelectedPlanbookId(planbookId);
            setIsPlanbookModalVisible(true);
        } else {
            message.warning("Sự kiện này không có kế hoạch bài dạy.");
        }
    };
    
    const closePlanbookModal = () => {
        setIsPlanbookModalVisible(false);
        setSelectedPlanbookId(null);
    };

    return (
        <div className="mb-10 w-full max-w-6xl mx-auto p-6 rounded-lg">
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <span>Đang tải...</span>
                </div>
            ) : error ? (
                <div className="flex items-center justify-center h-64 text-red-500">
                    <span>{error}</span>
                </div>
            ) : (
        <>
            <div className="flex items-center justify-between mb-4">
                <Link to="/teacher/schedule/create">
                    <Button icon={<PlusOutlined />} type="primary">
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
                <Button type="default" icon={<CalendarOutlined />} onClick={reset}>
                    Hôm nay
                </Button>
            </div>
            <div className="flex justify-evenly">
                    {days.map((day) => {
                        // Lọc các sự kiện trong ngày
                        const eventsForDay = events.filter((event) => {
                        const eventDate = dayjs(event.date, "YYYY-MM-DD");
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
                        <Day
                            key={day.toString()}
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
                            events={sortedEvents} // Truyền danh sách sự kiện đã sắp xếp
                            onEventClick={handleEventClick}
                        />
                        );
                    })}
                    </div>
        </>
    )}
            {/* Modal to display event details */}
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
                        <p><strong>Kế hoạch giảng dạy: </strong> {selectedEvent.planbookTitle || "Không có"}</p>
                        <p><strong>Mô tả:</strong></p>
                        <div
                            dangerouslySetInnerHTML={{ __html: selectedEvent.description || "" }}
                            className="description-content"
                        />      
                        <Button
                            type="default"
                            icon={<MessageOutlined />}
                            className="mt-4"
                            onClick={() => handlePlanbookView(selectedEvent?.planbookId)}
                        >
                            Xem chi tiết kế hoạch bài dạy
                        </Button>              
                    </div>
                    <div className="flex justify-between mt-4">
                        <Link to={`/teacher/schedule/edit/${selectedEvent.id}`}>
                            <Button type="default" icon={<EditOutlined />}>
                                Chỉnh sửa
                            </Button>
                        </Link>
                        <Popconfirm
                            title="Bạn có chắc chắn muốn xóa sự kiện này?"
                            onConfirm={() => handleDelete(selectedEvent.id)}
                            okText="Xóa"
                            cancelText="Hủy"
                        >
                        <Link to={`/teacher/schedule/weekly`}>
                            <Button 
                                type="text" 
                                danger 
                                icon={<DeleteOutlined />}
                            >
                                Xóa
                            </Button>
                        </Link>
                        </Popconfirm>
                    </div>
                </Modal>

            )}
                    {isPlanbookModalVisible && selectedPlanbookId && (
                        <Modal
                            title="Chi tiết kế hoạch bài dạy"
                            visible={isPlanbookModalVisible}
                            onCancel={closePlanbookModal}
                            footer={null}
                            width={800} // Đặt kích thước phù hợp
                            maskStyle={{ backgroundColor: 'transparent' }} // Không làm tối nền
                            >
                            <PlanbookDetailCalendar
                                planbookId={selectedPlanbookId}
                                isVisible={isPlanbookModalVisible}
                                onClose={closePlanbookModal}
                                isLibrary={false} // Thay đổi nếu cần
                            />
                            </Modal>
                    )}
        </div>
    );
};

export default WeeklySchedule;
