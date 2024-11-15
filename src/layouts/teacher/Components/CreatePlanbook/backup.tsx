

// import React, { useState } from 'react';

// // Data mẫu
// import Grade_data from '@/data/teacher/GradeData';
// import Curriculum_data from '@/data/teacher/CurriculumData';
// import SubjectInCurriculum_data from '@/data/teacher/SubjectInCurriculum';
// import Chapter_data from '@/data/teacher/ChapterData';
// import Lesson_data from '@/data/teacher/lessonData';

// const LessonPlanner: React.FC =() => {
//     const [selectedGrade, setSelectedGrade] = useState('');
//     const [selectedCurriculum, setSelectedCurriculum] = useState('');
//     const [selectedSubject, setSelectedSubject] = useState('');
//     const [selectedChapter, setSelectedChapter] = useState('');
//     const [selectedLesson, setSelectedLesson] = useState('');

//     // Lọc dữ liệu dựa trên lựa chọn của người dùng
//     const filteredCurriculums = Curriculum_data.filter(
//         (curriculum) => selectedGrade && SubjectInCurriculum_data.some(
//             (subject) => subject.gradeId === selectedGrade && subject.curriculumId === curriculum.curriculumId
//         )
//     );

//     const filteredSubjects = SubjectInCurriculum_data.filter(
//         (subject) => subject.gradeId === selectedGrade && subject.curriculumId === selectedCurriculum
//     );

//     const filteredChapters = Chapter_data.filter(
//         (chapter) => chapter.subjectInCurriculumId === selectedSubject
//     );

//     const filteredLessons = Lesson_data.filter(
//         (lesson) => lesson.chapterId === selectedChapter
//     );

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-2xl font-bold mb-6">Tạo giáo án</h1>

//             <div className="mb-4">
//                 <label className="block text-lg font-semibold mb-2">Chọn Khối lớp:</label>
//                 <select
//                     className="w-full p-2 border border-gray-300 rounded"
//                     value={selectedGrade}
//                     onChange={(e) => {
//                         setSelectedGrade(e.target.value);
//                         setSelectedCurriculum('');
//                         setSelectedSubject('');
//                         setSelectedChapter('');
//                         setSelectedLesson('');
//                     }}
//                 >
//                     <option value="">-- Chọn Khối lớp --</option>
//                     {Grade_data.map((grade) => (
//                         <option key={grade.gradeId} value={grade.gradeId}>
//                             {grade.name}
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             <div className="mb-4">
//                 <label className="block text-lg font-semibold mb-2">Chọn Bộ sách:</label>
//                 <select
//                     className="w-full p-2 border border-gray-300 rounded"
//                     value={selectedCurriculum}
//                     onChange={(e) => {
//                         setSelectedCurriculum(e.target.value);
//                         setSelectedSubject('');
//                         setSelectedChapter('');
//                         setSelectedLesson('');
//                     }}
//                     disabled={!selectedGrade}
//                 >
//                     <option value="">-- Chọn Bộ sách --</option>
//                     {filteredCurriculums.map((curriculum) => (
//                         <option key={curriculum.curriculumId} value={curriculum.curriculumId}>
//                             {curriculum.name}
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             <div className="mb-4">
//                 <label className="block text-lg font-semibold mb-2">Chọn Môn học:</label>
//                 <select
//                     className="w-full p-2 border border-gray-300 rounded"
//                     value={selectedSubject}
//                     onChange={(e) => {
//                         setSelectedSubject(e.target.value);
//                         setSelectedChapter('');
//                         setSelectedLesson('');
//                     }}
//                     disabled={!selectedCurriculum}
//                 >
//                     <option value="">-- Chọn Môn học --</option>
//                     {filteredSubjects.map((subject) => (
//                         <option key={subject.subjectInCurriculumId} value={subject.subjectInCurriculumId}>
//                             {subject.subject}
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             <div className="mb-4">
//                 <label className="block text-lg font-semibold mb-2">Chọn Chương:</label>
//                 <select
//                     className="w-full p-2 border border-gray-300 rounded"
//                     value={selectedChapter}
//                     onChange={(e) => {
//                         setSelectedChapter(e.target.value);
//                         setSelectedLesson('');
//                     }}
//                     disabled={!selectedSubject}
//                 >
//                     <option value="">-- Chọn Chương --</option>
//                     {filteredChapters.map((chapter) => (
//                         <option key={chapter.chapterId} value={chapter.chapterId}>
//                             {chapter.name}
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             <div className="mb-4">
//                 <label className="block text-lg font-semibold mb-2">Chọn Bài:</label>
//                 <select
//                     className="w-full p-2 border border-gray-300 rounded"
//                     value={selectedLesson}
//                     onChange={(e) => setSelectedLesson(e.target.value)}
//                     disabled={!selectedChapter}
//                 >
//                     <option value="">-- Chọn Bài --</option>
//                     {filteredLessons.map((lesson) => (
//                         <option key={lesson.lessonId} value={lesson.lessonId}>
//                             {lesson.name}
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             <div className="mt-6">
//                 <button
//                     className="w-full bg-blue-600 text-white p-3 rounded font-bold"
//                     disabled={!selectedLesson}
//                     onClick={() => alert(`Đã tạo giáo án cho bài ${selectedLesson}`)}
//                 >
//                     Tạo giáo án
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default LessonPlanner;
