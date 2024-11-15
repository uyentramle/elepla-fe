export interface ChapterItem {
    chapterId : string;
    subjectInCurriculumId: string;
    name: string,
    description: string,
    
}

const Chapter_data: ChapterItem[] = [
    {
        chapterId: "CH1",
        subjectInCurriculumId: "SC1", // Liên kết với môn Toán học trong "cánh diều" - Lớp 10
        name: "Số học cơ bản",
        description: "Giới thiệu về các khái niệm cơ bản trong số học, bao gồm các phép toán số học và phân tích số.",
    },
    // {
    //     chapterId: "CH2",
    //     subjectInCurriculumId: "SC2", // Liên kết với môn Vật Lý trong "chân trời sáng tạo" - Lớp 11
    //     name: "Động lực học",
    //     description: "Nghiên cứu về chuyển động và các lực tác động lên vật thể, bao gồm các định luật Newton.",
    // },
    // {
    //     chapterId: "CH3",
    //     subjectInCurriculumId: "SC3", // Liên kết với môn Lịch Sử trong "kết nối tri thức" - Lớp 12
    //     name: "Cách mạng công nghiệp",
    //     description: "Phân tích sự phát triển của cách mạng công nghiệp và tác động của nó đến xã hội loài người.",
    // },
];
export default Chapter_data;
