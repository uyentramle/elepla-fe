// ServicePackageData.ts
import apiClient from '@/data/apiClient';

export interface IViewListServicePackage {
    packageId: string;
    packageName: string;
    description: string;
    useTemplate: boolean;
    useAI: boolean;
    exportWord: boolean;
    exportPdf: boolean;
    price: number;
    discount: number;
    startDate: string;
    endDate: string;
    maxLessonPlans: number;

    created_at: string;
    created_by: string;
    updated_at: string | undefined;
    updated_by: string | undefined;
    deleted_at: string | undefined;
    deleted_by: string | undefined;
    isDelete: boolean;
}

export const fetchServicePackages = async (): Promise<IViewListServicePackage[]> => {
    try {
        const response = await apiClient.get('ServicePackage/GetAllServicePackages', {
            params: {
                pageIndex: 0,
                pageSize: 999,
            },
        });

        const servicePackage = response.data.data.items.map((item: any) => ({
            packageId: item.packageId,
            packageName: item.packageName,
            description: item.description,
            useTemplate: item.useTemplate,
            useAI: item.useAI,
            exportWord: item.exportWord,
            exportPdf: item.exportPdf,
            price: item.price,
            discount: item.discount,
            startDate: item.startDate,
            endDate: item.endDate,
            maxLessonPlans: item.maxLessonPlans,
            created_at: item.createdAt,
            created_by: item.createdBy || '',
            updated_at: item.updatedAt || undefined,
            updated_by: item.updatedBy || undefined,
            deleted_at: item.deletedAt || undefined,
            deleted_by: item.deletedBy || undefined,
            isDelete: item.isDelete,
        }));

        return servicePackage;
    } catch (error) {
        console.error('Failed to fetch service packages:', error);
        return [];
    }
};

export const fetchServicePackage = async (packageId: string): Promise<IViewListServicePackage | null> => {
    try {
        const response = await apiClient.get(`ServicePackage/GetServicePackageById?packageId=${packageId}`);
        const item = response.data.data;
        return {
            packageId: item.packageId,
            packageName: item.packageName,
            description: item.description,
            useTemplate: item.useTemplate,
            useAI: item.useAI,
            exportWord: item.exportWord,
            exportPdf: item.exportPdf,
            price: item.price,
            discount: item.discount,
            startDate: item.startDate,
            endDate: item.endDate,
            maxLessonPlans: item.maxLessonPlans,
            created_at: item.createdAt,
            created_by: item.createdBy || '',
            updated_at: item.updatedAt || undefined,
            updated_by: item.updatedBy || undefined,
            deleted_at: item.deletedAt || undefined,
            deleted_by: item.deletedBy || undefined,
            isDelete: item.isDelete,
        };
    } catch (error) {
        console.error('Failed to fetch service package:', error);
        return null;
    }
};

export const deleteServicePackage = async (packageId: string): Promise<boolean> => {
    try {
        const response = await apiClient.delete(`ServicePackage/DeleteServicePackage/${packageId}`);
        return response.status === 200;
    } catch (error) {
        console.error('Failed to delete service package:', error);
        return false;
    }
};

export interface IServicePackageForm {
    packageId: string | undefined;
    packageName: string;
    description: string;
    useTemplate: boolean;
    useAI: boolean;
    exportWord: boolean;
    exportPdf: boolean;
    price: number;
    discount: number;
    startDate: string;
    endDate: string;
    maxLessonPlans: number;
}

export const createServicePackage = async (data: IServicePackageForm): Promise<boolean> => {
    try {
        const response = await apiClient.post('ServicePackage/AddServicePackage', data);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Failed to create service package:', error);
        return false;
    }
};

export const updateServicePackage = async (data: IServicePackageForm): Promise<boolean> => {
    try {
        const response = await apiClient.put('ServicePackage/UpdateServicePackage', data);
        return response.status === 200 && response.data.success;
    } catch (error) {
        console.error('Failed to update service package:', error);
        return false;
    }
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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