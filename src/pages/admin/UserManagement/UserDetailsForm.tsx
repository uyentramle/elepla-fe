import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Option } = Select;

interface UserDetailsFormProps {
    visible: boolean;
    onCancel: () => void;
    user: Account | null;
    onUpdate: (updatedUser: Account) => void;
}

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({
    visible,
    onCancel,
    user,
    onUpdate,
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                // userId: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                gender: user.gender,
                roles: user.roles,
                status: user.status,
                address: user.address,
                avatar: user.avatar,
                totalPoints: user.totalPoints,
                createdAt: user.createdAt ? new Date(user.createdAt).toLocaleString() : '',
                createdBy: user.createdBy,
                updatedAt: user.updatedAt ? new Date(user.updatedAt).toLocaleString() : '',
                updatedBy: user.updatedBy,
            });
        }
    }, [user, form]);

    const handleUpdateUser = () => {
        form.validateFields().then((values) => {
            const updatedUser = {
                userId: user.id || '',
                roles: values.roles || [],
                gender: values.gender,
                status: values.status || '',
            };
            // onUpdate(updatedUser);
            // form.resetFields();

            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                throw new Error('Access token not found.');
            }

            // console.log('userId:', updatedUser.userId);
            // console.log('roles:', updatedUser.roles);
            // console.log('gender:', updatedUser.gender);
            // console.log('status:', updatedUser.status);

            // axios.put(
            //     'https://localhost:44329/api/Account/EditUserByAdmin',
            //     {
            //         userId: updatedUser.userId,
            //         roles: updatedUser.roles,
            //         gender: updatedUser.gender,
            //         status: updatedUser.status,
            //     },
            //     {
            //         headers: {
            //             'accept': '*/*',
            //             'content-Type': 'application/json',
            //             'Authorization': `Bearer ${accessToken}`,
            //         }
            //     }
            // )
            //     .then(response => {
            //         if (response.data.success) {
            //             // Assuming onUpdate will handle UI updates
            //             onUpdate(updatedUser);
            //             form.resetFields();

            //             message.success('Cập nhật người dùng thành công!');
            //         }
            //         // else {
            //         //     // Handle errors from the API response
            //         //     message.error(response.data.message || 'Có lỗi xảy ra trong quá trình cập nhật.');
            //         // }

            //     })
            //     .catch(error => {
            //         // console.error('There was an error updating the user!', error);
            //         // Display error details
            //         const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra trong quá trình cập nhật.';
            //         message.error(errorMsg);
            //         console.error('There was an error updating the user!', error);
            //     });
        });
    };

    return (
        <Modal
            title="Chi tiết người dùng"
            className="text-center"
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleUpdateUser}>
                    Cập nhật
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <div className="flex ">
                    <div className="flex items-center justify-center items-center mr-5">
                        <Avatar
                            size={120}
                            src={user?.avatar}
                            icon={<UserOutlined />}
                        />
                    </div>
                    <div>
                        <div className="flex justify-between gap-2">
                            <Form.Item className="w-full" name="lastName" label="Họ">
                                <Input disabled />
                            </Form.Item>
                            <Form.Item className="w-full" name="firstName" label="Tên">
                                <Input disabled />
                            </Form.Item>
                        </div>

                        <div className="flex justify-between gap-2">
                            <Form.Item name="email" label="Email">
                                <Input disabled />
                            </Form.Item>
                            <Form.Item name="phoneNumber" label="Số điện thoại">
                                <Input disabled />
                            </Form.Item>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between gap-2">
                    <Form.Item className="w-full" name="totalPoints" label="Tổng điểm">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item className="w-full" name="createdAt" label="Ngày khởi tạo">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item className="w-full" name="createdBy" label="Người tạo">
                        <Input disabled />
                    </Form.Item>
                </div>
                <div className="flex justify-between gap-2">
                    <Form.Item className="w-full" name="updatedAt" label="Ngày cập nhật">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item className="w-full" name="updatedBy" label="Người cập nhật">
                        <Input disabled />
                    </Form.Item>
                </div>

                <Form.Item className="w-full" name="address" label="Địa chỉ">
                    <Input disabled />
                </Form.Item>
                <div className="flex justify-between gap-2">
                    <Form.Item style={{ width: '50%' }} name="roles" label="Role" rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}>
                        <Select mode="multiple">
                            <Option value="Admin">Admin</Option>
                            <Option value="Staff">Staff</Option>
                            <Option value="Customer">Customer</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item style={{ width: '25%' }} name="gender" label="Giới tính">
                        <Select>
                            <Option value="Male">Nam</Option>
                            <Option value="Female">Nữ</Option>
                            <Option value="Unknown">Khác</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item style={{ width: '25%' }} name="status" label="Trạng thái">
                        <Select>
                            <Option value="Active">Hoạt động</Option>
                            <Option value="Blocked">Chặn</Option>
                            <Option value="Inactive">Không hoạt động</Option>
                        </Select>
                    </Form.Item>
                </div>

            </Form>
        </Modal>
    );
};

export default UserDetailsForm;
