import apiClient from '@/data/apiClient';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: {
      totalItemsCount: number;
      pageSize: number;
      totalPagesCount: number;
      pageIndex: number;
      next: boolean;
      previous: boolean;
      items: T;
    };
  }

  export interface ServicePackage {
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


  export const getActiveUserPackageByUserId = async (userId: string): Promise<ServicePackage> => {
    try {
      const response = await apiClient('UserPackage/GetActiveUserPackageByUserId', {
        params: {
          userId
        },
      });
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error getting user package:', error);
      throw error;
    }
  }

  export interface UserPackage {
    userPackageId: string;
    userId: string;
    fullName: string;
    packageId: string;
    packageName: string;
    useTemplate: boolean;
    useAI: boolean;
    exportWord: boolean;
    exportPdf: boolean;
    price: number;
    discount: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    paymentStatus: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedAt: string;
    deletedBy: string;
    isDeleted: boolean;
  }

    export const getUserPackagesByUserId = async (userId: string): Promise<ApiResponse<UserPackage[]>> => {
        try {
        const response = await apiClient('UserPackage/GetUserPackagesByUserId', {
            params: {
                userId
            },
        });
        if (response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data.message);
        }
        } catch (error) {
        console.error('Error getting user packages:', error);
        throw error;
        }
    }

  