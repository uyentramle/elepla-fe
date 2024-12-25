import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, message, Button } from "antd";
import { getAllCurriculumFramework, IViewListCurriculum } from "@/data/admin/CurriculumFramworkData";
import { getAllGrade, IViewListGrade } from "@/data/admin/GradeData";
import { getAllSubjectInCurriculumByCurriculumAndGrade, IViewListSubjectInCurriculum } from "@/data/academy-staff/SubjectInCurriculumData";
import { getChapteById, updateChapterFunction } from "@/data/academy-staff/ChapterData";

interface UpdateChapterFormProps {
    chapterId: string;
    isVisible: boolean;
    onClose: () => void;
}

const UpdateChapterForm: React.FC<UpdateChapterFormProps> = ({ chapterId, isVisible, onClose }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [curriculumFrameworks, setCurriculumFrameworks] = useState<IViewListCurriculum[]>([]);
    const [grades, setGrades] = useState<IViewListGrade[]>([]);
    const [subjectsInCurriculum, setSubjectsInCurriculum] = useState<IViewListSubjectInCurriculum[]>([]);

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
        const fetchChapterData = async () => {
            try {
                setLoading(true);
                // Giả sử hàm fetch chapter thông qua chapterId
                const chapterData = await getChapteById(chapterId);
                form.setFieldsValue({
                    curriculumId: chapterData.curriculumId,
                    gradeId: chapterData.gradeId,
                    subjectInCurriculumId: chapterData.subjectInCurriculumId,
                    name: chapterData.name,
                    description: chapterData.description,
                });

                fetchSubjectsInCurriculum(chapterData.curriculumId, chapterData.gradeId);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };

        if (isVisible) {
            fetchChapterData();
        }
    }, [chapterId, form, isVisible]);

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
        });

        // Nếu chọn đầy đủ, fetch dữ liệu mới
        fetchSubjectsInCurriculum(curriculumId, gradeId);
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields(); // Lấy dữ liệu từ form
            const chapter = {
                chapterId: chapterId,
                name: values.name,
                description: values.description,
                subjectInCurriculumId: values.subjectInCurriculumId,
            };
            const success = await updateChapterFunction(chapter); // Gọi API cập nhật chương
            if (success) {
                message.success("Cập nhật chương thành công!");
                form.resetFields();
                onClose(); // Gọi callback để thông báo thành công
            } else {
                message.error("Cập nhật chương thất bại. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Failed to update chapter:", error);
            message.error("Cập nhật chương thất bại. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            visible={isVisible}
            loading={loading}
            onCancel={loading ? () => { } : onClose}
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
                    />
                </Form.Item>
                <Form.Item
                    label="Tên chương"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên chương!" }]}
                >
                    <Input placeholder="Nhập tên chương" />
                </Form.Item>
                <Form.Item
                    label="Mô tả"
                    name="description"
                // rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                >
                    <Input.TextArea autoSize={{ minRows: 2, maxRows: 2 }} placeholder="Nhập mô tả bài học" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateChapterForm;
