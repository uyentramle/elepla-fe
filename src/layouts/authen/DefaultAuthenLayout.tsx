import { DefaultLayoutProps } from '../../types/layout.type';
import Footer from './Components/Footer/Footer';
import Header from './Components/Header/Header';

const DefaultAuthenLayout = ({ children }: DefaultLayoutProps) => {
    return (
        <div>
            <Header />
            
            {children}
            <Footer />
        </div>
    );
};

export default DefaultAuthenLayout;
