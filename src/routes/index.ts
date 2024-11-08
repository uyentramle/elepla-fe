import { FC } from 'react';
import DefaultAdminLayout from '../layouts/admin/DefaultAdminLayout';
import DefaultClientLayout from '../layouts/client/DefaultClientLayout';
import DefaultAuthenLayout from '../layouts/authen/DefaultAuthenLayout';
import DefaultManagerLayout from '@/layouts/manager/DefaultManagerLayout';
import DefaultStaffLayout from '@/layouts/academy-staff/DefaultStaffLayout';
import DefaultTeacherLayout from '@/layouts/teacher/DefaultTeacherLayout';

// Client
import HomePage from '../pages/client/Home/HomePage';
import ComingSoonPage from '../pages/client/ComingSoon/ComingSoonPage';
import PlanbookLibraryPage from '../pages/client/PlanbookLibrary/PlanbookLibraryPage';
import PlanbookDetailPage from '../pages/client/PlanBookDetail/PlanBookDetailPage';
import { DefaultLayoutProps } from '../types/layout.type';
import SignInPage from '../pages/authen/SignIn/SignInPage';
import SignUpPage from '../pages/authen/SignUp/SignUpPage';
import ForgotPasswordPage from '@/pages/authen/ForgotPassword/ForgotPasswordPage';
import ListArticlePage from '@/pages/client/ListArticlePage/ListArticlePage';
import ArticleDetailPage from '@/pages/client/ArticleDetailPage/ArticleDetailPage';

// Admin
import DashBoardPage from '../pages/admin/DashBoard/DashBoardPage';
import ArticleManagementPage from '@/pages/admin/ArticleManagement/ArticleManagementPage';
import ArticleFormPage from '@/pages/admin/ArticleManagement/ArticleFormPage';
import CategoryManagementPage from '@/pages/admin/CategoryManagement/CategoryManagementPage';
import CategoryFormPage from '@/pages/admin/CategoryManagement/CategoryFormPage';
import UserManagementPage from '@/pages/admin/UserManagement/UserManagementPage';
import CurriculumFrameworkManagementPage from '@/pages/admin/CurriculumFrameworkManagement/CurriculumFrameworkManagementPage';
import CurriculumFrameworkFormPage from '@/pages/admin/CurriculumFrameworkManagement/CurriculumFrameworkFormPage';
import SubjectManagementPage from '@/pages/admin/SubjectManagement/SubjectManagementPage';
import SubjectFormPage from '@/pages/admin/SubjectManagement/SubjectFormPage';

// Manager
import DashBoardManagerPage from '@/pages/manager/DashBoard/DashBoardPage';
import ServicePackageManagementPage from '@/pages/manager/ServicePackageManagement/ServicePackageManagementPage';
import ServicePackageFormPage from '@/pages/manager/ServicePackageManagement/ServicePackageFormPage';
import UserServiceManagementPage from '@/pages/manager/UserServiceManagement/UserServiceManagementPage';
import PaymentManagementPage from '@/pages/manager/PaymentManagement/PaymentManagementPage';
import PaymentDetailPage from '@/pages/manager/PaymentManagement/PaymentDetailPage';
import UserServiceDetailPage from '@/pages/manager/UserServiceManagement/UserServiceDetailPage';

// Academy Staff
import DashBoardStaffPage from '@/pages/academy-staff/DashBoard/DashBoardPage';
import QuestionBankManagementPage from '@/pages/academy-staff/QuestionBankManagement/QuestionBankManagementPage';
import QuestionBankFormPage from '@/pages/academy-staff/QuestionBankManagement/QuestionBankFormPage';
import PlanbookFeedbackManagementPage from '@/pages/academy-staff/FeedbackManagement/PlanbookFeedbackManagementPage';
import SystemFeedbackManagementPage from '@/pages/academy-staff/FeedbackManagement/SystemFeedbackManagementPage';

