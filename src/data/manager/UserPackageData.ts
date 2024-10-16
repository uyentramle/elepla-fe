export interface IUserService { 
    id: number;
    userId: string;
    username: string; // khong hien thi id ma hien thi ten
    packageId: string;
    packageName: string; // khong hien thi id ma hien thi ten
    startDate: Date;
    endDate: Date;
    isActivated: boolean;
    
    // createdAt: Date;
    // createdBy: string;
    // updatedAt: Date | null;
    // updatedBy: string | null;
    // deletedAt: Date | null;
    // deletedBy: string | null;
    // isDelete: boolean;
}

const user_services_data: IUserService[] = [
    {
        id: 1,
        userId: "1",
        username: "Nguyen Van A",
        packageId: "1",
        packageName: "Gói miễn phí",
        startDate: new Date(),
        endDate: new Date(),
        isActivated: true,
        // createdAt: new Date(),
        // createdBy: "Admin",
        // updatedAt: null,
        // updatedBy: null,
        // deletedAt: null,
        // deletedBy: null,
        // isDelete: false,
    },
    {
        id: 2,
        userId: "2",
        username: "Nguyen Van B",
        packageId: "2",
        packageName: "Gói cơ bản",
        startDate: new Date(),
        endDate: new Date(),
        isActivated: true,
        // createdAt: new Date(),
        // createdBy: "Admin",
        // updatedAt: null,
        // updatedBy: null,
        // deletedAt: null,
        // deletedBy: null,
        // isDelete: false,
    }
];

export default user_services_data;