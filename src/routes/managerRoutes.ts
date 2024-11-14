import { PrivateRouteProps } from './index';
import DefaultManagerLayout from '@/layouts/manager/DefaultManagerLayout';

import DashBoardManagerPage from '@/pages/manager/DashBoard/DashBoardPage';
import ServicePackageManagementPage from '@/pages/manager/ServicePackageManagement/ServicePackageManagementPage';
import ServicePackageFormPage from '@/pages/manager/ServicePackageManagement/ServicePackageFormPage';
import UserServiceManagementPage from '@/pages/manager/UserServiceManagement/UserServiceManagementPage';
import PaymentManagementPage from '@/pages/manager/PaymentManagement/PaymentManagementPage';
import PaymentDetailPage from '@/pages/manager/PaymentManagement/PaymentDetailPage';
import UserServiceDetailPage from '@/pages/manager/UserServiceManagement/UserServiceDetailPage';

const managerRoutes: PrivateRouteProps[] = [
    { path: '/manager/', component: DashBoardManagerPage, layout: DefaultManagerLayout, allowedRoles: ['Manager'] },
    { path: '/manager/service-packages', component: ServicePackageManagementPage, layout: DefaultManagerLayout, allowedRoles: ['Manager'] },
    { path: '/manager/service-packages/add-new', component: ServicePackageFormPage, layout: DefaultManagerLayout, allowedRoles: ['Manager'] },
    { path: '/manager/service-packages/edit/:id', component: ServicePackageFormPage, layout: DefaultManagerLayout, allowedRoles: ['Manager'] },
    { path: '/manager/user-services', component: UserServiceManagementPage, layout: DefaultManagerLayout, allowedRoles: ['Manager'] },
    { path: '/manager/payments', component: PaymentManagementPage, layout: DefaultManagerLayout, allowedRoles: ['Manager'] },
    { path: '/manager/payments/detail/:id', component: PaymentDetailPage, layout: DefaultManagerLayout, allowedRoles: ['Manager'] },
    { path: '/manager/user-services/detail/:id', component: UserServiceDetailPage, layout: DefaultManagerLayout, allowedRoles: ['Manager'] },
];

export default managerRoutes;