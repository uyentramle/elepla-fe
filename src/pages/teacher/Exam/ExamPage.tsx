//ExamPage.tsx
import React, { useEffect, useState } from 'react';
import { FileOutlined, FilePdfOutlined } from '@ant-design/icons';
import { Button, Select, List } from 'antd';
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
  getQuestionByChapterId,
  getQuestionByLessonId,
  IViewListQuestionBank,
} from '@/data/client/QuestionBankData';

const { Option } = Select;


const ExamPage: React.FC = () => {
  const [subjectsData, setSubjectsData] = useState<IViewListSubjectInCurriculum[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [chapters, setChapters] = useState<IViewListChapter[]>([]);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [lessons, setLessons] = useState<IViewListLesson[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<IViewListQuestionBank[]>([]);

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
        setQuestions([]); // Xóa câu hỏi
      };
      fetchChapters();
    }
  }, [selectedSubjectId]);

  // Fetch danh sách bài học và câu hỏi khi chọn chương
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

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      {/* Filter Bar */}
      <div className="flex justify-between items-center mb-4">
        {/* Select Môn học */}
        <div>
          <label htmlFor="subject" className="mr-2">Chọn môn học:</label>
          <Select
            id="subject"
            placeholder="Chọn môn học"
            style={{ width: 200 }}
            onChange={(value) => setSelectedSubjectId(value)}
          >
            {subjectsData.map((subject) => (
              <Option key={subject.id} value={subject.id}>
                {subject.name}
              </Option>
            ))}
          </Select>
        </div>

        {/* Select Chương */}
        <div>
          <label htmlFor="chapter" className="mr-2">Chọn chương:</label>
          <Select
            id="chapter"
            placeholder="Chọn chương"
            style={{ width: 200 }}
            disabled={!chapters.length}
            onChange={(value) => setSelectedChapterId(value)}
          >
            {chapters.map((chapter) => (
              <Option key={chapter.id} value={chapter.id}>
                {chapter.name}
              </Option>
            ))}
          </Select>
        </div>

        {/* Select Bài học */}
        <div>
          <label htmlFor="lesson" className="mr-2">Chọn bài học:</label>
          <Select
            id="lesson"
            placeholder="Chọn bài học"
            style={{ width: 200 }}
            disabled={!lessons.length}
            onChange={(value) => setSelectedLessonId(value)}
          >
            {lessons.map((lesson) => (
              <Option key={lesson.id} value={lesson.id}>
                {lesson.name}
              </Option>
            ))}
          </Select>
        </div>

        {/* Export Buttons */}
        <div>
          <Button className="mr-2 flex items-center">
            <FileOutlined className="mr-1" />
            Xuất DOC
          </Button>
          <Button className="flex items-center">
            <FilePdfOutlined className="mr-1" />
            Xuất PDF
          </Button>
        </div>
      </div>

      {/* Questions List */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Danh sách câu hỏi:</h3>
        <List
          bordered
          dataSource={questions}
          renderItem={(item) => (
            <List.Item>
              <div>
                {questions.indexOf(item) + 1}. {item.question}
                <br />
                <ul>
                  {item.answers.map((answer, index) => (
                    <li key={answer.id}>
                      <b>{String.fromCharCode(65 + index)}.</b> {answer.answerText}
                    </li>
                  ))}
                </ul>
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default ExamPage;
