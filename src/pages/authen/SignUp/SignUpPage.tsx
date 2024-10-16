import React, { useState, useEffect } from "react";
import { Form, Input, Button, Checkbox, Steps } from 'antd';
import { LineOutlined, FacebookFilled, GoogleOutlined, CheckCircleFilled, CheckOutlined, LoadingOutlined } from '@ant-design/icons';

const { Step } = Steps;

const SignUpPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [phoneNumberOrEmail, setPhoneNumberOrEmail] = useState<string>('');
    const [registerToken, setRegisterToken] = useState<string>('');

    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (countdown > 0) {
          const timer = setTimeout(() => {
            setCountdown(countdown - 1);
          }, 1000);
          return () => clearTimeout(timer);
        }
        else {
          setCanResend(true); // Khi hết thời gian đếm ngược, cho phép gửi lại
        }
      }, [countdown]);

    const sendVerificationCode = async (phoneNumberOrEmail: any) => {
        setCurrentStep(1);
        
      };

      const verifyRegisterCode = async (phoneNumberOrEmail: any, verificationCode: any) => {
            setCurrentStep(2);
      };

      const registerUser = async (values: any) => {
            setCurrentStep(3);
      };

    const handleResendVerificationCode = () => {
        setCanResend(false);
        setCountdown(60);
    };

    const onFinish = (values: any) => {
        console.log('Success:', values);
        if (currentStep === 0) {
            setPhoneNumberOrEmail(values.phoneNumberOrEmail);
            sendVerificationCode(values);
        } else if (currentStep === 1) {
            verifyRegisterCode(phoneNumberOrEmail, values);
        } else if (currentStep === 2) {
            registerUser(values);
        }
    };

    const onFinishFailed = (errorInfo: unknown) => {
        console.log('Failed:', errorInfo);
    }

    return (
        <section className="h-screen flex items-center justify-center bg-no-repeat inset-0 bg-cover" style={{ backgroundImage: `url('../images/bg-2.png')` }}>
            <div className="container 2xl:px-80 xl:px-52">
                <div className="bg-white rounded-lg overflow-hidden" style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', width: '100%', maxWidth: '800px', minHeight: '500px' }}>
                    <div className="grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 gap-6">

                        <div className="xl:col-span-2 lg:col-span-1 min-h-[500px]">
                            <div className="bg-sky-600 text-white gap-10 h-full w-full p-7 space-y-6 lg:space-y-0">
                                <span className="font-semibold tracking-widest uppercase">Elepla</span>

                                <div className="flex flex-col justify-center text-center h-full">
                                    <h1 className="text-3xl mb-4">Chào mừng trở lại!</h1>
                                    <p className="text-gray-200 font-normal leading-relaxed">Hãy đăng nhập để tiếp tục công việc xây dựng giáo án của bạn.</p>
                                    <div className="my-8">
                                        <a href="/sign-in" className="border text-white font-medium text-sm rounded-full transition-all duration-300 hover:bg-white hover:text-black focus:bg-white focus:text-black px-14 py-2.5">
                                            Đăng nhập
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="xl:col-span-3 lg:col-span-2 lg:m-10 m-5 flex flex-col justify-center items-center">
                            <h2 className="text-2xl font-bold mb-6 text-center text-blue-500">Đăng ký</h2>

                            {/* <div className="w-56">
                            <Steps current={currentStep} className="mb-8 custom-steps">
                                <Step title={currentStep === 0 ? <LineOutlined className="text-blue-500" /> : <LineOutlined className="text-blue-500" />} />
                                <Step title={currentStep === 1 ? <LineOutlined className="text-blue-500" /> : <LineOutlined className="text-blue-500" />} />
                                <Step title={currentStep === 2 ? " " : ""} />
                            </Steps>
                            </div> */}
                            

                            <Form
                                form={form}
                                name="sign_up"
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                {currentStep === 0 && (
                                    <>
                                        <Form.Item
                                            name="phoneNumberOrEmail"
                                            rules={[
                                                // { required: true, message: 'Vui lòng nhập số điện thoại hoặc email' },
                                                // { type: 'string', pattern: new RegExp(/^[0-9]+$/), message: 'Số điện thoại chưa hợp lệ' },
                                                {
                                                    validator: (_, value) => {
                                                        if (!value) {
                                                            return Promise.reject('Vui lòng nhập số điện thoại hoặc email');
                                                        }
                                                        const isPhone = /^[0-9]+$/.test(value) || /^\+84\s?\d{9,10}$/.test(value);
                                                        const isEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
                                                        if (!isPhone && !isEmail) {
                                                            return Promise.reject('Định dạng số điện thoại hoặc email không hợp lệ');
                                                        }
                                                        return Promise.resolve();
                                                    },
                                                },
                                            ]}
                                            style={{ display: 'inline-block', width: 'calc(85% - 8px)', marginRight: '10px' }}
                                        >
                                            <Input placeholder="Số điện thoại hoặc email" />
                                        </Form.Item>
                                        <Form.Item
                                            style={{ display: 'inline-block', width: 'calc(15% - 8px)' }}>
                                            <Button type="primary" htmlType="submit" className="w-full"

                                            >
                                                Gửi
                                            </Button>
                                        </Form.Item>
                                        <Form.Item
                                            name="agreement"
                                            valuePropName="checked"
                                            rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject('Bạn phải đồng ý với các điều khoản của Elepla') }]}
                                            style={{ marginBottom: '10px' }}

                                        >
                                            <Checkbox>Tôi đã đọc và đồng ý với các <a href='#'>Điều khoản</a> của Elepla</Checkbox>
                                        </Form.Item>
                                        <Form.Item
                                            name="agreement"
                                            valuePropName="checked"
                                            rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject('Bạn phải đồng ý với chính sách bảo vệ thông tin cá nhân của Elepla') }]}
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <Checkbox>Tôi đã đọc và đồng ý với <a href='#'>Chính sách bảo vệ thông tin cá nhân</a> của Elepla</Checkbox>
                                        </Form.Item>
                                        <div className="text-center mt-4">
                                            <LineOutlined className='mx-2' />
                                            {/* <span> Hoặc </span> */}
                                            <span>Hoặc đăng nhập bằng</span>
                                            <LineOutlined className='mx-2' />
                                            <div className="flex justify-center mt-2">
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
                                            <p>Bạn đã có tài khoản? <Button type="link" href="/sign-in">Đăng nhập</Button></p>
                                        </div>
                                    </>
                                )}
                                {currentStep === 1 && (
                                    <>
                                        <p className="mb-4 text-center">Vui lòng nhập mã xác nhận số điện thoại hoặc email để xác minh danh tính</p>
                                        {/* <p className="mb-4">mi****02@gmail.com</p> */}
                                        <Form.Item
                                            name="verificationCode"
                                            className="mb-10"
                                            rules={[{ required: true, message: 'Mã xác nhận không được để trống' }]}
                                            style={{ display: 'inline-block', width: 'calc(68% - 8px)', marginRight: '10px' }}
                                        >
                                            <Input
                                                placeholder="Mã Xác Nhận"
                                                maxLength={6}
                                                className=""
                                                onKeyPress={(e) => {
                                                    if (!/[0-9]/.test(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                        </Form.Item>
                                        <Button type="text"
                                            className={`border border-gray-300 text-gray-500`}

                                            style={{ display: 'inline-block', width: 'calc(32% - 2px)' }}
                                            onClick={handleResendVerificationCode}
                                            disabled={!canResend}>
                                            {canResend ? <><CheckOutlined /> Gửi lại </> : <><LoadingOutlined /> Gửi lại ({countdown}s)</>}
                                        </Button>
                                        <Form.Item
                                        // style={{ display: 'inline-block', width: 'calc(15% - 2px)' }}
                                        >
                                            <Button type="primary" htmlType="submit" className="w-full"
                                            >
                                                Tiếp
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                                {currentStep === 2 && (
                                    <>
                                        {/* <p className="mb-4">Vui lòng thiết lập mật khẩu tương đối mạnh</p> */}
                                        <Form.Item
                                            name="firstName"
                                            rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
                                            style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginRight: '16px' }}
                                        >
                                            <Input placeholder="Họ" />
                                        </Form.Item>
                                        <Form.Item
                                            name="lastName"
                                            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                                            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                                        >
                                            <Input placeholder="Tên" />
                                        </Form.Item>

                                        <Form.Item
                                            name="username"
                                            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
                                        >
                                            <Input placeholder="Tên đăng nhập" />
                                        </Form.Item>
                                        <Form.Item
                                            name="password"
                                            rules={[{ required: true, message: 'Mật khẩu không được để trống' }]}
                                        >
                                            <Input.Password
                                                // prefix={<LockOutlined />}
                                                placeholder="Vui lòng nhập mật khẩu"
                                                className=""
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="confirmPassword"
                                            rules={[
                                                { required: true, message: 'Mật khẩu không được để trống' },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (!value || getFieldValue('password') === value) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error('Mật khẩu không khớp!'));
                                                    },
                                                }),
                                            ]}
                                        >
                                            <Input.Password
                                                // prefix={<LockOutlined />}
                                                placeholder="Vui lòng nhập lại mật khẩu"
                                                className=""
                                            />
                                        </Form.Item>
                                        <p className="text-sm mb-5">
                                            - Mật khẩu bao gồm 6-30 số, chữ cái và ký tự đặc biệt<br />
                                            - Tối thiểu gồm 2 loại ký tự<br />
                                            - Đảm bảo hai lần nhập mật khẩu giống nhau
                                        </p>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" className="w-full">
                                                Đăng ký
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                                {currentStep === 3 && (
                                    <div className="text-center">
                                        <CheckCircleFilled className='text-green-500 mb-2' style={{ fontSize: '40px' }} />
                                        <p>Tài khoản của bạn đã được thiết lập thành công</p>
                                        <Button type="link" className="block mx-auto text-center" style={{ maxWidth: 'max-content' }} href="/sign-in">Trở về Đăng nhập</Button>
                                    </div>

                                )}
                            </Form>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default SignUpPage;