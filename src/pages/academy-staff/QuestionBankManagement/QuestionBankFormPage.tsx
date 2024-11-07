import React, { useState } from "react";
import { Button, Input, Select, Checkbox, Form, Typography, Divider } from "antd";
import { IQuestionBank, IAnswer } from "@/data/academy-staff/QuestionBankData";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

interface QuestionBankFormProps {
    initialQuestionData?: IQuestionBank;
    onSubmit?: (formData: IQuestionBank) => void;
}

const QuestionBankFormPage: React.FC<QuestionBankFormProps> = ({ initialQuestionData, onSubmit }) => {
    // State for attribute selectors (selected once per form)
    const [grade, setGrade] = useState<string | null>(null);
    const [bookSeries, setBookSeries] = useState<string | null>(null);
    const [subject, setSubject] = useState<string | null>(null);
    const [chapter, setChapter] = useState<string | null>(null);
    const [lesson, setLesson] = useState<string | null>(null);
    const navigate = useNavigate();

    // State for question-related fields
    const [question, setQuestion] = useState("");
    const [type, setType] = useState("");
    const [plum, setPlum] = useState("");
    const [answers, setAnswers] = useState<IAnswer[]>([{ answerId: "1", answerText: "", isCorrect: false }]);

    // Sample data for dropdown options (replace with actual API data)
    const gradeOptions = [{ value: "grade1", label: "Grade 1" }, { value: "grade2", label: "Grade 2" }];
    const bookSeriesOptions = grade ? [{ value: "series1", label: "Series 1" }] : [];
    const subjectOptions = bookSeries ? [{ value: "math", label: "Math" }] : [];
    const chapterOptions = subject ? [{ value: "chapter1", label: "Chapter 1" }] : [];
    const lessonOptions = chapter ? [{ value: "lesson1", label: "Lesson 1" }] : [];

    const addAnswer = () => {
        setAnswers([...answers, { answerId: `${answers.length + 1}`, answerText: "", isCorrect: false }]);
    };

    const handleSubmit = () => {
        if (!chapter) {
            alert("Vui lòng chọn chương");
            return;
        }
        const formData: IQuestionBank = {
            initialQuestionData: {
                // questionId: initialQuestionData?.initialQuestionData?.questionId, 
                question,
                type,
                plum,
                answers,
                chapterId: chapter,
                lessonId: lesson || null,
            },
        };
        onSubmit?.(formData);
        setQuestion("");
        setType("");
        setPlum("");
        setAnswers([{ answerId: "1", answerText: "", isCorrect: false }]);
    };


    const updateAnswer = (index: number, field: keyof IAnswer, value: any) => {
        const updatedAnswers = answers.map((answer, i) =>
            i === index ? { ...answer, [field]: value } : answer
        );
        setAnswers(updatedAnswers);
    };

    const removeAnswer = (index: number) => {
        setAnswers(answers.filter((_, i) => i !== index));
    };

    return (
        <div className="container mx-auto p-4">
            <Title level={2}>Thêm mới câu hỏi</Title>
            <Form layout="vertical" onFinish={handleSubmit}>
                <div className="flex gap-4">
                    <Form.Item label="Khối lớp" style={{ flex: 1 }}>
                        <Select value={grade} onChange={setGrade} placeholder="Chọn khối lớp">
                            {gradeOptions.map(option => (
                                <Option key={option.value} value={option.value}>{option.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Bộ sách" style={{ flex: 1 }}>
                        <Select value={bookSeries} onChange={setBookSeries} placeholder="Chọn bộ sách" disabled={!grade}>
                            {bookSeriesOptions.map(option => (
                                <Option key={option.value} value={option.value}>{option.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Môn học" style={{ flex: 1 }}>
                        <Select value={subject} onChange={setSubject} placeholder="Chọn môn học" disabled={!bookSeries}>
                            {subjectOptions.map(option => (
                                <Option key={option.value} value={option.value}>{option.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>
                <div className="flex gap-4">
                    <Form.Item label="Chương" style={{ flex: 1 }}>
                        <Select value={chapter} onChange={setChapter} placeholder="Chọn chương" disabled={!subject}>
                            {chapterOptions.map(option => (
                                <Option key={option.value} value={option.value}>{option.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Bài (tùy chọn)" style={{ flex: 1 }}>
                        <Select value={lesson} onChange={setLesson} placeholder="Chọn bài" disabled={!chapter}>
                            {lessonOptions.map(option => (
                                <Option key={option.value} value={option.value}>{option.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                <Form.Item label="Câu hỏi">
                    <Input.TextArea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Nhập câu hỏi"
                    />
                </Form.Item>
                <div className="flex gap-4">
                    <Form.Item label="Loại câu hỏi" style={{ flex: 1 }}>
                        <Select value={type} onChange={setType} placeholder="Chọn loại câu hỏi">
                            <Option value="multiple-choice">Trắc nghiệm</Option>
                            <Option value="essay">Tự luận</Option>
                            <Option value="true-false">Đúng / Sai</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Plum" style={{ flex: 1 }}>
                        <Input value={plum} onChange={(e) => setPlum(e.target.value)} placeholder="Mức độ câu hỏi" />
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
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            Lưu
                        </Button>
                        <Button
                            type="default"
                            onClick={() => navigate('/academy-staff/question-banks/')}
                        >
                            Quay lại
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default QuestionBankFormPage;
