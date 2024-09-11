import DefaultClientLayout from '../layouts/client/DefaultClientLayout';

import HomePage from '../pages/client/Home/HomePage';

import { DefaultLayoutProps } from '../types/layout.type';

interface RouteProps {
    path: string;
    component: React.FC<any>;
    layout: ({ children }: DefaultLayoutProps) => JSX.Element;
}

const publicRoutes: RouteProps[] = [
    { path: '/', component: HomePage, layout: DefaultClientLayout },
];

const privateRoutes: RouteProps[] = [];

const adminRoutes: RouteProps[] = [
];

export { publicRoutes, privateRoutes, adminRoutes };
