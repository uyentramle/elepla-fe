export interface ICurriculumFramework {
    id: string;
    name: string;
    description: string | undefined;
    is_approved: boolean;
}

const curriculumData: ICurriculumFramework[] = [
    {
        id: '1',
        name: 'Cánh diều',
        description: 'Curriculum Framework 1 Description',
        is_approved: true
    },
    {
        id: '2',
        name: 'Kết nối tri thức',
        description: 'Curriculum Framework 2 Description',
        is_approved: true
    },
    {
        id: '3',
        name: 'Curriculum Framework 3',
        description: 'Curriculum Framework 3 Description',
        is_approved: false
    },
    {
        id: '4',
        name: 'Curriculum Framework 4',
        description: 'Curriculum Framework 4 Description',
        is_approved: false
    },
];

export default curriculumData;