// Teacher
import ProfilePage from '@/pages/teacher/User/ProfilePage';
import ChangePasswordPage from '@/pages/teacher/User/ChangePasswordPage';
import AccountSettingsPage from '@/pages/teacher/User/AccountSettingsPage';
import PaymentHistoryPage from '@/pages/teacher/User/PaymentHistoryPage';
import PackageInUsePage from '@/pages/teacher/User/PackageInUsePage';
import WeeklySchedulePage from '@/pages/teacher/Schedule/WeeklySchedulePage';
import ListCollection from '@/pages/teacher/ListPlanbook/ListCollection';
import PackageDetailPage from '@/pages/teacher/User/PackageDetailPage';
import ListPlanbook from '@/pages/teacher/ListPlanbook/ListPlanbook';
import PlanbookContent from '@/layouts/teacher/PlanbookContent/PlanbookContent';

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
    { path: '/list-article', component: ListArticlePage, layout: DefaultClientLayout },
    { path: '/planbook-library', component: PlanbookLibraryPage, layout: DefaultClientLayout },
    { path: '/planbook-detail/:id', component: PlanbookDetailPage, layout: DefaultClientLayout },
    { path: '/package-detail', component: PackageDetailPage, layout: DefaultClientLayout },
    { path: '/article-detail/:id', component: ArticleDetailPage, layout: DefaultClientLayout }
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
    { path: '/admin/users', component: UserManagementPage, layout: DefaultAdminLayout },
    { path: '/admin/curriculum-frameworks', component: CurriculumFrameworkManagementPage, layout: DefaultAdminLayout },
    { path: '/admin/curriculum-frameworks/add-new', component: CurriculumFrameworkFormPage, layout: DefaultAdminLayout },
    { path: '/admin/curriculum-frameworks/edit/:id', component: CurriculumFrameworkFormPage, layout: DefaultAdminLayout },
    { path: '/admin/subjects', component: SubjectManagementPage, layout: DefaultAdminLayout },
    { path: '/admin/subjects/add-new', component: SubjectFormPage, layout: DefaultAdminLayout },
    { path: '/admin/subjects/edit/:id', component: SubjectFormPage, layout: DefaultAdminLayout },
];

const managerRoutes: RouteProps[] = [
    { path: '/manager/', component: DashBoardManagerPage, layout: DefaultManagerLayout },
    { path: '/manager/service-packages', component: ServicePackageManagementPage, layout: DefaultManagerLayout },
    { path: '/manager/service-packages/add-new', component: ServicePackageFormPage, layout: DefaultManagerLayout },
    { path: '/manager/service-packages/edit/:id', component: ServicePackageFormPage, layout: DefaultManagerLayout },
    { path: '/manager/user-services', component: UserServiceManagementPage, layout: DefaultManagerLayout },
    { path: '/manager/payments', component: PaymentManagementPage, layout: DefaultManagerLayout },
    { path: '/manager/payments/detail/:id', component: PaymentDetailPage, layout: DefaultManagerLayout },
    { path: '/manager/user-services/detail/:id', component: UserServiceDetailPage, layout: DefaultManagerLayout },
];

const academyStaffRoutes: RouteProps[] = [
    { path: '/academy-staff/', component: DashBoardStaffPage, layout: DefaultStaffLayout },
    { path: '/academy-staff/question-banks', component: QuestionBankManagementPage, layout: DefaultStaffLayout },
    { path: '/academy-staff/question-banks/add-new', component: QuestionBankFormPage, layout: DefaultStaffLayout },
    { path: '/academy-staff/question-banks/edit/:id', component: QuestionBankFormPage, layout: DefaultStaffLayout },
    { path: '/academy-staff/feedbacks/planbook/', component: PlanbookFeedbackManagementPage, layout: DefaultStaffLayout },
    { path: '/academy-staff/feedbacks/system/', component: SystemFeedbackManagementPage, layout: DefaultStaffLayout },
];

const teacherRoutes: RouteProps[] = [
    { path: '/teacher/profile', component: ProfilePage, layout: DefaultClientLayout },
    { path: '/teacher/change-password', component: ChangePasswordPage, layout: DefaultClientLayout },
    { path: '/teacher/account-settings', component: AccountSettingsPage, layout: DefaultClientLayout },
    { path: '/teacher/payment-history', component: PaymentHistoryPage, layout: DefaultClientLayout },
    { path: '/teacher/package', component: PackageInUsePage, layout: DefaultClientLayout },
    { path: '/teacher/schedule/weekly', component: WeeklySchedulePage, layout: DefaultTeacherLayout },
    { path: '/teacher/list-collection', component: ListCollection, layout: DefaultTeacherLayout },
    { path: '/teacher/list-collection/list-planbook/:id', component: ListPlanbook, layout: DefaultTeacherLayout },
    { path: '/teacher/list-collection/planbook-content', component: PlanbookContent, layout: DefaultClientLayout },

];

export { publicRoutes, privateRoutes, adminRoutes, managerRoutes, academyStaffRoutes, teacherRoutes };