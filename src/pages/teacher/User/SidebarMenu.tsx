import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserOutlined, SettingOutlined, AppstoreOutlined, FileTextOutlined, RetweetOutlined, LogoutOutlined, BookOutlined } from '@ant-design/icons';

interface SidebarMenuProps {
    onLogout: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ onLogout }) => {
    const location = useLocation();
    
    // Function to determine if the current path is active
    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="mb-4 w-full lg:mb-0 lg:w-1/4">
            <div className="rounded bg-white p-4 shadow">
                <nav className="space-y-2">
                    <Link
                        to="/teacher/profile"
                        className={`flex items-center rounded p-2 ${
                            isActive('/teacher/profile') ? 'bg-blue-500 text-white font-bold' : 'text-gray-700 hover:bg-blue-400 hover:text-white'
                        }`}
                    >
                        <UserOutlined className="mr-2" />
                        <span>Thông tin tài khoản</span>
                    </Link>
                    <Link
                        to="/teacher/account-settings"
                        className={`flex items-center rounded p-2 ${
                            isActive('/teacher/account-settings') ? 'bg-blue-500 text-white font-bold' : 'text-gray-700 hover:bg-blue-400 hover:text-white'
                        }`}
                    >
                        <SettingOutlined className="mr-2" />
                        <span>Thiết lập tài khoản</span>
                    </Link>
                    <Link
                        to="/teacher/planbook"
                        className={`flex items-center rounded p-2 ${
                            isActive('/teacher/planbook') ? 'bg-blue-500 text-white font-bold' : 'text-gray-700 hover:bg-blue-400 hover:text-white'
                        }`}
                    >
                        <BookOutlined className="mr-2" />
                        <span>Thư viện giáo án</span>
                    </Link>                  
                    <Link
                        to="/teacher/change-password"
                        className={`flex items-center rounded p-2 ${
                            isActive('/teacher/change-password') ? 'bg-blue-500 text-white font-bold' : 'text-gray-700 hover:bg-blue-400 hover:text-white'
                        }`}
                    >
                        <RetweetOutlined className="mr-2" />
                        <span>Đổi mật khẩu</span>
                    </Link>
                    <Link
                        to="/teacher/package"
                        className={`flex items-center rounded p-2 ${
                            isActive('/teacher/package') ? 'bg-blue-500 text-white font-bold' : 'text-gray-700 hover:bg-blue-400 hover:text-white'
                        }`}
                    >
                        <AppstoreOutlined className="mr-2" />
                        <span>Quản lí gói dịch vụ</span>
                    </Link>
                    <Link
                        to="/teacher/payment-history"
                        className={`flex items-center rounded p-2 ${
                            isActive('/teacher/payment-history') ? 'bg-blue-500 text-white font-bold' : 'text-gray-700 hover:bg-blue-400 hover:text-white'
                        }`}
                    >
                        <FileTextOutlined className="mr-2" />
                        <span>Lịch sử thanh toán</span>
                    </Link>
                    <button
                        className="flex items-center rounded p-2 text-gray-700 hover:bg-blue-400 hover:text-white w-full text-left"
                        onClick={onLogout}
                    >
                        <LogoutOutlined className="mr-2" />
                        <span>Đăng xuất</span>
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default SidebarMenu;
