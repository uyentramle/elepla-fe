import { Layout } from 'antd';
import { DefaultLayoutProps } from '../../types/layout.type';
import Footer from './Components/Footer/Footer';
import Header from './Components/Header/Header';

const DefaultClientLayout = ({ children }: DefaultLayoutProps) => {
    return (
        <Layout className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow bg-white">{children}</div>
            <Footer />
        </Layout>
    );
};

export default DefaultClientLayout;
