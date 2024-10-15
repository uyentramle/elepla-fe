import { MenuOutlined, FormOutlined, SnippetsOutlined, CalendarOutlined, DatabaseOutlined, StarOutlined } from '@ant-design/icons';
import { Menu, MenuProps, Button } from 'antd';
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
      getItem('Giáo án của tôi', '1', <SnippetsOutlined />),
      getItem('Danh sách lớp họp', '2', <FormOutlined />),
      getItem('Thời khóa biểu hàng tuần', '3', <CalendarOutlined />),
      getItem('Ngân hàng câu hỏi', '4', <DatabaseOutlined />),
    ];
  };

  const navUrl = new Map<string, string>();
  navUrl
    .set('1', '#') // Link to 'Giáo án của tôi'
    .set('2', '#') // Link to 'Danh sách lớp họp'
    .set('3', '#') // Link to 'Thời khóa biểu hàng tuần'
    .set('4', '#'); // Link to 'Ngân hàng câu hỏi'

  return (
    <>
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
        {/* Logo Section */}
        <div className="demo-logo-vertical border-r-[1px] border-gray-200 pt-2 pb-4 flex justify-center">
          <a href="/">
            <img src={img} alt="Logo" className="w-18" />
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center px-4 mt-4 space-y-3">
            <Button
                type="default"
                size="small"
                className="border-blue-500 text-blue-500 flex items-center justify-center"
                icon={<StarOutlined />}
                onClick={() => navigate('/teacher/package')}
            >
                Nâng cấp tài khoản
            </Button>

            <Button
                type="primary"
                block
                size="large"
                className="bg-blue-500 text-white w-full"  // Đảm bảo nút này rộng full chiều ngang
                onClick={() => navigate('#')}
            >
                Tạo giáo án
            </Button>
         </div>

        {/* Menu Items */}
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
    </>
  );
}
