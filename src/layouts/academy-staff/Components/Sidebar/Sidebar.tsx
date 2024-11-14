import {
    LineChartOutlined,
    MenuOutlined,
    FileTextOutlined,
    AuditOutlined,
    QuestionCircleOutlined,
    CommentOutlined,
    CaretRightOutlined,
} from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import React, { useEffect, useState } from 'react';
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
            getItem('Bảng thống kê', '1', <LineChartOutlined />),
            getItem('Quản lý môn học trong chương trình', '2', <FileTextOutlined />),
            getItem('Quản lý chương', '3', <FileTextOutlined />),
            getItem('Quản lý bài học', '4', <FileTextOutlined />),
            getItem('Quản lý kế hoạch bài dạy', '5', <AuditOutlined />),
            getItem('Quản lý ngân hàng câu hỏi', '6', <QuestionCircleOutlined />),
            getItem('Đánh giá - phản hồi', '7', <CommentOutlined />, [
                getItem('Kế hoạch bài dạy', '7-1', <CaretRightOutlined />),
                getItem('Hệ thống', '7-2', <CaretRightOutlined />),
            ]),
        ];
    };
    const navUrl = new Map<string, string>();
    navUrl
        .set('1', '/academy-staff/')
        .set('2', '/academy-staff/subject-in-curriculum')
        .set('3', '#')
        .set('4', '#')
        .set('5', '#')
        .set('6', '/academy-staff/question-banks/')
        .set('7', '#')
        .set('7-1', '/academy-staff/feedbacks/planbook/')
        .set('7-2', '/academy-staff/feedbacks/system/');

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
                <div className="demo-logo-vertical border-r-[1px] border-gray-200 pt-2 pb-4 flex justify-center">
                    <a href='/'>
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
                ></Menu>
            </Sider>
        </>
    );
}
