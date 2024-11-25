import React from "react";
import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { useGoogleLogin /*, GoogleLogin*/ } from '@react-oauth/google';
import { googleLogin, saveTokens, navigateBasedOnRole } from "@/data/authen/loginData";
import { translateLoginErrorToVietnamese } from "@/utils/TranslateError";

const CustomGoogleLoginButton: React.FC = () => {
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

    const login = useGoogleLogin({
        onSuccess: (credentialResponse) => {
            console.log(credentialResponse);
            // Handle successful login response here
            callGoogleLoginApi(credentialResponse.code); // Gọi hàm để gửi tokenId đến server
        },
        flow: 'auth-code'
    });

    const callGoogleLoginApi = async (googleToken: string) => {
        try {
            const response = await googleLogin(googleToken);
            
            if (response.success) {
                message.success('Đăng nhập thành công');

                // Lưu trữ access token vào localStorage
                saveTokens(response.accessToken, response.refreshToken);

                // Chuyển hướng người dùng đến trang tương ứng với role
                navigateBasedOnRole(navigate);
            } else {
                console.error('Google Login Failed:', response.message);
                message.error(translateLoginErrorToVietnamese(response.message));
            }

            // const response = await fetch('https://elepla-be-production.up.railway.app/api/Auth/GoogleLogin', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         googleToken: googleToken,
            //         isCredential: false
            //     })
            // });

            // if (!response.ok) {
            //     throw new Error('Google Login failed');
            // }

            // const data = await response.json();
            // console.log('Google Login API Response:', data);
            // console.log('Login Success');
            // message.success('Đăng nhập thành công');

            // // Lưu trữ access token vào localStorage
            // saveTokens(data.accessToken, data.refreshToken);

            // // Chuyển hướng người dùng đến trang tương ứng với role
            // navigateBasedOnRole(navigate);
        } catch (error) {
            console.error('Google Login API Error:', error);
            message.error('Đăng nhập qua Google thất bại. Vui lòng thử lại sau.');
        }
    };

    return (
        <Button
            onClick={() => login()}
            type="default" // Chọn type là default để nó có màu nền trong suốt
            shape="circle"
            size="large"
            className="border rounded-full flex items-center justify-center transition-all duration-300 hover:bg-sky-600 hover:text-white focus:bg-sky-600 focus:text-white" // Thêm class tùy chỉnh
            icon={<GoogleOutlined />} // Sử dụng biểu tượng Google từ Ant Design
        />
    );
};

export default CustomGoogleLoginButton;
