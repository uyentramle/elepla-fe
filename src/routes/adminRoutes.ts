import { PrivateRouteProps } from './index';
import DefaultAdminLayout from '../layouts/admin/DefaultAdminLayout';

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
import GradeManagementPage from '@/pages/admin/GradeManagement/GrademanagementPage';
import GradeFormPage from '@/pages/admin/GradeManagement/GradeFormPage';

const adminRoutes: PrivateRouteProps[] = [
    { path: '/admin/', component: DashBoardPage, layout: DefaultAdminLayout, allowedRoles: ['Admin'] },
    { path: '/admin/articles', component: ArticleManagementPage, layout: DefaultAdminLayout, allowedRoles: ['Admin'] },
    { path: '/admin/articles/add-new', component: ArticleFormPage, layout: DefaultAdminLayout, allowedRoles: ['Admin'] },
    { path: '/admin/articles/edit/:id', component: ArticleFormPage, layout: DefaultAdminLayout, allowedRoles: ['Admin'] },
    { path: '/admin/categories', component: CategoryManagementPage, layout: DefaultAdminLayout, allowedRoles: ['Admin'] },
    { path: '/admin/categories/add-new', component: CategoryFormPage, layout: DefaultAdminLayout, allowedRoles: ['Admin'] },
    { path: '/admin/categories/edit/:id', component: CategoryFormPage, layout: DefaultAdminLayout, allowedRoles: ['Admin'] },
    { path: '/admin/users', component: UserManagementPage, layout: DefaultAdminLayout, allowedRoles: ['Admin'] },
    { path: '/admin/curriculum-frameworks', component: CurriculumFrameworkManagementPage, layout: DefaultAdminLayout, allowedRoles: ['Admin'] },
    { path: '/admin/curriculum-frameworks/add-new', component: CurriculumFrameworkFormPage, layout: DefaultAdminLayout, allowedRoles: ['Admin'] },
    { path: '/admin/curriculum-frameworks/edit/:id', component: CurriculumFrameworkFormPage, layout: DefaultAdminLayout, allowedRoles: ['Admin'] },
    { path: '/admin/subjects', component: SubjectManagementPage, layout: DefaultAdminLayout, allowedRoles: ['Admin'] },
    { path: '/admin/subjects/add-new', component: SubjectFormPage, layout: DefaultAdminLayout, allowedRoles: ['Admin'] },
    { path: '/admin/subjects/edit/:id', component: SubjectFormPage, layout: DefaultAdminLayout, allowedRoles: ['Admin'] },
    { path: '/admin/grades', component: GradeManagementPage, layout: DefaultAdminLayout, allowedRoles: ['Admin'] },
    { path: '/admin/grades/add-new', component: GradeFormPage, layout: DefaultAdminLayout, allowedRoles: ['Admin'] },
    { path: '/admin/grades/edit/:id', component: GradeFormPage, layout: DefaultAdminLayout, allowedRoles: ['Admin'] },
];

export default adminRoutes;
