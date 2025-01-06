// UserPackageData.ts
import apiClient from '@/data/apiClient';

export interface IViewListUserPackage {
    userPackageId: string;
    userId: string;
    fullName: string;
    packageId: string;
    packageName: string;
    useTemplate: boolean;
    useAI: boolean;
    exportWord: boolean;
    exportPDF: boolean;
    price: number;
    discount: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    paymentStatus: string;
    paymentUrl: string;

    created_at: string;
    created_by: string;
    updated_at: string | undefined;
    updated_by: string | undefined;
    deleted_at: string | undefined;
    deleted_by: string | undefined;
    isDelete: boolean;
}

export const fetchUserPackageList = async (): Promise<IViewListUserPackage[]> => {
    try {
        const response = await apiClient.get(`/UserPackage/GetAllUserPackages`, {
            params: {
                pageIndex: 0,
                pageSize: 999,
            },
        });
        const userPackage = response.data.data.items.map((item: any) => ({
            userPackageId: item.userPackageId,
            userId: item.userId,
            fullName: item.fullName,
            packageId: item.packageId,
            packageName: item.packageName,
            useTemplate: item.useTemplate,
            useAI: item.useAI,
            exportWord: item.exportWord,
            exportPDF: item.exportPDF,
            price: item.price,
            discount: item.discount,
            startDate: item.startDate,
            endDate: item.endDate,
            isActive: item.isActive,
            paymentStatus: item.paymentStatus,
            paymentUrl: item.paymentUrl,

            created_at: item.createdAt,
            created_by: item.createdBy || '',
            updated_at: item.updatedAt || undefined,
            updated_by: item.updatedBy || undefined,
            deleted_at: item.deletedAt || undefined,
            deleted_by: item.deletedBy || undefined,
            isDelete: item.isDelete,
        }));
        return userPackage;
    } catch (error) {
        console.error('Failed to fetch user package:', error);
        return [];
    }
};

export const fetchUserPackageDetail = async (userPackageId: string): Promise<IViewListUserPackage | null> => {
    try {
        const response = await apiClient.get(`/UserPackage/GetUserPackageById?userPackageId=${userPackageId}`);
        const item = response.data.data;
        return {
            userPackageId: item.userPackageId,
            userId: item.userId,
            fullName: item.fullName,
            packageId: item.packageId,
            packageName: item.packageName,
            useTemplate: item.useTemplate,
            useAI: item.useAI,
            exportWord: item.exportWord,
            exportPDF: item.exportPDF,
            price: item.price,
            discount: item.discount,
            startDate: item.startDate,
            endDate: item.endDate,
            isActive: item.isActive,
            paymentStatus: item.paymentStatus,
            paymentUrl: item.paymentUrl,

            created_at: item.createdAt,
            created_by: item.createdBy || '',
            updated_at: item.updatedAt || undefined,
            updated_by: item.updatedBy || undefined,
            deleted_at: item.deletedAt || undefined,
            deleted_by: item.deletedBy || undefined,
            isDelete: item.isDelete,
        };
    } catch (error) {
        console.error('Failed to fetch user package:', error);
        return null;
    }
};

export const deactiveExpiredUserPackages = async (): Promise<boolean> => {
    try {
        const response = await apiClient.put(`UserPackage/DeactivateExpiredUserPackages`);
        if  (response.data.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Failed to deactive expired user packages:', error);
        return false;
    }
};











////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
        packageId: "3",
        packageName: "Gói cao cấp",
        startDate: new Date('2024-09-15'),
        endDate: new Date(new Date('2024-09-15').setFullYear(new Date('2024-09-15').getFullYear() + 1)),
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
        startDate: new Date('2024-09-14'),
        endDate: new Date('2025-09-14'),
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
        id: 3,
        userId: "3",
        username: "Nguyen Van C",
        packageId: "3",
        packageName: "Gói cao cấp",
        startDate: new Date('2024-10-14'),
        endDate: new Date('2025-10-14'),
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
        id: 4,
        userId: "4",
        username: "Nguyen Van D",
        packageId: "1",
        packageName: "Gói miễn phí",
        startDate: new Date('2024-10-14'),
        endDate: new Date('2025-10-14'),
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
        id: 5,
        userId: "5",
        username: "Nguyen Van E",
        packageId: "1",
        packageName: "Gói miễn phí",
        startDate: new Date('2024-10-14'),
        endDate: new Date('2025-10-14'),
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