import React, { useState } from "react";
import { Button, Input, Checkbox, Form, Divider, Select, message } from "antd";
import { createQuestionByStaff } from "@/data/academy-staff/QuestionBankData";
import { useNavigate } from "react-router-dom";
import FilterSection from "@/layouts/teacher/Components/FilterSection/FilterSection";

const { Option } = Select;

const QuestionBankFormPage: React.FC = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<{
    gradeId?: string;
    curriculumId?: string;
    subjectId?: string;
    chapterId?: string;
    lessonId?: string;
  }>({});
  const [question, setQuestion] = useState<string>("");
  const [type, setType] = useState<"multiple choice" | "True/False" | "Short Answer" | undefined>();
  const [plum, setPlum] = useState<"easy" | "medium" | "hard" | undefined>();
  const [answers, setAnswers] = useState<{ answerId: string; answerText: string; isCorrect: boolean }[]>([
    { answerId: "1", answerText: "", isCorrect: false },
  ]);

  const validateAnswers = (): boolean => {
    if (type === "Short Answer" && answers.length > 1) {
      message.error("Câu tự luận ngắn chỉ được có 1 câu trả lời.");
      return false;
    }
    if (type === "True/False" && answers.length !== 2) {
      message.error("Câu hỏi đúng/sai phải có đúng 2 câu trả lời.");
      return false;
    }
    if (!answers.some((answer) => answer.isCorrect)) {
      message.error("Ít nhất phải có một câu trả lời được chọn đúng.");
      return false;
    }
    if (answers.some((answer) => !answer.answerText.trim())) {
      message.error("Không được để trống nội dung câu trả lời.");
      return false;
    }
    return true;
  };

  const addAnswer = () => {
    if (type === "Short Answer") {
      message.error("Câu tự luận ngắn không thể thêm nhiều câu trả lời.");
      return;
    }
    if (type === "True/False" && answers.length >= 2) {
      message.error("Câu hỏi đúng/sai chỉ có thể có 2 câu trả lời.");
      return;
    }
    setAnswers([...answers, { answerId: `${answers.length + 1}`, answerText: "", isCorrect: false }]);
  };

  const updateAnswer = (index: number, field: keyof typeof answers[0], value: any) => {
    const updatedAnswers = answers.map((answer, i) => {
      if (i === index) {
        if (field === "isCorrect" && type === "True/False" && value) {
          // Đảm bảo chỉ một câu trả lời đúng được chọn cho loại "True/False"
          return { ...answer, [field]: value };
        }
        return { ...answer, [field]: value };
      }
      // Nếu loại câu hỏi là "True/False" và giá trị đang chỉnh là isCorrect
      // thì các câu trả lời khác phải đặt isCorrect = false
      if (field === "isCorrect" && type === "True/False" && value) {
        return { ...answer, isCorrect: false };
      }
      return answer;
    });
    setAnswers(updatedAnswers);
  };
  

  const removeAnswer = (index: number) => {
    if (type === "Short Answer" || (type === "True/False" && answers.length <= 2)) {
      message.error("Không thể xóa thêm câu trả lời cho loại câu hỏi này.");
      return;
    }
    setAnswers(answers.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!filters.chapterId) {
      message.error("Vui lòng chọn chương trước khi lưu câu hỏi.");
      return;
    }
    if (!type) {
      message.error("Vui lòng chọn loại câu hỏi.");
      return;
    }
    if (!plum) {
      message.error("Vui lòng chọn mức độ câu hỏi.");
      return;
    }
    if (!question.trim()) {
      message.error("Vui lòng nhập nội dung câu hỏi.");
      return;
    }
    if (!validateAnswers()) return;

    const formData = {
      question,
      type,
      plum,
      chapterId: filters.chapterId,
      lessonId: filters.lessonId || null,
      answers: answers.map(({ answerText, isCorrect }) => ({
        answerText,
        isCorrect,
      })),
    };

    try {
      const result = await createQuestionByStaff(formData);
      if (result.success) {
        message.success(result.message || "Câu hỏi đã được thêm thành công!");
        setQuestion("");
        setType(undefined);
        setPlum(undefined);
        setAnswers([{ answerId: "1", answerText: "", isCorrect: false }]);
        navigate("/academy-staff/question-banks");
      } else {
        message.error(result.message || "Lỗi khi thêm câu hỏi.");
      }
    } catch (error: any) {
      message.error(error.message || "Có lỗi xảy ra khi thêm câu hỏi.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4 text-center">Thêm mới câu hỏi</h1>
      <Form layout="vertical" onFinish={handleSubmit}>
        <FilterSection
          onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
        />

        <Form.Item
          label="Câu hỏi"
          className="mt-6"
          rules={[{ required: true, message: "Vui lòng nhập nội dung câu hỏi" }]}
        >
          <Input.TextArea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Nhập câu hỏi"
          />
        </Form.Item>

        <div className="flex gap-4">
          <Form.Item
            label="Loại câu hỏi"
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Vui lòng chọn loại câu hỏi" }]}
          >
            <Select
              value={type}
              onChange={(value) => {
                setType(value);
                if (value === "Short Answer") {
                  setAnswers([{ answerId: "1", answerText: "", isCorrect: false }]);
                } else if (value === "True/False") {
                  setAnswers([
                    { answerId: "1", answerText: "", isCorrect: false },
                    { answerId: "2", answerText: "", isCorrect: false },
                  ]);
                }
              }}
              placeholder="Chọn loại câu hỏi"
            >
              <Option value="multiple choice">Câu hỏi trắc nghiệm</Option>
              <Option value="True/False">Câu hỏi đúng sai</Option>
              <Option value="Short Answer">Câu tự luận ngắn</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Mức độ câu hỏi"
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Vui lòng chọn mức độ câu hỏi" }]}
          >
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
            {!(type === "Short Answer" || (type === "True/False" && answers.length <= 2)) && (
              <Button onClick={() => removeAnswer(index)} danger>
                Xóa
              </Button>
            )}
          </div>
        ))}
        <Button
          type="dashed"
          onClick={addAnswer}
          style={{ width: "100%", marginTop: "10px" }}
          disabled={type === "Short Answer" || (type === "True/False" && answers.length >= 2)}
        >
          Thêm câu trả lời
        </Button>

        <Form.Item className="mt-4">
          <div className="flex space-x-4">
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
            <Button type="default" onClick={() => navigate("/academy-staff/question-banks")}>
              Quay lại
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default QuestionBankFormPage;
