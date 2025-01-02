import React, { useEffect, useState } from "react";
import { Button, Input, Checkbox, Form, Divider, Select, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { fetchQuestionById, updateQuestion } from "@/data/academy-staff/QuestionBankData";
import { IAnswer, IQuestion } from "@/data/academy-staff/QuestionBankData";

const { Option } = Select;

const UpdateMyQuestion: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Assume `id` is passed via route params
  const [loading, setLoading] = useState<boolean>(false);

  const [fetchedQuestion, setFetchedQuestion] = useState<IQuestion | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [type, setType] = useState<"multiple choice" | "True/False" | "Short Answer" | undefined>();
  const [plum, setPlum] = useState<"easy" | "medium" | "hard" | undefined>();
  const [answers, setAnswers] = useState<IAnswer[]>([]);

  // Fetch question data by ID
  useEffect(() => {
    if (!id) return;
    const loadQuestion = async () => {
      try {
        setLoading(true);
        const fetchedData = await fetchQuestionById(id);
        setFetchedQuestion(fetchedData);
        setQuestion(fetchedData.question);
        setType(fetchedData.type);
        setPlum(fetchedData.plum);
        setAnswers(fetchedData.answers || []);
      } catch (error) {
        message.error("Lỗi khi tải câu hỏi. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };
    loadQuestion();
  }, [id]);

  const addAnswer = () => {
    setAnswers([
      ...answers,
      { answerId: `${answers.length + 1}`, answerText: "", isCorrect: false },
    ]);
  };

  const updateAnswer = (index: number, field: keyof IAnswer, value: any) => {
    const updatedAnswers = answers.map((answer, i) =>
      i === index ? { ...answer, [field]: value } : answer
    );
    setAnswers(updatedAnswers);
  };

  const removeAnswer = (index: number) => {
    setAnswers(answers.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!id || !fetchedQuestion) return;
    try {
      setLoading(true);
  
      const updatedQuestion: IQuestion = {
        ...fetchedQuestion, // Giữ nguyên các trường từ dữ liệu API
        questionId: id,
        question,
        type: type || fetchedQuestion.type,
        plum: plum || fetchedQuestion.plum,
        answers,
        updatedAt: new Date().toISOString(), // Cập nhật thời gian
        updatedBy: "current-user-id", // Thay bằng ID người dùng hiện tại
      };
  
      await updateQuestion(updatedQuestion);
      message.success("Cập nhật câu hỏi thành công!");
    // } catch (error) {
    //   // Hiện thông báo lỗi nhưng vẫn chuyển trang
    //   message.error("Lỗi khi cập nhật câu hỏi. Vẫn tiếp tục chuyển trang!");
    } finally {
      setLoading(false);
          message.success("Cập nhật câu hỏi thành công!");
      navigate("/teacher/question-bank/my-question"); // Chuyển trang bất kể thành công hay thất bại
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4 text-center">Cập nhật câu hỏi</h1>
      <Form layout="vertical">
        <Form.Item label="Câu hỏi" className="mt-6">
          <Input.TextArea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Nhập câu hỏi"
          />
        </Form.Item>

        <div className="flex gap-4">
          <Form.Item label="Loại câu hỏi" style={{ flex: 1 }}>
            <Select
              value={type}
              onChange={(value) => setType(value)}
              placeholder="Chọn loại câu hỏi"
            >
              <Option value="multiple choice">Câu hỏi trắc nghiệm</Option>
              <Option value="True/False">Câu hỏi đúng sai</Option>
              <Option value="Short Answer">Câu tự luận ngắn</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Mức độ câu hỏi" style={{ flex: 1 }}>
            <Select
              value={plum}
              onChange={(value) => setPlum(value)}
              placeholder="Chọn mức độ câu hỏi"
            >
              <Option value="easy">Dễ</Option>
              <Option value="medium">Trung bình</Option>
              <Option value="hard">Khó</Option>
            </Select>
          </Form.Item>
        </div>

        <Divider>Danh sách câu trả lời</Divider>
        {answers.map((answer, index) => (
          <div key={answer.answerId} className="mb-2 flex gap-2 items-center">
            <Input
              placeholder="Nhập câu trả lời"
              value={answer.answerText}
              onChange={(e) => updateAnswer(index, "answerText", e.target.value)}
            />
            <Checkbox
              checked={answer.isCorrect}
              onChange={(e) => updateAnswer(index, "isCorrect", e.target.checked)}
            >
              Đúng
            </Checkbox>
            <Button onClick={() => removeAnswer(index)} danger>
              Xóa
            </Button>
          </div>
        ))}
        <Button type="dashed" onClick={addAnswer} style={{ width: "100%", marginTop: "10px" }}>
          Thêm câu trả lời
        </Button>

        <Form.Item className="mt-4">
          <div className="flex space-x-4">
            <Button type="primary" onClick={handleSave} loading={loading}>
              Lưu
            </Button>
            <Button type="default" onClick={() => navigate("/teacher/question-bank/my-question")}>
              Quay lại
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateMyQuestion;
