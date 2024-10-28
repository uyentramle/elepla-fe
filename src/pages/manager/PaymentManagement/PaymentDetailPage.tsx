import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Empty, Typography } from "antd";
import data_payments, { IUserPayment } from "@/data/manager/UserPaymentData";
import payment_history_data, { PaymentHistory } from "@/data/client/PaymentHistoryData";


const { Title } = Typography;

const PaymentDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [payments, setPayments] = useState<PaymentHistory[]>([]);
    const [payment, setPayment] = useState<IUserPayment | null>(null);

    useEffect(() => {
        if (id) {
            const paymentDetail = data_payments.find((payment) => payment.paymentId === id);
            if (paymentDetail) {
                setPayment(paymentDetail);
            }
            setPayments(payment_history_data);
        }
    }, [id]);

    return (
        <>
            <Title level={2} className="my-4">Chi tiết thanh toán</Title>

            <div className="bg-white rounded shadow-md p-6">
                <div className="mb-8">
                    <b className="text-gray-800">Phương thức thanh toán</b>
                    <div className="mt-2 text-lg text-gray-600">VNPay</div>
                </div>
                <div className="mb-8">
                    <b className="text-gray-800">Thông tin thanh toán</b>
                    <div className="mt-2 text-lg text-gray-600">{payment?.username}</div>
                    <div className="text-gray-600">01 Song Hành, Thủ Đức, Hồ Chí Minh, Việt Nam</div>
                </div>
                <div className="mb-8">
                    <b className="text-gray-800">Thông tin gói dịch vụ</b>
                    <div className="mt-2 text-lg text-gray-600">{payment?.packageName}</div>
                    <div className="text-gray-600">Thời gian sử dụng: {payment?.paymentDate?.toLocaleDateString()}</div>
                </div>
            </div>

            <div className="bg-white rounded shadow-md p-6 mt-6">
                <Title level={3} className="pb-4">Lịch sử thanh toán cũ hơn</Title>

                {payments.length === 0 ? (
                    <Empty description="Không có lịch sử thanh toán" />
                ) : (
                    <div className="space-y-4">
                        {payments.map((payment, index) => (
                            <div key={index} className="flex items-center justify-between border-b pb-3">
                                <div className="flex flex-col">
                                    <span className="text-gray-800">Ngày thanh toán:</span>
                                    <span className="text-gray-600">{payment.date}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-800">Số hóa đơn:</span>
                                    <span className="text-gray-600">{payment.invoice}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-semibold text-green-600">{payment.amount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Button type="primary" className="mt-6" onClick={() => window.history.back()}>Quay lại</Button>
        </>
    );
};

export default PaymentDetailPage;