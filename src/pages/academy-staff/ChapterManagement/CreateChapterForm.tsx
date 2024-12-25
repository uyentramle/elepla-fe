import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, message, Button } from "antd";
import { getAllCurriculumFramework, IViewListCurriculum } from "@/data/admin/CurriculumFramworkData";
import { getAllGrade, IViewListGrade } from "@/data/admin/GradeData";
import { getAllSubjectInCurriculumByCurriculumAndGrade, IViewListSubjectInCurriculum } from "@/data/academy-staff/SubjectInCurriculumData";
import { createChapterFunction } from "@/data/academy-staff/ChapterData";

interface CreateChapterFormProps {
    isVisible: boolean;
    onClose: () => void;
    onCreate: () => void;
}

const CreateChapterForm: React.FC<CreateChapterFormProps> = ({ isVisible, onClose, onCreate }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [curriculumFrameworks, setCurriculumFrameworks] = useState<IViewListCurriculum[]>([]);
    const [grades, setGrades] = useState<IViewListGrade[]>([]);
    const [subjectsInCurriculum, setSubjectsInCurriculum] = useState<IViewListSubjectInCurriculum[]>([]);

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
        });

        // Nếu chọn đầy đủ, fetch dữ liệu mới
        fetchSubjectsInCurriculum(curriculumId, gradeId);
    };

    const handleCreate = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields(); // Lấy dữ liệu từ form
            const chapter = {
                name: values.name,
                description: values.description,
                subjectInCurriculumId: values.subjectInCurriculumId,
            };
            const success = await createChapterFunction(chapter); // Gọi API tạo chương
            if (success) {
                message.success("Tạo chương thành công!");
                form.resetFields();
                onCreate(); // Gọi callback để thông báo thành công
            } else {
                message.error("Tạo chương thất bại. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Error creating chapter:", error);
            message.error("Đã xảy ra lỗi. Vui lòng thử lại!");
        } finally {
            setLoading(false); // Tắt trạng thái loading
        }
    }

    return (
        <Modal
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
                    <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} placeholder="Nhập mô tả bài học" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateChapterForm;