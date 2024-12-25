import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, message, Button } from "antd";
import { getAllCurriculumFramework, IViewListCurriculum } from "@/data/admin/CurriculumFramworkData";
import { getAllGrade, IViewListGrade } from "@/data/admin/GradeData";
import { getAllSubjectInCurriculumByCurriculumAndGrade, IViewListSubjectInCurriculum } from "@/data/academy-staff/SubjectInCurriculumData";
import { getAllChapterBySubjectInCurriculumId, IViewListChapter } from "@/data/academy-staff/ChapterData";
import { updateLessonFunction, getLessonById } from "@/data/academy-staff/LessonData";  // Giả sử đây là hàm cập nhật bài học

interface UpdateLessonFormProps {
    lessonId: string;  
    isVisible: boolean;
    onClose: () => void;
}

const UpdateLessonForm: React.FC<UpdateLessonFormProps> = ({ lessonId, isVisible, onClose }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [curriculumFrameworks, setCurriculumFrameworks] = useState<IViewListCurriculum[]>([]);
    const [grades, setGrades] = useState<IViewListGrade[]>([]);
    const [subjectsInCurriculum, setSubjectsInCurriculum] = useState<IViewListSubjectInCurriculum[]>([]);
    const [chapters, setChapters] = useState<IViewListChapter[]>([]);

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
        const fetchLessonData = async () => {
            try {
                setLoading(true);
                // Giả sử hàm fetch lesson thông qua lessonId
                const lessonData = await getLessonById(lessonId);
                form.setFieldsValue({
                    curriculumId: lessonData.curriculumId,
                    gradeId: lessonData.gradeId,
                    subjectInCurriculumId: lessonData.subjectInCurriculumId,
                    chapterId: lessonData.chapterId,
                    name: lessonData.name,
                    objectives: lessonData.objectives,
                    content: lessonData.content,
                });
    
                fetchSubjectsInCurriculum(lessonData.curriculumId, lessonData.gradeId);
                fetchChapters(lessonData.subjectInCurriculumId);
            } catch (error) {
                console.error("Failed to fetch lesson data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLessonData();
    }, [lessonId, form]);
    
    const fetchSubjectsInCurriculum = async (curriculumId: string, gradeId: string) => {
        if (curriculumId && gradeId) {
            const subjects = await getAllSubjectInCurriculumByCurriculumAndGrade(curriculumId, gradeId);
            setSubjectsInCurriculum(subjects);
        }
    };

    const handleCurriculumOrGradeChange = () => {
        const curriculumId = form.getFieldValue('curriculumId');
        const gradeId = form.getFieldValue('gradeId');
        form.setFieldsValue({
            subjectInCurriculumId: null,
            chapterId: null,
        });

        fetchSubjectsInCurriculum(curriculumId, gradeId);
    };

    const fetchChapters = async (subjectInCurriculumId: string) => {
        try {
            const chapterData = await getAllChapterBySubjectInCurriculumId(subjectInCurriculumId);
            setChapters(chapterData);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch chapters", error);
        }
    };

    const handleSubjectInCurriculumSelect = (value: string | null) => {
        if (!value) {
            form.setFieldsValue({ chapterId: null });
            setChapters([]);  // Reset chapters
            return;
        }

        fetchChapters(value);
        form.setFieldsValue({ chapterId: null });
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            const lesson = {
                lessonId: lessonId,
                name: values.name,
                objectives: values.objectives,
                content: values.content,
                chapterId: values.chapterId,
            };
            const success = await updateLessonFunction(lesson);
            if (success) {
                message.success("Cập nhật bài học thành công");
                onClose();
            } else {
                message.error("Cập nhật bài học thất bại");
            }
        } catch (error) {
            console.error("Failed to update lesson", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={isVisible}
            loading={loading}
            onCancel={loading ? () => {} : onClose}
            onOk={handleUpdate}
            footer={[
                <Button key="close" onClick={onClose} loading={loading}>
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleUpdate}
                    loading={loading}
                >
                    Cập nhật
                </Button>,
            ]}
            style={{ top: '8vh' }}
        >
            <Form form={form} layout="vertical">
                <div className="flex gap-2">
                    <Form.Item className="w-1/2" label="Chọn Khung chương trình" name="curriculumId" rules={[{ required: true, message: "Vui lòng chọn khung chương trình!" }]}>
                        <Select
                            options={curriculumFrameworks.map((item) => ({ value: item.curriculumId, label: item.name }))}
                            onChange={handleCurriculumOrGradeChange}
                        />
                    </Form.Item>
                    <Form.Item className="w-1/2" label="Chọn Khối" name="gradeId" rules={[{ required: true, message: "Vui lòng chọn khối!" }]}>
                        <Select
                            options={grades.map((item) => ({ value: item.gradeId, label: item.name }))}
                            onChange={handleCurriculumOrGradeChange}
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
                <Form.Item label="Tên bài học" name="name" rules={[{ required: true, message: "Vui lòng nhập tên bài học!" }]}>
                    <Input placeholder="Nhập tên bài học" />
                </Form.Item>
                <Form.Item label="Mô tả" name="objectives">
                    <Input.TextArea autoSize={{ minRows: 2, maxRows: 2 }} placeholder="Nhập mô tả bài học" />
                </Form.Item>
                <Form.Item label="Nội dung" name="content">
                    <Input.TextArea autoSize={{ minRows: 2, maxRows: 2 }} placeholder="Nhập nội dung bài học" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateLessonForm;
