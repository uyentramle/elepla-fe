// PackageData.ts 
import apiClient from '@/data/apiClient';

export interface IPackageItem {
   packageId: string;
   packageName: string;
   description: string | null;
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

export const getAllServicePackages = async (pageIndex: number, pageSize: number): Promise<IPackageItem[]> => {
   try {
      const response = await apiClient('/ServicePackage/GetAllServicePackages', {
         params: {
            pageIndex,
            pageSize
         },
         headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
         }
      });

      const servicePackages = response.data.data.items
         .filter((servicePackage: any) => servicePackage.isDeleted === false)
         .map((servicePackage: any) => ({
            packageId: servicePackage.packageId,
            packageName: servicePackage.packageName,
            description: servicePackage.description,
            useTemplate: servicePackage.useTemplate,
            useAI: servicePackage.useAI,
            exportWord: servicePackage.exportWord,
            exportPdf: servicePackage.exportPdf,
            price: servicePackage.price,
            discount: servicePackage.discount,
            startDate: servicePackage.startDate,
            endDate: servicePackage.endDate,
            maxLessonPlans: servicePackage.maxLessonPlans,
         }));

      return servicePackages;
   } catch (error) {
      console.error('Error searching service package:', error);
      return [];
   }
};












interface PackageItem {
   id: number;
   name: string,
   price: string,
   description: string,
   schoolyear: string,
}[];

const package_data: PackageItem[] = [
   {
      id: 1,
      name: 'Gói miễn phí',
      price: '0 VND',
      description: 'Quản lý 1 kế hoạch giảng dạy trong 1 niên khóa của 1 môn học',
      schoolyear: 'Năm học 2024-2025',
   },
   {
      id: 2,
      name: 'Gói cơ bản',
      price: '299.000 VND',
      description: 'Quản lý kế hoạch giảng dạy của 1 môn học trong 1 niên khóa',
      schoolyear: 'Năm học 2024-2025',
   },
   {
      id: 3,
      name: 'Gói cao cấp',
      price: '1.499.000 VND',
      description: 'Quản lý kế hoạch giảng dạy của 1 môn học trong 1 niên khóa',
      schoolyear: 'Năm học 2024-2025',
   },
];
export default package_data;
