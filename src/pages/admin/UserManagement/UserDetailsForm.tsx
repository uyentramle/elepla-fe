import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Avatar, message } from 'antd';
import { Account } from 'src/pages/admin/UserManagement/UserManagementPage.tsx';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';

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
                role: user.role,
                status: user.status,
                address: user.address,
                avatar: user.avatar,
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
                ...user,
                userId: user?.userId || '',
                username: user?.username || '',
                firstName: values.firstName,
                lastName: values.lastName,
                role: values.role,
                gender: values.gender,
                status: values.status,
                email: user?.email || '',
                phoneNumber: user?.phoneNumber || '',
                googleEmail: user?.googleEmail || '',
                facebookEmail: user?.facebookEmail || '',
                address: user?.address || '',
                avatar: user?.avatar || '',
                lastLogin: user?.lastLogin ? new Date(user.lastLogin).toISOString() : new Date().toISOString(),
                createdAt: user?.createdAt || new Date(),
                createdBy: user?.createdBy || '',
                updatedAt: user?.updatedAt || new Date(),
                updatedBy: user?.updatedBy || '',
                deletedAt: user?.deletedAt || new Date(),
                deletedBy: user?.deletedBy || ''
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

            axios.put(
                'https://elepla-be-production.up.railway.app/api/Account/UpdateUserByAdmin',
                {
                    userId: updatedUser.userId,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    roleName: updatedUser.role,
                    gender: updatedUser.gender,
                    status: updatedUser.status,
                },
                {
                    headers: {
                        'accept': '*/*',
                        'content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    }
                }
            )
                .then(response => {
                    if (response.data.success) {
                        // Assuming onUpdate will handle UI updates
                        onUpdate(updatedUser);
                        form.resetFields();

                        message.success('Cập nhật người dùng thành công!');
                    }
                    // else {
                    //     // Handle errors from the API response
                    //     message.error(response.data.message || 'Có lỗi xảy ra trong quá trình cập nhật.');
                    // }

                })
                .catch(error => {
                    // console.error('There was an error updating the user!', error);
                    // Display error details
                    const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra trong quá trình cập nhật.';
                    message.error(errorMsg);
                    console.error('There was an error updating the user!', error);
                });
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
                                <Input />
                            </Form.Item>
                            <Form.Item className="w-full" name="firstName" label="Tên">
                                <Input />
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
                    <Form.Item style={{ width: '40%' }} name="role" label="Role" rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}>
                        <Select /*mode="multiple"*/>
                            <Option value="Admin">Admin</Option>
                            <Option value="Manager">Manager</Option>
                            <Option value="AcademicStaff">Academic Staff</Option>
                            <Option value="Teacher">Teacher</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item style={{ width: '25%' }} name="gender" label="Giới tính">
                        <Select>
                            <Option value="Male">Nam</Option>
                            <Option value="Female">Nữ</Option>
                            <Option value="Unknown">Khác</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item style={{ width: '35%' }} name="status" label="Trạng thái">
                        <Select>
                            <Option value={true}>Hoạt động</Option>
                            <Option value={false}>Chặn</Option>
                        </Select>
                    </Form.Item>
                </div>

            </Form>
        </Modal>
    );
};

export default UserDetailsForm;
