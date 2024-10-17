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
    }
];

export default payment_data;