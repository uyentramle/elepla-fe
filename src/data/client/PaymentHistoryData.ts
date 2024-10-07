export interface PaymentHistory {
    date: string;
    invoice: string;
    amount: string;
}

const payment_history_data: PaymentHistory[] = [
    { date: "20/09/2024", invoice: "123456789", amount: "1,000,000 VND" },
    { date: "10/09/2024", invoice: "123475789", amount: "500,000 VND" }
];

export default payment_history_data;