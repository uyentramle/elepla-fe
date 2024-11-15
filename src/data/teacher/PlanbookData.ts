export interface Activity {
    activityId: string;
    title: string;
    objective: string;
    content: string;
    product: string;
    implementation: string;
    index: number;
    planbookId: string;
}

export interface Planbook {
    planbookId: string;
    title: string;
    schoolName: string;
    teacherName: string;
    subject: string;
    className: string;
    durationInPeriods: number;
    knowledgeObjective: string;
    skillsObjective: string;
    qualitiesObjective: string;
    teachingTools: string;
    notes: string;
    collectionId: string;
    collectionName: string;
    lessonId: string;
    lessonName: string;
    activities: Activity[];
    createdAt: Date;
    createdBy: string;
    updatedAt: Date | null;
    updatedBy: string | null;
    deletedAt: Date | null;
    deletedBy: string | null;
    isDeleted: boolean;
}

const planbookData: Planbook[] = [
    {
        planbookId: "hhh",
        title: "Tên bài dạy",
        schoolName: "Tên Trường",
        teacherName: "Tên giáo viên",
        subject: "Môn học",
        className: "Tên Lớp",
        durationInPeriods: 2,
        knowledgeObjective: "Nêu cụ thể nội dung kiến thức học sinh cần học...",
        skillsObjective: "Nêu cụ thể yêu cầu học sinh làm được gì...",
        qualitiesObjective: "Nêu cụ thể yêu cầu về hành vi, thái độ...",
        teachingTools: "Nêu cụ thể các thiết bị dạy học...",
        notes: "1. Mỗi bài dạy có thể được thực hiện trong nhiều tiết học...",
        collectionId: "1",
        collectionName: "Bộ sưu tập 1",
        lessonId: "11",
        lessonName: "Môn a",
        activities: [
            {
                activityId: "a1",
                title: "Xác định vấn đề/nhiệm vụ học tập/Mở đầu",
                objective: "Nêu mục tiêu giúp học sinh xác định được vấn đề...",
                content: "Nêu rõ nội dung yêu cầu/nhiệm vụ cụ thể...",
                product: "Trình bày cụ thể yêu cầu về nội dung và hình thức...",
                implementation: "Trình bày cụ thể các bước tổ chức hoạt động học...",
                index: 1,
                planbookId: "hhh",
            },
            {
                activityId: "a2",
                title: "Hình thành kiến thức mới/giải quyết vấn đề...",
                objective: "Nêu mục tiêu giúp học sinh thực hiện nhiệm vụ học tập...",
                content: "Nêu rõ nội dung yêu cầu/nhiệm vụ cụ thể của học sinh...",
                product: "Trình bày cụ thể về kiến thức mới...",
                implementation: "Hướng dẫn, hỗ trợ, kiểm tra...",
                index: 2,
                planbookId: "hhh",
            },
            {
                activityId: "3f26bf00-9480-472c-a15c-39987748d855",
                title: "Luyện tập",
                objective: "Nêu rõ mục tiêu vận dụng kiến thức đã học...",
                content: "Nêu rõ nội dung cụ thể của hệ thống câu hỏi...",
                product: "Đáp án, lời giải của các câu hỏi...",
                implementation: "Nêu rõ cách thức giao nhiệm vụ cho học sinh...",
                index: 3,
                planbookId: "hhh",
            }
        ],
        createdAt: new Date("2024-10-15"),
        createdBy: "23b060bc-b3d7-4e5a-804e-abc9d3ed02f9",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDeleted: false
    },
    {
        planbookId: "h2",
        title: "Dao động điều hòa",
        schoolName: "Tên Trường",
        teacherName: "Tên giáo viên",
        subject: "Vật lý 11",
        className: "Tên Lớp",
        durationInPeriods: 2,
        knowledgeObjective: "Nêu cụ thể nội dung kiến thức học sinh cần học...",
        skillsObjective: "Nêu cụ thể yêu cầu học sinh làm được gì...",
        qualitiesObjective: "Nêu cụ thể yêu cầu về hành vi, thái độ...",
        teachingTools: "Nêu cụ thể các thiết bị dạy học...",
        notes: "1. Mỗi bài dạy có thể được thực hiện trong nhiều tiết học...",
        collectionId: "2",
        collectionName: "Bộ sưu tập 1",
        lessonId: "11",
        lessonName: "Môn a",
        activities: [
            {
                activityId: "a1",
                title: "Xác định vấn đề/nhiệm vụ học tập/Mở đầu",
                objective: "Nêu mục tiêu giúp học sinh xác định được vấn đề...",
                content: "Nêu rõ nội dung yêu cầu/nhiệm vụ cụ thể...",
                product: "Trình bày cụ thể yêu cầu về nội dung và hình thức...",
                implementation: "Trình bày cụ thể các bước tổ chức hoạt động học...",
                index: 1,
                planbookId: "h2",
            },
            {
                activityId: "a2",
                title: "Hình thành kiến thức mới/giải quyết vấn đề...",
                objective: "Nêu mục tiêu giúp học sinh thực hiện nhiệm vụ học tập...",
                content: "Nêu rõ nội dung yêu cầu/nhiệm vụ cụ thể của học sinh...",
                product: "Trình bày cụ thể về kiến thức mới...",
                implementation: "Hướng dẫn, hỗ trợ, kiểm tra...",
                index: 2,
                planbookId: "h2",
            },
            {
                activityId: "3f26bf00-9480-472c-a15c-39987748d855",
                title: "Luyện tập",
                objective: "Nêu rõ mục tiêu vận dụng kiến thức đã học...",
                content: "Nêu rõ nội dung cụ thể của hệ thống câu hỏi...",
                product: "Đáp án, lời giải của các câu hỏi...",
                implementation: "Nêu rõ cách thức giao nhiệm vụ cho học sinh...",
                index: 3,
                planbookId: "h2",
            }
        ],
        createdAt: new Date("2024-10-15"),
        createdBy: "23b060bc-b3d7-4e5a-804e-abc9d3ed02f9",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDeleted: false
    }
];

export default planbookData;
