import React, { useState, useEffect } from 'react';
import Link from 'antd/es/typography/Link';
import Button from 'antd/es/button';
import NavMenu from './Menu/NavMenu'
import UseSticky from '@/utils/UseSticky';
import logo from '/assets/img/logo.png';


const Header: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const { sticky } = UseSticky();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const toggleMobileMenu = () => {
        setIsActive(!isActive);
    };

    useEffect(() => {
        const storedLoginState = localStorage.getItem('isLoggedIn');
        setIsLoggedIn(storedLoginState === 'true');

        const handleStorageChange = () => {
            setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

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
                            <Link href="/">
                                <img src={logo} alt="Logo" className="w-full h-auto" />
                            </Link>
                        </div>
                        <div className="hidden lg:flex space-x-8">
                            <NavMenu />
                        </div>
                        {/* Right Side - Sign In / Sign Up / Search */}
                        <div className="flex items-center space-x-4">
                            <Link href="#">
                                <Button type="default" className="mb-3">Sign In</Button>
                            </Link>
                            <Link href="#">
                                <Button type="primary" className="mb-3">Sign Up</Button>
                            </Link>
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
