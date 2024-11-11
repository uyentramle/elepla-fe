import React from "react";
import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { FacebookFilled } from '@ant-design/icons';
import FacebookLogin from '@greatsumini/react-facebook-login';

export const CustomFacebookLoginButton: React.FC = () => {
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

    const handleFacebookResponse = async (response: any) => {
        try {
            if (response.accessToken) {
                console.log('Facebook Login Success:', response);
                await callFacebookLoginApi(response.accessToken); // Gọi hàm để gửi accessToken đến server
            } else {
                console.error('Facebook Login failed');
                message.error('Đăng nhập qua Facebook thất bại.');
            }
        } catch (error) {
            console.error('Facebook Login Error:', error);
            message.error('Đăng nhập qua Facebook thất bại. Vui lòng thử lại sau.');
        }
    };

    const callFacebookLoginApi = async (accessToken: string) => {
        try {
            const response = await fetch('https://elepla-be-production.up.railway.app/api/Auth/FacebookLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    accessToken: accessToken
                })
            });

            if (!response.ok) {
                throw new Error('Facebook Login failed');
            }

            const data = await response.json();
            
            console.log('Facebook Login API Response:', data);
            console.log('Login Success');
            message.success('Đăng nhập thành công');

            // Lưu trữ access token vào localStorage
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);

            // Chuyển hướng đến trang chủ sau khi đăng nhập thành công bằng useNavigate
            navigate('/'); // Điều hướng đến trang chủ
        } catch (error) {
            console.error('Facebook Login API Error:', error);
            message.error('Đăng nhập qua Facebook thất bại. Vui lòng thử lại sau.');
        }
    };

    return (
        <FacebookLogin
            appId="919838429945137"
            // onSuccess={(response) => {
            //     console.log('Login Success!', response);
            // }}
            onSuccess={handleFacebookResponse}
            onFail={(error) => {
                console.log('Login Failed!', error);
                message.error('Đăng nhập qua Facebook thất bại.');
            }}
            onProfileSuccess={(response) => {
                console.log('Get Profile Success!', response);
            }}
            render={({ onClick }) => (
                // <Button
                //     onClick={onClick}
                //     type="primary"
                //     shape="circle"
                //     size='large'
                //     // style={{ width: '38px', height: '38px', marginTop: 1.5}}
                //     icon={<i className="fab fa-facebook-f"><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png' /></i>}
                //     className="mr-2 border-none"
                // />
                <Button
                onClick={onClick}
                type="default" // Sử dụng type default để có nền trong suốt
                shape="circle"
                size='large'
                className="border rounded-full flex items-center justify-center transition-all duration-300 hover:bg-sky-600 hover:text-white focus:bg-sky-600 focus:text-white h-10 w-10" // Thêm class tùy chỉnh
                icon={<FacebookFilled />} // Sử dụng biểu tượng Facebook từ Ant Design
            />
            )}
        />
    );
};

export default CustomFacebookLoginButton;