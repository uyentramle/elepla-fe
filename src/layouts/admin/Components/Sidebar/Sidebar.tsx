import { MenuOutlined } from '@ant-design/icons';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import { Menu, MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import img from '/assets/img/logo.jpg';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

export default function MySider() {
    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(window.innerWidth < 1280);

    useEffect(() => {
        const handleResize = () => {
            setCollapsed(window.innerWidth < 1280);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const getConditionalItems = (): MenuItem[] => {
        return [
            getItem('Bảng thống kê', '1', <AnalyticsOutlinedIcon />),
            getItem('Quản lý dịch vụ', '2', <AppsOutlinedIcon />),
            getItem('Quản lý tài khoản', '3', <ManageAccountsOutlinedIcon />),
        ];
    };
    const navUrl = new Map<string, string>();
    navUrl
        .set('1', '/admin/')
        .set('2', '/admin/#')
        .set('3', '/admin/#');

    return (
        <>
            <Sider
                theme="light"
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                className="overflow-hidden border-r-[1px] "
                trigger={
                    <div className="w-full border-r-[1px] border-t-[1px]">
                        <MenuOutlined></MenuOutlined>
                    </div>
                }
                width={256}
            >
                <div className="demo-logo-vertical border-r-[1px] border-gray-200">
                    <a href='/'>
                        <img src="/assets/img/logo.jpg" alt="Logo" className="h-16 w-16" />
                    </a>
                </div>
                <Menu
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    items={getConditionalItems()}
                    onSelect={(e) => {
                        const link = navUrl.get(e.key);
                        if (link) {
                            navigate(link);
                        }
                    }}
                ></Menu>
            </Sider>
        </>
    );
}
