import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Link from 'antd/es/typography/Link';

import menu_data from '@/data/client/MenuData';

function usePathname() {
    const location = useLocation();
    return location.pathname;
}

const NavMenu = () => {
    const [navTitle, setNavTitle] = useState("");
    const currentRoute = usePathname();

    const isMenuItemActive = (menuLink: string) => currentRoute === menuLink;
    const isSubMenuItemActive = (subMenuLink: string) => currentRoute === subMenuLink;

    const openMobileMenu = (menu: any) => {
        setNavTitle(navTitle === menu ? "" : menu);
    };

    return (
        <ul className="space-y-4 lg:flex lg:space-y-0 lg:space-x-8">
            {menu_data.map((menu) => (
                <li
                    key={menu.id}
                    className={`relative ${menu.has_dropdown ? "group" : ""} ${isMenuItemActive(menu.link) ? "text-blue-600" : ""}`}
                >
                    <Link
                        href={menu.link}
                        onClick={() => openMobileMenu(menu.title)}
                        className="block text-gray-700 hover:text-blue-600 text-xl px-2" 
                    >
                        {menu.title}
                    </Link>
                    {menu.has_dropdown && (
                        <ul
                            className={`absolute left-0 mt-2 space-y-2 bg-white shadow-md rounded-md p-4 ${navTitle === menu.title ? "block" : "hidden"
                                } group-hover:block`}
                        >
                            {menu.sub_menus?.map((sub_m, i) => (
                                <li
                                    key={i}
                                    className={`${isSubMenuItemActive(sub_m.link) ? "text-blue-600" : "text-gray-700"
                                        } hover:text-blue-600 text-lg`} 
                                >
                                    <Link href={sub_m.link}>{sub_m.title}</Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default NavMenu;