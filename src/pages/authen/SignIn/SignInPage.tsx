import React from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { LineOutlined } from '@ant-design/icons';
import {
    GoogleOAuthProvider,
    // GoogleLogin
} from '@react-oauth/google';
import CustomGoogleLoginButton from '../Button/GoogleLoginButton';
import CustomFacebookLoginButton from "../Button/FacebookLoginButton";
import { jwtDecode } from 'jwt-decode';
import apiClient from "@/data/apiClient"; // Import your configured apiClient


interface ApiResponse {
    success: boolean;
    message: string;
    accessToken: string | null;
    refreshToken: string | null;
}

// Định nghĩa kiểu dữ liệu cho JWT payload
interface JwtPayload {
    userId: string;  // Giả sử userID là một chuỗi
    role: string;    // Giả sử role là một chuỗi
    [key: string]: any; // Nếu có các thuộc tính khác, bạn có thể thêm chúng vào đây
}

const loginApi = async (username: string, password: string): Promise<ApiResponse> => {

    try {
        const response = await apiClient.post('https://elepla-be-production.up.railway.app/api/Auth/Login', {  //link deploy
        //     const response = await axios.post('http://localhost/api/Auth/Login', {
            username,
            password
        }, {
            headers: {
                'accept': '*/*', // xem trong api yêu cầu gì thì copy vào
                'Content-Type': 'application/json' // xem trong api yêu cầu gì thì copy vào
            }
        });

        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            // Kiểm tra xem có phản hồi từ server không
            if (error.response) {
                // Nếu có phản hồi từ API nhưng có lỗi logic
                return { success: false, message: error.response.data.message || 'Đã xảy ra lỗi, vui lòng thử lại sau.', accessToken: null, refreshToken: null };
            } else if (error.request) {
                // Nếu không có phản hồi nào từ server
                return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.', accessToken: null, refreshToken: null };
            }
        }
        // Bắt tất cả các lỗi khác
        return { success: false, message: 'Đã xảy ra lỗi, vui lòng thử lại sau.', accessToken: null, refreshToken: null };
    }
};

