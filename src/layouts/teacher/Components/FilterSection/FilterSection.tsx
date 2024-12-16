import React, { useState, useEffect } from "react";
import { Select } from "antd";
import { GradeItem } from "@/data/teacher/GradeData";
import fetchgrade from "@/api/ApiGradeItem";
import fetchCurriculum from "@/api/ApiCurriculumItem";
import fetchSubjectsByGradeAndCurriculum, { SubjectInCurriculumItem } from "@/api/ApiSubjectItem";
import fetchChaptersBySubjectInCurriculumId, { ChapterItem } from "@/api/ApiChapterItem";
import fetchLessonByChapter, { lessonItem } from "@/api/ApiLessonItem";
import { CurriculumItem } from "@/data/teacher/CurriculumData";

const { Option } = Select;

interface FilterSectionProps {
  onFilterChange: (filters: {
    gradeId?: string;
    curriculumId?: string;
    subjectId?: string;
    chapterId?: string;
    lessonId?: string;
  }) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ onFilterChange }) => {
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [curriculums, setCurriculums] = useState<CurriculumItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectInCurriculumItem[]>([]);
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [lessons, setLessons] = useState<lessonItem[]>([]);

  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  // Fetch data
  useEffect(() => {
    const loadGrades = async () => {
      try {
        const gradeData = await fetchgrade();
        setGrades(gradeData);
      } catch (err) {
        console.error("Failed to fetch grades:", err);
      }
    };
    loadGrades();
  }, []);

  useEffect(() => {
    const loadCurriculums = async () => {
      try {
        const curriculumData = await fetchCurriculum();
        setCurriculums(curriculumData);
      } catch (err) {
        console.error("Failed to fetch curriculums:", err);
      }
    };
    loadCurriculums();
  }, []);

  useEffect(() => {
    if (selectedGradeId && selectedCurriculumId) {
      const loadSubjects = async () => {
        try {
          const subjectData = await fetchSubjectsByGradeAndCurriculum(selectedGradeId, selectedCurriculumId);
          setSubjects(subjectData);
        } catch (err) {
          console.error("Failed to fetch subjects:", err);
        }
      };
      loadSubjects();
    } else {
      setSubjects([]);
    }
  }, [selectedGradeId, selectedCurriculumId]);

  useEffect(() => {
    if (selectedSubjectId) {
      const loadChapters = async () => {
        try {
          const chapterData = await fetchChaptersBySubjectInCurriculumId(selectedSubjectId);
          setChapters(chapterData);
        } catch (err) {
          console.error("Failed to fetch chapters:", err);
        }
      };
      loadChapters();
    } else {
      setChapters([]);
    }
  }, [selectedSubjectId]);

  useEffect(() => {
    if (selectedChapterId) {
      const loadLessons = async () => {
        try {
          const lessonData = await fetchLessonByChapter(selectedChapterId);
          setLessons(lessonData);
        } catch (err) {
          console.error("Failed to fetch lessons:", err);
        }
      };
      loadLessons();
    } else {
      setLessons([]);
    }
  }, [selectedChapterId]);

  const handleFilterChange = (key: string, value: string | null) => {
    if (key === "grade") {
      // Khi đổi khối, giữ nguyên bộ sách nhưng reset môn, chương và bài
      setSelectedGradeId(value);
      setSelectedSubjectId(null);
      setSelectedChapterId(null);
      setSelectedLessonId(null);
      setSubjects([]);
      setChapters([]);
      setLessons([]);
    } else if (key === "curriculum") {
      // Khi đổi bộ sách, giữ nguyên khối nhưng reset môn, chương và bài
      setSelectedCurriculumId(value);
      setSelectedSubjectId(null);
      setSelectedChapterId(null);
      setSelectedLessonId(null);
      setSubjects([]);
      setChapters([]);
      setLessons([]);
    } else if (key === "subject") {
      // Khi đổi môn, reset chương và bài
      setSelectedSubjectId(value);
      setSelectedChapterId(null);
      setSelectedLessonId(null);
      setChapters([]);
      setLessons([]);
    } else if (key === "chapter") {
      // Khi đổi chương, reset bài
      setSelectedChapterId(value);
      setSelectedLessonId(null);
      setLessons([]);
    } else if (key === "lesson") {
      // Khi đổi bài, không reset
      setSelectedLessonId(value);
    }
  
    // Cập nhật bộ lọc sau khi thay đổi
    onFilterChange({
      gradeId: key === "grade" ? value || undefined : selectedGradeId || undefined,
      curriculumId: key === "curriculum" ? value || undefined : selectedCurriculumId || undefined,
      subjectId: key === "subject" ? value || undefined : selectedSubjectId || undefined,
      chapterId: key === "chapter" ? value || undefined : selectedChapterId || undefined,
      lessonId: key === "lesson" ? value || undefined : selectedLessonId || undefined,
    });
  };
  

  return (
    <div className="grid grid-cols-5 gap-6">
      <Select placeholder="Chọn khối lớp" onChange={(val) => handleFilterChange("grade", val)}>
        {grades.map((grade) => (
          <Option key={grade.gradeId} value={grade.gradeId}>
            {grade.name}
          </Option>
        ))}
      </Select>
      <Select placeholder="Chọn bộ sách" onChange={(val) => handleFilterChange("curriculum", val)} disabled={!grades.length}>
        {curriculums.map((curriculum) => (
          <Option key={curriculum.curriculumId} value={curriculum.curriculumId}>
            {curriculum.name}
          </Option>
        ))}
      </Select>
      <Select placeholder="Chọn môn học" onChange={(val) => handleFilterChange("subject", val)} disabled={!subjects.length}>
        {subjects.map((subject) => (
          <Option key={subject.subjectInCurriculumId} value={subject.subjectInCurriculumId}>
            {subject.subject}
          </Option>
        ))}
      </Select>
      <Select placeholder="Chọn chương" onChange={(val) => handleFilterChange("chapter", val)} disabled={!chapters.length}>
        {chapters.map((chapter) => (
          <Option key={chapter.chapterId} value={chapter.chapterId}>
            {chapter.name}
          </Option>
        ))}
      </Select>
      <Select placeholder="Chọn bài học" onChange={(val) => handleFilterChange("lesson", val)} disabled={!lessons.length}>
        {lessons.map((lesson) => (
          <Option key={lesson.lessonId} value={lesson.lessonId}>
            {lesson.name}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default FilterSection;
