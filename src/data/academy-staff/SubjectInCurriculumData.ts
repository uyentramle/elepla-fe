export interface ISubjectInCurriculum {
    id: string;
    name: string;
    description: string | undefined;
    subject_id: string;
    subject_name: string;
    curriculum_id: string;
    curriculum_name: string;
    grade_id: string;
    grade_name: string;
}

const SubjectInCurriculumData: ISubjectInCurriculum[] = [
    {
        id: '1',
        name: 'Kết nối tri thức Toán lớp 10',
        description: 'Kết nối tri thức Toán lớp 10',
        subject_id: '1',
        subject_name: 'Toán',
        curriculum_id: '1',
        curriculum_name: 'Kết nối tri thức',
        grade_id: '10',
        grade_name: '10',
    },
    {
        id: '2',
        name: 'Kết nối tri thức Văn lớp 10',
        description: 'Kết nối tri thức Văn lớp 10',
        subject_id: '2',
        subject_name: 'Văn',
        curriculum_id: '1',
        curriculum_name: 'Kết nối tri thức',
        grade_id: '10',
        grade_name: '10',
    },
    {
        id: '3',
        name: 'Kết nối tri thức Toán lớp 11',
        description: 'Kết nối tri thức Toán lớp 11',
        subject_id: '1',
        subject_name: 'Toán',
        curriculum_id: '1',
        curriculum_name: 'Kết nối tri thức',
        grade_id: '11',
        grade_name: '11',
    },
    {
        id: '4',
        name: 'Kết nối tri thức Văn lớp 11',
        description: 'Kết nối tri thức Văn lớp 11',
        subject_id: '2',
        subject_name: 'Văn',
        curriculum_id: '1',
        curriculum_name: 'Kết nối tri thức',
        grade_id: '11',
        grade_name: '11',
    },
];

export default SubjectInCurriculumData;