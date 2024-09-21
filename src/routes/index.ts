import { FC } from 'react';
import DefaultAdminLayout from '../layouts/admin/DefaultAdminLayout';
import DefaultClientLayout from '../layouts/client/DefaultClientLayout';
import DashBoardPage from '../pages/admin/DashBoard/DashBoardPage';
import HomePage from '../pages/client/Home/HomePage';
import ComingSoonPage from '../pages/client/ComingSoon/ComingSoonPage';
import { DefaultLayoutProps } from '../types/layout.type';

interface RouteProps {
    path: string;
    component: FC<{}>;
    layout: ({ children }: DefaultLayoutProps) => JSX.Element;
}

const publicRoutes: RouteProps[] = [
    { path: '/', component: HomePage, layout: DefaultClientLayout },
    { path: '/coming-soon', component: ComingSoonPage, layout: DefaultClientLayout },
];

const privateRoutes: RouteProps[] = [];

const adminRoutes: RouteProps[] = [
    { path: '/admin/', component: DashBoardPage, layout: DefaultAdminLayout },
];

export { publicRoutes, privateRoutes, adminRoutes };