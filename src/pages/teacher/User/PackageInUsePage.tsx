import React, { useEffect, useState } from "react";
import SidebarMenu from "./SidebarMenu";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import PackageDetailPage from "./PackageDetailPage"; // Import component Popup
import package_in_use_data, { IUserPackage } from "@/data/client/PackageInUseData";
import dayjs from 'dayjs';

// Define the possible packages
const FREE_PACKAGE = "Gói miễn phí";
const BASIC_PACKAGE = "Gói cơ bản";
const PREMIUM_PACKAGE = "Gói cao cấp";

const PackageInUsePage: React.FC = () => {
    const navigate = useNavigate();
    const [userPackage, setUserPackage] = useState<IUserPackage | null>(null);
    const [isExpired, setIsExpired] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState(false); // State to control the popup


    const navigateToSignInPage = () => {
        navigate('/sign-in');
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigateToSignInPage();
    };

    useEffect(() => {
        setUserPackage(package_in_use_data);

        // Check if the subscription is expired
        if (package_in_use_data.expiryDate) {
            const isExpiredCheck = dayjs().isAfter(dayjs(package_in_use_data.expiryDate), 'day');
            setIsExpired(isExpiredCheck);
        }
    }, []);

            // Handle showing the modal popup
        const showUpgradeModal = () => {
            setIsModalVisible(true);
        };

        const handleOk = () => {
            setIsModalVisible(false);
        };

        const handleCancel = () => {
            setIsModalVisible(false);
        };

    const renderPackageDetails = () => {
        if (!userPackage || userPackage.plan === FREE_PACKAGE) {
            return (
                <div className="mb-8 pb-4">
                    <b className="text-gray-800">Kế hoạch hiện tại</b>
                    <div className="mt-2 text-lg text-gray-600">{FREE_PACKAGE}</div>
                    <div className="my-2 text-gray-600">Bạn đang dùng gói miễn phí, hãy nâng cấp để được trải nghiệm tốt hơn.</div>
                    <Button type="primary" className="mt-4" onClick={showUpgradeModal}>
                        Nâng cấp gói
                    </Button>
                </div>
            );
        }

        const packageExpiredMessage = isExpired ? (
            <div className="py-2">
                <InfoCircleOutlined style={{ fontSize: '18px', color: '#f7bc28' }} />
                <b className="ml-2 text-lg text-gray-600">Hết hạn thanh toán</b>
            </div>
        ) : null;

        if (userPackage.plan === BASIC_PACKAGE) {
            return (
                <div>
                    <div className="mb-8 border-b pb-4">
                        <b className="text-gray-800">Kế hoạch hiện tại</b>
                        {packageExpiredMessage}
                        <div className="mt-2 text-lg text-gray-600">{BASIC_PACKAGE}</div>
                        <div className="text-gray-600">Hết hạn vào: {userPackage.expiryDate}</div>
                        <Button type="primary" className="mt-4" onClick={() => navigate('#')}>
                            Gia hạn gói
                        </Button>
                    </div>
                    <div className="mb-8">
                        <div className="mt-2 text-lg text-gray-800 mb-2">Bạn sẽ bị tính phí gì?</div>
                        <div className="text-gray-600">
                            Sau khi gói dịch vụ hết hạn, bạn cần gia hạn theo gói dịch vụ bạn chọn để tiếp tục sử dụng dịch vụ. Hoặc:
                        </div>
                        <Button type="primary" className="mt-4" onClick={() => navigate('#')}>
                            Nâng cấp gói cao cấp
                        </Button>
                    </div>
                </div>
            );
        }

        if (userPackage.plan === PREMIUM_PACKAGE) {
            return (
                <div>
                    <div className="mb-8 border-b pb-4">
                        <b className="text-gray-800">Kế hoạch hiện tại</b>
                        {packageExpiredMessage}
                        <div className="mt-2 text-lg text-gray-600">{PREMIUM_PACKAGE}</div>
                        <div className="text-gray-600">Hết hạn vào: {userPackage.expiryDate}</div>
                        <Button type="primary" className="mt-4" onClick={() => navigate('#')}>
                            Gia hạn gói
                        </Button>
                    </div>
                    <div className="mb-8">
                        <div className="mt-2 text-lg text-gray-800 mb-2">Bạn sẽ bị tính phí gì?</div>
                        <div className="text-gray-600">
                            Sau khi gói dịch vụ hết hạn, bạn cần gia hạn theo gói dịch vụ bạn chọn để tiếp tục sử dụng dịch vụ.
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex flex-col gap-10 lg:flex-row">
                <SidebarMenu onLogout={handleLogout} />

                <div className="w-full lg:flex-1">
                    <div className="bg-white rounded shadow-md p-6">
                        <nav className="mb-4 flex">
                            <b className="inline-flex items-center rounded-t border-l border-r border-t border-blue-500 px-4 py-2 pb-1.5 text-blue-500">
                                <span className="mr-2">Chi tiết đăng ký</span>
                            </b>
                            <div className="flex-grow border-b border-blue-500"></div>
                        </nav>
                        {renderPackageDetails()}
                    </div>
                </div>
            </div>

                  {/* Popup modal */}
            <Modal
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
                width={800}
            >
                <PackageDetailPage />
            </Modal>

        </div>
    );
};

export default PackageInUsePage;
