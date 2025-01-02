import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, message, Button } from "antd";
import { getAllCurriculumFramework, IViewListCurriculum } from "@/data/admin/CurriculumFramworkData";
import { getAllGrade, IViewListGrade } from "@/data/admin/GradeData";
import { getAllSubject, IViewListSubject } from "@/data/admin/SubjectData";
import { updateSubjectInCurriculumFunction, getSubjectInCurriculumById } from "@/data/academy-staff/SubjectInCurriculumData";

interface UpdateSubjectFormProps {
    subjectInCurriculumId: string;
    isVisible: boolean;
    onClose: () => void;
}

const UpdateSubjectInCurriculumForm: React.FC<UpdateSubjectFormProps> = ({ subjectInCurriculumId, isVisible, onClose }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [curriculumFrameworks, setCurriculumFrameworks] = useState<IViewListCurriculum[]>([]);
    const [grades, setGrades] = useState<IViewListGrade[]>([]);
    const [subjects, setSubjects] = useState<IViewListSubject[]>([]);

    useEffect(() => {
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
    }, [isVisible]);

    useEffect(() => {
        const fetchSubjectInCurriculum = async () => {
            try {
                setLoading(true);
                const subjectInCurriculum = await getSubjectInCurriculumById(subjectInCurriculumId);
                form.setFieldsValue({
                    curriculumId: subjectInCurriculum.curriculumId,
                    gradeId: subjectInCurriculum.gradeId,
                    subjectId: subjectInCurriculum.subjectId,
                    description: subjectInCurriculum.description,
                });
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };

        if (isVisible) {
            fetchSubjectInCurriculum();
        }
    }, [isVisible, subjectInCurriculumId, form]);

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            const success = await updateSubjectInCurriculumFunction({ ...values, subjectInCurriculumId });
            if (success) {
                message.success("Cập nhật môn học thành công");
                form.resetFields();
                onClose();
            } else {
                message.error("Môn học này đã tồn tại trong khung chương trình");
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
            loading={loading}
            onOk={handleUpdate}
            footer={[
                <Button key="close" onClick={onClose} loading={loading}> {/* Disable when loadingAI is true */}
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

export default UpdateSubjectInCurriculumForm;