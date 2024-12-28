//QuestionBankPage.tsx
import React, { useEffect, useState } from 'react';
import { Typography, Input } from 'antd';
import { CaretRightOutlined, RightCircleOutlined, SnippetsOutlined, } from '@ant-design/icons';
import {
    fetchSubjectInCurriculumList,
    IViewListSubjectInCurriculum
} from '@/data/client/SubjectInCurriculumData';
import {
    fetchChaptersBySubjectInCurriculumId,
    IViewListChapter
} from '@/data/client/ChapterData';
import {
    fetchLessonsByChapterId,
    IViewListLesson,
} from '@/data/client/LessonData';
import {
    getViewListQuestionBank,
    getQuestionByChapterId,
    getQuestionByLessonId,
    IViewListQuestionBank,
} from '@/data/client/QuestionBankData';


const { Title } = Typography;
const { Search } = Input;

const QuestionBankPage: React.FC = () => {
    const [subjectsData, setSubjectsData] = useState<IViewListSubjectInCurriculum[]>([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
    const [chapters, setChapters] = useState<IViewListChapter[]>([]);
    const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
    const [lessons, setLessons] = useState<IViewListLesson[]>([]);
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
    const [questions, setQuestions] = useState<IViewListQuestionBank[]>([]);
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
    const [, setSearchText] = useState('');
    

    // Gọi API để tìm kiếm câu hỏi
    const fetchQuestions = async (keyword: string) => {
        const result = await getViewListQuestionBank(keyword);
        setQuestions(result);
    };

    // Xử lý tìm kiếm khi user nhập từ khóa
    const onSearch = (value: string) => {
        setSearchText(value); // Cập nhật từ khóa
        fetchQuestions(value); // Gọi API tìm kiếm
        setSelectedSubjectId(null); // Reset môn học khi tìm kiếm
        setChapters([]);
        setLessons([]);
    };

    // Khởi tạo mặc định (lấy tất cả câu hỏi)
    useEffect(() => {
        fetchQuestions('');
    }, []);

    // Fetch danh sách môn học
    useEffect(() => {
        const fetchSubjects = async () => {
            const subjects = await fetchSubjectInCurriculumList();
            setSubjectsData(subjects);
        };

        fetchSubjects();
    }, []);

    // Fetch danh sách chương khi chọn môn học
    useEffect(() => {
        if (selectedSubjectId) {
            const fetchChapters = async () => {
                const chapters = await fetchChaptersBySubjectInCurriculumId(selectedSubjectId);
                setChapters(chapters);
                setSelectedChapterId(null); // Reset chương khi chọn môn học mới
                setLessons([]); // Xóa danh sách bài học
                // setQuestions([]); // Xóa câu hỏi
            };
            fetchChapters();
        }
    }, [selectedSubjectId]);

    // Fetch danh sách câu hỏi khi chọn chương
    useEffect(() => {
        if (selectedChapterId) {
            const fetchLessons = async () => {
                const lessons = await fetchLessonsByChapterId(selectedChapterId);
                setLessons(lessons);
                setSelectedLessonId(null); // Reset bài học khi chọn chương mới
                const questions = await getQuestionByChapterId(selectedChapterId); // Fetch câu hỏi theo chương
                setQuestions(questions);
            };
            fetchLessons();

        }
    }, [selectedChapterId]);

    // Fetch câu hỏi khi chọn bài học
    useEffect(() => {
        if (selectedLessonId) {
            const fetchQuestions = async () => {
                const questions = await getQuestionByLessonId(selectedLessonId);
                setQuestions(questions);
            };
            fetchQuestions();
        }
    }, [selectedLessonId]);

    const handleQuestionClick = (questionId: string) => {
        if (selectedQuestionId === questionId) {
            setSelectedQuestionId(null);  // Nếu câu hỏi đã được chọn, bỏ chọn nó
        } else {
            setSelectedQuestionId(questionId);  // Chọn câu hỏi
        }
    };

    return (
        <div className="pt-5 pb-10">
            <div className="container mx-auto">
                <div className="text-center mb-5">
                    <Title level={2} className="my-4">
                        Ngân hàng câu hỏi
                    </Title>
                    <Search
                        placeholder="Tìm kiếm câu hỏi..."
                        onSearch={onSearch}
                        allowClear
                        style={{ marginBottom: '20px', width: '500px' }}
                    />
                </div>
                <div className="flex flex-wrap">
                    {/* Sidebar Môn học */}
                    <div className="w-full lg:w-1/5">
                        <ul className="shadow-lg pb-6 px-6 rounded-lg bg-gray-100">
                            <li className="border-b mb-4">
                                <Title level={3} className="my-4">
                                    Môn học
                                </Title>
                            </li>
                            {subjectsData.map((subject) => (
                                <li
                                    key={subject.id}
                                    className={`border-b mb-4 cursor-pointer ${selectedSubjectId === subject.id ? 'bg-blue-100' : ''
                                        }`}
                                    onClick={() => setSelectedSubjectId(subject.id)}
                                >
                                    <div className="flex items-center">
                                        <div className="bg-blue-500 text-white text-center p-2 rounded-md w-9 h-9 flex items-center justify-center">
                                            <SnippetsOutlined />
                                        </div>
                                        <div className="ml-4">
                                            <Title level={5} className="text-lg font-semibold">
                                                {subject.name}
                                            </Title>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Danh sách chương và bài học */}
                    <div className="w-full lg:w-1/5 mx-4">
                        {chapters.length > 0 ? (
                            <ul className="shadow-lg pt-2 pb-6 px-6 rounded-lg bg-gray-100">
                                <li className="border-b mb-4">
                                    <Title level={4} className="my-4">
                                        Chương
                                    </Title>
                                </li>
                                {chapters.map((chapter) => (
                                    <li key={chapter.id}>
                                        <div
                                            className={`border-b py-2 my-2 cursor-pointer ${selectedChapterId === chapter.id ? 'bg-blue-100' : ''}`}
                                            onClick={() => setSelectedChapterId(chapter.id)}
                                        >
                                            <Title level={5} className="ml-4">
                                                <RightCircleOutlined /> {chapter.name}
                                            </Title>
                                        </div>
                                        {selectedChapterId === chapter.id && (
                                            <ul className="ml-4 mb-2">
                                                {lessons.map((lesson) => (
                                                    <li
                                                        key={lesson.id}
                                                        className={`cursor-pointer ${selectedLessonId === lesson.id ? 'text-blue-600' : ''} mb-2`}
                                                        onClick={() => setSelectedLessonId(lesson.id)}
                                                    >
                                                        <CaretRightOutlined />  {lesson.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center pt-4">Chọn một môn học để xem danh sách chương.</p>
                        )}
                    </div>

                    {/* Ngân hàng câu hỏi */}
                    <div className="w-full lg:w-2/4">
                        {questions.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {questions.map((question) => (
                                    <div key={question.id} className="shadow-lg rounded-lg p-4 bg-white">
                                        <div className="flex items-center justify-between mb-2">
                                            <p>Loại: {question.type}</p>
                                            <p>Mức độ câu hỏi: {question.plum}</p>
                                        </div>
                                        <Title level={4}
                                            className="mb-2 cursor-pointer"
                                            onClick={() => handleQuestionClick(question.id)} >
                                            {question.question}
                                        </Title>
                                        <p>
                                            <ul className="list-disc ml-3">
                                                {question.answers.map((answer, index) => {
                                                    return (
                                                        <p key={index} className='mb-2'>
                                                            <b>{String.fromCharCode(65 + index)}.</b> {answer.answerText}
                                                        </p>
                                                    );
                                                })}
                                            </ul>
                                        </p>
                                    </div>
                                ))}
                            </div>
                            // ) : (
                            //     <p className="text-center pt-4">Chọn một chương hoặc bài học để xem danh sách câu hỏi.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionBankPage;
