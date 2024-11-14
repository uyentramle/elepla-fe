import { PrivateRouteProps } from './index';
import DefaultStaffLayout from '@/layouts/academy-staff/DefaultStaffLayout';

import DashBoardStaffPage from '@/pages/academy-staff/DashBoard/DashBoardPage';
import QuestionBankManagementPage from '@/pages/academy-staff/QuestionBankManagement/QuestionBankManagementPage';
import QuestionBankFormPage from '@/pages/academy-staff/QuestionBankManagement/QuestionBankFormPage';
import PlanbookFeedbackManagementPage from '@/pages/academy-staff/FeedbackManagement/PlanbookFeedbackManagementPage';
import SystemFeedbackManagementPage from '@/pages/academy-staff/FeedbackManagement/SystemFeedbackManagementPage';
import SubjectInCurriculumManagementPage from '@/pages/academy-staff/SubjectInCurriculum/SubjectInCurriculumManagementPage';
import ChapterManagementPage from '@/pages/academy-staff/ChapterManagement/ChapterManagementPage';
import LessonManagementPage from '@/pages/academy-staff/LessonManagement/LessonManagementPage';

const academyStaffRoutes: PrivateRouteProps[] = [
    { path: '/academy-staff/', component: DashBoardStaffPage, layout: DefaultStaffLayout, allowedRoles: ['AcademicStaff'] },
    { path: '/academy-staff/question-banks', component: QuestionBankManagementPage, layout: DefaultStaffLayout, allowedRoles: ['AcademicStaff'] },
    { path: '/academy-staff/question-banks/add-new', component: QuestionBankFormPage, layout: DefaultStaffLayout, allowedRoles: ['AcademicStaff'] },
    { path: '/academy-staff/question-banks/edit/:id', component: QuestionBankFormPage, layout: DefaultStaffLayout, allowedRoles: ['AcademicStaff'] },
    { path: '/academy-staff/feedbacks/planbook/', component: PlanbookFeedbackManagementPage, layout: DefaultStaffLayout, allowedRoles: ['AcademicStaff'] },
    { path: '/academy-staff/feedbacks/system/', component: SystemFeedbackManagementPage, layout: DefaultStaffLayout, allowedRoles: ['AcademicStaff'] },
    { path: '/academy-staff/subject-in-curriculum', component: SubjectInCurriculumManagementPage, layout: DefaultStaffLayout, allowedRoles: ['AcademicStaff'] },
    { path: '/academy-staff/chapters', component: ChapterManagementPage, layout: DefaultStaffLayout, allowedRoles: ['AcademicStaff'] },
    { path: '/academy-staff/lessons', component: LessonManagementPage, layout: DefaultStaffLayout, allowedRoles: ['AcademicStaff'] },
];

export default academyStaffRoutes;
