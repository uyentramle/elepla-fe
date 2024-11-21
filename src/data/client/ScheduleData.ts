//ScheduleData.ts

export interface IScheduleForm {
    id: string | undefined;
    title: string;
    description: string | undefined;
    date: string;
    startTime: string;
    endTime: string;
    className: string | undefined;
    planbookId: string | undefined;
}

export interface IViewSchedule {
    id: string;
    title: string;
    description: string | undefined;
    date: string;
    startTime: string;
    endTime: string;
    className: string | undefined;
    teacher: string;
    planbookId: string | undefined;
    planbookTitle: string | undefined;
}

const event_data: IViewSchedule[] = [
    {
        id: "1",
        title: "Math Class",
        description: "Trigonometry lesson",
        date: "18/11/2024",
        startTime: "09:00",
        endTime: "10:30",
        className: "Math",
        teacher: "Mr. A",
        planbookId: "123",
        planbookTitle: "Math 10",
    },
    {
        id: "2",
        title: "English Class",
        description: "Reading lesson",
        date: "19/11/2024",
        startTime: "10:30",
        endTime: "12:00",
        className: "English",
        teacher: "Mr. B",
        planbookId: "124",
        planbookTitle: "English 10",
    },
    {
        id: "3",
        title: "Physics Class",
        description: "Mechanics lesson",
        date: "21/11/2024",
        startTime: "13:00",
        endTime: "14:30",
        className: "Physics",
        teacher: "Mr. C",
        planbookId: "125",
        planbookTitle: "Physics 10",
    },
    {
        id: "4",
        title: "Chemistry Class",
        description: "Chemical reactions lesson",
        date: "25/11/2024",
        startTime: "14:30",
        endTime: "16:00",
        className: "Chemistry",
        teacher: "Mr. D",
        planbookId: "126",
        planbookTitle: "Chemistry 10",
    },
    {
        id: "5",
        title: "Biology Class",
        description: "Human body lesson",
        date: "26/11/2024",
        startTime: "16:00",
        endTime: "17:30",
        className: "Biology",
        teacher: "Mr. E",
        planbookId: "127",
        planbookTitle: "Biology 10",
    },
    {
        id: "fgd3",
        title: "Physics Class",
        description: "Mechanics lesson",
        date: "21/11/2024",
        startTime: "15:00",
        endTime: "16:30",
        className: "Physics",
        teacher: "Mr. C",
        planbookId: "125",
        planbookTitle: "Physics 10",
    },
    {
        id: "2sgsd",
        title: "English Class",
        description: "Reading lesson",
        date: "21/11/2024",
        startTime: "10:30",
        endTime: "12:00",
        className: "English",
        teacher: "Mr. B",
        planbookId: "124",
        planbookTitle: "English 10",
    },
];

export default event_data;