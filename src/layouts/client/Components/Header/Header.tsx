import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'antd/es/button';
import NavMenu from './Menu/NavMenu'
import UseSticky from '@/utils/UseSticky';
import logo from '/assets/img/logo.png';
import { MenuProps, Dropdown, Avatar, Menu } from 'antd';
import { LogoutOutlined, UserOutlined, SettingOutlined, BookOutlined } from '@ant-design/icons';
import { Logout } from '@/data/authen/loginData';

const Header: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const { sticky } = UseSticky();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setIsActive(!isActive);
    };

    useEffect(() => {
        // const storedLoginState = localStorage.getItem('isLoggedIn');
        // setIsLoggedIn(storedLoginState === 'true');

        // const handleStorageChange = () => {
        //     setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
        // };
        const accessToken = localStorage.getItem('accessToken'); // Kiểm tra tồn tại accessToken
        setIsLoggedIn(!!accessToken);

        const handleStorageChange = () => {
            const updatedToken = localStorage.getItem('accessToken');
            setIsLoggedIn(!!updatedToken);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const items: MenuProps['items'] = [
        {
            key: '1',
            icon: <UserOutlined />,
            label: <Link to="/teacher/profile">Thông tin cá nhân</Link>,
        },
        {
            key: '2',
            icon: <SettingOutlined />,
            label: <Link to="/teacher/account-settings">Thiết lập tài khoản</Link>,
        },
        {
            key: '3',
            icon: <BookOutlined />,
            label: <Link to="/teacher/list-collection">Thư viện kế hoạch bài dạy</Link>,
        },
        {
            key: '4',
            icon: <LogoutOutlined />,
            label: (
                <div
                    onClick={() => {
                        Logout(navigate);
                    }}
                >
                    Đăng xuất
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="relative">
                {/* Top Navbar */}
                <nav
                    style={{ backgroundColor: sticky ? '#FFFFFF' : '#F0F4F9' }}
                    className={`w-full ${sticky ? "fixed top-0 z-50 shadow-lg" : ""} transition-all`}
                >
                    <div className="container mx-auto flex items-center justify-between py-4 px-4 lg:px-8">
                        {/* Mobile Menu Toggle */}
                        <div className="lg:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                className={`menu-toggle ${isActive ? "open" : ""}`}
                                aria-label="Toggle navigation"
                            >
                                <span className="block w-6 h-0.5 bg-black mb-1"></span>
                                <span className="block w-6 h-0.5 bg-black mb-1"></span>
                                <span className="block w-6 h-0.5 bg-black"></span>
                            </button>

                        </div>
                        {/* Logo */}
                        <div className="logo">
                            <Link to="/">
                                <img src={logo} alt="Logo" className="w-full h-auto" />
                            </Link>
                        </div>
                        <div className="hidden lg:flex space-x-8">
                            <NavMenu />
                        </div>
                        {/* Right Side - Sign In / Sign Up / Search */}
                        <div className="flex items-center space-x-4">
                            {/* <Link href="/sign-in">
                                <Button type="default" className="mb-3">Đăng nhập</Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button type="primary" className="mb-3">Đăng ký</Button>
                            </Link> */}
                            {isLoggedIn ? (
                                <Dropdown
                                    overlay={<Menu items={items} />}
                                    placement="bottomRight"
                                    trigger={['click']}
                                >
                                    <Avatar
                                        size="large"
                                        icon={<UserOutlined />}
                                        className="cursor-pointer"
                                    />
                                </Dropdown>
                            ) : (
                                <>
                                    <Link to="/sign-in">
                                        <Button type="default" className="mb-3">
                                            Đăng nhập
                                        </Button>
                                    </Link>
                                    <Link to="/sign-up">
                                        <Button type="primary" className="mb-3">
                                            Đăng ký
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    {/* Mobile Menu */}
                    {isActive && (
                        <div className="lg:hidden flex flex-col items-center space-y-4 bg-white p-4">
                            <NavMenu />
                        </div>
                    )}
                </nav>
            </div>
        </>
    );
};
export default Header;
