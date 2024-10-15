import { useState } from 'react';
import Layout from 'antd/es/layout/layout';
import MySider from './Components/Sidebar/Sidebar';
import MyHeader from './Components/Header/Header';
import MyContent from './Components/Content/Content';
import MyFooter from './Components/Footer/Footer';
import { DefaultLayoutProps } from '../../types/layout.type';

const DefaultTeacherLayout = ({ children }: DefaultLayoutProps) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            <Layout className="flex">
                <MySider collapsed={collapsed} setCollapsed={setCollapsed} />
                {/* <Layout className="flex flex-col w-full min-h-screen"> */}
                <Layout
                    className={`flex flex-col w-full min-h-screen transition-all duration-300 ${collapsed ? 'ml-[80px]' : 'ml-[256px]'}`}
                >
                    <MyHeader />
                    <MyContent children={children} />
                    <MyFooter />
                </Layout>
            </Layout>
        </>
    );
};

export default DefaultTeacherLayout;
