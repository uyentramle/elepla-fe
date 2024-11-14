import { PrivateRouteProps } from './index';
import DefaultTeacherLayout from '@/layouts/teacher/DefaultTeacherLayout';
import DefaultClientLayout from '../layouts/client/DefaultClientLayout';

import UserProfilePage from '@/pages/teacher/User/UserProfilePage';
import ChangePasswordPage from '@/pages/teacher/User/ChangePasswordPage';
import AccountSettingsPage from '@/pages/teacher/User/AccountSettingsPage';
import PaymentHistoryPage from '@/pages/teacher/User/PaymentHistoryPage';
import PackageInUsePage from '@/pages/teacher/User/PackageInUsePage';
import WeeklySchedulePage from '@/pages/teacher/Schedule/WeeklySchedulePage';
import ListCollection from '@/pages/teacher/ListPlanbook/ListCollection';
import ListPlanbook from '@/pages/teacher/ListPlanbook/ListPlanbook';
import PlanbookContent from '@/layouts/teacher/PlanbookContent/PlanbookContent';

const teacherRoutes: PrivateRouteProps[] = [
    { path: '/teacher/profile', component: UserProfilePage, layout: DefaultClientLayout, allowedRoles: ['Admin', 'Manager', 'AcademicStaff', 'Teacher'] },
    { path: '/teacher/change-password', component: ChangePasswordPage, layout: DefaultClientLayout, allowedRoles: ['Admin', 'Manager', 'AcademicStaff', 'Teacher'] },
    { path: '/teacher/account-settings', component: AccountSettingsPage, layout: DefaultClientLayout, allowedRoles: ['Admin', 'Manager', 'AcademicStaff', 'Teacher'] },
    { path: '/teacher/payment-history', component: PaymentHistoryPage, layout: DefaultClientLayout, allowedRoles: ['Admin', 'Manager', 'AcademicStaff', 'Teacher'] },
    { path: '/teacher/package', component: PackageInUsePage, layout: DefaultClientLayout, allowedRoles: ['Admin', 'Manager', 'AcademicStaff', 'Teacher'] },
    { path: '/teacher/schedule/weekly', component: WeeklySchedulePage, layout: DefaultTeacherLayout, allowedRoles: ['Admin', 'Manager', 'AcademicStaff', 'Teacher'] },
    { path: '/teacher/list-collection', component: ListCollection, layout: DefaultTeacherLayout, allowedRoles: ['Admin', 'Manager', 'AcademicStaff', 'Teacher'] },
    { path: '/teacher/list-collection/list-planbook/:id', component: ListPlanbook, layout: DefaultTeacherLayout, allowedRoles: ['Admin', 'Manager', 'AcademicStaff', 'Teacher'] },
    { path: '/teacher/list-collection/planbook-content', component: PlanbookContent, layout: DefaultClientLayout, allowedRoles: ['Admin', 'Manager', 'AcademicStaff', 'Teacher'] },

];

export default teacherRoutes;