export interface ISubject {
    id: string;
    name: string;
    description: string | undefined;
    is_approved: boolean;
}

const SubjectData: ISubject[] = [
    {
        id: '1',
        name: 'Toán',
        description: 'Môn học về toán học',
        is_approved: true
    },
    {
        id: '2',
        name: 'Văn',
        description: '',
        is_approved: true
    },
    
];

export default SubjectData;