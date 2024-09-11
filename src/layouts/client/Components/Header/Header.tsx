import React from 'react';

const Header: React.FC = () => {
    return (
        <div className="flex items-center justify-between p-4 bg-white shadow-md fixed w-full top-0 z-50 mx-auto">
            <a href="/">
                <div className="flex items-center">
                    <img src="/logo.png" style={{ height: '50px' }} alt="Logo" className="mr-4" />
                    <span className="text-xl font-bold text-pink-500">ELEPLA</span>
                </div>
            </a>
            <div className="flex items-center space-x-6">
                <a href="/" >Trang chủ</a>
            </div>
        </div>
    );
};

export default Header;
