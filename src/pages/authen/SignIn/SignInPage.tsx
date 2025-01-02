import React from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { LineOutlined, HomeFilled } from '@ant-design/icons';
import { GoogleOAuthProvider /* , GoogleLogin*/ } from '@react-oauth/google';
import CustomGoogleLoginButton from '../Button/GoogleLoginButton';
import CustomFacebookLoginButton from "../Button/FacebookLoginButton";
import { login, saveTokens, navigateBasedOnRole } from "@/data/authen/loginData";
import { translateLoginErrorToVietnamese } from "@/utils/TranslateError";

const SignInPage: React.FC = () => {
    const navigate = useNavigate();
    const onFinish = async (values: any) => {
        try {
            const response = await login(values.username, values.password);

            if (response.success) {
                message.success('Đăng nhập thành công');

                // Lưu trữ accessToken và refreshToken vào localStorage
                saveTokens(response.accessToken, response.refreshToken);

                // Chuyển hướng người dùng đến trang tương ứng với role
                navigateBasedOnRole(navigate);
            } else {
                console.error('Login Failed:', response.message);
                message.error(translateLoginErrorToVietnamese(response.message));
            }
        } catch (error) {
            message.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.');
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
                                <Link to="/" className="flex items-center gap-2">
                                    <HomeFilled />
                                    <span className="font-semibold tracking-widest uppercase">Elepla</span>
                                </Link>
                                <div className="flex flex-col justify-center text-center h-full">
                                    <h1 className="text-3xl mb-4">Xin chào!</h1>
                                    <p className="text-gray-200 font-normal leading-relaxed">Cung cấp thông tin của bạn và cùng chúng tôi khám phá cách đơn giản hóa việc tạo kế hoạch bài dạy.</p>
                                    <div className="my-8">
                                        <Link to="/sign-up" className="border text-white font-medium text-sm rounded-full transition-all duration-300 hover:bg-white hover:text-black focus:bg-white focus:text-black px-14 py-2.5">
                                            Đăng ký
                                        </Link>
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
                                        <Button type="link"><Link to="/forgot-password">Quên mật khẩu?</Link></Button>
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
                                <Button type="link"><Link to="/sign-up">Đăng ký</Link></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignInPage;
