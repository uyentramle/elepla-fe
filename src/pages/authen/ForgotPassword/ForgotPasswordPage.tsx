import React, { useState, useEffect } from "react";
import { Steps, Form, Input, Button, message, GetProp, } from 'antd';
import {
    LockOutlined,
    // MailOutlined,
    UserOutlined,
    LineOutlined,
    CheckCircleFilled,
    CheckOutlined,
    LoadingOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import type { OTPProps } from 'antd/es/input/OTP';

const { Step } = Steps;

const obfuscateContactInfo = (phoneNumberOrEmail: string) => {
    if (!phoneNumberOrEmail) return '';

    if (phoneNumberOrEmail.includes('@')) {
        // Nếu là email
        const [name, domain] = phoneNumberOrEmail.split('@');
        if (name.length <= 2) return phoneNumberOrEmail;
        return name[0] + '*'.repeat(name.length - 3) + name.slice(-2) + '@' + domain;
    } else {
        // Nếu là số điện thoại
        const countryCode = '+84'; // Giả sử mã quốc gia luôn là +84
        const localNumber = phoneNumberOrEmail.slice(1); // Bỏ mã quốc gia từ chuỗi số điện thoại
        return `(${countryCode})${localNumber.slice(0, 3)}****${localNumber.slice(-2)}`;
    }
};

const ForgotPasswordPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [phoneNumberOrEmail, setPhoneNumberOrEmail] = useState<string>('');
    const [resetPasswordToken, setResetPasswordToken] = useState<string>('');

    const onFinish = (values: any) => {
        console.log('Success:', values);

        if (currentStep === 0) {
            // Handle username/email submission

            // message.success('Tên người dùng đã gửi');
            // setCurrentStep(1);
            setPhoneNumberOrEmail(values.phoneNumberOrEmail);
            sendVerificationCode(values.phoneNumberOrEmail);
            setCountdown(60);
        } else if (currentStep === 1) {
            // Handle verification code submission

            // message.success('Đã gửi mã xác minh');
            // setCurrentStep(2);
            verifyForgotPasswordCode(phoneNumberOrEmail, values.verificationCode);
        } else if (currentStep === 2) {
            // Handle password reset

            // message.success('Đặt lại mật khẩu thành công');
            // setCurrentStep(3);
            resetPasswordUser(values);
        }
    };

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

    const onChange: GetProp<typeof Input.OTP, 'onChange'> = (text) => {
        console.log('onChange:', text);
    };

    const sharedProps: OTPProps = {
        onChange,
    };

    const sendVerificationCode = async (phoneNumberOrEmail: any) => {
        setCurrentStep(1);
    };

    const handleResendVerificationCode = () => {
        if (phoneNumberOrEmail) {
            sendVerificationCode(phoneNumberOrEmail);
            setCountdown(60); // Đặt lại đếm ngược về 60 giây
            setCanResend(false); // Vô hiệu hóa nút gửi lại
        } else {
            message.error('Vui lòng nhập số điện thoại hoặc email trước khi gửi lại.');
        }
    };

    const verifyForgotPasswordCode = async (phoneNumberOrEmail: any, verificationCode: any) => {
        //setResetPasswordToken();
        setPhoneNumberOrEmail(phoneNumberOrEmail);
        setCurrentStep(2);
    };

    const resetPasswordUser = async (values: any) => {
        setCurrentStep(3);
    };

    return (
        <div className="min-h-screen flex items-center justify-center mt-2 bg-no-repeat bg-cover bg-center"
            style={{
                backgroundImage: `url('../assets/img/bg-2.png')`, // Đường dẫn tới ảnh PNG
            }}
        >
            <div className="bg-white p-8 rounded w-full max-w-md shadow-md ">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-500">Quên mật khẩu</h2>
                {/* <Steps current={currentStep} className="mb-8 custom-steps">
          <Step title={currentStep == 0 ? <>Nhập tài khoản <LineOutlined className="ml-4 text-blue-500" /></> : <LineOutlined className="ml-4 text-blue-500" />} />
          <Step title={currentStep == 1 ? <>Xác Minh Bảo Mật <LineOutlined className="ml-4 text-blue-500" /></> : <LineOutlined className="ml-4 text-blue-500" />} />
          <Step title={currentStep == 2 ? "Thiết lập mật khẩu" : ""} />
        </Steps> */}
                {/* <div className="steps mb-8 custom-steps flex justify-between text-sm">
      <CustomStep
        icon={<LineOutlined />}
        title={"Nhập tài khoản"}
      />
      <CustomStep
        icon={<LineOutlined />}
        title="Xác Minh Bảo Mật"
      />
      <CustomStep
        icon={<LineOutlined />}
        title="Thiết lập mật khẩu"
      />
    </div> */}

                <Form form={form} onFinish={onFinish} initialValues={{ remember: true }}
                >
                    {currentStep === 0 && (
                        <Form.Item
                            name="phoneNumberOrEmail"
                            className="mb-10"
                            // rules={[{ required: true, message: 'Tài khoản không được để trống' }]}
                            rules={[
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
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Số điện thoại/Email"
                                className=""
                            />
                        </Form.Item>
                    )}
                    {currentStep === 1 && (
                        <>
                            <p className="mb-4 text-center">Vui lòng nhập mã xác nhận số điện thoại hoặc email để xác minh danh tính</p>
                            {/* <p className="mb-4 text-center">mi****02@gmail.com</p> */}
                            <p className="mb-4 text-center">{obfuscateContactInfo(phoneNumberOrEmail)}</p>
                            <Form.Item
                                name="verificationCode"
                                rules={[{ required: true, message: 'Mã xác nhận không được để trống' }]}
                                className="text-center"
                                style={{}}
                            >
                                {/* <Input
                                    prefix={<MailOutlined />}
                                    placeholder="Mã Xác Nhận"
                                    className=""
                                /> */}
                                <Input.OTP length={6} {...sharedProps} className="" />
                            </Form.Item>
                            <div className="flex items-center justify-center">
                                <Button
                                    type="text"
                                    className={`border ${canResend ? 'border-blue-500 hover:border-gray-300' : 'border-gray-300'} text-${canResend ? 'blue' : 'gray'}-500 hover:text-${canResend ? 'blue' : 'gray'}-700 focus:text-${canResend ? 'blue' : 'gray'}-900`}
                                    onClick={handleResendVerificationCode}
                                    disabled={!canResend}
                                >
                                    {canResend ? <><CheckOutlined /> Gửi lại </> : <><LoadingOutlined /> Gửi lại ({countdown}s)</>}
                                </Button>
                            </div>
                        </>
                    )}
                    {currentStep === 2 && (
                        <>
                            <p className="mb-4 text-center">Vui lòng thiết lập mật khẩu tương đối mạnh</p>
                            <Form.Item
                                name="newPassword"
                                rules={[{ required: true, message: 'Mật khẩu không được để trống' }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
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
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu không khớp!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Vui lòng nhập lại mật khẩu"
                                    className=""
                                />
                            </Form.Item>
                            <p className="text-sm">
                                - Mật khẩu bao gồm 6-30 số, chữ cái và ký tự đặc biệt<br />
                                - Tối thiểu gồm 2 loại ký tự<br />
                                - Đảm bảo hai lần nhập mật khẩu giống nhau
                            </p>
                        </>
                    )}
                    {currentStep === 3 && (
                        <div className="text-center">
                            <CheckCircleFilled className='text-green-500 mb-2' style={{ fontSize: '40px' }} />
                            <p>Mật khẩu mới của bạn đã được thiết lập thành công</p>
                        </div>
                    )}
                    <Form.Item className="mt-6">
                        {/* <Button type="primary" htmlType="submit" className="w-full" disabled={currentStep === 3}> */}
                        <Button type="primary" htmlType="submit" className="w-full" >
                            {currentStep < 3 ? 'Tiếp' : <Link to="/sign-in">Đăng nhập ngay</Link>}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;