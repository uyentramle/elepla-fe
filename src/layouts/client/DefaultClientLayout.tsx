import { DefaultLayoutProps } from '../../types/layout.type';
import Footer from '../client/Components/Footer/Footer';
import Header from '../client/Components/Header/Header';

const DefaultClientLayout = ({ children }: DefaultLayoutProps) => {
    return (
        <div className='overflow-x-hidden'>
            <Header />
            <div className="main-content">
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default DefaultClientLayout;
