// import { FacebookOutlined, InstagramOutlined, YoutubeOutlined, TwitterOutlined } from '@ant-design/icons';
import Link from 'antd/es/typography/Link';
import footerLogo from '/assets/img/footer-logo.png';

const Footer = () => {
    return (
        <footer className="bg-[#F0F4F9] py-10">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-center md:text-left">
                    {/* Logo */}
                    <div>
                        <Link href="/"><img src={footerLogo} alt="Logo" /></Link>
                    </div>

                        {/* Contact Information */}
                        <div className="text-gray-700 space-y-4 flex flex-col justify-start h-full">
                            <h2 className="text-lg font-bold">Liên hệ với chúng tôi</h2>
                            <ul className="space-y-2">
                                <li><i className="fa fa-map-marker mr-2"></i>Tp Thủ Đức, Hồ Chí Minh, Việt Nam</li>
                                <li><i className="fa fa-envelope mr-2"></i>elepla.contact@gmail.com</li>
                                <li><i className="fa fa-phone mr-2"></i>0923647859</li>
                            </ul>
                        </div>

                        {/* Plan Information */}
                        <div className="text-gray-700 space-y-4 flex flex-col justify-start h-full">
                            <h2 className="text-lg font-bold">Khung kế hoạch bài dạy</h2>
                            <p className="text-sm leading-6">
                                Kèm theo Công văn số 5512/BGDĐT-GDTrH <br />
                                ngày 18 tháng 12 năm 2020 của Bộ GDĐT.
                            </p>
                        </div>


                    {/* Social Media */}
                    {/* <div className="md:order-3 flex justify-center md:justify-end space-x-4">
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
                    </div> */}
                </div>

                {/* Footer Design Info */}
                <div className="text-center mt-6 text-sm text-gray-500">
                    Design 2024 by Elepla
                </div>
            </div>
        </footer>
    );
};

export default Footer;
