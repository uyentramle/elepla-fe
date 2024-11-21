export interface LessonItem {
    chapterId : string;
    lessonId: string;
    name: string,
}
const Lesson_data: LessonItem[] = [
    {
        chapterId: "CH1", // Liên kết với chương "Số học cơ bản" trong môn Toán học
        lessonId: "L1",
        name: "Phép cộng và phép trừ",
    },
    {
        chapterId: "CH1", // Liên kết với chương "Số học cơ bản" trong môn Toán học
        lessonId: "L2",
        name: "Phép nhân và phép chia",
    },
    {
        chapterId: "CH2", // Liên kết với chương "Động lực học" trong môn Vật Lý
        lessonId: "L3",
        name: "Các định luật Newton",
    },
    {
        chapterId: "CH2", // Liên kết với chương "Động lực học" trong môn Vật Lý
        lessonId: "L4",
        name: "Lực hấp dẫn",
    },
    {
        chapterId: "CH3", // Liên kết với chương "Cách mạng công nghiệp" trong môn Lịch Sử
        lessonId: "L5",
        name: "Nguyên nhân và bối cảnh lịch sử",
    },
    {
        chapterId: "CH3", // Liên kết với chương "Cách mạng công nghiệp" trong môn Lịch Sử
        lessonId: "L6",
        name: "Những tiến bộ khoa học kỹ thuật",
    },
];
export default Lesson_data;
