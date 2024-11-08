import React, { useState, useEffect } from "react";
import { Button, Input, Select, Typography } from "antd";
import { Link } from "react-router-dom";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import question_bank_data, { IQuestionBank } from "@/data/academy-staff/QuestionBankData";

const { Title } = Typography;
const { Option } = Select;

const QuestionBankManagementPage: React.FC = () => {
    const [questionBanks, ] = useState<IQuestionBank[]>(question_bank_data);
    const [searchTerm, setSearchTerm] = useState('');
    const [grade, setGrade] = useState<string | null>(null);
    const [bookSeries, setBookSeries] = useState<string | null>(null);
    const [subject, setSubject] = useState<string | null>(null);
    const [chapter, setChapter] = useState<string | null>(null);
    const [lesson, setLesson] = useState<string | null>(null);

    useEffect(() => {
        if (chapter || lesson) {
            // Call API to fetch questions for the selected chapter or lesson
            // updateQuestionBanks API call logic goes here
        }
    }, [chapter, lesson]);

    const filteredQuestionBanks = questionBanks.filter((q) => 
        q.initialQuestionData.question.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Title level={2} className="my-4">Quản lý Ngân hàng Câu hỏi</Title>
            <div className="mb-4 flex justify-between">
                <Input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    suffix={<SearchOutlined />}
                    className="mr-4"
                />
                <Button type="primary">
                    <Link to="/academy-staff/question-banks/add-new" className="flex items-center">
                        <PlusOutlined className="mr-2" />
                        Thêm mới
                    </Link>
                </Button>
            </div>

            <div className="mb-4 flex gap-4">
                <Select
                    placeholder="Chọn Khối lớp"
                    value={grade}
                    onChange={(value) => setGrade(value)}
                    style={{ width: 160 }}
                >
                    {/* Example options */}
                    <Option value="1">Khối 1</Option>
                    <Option value="2">Khối 2</Option>
                    {/* Add more options as needed */}
                </Select>
                <Select
                    placeholder="Chọn Bộ sách"
                    value={bookSeries}
                    onChange={(value) => setBookSeries(value)}
                    style={{ width: 160 }}
                    disabled={!grade}
                >
                    <Option value="A">Bộ A</Option>
                    <Option value="B">Bộ B</Option>
                    {/* Populate based on selected grade */}
                </Select>
                <Select
                    placeholder="Chọn Môn học"
                    value={subject}
                    onChange={(value) => setSubject(value)}
                    style={{ width: 160 }}
                    disabled={!bookSeries}
                >
                    <Option value="Math">Toán</Option>
                    <Option value="Science">Khoa học</Option>
                    {/* Populate based on selected book series */}
                </Select>
                <Select
                    placeholder="Chọn Chương"
                    value={chapter}
                    onChange={(value) => setChapter(value)}
                    style={{ width: 160 }}
                    disabled={!subject}
                >
                    <Option value="Chapter1">Chương 1</Option>
                    <Option value="Chapter2">Chương 2</Option>
                    {/* Populate based on selected subject */}
                </Select>
                <Select
                    placeholder="Chọn Bài (không bắt buộc)"
                    value={lesson}
                    onChange={(value) => setLesson(value)}
                    style={{ width: 160 }}
                    disabled={!chapter}
                >
                    <Option value="Lesson1">Bài 1</Option>
                    <Option value="Lesson2">Bài 2</Option>
                    {/* Populate based on selected chapter */}
                </Select>
            </div>
            
            {/* List or Table to display questions */}
            <div>
                {filteredQuestionBanks.length > 0 ? (
                    <ul>
                        {filteredQuestionBanks.map((q, index) => (
                            <li key={index}>{q.initialQuestionData.question}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Không có câu hỏi nào trong ngân hàng.</p>
                )}
            </div>
        </>
    );
};

export default QuestionBankManagementPage;
