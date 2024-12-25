import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, message, Button } from "antd";
import { getAllCurriculumFramework, IViewListCurriculum } from "@/data/admin/CurriculumFramworkData";
import { getAllGrade, IViewListGrade } from "@/data/admin/GradeData";
import { getAllSubject, IViewListSubject } from "@/data/admin/SubjectData";
import { createSubjectInCurriculumFunction } from "@/data/academy-staff/SubjectInCurriculumData";

interface CreateChapterFormProps {
    isVisible: boolean;
    onClose: () => void;
    onCreate: () => void;
}

const SubjectInCurriculumFormPage: React.FC<CreateChapterFormProps> = ({ isVisible, onClose, onCreate }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [curriculumFrameworks, setCurriculumFrameworks] = useState<IViewListCurriculum[]>([]);
    const [grades, setGrades] = useState<IViewListGrade[]>([]);
    const [subjects, setSubjects] = useState<IViewListSubject[]>([]);

    useEffect(() => {
        form.resetFields();
        const fetchData = async () => {
            try {
                setLoading(true);
                const [curriculumData, gradeData, subjectData] = await Promise.all([
                    getAllCurriculumFramework(),
                    getAllGrade(),
                    getAllSubject()
                ]);
                setCurriculumFrameworks(curriculumData);
                setGrades(gradeData);
                setSubjects(subjectData);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };

        if (isVisible) {
            fetchData();
        }
    }, [isVisible, form]);

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            const success = await createSubjectInCurriculumFunction(values);
            if (success) {
                message.success("Tạo môn học trong khung chương trình thành công");
                form.resetFields();
                onCreate();
            } else {
                message.error("Môn học trong khung chương trình đã tồn tại");
            }
        } catch (error) {
            console.error("Failed to validate form", error);
        } finally {
            setLoading(false);
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
                    <Form.Item label="Chọn Khung chương trình" name="curriculumId" rules={[{ required: true, message: "Vui lòng chọn khung chương trình!" }]}>
                        <Select
                            options={curriculumFrameworks.map((item) => ({ value: item.curriculumId, label: item.name }))}
                        />
                    </Form.Item>
                    <Form.Item label="Chọn Khối" name="gradeId" rules={[{ required: true, message: "Vui lòng chọn khối!" }]}>
                        <Select
                            options={grades.map((item) => ({ value: item.gradeId, label: item.name }))}
                        />
                    </Form.Item>
                <Form.Item label="Chọn Môn học" name="subjectId" rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}>
                    <Select
                        options={subjects.map((item) => ({ value: item.subjectId, label: item.name }))}
                    />
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

export default SubjectInCurriculumFormPage;