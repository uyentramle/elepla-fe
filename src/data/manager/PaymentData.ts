import apiClient from "../apiClient";

export interface Payment {
    paymentId: string;
    userId: string;
    fullName: string;
    paymentMethod: string;
    totalAmount: number;
    status: string;
    packageName: string;
    createAt: string;
}

export interface PaymentLink {
    paymentId: string;
    paymentUrl: string;
    qrCodeUrl: string;
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