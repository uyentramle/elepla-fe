import { FC } from 'react';
import DefaultAdminLayout from '../layouts/admin/DefaultAdminLayout';
import DefaultClientLayout from '../layouts/client/DefaultClientLayout';
import DefaultAuthenLayout from '../layouts/authen/DefaultAuthenLayout';
import DefaultManagerLayout from '@/layouts/manager/DefaultManagerLayout';
import DefaultStaffLayout from '@/layouts/academy-staff/DefaultStaffLayout';
// import DefaultTeacherLayout from '@/layouts/teacher/DefaultTeacherLayout';

// Client
import HomePage from '../pages/client/Home/HomePage';
import ComingSoonPage from '../pages/client/ComingSoon/ComingSoonPage';
import PlanbookLibraryPage from '../pages/client/PlanbookLibrary/PlanbookLibraryPage';
import PlanbookDetailPage from '../pages/client/PlanBookDetail/PlanBookDetailPage'; 
import { DefaultLayoutProps } from '../types/layout.type';
import SignInPage from '../pages/authen/SignIn/SignInPage';
import SignUpPage from '../pages/authen/SignUp/SignUpPage';
import ForgotPasswordPage from '@/pages/authen/ForgotPassword/ForgotPasswordPage';

// Admin
import DashBoardPage from '../pages/admin/DashBoard/DashBoardPage';
import ArticleManagementPage from '@/pages/admin/ArticleManagement/ArticleManagementPage';
import ArticleFormPage from '@/pages/admin/ArticleManagement/ArticleFormPage';
import CategoryManagementPage from '@/pages/admin/CategoryManagement/CategoryManagementPage';
import CategoryFormPage from '@/pages/admin/CategoryManagement/CategoryFormPage';

// Manager
import DashBoardManagerPage from '@/pages/manager/DashBoard/DashBoardPage';

// Academy Staff
import DashBoardStaffPage from '@/pages/academy-staff/DashBoard/DashBoardPage';

// Teacher
import ProfilePage from '@/pages/teacher/User/ProfilePage';
import ChangePasswordPage from '@/pages/teacher/User/ChangePasswordPage';
import AccountSettingsPage from '@/pages/teacher/User/AccountSettingsPage';
import PaymentHistoryPage from '@/pages/teacher/User/PaymentHistoryPage';
import WeeklySchedulePage from '@/pages/teacher/Schedule/WeeklySchedulePage';



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
    { path: '/planbook-library', component: PlanbookLibraryPage, layout: DefaultClientLayout },
    { path: '/planbook-detail/{id}', component: PlanbookDetailPage, layout: DefaultClientLayout },


];

const privateRoutes: RouteProps[] = [];

const adminRoutes: RouteProps[] = [
    { path: '/admin/', component: DashBoardPage, layout: DefaultAdminLayout },
    { path: '/admin/articles', component: ArticleManagementPage, layout: DefaultAdminLayout },
    { path: '/admin/articles/add-new', component: ArticleFormPage, layout: DefaultAdminLayout },
    { path: '/admin/articles/edit/:id', component: ArticleFormPage, layout: DefaultAdminLayout },
    { path: '/admin/categories', component: CategoryManagementPage, layout: DefaultAdminLayout },
    { path: '/admin/categories/add-new', component: CategoryFormPage, layout: DefaultAdminLayout },
    { path: '/admin/categories/edit/:id', component: CategoryFormPage, layout: DefaultAdminLayout },
];

const managerRoutes: RouteProps[] = [
    { path: '/manager/', component: DashBoardManagerPage, layout: DefaultManagerLayout },
];

const academyStaffRoutes: RouteProps[] = [
    { path: '/academy-staff/', component: DashBoardStaffPage, layout: DefaultStaffLayout },
];

const teacherRoutes: RouteProps[] = [
    { path: '/teacher/profile', component: ProfilePage, layout: DefaultClientLayout },
    { path: '/teacher/change-password', component: ChangePasswordPage, layout: DefaultClientLayout },
    { path: '/teacher/account-settings', component: AccountSettingsPage, layout: DefaultClientLayout },
    { path: '/teacher/payment-history', component: PaymentHistoryPage, layout: DefaultClientLayout },
    { path: '/teacher/schedule/weekly', component: WeeklySchedulePage, layout: DefaultClientLayout },
];

export { publicRoutes, privateRoutes, adminRoutes, managerRoutes, academyStaffRoutes, teacherRoutes };