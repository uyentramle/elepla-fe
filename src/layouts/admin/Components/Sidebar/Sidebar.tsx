import { MenuOutlined, FormOutlined, SnippetsOutlined, CaretRightOutlined } from '@ant-design/icons';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import { Menu, MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import img from '/assets/img/logo.png';
import { get } from 'http';

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
            getItem('Bảng thống kê', '1', <AnalyticsOutlinedIcon />),
            getItem('Quản lý bài viết', '2', <FormOutlined />, [
                getItem('Xem tất cả', '2-1', <CaretRightOutlined />),
                getItem('Thêm mới bài viết', '2-2', <CaretRightOutlined />),
            ]),
            getItem('Quản lý danh mục bài viết', '3', <SnippetsOutlined />, [
                getItem('Xem tất cả', '3-1', <CaretRightOutlined />),
                getItem('Thêm mới danh mục', '3-2', <CaretRightOutlined />),
            ]),
            getItem('Quản lý khung chương trình', '4', <ManageAccountsOutlinedIcon />),
            getItem('Quản lý môn học', '5', <ManageAccountsOutlinedIcon />),
            getItem('Quản lý tài khoản', '6', <ManageAccountsOutlinedIcon />),
        ];
    };

    const navUrl = new Map<string, string>();
    navUrl
        .set('1', '/admin/')
        .set('2', '/admin/articles')
        .set('2-1', '/admin/articles')
        .set('2-2', '/admin/articles/add-new')
        .set('3', '/admin/categories')
        .set('3-1', '/admin/categories')
        .set('3-2', '/admin/categories/add-new')
        .set('4', '/admin/curriculum-framework')
        .set('5', '#')
        .set('6', '/admin/users');

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
                    <a href="/admin/">
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
