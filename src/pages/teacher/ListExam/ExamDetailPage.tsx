import React, { useEffect, useState } from "react";
import {
  getExamDetailsById,
  IExamDetails,
  IExamQuestion,
  exportExamToWord,
  exportExamToPdf,
  exportExamWithAnswersToWord,
  exportExamWithAnswersToPdf,
} from "@/data/client/ExamData";
import { getUserId } from "@/data/apiClient"; // Import hàm getUserId
import { Spin, Alert, Button } from "antd";

interface ExamDetailPageProps {
  examId: string;
}

const ExamDetailPage: React.FC<ExamDetailPageProps> = ({ examId }) => {
  const [examDetails, setExamDetails] = useState<IExamDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // Lấy userId
    setUserId(getUserId() || "");

    const fetchExamDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getExamDetailsById(examId);
        if (data) setExamDetails(data);
        else setError("Không tìm thấy thông tin bài kiểm tra.");
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải thông tin bài kiểm tra.");
      } finally {
        setLoading(false);
      }
    };
    fetchExamDetails();
  }, [examId]);

  const handleExportFile = async (
    exportFunction: (examId: string, userId: string) => Promise<void>,
    includeAnswers: boolean
  ) => {
    try {
      await exportFunction(examId, userId);
      console.log(includeAnswers)
    } catch (error) {
      alert(`Đã xảy ra lỗi khi xuất file.`);
    }
  };

  const renderAnswers = (answers: IExamQuestion["answers"]) => (
    <ul className="list-disc pl-6">
      {answers.map((answer, index) => {
        const option = String.fromCharCode(65 + index); // A, B, C, D...
        return (
          <li key={answer.answerId} className="text-gray-700">
            <strong>{option}. </strong>
            {answer.answerText}
            {showAnswers && answer.isCorrect && (
              <span className="ml-2 text-green-600">(Đúng)</span>
            )}
          </li>
        );
      })}
    </ul>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert message="Lỗi" description={error} type="error" showIcon />
      </div>
    );
  }

  if (!examDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert message="Thông báo" description="Không có dữ liệu để hiển thị." type="info" showIcon />
      </div>
    );
  }

  return (
    <div className="p-0 bg-transparent h-full flex flex-col">
      <div className="max-w-4xl mx-auto bg-white flex flex-col h-full border-none relative">
  
        {/* Nội dung cuộn */}
        <div className="flex-grow overflow-y-auto px-4">
          {/* Header */}
          <h1 className="text-3xl font-bold text-center my-4">{examDetails.title}</h1>
  
          {/* Thời gian làm bài */}
          <p className="text-lg mb-4">
            <strong>Thời gian làm bài:</strong> {examDetails.time}
          </p>
  
          {/* Hiển thị đáp án button */}
          <Button
            type="primary"
            onClick={() => setShowAnswers(!showAnswers)}
            className="mb-4 w-auto"
            style={{
              fontSize: "0.875rem",
              border: "none",
              boxShadow: "none",
            }}
          >
            {showAnswers ? "Ẩn đáp án" : "Hiển thị đáp án"}
          </Button>
  
          {/* Danh sách câu hỏi */}
          {examDetails.questions.map((question, index) => (
            <div key={question.questionId} className="mb-6">
              <p className="font-bold text-lg mb-2">
                Câu {index + 1}: {question.question}
              </p>
              {renderAnswers(question.answers)}
            </div>
          ))}
        </div>
  
        {/* Footer cố định */}
        <div
          className="flex justify-between gap-2 p-4 bg-white shadow-md"
          style={{
            position: "sticky",
            bottom: -30, // Đẩy footer cách cạnh dưới một chút
            left: 0,
            right: 0,
            zIndex: 10,
            borderTop: "1px solid #e5e5e5",
          }}
        >
          <Button
            onClick={() => handleExportFile(exportExamToWord, false)}
            className="w-full py-2"
          >
            Xuất file Word
          </Button>
          <Button
            onClick={() => handleExportFile(exportExamToPdf, false)}
            className="w-full py-2"
          >
            Xuất file PDF
          </Button>
          <Button
            onClick={() => handleExportFile(exportExamWithAnswersToWord, true)}
            className="w-full py-2"
          >
            Xuất Word (kèm đáp án)
          </Button>
          <Button
            onClick={() => handleExportFile(exportExamWithAnswersToPdf, true)}
            className="w-full py-2"
          >
            Xuất PDF (kèm đáp án)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailPage;