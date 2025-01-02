import React, { useEffect, useState } from "react";
import { Select, Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getAllCurriculumFramework, IViewListCurriculum } from "@/data/admin/CurriculumFramworkData";
import { getAllGrade, IViewListGrade } from "@/data/admin/GradeData";
import fetchSubjectsByGradeAndCurriculum, { SubjectInCurriculumItem } from "@/api/ApiSubjectItem";
import fetchChaptersBySubjectInCurriculumId, { ChapterItem } from "@/api/ApiChapterItem";
import fetchLessonByChapter, { lessonItem } from "@/api/ApiLessonItem";

const { Option } = Select;

interface FiltersProps {
  onFiltersChange: (filters: {
    searchTerm: string;
    grade: string;
    curriculum: string;
    subject: string;
    chapter: string;
    lesson: string; // Thêm bộ lọc bài học
  }) => void;
}

const Filters: React.FC<FiltersProps> = ({ onFiltersChange }) => {
  const [filterGrade, setFilterGrade] = useState<string>("");
  const [filterCurriculum, setFilterCurriculum] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterSubject, setFilterSubject] = useState<string>("");
  const [filterChapter, setFilterChapter] = useState<string>(""); // State cho bộ lọc chương
  const [filterLesson, setFilterLesson] = useState<string>(""); // State cho bộ lọc bài học

  const [gradeOptions, setGradeOptions] = useState<IViewListGrade[]>([]);
  const [curriculumOptions, setCurriculumOptions] = useState<IViewListCurriculum[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<SubjectInCurriculumItem[]>([]);
  const [chapterOptions, setChapterOptions] = useState<ChapterItem[]>([]);
  const [lessonOptions, setLessonOptions] = useState<lessonItem[]>([]); // State cho danh sách bài học


  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await getAllGrade();
        setGradeOptions(response);
      } catch (error) {
        message.error("Không thể tải dữ liệu khối lớp, vui lòng thử lại sau");
      }
    };

    const fetchCurriculums = async () => {
      try {
        const response = await getAllCurriculumFramework();
        setCurriculumOptions(response);
      } catch (error) {
        message.error("Không thể tải dữ liệu khung chương trình, vui lòng thử lại sau");
      }
    };

    fetchGrades();
    fetchCurriculums();
  }, []);

  useEffect(() => {
    if (filterGrade && filterCurriculum) {
      const fetchSubjects = async () => {
        try {
          const subjects = await fetchSubjectsByGradeAndCurriculum(filterGrade, filterCurriculum);
          setSubjectOptions(subjects);
          setFilterSubject(""); // Reset subject khi grade hoặc curriculum thay đổi
          setChapterOptions([]); // Reset chương khi grade hoặc curriculum thay đổi
          setLessonOptions([]); // Reset bài học khi grade hoặc curriculum thay đổi
          setFilterChapter(""); // Reset state chương
          setFilterLesson(""); // Reset state bài học
        } catch (error) {
          message.error("Không thể tải dữ liệu môn học, vui lòng thử lại sau");
        }
      };
  
      fetchSubjects();
    } else {
      setSubjectOptions([]);
      setChapterOptions([]); // Reset chương khi không có grade hoặc curriculum
      setLessonOptions([]); // Reset bài học khi không có grade hoặc curriculum
      setFilterSubject(""); // Reset state môn học
      setFilterChapter(""); // Reset state chương
      setFilterLesson(""); // Reset state bài học
    }
  }, [filterGrade, filterCurriculum]);
  
  useEffect(() => {
    const fetchChapters = async () => {
      if (filterSubject) {
        const selectedSubject = subjectOptions.find(
          (option) => option.subject === filterSubject
        );
  
        if (selectedSubject) {
          try {
            const chapters = await fetchChaptersBySubjectInCurriculumId(
              selectedSubject.subjectInCurriculumId
            );
            setChapterOptions(chapters);
            setFilterChapter(""); // Reset chương khi môn học thay đổi
            setLessonOptions([]); // Reset bài học khi môn học thay đổi
            setFilterLesson(""); // Reset state bài học
          } catch (error) {
            message.error("Không thể tải dữ liệu chương, vui lòng thử lại sau");
          }
        } else {
          message.warning("Không tìm thấy thông tin môn học");
          setChapterOptions([]);
          setLessonOptions([]);
          setFilterChapter("");
          setFilterLesson("");
        }
      } else {
        setChapterOptions([]);
        setLessonOptions([]);
        setFilterChapter("");
        setFilterLesson("");
      }
    };
  
    fetchChapters();
  }, [filterSubject, subjectOptions]);
  
  useEffect(() => {
    const fetchLessons = async () => {
      if (filterChapter) {
        const selectedChapter = chapterOptions.find(
          (chapter) => chapter.name === filterChapter
        );
  
        if (selectedChapter) {
          try {
            const lessons = await fetchLessonByChapter(selectedChapter.chapterId);
            setLessonOptions(lessons);
            setFilterLesson(""); // Reset bài học khi chương thay đổi
          } catch (error) {
            message.error("Không thể tải dữ liệu bài học, vui lòng thử lại sau");
          }
        } else {
          message.warning("Không tìm thấy thông tin chương");
          setLessonOptions([]);
          setFilterLesson("");
        }
      } else {
        setLessonOptions([]);
        setFilterLesson("");
      }
    };
  
    fetchLessons();
  }, [filterChapter, chapterOptions]);
  

  useEffect(() => {
    onFiltersChange({
      searchTerm,
      grade: filterGrade,
      curriculum: filterCurriculum,
      subject: filterSubject,
      chapter: filterChapter,
      lesson: filterLesson,
    });
  }, [searchTerm, filterGrade, filterCurriculum, filterSubject, filterChapter, filterLesson, onFiltersChange]);

  return (
    <div className="mb-4 flex gap-4">
      <Input
        placeholder="Tìm kiếm câu hỏi..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        prefix={<SearchOutlined />}
      />

      <Select
        id="grade-filter"
        className="w-48"
        value={filterGrade}
        onChange={(value) => setFilterGrade(value)}
        placeholder="Chọn khối lớp"
      >
        <Option value="">Tất cả lớp</Option>
        {gradeOptions.map((option) => (
          <Option key={option.name} value={option.name}>
            {option.name}
          </Option>
        ))}
      </Select>

      <Select
        id="curriculum-filter"
        className="w-48"
        value={filterCurriculum}
        onChange={(value) => setFilterCurriculum(value)}
        placeholder="Chọn khung chương trình"
      >
        <Option value="">Tất cả khung chương trình</Option>
        {curriculumOptions.map((option) => (
          <Option key={option.name} value={option.name}>
            {option.name}
          </Option>
        ))}
      </Select>

      <Select
        id="subject-filter"
        className="w-48"
        value={filterSubject}
        onChange={(value) => setFilterSubject(value)}
        placeholder="Chọn môn học"
        disabled={!filterGrade || !filterCurriculum}
      >
        <Option value="">Tất cả môn học</Option>
        {subjectOptions.map((option) => (
          <Option key={option.subject} value={option.subject}>
            {option.subject}
          </Option>
        ))}
      </Select>

      <Select
        id="chapter-filter"
        className="w-48"
        value={filterChapter}
        onChange={(value) => setFilterChapter(value)}
        placeholder="Chọn chương"
        disabled={!filterSubject}
      >
        <Option value="">Tất cả chương</Option>
        {chapterOptions.map((chapter) => (
          <Option key={chapter.name} value={chapter.name}>
            {chapter.name}
          </Option>
        ))}
      </Select>

      <Select
        id="lesson-filter"
        className="w-48"
        value={filterLesson}
        onChange={(value) => setFilterLesson(value)}
        placeholder="Chọn bài học"
        disabled={!filterChapter}
      >
        <Option value="">Tất cả bài học</Option>
        {lessonOptions.map((lesson) => (
          <Option key={lesson.lessonId} value={lesson.name}>
            {lesson.name}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default Filters;