import React, { useEffect, useState } from "react";
import SidebarMenu from "./SidebarMenu";
import { useNavigate } from "react-router-dom";
import { getAllPaymentByUserId, Payment, getPaymentById, PaymentDetail } from "@/data/manager/PaymentData";
import { getUserId } from "@/data/apiClient";

const PaymentHistoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState<string>('');

    const openModal = (paymentId: string) => {
        setSelectedPaymentId(paymentId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPaymentId('');
    };

    const navigateToSignInPage = () => {
        navigate('/sign-in');
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigateToSignInPage();
    };

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await getAllPaymentByUserId(getUserId()!, 0, 10);
                setPayments(response.data.items);
            } catch (error) {
                console.error('Error getting payments:', error);
            }
        }

        fetchPayments();
    }, []);

    return (
        <div className="container mx-auto w-4/5 py-10 px-4">
            <div className="flex flex-col gap-10 lg:flex-row">
                <SidebarMenu onLogout={handleLogout} />
                <div className="w-full lg:flex-1">
                    <div className="rounded bg-white p-4 shadow">
                        <div className="mb-4">
                            <nav className="mb-4 flex">
                                <b className="inline-flex items-center rounded-t border-l border-r border-t border-blue-500 px-4 py-2 pb-1.5 text-blue-500">
                                    <span className="mr-2">Danh sách đơn hàng</span>
                                </b>
                                <div className="flex-grow border-b border-blue-500"></div>
                            </nav>
                            <div className="tab-content">
                                <div className="container">
                                    <table className="w-full table-auto border text-center">
                                        <thead>
                                            <tr className="border-b bg-gray-100">
                                                <th className="py-2">Mã thanh toán</th>
                                                <th className="py-2">Tên gói</th>
                                                <th className="py-2">Ngày tạo</th>
                                                <th className="py-2">Phương thức thanh toán</th>
                                                <th className="py-2">Tổng tiền</th>
                                                <th className="py-2">Trạng thái</th>
                                                <th className="py-2">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payments.map((payment) => (
                                                <tr key={payment.paymentId} className="border-b hover:bg-gray-50">
                                                    <td className="py-2">{payment.paymentId}</td>
                                                    <td className="py-2">{payment.packageName}</td>
                                                    <td className="py-2">
                                                        {/* {new Date(payment.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })} */}
                                                        {new Date(payment.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-2">{payment.paymentMethod}</td>
                                                    <td className="py-2">{formatCurrency(payment.totalAmount)}</td>
                                                    <td className="py-2">
                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs ${getStatusColor(
                                                                payment.status
                                                            )}`}
                                                        >
                                                            {payment.status === "Paid"
                                                                ? "Đã thanh toán"
                                                                : payment.status === "Pending"
                                                                    ? "Đang chờ xử lý"
                                                                    : payment.status === "Failed"
                                                                        ? "Thất bại"
                                                                        : "Không xác định"}
                                                        </span>
                                                    </td>
                                                    <td className="py-2">
                                                        <button
                                                            className="rounded-md bg-blue-400 px-3 py-1 text-xs text-white shadow-md transition-colors duration-300 hover:bg-gray-500"
                                                            onClick={() => openModal(payment.paymentId)}
                                                        >
                                                            Chi tiết
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {payments.length === 0 && (
                                        <div className="py-4 text-gray-500">Chưa có lịch sử thanh toán nào.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <PaymentDetailModal isOpen={isModalOpen} onClose={closeModal} paymentId={selectedPaymentId} />

                {/* <div className="w-full lg:flex-1">
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
                </div> */}
            </div>
        </div>
    );
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "Paid":
            return "bg-green-100 text-green-700";
        case "Pending":
            return "bg-yellow-100 text-yellow-700";
        case "Failed":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);


export default PaymentHistoryPage;


const PaymentDetailModal: React.FC<{ isOpen: boolean, paymentId: string; onClose: () => void }> = ({ isOpen, paymentId, onClose }) => {
    const [paymentDetail, setPaymentDetail] = useState<PaymentDetail | null>(null);
    const [modalClass, setModalClass] = useState('');

    useEffect(() => {
        setModalClass(
            isOpen
                ? 'translate-y-0 transition-all duration-500 ease-in-out'
                : '-translate-y-full transition-all duration-500 ease-in-out',
        );

        if (isOpen && paymentId) {
            fetchOrderDetail(paymentId);
        }
    }, [isOpen, paymentId]);

    const fetchOrderDetail = async (paymentId: string) => {
        try {
            const response = await getPaymentById(paymentId);
            setPaymentDetail(response);
        } catch (error) {
            console.error('Error getting payment detail:', error);
        }
    }


    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEsc);

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? '' : 'hidden'
                }`}
        >
            {/* max-w-[60rem] */}
            <div className={`w-full max-w-screen-lg rounded bg-white p-4 shadow-lg ${modalClass}`}>
                <div className="modal-content">
                    <div className="modal-header text-black">
                        <h5 className="modal-title mb-2 text-center text-xl font-bold">
                            Chi tiết đơn hàng
                        </h5>
                    </div>
                    <div className="modal-body flex text-sm">
                        {/* Left side: Thông tin đơn hàng & Chi tiết sản phẩm */}
                        <div className="w-full md:w-2/3">
                            <div className="mb-4 flex justify-between rounded bg-gray-100 p-4">
                                <div>
                                    <p className="font-bold">
                                        Đơn hàng:{' '}
                                        <span className="font-normal">{paymentDetail?.paymentId}</span>
                                    </p>
                                    <p className="font-bold">
                                        Ngày đặt hàng: <span className="font-normal">
                                            {paymentDetail?.createdAt
                                                ? new Date(paymentDetail.createdAt).toLocaleDateString('vi-VN', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })
                                                : 'Ngày không xác định'}
                                        </span>
                                    </p>

                                </div>
                                <p className="font-bold">
                                    Trạng thái:{' '}
                                    <span className={`rounded-full px-2 py-1 font-normal ${getStatusColor(paymentDetail?.status ?? 'unknown')}`}>
                                        {paymentDetail?.status === "Paid"
                                            ? "Đã thanh toán"
                                            : paymentDetail?.status === "Pending"
                                                ? "Đang chờ xử lý"
                                                : paymentDetail?.status === "Failed"
                                                    ? "Thất bại"
                                                    : "Không xác định"}
                                    </span>
                                </p>

                            </div>
                            <div className="">
                                <div className="mb-4 rounded bg-gray-100 p-4">
                                    <h6 className="mb-4 w-full font-semibold">
                                        KHÁCH HÀNG
                                    </h6>
                                    <p className="mb-2 whitespace-nowrap">
                                        Tên: <span className="font-semibold">{paymentDetail?.fullName}</span>
                                    </p>
                                    <p className="mb-2">
                                        Địa chỉ:{' '}
                                        <span className="font-semibold">
                                            {paymentDetail?.addressText}
                                        </span>
                                    </p>
                                </div>

                            </div>

                            <div className="mt-8">
                                <h6 className="mb-2 font-semibold">
                                    CHI TIẾT SẢN PHẨM
                                </h6>
                                <div className="overflow-x-auto">
                                    <div className="max-h-48 overflow-y-auto">
                                        <table className="min-w-full border border-gray-200 bg-white">
                                            <thead className="border-b border-gray-200 bg-gray-100">
                                                <tr>
                                                    <th className="px-4 py-2 text-center">
                                                        Tên gói
                                                    </th>
                                                    <th className="whitespace-nowrap px-4 py-2 text-center">
                                                        Số lượng
                                                    </th>
                                                    <th className="px-4 py-2 text-center">
                                                        Đơn giá
                                                    </th>
                                                    <th className="px-4 py-2 text-center">
                                                        Tổng tiền
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="text-gray-700">
                                                {paymentDetail && (
                                                    <tr key={paymentDetail?.paymentId}>

                                                        <td className="px-4 py-2 text-center">{paymentDetail?.packageName}</td>
                                                        <td className="px-4 py-2 text-center">1</td>
                                                        {/* <td className="whitespace-nowrap px-4 py-2 text-center">
                                                        {product.unitPrice}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-center">
                                                        {product.totalPrice}
                                                    </td> */}
                                                        <td className="whitespace-nowrap px-4 py-2 text-center">
                                                            {formatCurrency(paymentDetail?.price ?? 0)}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-2 text-center">
                                                            {formatCurrency(paymentDetail?.totalAmount ?? 0)}
                                                        </td>

                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right side: Phương thức thanh toán */}
                        <div className="w-full pl-4 md:w-1/3">
                            <div className="mb-4 rounded bg-gray-100 p-4">
                                <h6 className="mb-4 font-semibold">
                                    PHƯƠNG THỨC THANH TOÁN
                                </h6>
                                <p className="mb-2 flex justify-between">
                                    PayOS: <span className="font-semibold">{formatCurrency(paymentDetail?.totalAmount ?? 0)}</span>
                                </p>
                                <p className="mb-2 flex justify-between">
                                    VnpayQR: <span className="font-semibold">0</span>
                                </p>
                                <p className="mb-2 flex justify-between">
                                    MoMo: <span className="font-semibold">0</span>
                                </p>
                                <p className="mb-2 flex justify-between">
                                    PayPal: <span className="font-semibold">0</span>
                                </p>
                            </div>
                            <div className="mb-4 rounded bg-gray-100 p-4">
                                <h6 className="mb-4 font-semibold">THANH TOÁN</h6>
                                <p className="mb-2 flex justify-between">
                                    Tạm tính:{' '}
                                    {/* <span className="font-semibold">{orderDetail?.payment?.subtotal}</span> */}
                                    <span className="font-semibold">{formatCurrency(paymentDetail?.price ?? 0)}</span>
                                </p>
                                <p className="mb-2 flex justify-between">
                                    Khuyến mãi:{' '}
                                    {/* <span className="font-semibold">{orderDetail?.payment?.discount}</span> */}
                                    <span className="font-semibold">{formatCurrency(paymentDetail?.discount ?? 0)}</span>
                                </p>
                                <p className="mb-2 flex justify-between">
                                    Cần thanh toán:{' '}
                                    {/* <span className="font-semibold text-red-500">{orderDetail?.payment?.total}</span> */}
                                    <span className="font-semibold">{formatCurrency(paymentDetail?.totalAmount ?? 0)}</span>
                                </p>
                            </div>
                            <div className="modal-footer flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="rounded bg-blue-500 px-2 py-1 text-sm text-white transition-colors duration-300 hover:bg-blue-600"
                                    onClick={onClose}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};