import React from "react";
import { Form, Input, Button, Checkbox } from 'antd';
import { LineOutlined, FacebookFilled, GoogleOutlined } from '@ant-design/icons';

const SignInPage: React.FC = () => {

    const onFinish = (values: unknown) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: unknown) => {
        console.log('Failed:', errorInfo);
    }

    return (
        <section className="h-screen flex items-center justify-center bg-no-repeat inset-0 bg-cover" style={{ backgroundImage: `url('../images/bg-2.png')` }}>
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
                                        <a href="signup-2.html" className="border text-white font-medium text-sm rounded-full transition-all duration-300 hover:bg-white hover:text-black focus:bg-white focus:text-black px-14 py-2.5">
                                            Đăng ký
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="xl:col-span-3 lg:col-span-2 lg:m-10 m-5">
                            <h2 className="text-2xl font-bold mb-6 text-center text-blue-500">Đăng nhập</h2>
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
                                    <a href="#" className="border rounded-full flex items-center justify-center transition-all duration-300 focus:bg-sky-600 focus:text-white hover:bg-sky-600 hover:text-white h-10 w-10">
                                        <FacebookFilled />
                                    </a>
                                    <a href="#" className="border rounded-full flex items-center justify-center transition-all duration-300 focus:bg-sky-600 focus:text-white hover:bg-sky-600 hover:text-white h-10 w-10">
                                        <GoogleOutlined />
                                    </a>
                                    {/* <CustomFacebookLoginButton />

                       

                        <GoogleOAuthProvider clientId="733494164563-3udejeeopbq2b1ognt9sn7vr3qr4atm8.apps.googleusercontent.com">
                            
                            <CustomLoginButton />
                        </GoogleOAuthProvider> */}
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