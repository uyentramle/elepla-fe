import Layout from 'antd/es/layout/layout';
import MySider from './Components/Sidebar/Sidebar';
import MyHeader from './Components/Header/Header';
import MyContent from './Components/Content/Content';
import MyFooter from './Components/Footer/Footer';
import { DefaultLayoutProps } from '../../types/layout.type';

const DefaultStaffLayout = ({ children }: DefaultLayoutProps) => {
    return (
        <>
            <Layout className="flex">
                <MySider />
                <Layout className="flex flex-col w-full min-h-screen">
                    <MyHeader />
                    <MyContent children={children} />
                    <MyFooter />
                </Layout>
            </Layout>
        </>
    );
};

export default DefaultStaffLayout;
