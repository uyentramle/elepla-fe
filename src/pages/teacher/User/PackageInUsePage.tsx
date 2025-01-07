import React, { useEffect, useState } from "react";
import SidebarMenu from "./SidebarMenu";
import { useNavigate, useLocation } from "react-router-dom";
import { Modal, /*Card, Button, Row, Col, Tag,*/ message } from "antd";
import PackageDetailPage from "./PackageDetailPage"; // Import component Popup
import { getUserPackagesByUserId, UserPackage } from '@/data/manager/UserPackageDatas';
import { getUserId } from '@/data/apiClient';
import { updatePaymentStatus } from "@/data/manager/PaymentData";

const PackageInUsePage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userPackages, setUserPackages] = useState<UserPackage[]>([]);
    const [activePackage, setActivePackage] = useState<UserPackage | undefined>();
    const [isModalVisible, setIsModalVisible] = useState(false); // State to control the popup
    // const [selectedPackage, setSelectedPackage] = useState<UserPackage | undefined>(); // State for selected package detail
    const location = useLocation();

    const navigateToSignInPage = () => {
        navigate('/sign-in');
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigateToSignInPage();
    };

    useEffect(() => {
        const fetchUserPackage = async () => {
            try {
                const response = await getUserPackagesByUserId(getUserId()!);
                if (response?.data && Array.isArray(response.data)) {
                    setUserPackages(response.data); // Sử dụng .items để lấy danh sách UserPackage
                    const activePackage = response.data.find((pkg) => pkg.isActive);
                    setActivePackage(activePackage); // Đặt gói đang sử dụng
                } else {
                    message.error('Không có dữ liệu gói dịch vụ');
                }
            } catch (error) {
                console.error('Error getting user package:', error);
                message.error('Lỗi khi lấy thông tin gói dịch vụ');
            }
        };

        fetchUserPackage();
    }, [location, isModalVisible, loading]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const orderCode = queryParams.get('orderCode');
        const status = queryParams.get('status');
        // const cancel = queryParams.get('cancel');

        // Kiểm tra các tham số có tồn tại và hợp lệ không
        if (orderCode && status) {
            const paymentStatus = status === 'PAID' ? 'Paid' : status === 'CANCELLED' ? 'Failed' : null;

            if (paymentStatus) {
                // Gọi API để cập nhật trạng thái thanh toán
                updatePaymentStatus(orderCode, paymentStatus)
                    .then((success) => {
                        if (success) {
                            console.log('Payment status updated successfully');
                            setLoading((prev) => !prev);
                        } else {
                            console.error('Failed to update payment status');
                        }
                    })
                    .catch((error) => {
                        console.error('Error updating payment status:', error);
                    });
            } else {
                console.error('Invalid payment status');
            }

            // Reset URL bằng cách sử dụng window.history.replaceState
            window.history.replaceState(null, '', window.location.pathname);
        }

    }, [location]);

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Hàm kiểm tra trạng thái
    const getStatus = (pkg: any) => {
        // Nếu thanh toán thất bại
        if (pkg.paymentStatus === "Failed") {
            return <span className="text-red-600 font-semibold">Thanh toán thất bại</span>;
        }

        // Nếu đang chờ thanh toán
        if (pkg.paymentStatus === "Pending") {
            // return <span className="text-orange-500 font-bold">Đang chờ thanh toán</span>;
            return (
                <a href={pkg.paymentUrl} className="text-blue-500 font-semibold underline" target="_blank" rel="noopener noreferrer">
                    Đang chờ thanh toán            
                </a>
            );
        }

        // Nếu gói đang sử dụng và có `isActive = true`
        if (pkg.isActive) {
            return <span className="text-green-600 font-semibold">Đang sử dụng</span>;
        }

        // Kiểm tra nếu endDate lớn hơn ngày hiện tại
        const currentDate = new Date();
        const endDate = new Date(pkg.endDate);

        // Nếu gói miễn phí hết hạn hoặc gói đã hết hạn nhưng có endDate > hiện tại
        if (
            (pkg.packageName === "Gói miễn phí" && !pkg.isActive) ||
            (pkg.isActive === false && endDate > currentDate)
        ) {
            return <span className="text-yellow-500 font-semibold">Đã nâng cấp</span>;
        }

        // Nếu gói hết hạn (endDate <= hiện tại)
        if (endDate <= currentDate) {
            return <span className="text-red-600 font-semibold">Hết hạn</span>;
        }

        // Default fallback (nếu không vào được bất kỳ điều kiện nào trên)
        return <span className="text-gray-600 font-semibold">Không xác định</span>;
    };

    return (
        <div className="container mx-auto w-4/5 py-10 px-4">
            <div className="flex flex-col gap-10 lg:flex-row">
                <SidebarMenu onLogout={handleLogout} />
                <div className="w-full lg:flex-1">
                    <div className="bg-white rounded shadow-md p-6">
                        <nav className="mb-4 flex">
                            <b className="inline-flex items-center rounded-t border-l border-r border-t border-blue-500 px-4 py-2 pb-1.5 text-blue-500">
                                <span className="mr-2">Thông tin gói dịch vụ</span>
                            </b>
                            <div className="flex-grow border-b border-blue-500"></div>
                        </nav>
                        {/* Hiển thị gói hiện tại */}
                        <div className="mb-6">
                            <div className="relative rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 border-l-4 border-blue-500 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs uppercase font-semibold rounded-bl-lg px-3 py-1 shadow-md">
                                    Đang sử dụng
                                </div>
                                <h3 className="text-lg font-semibold text-black mb-4">Gói đang sử dụng</h3>
                                <div className="text-gray-700 space-y-2">
                                    {activePackage && (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="font-semibold">Tên gói:</span>
                                                <span>{activePackage.packageName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-semibold">Ngày bắt đầu:</span>
                                                <span>{new Date(activePackage.startDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-semibold">Ngày kết thúc:</span>
                                                <span>{new Date(activePackage.endDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-semibold">Giá:</span>
                                                <span>{activePackage.price.toLocaleString()} VND</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-semibold">Trạng thái:</span>
                                                <span
                                                    className={`font-bold ${activePackage.isActive ? "text-green-600" : "text-red-600"}`}
                                                >
                                                    {activePackage.isActive ? "Đang sử dụng" : "Hết hạn"}
                                                </span>
                                            </div>
                                            {/* Điều kiện hiển thị nút nâng cấp */}
                                            {(activePackage.packageName === "Gói miễn phí" || activePackage.packageName === "Gói cơ bản") && (
                                                <div className="mt-4">
                                                    <button
                                                        onClick={() => setIsModalVisible(true)}  // Mở modal khi nhấn nút
                                                        className="bg-blue-500 text-white px-2 py-1 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                                                    >
                                                        Nâng cấp
                                                    </button>
                                                </div>
                                            )}
                                            {activePackage.packageName === "Gói cao cấp" && (
                                                <>
                                                    <div className="mt-4">
                                                        <button
                                                            onClick={() => setIsModalVisible(true)}  // Hàm xử lý xem thông tin gói
                                                            className="bg-blue-500 text-white px-2 py-1 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                                                        >
                                                            Xem thông tin gói
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Danh sách các gói đã mua */}
                        {/* <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Các gói đã mua trước đây</h3>
                            <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-2">
                                {userPackages.map((pkg) => (
                                    <div
                                        key={pkg.userPackageId}
                                        className="min-w bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex-shrink-0 p-4"
                                    >
                                        <h4 className="text-blue-600 font-semibold text-lg mb-2">{pkg.packageName}</h4>
                                        <p>
                                            <b>Ngày bắt đầu:</b> {new Date(pkg.startDate).toLocaleDateString()}
                                        </p>
                                        <p>
                                            <b>Ngày kết thúc:</b> {new Date(pkg.endDate).toLocaleDateString()}
                                        </p>
                                        <p>
                                            <b>Giá:</b> {pkg.price.toLocaleString()} VND
                                        </p>
                                        <p>
                                            <b>Trạng thái:</b>{' '}
                                            {pkg.isActive ? (
                                                <Tag color="green">Đang sử dụng</Tag>
                                            ) : (
                                                <Tag color="red">Hủy kích hoạt</Tag>
                                            )}
                                        </p>
                                        <Button
                                            type="primary"
                                            className="mt-4 w-full"
                                        //onClick={() => onViewDetails(pkg)}
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div> */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Các gói đã mua trước đây</h3>
                            {/* Container cuộn */}
                            <div className="overflow-x-auto border rounded-lg shadow-md">
                                <div className="min-w-[800px] max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 text-center">
                                    {/* Header */}
                                    <div className="flex bg-gray-100 border-b border-gray-300 py-2 font-semibold text-gray-700">
                                        <div className="w-1/4 px-4">Tên gói</div>
                                        <div className="w-1/4 px-4">Ngày bắt đầu</div>
                                        <div className="w-1/4 px-4">Ngày kết thúc</div>
                                        <div className="w-1/4 px-4">Giá</div>
                                        <div className="w-1/4 px-4">Trạng thái</div>
                                    </div>
                                    {/* Rows */}
                                    {userPackages.map((pkg) => (
                                        <div
                                            key={pkg.userPackageId}
                                            className="flex py-2 border-b border-gray-200 hover:bg-gray-50 transition-all"
                                        >
                                            <div className="w-1/4 px-4">{pkg.packageName}</div>
                                            <div className="w-1/4 px-4">
                                                {new Date(pkg.startDate).toLocaleDateString()}
                                            </div>
                                            <div className="w-1/4 px-4">
                                                {new Date(pkg.endDate).toLocaleDateString()}
                                            </div>
                                            <div className="w-1/4 px-4">{pkg.price.toLocaleString()} VND</div>
                                            <div className="w-1/4 px-4 whitespace-nowrap text-[12px]">
                                                {getStatus(pkg)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
            {/* Popup modal */}
            <Modal
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
                width={850}
                style={{ top: '10vh' }}
            >
                <PackageDetailPage />
            </Modal >
        </div >
    );
};

export default PackageInUsePage;
