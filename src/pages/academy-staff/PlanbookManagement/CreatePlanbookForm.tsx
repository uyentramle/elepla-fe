import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Form, message, Spin, InputRef, Select, Input, Collapse, Switch } from "antd";
import { CreatePlanbookTemplate, createPlanbookTemplate, createPlanbookFromTemplate, createPlanbookUsingAI } from "@/data/academy-staff/PlanbookData";
import { getAllCurriculumFramework, IViewListCurriculum } from "@/data/admin/CurriculumFramworkData";
import { getAllGrade, IViewListGrade } from "@/data/admin/GradeData";
import { getAllSubjectInCurriculumByCurriculumAndGrade, IViewListSubjectInCurriculum } from "@/data/academy-staff/SubjectInCurriculumData";
import { getAllChapterBySubjectInCurriculumId, IViewListChapter } from "@/data/academy-staff/ChapterData";
import { getAllLessonByChapterId, IViewListLesson } from "@/data/academy-staff/LessonData";
import { getActiveUserPackageByUserId, ServicePackage } from "@/data/manager/UserPackageDatas";
import { getUserId } from "@/data/apiClient";
import PackageDetailPage from "@/pages/teacher/User/PackageDetailPage";

const { TextArea } = Input;

interface CreatePlanbookProps {
    collectionId: string;
    isVisible: boolean;
    onClose: () => void;
    onCreate: () => void;
}

