import {
    MenuOutlined,
    ProductOutlined,
    DollarOutlined,
    BarChartOutlined,
    CaretRightOutlined,
} from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import img from '/assets/img/logo.png';

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

export default function MySider({
    collapsed,
    setCollapsed,
}: {
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const navigate = useNavigate();

    const getConditionalItems = (): MenuItem[] => {
        return [
            getItem('Bảng thống kê', '1', <BarChartOutlined />),
            getItem('Quản lý gói dịch vụ', '2', <ProductOutlined />, [
                getItem('Danh sách gói dịch vụ', '2-1', <CaretRightOutlined />),
                getItem('Dịch vụ khách sử dụng', '2-2', <CaretRightOutlined />),
                getItem('Thêm gói dịch vụ', '2-3', <CaretRightOutlined />),
            ]),
            getItem('Quản lý thanh toán', '3', <DollarOutlined />),
        ];
    };
    const navUrl = new Map<string, string>();
    navUrl
        .set('1', '/manager')
        .set('2', '/manager/service-packages')
        .set('2-1', '/manager/service-packages')
        .set('2-2', '/manager/user-services')
        .set('2-3', '/manager/service-packages/add-new')
        .set('3', '/manager/payments');

    return (
        <div className="fixed top-0 left-0 h-full bg-white z-50">
            <Sider
                theme="light"
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                className="overflow-hidden border-r-[1px]"
                trigger={
                    <div className="w-full border-r-[1px] border-t-[1px]">
                        <MenuOutlined />
                    </div>
                }
                width={256}
            >
                <div className="demo-logo-vertical border-r-[1px] border-gray-200 pt-2 pb-4 flex justify-center">
                    <a href="/manager/">
                        <img src={img} alt="Logo" className="w-18" />
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
                />
            </Sider>
        </div>
    );
}
