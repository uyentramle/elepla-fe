
export interface ICategory {
    categoryId: string;
    name: string;
    url: string;
    description: string;
    status: boolean;
    thumb: string;

    createdAt: Date;
    createdBy: string;
    updatedAt: Date | null;
    updatedBy: string | null;
    deletedAt: Date | null;
    deletedBy: string | null;
    isDelete: boolean;
}

const category_data: ICategory[] = [
    {
        categoryId: "1",
        name: 'React',
        url: 'react',
        description: 'ReactJS is a JavaScript library for building user interfaces.',
        status: true,
        thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png',

        createdAt: new Date(),
        createdBy: 'Admin',
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
    {
        categoryId: "2",
        name: 'NodeJS',
        url: 'nodejs',
        description: 'Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser.',
        status: true,
        thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1280px-Node.js_logo.svg.png',

        createdAt: new Date(),
        createdBy: 'Admin',
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
    {
        categoryId: "3",
        name: 'TypeScript',
        url: 'typescript',
        description: 'TypeScript is a strongly typed, object oriented, compiled language. It was designed by Anders Hejlsberg (designer of C#) at Microsoft.',
        status: true,
        thumb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1280px-Typescript_logo_2020.svg.png',

        createdAt: new Date(),
        createdBy: 'Admin',
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
];

export default category_data;