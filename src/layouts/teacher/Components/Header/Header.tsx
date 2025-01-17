import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, MenuProps, Modal, Spin } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { Link, useNavigate } from 'react-router-dom';
import { Logout } from '@/data/authen/loginData';

export default function MyHeader() {
    const navigate = useNavigate();
    const items: MenuProps['items'] = [
        {
            key: '1',
            icon: <UserOutlined></UserOutlined>,
            label: <Link to={"/teacher/profile"}>Thông tin cá nhân</Link>,
        },
        {
            key: '2',
            icon: <LogoutOutlined></LogoutOutlined>,
            label: <div onClick={() => {Logout(navigate)}}>Đăng xuất</div>,
        },
    ];

    return (
        <Header className="fixed z-50 flex w-full justify-between border-b border-gray-200 bg-white px-5">
            <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']} arrow>
                <Avatar
                    className="fixed right-4 top-3 cursor-pointer"
                    size={'large'}
                    icon={<UserOutlined />}
                />
            </Dropdown>
            <Modal footer={null} closable={false}>
                <div className="flex flex-col items-center justify-center">
                    <Spin size="large"></Spin>
                    <span>Đang đăng xuất...</span>
                </div>
            </Modal>
        </Header>
    );
}
