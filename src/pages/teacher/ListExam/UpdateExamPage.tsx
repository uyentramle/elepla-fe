import React, { useEffect, useState } from "react";
import {
  getExamDetailsById,
  updateExam,
  IExamDetails,
  IExamQuestion,
} from "@/data/client/ExamData";
import {IQuestion,} from "@/data/academy-staff/QuestionBankData";
import { Spin, Alert, Button, Input, message, Modal  } from "antd";
import AddQuestionExam from "./AddQuestionExam"; // Import AddQuestionExam

interface UpdateExamPageProps {
  examId: string;
}

const UpdateExamPage: React.FC<UpdateExamPageProps> = ({ examId }) => {
  const [examDetails, setExamDetails] = useState<IExamDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedTime, setEditedTime] = useState<number | null>(null);
  const [isAddQuestionModalVisible, setIsAddQuestionModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchExamDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getExamDetailsById(examId);
        if (data) {
          setExamDetails(data);
          setEditedTitle(data.title);
          setEditedTime(Number(data.time));
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

  const handleRemoveQuestion = (questionId: string) => {
    if (!examDetails) return;
    const updatedQuestions = examDetails.questions.filter(
      (q) => q.questionId !== questionId
    );
    setExamDetails({ ...examDetails, questions: updatedQuestions });
  };

  const handleCancel = () => {
    if (!examDetails) return;
    setEditedTitle(examDetails.title);
    setEditedTime(Number(examDetails.time));
    setIsEditing(false);
  };

  const handleAddQuestions = (newQuestions: IQuestion[]) => {
    if (!examDetails) return;
  
    // Chuyển đổi IQuestion[] thành IExamQuestion[]
    const convertedQuestions: IExamQuestion[] = newQuestions.map((question, index) => ({
      ...question,
      index: examDetails.questions.length + index + 1, // Tạo giá trị `index`
    }));
  
    // Thêm câu hỏi mới vào danh sách hiện tại
    const updatedQuestions = [
      ...examDetails.questions,
      ...convertedQuestions.filter(
        (newQuestion) =>
          !examDetails.questions.some((q) => q.questionId === newQuestion.questionId)
      ), // Loại bỏ câu hỏi trùng lặp
    ];
  
    setExamDetails({ ...examDetails, questions: updatedQuestions });
    setIsAddQuestionModalVisible(false); // Đóng modal sau khi thêm
    message.success("Thêm câu hỏi thành công."); // Thông báo thành công
  };

  const handleSave = async () => {
    if (!examDetails || !editedTime) return;

    const updatedData = {
      title: editedTitle,
      time: editedTime.toString(),
      questionIds: examDetails.questions.map((q) => q.questionId),
    };

    const isUpdated = await updateExam(examId, updatedData);
    if (isUpdated) {
      message.success("Cập nhật bài kiểm tra thành công.");
      setIsEditing(false);
    } else {
      message.error("Cập nhật bài kiểm tra thất bại.");
    }
  };

  const renderAnswers = (answers: IExamQuestion["answers"]) => (
    <ul className="list-disc pl-6">
      {answers.map((answer, index) => {
        const option = String.fromCharCode(65 + index);
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-6">
          {isEditing ? (
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          ) : (
            examDetails?.title
          )}
        </h1>
  
        {/* Thời gian làm bài */}
        <p className="text-lg mb-6">
          <strong>Thời gian làm bài:</strong>{" "}
          {isEditing ? (
            <Input
              type="number"
              min={1}
              placeholder="Nhập thời gian (phút)"
              value={editedTime ? editedTime : ""}
              onChange={(e) => setEditedTime(Number(e.target.value))}
              style={{ width: "120px" }}
            />
          ) : (
            `${examDetails?.time}`
          )}
        </p>
  
        {/* Danh sách câu hỏi */}
        <Button
          type="default"
          onClick={() => setShowAnswers(!showAnswers)}
          style={{ marginBottom: "12px" }}
        >
          {showAnswers ? "Ẩn đáp án" : "Hiển thị đáp án"}
        </Button>
  
        <div>
          {examDetails?.questions.map((question, index) => (
            <div key={question.questionId} className="mb-6">
              <p className="font-bold text-lg mb-2">
                Câu {index + 1}: {question.question}
                {isEditing && (
                  <Button
                    type="link"
                    danger
                    onClick={() => handleRemoveQuestion(question.questionId)}
                  >
                    Xóa
                  </Button>
                )}
              </p>
              {renderAnswers(question.answers)}
            </div>
          ))}
        </div>
  
        {/* Button Action */}
        <div className="flex justify-end gap-4 mt-6">
          {isEditing ? (
            <>
              <Button type="default" onClick={() => setIsAddQuestionModalVisible(true)}>
                Thêm câu hỏi
              </Button>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" onClick={handleSave}>
                Lưu
              </Button>
            </>
          ) : (
            <Button type="primary" onClick={() => setIsEditing(true)}>
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>
  
      {/* Modal thêm câu hỏi */}
      <Modal
        title="Thêm câu hỏi vào bài kiểm tra"
        visible={isAddQuestionModalVisible}
        onCancel={() => setIsAddQuestionModalVisible(false)}
        footer={null}
        width={800}
      >
        <AddQuestionExam onAddQuestions={handleAddQuestions} />
      </Modal>
    </div>
  );
};

export default UpdateExamPage;