const CreatePlanbookForm: React.FC<CreatePlanbookProps> = ({ collectionId, isVisible, onClose, onCreate }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [inputWidth, setInputWidth] = useState(200); // Chiều rộng ban đầu của input
    const [subjectWidth, setSubjectWidth] = useState(80); // Chiều rộng ban đầu của input
    const [classWidth, setClassWidth] = useState(80); // Chiều rộng ban đầu của input
    const inputRef = useRef<InputRef>(null); // Tham chiếu đến input DOM element
    const subjectRef = useRef<InputRef>(null); // Tham chiếu đến input môn học
    const classRef = useRef<InputRef>(null); // Tham chiếu đến input lớp
    const [curriculumFrameworks, setCurriculumFrameworks] = useState<IViewListCurriculum[]>([]);
    const [grades, setGrades] = useState<IViewListGrade[]>([]);
    const [subjectsInCurriculum, setSubjectsInCurriculum] = useState<IViewListSubjectInCurriculum[]>([]);
    const [chapters, setChapters] = useState<IViewListChapter[]>([]);
    const [lessons, setLessons] = useState<IViewListLesson[]>([]);
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(1); // Step tracking
    const [loadingAI, setLoadingAI] = useState(false); // State to manage loading
    const [service, setService] = useState<ServicePackage>();
    const [showPackageDetail, setShowPackageDetail] = useState(false);

    useEffect(() => {
        if (isVisible) {
            form.resetFields();
            setSubjectsInCurriculum([]);
            setChapters([]);
            setLessons([]);
            setSelectedLessonId(null);
            setCurrentStep(1); // Reset to step 1 when modal is opened
            setInputWidth(200); // Reset input width
            setSubjectWidth(80); // Reset subject width
            setClassWidth(80); // Reset class widtha
        }
    }, [isVisible, form]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [curriculumData, gradeData] = await Promise.all([
                    getAllCurriculumFramework(),
                    getAllGrade(),
                ]);
                setCurriculumFrameworks(curriculumData);
                setGrades(gradeData);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch data", error);
                setLoading(false);
            }
        };

        if (isVisible) {
            fetchData();
        }
    }, [isVisible]);

    useEffect(() => {
        const fetchUserPackage = async () => {
            const userPackage = await getActiveUserPackageByUserId(getUserId()!);
            setService(userPackage);
        };

        fetchUserPackage();
    }, []);

    const updateInputWidth = () => {
        if (inputRef.current) {
            const inputLength = inputRef.current.input?.value.length || 0; // Lấy độ dài nội dung trong input
            const newWidth = inputLength < 10 ? 200 : inputLength * 10.5; // Đặt chiều rộng dựa trên độ dài
            setInputWidth(Math.min(newWidth, 600));
        }
    };

    const updateSubjectWidth = () => {
        if (subjectRef.current) {
            const inputLength = subjectRef.current.input?.value.length || 0;
            const newWidth = inputLength < 10 ? 80 : inputLength * 8;
            setSubjectWidth(Math.min(newWidth, 150));
        }
    }

    const updateClassWidth = () => {
        if (classRef.current) {
            const inputLength = classRef.current.input?.value.length || 0;
            const newWidth = inputLength < 10 ? 80 : inputLength * 8;
            setClassWidth(Math.min(newWidth, 150));
        }
    }

    // Fetch subjects based on curriculum and grade selection
    const fetchSubjectsInCurriculum = async (curriculumId: string, gradeId: string) => {
        if (curriculumId && gradeId) {
            const subjects = await getAllSubjectInCurriculumByCurriculumAndGrade(curriculumId, gradeId);
            setSubjectsInCurriculum(subjects);
        }
    };

    const handleCurriculumOrGradeChange = () => {
        // form.setFieldsValue({ subjectInCurriculumId: undefined, chapterId: undefined, lessonId: undefined });
        // const curriculumId = form.getFieldValue('curriculumId');
        // const gradeId = form.getFieldValue('gradeId');
        // fetchSubjectsInCurriculum(curriculumId, gradeId);

        // Lấy giá trị hiện tại của các trường cha
        const curriculumId = form.getFieldValue('curriculumId');
        const gradeId = form.getFieldValue('gradeId');
        form.setFieldsValue({
            subjectInCurriculumId: null,
            chapterId: null,
            lessonId: null
        });

        // Nếu chọn đầy đủ, fetch dữ liệu mới
        fetchSubjectsInCurriculum(curriculumId, gradeId);
    };
    // Hàm để lấy các chương học dựa trên subjectInCurriculumId
    const fetchChapters = async (subjectInCurriculumId: string) => {
        try {
            setLoading(true);
            const chapterData = await getAllChapterBySubjectInCurriculumId(subjectInCurriculumId);
            setChapters(chapterData);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch chapters", error);
            setLoading(false);
        }
    };

    // Hàm để lấy các bài học dựa trên các lựa chọn hiện tại
    const fetchLessons = async (chapterId: string) => {
        try {
            setLoading(true);
            const lessonData = await getAllLessonByChapterId(chapterId);
            setLessons(lessonData);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch lessons", error);
            setLoading(false);
        }
    };

    const handleCreate = () => {
        if (currentStep === 1) {
            setCurrentStep(2);
            return;
        }

        form.validateFields().then(async (values) => {
            const newPlanbook: CreatePlanbookTemplate = {
                ...values,
                isDefault: false,
                collectionId: collectionId,
                lessonId: selectedLessonId,
            };

            setLoading(true);
            const success = await createPlanbookTemplate(newPlanbook);
            setLoading(false);

            if (success) {
                message.success('Bài dạy đã được thêm thành công!');
                form.resetFields();
                onCreate();
            } else {
                message.error('Có lỗi xảy ra khi thêm bài dạy!');
            }
        });
    }

    const handleUseTemplate = async () => {
        if (!selectedLessonId) {
            message.error('Vui lòng chọn bài học trước khi sử dụng dữ liệu mẫu!');
            return;
        }

        if (service?.useTemplate) {
            try {
                const response = await createPlanbookFromTemplate(selectedLessonId);

                if (response) {
                    form.setFieldsValue(response);
                    message.success('Đã tải dữ liệu mẫu thành công!');

                    // Cập nhật chiều rộng các input dựa trên giá trị từ response
                    const titleLength = response.title.length || 0;
                    const subjectLength = response.subject.length || 0;

                    // Cập nhật chiều rộng với công thức
                    setInputWidth(titleLength < 10 ? 200 : titleLength * 8);
                    setSubjectWidth(subjectLength < 10 ? 80 : subjectLength * 8);
                } else {
                    message.error('Không có dữ liệu mẫu cho bài học này!');
                }
            } catch (error) {
                console.error('Error calling createPlanbookFromTemplate API:', error);
                message.error('Có lỗi xảy ra khi tạo bài dạy từ mẫu!');
            }
        } else {
            setShowPackageDetail(true);
        }
    }

    const handleUseAI = async () => {
        if (!selectedLessonId) {
            message.error('Vui lòng chọn bài học trước khi sử dụng AI!');
            return;
        }

        if (service?.useAI) {
            setLoadingAI(true);

            try {
                const response = await createPlanbookUsingAI(selectedLessonId);

                if (response) {
                    form.setFieldsValue(response);
                    message.success('Đã tạo dữ liệu từ AI thành công!');

                    // Cập nhật chiều rộng các input dựa trên giá trị từ response
                    const titleLength = response.title.length || 0;
                    const subjectLength = response.subject.length || 0;

                    // Cập nhật chiều rộng với công thức
                    setInputWidth(titleLength < 10 ? 200 : titleLength * 8);
                    setSubjectWidth(subjectLength < 10 ? 80 : subjectLength * 8);
                } else {
                    message.error('Không thể tạo bài dạy từ AI!');
                }
            } catch (error) {
                console.error('Error calling createPlanbookUsingAI API:', error);
                message.error('Có lỗi xảy ra khi tạo bài dạy từ AI!');
            } finally {
                setLoadingAI(false);
            }
        } else {
            setShowPackageDetail(true);
        }
    }

    const handleSubjectInCurriculumSelect = (value: string | null) => {
        if (!value) {
            form.setFieldsValue({ chapterId: null, lessonId: null });
            setChapters([]); // Reset danh sách chương
            setLessons([]); // Reset danh sách bài học
            return;
        }

        fetchChapters(value);
        form.setFieldsValue({ chapterId: null, lessonId: null });
    };

    const handleChapterSelect = (value: string | null) => {
        if (!value) {
            form.setFieldsValue({ lessonId: null });
            setLessons([]); // Reset danh sách bài học
            return;
        }

        fetchLessons(value);
        form.setFieldsValue({ lessonId: null });
    };

    const handleLessonSelect = (lessonId: string) => {
        setSelectedLessonId(lessonId);
    };

    const handleOk = () => {
        setShowPackageDetail(false);
    };

    const handleCancel = () => {
        setShowPackageDetail(false);
    };

    return (
        <Modal
            visible={isVisible}
            onCancel={loadingAI ? () => { } : onClose}  // Vô hiệu hóa nút x khi loadingAI là true
            footer={[
                <Button key="close" onClick={onClose} disabled={loadingAI}> {/* Disable when loadingAI is true */}
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleCreate}
                    disabled={loadingAI || currentStep === 1 && !form.getFieldValue('lessonId')} // Disable when loadingAI is true
                >
                    {currentStep === 1 ? "Tiếp" : "Thêm"}
                </Button>,
            ]}
            width={currentStep === 1 ? 550 : 800} // Điều chỉnh chiều rộng modal theo bước
            style={{ top: '5vh' }}
        >
            <Form form={form} layout="vertical">
                {currentStep === 1 && (
                    <>    <Form.Item label="Chọn Khung chương trình" name="curriculumId" rules={[{ required: true }]}>
                        <Select
                            options={curriculumFrameworks.map((item) => ({ value: item.curriculumId, label: item.name }))}
                            onChange={handleCurriculumOrGradeChange} // Trigger fetch when curriculum changes
                        />
                    </Form.Item>
                        <Form.Item label="Chọn Khối" name="gradeId" rules={[{ required: true }]}>
                            <Select
                                options={grades.map((item) => ({ value: item.gradeId, label: item.name }))}
                                onChange={handleCurriculumOrGradeChange} // Trigger fetch when grade changes
                            />
                        </Form.Item>
                        <Form.Item label="Chọn Môn học trong Chương trình" name="subjectInCurriculumId" rules={[{ required: true }]}>
                            <Select
                                options={subjectsInCurriculum.map((item) => ({ value: item.subjectInCurriculumId, label: item.name }))}
                                onChange={handleSubjectInCurriculumSelect}
                            />
                        </Form.Item>
                        <Form.Item label="Chọn Chương" name="chapterId" rules={[{ required: true }]}>
                            <Select
                                options={chapters.map((chapter) => ({ value: chapter.chapterId, label: chapter.name }))}
                                onChange={handleChapterSelect}
                            />
                        </Form.Item>
                        <Form.Item label="Chọn Bài học" name="lessonId" rules={[{ required: true }]}>
                            <Select
                                options={lessons.map((lesson) => ({ value: lesson.lessonId, label: lesson.name }))}
                                onChange={handleLessonSelect}
                            />
                        </Form.Item>
                    </>
                )}
                {currentStep === 2 && (
                    <div className="container mx-auto px-4 py-8">

                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <Spin size="large" />
                                <span className="ml-3">Đang tải dữ liệu...</span>
                            </div>
                        ) : (
                            <Spin
                                spinning={loadingAI}
                                tip="Đang tạo bài dạy từ AI..."
                                style={{
                                    position: 'fixed', // Đặt Spin ở vị trí cố định
                                    top: '50%', // Căn giữa theo chiều dọc
                                    left: '50%', // Căn giữa theo chiều ngang
                                    transform: 'translate(-50%, -50%)', // Dịch chuyển về giữa chính xác
                                    zIndex: 1000, // Đảm bảo Spin hiển thị trên các phần tử khác
                                    display: 'flex', // Dùng Flexbox để căn giữa
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleCreate}
                                    initialValues={{
                                        isPublic: false, // Default value for 'isPublic'
                                    }}
                                    style={{ position: 'relative' }}
                                >
                                    {/* Thông tin trường và giáo viên */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-semibold">Trường:</span>
                                                <Form.Item
                                                    name="schoolName"
                                                    rules={[{ required: true, message: '' }]}
                                                    style={{ marginBottom: 0 }} // Loại bỏ margin dưới Form.Item
                                                >
                                                    <Input
                                                        placeholder="Nhập tên trường"
                                                        style={{
                                                            fontSize: "14px",
                                                            padding: "4px 8px",
                                                            width: "200px",
                                                            fontWeight: "600", // semibold
                                                        }}
                                                    />
                                                </Form.Item>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-semibold">Tổ:</span>
                                                <span className="text-lg font-semibold">...</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold">Họ và tên giáo viên</p>
                                            <Form.Item
                                                name="teacherName"
                                                rules={[{ required: true, message: '' }]}
                                                style={{ marginBottom: 0 }}
                                            >
                                                <Input
                                                    placeholder="Nhập tên giáo viên"
                                                    style={{
                                                        fontSize: "14px",
                                                        padding: "4px 8px",
                                                        width: "200px",
                                                        textAlign: "right",
                                                        fontWeight: "600", // semibold
                                                    }}
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>

                                    {/* Tên bài dạy và thông tin môn học */}
                                    <div className="text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            {/* Tên bài dạy */}
                                            <h1 className="text-lg font-bold">Tên bài dạy:</h1>
                                            <Form.Item
                                                name="title"
                                                rules={[{ required: true, message: 'Vui lòng nhập tên bài dạy' }]}
                                            >
                                                <Input
                                                    ref={inputRef} // Gán ref cho Input
                                                    placeholder="Nhập tên bài dạy"
                                                    style={{
                                                        fontSize: '17px',
                                                        fontWeight: 'bold',
                                                        borderRadius: '8px',
                                                        paddingLeft: '10px',
                                                        marginTop: '25px',
                                                        width: `${inputWidth}px`, // Chiều rộng thay đổi tự động
                                                        transition: 'width 0.3s ease', // Hiệu ứng chuyển động mượt mà
                                                    }}
                                                    onChange={updateInputWidth} // Cập nhật chiều rộng mỗi khi người dùng thay đổi
                                                />
                                            </Form.Item>
                                        </div>

                                        <div className="flex items-center justify-center">
                                            {/* Môn học */}
                                            <span className="text-base mr-1">Môn học:</span>
                                            <Form.Item
                                                name="subject"
                                                // rules={[{ required: true, message: "Vui lòng nhập tên môn học" }]}
                                                rules={[{ required: true, message: '' }]}  // Kiểm tra trường hợp không nhập, không hiển thị message lỗi
                                                style={{ marginBottom: 0 }} // Loại bỏ margin để tránh khoảng cách thừa
                                            >
                                                <Input
                                                    ref={subjectRef} // Gán ref cho Input
                                                    placeholder="Nhập môn học"
                                                    style={{
                                                        fontSize: "14px",
                                                        padding: "4px 8px",
                                                        // width: "80px", // Đặt chiều rộng hợp lý
                                                        width: `${subjectWidth}px`, // Chiều rộng thay đổi tự động
                                                        transition: 'width 0.3s ease', // Hiệu ứng chuyển động mượt mà
                                                    }}
                                                    onChange={updateSubjectWidth} // Cập nhật chiều rộng mỗi khi người dùng thay đổi
                                                />
                                            </Form.Item>
                                            {/* Dấu phẩy */}
                                            <span className="text-base mr-1">, Lớp:</span>
                                            {/* Lớp */}
                                            <Form.Item
                                                name="className"
                                                rules={[{ required: true, message: '' }]}
                                                style={{ marginBottom: 0 }} // Loại bỏ margin để tránh khoảng cách thừa
                                            >
                                                <Input
                                                    ref={classRef} // Gán ref cho Input
                                                    placeholder="Nhập lớp"
                                                    style={{
                                                        fontSize: "14px",
                                                        padding: "4px 8px",
                                                        // width: "80px", // Đặt chiều rộng hợp lý
                                                        width: `${classWidth}px`, // Chiều rộng thay đổi tự động
                                                        transition: 'width 0.3s ease', // Hiệu ứng chuyển động mượt mà
                                                    }}
                                                    onChange={updateClassWidth}
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="text-base mt-1">
                                            <p className="inline-block">Thời gian thực hiện: (</p>
                                            <Form.Item
                                                name="durationInPeriods"
                                                rules={[{ required: true, message: 'Vui lòng nhập số tiết' }]}
                                                style={{ display: 'inline-block', width: 'auto' }}
                                            >
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={9}
                                                    className="w-12 text-center border rounded-md"
                                                    placeholder="1"
                                                    style={{ marginTop: '-5px' }}
                                                />
                                            </Form.Item>
                                            <span className="inline-block ml-1">tiết)</span>
                                        </div>

                                    </div>

                                    <div className="mb-4 flex justify-end gap-2">
                                        <Button
                                            onClick={handleUseTemplate}
                                            loading={loading}
                                            style={{
                                                backgroundColor: '#d9d9d9', // Màu xám nhẹ cho "Dữ liệu mẫu"
                                                borderColor: '#d9d9d9', // Viền màu xám giống background
                                                color: '#000', // Chữ màu đen cho dễ đọc
                                            }}
                                            className="hover:bg-gray-500 hover:border-gray-500 hover:text-white"
                                        >
                                            Dữ liệu mẫu
                                        </Button>
                                        <Button
                                            onClick={handleUseAI}
                                            loading={loading}
                                            style={{
                                                // backgroundColor: '#52c41a', // Màu xanh lá cây cho "Sử dụng AI"
                                                // borderColor: '#52c41a', // Viền màu xanh lá cây
                                                // color: '#fff', // Chữ màu trắng
                                                backgroundColor: '#d9d9d9', // Màu xám nhẹ cho "Dữ liệu mẫu"
                                                borderColor: '#d9d9d9', // Viền màu xám giống background
                                                color: '#000', // Chữ màu đen cho dễ đọc
                                            }}
                                            // className="hover:bg-green-600 hover:border-green-600"
                                            className="hover:bg-gray-500 hover:border-gray-500 hover:text-white"
                                        >
                                            Sử dụng AI
                                        </Button>
                                    </div>

                                    {/* Mục tiêu */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold">I. Mục tiêu</h3>
                                        {/* Về kiến thức */}
                                        <Form.Item
                                            label={<span className="font-bold text-base">1. Về kiến thức</span>}
                                            name="knowledgeObjective"
                                            rules={[{ required: true, message: "Vui lòng nhập mục tiêu về kiến thức" }]}
                                        >
                                            <TextArea
                                                placeholder="Nhập mục tiêu về kiến thức"
                                                autoSize
                                                style={{
                                                    fontSize: "14px",
                                                    lineHeight: "1.5",
                                                    padding: "10px",
                                                }}
                                            />
                                        </Form.Item>
                                        {/* Về năng lực */}
                                        <Form.Item
                                            label={<span className="font-bold text-base">2. Về năng lực</span>}
                                            name="skillsObjective"
                                            rules={[{ required: true, message: "Vui lòng nhập mục tiêu về năng lực" }]}
                                        >
                                            <TextArea
                                                placeholder="Nhập mục tiêu về năng lực"
                                                autoSize
                                                style={{
                                                    fontSize: "14px",
                                                    lineHeight: "1.5",
                                                    padding: "10px",
                                                }}
                                            />
                                        </Form.Item>
                                        {/* Về phẩm chất */}
                                        <Form.Item
                                            label={<span className="font-bold text-base">3. Về phẩm chất</span>}
                                            name="qualitiesObjective"
                                            rules={[{ required: true, message: "Vui lòng nhập mục tiêu về phẩm chất" }]}
                                        >
                                            <TextArea
                                                placeholder="Nhập mục tiêu về phẩm chất"
                                                autoSize
                                                style={{
                                                    fontSize: "14px",
                                                    lineHeight: "1.5",
                                                    padding: "10px",
                                                }}
                                            />
                                        </Form.Item>
                                    </div>

                                    {/* Thiết bị dạy học */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold">II. Thiết bị dạy học và học liệu</h3>
                                        <Form.Item
                                            name="teachingTools"
                                            rules={[{ required: true, message: "Vui lòng nhập thiết bị dạy học và học liệu" }]}
                                        >
                                            <TextArea
                                                placeholder="Nhập thiết bị dạy học và học liệu"
                                                autoSize
                                                style={{
                                                    fontSize: "14px",
                                                    lineHeight: "1.5",
                                                    padding: "10px",
                                                }}
                                            />
                                        </Form.Item>
                                    </div>

                                    {/* Tiến trình dạy học */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold">III. Tiến trình dạy học</h3>
                                        <Form.List name="activities">
                                            {(fields, { add, remove }) => (
                                                <>
                                                    <Collapse>
                                                        {fields.map((field, index) => (
                                                            <Collapse.Panel
                                                                header={
                                                                    <h4 className="font-bold">{`Hoạt động ${index + 1}: Chưa có tiêu đề`}</h4>
                                                                }
                                                                key={`activity-${index}`}
                                                            >
                                                                {/* Tiêu đề */}
                                                                <Form.Item
                                                                    label={<strong>Tiêu đề</strong>}
                                                                    name={[field.name, "title"]}
                                                                    rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                                                                >
                                                                    <Input placeholder="Nhập tiêu đề hoạt động" />
                                                                </Form.Item>
                                                                {/* Mục tiêu */}
                                                                <Form.Item
                                                                    label={<strong>a) Mục tiêu</strong>}
                                                                    name={[field.name, "objective"]}
                                                                    rules={[{ required: true, message: "Vui lòng nhập mục tiêu" }]}
                                                                >
                                                                    <TextArea
                                                                        placeholder="Nhập mục tiêu"
                                                                        autoSize
                                                                        style={{
                                                                            fontSize: "14px",
                                                                            lineHeight: "1.5",
                                                                            padding: "10px",
                                                                        }}
                                                                    />
                                                                </Form.Item>
                                                                {/* Nội dung */}
                                                                <Form.Item
                                                                    label={<strong>b) Nội dung</strong>}
                                                                    name={[field.name, "content"]}
                                                                    rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
                                                                >
                                                                    <TextArea
                                                                        placeholder="Nhập nội dung"
                                                                        autoSize
                                                                        style={{
                                                                            fontSize: "14px",
                                                                            lineHeight: "1.5",
                                                                            padding: "10px",
                                                                        }}
                                                                    />
                                                                </Form.Item>
                                                                {/* Sản phẩm */}
                                                                <Form.Item
                                                                    label={<strong>c) Sản phẩm</strong>}
                                                                    name={[field.name, "product"]}
                                                                    rules={[{ required: true, message: "Vui lòng nhập sản phẩm" }]}
                                                                >
                                                                    <TextArea
                                                                        placeholder="Nhập sản phẩm"
                                                                        autoSize
                                                                        style={{
                                                                            fontSize: "14px",
                                                                            lineHeight: "1.5",
                                                                            padding: "10px",
                                                                        }}
                                                                    />
                                                                </Form.Item>
                                                                {/* Tổ chức thực hiện */}
                                                                <Form.Item
                                                                    label={<strong>d) Tổ chức thực hiện</strong>}
                                                                    name={[field.name, "implementation"]}
                                                                    rules={[{ required: true, message: "Vui lòng nhập cách tổ chức thực hiện" }]}
                                                                >
                                                                    <TextArea
                                                                        placeholder="Nhập cách tổ chức thực hiện"
                                                                        autoSize
                                                                        style={{
                                                                            fontSize: "14px",
                                                                            lineHeight: "1.5",
                                                                            padding: "10px",
                                                                        }}
                                                                    />
                                                                </Form.Item>
                                                                <Button type="default" danger onClick={() => remove(field.name)} style={{ marginTop: '10px' }}>
                                                                    Xóa hoạt động
                                                                </Button>
                                                            </Collapse.Panel>
                                                        ))}
                                                    </Collapse>
                                                    <Button type="dashed" onClick={() => add()} style={{ marginTop: '20px' }}>
                                                        Thêm hoạt động
                                                    </Button>
                                                </>
                                            )}
                                        </Form.List>
                                    </div>

                                    {/* Ghi chú */}
                                    <div className="mb-6">
                                        <h3 className="text-base font-bold">Ghi chú</h3>
                                        <Form.Item name="notes">
                                            <TextArea
                                                placeholder="Nhập ghi chú"
                                                autoSize
                                                style={{
                                                    fontSize: "14px",
                                                    lineHeight: "1.5",
                                                    padding: "10px",
                                                }}
                                            />
                                        </Form.Item>
                                    </div>

                                    {/* Công khai */}
                                    <Form.Item name="isPublic" valuePropName="checked">
                                        <Switch checkedChildren="Công khai" unCheckedChildren="Riêng tư" />
                                    </Form.Item>
                                </Form>
                            </Spin>

                        )}

                        <Modal
                            visible={showPackageDetail}
                            onOk={handleOk}
                            onCancel={handleCancel}
                            footer={null}
                            width={800}
                            style={{ top: '10vh' }}
                        >
                            <PackageDetailPage />
                        </Modal >
                    </div>
                )}
            </Form>
        </Modal>
    );
};

export default CreatePlanbookForm;