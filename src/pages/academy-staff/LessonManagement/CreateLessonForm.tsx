import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, message, Button } from "antd";
import { getAllCurriculumFramework, IViewListCurriculum } from "@/data/admin/CurriculumFramworkData";
import { getAllGrade, IViewListGrade } from "@/data/admin/GradeData";
import { getAllSubjectInCurriculumByCurriculumAndGrade, IViewListSubjectInCurriculum } from "@/data/academy-staff/SubjectInCurriculumData";
import { getAllChapterBySubjectInCurriculumId, IViewListChapter } from "@/data/academy-staff/ChapterData";
import { createLessonFunction } from "@/data/academy-staff/LessonData";

interface CreateLessonFormProps {
    isVisible: boolean;
    onClose: () => void;
    onCreate: () => void;
}

const CreateLessonForm: React.FC<CreateLessonFormProps> = ({ isVisible, onClose, onCreate }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [curriculumFrameworks, setCurriculumFrameworks] = useState<IViewListCurriculum[]>([]);
    const [grades, setGrades] = useState<IViewListGrade[]>([]);
    const [subjectsInCurriculum, setSubjectsInCurriculum] = useState<IViewListSubjectInCurriculum[]>([]);
    const [chapters, setChapters] = useState<IViewListChapter[]>([]);

    useEffect(() => {
        form.resetFields();
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
    }, [isVisible, form]);

    const fetchSubjectsInCurriculum = async (curriculumId: string, gradeId: string) => {
        if (curriculumId && gradeId) {
            const subjects = await getAllSubjectInCurriculumByCurriculumAndGrade(curriculumId, gradeId);
            setSubjectsInCurriculum(subjects);
        }
    };

    const handleCurriculumOrGradeChange = () => {
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

    const handleSubjectInCurriculumSelect = (value: string | null) => {
        if (!value) {
            form.setFieldsValue({ chapterId: null, lessonId: null });
            setChapters([]); // Reset danh sách chương
            return;
        }

        fetchChapters(value);
        form.setFieldsValue({ chapterId: null, lessonId: null });
    };

    const handleCreate = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            const lesson = {
                name: values.name,
                objectives: values.objectives,
                content: values.content,
                chapterId: values.chapterId,
            };
            const success = await createLessonFunction(lesson);
            if (success) {
                message.success("Tạo bài học thành công!");
                form.resetFields();
                onCreate();
            }
        } catch (error) {
            console.error("Error creating lesson:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            // title="Thêm bài học mới"
            visible={isVisible}
            onCancel={loading ? () => { } : onClose}
            onOk={handleCreate}
            footer={[
                <Button key="close" onClick={onClose} loading={loading}> {/* Disable when loadingAI is true */}
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleCreate}
                    loading={loading}
                >
                    Thêm
                </Button>,
            ]}
            style={{ top: '8vh' }}
        >
            <Form form={form} layout="vertical">
                <div className="flex gap-2">
                    <Form.Item className="w-1/2" label="Chọn Khung chương trình" name="curriculumId" rules={[{ required: true, message: "Vui lòng chọn khung chương trình!" }]}>
                        <Select
                            options={curriculumFrameworks.map((item) => ({ value: item.curriculumId, label: item.name }))}
                            onChange={handleCurriculumOrGradeChange} // Trigger fetch when curriculum changes
                        />
                    </Form.Item>
                    <Form.Item className="w-1/2" label="Chọn Khối" name="gradeId" rules={[{ required: true, message: "Vui lòng chọn khối!" }]}>
                        <Select
                            options={grades.map((item) => ({ value: item.gradeId, label: item.name }))}
                            onChange={handleCurriculumOrGradeChange} // Trigger fetch when grade changes
                        />
                    </Form.Item>
                </div>
                <Form.Item label="Chọn Môn học" name="subjectInCurriculumId" rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}>
                    <Select
                        options={subjectsInCurriculum.map((item) => ({ value: item.subjectInCurriculumId, label: item.subject }))}
                        onChange={handleSubjectInCurriculumSelect}
                    />
                </Form.Item>
                <Form.Item label="Chọn Chương" name="chapterId" rules={[{ required: true, message: "Vui lòng chọn chương!" }]}>
                    <Select
                        options={chapters.map((chapter) => ({ value: chapter.chapterId, label: chapter.name }))}
                    />
                </Form.Item>
                <Form.Item
                    label="Tên bài học"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên bài học!" }]}
                >
                    <Input placeholder="Nhập tên bài học" />
                </Form.Item>
                <Form.Item
                    label="Mô tả"
                    name="objectives"
                // rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                >
                    <Input.TextArea autoSize={{ minRows: 2, maxRows: 2 }} placeholder="Nhập mô tả bài học" />
                </Form.Item>
                <Form.Item
                    label="Nội dung"
                    name="content"
                >
                    <Input.TextArea autoSize={{ minRows: 2, maxRows: 2 }} placeholder="Nhập nội dung bài học" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateLessonForm;
