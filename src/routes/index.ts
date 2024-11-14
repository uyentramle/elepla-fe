// route/index.ts
import { FC } from 'react';
import { DefaultLayoutProps } from '../types/layout.type';
// import publicRoutes from './clientRoutes';
import adminRoutes from './adminRoutes';
import managerRoutes from './managerRoutes';
import academyStaffRoutes from './academyStaffRoutes';
import teacherRoutes from './teacherRoutes';

export interface PublicRouteProps {
    path: string;
    component: FC<{}>;
    layout: ({ children }: DefaultLayoutProps) => JSX.Element;
}

export interface PrivateRouteProps {
    path: string;
    component: FC<{}>;
    layout: ({ children }: DefaultLayoutProps) => JSX.Element;
    allowedRoles: string[];
}

const allRoutes = [
    // ...publicRoutes,
    ...adminRoutes,
    ...managerRoutes,
    ...academyStaffRoutes,
    ...teacherRoutes
];

export default allRoutes;
