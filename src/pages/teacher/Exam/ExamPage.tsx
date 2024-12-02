import React, { useState, useEffect } from "react";
import { Select, List, Checkbox, Button,Modal,Input, message } from "antd";
import { GradeItem } from '@/data/teacher/GradeData'; // Update path if necessary
import fetchgrade from "@/api/ApiGradeItem";
import { CurriculumItem } from '@/data/teacher/CurriculumData'; // Update path if necessary
import fetchCurriculum from "@/api/ApiCurriculumItem"
import fetchSubjectsByGradeAndCurriculum, { SubjectInCurriculumItem } from "@/api/ApiSubjectItem";
import fetchChaptersBySubjectInCurriculumId, { ChapterItem } from "@/api/ApiChapterItem";
import fetchLessonByChapter, { lessonItem } from "@/api/ApiLessonItem";
import { getQuestionByLessonId, getQuestionByChapterId ,IViewListQuestionBank } from '@/data/client/QuestionBankData';
import { createExam, ICreateExamRequest } from "@/data/client/ExamData";
import { getUserId } from "@/data/apiClient";

const { Option } = Select;

const ExamPage : React.FC  = () => {
  const [grades, setGrades] = useState<GradeItem[]>([]); // Danh sách khối lớp
  const [selectedGradeId, setSelectedGradeId] = useState(null);

  const [curriculums, setCurriculums] = useState<CurriculumItem[]>([]); // Danh sách bộ sách
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<string | null>(null); // Bộ sách được chọn

  const [subjectInCurriculumIds, setSubjectInCurriculumIds] = useState<SubjectInCurriculumItem[]>([]); // Danh sách môn học
  const [selectedSubjectInCurriculumId, setSelectedSubjectInCurriculumId] = useState<string | null>(null); // Môn học được chọn
  const [chapters, setChapters] = useState<ChapterItem[]>([]); // Danh sách chương
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null); // Chương được chọn

  const [lessons, setLessons] = useState<lessonItem[]>([]); // Danh sách bài học
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null); // Bài học được chọn  

  const [questions, setQuestions] = useState<IViewListQuestionBank[]>([]); // State to store questions
  const [chapterQuestions, setChapterQuestions] = useState<IViewListQuestionBank[]>([]); // Câu hỏi theo chương
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // Hiển thị Modal

  const [examName, setExamName] = useState("");
  const [examTime, setExamTime] = useState("");


  // Giả sử các API để lấy dữ liệu đã được định nghĩa
  useEffect(() => {
    const loadGrades = async () => {
      const gradeData = await fetchgrade();
      setGrades(gradeData); // Cập nhật danh sách khối lớp
    };
    loadGrades();
  }, []);

  useEffect(() => {
    const loadCurriculums = async () => {
      const curriculumData = await fetchCurriculum();
      setCurriculums(curriculumData); // Cập nhật danh sách bộ sách
    };
    loadCurriculums();
  }, []);

  useEffect(() => {
    const loadSubjects = async () => {
      if (selectedGradeId && selectedCurriculumId) {
        const subjectData = await fetchSubjectsByGradeAndCurriculum(selectedGradeId, selectedCurriculumId);
        setSubjectInCurriculumIds(subjectData); // Cập nhật danh sách môn học
      } 
    };
    loadSubjects();
  }, [selectedGradeId, selectedCurriculumId]);
  
  useEffect(() => {
    const loadChapters = async () => {
      if (selectedSubjectInCurriculumId) {
        const chapterData = await fetchChaptersBySubjectInCurriculumId(selectedSubjectInCurriculumId);
        setChapters(chapterData); // Cập nhật danh sách chương
      } 
    };
    loadChapters();
  }, [selectedSubjectInCurriculumId]);
  
  useEffect(() => {
    const loadLessons = async () => {
      if (selectedChapterId) {
        const lessonData = await fetchLessonByChapter(selectedChapterId);
        setLessons(lessonData); // Cập nhật danh sách bài học
      } 
    };
    loadLessons();
  }, [selectedChapterId]);
  
  useEffect(() => {
    if (selectedLessonId) {
      fetchQuestionsByLessonId(selectedLessonId);
    } 
  }, [selectedLessonId]);
  
    // Mở Modal
    const showModal = () => {
      if (selectedQuestions.length === 0) {
        message.warning("Vui lòng chọn ít nhất một câu hỏi trước khi tạo bài kiểm tra!");
        return;
      }
      setIsModalVisible(true);
    };

    const handleCancel = () => {
      setIsModalVisible(false);
      setExamName("");
      setExamTime("");
    };

    const handleSaveExam = async () => {
      if (!examName || !examTime) {
        message.error("Vui lòng nhập đầy đủ thông tin bài kiểm tra!");
        return;
      }
    
      const userId = getUserId() ?? ""; // Xử lý trường hợp null
    
      if (!userId) {
        message.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
        return;
      }
    
      const examData: ICreateExamRequest = {
        title: examName,
        time: examTime,
        userId: userId, // Đảm bảo userId là string
        questionIds: selectedQuestions,
      };
    
      try {
        const newExam = await createExam(examData);
        if (newExam) {
          message.success("Bài kiểm tra đã được tạo thành công!");
          setIsModalVisible(false);
          setExamName("");
          setExamTime("");
          setSelectedQuestions([]); // Reset danh sách câu hỏi
        } else {
          message.error("Tạo bài kiểm tra thất bại. Vui lòng thử lại!");
        }
      } catch (error) {
        console.error("Lỗi khi tạo bài kiểm tra:", error);
        message.error("Có lỗi xảy ra khi tạo bài kiểm tra!");
      }
    };
  
  
  const fetchQuestionsByLessonId = async (lessonId: string) => {
    try {
      const fetchedQuestions = await getQuestionByLessonId(lessonId);
      console.log("Fetched Questions:", fetchedQuestions);
      fetchedQuestions.forEach((question) => {
        console.log(`Question: ${question.question}`);
        question.answers.forEach((answer) => {
          console.log(
            `Answer: ${answer.answerText}, isCorrect: ${answer.isCorrect}`
          );
        });
      });
      setQuestions(fetchedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    const fetchQuestionsByChapterId = async () => {
      if (selectedChapterId) {
        try {
          const fetchedQuestions = await getQuestionByChapterId(selectedChapterId);
          console.log("Fetched Questions by Chapter:", fetchedQuestions);
          setChapterQuestions(fetchedQuestions); // Lưu tất cả câu hỏi trong chương
          setQuestions(fetchedQuestions); // Hiển thị mặc định toàn bộ câu hỏi chương
        } catch (error) {
          console.error("Error fetching questions by chapter:", error);
        }
      } else {
        setChapterQuestions([]);
        setQuestions([]); // Reset danh sách câu hỏi khi không chọn chương
      }
    };
    fetchQuestionsByChapterId();
  }, [selectedChapterId]);


  const handleLessonChange = (lessonId: string | null) => {
    setSelectedLessonId(lessonId);
  
    if (lessonId) {
      // Lọc câu hỏi theo bài
      const filteredQuestions = chapterQuestions.filter(
        (question) => question.lessonId === lessonId
      );
      setQuestions(filteredQuestions);
    } else {
      // Hiển thị tất cả câu hỏi trong chương khi không chọn bài
      setQuestions(chapterQuestions);
    }
  };

  const handleCheckboxChange = (questionId: string, isChecked: boolean) => {
    setSelectedQuestions((prevSelected) =>
      isChecked
        ? [...prevSelected, questionId]
        : prevSelected.filter((id) => id !== questionId)
    );
  };

  return (
        <div className="p-4 bg-gray-100 rounded-lg">
                {/* Filter Bar */}
                <div
              className="grid grid-cols-5 gap-6 items-center mb-4"
              style={{ alignItems: "start" }} // Căn các phần tử từ trên xuống
            >
              {/* Select Khối lớp */}
              <div>
                <label htmlFor="grade" className="block mb-2">
                  Chọn khối lớp:
                </label>
                <Select
                  id="grade"
                  placeholder="Chọn khối lớp"
                  style={{ width: "100%" }}
                  value={selectedGradeId}
                  onChange={(value) => {
                    setSelectedGradeId(value);
                    setSelectedCurriculumId(null);
                    setSelectedSubjectInCurriculumId(null);
                    setSelectedChapterId(null);
                    setSelectedLessonId(null);
                  }}
                >
                  {grades.map((grade) => (
                    <Option key={grade.gradeId} value={grade.gradeId}>
                      {grade.name}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Select Bộ sách */}
              <div>
                <label htmlFor="curriculum" className="block mb-2">
                  Chọn bộ sách:
                </label>
                <Select
                  id="curriculum"
                  placeholder="Chọn bộ sách"
                  style={{ width: "100%" }}
                  value={selectedCurriculumId}
                  onChange={(value) => {
                    setSelectedCurriculumId(value);
                    setSelectedSubjectInCurriculumId(null);
                    setSelectedChapterId(null);
                    setSelectedLessonId(null);
                  }}
                >
                  {curriculums.map((curriculum) => (
                    <Option key={curriculum.curriculumId} value={curriculum.curriculumId}>
                      {curriculum.name}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Select Môn học */}
              <div>
                <label htmlFor="subject" className="block mb-2">
                  Chọn môn học:
                </label>
                <Select
                  id="subject"
                  placeholder="Chọn môn học"
                  style={{ width: "100%" }}
                  value={selectedSubjectInCurriculumId}
                  disabled={!subjectInCurriculumIds.length}
                  onChange={(value) => {
                    setSelectedSubjectInCurriculumId(value);
                    setSelectedChapterId(null);
                    setSelectedLessonId(null);
                  }}
                >
                  {subjectInCurriculumIds.map((subject) => (
                    <Option
                      key={subject.subjectInCurriculumId}
                      value={subject.subjectInCurriculumId}
                    >
                      {subject.subject}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Select Chương */}
              <div>
                <label htmlFor="chapter" className="block mb-2">
                  Chọn chương:
                </label>
                <Select
                  id="chapter"
                  placeholder="Chọn chương"
                  style={{ width: "100%" }}
                  value={selectedChapterId}
                  disabled={!chapters.length}
                  onChange={(value) => {
                    setSelectedChapterId(value);
                    setSelectedLessonId(null);
                  }}
                >
                  {chapters.map((chapter) => (
                    <Option key={chapter.chapterId} value={chapter.chapterId}>
                      {chapter.name}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Select Bài học */}
              <div>
                <label htmlFor="lesson" className="block mb-2">
                  Chọn bài:
                </label>
                <Select
                  placeholder="Chọn bài học"
                  style={{ width: "100%" }}
                  value={selectedLessonId}
                  onChange={handleLessonChange}
                  allowClear
                >
                  {lessons.map((lesson) => (
                    <Option key={lesson.lessonId} value={lesson.lessonId}>
                      {lesson.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Button */}
            <div className="flex justify-end mt-4">
              <Button type="primary" onClick={showModal}>
                Thêm vào danh sách bài kiểm tra
              </Button>
      </div>
      {/* Questions List */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Danh sách câu hỏi:</h3>
        <List
            bordered
            dataSource={questions}
            renderItem={(item, index) => (
              <List.Item className="p-4 bg-gray-50 rounded-md shadow-sm mb-4">
                <div className="flex items-start">
                  <Checkbox
                    className="mr-4"
                    onChange={(e) =>
                      handleCheckboxChange(item.id, e.target.checked)
                    }
                  />
                  <div>
                    <h4 className="font-bold text-lg mb-2">
                      Câu {index + 1}: {item.question}
                    </h4>
                    <ul className="pl-6">
                      {item.answers.map((answer, idx) => (
                        <li key={answer.id} className="mb-1">
                          <span
                            style={{
                              color: answer.isCorrect ? 'green' : 'black',
                              fontWeight: answer.isCorrect ? 'bold' : 'normal',
                            }}
                          >
                            <b>{String.fromCharCode(65 + idx)}.</b>{' '}
                            {answer.answerText}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </List.Item>
            )}
          />
      </div>

                  {/* Modal nhập thông tin bài kiểm tra */}
      <Modal
        title="Nhập thông tin bài kiểm tra"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveExam}>
            Lưu
          </Button>,
        ]}
      >
        <Input
          placeholder="Nhập tên bài kiểm tra"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          style={{ marginBottom: "1rem" }}
        />
        <Input
          placeholder="Nhập thời gian làm bài (ví dụ: 60 phút)"
          value={examTime}
          onChange={(e) => setExamTime(e.target.value)}
        />
      </Modal>

    </div>
  );
};

export default ExamPage;