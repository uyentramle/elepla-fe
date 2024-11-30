import React, { useEffect, useState } from "react";
import { Spin, Typography, List } from "antd";
import { getExamDetailsById, IExamDetails } from "@/data/client/ExamData"; // Đảm bảo đường dẫn đúng

const { Title, Paragraph } = Typography;

interface ExamDetailProps {
  examId: string;
  onClose: () => void;
}

const ExamDetail: React.FC<ExamDetailProps> = ({ examId, onClose }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [examDetails, setExamDetails] = useState<IExamDetails | null>(null);

  useEffect(() => {
    const fetchExamDetails = async () => {
      setLoading(true);
      try {
        const details = await getExamDetailsById(examId); // Gọi API để lấy chi tiết bài kiểm tra
        setExamDetails(details);
      } catch (error) {
        console.error("Error fetching exam details:", error);
      }
      setLoading(false);
    };

    fetchExamDetails();
  }, [examId]); // Chạy lại khi examId thay đổi

  const getAnswerLabel = (index: number) => String.fromCharCode(65 + index); // 0 -> A, 1 -> B, ...

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        {loading ? (
          <Spin size="large" />
        ) : examDetails ? (
          <div>
            <Title level={3}>{examDetails.title}</Title>
            <Paragraph>
              <strong>Thời gian làm bài:</strong> {examDetails.time || "Không xác định"}
            </Paragraph>
            <Title level={4}>Danh sách câu hỏi:</Title>
            <List
              itemLayout="vertical"
              dataSource={examDetails.questions}
              renderItem={(question) => (
                <div className="mb-4">
                  <Title level={5}>{`Câu ${question.index}: ${question.question}`}</Title>
                  <List
                    dataSource={question.answers}
                    renderItem={(answer, answerIndex) => (
                      <Paragraph
                        style={{
                          color: answer.isCorrect ? "green" : undefined,
                        }}
                      >
                        <strong>{`${getAnswerLabel(answerIndex)}.`}</strong> {answer.answerText}
                      </Paragraph>
                    )}
                  />
                </div>
              )}
            />
          </div>
        ) : (
          <p>Không thể tải chi tiết bài kiểm tra.</p>
        )}
      </div>
    </div>
  );
};

export default ExamDetail;