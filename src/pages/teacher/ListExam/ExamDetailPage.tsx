import React, { useEffect, useState } from "react";
import { getExamDetailsById, IExamDetails, IExamQuestion, exportExamToWord, exportExamToPdf } from "@/data/client/ExamData";
import { Spin, Alert } from "antd";

interface ExamDetailPageProps {
  examId: string;
}

const ExamDetailPage: React.FC<ExamDetailPageProps> = ({ examId }) => {
  const [examDetails, setExamDetails] = useState<IExamDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExamDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getExamDetailsById(examId);
        if (data) {
          setExamDetails(data);
        } else {
          setError("Không tìm thấy thông tin bài kiểm tra.");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải thông tin bài kiểm tra.");
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [examId]);


  const handleExportWord = async () => {
    if (!examDetails) return;
    try {
      const blob = await exportExamToWord(examId);
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${examDetails.title || "Exam"}.docx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      } else {
        alert("Xuất file Word không thành công!");
      }
    } catch (error) {
      alert("Đã xảy ra lỗi khi xuất file Word!");
    }
  };

  const handleExportPdf = async () => {
    if (!examDetails) return;
    try {
      const blob = await exportExamToPdf(examId);
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${examDetails.title || "Exam"}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      } else {
        alert("Xuất file PDF không thành công!");
      }
    } catch (error) {
      alert("Đã xảy ra lỗi khi xuất file PDF!");
    }
  };

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

  const renderAnswers = (answers: IExamQuestion["answers"]) => (
    <ul className="list-disc pl-6">
      {answers.map((answer, index) => {
        const option = String.fromCharCode(65 + index); // A, B, C, D,...
        return (
          <li
            key={answer.answerId}
            className={`text-gray-700 ${
              answer.isCorrect ? "text-green-600 font-semibold" : ""
            }`}
          >
            <strong>{option}. </strong>
            {answer.answerText}
          </li>
        );
      })}
    </ul>
  )


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
      {/* Nút xuất file */}
      <div className="flex justify-end mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-600"
            onClick={handleExportWord}
          >
            Xuất file Word
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            onClick={handleExportPdf}
          >
            Xuất file PDF
          </button>
        </div>
      
      {/* Tiêu đề và thời gian */}
      <h1 className="text-2xl font-bold mb-4">{examDetails.title}</h1>
        <p className="text-lg mb-6">
          <strong>Thời gian làm bài:</strong> {examDetails.time}
        </p>

        {/* Danh sách câu hỏi */}
        <div>
          {examDetails.questions.map((question, index) => (
            <div key={question.questionId} className="mb-6">
              <p className="font-bold text-lg mb-2">
                Câu {index + 1}: {question.question}
              </p>
              {renderAnswers(question.answers)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamDetailPage;
