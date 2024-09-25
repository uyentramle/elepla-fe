import { FC } from 'react';
import DefaultAdminLayout from '../layouts/admin/DefaultAdminLayout';
import DefaultClientLayout from '../layouts/client/DefaultClientLayout';
import DefaultAuthenLayout from '../layouts/authen/DefaultAuthenLayout';

import SignInPage from '../pages/authen/SignIn/SignInPage';

import DashBoardPage from '../pages/admin/DashBoard/DashBoardPage';
import HomePage from '../pages/client/Home/HomePage';
import ComingSoonPage from '../pages/client/ComingSoon/ComingSoonPage';
import { DefaultLayoutProps } from '../types/layout.type';

import ArticleManagementPage from '@/pages/admin/ArticleManagement/ArticleManagementPage';
import CategoryManagementPage from '@/pages/admin/CategoryManagement/CategoryManagementPage';

interface RouteProps {
    path: string;
    component: FC<{}>;
    layout: ({ children }: DefaultLayoutProps) => JSX.Element;
}

const publicRoutes: RouteProps[] = [
    { path: '/', component: HomePage, layout: DefaultClientLayout },
    { path: '/sign-in', component: SignInPage, layout: DefaultAuthenLayout },
    { path: '/coming-soon', component: ComingSoonPage, layout: DefaultClientLayout },
];

const privateRoutes: RouteProps[] = [];

const adminRoutes: RouteProps[] = [
    { path: '/admin/', component: DashBoardPage, layout: DefaultAdminLayout },
    { path: '/admin/articles', component: ArticleManagementPage, layout: DefaultAdminLayout },
    { path: '/admin/categories', component: CategoryManagementPage, layout: DefaultAdminLayout },
];

export { publicRoutes, privateRoutes, adminRoutes };