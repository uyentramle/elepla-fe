// import React, { useState, } from 'react';
import React from 'react';
import { Modal, Form, Input, Select, Button, } from 'antd';
import { Account } from 'src/pages/admin/UserManagement/UserManagementPage.tsx';

const { Option } = Select;

interface AddUserFormProps {
    visible: boolean;
    onCancel: () => void;
    onCreate: (newUser: Account) => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({
    visible,
    onCancel,
    // onCreate
}) => {
    const [form] = Form.useForm();
    // const [loading, setLoading] = useState(false);

    const handleCreateUser = () => {
        form.validateFields().then(async () => {
            // form.validateFields().then(async (values) => {
            // const newUser = {
            //     ...values,
            // };
            // onCreate(newUser);
            // form.resetFields();

            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                throw new Error('Access token not found.');
            }

            // try {
            //     setLoading(true);
            //     await axios.post('https://localhost:44329/api/Account/AddNewUserByAdmin',
            //         newUser,
            //         {
            //             headers: {
            //                 'accept': '*/*',
            //                 'Content-Type': 'application/json',
            //                 'Authorization': `Bearer ${accessToken}`,
            //             }
            //         }).then(response => {
            //             if (response.data.success) {
            //                 message.success('Người dùng đã được thêm thành công!');
            //                 form.resetFields();
            //                 onCreate(newUser);
            //             } // Gọi callback để làm mới dữ liệu (nếu cần)
            //         })
            // } catch (error: any) {
            //     switch (error.response.data.message) {
            //         case 'Username must be between 6 and 20 characters.':
            //             message.error('Tên đăng nhập phải có từ 6 đến 20 ký tự.');
            //             break;
            //         case `Username is already in use.`:
            //             message.error(`Tên người dùng đã tồn tại.`);
            //             break;
            //         case 'Phone number is already in use.':
            //             message.error('Số điện thoại đã được sử dụng.');
            //             break;
            //         case 'Password is not in correct format.':
            //             if (error.response.data.errors && error.response.data.errors.length > 0) {
            //                 error.response.data.errors.forEach((err: string) => {
            //                     const errorMessage = translateErrorToVietnamese(err);
            //                     message.error(errorMessage);
            //                 });
            //             }
            //             break;
            //         default:
            //             message.error('Có lỗi xảy ra khi thêm người dùng.');
            //             break;
            //     }
            // } finally {
            //     setLoading(false);
            // }
        });
    };

    // const translateErrorToVietnamese = (error: string) => {
    //     switch (error) {
    //         case 'Passwords must be at least 6 characters.':
    //             return 'Mật khẩu phải có ít nhất 6 ký tự.';
    //         case 'Passwords must have at least one non alphanumeric character.':
    //             return 'Mật khẩu phải có ít nhất một ký tự đặc biệt.';
    //         case 'Passwords must have at least one digit (\'0\'-\'9\').':
    //             return 'Mật khẩu phải có ít nhất một chữ số (\'0\'-\'9\').';
    //         case 'Passwords must have at least one uppercase (\'A\'-\'Z\').':
    //             return 'Mật khẩu phải có ít nhất một ký tự viết hoa (\'A\'-\'Z\').';
    //         case 'Passwords must have at least one lowercase (\'a\'-\'z\').':
    //             return 'Mật khẩu phải có ít nhất một ký tự viết thường (\'a\'-\'z\').';
    //         default:
    //             return error; // Hoặc trả về lỗi gốc nếu không có bản dịch
    //     }
    // };

    return (
        <Modal
            title="Tạo mới người dùng"
            className="text-center"
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleCreateUser}>
                    Thêm
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">

                <div className="flex justify-between gap-2">
                    <Form.Item className="w-full" name="lastName" label="Họ"
                    // rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item className="w-full" name="firstName" label="Tên"
                    // rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                    >
                        <Input />
                    </Form.Item>
                </div>
                <div className="flex justify-between gap-2">
                    <Form.Item className="w-full text-left" name="username" label="Tên đăng nhập" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item className="w-full" name="phoneNumber" label="Số điện thoại"
                    // rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    >
                        <Input />
                    </Form.Item>
                </div>
                <Form.Item className="w-full text-left" name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
                    <Input.Password />
                </Form.Item>
                <div className="flex justify-between gap-2">
                    <Form.Item style={{ width: '50%' }} name="roles" label="Role" rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}>
                        <Select mode="multiple">
                            <Option value="Customer">Customer</Option>
                            <Option value="Staff">Staff</Option>
                            <Option value="Admin">Admin</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item style={{ width: '25%' }} name="gender" label="Giới tính" rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
                        <Select>
                            <Option value="Male">Nam</Option>
                            <Option value="Female">Nữ</Option>
                            <Option value="Unknown">Khác</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item style={{ width: '25%' }} name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
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

export default AddUserForm;
