import {
    PieChartOutlined,
} from '@mui/icons-material';
import { Menu, MenuProps } from 'antd';
import Sider, { SiderProps } from 'antd/es/layout/Sider';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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

const items: MenuItem[] = [
    getItem('Dashboard', '1', <PieChartOutlined />),
];

const navUrl = new Map<string, string>();
navUrl.set('1', '/admin/').set('4', '/admin/addCourse');

const siderProps: SiderProps = {
    width: 250,
};

const Nav = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    return (
        <Sider
            collapsible
            collapsed={collapsed}
            {...siderProps}
            onCollapse={(value) => setCollapsed(value)}
        >
            <div className="flex items-center justify-center p-3">
                <img
                    className="h-[30px]"
                    src={
                        ''
                    }
                    alt=""
                />
                <motion.div
                    animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 120 }}
                    transition={{ duration: 0.3, type: 'keyframes' }}
                >
                    <img
                        className="max-h-[20px]"
                        src={
                            ''
                        }
                        alt=""
                    />
                </motion.div>
            </div>

            <Menu
                onSelect={(e) => {
                    const link = navUrl.get(e.key);
                    if (link) {
                        navigate(link);
                    }
                }}
                className="mt-6"
                theme={'dark'}
                defaultSelectedKeys={['1']}
                mode="inline"
                items={items}
            />
        </Sider>
    );
};

export default Nav;