const SignInPage: React.FC = () => {
    const navigate = useNavigate();


    const onFinish = async (values: any) => {
        try {
            const response = await loginApi(values.username, values.password);
        
            if (response.success) {
                message.success('Đăng nhập thành công');
        
                // Lưu trữ accessToken và refreshToken vào localStorage
                if (response.accessToken && response.refreshToken) {
                    localStorage.setItem('accessToken', response.accessToken);
                    localStorage.setItem('refreshToken', response.refreshToken);
        
                    // Giải mã JWT token
                    try {
                        const decodedToken = jwtDecode<JwtPayload>(response.accessToken); // Sử dụng kiểu JwtPayload
        
                        const userId = decodedToken.userId; // Lấy userId từ JWT token
                        const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']; // Lấy role
                        console.log('userID:', decodedToken.userId); // In ra userID
    
                        // Lưu userId vào localStorage
                        localStorage.setItem('userId', userId); // Lưu userId vào localStorage
    
                        // Kiểm tra quyền truy cập dựa trên role
                        if (role === 'Teacher') {
                            // Điều hướng đến trang dành cho Teacher
                            navigate('/teacher/list-collection');
                        } else if (role === 'Admin') {
                            // Điều hướng đến trang dành cho Admin
                            navigate('/admin/');
                        } else if (role === 'Manager') {
                            // Điều hướng đến trang dành cho Manager
                            navigate('/manager');
                        } else if (role === 'AcademicStaff') {
                            // Điều hướng đến trang dành cho AcademicStaff
                            navigate('/academy-staff');
                        } else {
                            // Điều hướng đến trang mặc định nếu không có quyền phù hợp
                            navigate('/');
                        }
        
                    } catch (error) {
                        console.error('Không thể giải mã token:', error);
                    }
                } else {
                    message.error('Không có accessToken trong phản hồi.');
                }
            } else {
                console.error('Login Failed:', response.message);

                switch (response.message) {
                    case 'Wrong password!':
                        message.error('Incorrect password.');
                        break;
                    case 'User not found!':
                        message.error('Incorrect username.');
                        break;
                    case 'User account is blocked. Please contact support.':
                        message.error('Your account is blocked. Please contact support.');
                        break;
                    default:
                        message.error('An error occurred, please try again later.');
                        break;
                }

                switch (response.message) {
                    case 'Wrong password!':
                        message.error('Mật khẩu không đúng.');
                        break;
                    case 'User not found!':
                        message.error('Tên đăng nhập không chính xác');
                        break;
                    case 'User account is blocked. Please contact support.':
                        message.error('Tài khoản người dùng đã bị khóa. Vui lòng liên hệ bộ phận hỗ trợ.');
                        break;
                    default:
                        message.error('Đã xảy ra lỗi, vui lòng thử lại sau.');
                        break;
                }
            }
        } catch (error) {
            message.error('Đã xảy ra lỗi, vui lòng thử lại sau.');
        }
    };
    
    const onFinishFailed = (errorInfo: any) => {
        console.log('Login Failed:', errorInfo);
    };

    return (
        <section className="h-screen flex items-center justify-center bg-no-repeat inset-0 bg-cover" style={{ backgroundImage: `url('../assets/img/bg-2.png')` }}>
            <div className="container 2xl:px-80 xl:px-52">
                <div className="bg-white rounded-lg overflow-hidden" style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}>
                    <div className="grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 gap-6">
                        <div className="xl:col-span-2 lg:col-span-1">
                            <div className="bg-sky-600 text-white gap-10 h-full w-full p-7 space-y-6 lg:space-y-0">
                                <span className="font-semibold tracking-widest uppercase">Elepla</span>
                                <div className="flex flex-col justify-center text-center h-full">
                                    <h1 className="text-3xl mb-4">Xin chào!</h1>
                                    <p className="text-gray-200 font-normal leading-relaxed">Cung cấp thông tin của bạn và cùng chúng tôi khám phá cách đơn giản hóa việc tạo giáo án.</p>
                                    <div className="my-8">
                                        <a href="/sign-up" className="border text-white font-medium text-sm rounded-full transition-all duration-300 hover:bg-white hover:text-black focus:bg-white focus:text-black px-14 py-2.5">
                                            Đăng ký
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="xl:col-span-3 lg:col-span-2 lg:m-10 m-5">
                            <h2 className="text-2xl font-bold mb-5 text-center text-blue-500">Đăng nhập</h2>
                            <Form
                                name="sign_in"
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                <Form.Item
                                    name="username"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
                                >
                                    <Input placeholder="Email/Số điện thoại/Tên đăng nhập" />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                                >
                                    <Input.Password placeholder="Mật khẩu" />
                                </Form.Item>

                                <div className='grid grid-cols-2 justify-items-stretch'>
                                    <Form.Item name="remember" valuePropName="checked">
                                        <Checkbox>Ghi nhớ tài khoản</Checkbox>
                                    </Form.Item>
                                    <div className="justify-self-end text-right mb-4">
                                        <Button type="link" href="/forgot-password">Quên mật khẩu?</Button>
                                    </div>
                                </div>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="w-full">
                                        Đăng nhập
                                    </Button>
                                </Form.Item>
                            </Form>
                            <div className="text-center mt-4">
                                <LineOutlined className='mx-2' />
                                <span>Hoặc đăng nhập bằng</span>
                                <LineOutlined className='mx-2' />
                                <div className="flex justify-center mt-2 gap-2">
                                    {/* <a href="#" className="border rounded-full flex items-center justify-center transition-all duration-300 focus:bg-sky-600 focus:text-white hover:bg-sky-600 hover:text-white h-10 w-10">
                                        <FacebookFilled />
                                    </a>
                                    <a href="#" className="border rounded-full flex items-center justify-center transition-all duration-300 focus:bg-sky-600 focus:text-white hover:bg-sky-600 hover:text-white h-10 w-10">
                                        <GoogleOutlined />
                                    </a> */}
                                    <CustomFacebookLoginButton />
                                    <GoogleOAuthProvider clientId="448683717226-p7kuea7e82t5l4g4ge8q3j1f2ok92r3q.apps.googleusercontent.com">
                                        <CustomGoogleLoginButton />
                                    </GoogleOAuthProvider>
                                </div>
                            </div>
                            <div className="text-center mt-4">
                                <span>Chưa có tài khoản?</span>
                                <Button type="link" href="/sign-up">Đăng ký</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignInPage;
