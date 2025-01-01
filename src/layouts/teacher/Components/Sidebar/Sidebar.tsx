import { MenuOutlined, SnippetsOutlined, CalendarOutlined, DatabaseOutlined, StarOutlined, CheckSquareOutlined, CaretRightOutlined,ShareAltOutlined, SaveOutlined, UsergroupAddOutlined, PlusOutlined } from '@ant-design/icons';
import { Menu, MenuProps, Button } from 'antd';
import Sider from 'antd/es/layout/Sider';
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import img from '/assets/img/logo.png';
import { message } from 'antd'; // Đảm bảo bạn đã import message từ Ant Design

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
  const location = useLocation();

  // const [collapsed, setCollapsed] = useState(window.innerWidth < 1280);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 1280);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setCollapsed]);

  const getConditionalItems = (): MenuItem[] => {
    return [
      getItem('Bài dạy của tôi', '1', <SnippetsOutlined />),
      getItem('Bài dạy đã lưu', '6', <SaveOutlined />),
      getItem('Được chia sẻ với tôi', '7', <UsergroupAddOutlined />),
      getItem('Thư viện kế hoạch', '5', <ShareAltOutlined />),
      getItem('Thời khóa biểu hàng tuần', '2', <CalendarOutlined />),
      getItem('Ngân hàng câu hỏi', '3', <DatabaseOutlined />, [
        getItem('Ngân hàng câu hỏi', '3.1', <CaretRightOutlined />),
        getItem('Câu hỏi của tôi', '3.2', <CaretRightOutlined />),
      ]),
      getItem('Bài kiểm tra', '4', <CheckSquareOutlined />,[
        getItem('Tạo bài kiểm tra', '4.1', <CaretRightOutlined />),
        getItem('bài kiểm tra của tôi', '4.2', <CaretRightOutlined />),
    ]),
    ];
  };

  const navUrl = new Map<string, string>();
  navUrl
    .set('1', '/teacher/list-collection')
    .set('6', '/teacher/saved-collection')
    .set('7', '/teacher/planbook-shared')
    .set('5', '/teacher/planbook-library')
    .set('2', '/teacher/schedule/weekly')
    .set('3', '/teacher/question-bank/')
    .set('3.1', '/teacher/question-bank/')
    .set('3.2', '#')
    .set('4', '/teacher/exam/')
    .set('4.1', '/teacher/exam/')
    .set('4.2', '/teacher/list-exam')

    // Kiểm tra xem URL hiện tại có khớp với bất kỳ mục nào trong navUrl hay không
    const getSelectedKeys = (): string[] => {
      const currentPath = location.pathname;
      const selectedKeys: string[] = [];
    
      navUrl.forEach((url, key) => {
        if (currentPath.startsWith(url)) {
          selectedKeys.push(key);  // Thêm key vào nếu đường dẫn khớp
        }
      });
    
      return selectedKeys;  // Trả về mảng trống nếu không tìm thấy key khớp
    };
    
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
            {!collapsed ? "Nâng cấp tài khoản" : null}
          </Button>

          <Button
            type="primary"
            block
            size="large"
            className="bg-blue-500 text-white w-full"
            onClick={() => navigate('/teacher/list-collection')}
          >
            {!collapsed ? "Tạo kế hoạch" : <PlusOutlined />} 
          </Button>
        </div>

        {/* Menu Items */}
        <Menu
          defaultSelectedKeys={getSelectedKeys()}
          mode="inline"
          items={getConditionalItems()}
          onSelect={(e) => {
            const link = navUrl.get(e.key);
            if (link) {
              navigate(link);
            } else {
              message.warning('Tính năng đang được phát triển, vui lòng thử lại sau.');
            }
          }}
        />
      </Sider>
    </div>
  );
}
