export interface SubjectInCurriculumItem {
    curriculumId : string;
    gradeId : string;
    subjectInCurriculumId: string;
    subject: string;   
}

const SubjectInCurriculum_data: SubjectInCurriculumItem[] = [
    {
        curriculumId: "C1",  // "cánh diều"
        gradeId: "b9070f37-0002-41fb-a202-edf7f22603b6",  // "Lớp 10"
        subjectInCurriculumId: "SC1",
        subject: "Toán học",
    },
    {
        curriculumId: "C2",  // "chân trời sáng tạo"
        gradeId: "G2",       // "Lớp 11"
        subjectInCurriculumId: "SC2",
        subject: "Vật Lý",
    },
    {
        curriculumId: "C3",  // "kết nối tri thức"
        gradeId: "G3",       // "Lớp 12"
        subjectInCurriculumId: "SC3",
        subject: "Lịch Sử",
    },
];
export default SubjectInCurriculum_data;
