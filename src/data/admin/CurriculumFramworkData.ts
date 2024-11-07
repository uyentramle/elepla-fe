export interface ICurriculumFramework {
    id: string;
    name: string;
    subject: string;
    grade: string;
    updatedAt: string;
}

const curriculumData: ICurriculumFramework[] = [
    {
        id: '1',
        name: 'Toán lớp 10',
        subject: 'Toán',
        grade: '10',
        updatedAt: '2024-10-01',
    },
    {
        id: '2',
        name: 'Văn học lớp 11',
        subject: 'Văn học',
        grade: '11',
        updatedAt: '2024-09-15',
    },
];

export default curriculumData;