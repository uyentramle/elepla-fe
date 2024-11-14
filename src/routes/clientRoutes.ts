import { PublicRouteProps } from './index';

import DefaultClientLayout from '../layouts/client/DefaultClientLayout';
import DefaultAuthenLayout from '../layouts/authen/DefaultAuthenLayout';

import HomePage from '../pages/client/Home/HomePage';
import NotFoundPage from '@/pages/client/NotFound/NotFoundPage';
import UnauthorizedPage from '@/pages/client/Unauthorized/UnauthorizedPage';
import ComingSoonPage from '../pages/client/ComingSoon/ComingSoonPage';
import PlanbookLibraryPage from '../pages/client/PlanbookLibrary/PlanbookLibraryPage';
import PlanbookDetailPage from '../pages/client/PlanBookDetail/PlanBookDetailPage';
import SignInPage from '../pages/authen/SignIn/SignInPage';
import SignUpPage from '../pages/authen/SignUp/SignUpPage';
import ForgotPasswordPage from '@/pages/authen/ForgotPassword/ForgotPasswordPage';
import ListArticlePage from '@/pages/client/Article/ListArticlePage';
import ArticleDetailPage from '@/pages/client/Article/ArticleDetailPage';
import PackageDetailPage from '@/pages/teacher/User/PackageDetailPage';

const clientRoutes: PublicRouteProps[] = [
    { path: '/', component: HomePage, layout: DefaultClientLayout },
    { path: '*', component: NotFoundPage, layout: DefaultClientLayout },
    { path: '/unauthorized', component: UnauthorizedPage, layout: DefaultClientLayout },
    { path: '/sign-in', component: SignInPage, layout: DefaultAuthenLayout },
    { path: '/sign-up', component: SignUpPage, layout: DefaultAuthenLayout },
    { path: '/forgot-password', component: ForgotPasswordPage, layout: DefaultAuthenLayout },
    { path: '/coming-soon', component: ComingSoonPage, layout: DefaultClientLayout },
    { path: '/articles', component: ListArticlePage, layout: DefaultClientLayout },
    { path: '/planbook-library', component: PlanbookLibraryPage, layout: DefaultClientLayout },
    { path: '/planbook-detail/:id', component: PlanbookDetailPage, layout: DefaultClientLayout },
    { path: '/package-detail', component: PackageDetailPage, layout: DefaultClientLayout },
    { path: '/articles/:id', component: ArticleDetailPage, layout: DefaultClientLayout }
];

export default clientRoutes;