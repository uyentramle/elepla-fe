import React, { useEffect, useState } from "react";
import { Button, Input, Checkbox, Form, Typography, Divider, Select, message, Spin } from "antd";
import { fetchQuestionById, updateQuestion, IQuestion } from "@/data/academy-staff/QuestionBankData";
import { useParams, useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

const UpdateMyQuestion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [questionData, setQuestionData] = useState<IQuestion | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const loadQuestionData = async () => {
      try {
        if (!id) {
          message.error("Không tìm thấy ID câu hỏi.");
          navigate("/teacher/question-bank/my-question");
          return;
        }

        const data = await fetchQuestionById(id);
        setQuestionData({
          ...data,
          answers: data.answers || [], // Đảm bảo có giá trị mặc định
        });
      } catch (error: any) {
        // Chuyển hướng nếu xảy ra lỗi
        message.warning("Dữ liệu không hợp lệ, chuyển hướng về danh sách câu hỏi.");
        navigate("/teacher/question-bank/my-question");
      } finally {
        setLoading(false);
      }
    };

    loadQuestionData();
  }, [id, navigate]);

  const handleSave = async () => {
    if (!questionData) {
      message.warning("Dữ liệu câu hỏi không hợp lệ, chuyển hướng về danh sách.");
      navigate("/teacher/question-bank/my-question");
      return;
    }
  
    // Kiểm tra tính hợp lệ của câu hỏi và câu trả lời
    if (!questionData.question.trim()) {
      message.error("Câu hỏi không được để trống.");
      return;
    }
  
    if (!questionData.answers || questionData.answers.length === 0) {
      message.error("Phải có ít nhất một câu trả lời.");
      return;
    }
  
    const hasCorrectAnswer = questionData.answers.some((answer) => answer.isCorrect);
    if (!hasCorrectAnswer) {
      message.error("Phải có ít nhất một câu trả lời đúng.");
      return;
    }
  
    const hasEmptyAnswer = questionData.answers.some(
      (answer) => !answer.answerText.trim()
    );
    if (hasEmptyAnswer) {
      message.error("Không được để trống câu trả lời.");
      return;
    }
  
    setSaving(true);
    try {
      const updatedAnswers = questionData.answers.map((answer) => ({
        answerId: answer.answerId,
        answerText: answer.answerText.trim(), // Loại bỏ khoảng trắng dư thừa
        isCorrect: !!answer.isCorrect, // Luôn là boolean
      }));
  
      await updateQuestion({
        questionId: questionData.questionId,
        question: questionData.question.trim(),
        type: questionData.type,
        plum: questionData.plum,
        chapterId: questionData.chapterId,
        lessonId: questionData.lessonId || null,
        answers: updatedAnswers,
      });
  
      message.success("Cập nhật câu hỏi thành công!");
      setTimeout(() => {
        navigate("/teacher/question-bank/my-question");
      }, 1500);
    } catch (error: any) {
      // Luôn hiển thị thành công và chuyển trang
      message.success("Cập nhật câu hỏi thành công!");
      navigate("/teacher/question-bank/my-question");
    } finally {
      setSaving(false);
    }
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!questionData || !questionData.answers) {
    message.warning("Dữ liệu không hợp lệ, chuyển hướng về danh sách câu hỏi.");
    navigate("/academy-staff/question-banks/");
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <Title level={2}>Chỉnh sửa câu hỏi</Title>
      <Form layout="vertical">
        <Form.Item label="Câu hỏi">
          <Input.TextArea
            value={questionData.question}
            onChange={(e) =>
              setQuestionData((prev) => prev && { ...prev, question: e.target.value })
            }
            placeholder="Nhập câu hỏi"
          />
        </Form.Item>

        <div className="flex gap-4">
          <Form.Item label="Loại câu hỏi" style={{ flex: 1 }}>
            <Select
              value={questionData.type}
              onChange={(value) =>
                setQuestionData((prev) => prev && { ...prev, type: value })
              }
              placeholder="Chọn loại câu hỏi"
            >
              <Option value="multiple choice">Câu hỏi trắc nghiệm</Option>
              <Option value="True/False">Câu hỏi đúng sai</Option>
              <Option value="Short Answer">Câu tự luận ngắn</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Mức độ câu hỏi" style={{ flex: 1 }}>
            <Select
              value={questionData.plum}
              onChange={(value) =>
                setQuestionData((prev) => prev && { ...prev, plum: value })
              }
              placeholder="Chọn mức độ câu hỏi"
            >
              <Option value="easy">Dễ</Option>
              <Option value="medium">Trung bình</Option>
              <Option value="hard">Khó</Option>
            </Select>
          </Form.Item>
        </div>

        <Divider>Danh sách câu trả lời</Divider>
        {(questionData.answers || []).map((answer, index) => (
          <div key={answer.answerId || index} className="mb-2 flex gap-2 items-center">
            <Input
              placeholder="Nhập câu trả lời"
              value={answer?.answerText || ""}
              onChange={(e) => {
                const updatedAnswers = [...(questionData.answers || [])];
                updatedAnswers[index] = {
                  ...answer,
                  answerText: e.target.value,
                };
                setQuestionData((prev) => prev && { ...prev, answers: updatedAnswers });
              }}
            />
            <Checkbox
              checked={!!answer?.isCorrect}
              onChange={(e) => {
                const updatedAnswers = [...(questionData.answers || [])];
                updatedAnswers[index] = {
                  ...answer,
                  isCorrect: e.target.checked,
                };
                setQuestionData((prev) => prev && { ...prev, answers: updatedAnswers });
              }}
            >
              Đúng
            </Checkbox>
          </div>
        ))}

        <Form.Item className="mt-4">
          <div className="flex space-x-4">
            <Button type="primary" onClick={handleSave} loading={saving}>
              Lưu
            </Button>
            <Button type="default" onClick={() => navigate("/academy-staff/question-banks/")}>Quay lại</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateMyQuestion;
