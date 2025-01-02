import React, { useEffect, useState } from "react";
import {
  getExamDetailsById,
  IExamDetails,
  IExamQuestion,
} from "@/data/client/ExamData";
import { Spin, Alert, Button, Modal, message, Input, Form } from "antd";
import AddNewQuestion from "./AddNewQuestion";
import { updateExam, IQuestion } from "@/data/client/ExamData"; // Import the updateExam API function

interface UpdateExamPageProps {
  examId: string;
}

const UpdateExamPage: React.FC<UpdateExamPageProps> = ({ examId }) => {
  const [examDetails, setExamDetails] = useState<IExamDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Form values for editing title and time
  const [editTitle, setEditTitle] = useState<string>("");
  const [editTime, setEditTime] = useState<string>("");

  useEffect(() => {
    const fetchExamDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getExamDetailsById(examId);
        if (data) {
          setExamDetails(data);
          setEditTitle(data.title);
          setEditTime(data.time);
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

  const handleAddQuestions = (selectedQuestions: IQuestion[]) => {
    if (examDetails) {
      const mappedQuestions: IExamQuestion[] = selectedQuestions.map((q, index) => ({
        questionId: q.questionId,
        question: q.question,
        type: q.type,
        plum: q.plum,
        index: examDetails.questions.length + index + 1,
        answers: q.answers.map((a) => ({
          answerId: a.answerId,
          answerText: a.answerText,
          isCorrect: a.isCorrect,
        })),
      }));

      const updatedQuestions = [...examDetails.questions, ...mappedQuestions];
      setExamDetails({ ...examDetails, questions: updatedQuestions });
      setShowAddQuestionModal(false);
    }
  };

  const handleRemoveQuestion = (questionIndex: number) => {
    if (examDetails) {
      const updatedQuestions = [...examDetails.questions];
      updatedQuestions.splice(questionIndex, 1);
      setExamDetails({ ...examDetails, questions: updatedQuestions });
    }
  };

  const handleUpdateExam = async () => {
    if (!editTitle.trim() || !editTime.trim()) {
      message.error("Vui lòng điền đầy đủ thông tin Tiêu đề bài kiểm tra và Thời gian làm bài.");
      return;
    }
    if (examDetails) {
      setIsUpdating(true);
      try {
        const questionIds = examDetails.questions.map(
          (question) => question.questionId
        );
        const success = await updateExam(
          examDetails.examId,
          editTitle,
          editTime,
          questionIds
        );

        if (success) {
          message.success("Cập nhật bài kiểm tra thành công!");
          setExamDetails({ ...examDetails, title: editTitle, time: editTime });
        } else {
          message.error("Cập nhật bài kiểm tra thất bại!");
        }
      } catch (error) {
        message.error("Đã xảy ra lỗi trong khi cập nhật bài kiểm tra.");
      } finally {
        setIsUpdating(false);
      }
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

  return (
    <div className="p-0 bg-transparent">
      <div className="max-w-4xl mx-auto bg-white shadow-none rounded-lg p-6 flex flex-col justify-between h-full border-none">
        <Form layout="vertical">
          <Form.Item label="Tiêu đề bài kiểm tra">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Tên bài kiểm tra"
            />
          </Form.Item>
          <Form.Item label="Thời gian làm bài">
            <Input
              value={editTime}
              onChange={(e) => setEditTime(e.target.value)}
              placeholder="Nhập thời gian làm bài (vd: 60 phút)"
            />
          </Form.Item>
        </Form>

        <Button
          type="primary"
          onClick={() => setShowAnswers(!showAnswers)}
          className="mb-6 w-auto self-start"
        >
          {showAnswers ? "Ẩn đáp án" : "Hiển thị đáp án"}
        </Button>

        <div className="mb-8">
          {examDetails.questions.map((question, index) => (
            <div key={`${question.questionId}-${index}`} className="mb-6">
              <p className="font-bold text-lg mb-2">
                Câu {index + 1}: {question.question}
                <Button
                  danger
                  className="ml-4"
                  onClick={() => handleRemoveQuestion(index)}
                >
                  Xóa
                </Button>
              </p>
              {renderAnswers(question.answers)}
            </div>
          ))}
        </div>

        <Button
          type="dashed"
          onClick={() => setShowAddQuestionModal(true)}
          className="mb-6 w-full"
        >
          Thêm câu hỏi
        </Button>

        <div className="flex justify-center gap-2 mt-auto">
        <Button
            type="primary"
            onClick={handleUpdateExam}
            loading={isUpdating}
          >
            Cập nhật bài kiểm tra
          </Button>
        </div>
      </div>

      <Modal
        visible={showAddQuestionModal}
        title="Thêm câu hỏi mới"
        onCancel={() => setShowAddQuestionModal(false)}
        footer={null}
        width={1150}
      >
        <AddNewQuestion onAddQuestions={handleAddQuestions} />
      </Modal>
    </div>
  );
};

export default UpdateExamPage;
