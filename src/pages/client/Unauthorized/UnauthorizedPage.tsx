// UnauthorizedPage.tsx
import React from 'react';
import { Button, Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const UnauthorizedPage: React.FC = () => {
    return (
        <div className="text-center p-4 mt-8">
            <Title level={2} className="my-4">Oopsssssssss</Title>

            <Title className="text-2xl font-semibold">Bạn không có quyền truy cập vào trang này</Title>
            <p className="my-8">Vui lòng liên hệ với quản trị viên nếu bạn nghĩ đây là một lỗi.</p>

            <div className='my-8 pb-8'>
                <Link to="/" >
                    <Button type="primary">
                        Quay lại Trang chủ
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
