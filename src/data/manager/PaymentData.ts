import apiClient from "../apiClient";

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

export interface Payment {
    paymentId: string;
    userId: string;
    fullName: string;
    paymentMethod: string;
    totalAmount: number;
    status: string;
    packageName: string;
    createdAt: string;
}

export interface PaymentLink {
    paymentId: string;
    paymentUrl: string;
    qrCodeUrl: string;
}

export interface PaymentDetail {
    paymentId: string;
    userId: string;
    fullName: string;
    paymentMethod: string;
    totalAmount: number;
    status: string;
    packageName: string;
    createdAt: string;
    addressText: string;
    packageDescription: string;
    price: number;
    discount: number;
}

export const createPaymentLink = async (userId: string, packageId: string): Promise<PaymentLink> => {
    try {
        const response = await apiClient.post('Payment/CreatePaymentLink', {
            userId,
            packageId
        });
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error creating payment link:', error);
        throw error;
    }
}

export const updatePaymentStatus = async (paymentId: string, status: string): Promise<string> => {
    try {
        const response = await apiClient.put('Payment/UpdatePaymentStatus', {
            paymentId,
            status
        });
        if (response.data.success) {
            return response.data.message;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error updating payment status:', error);
        throw error;
    }
}

export const getAllPaymentByUserId = async (teacherId: string, pageIndex: number, pageSize: number): Promise<ApiResponse<Payment[]>> => {
    try {
        const response = await apiClient.get('Payment/GetAllPaymentByUserId', {
            params: {
                teacherId,
                pageIndex,
                pageSize
            }
        });
        if (response.data.success) {
            console.log(response.data);
            return response.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error getting all payment:', error);
        throw error;
    }
}

export const getPaymentById = async (paymentId: string): Promise<PaymentDetail> => {
    try {
        const response = await apiClient.get('Payment/GetPaymentById', {
            params: {
                paymentId
            }
        });
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error getting payment by id:', error);
        throw error;
    }
}