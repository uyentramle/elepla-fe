import React, { useState, useEffect } from 'react';
import fetchGrades from '@/api/ApiGradeItem'; // API for Grade data
import fetchCurriculum from '@/api/ApiCurriculumItem'; // API for Curriculum data
import fetchSubjectsByGradeAndCurriculum, {
    SubjectInCurriculumItem
} from '@/api/ApiSubjectItem';
import fetchChaptersBySubjectInCurriculumId, {
     ChapterItem 
    } from '@/api/ApiChapterItem';
import fetchLessonByChapter,{
    lessonItem
} from '@/api/ApiLessonItem';


interface GradeItem {
    gradeId: string;
    name: string;
}



interface CurriculumItem {
    curriculumId: string;
    name: string;
}

interface CreateLessonProps {
    onSubmit: (lessonId: string) => void;
  }
  

const CreateLesson: React.FC<CreateLessonProps> = ({ onSubmit }) => {
    const [grades, setGrades] = useState<GradeItem[]>([]);
    const [curriculums, setCurriculums] = useState<CurriculumItem[]>([]);
    const [subjects, setSubjects] = useState<SubjectInCurriculumItem[]>([]);
    const [chapters, setChapters] = useState<ChapterItem[]>([]);
    const [lessons, setLessons] = useState<lessonItem[]>([]);
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedCurriculum, setSelectedCurriculum] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedChapter, setSelectedChapter] = useState('');
    const [selectedLesson, setSelectedLesson] = useState('');


    // Fetch grades when the component mounts
    useEffect(() => {
        const loadGrades = async () => {
            const gradeData = await fetchGrades();
            setGrades(gradeData);
        };
        loadGrades();
    }, []);

    // Fetch curriculums when the component mounts
    useEffect(() => {
        const loadCurriculums = async () => {
            const curriculumData = await fetchCurriculum();
            setCurriculums(curriculumData);
        };
        loadCurriculums();
    }, []);

    // Fetch subjects when both grade and curriculum are selected
    useEffect(() => {
        const loadSubjects = async () => {
            if (selectedGrade && selectedCurriculum) {
                const subjectData = await fetchSubjectsByGradeAndCurriculum(selectedGrade, selectedCurriculum);
                setSubjects(subjectData);
            } else {
                setSubjects([]);
            }
        };
        loadSubjects();
    }, [selectedGrade, selectedCurriculum]);

    // Fetch chapters when subject is selected
    useEffect(() => {
        const loadChapters = async () => {
            if (selectedSubject) {
                const chapterData = await fetchChaptersBySubjectInCurriculumId(selectedSubject);
                setChapters(chapterData);
            } else {
                setChapters([]);
            }
        };
        loadChapters();
    }, [selectedSubject]);

        // Fetch chapters when subject is selected
        useEffect(() => {
            const loadLessons = async () => {
                if (selectedChapter) {
                    const lessonData = await fetchLessonByChapter(selectedChapter);
                    setLessons(lessonData);
                } else {
                    setLessons([]);
                }
            };
            loadLessons();
        }, [selectedChapter]);

        const handleCreate = () => {
            if (selectedLesson) {
              onSubmit(selectedLesson); // Truyền lessonId đã chọn ra ngoài
            }
          };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Chọn kế hoạch bài dạy</h1>

            {/* Grade Dropdown */}
            <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">Chọn Khối lớp:</label>
                <select
                    className="w-full p-2 border border-gray-300 rounded"
                    value={selectedGrade}
                    onChange={(e) => {
                        setSelectedGrade(e.target.value);
                        setSelectedCurriculum('');
                        setSelectedSubject('');
                    }}
                >
                    <option value="">-- Chọn Khối lớp --</option>
                    {grades.map((grade) => (
                        <option key={grade.gradeId} value={grade.gradeId}>
                            {grade.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Curriculum Dropdown */}
            <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">Chọn Bộ sách:</label>
                <select
                    className="w-full p-2 border border-gray-300 rounded"
                    value={selectedCurriculum}
                    onChange={(e) => {
                        setSelectedCurriculum(e.target.value);
                        setSelectedSubject('');
                    }}
                    disabled={!selectedGrade}
                >
                    <option value="">-- Chọn Bộ sách --</option>
                    {curriculums.map((curriculum) => (
                        <option key={curriculum.curriculumId} value={curriculum.curriculumId}>
                            {curriculum.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Subject Dropdown */}
            <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">Chọn Môn học:</label>
                <select
                    className="w-full p-2 border border-gray-300 rounded"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    disabled={!selectedGrade || !selectedCurriculum}
                >
                    <option value="">-- Chọn Môn học --</option>
                    {subjects.map((subject) => (
                        <option key={subject.subjectInCurriculumId} value={subject.subjectInCurriculumId}>
                            {subject.subject}
                        </option>
                    ))}
                </select>
            </div>

            {/* Chapter Dropdown */}
            <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">Chọn Chương:</label>
                <select
                    className="w-full p-2 border border-gray-300 rounded"
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    disabled={!selectedSubject}
                >
                    <option value="">-- Chọn Chương --</option>
                    {chapters.map((chapter) => (
                        <option key={chapter.chapterId} value={chapter.chapterId}>
                            {chapter.name}
                        </option>
                    ))}
                </select>
            </div>

             {/* lesson Dropdown */}
            <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">Chọn Bài:</label>
                <select
                    className="w-full p-2 border border-gray-300 rounded"
                    value={selectedLesson}
                    onChange={(e) => setSelectedLesson(e.target.value)}
                    disabled={!selectedChapter}
                >
                    <option value="">-- Chọn Bài --</option>
                    {lessons.map((lesson) => (
                        <option key={lesson.lessonId} value={lesson.lessonId}>
                            {lesson.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
            <button
                className="w-full bg-blue-600 text-white p-3 rounded font-bold"
                onClick={handleCreate}
                disabled={!selectedLesson}
            >
                Tạo
            </button>
            </div>
        </div>
    );
};

export default CreateLesson;