export interface IServicePackage {
    packageId: string;
    packageName: string;
    description: string;
    price: number;
    discount: number;
    duration: number;
    maxPlanbook: number;

    createdAt: Date;
    createdBy: string;
    updatedAt: Date | null;
    updatedBy: string | null;
    deletedAt: Date | null;
    deletedBy: string | null;
    isDelete: boolean;
}

const service_packages_data: IServicePackage[] = [
    {
        packageId: "1",
        packageName: "Gói miễn phí",
        description: "Gói dịch vụ miễn phí",
        price: 0,
        discount: 0,
        duration: 0,
        maxPlanbook: 0,
        createdAt: new Date(),
        createdBy: "Admin",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
    {
        packageId: "2",
        packageName: "Gói cơ bản",
        description: "Gói dịch vụ cơ bản",
        price: 100000,
        discount: 0,
        duration: 30,
        maxPlanbook: 5,
        createdAt: new Date(),
        createdBy: "Admin",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
    {
        packageId: "3",
        packageName: "Gói cao cấp",
        description: "Gói dịch vụ cao cấp",
        price: 200000,
        discount: 0,
        duration: 30,
        maxPlanbook: 10,
        createdAt: new Date(),
        createdBy: "Admin",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
    },
];

export default service_packages_data;