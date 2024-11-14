import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SidebarMenu from './SidebarMenu';
import { useForm } from 'antd/es/form/Form';
import { Form, Input, Button, message } from 'antd';
import { jwtDecode } from 'jwt-decode';
import { translateErrorToVietnamese } from '../../../utils/TranslateError';

const ChangePasswordPage: React.FC = () => {
    const [form] = useForm();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear local items
        localStorage.removeItem('token');
        // Redirect to sign-in page
        navigate('/sign-in');
    };

    const onFinish = async (values: any) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                throw new Error('Access token not found.');
            }

            const decodedToken: any = jwtDecode(accessToken);
            const userId = decodedToken.userId;

            const response = await axios.put('https://elepla-be-production.up.railway.app/api/Account/ChangePassword', {
                userId: userId,
                currentPassword: values.currentPassword,
                newPassword: values.newPassword
            }, {
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.data.success) {
                message.success('Đổi mật khẩu thành công.');
                form.resetFields();
            } else {
                alert(response.data.message || 'Đổi mật khẩu thất bại.');
            }

        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                // Handle specific errors based on server response
                switch (error.response.data.message) {
                    case 'User not found.':
                        message.error('Không tìm thấy người dùng.');
                        break;
                    case 'Current password is incorrect.':
                        message.error('Mật khẩu hiện tại không đúng.');
                        break;
                    case 'Password is not in correct format.':
                        if (error.response.data.errors && error.response.data.errors.length > 0) {
                            error.response.data.errors.forEach((err: string) => {
                                const errorMessage = translateErrorToVietnamese(err);
                                message.error(errorMessage);
                            });
                        }
                        break;
                    default:
                        message.error(error.response.data.message || 'Đổi mật khẩu thất bại.');
                        break;
                }
            } else {
                // Handle other types of errors
                message.error('Đổi mật khẩu thất bại.');
            }
        }
    };

    return (
        <div className="container mx-auto w-4/5 p-4 pt-10">
            <div className="flex flex-col gap-10 lg:flex-row">
                {' '}
                <SidebarMenu onLogout={handleLogout} />
                <div className="w-full lg:flex-1">
                    <div className="rounded bg-white p-6 shadow">
                        {/* <nav className="mb-4">
                            <b className="border-b-2 border-pink-500 pb-1.5 text-pink-500">
                                Đổi mật khẩu
                            </b>
                        </nav> */}
                        <nav className="mb-4 flex">
                            <b className="inline-flex items-center rounded-t border-l border-r border-t border-blue-500 px-4 py-2 pb-1.5 text-blue-500">
                                <span className="mr-2">Đổi mật khẩu</span>
                            </b>
                            <div className="flex-grow border-b border-blue-500"></div>
                        </nav>
                        <Form
                            form={form}
                            className="space-y-3"
                            noValidate
                            onFinish={onFinish}
                        >
                            <div>
                                <b>
                                    Để đảm bảo tính bảo mật vui lòng đặt mật khẩu với ít nhất 8 kí tự
                                </b>
                            </div>
                            <label className="block text-sm font-medium text-gray-700">
                                Mật khẩu hiện tại
                            </label>
                            <Form.Item
                                // label="Mật khẩu hiện tại"
                                name="currentPassword"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
                            >
                                <Input.Password placeholder="••••••••" />
                            </Form.Item>
                            <label className="block text-sm font-medium text-gray-700">
                                Mật khẩu mới
                            </label>
                            <Form.Item
                                // label="Mật khẩu mới"
                                name="newPassword"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
                            >
                                <Input.Password placeholder="••••••••" />
                            </Form.Item>
                            <label className="block text-sm font-medium text-gray-700">
                                Nhập lại mật khẩu mới
                            </label>
                            <Form.Item
                                // label="Nhập lại mật khẩu mới"
                                name="confirmPassword"
                                dependencies={['newPassword']}
                                hasFeedback
                                rules={[
                                    { required: true, message: 'Vui lòng nhập lại mật khẩu mới' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu mới không khớp'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password placeholder="••••••••" />
                            </Form.Item>
                            <Form.Item>
                                <div className="flex justify-between">
                                    <Button
                                        className="rounded bg-blue-500 px-2 py-2 text-white transition-colors duration-300 hover:bg-blue-600"
                                        type="primary"
                                        htmlType="submit"
                                        style={{ fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}  // Đặt kích thước chữ là 16px

                                    >
                                        Lưu thay đổi
                                    </Button>
                                    <a
                                        href="/forgot-password"
                                        className="rounded px-2 py-2 text-blue-500 transition-colors duration-300 hover:bg-blue-600 hover:text-white"
                                        style={{ fontSize: '16px' }}  // Đặt kích thước chữ là 16px
                                    >
                                        Quên mật khẩu
                                    </a>
                                </div>
                            </Form.Item>

                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPage;