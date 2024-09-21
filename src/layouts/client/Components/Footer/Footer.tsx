import { FacebookOutlined, InstagramOutlined, YoutubeOutlined, TwitterOutlined, CalendarOutlined, } from '@ant-design/icons';
import Link from 'antd/es/typography/Link';
import footerLogo from '/assets/img/footer-logo.png';

const Footer = () => {
    return (
        <footer className="bg-[#F0F4F9] py-10">
            <div className="py-8">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                            <h4 className="text-lg font-bold">Contact Us</h4>
                            <ul className="space-y-2">
                                <li><i className="fa fa-map-marker"></i> 420 Love Street, 133/2 Street, New York</li>
                                <li><i className="fa fa-envelope"></i> info.contact@gmail.com</li>
                                <li><i className="fa fa-phone"></i> 012 345 678 9101</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-lg font-bold">News & Blog</h4>
                            <ul className="space-y-2">
                                <li>
                                    <h5><Link href="/blog-details">Big Ideas Of Business Branding Info.</Link></h5>
                                    <span className="text-gray-600"><i className="fa fa-calendar"></i> December 7, 2024</span>
                                </li>
                                <li>
                                    <h5><Link href="/blog-details">Ui/Ux Ideas Of Business Branding Info.</Link></h5>
                                    <span className="text-gray-600">
                                        <CalendarOutlined /> December 7, 2024</span>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-lg font-bold">Facebook News Feed</h4>
                            <ul className="space-y-2">
                                <li>
                                    <i className="fa fa-twitter"></i> Simply dummy brand
                                    <div className="text-gray-600">9 Hours ago</div>
                                </li>
                                <li>
                                    <i className="fa fa-twitter"></i> Simply dummy brand
                                    <div className="text-gray-600">9 Hours ago</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-center md:text-left">
                        <div>
                            <Link href="/"><img src={footerLogo} alt="Logo" /></Link>
                        </div>
                        <div className="md:order-3 flex justify-center md:justify-end space-x-4">
                            <Link href="#" target='_blank' className="hover:underline">
                                <FacebookOutlined className="text-xl" />
                            </Link>
                            <Link href="#" target='_blank' className="hover:underline">
                                <InstagramOutlined className="text-xl" />
                            </Link>
                            <Link href="#" target='_blank' className="hover:underline">
                                <YoutubeOutlined className="text-xl" />
                            </Link>
                            <Link href="#" target='_blank' className="hover:underline">
                                <TwitterOutlined className="text-xl" />
                            </Link>
                        </div>
                        <div>
                            <p>copyright 2024 by Elepla</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
