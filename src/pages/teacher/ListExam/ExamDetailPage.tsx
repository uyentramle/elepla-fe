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
    <div className="p-0 bg-transparent">
        <div className="max-w-4xl mx-auto bg-white shadow-none rounded-lg p-6 flex flex-col justify-between h-full border-none">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-6">{examDetails.title}</h1>
  
        {/* Thời gian làm bài */}
        <p className="text-lg mb-6">
          <strong>Thời gian làm bài:</strong> {examDetails.time}
        </p>
  
        {/* Hiển thị đáp án button */}
        <Button
          type="primary"
          onClick={() => setShowAnswers(!showAnswers)}
          className="mb-6 w-auto self-start"
          style={{
            fontSize: "0.875rem", // Smaller button text
            border: "none", // Loại bỏ viền button
            boxShadow: "none", // Loại bỏ shadow nếu có
          }}
        >
          {showAnswers ? "Ẩn đáp án" : "Hiển thị đáp án"}
        </Button>
  
        {/* Danh sách câu hỏi */}
        <div className="mb-8">
          {examDetails.questions.map((question, index) => (
            <div key={question.questionId} className="mb-6">
              <p className="font-bold text-lg mb-2">
                Câu {index + 1}: {question.question}
              </p>
              {renderAnswers(question.answers)}
            </div>
          ))}
        </div>
  
        {/* Buttons */}
        <div className="flex justify-center gap-2 mt-auto">
              <Button
                onClick={() => handleExportFile(exportExamToWord, false)}
                className="custom-button"
              >
                Xuất file Word
              </Button>
              <Button
                onClick={() => handleExportFile(exportExamToPdf, false)}
                className="custom-button"
              >
                Xuất file PDF
              </Button>
              <Button
                onClick={() => handleExportFile(exportExamWithAnswersToWord, true)}
                className="custom-button"
              >
                Xuất Word (kèm đáp án)
              </Button>
              <Button
                onClick={() => handleExportFile(exportExamWithAnswersToPdf, true)}
                className="custom-button"
              >
                Xuất PDF (kèm đáp án)
              </Button>
          </div>
      </div>
    </div>
  );
  
  
};

export default ExamDetailPage;