import React, { useState } from "react";
import { Button, Input, Checkbox, Form, Typography, Divider, Select, message } from "antd";
import { createQuestion } from "@/data/academy-staff/QuestionBankData";
import { useNavigate } from "react-router-dom";
import FilterSection from "@/layouts/teacher/Components/FilterSection/FilterSection";

const { Title } = Typography;
const { Option } = Select;

const QuestionBankFormPage: React.FC = () => {
    const navigate = useNavigate();

    // State for filter data
    const [filters, setFilters] = useState<{
        gradeId?: string;
        curriculumId?: string;
        subjectId?: string;
        chapterId?: string;
        lessonId?: string;
    }>({});

    // State for question-related fields
    const [question, setQuestion] = useState<string>("");
    const [type, setType] = useState<"multiple choice" | "True/False" | "Short Answer" | undefined>();
    const [plum, setPlum] = useState<"easy" | "medium" | "hard" | undefined>();
    const [answers, setAnswers] = useState<{ answerId: string; answerText: string; isCorrect: boolean }[]>([
        { answerId: "1", answerText: "", isCorrect: false },
    ]);

    const addAnswer = () => {
        setAnswers([...answers, { answerId: `${answers.length + 1}`, answerText: "", isCorrect: false }]);
    };

    const updateAnswer = (index: number, field: keyof typeof answers[0], value: any) => {
        const updatedAnswers = answers.map((answer, i) =>
            i === index ? { ...answer, [field]: value } : answer
        );
        setAnswers(updatedAnswers);
    };

    const removeAnswer = (index: number) => {
        setAnswers(answers.filter((_, i) => i !== index));
    };
    const handleSubmit = async () => {
        if (!filters.chapterId) {
            message.error("Vui lòng chọn chương trước khi lưu câu hỏi.");
            return;
        }
        if (!type || !plum) {
            message.error("Vui lòng chọn đầy đủ loại câu hỏi và mức độ.");
            return;
        }

        const formData = {
            question,
            type,
            plum,
            chapterId: filters.chapterId,
            lessonId: filters.lessonId || null,
            answers: answers.map(({ answerText, isCorrect }) => ({
                answerText,
                isCorrect,
            })),
        };

        try {
            const result = await createQuestion(formData);

            if (result.success) {
                message.success(result.message || "Câu hỏi đã được thêm thành công!");
                setQuestion("");
                setType(undefined);
                setPlum(undefined);
                setAnswers([{ answerId: "1", answerText: "", isCorrect: false }]);
                navigate("/academy-staff/question-banks/");
            } else {
                message.error(result.message || "Lỗi khi thêm câu hỏi.");
            }
        } catch (error: any) {
            message.error(error.message || "Có lỗi xảy ra khi thêm câu hỏi.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Title level={2}>Thêm mới câu hỏi</Title>
            <Form layout="vertical" onFinish={handleSubmit}>
                <FilterSection
                    onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
                />

                <Form.Item label="Câu hỏi">
                    <Input.TextArea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Nhập câu hỏi"
                    />
                </Form.Item>
                <div className="flex gap-4">
                    <Form.Item label="Loại câu hỏi" style={{ flex: 1 }}>
                        <Select
                            value={type}
                            onChange={(value) => setType(value)}
                            placeholder="Chọn loại câu hỏi"
                        >
                            <Option value="multiple choice">Câu hỏi trắc nghiệm</Option>
                            <Option value="True/False">Câu hỏi đúng sai</Option>
                            <Option value="Short Answer">Câu tự luận ngắn</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Mức độ câu hỏi" style={{ flex: 1 }}>
                        <Select
                            value={plum}
                            onChange={(value) => setPlum(value)}
                            placeholder="Chọn mức độ câu hỏi"
                        >
                            <Option value="easy">Dễ</Option>
                            <Option value="medium">Trung bình</Option>
                            <Option value="hard">Khó</Option>
                        </Select>
                    </Form.Item>
                </div>

                <Divider>Danh sách câu trả lời</Divider>
                {answers.map((answer, index) => (
                    <div key={answer.answerId} className="mb-2 flex gap-2 items-center">
                        <Input
                            placeholder="Nhập câu trả lời"
                            value={answer.answerText}
                            onChange={(e) => updateAnswer(index, "answerText", e.target.value)}
                        />
                        <Checkbox
                            checked={answer.isCorrect}
                            onChange={(e) => updateAnswer(index, "isCorrect", e.target.checked)}
                        >
                            Đúng
                        </Checkbox>
                        <Button onClick={() => removeAnswer(index)} danger>
                            Xóa
                        </Button>
                    </div>
                ))}
                <Button type="dashed" onClick={addAnswer} style={{ width: "100%", marginTop: "10px" }}>
                    Thêm câu trả lời
                </Button>

                <Form.Item className="mt-4">
                    <div className="flex space-x-4">
                        <Button type="primary" htmlType="submit">
                            Lưu
                        </Button>
                        <Button type="default" onClick={() => navigate("/academy-staff/question-banks/")}>
                            Quay lại
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default QuestionBankFormPage;
