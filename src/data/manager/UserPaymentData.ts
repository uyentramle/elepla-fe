import apiClient from '@/data/apiClient';

export interface IViewListPayment {
    paymentId: string;
    totalAmount: number;
    status: string;
    userId: string;
    fullName: string; // cần API BE thêm filed này
    packageName: string;
    // transactionCode: string; 
    paymentDate: Date;
}

export const fetchListPayment = async (): Promise<IViewListPayment[]> => {
    try {
        const response = await apiClient.get('Payment/GetAllUserPaymentHistory/GetAllPayments', {
            params: {
                pageIndex: 0,
                pageSize: 100,
            },
        });
        const payment = response.data.data.items.map((item: any) => ({
            paymentId: item.paymentId,
            totalAmount: item.totalAmount,
            status: item.status,
            userId: item.teacherId,
            fullName: item.fullName,
            packageName: item.packageName,
            paymentDate: item.createdAt,
        }));
        return payment;
    } catch (error) {
        console.error('Failed to fetch list payment:', error);
        return [];
    }
};

export interface IViewDetailPayment {
    paymentId: string;
    totalAmount: number;
    status: string;
    userId: string;
    fullName: string; // cần API BE thêm filed này
    packageName: string;
    packageDescription: string;
    paymentDate: Date;
}

export const fetchPaymentDetail = async (paymentId: string): Promise<IViewDetailPayment | null> => {
    try {
        const response = await apiClient.get(`Payment/GetPaymentDetails/${paymentId}`);
        const item = response.data.data;
        return {
            paymentId: item.paymentId,
            totalAmount: item.totalAmount,
            status: item.status,
            userId: item.teacherId,
            fullName: item.fullName,
            packageName: item.packageName,
            packageDescription: item.packageDescription,
            paymentDate: item.createdAt,
        };
    } catch (error) {
        console.error('Failed to fetch detail payment:', error);
        return null;
    }
};

export const fetchUserPaymentHistory = async (userId: string): Promise<IViewListPayment[]> => {
    try {
        const response = await apiClient.get(`Payment/GetUserPaymentHistory/history/${userId}`, {
            params: {
                pageIndex: 0,
                pageSize: 20,
            },
        });
        const payment = response.data.data.items.map((item: any) => ({
            paymentId: item.paymentId,
            totalAmount: item.totalAmount,
            status: item.status,
            userId: item.teacherId,
            fullName: item.fullName,
            packageName: item.packageName,
            paymentDate: item.createdAt,
        }));
        return payment;
    } catch (error) {
        console.error('Failed to fetch user payment history:', error);
        return [];
    }
};

export const fetchRevenueByMonth = async (year: number): Promise<any[]> => {
    try {
        const response = await apiClient.get(`Payment/GetRevenueByMonth/RevenueByMonth/${year}`);
        const revenue = response.data.data;
        return revenue;
    } catch (error) {
        console.error('Failed to fetch revenue by month:', error);
        return [];
    }
};

export const fetchRevenueByQuarter = async (year: number): Promise<any[]> => {
    try {
        const response = await apiClient.get(`Payment/GetRevenueByQuarter/RevenueByQuarter/${year}`);
        const revenue = response.data.data;
        return revenue;
    } catch (error) {
        console.error('Failed to fetch revenue by quarter:', error);
        return [];
    }
};

export const fetchRevenueByYear = async (): Promise<any[]> => {
    try {
        const response = await apiClient.get('Payment/GetRevenueByYear/RevenueByYear');
        const revenue = response.data.data;
        return revenue;
    } catch (error) {
        console.error('Failed to fetch revenue by year:', error);
        return [];
    }
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export interface IUserPayment {
    paymentId: string;
    userId: string;
    username: string;
    packageId: string;
    packageName: string;
    totalAmount: number;
    transactionCode?: string;
    paymentDate: Date;
    status: string;
}

const payment_data: IUserPayment[] = [
    {
        paymentId: "1",
        userId: "1",
        username: "Nguyen Van A",
        packageId: "1",
        packageName: "Gói cao cấp",
        totalAmount: 500000,
        transactionCode: "123456",
        paymentDate: new Date('2024-09-15'),
        status: "Thành công",
    },
    {
        paymentId: "2",
        userId: "2",
        username: "Nguyen Van B",
        packageId: "2",
        packageName: "Gói cơ bản",
        totalAmount: 100000,
        transactionCode: "123457",
        paymentDate: new Date('2024-09-14'),
        status: "Thành công",
    },
    {
        paymentId: "3",
        userId: "3",
        username: "Nguyen Van C",
        packageId: "3",
        packageName: "Gói cao cấp",
        totalAmount: 500000,
        transactionCode: "123458",
        paymentDate: new Date('2024-10-14'),
        status: "Thành công",
    },
    {
        paymentId: "4",
        userId: "4",
        username: "Nguyen Van D",
        packageId: "4",
        packageName: "Gói cơ bản",
        totalAmount: 100000,
        transactionCode: "123459",
        paymentDate: new Date('2024-10-15'),
        status: "Thành công",
    }
];

export default payment_data;