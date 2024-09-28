import { FC } from 'react';
import DefaultAdminLayout from '../layouts/admin/DefaultAdminLayout';
import DefaultClientLayout from '../layouts/client/DefaultClientLayout';
import DefaultAuthenLayout from '../layouts/authen/DefaultAuthenLayout';
import DefaultTeacherLayout from '@/layouts/teacher/DefaultTeacherLayout';

import SignInPage from '../pages/authen/SignIn/SignInPage';
import SignUpPage from '../pages/authen/SignUp/SignUpPage';
import ForgotPasswordPage from '@/pages/authen/ForgotPassword/ForgotPasswordPage';

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
    { path: '/sign-up', component: SignUpPage, layout: DefaultAuthenLayout },
    { path: '/forgot-password', component: ForgotPasswordPage, layout: DefaultAuthenLayout },
    { path: '/coming-soon', component: ComingSoonPage, layout: DefaultClientLayout },
];

const privateRoutes: RouteProps[] = [];

const adminRoutes: RouteProps[] = [
    { path: '/admin/', component: DashBoardPage, layout: DefaultAdminLayout },
    { path: '/admin/articles', component: ArticleManagementPage, layout: DefaultAdminLayout },
    { path: '/admin/categories', component: CategoryManagementPage, layout: DefaultAdminLayout },
];

const teacherRoutes: RouteProps[] = [
    { path: '/teacher/', component: DashBoardPage, layout: DefaultTeacherLayout },
];

export { publicRoutes, privateRoutes, adminRoutes, teacherRoutes };