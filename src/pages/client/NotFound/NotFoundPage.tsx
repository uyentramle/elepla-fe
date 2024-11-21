// NotFoundPage.tsx
import React from 'react';
import { Button, Typography } from 'antd';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <>
            <div className='my-8' style={{ textAlign: 'center', }}>
                <div className='mb-8'>
                    <img src='https://media.istockphoto.com/id/1359544016/vector/404-error-program-error-web-page-cannot-be-opened.jpg?s=612x612&w=0&k=20&c=kSLw1lRBG__vjwURrno8iE2jWDgqrvrP8fi1WPkYu3g=' alt='404' style={{ display: 'block', margin: '0 auto' }} />
                    <Typography.Text style={{ fontSize: '24px', fontWeight: 'bold', padding: '10px' }}>Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.</Typography.Text>
                </div>
                <div className='mb-8 pb-8'>
                    <Link to="/" >
                        <Button type="primary">
                            Quay lại Trang chủ
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default NotFoundPage;