import React, { useEffect, useState } from "react";
import SidebarMenu from "./SidebarMenu";
import { useNavigate } from "react-router-dom";
import { Button, Empty } from "antd";
import payment_history_data, { PaymentHistory } from "@/data/client/PaymentHistoryData";

const PaymentHistoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [payments, setPayments] = useState<PaymentHistory[]>([]);

    const navigateToSignInPage = () => {
        navigate('/sign-in');
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigateToSignInPage();
    };

    useEffect(() => {
        setPayments(payment_history_data);
    }, []);

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex flex-col gap-10 lg:flex-row">
                <SidebarMenu onLogout={handleLogout} />

                <div className="w-full lg:flex-1">
                    {/* Payment Details Section */}
                    <div className="bg-white rounded shadow-md p-6">
                        <nav className="mb-4 flex">
                            <b className="inline-flex items-center rounded-t border-l border-r border-t border-blue-500 px-4 py-2 pb-1.5 text-blue-500">
                                <span className="mr-2">Chi tiết thanh toán</span>
                            </b>
                            <div className="flex-grow border-b border-blue-500"></div>
                        </nav>

                        <div className="mb-8">
                            <b className="text-gray-800">Phương thức thanh toán</b>
                            <div className="mt-2 text-lg text-gray-600">VNPay</div>
                        </div>

                        <div className="mb-8">
                            <b className="text-gray-800">Thông tin thanh toán</b>
                            <div className="mt-2 text-lg text-gray-600">Nguyễn Văn A</div>
                            <div className="text-gray-600">01 Song Hành, Thủ Đức, Hồ Chí Minh, Việt Nam</div>

                            <Button type="primary" className="mt-4" onClick={() => navigate('/teacher/profile')}>
                                Cập nhật thông tin thanh toán
                            </Button>
                        </div>
                    </div>

                    {/* Payment History Section */}
                    <div className="bg-white rounded shadow-md p-6 mt-6">
                        <h3 className="text-xl font-semibold border-b pb-2 mb-4">Lịch sử thanh toán</h3>

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
                </div>
            </div>
        </div>
    );
};

export default PaymentHistoryPage;
