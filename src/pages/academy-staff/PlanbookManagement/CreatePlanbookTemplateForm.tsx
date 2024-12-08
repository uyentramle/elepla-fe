import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Form, message, Spin, InputRef, Select, Input, Collapse, Checkbox } from "antd";
import { CreatePlanbookTemplate, createPlanbookTemplate } from "@/data/academy-staff/PlanbookData";
import { getAllCurriculumFramework, IViewListCurriculum } from "@/data/admin/CurriculumFramworkData";
import { getAllGrade, IViewListGrade } from "@/data/admin/GradeData";
import { getAllSubjectInCurriculumByCurriculumAndGrade, IViewListSubjectInCurriculum } from "@/data/academy-staff/SubjectInCurriculumData";
import { getAllChapterBySubjectInCurriculumId, IViewListChapter } from "@/data/academy-staff/ChapterData";
import { getAllLessonByChapterId, IViewListLesson } from "@/data/academy-staff/LessonData";

const { TextArea } = Input;

interface CreatePlanbookTemplateFormProps {
    isVisible: boolean;
    onClose: () => void;
    onCreate: () => void;
}

const CreatePlanbookTemplateForm: React.FC<CreatePlanbookTemplateFormProps> = ({ isVisible, onClose, onCreate }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [inputWidth, setInputWidth] = useState(200); // Chiều rộng ban đầu của input
    const inputRef = useRef<InputRef>(null); // Tham chiếu đến input DOM element
    const [curriculumFrameworks, setCurriculumFrameworks] = useState<IViewListCurriculum[]>([]);
    const [grades, setGrades] = useState<IViewListGrade[]>([]);
    const [subjectsInCurriculum, setSubjectsInCurriculum] = useState<IViewListSubjectInCurriculum[]>([]);
    const [chapters, setChapters] = useState<IViewListChapter[]>([]);
    const [lessons, setLessons] = useState<IViewListLesson[]>([]);
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(1); // Step tracking

    useEffect(() => {
        if (isVisible) {
            form.resetFields();
            setSubjectsInCurriculum([]);
            setChapters([]);
            setLessons([]);
            setSelectedLessonId(null);
            setCurrentStep(1); // Reset to step 1 when modal is opened
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

    const updateInputWidth = () => {
        if (inputRef.current) {
            const inputLength = inputRef.current.input?.value.length || 0; // Lấy độ dài nội dung trong input
            const newWidth = inputLength < 10 ? 200 : inputLength * 10.5; // Đặt chiều rộng dựa trên độ dài
            setInputWidth(newWidth); // Cập nhật chiều rộng
        }
    };

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
                schoolName: '',
                teacherName: '',
                className: '',
                isDefault: true,
                isPublic: false,
                collectionId: null,
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

    return (
        <Modal
            visible={isVisible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose} loading={loading}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleCreate} disabled={currentStep === 1 && !form.getFieldValue('lessonId')} loading={loading}
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
                    <>
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <Spin size="large" />
                                <span className="ml-3">Đang tải dữ liệu...</span>
                            </div>
                        ) : (
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleCreate}
                                initialValues={{
                                    isPublic: false, // Default value for 'isPublic'
                                }}
                            >
                                {/* Tên bài dạy và thông tin môn học */}
                                <div className="text-center mb-6">
                                    <div className="flex items-center justify-center space-x-2">
                                        {/* Tên bài dạy */}
                                        <h1 className="text-lg font-bold">Tên bài dạy:</h1>
                                        <Form.Item
                                            name="title"
                                            rules={[{ required: true, message: 'Vui lòng nhập tên bài dạy' }]}
                                        >
                                            <Input
                                                ref={inputRef} // Gán ref cho Input
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
                                    <Form.Item name="subject" style={{ display: 'none' }}>
                                        <Input type="hidden" value="" />
                                    </Form.Item>
                                    <Form.Item name="className" style={{ display: 'none' }}>
                                        <Input type="hidden" value="" />
                                    </Form.Item>
                                    <div className="text-base mt-1">
                                        <p className="inline-block">Môn học:</p>
                                        <Form.Item
                                            name="subject"
                                            rules={[{ required: true, message: 'Vui lòng nhập môn học' }]}
                                            style={{ display: 'inline-block', width: 'auto', marginLeft: '5px' }}
                                        >
                                            <Input
                                                style={{
                                                    borderRadius: '8px',
                                                    marginTop: '-5px',
                                                    width: '150px',
                                                }}
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
                                <Form.Item name="isPublic" valuePropName="checked" style={{ display: 'none' }}>
                                    <Checkbox>Công khai</Checkbox>
                                </Form.Item>
                            </Form>
                        )}
                    </>
                )}
            </Form>
        </Modal>
    );
};

export default CreatePlanbookTemplateForm;