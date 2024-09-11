import { Footer } from 'antd/es/layout/layout';
import React from 'react';

const MyFooter: React.FC = () => {
    return (
        <Footer className="bg-gray text-gray-600 py-8">

            <div className="container mx-auto mt-8">
                {' '}
                © {' '} {new Date().getFullYear()} - Elepla
            </div>
        </Footer>
    );
};

export default MyFooter;
