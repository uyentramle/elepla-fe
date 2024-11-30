import React, { useEffect, useState } from "react";
import { getExamsByUserId, IExam } from "@/data/client/ExamData";
import { Spin, Radio, List } from "antd";
import { FileProtectOutlined, AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { RadioChangeEvent } from "antd/es/radio";
import ExamDetail from "./ExamDetailPage"; // Đảm bảo đường dẫn đúng

const ListExamPage: React.FC = () => {
  const [exams, setExams] = useState<IExam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      const data = await getExamsByUserId(); // API lấy danh sách bài kiểm tra
      if (data) {
        setExams(data);
      }
      setLoading(false);
    };

    fetchExams();
  }, []);

  const handleViewModeChange = (e: RadioChangeEvent) => {
    setViewMode(e.target.value);
  };

  const handleItemClick = (exam: IExam) => {
    setSelectedExamId(exam.id); // Lưu examId khi chọn bài kiểm tra
  };

  const handleCloseExamDetail = () => {
    setSelectedExamId(null); // Đóng popup chi tiết bài kiểm tra
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách bài kiểm tra</h1>
        <Radio.Group
          value={viewMode}
          onChange={handleViewModeChange}
          className="flex items-center gap-2"
        >
          <Radio.Button value="grid">
            <AppstoreOutlined /> Dạng lưới
          </Radio.Button>
          <Radio.Button value="list">
            <UnorderedListOutlined /> Dạng danh sách
          </Radio.Button>
        </Radio.Group>
      </div>

      {/* Content */}
      {loading ? (
        <Spin size="large" />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="flex flex-col items-center p-4 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => handleItemClick(exam)}
            >
              <div className="bg-gray-100 w-24 h-24 flex items-center justify-center mb-4">
                <FileProtectOutlined style={{ fontSize: "64px", color: "#1890ff" }} />
              </div>
              <h3 className="text-lg font-semibold text-center">{exam.title}</h3>
              <p className="text-sm text-gray-600 text-center">{`Thời gian: ${exam.time || "Không xác định"}`}</p>
            </div>
          ))}
        </div>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={exams}
          renderItem={(exam) => (
            <List.Item
              key={exam.id}
              style={{
                borderBottom: "1px solid #f0f0f0",
                padding: "12px 0",
              }}
              onClick={() => handleItemClick(exam)}
            >
              <List.Item.Meta
                avatar={
                  <div className="bg-gray-100 w-16 h-16 flex items-center justify-center">
                    <FileProtectOutlined style={{ fontSize: "40px", color: "#1890ff" }} />
                  </div>
                }
                title={<span className="font-semibold">{exam.title}</span>}
                description={<span className="text-gray-600">{`Thời gian: ${exam.time || "Không xác định"}`}</span>}
              />
            </List.Item>
          )}
        />
      )}

      {/* Exam Detail Popup */}
      {selectedExamId && (
        <ExamDetail examId={selectedExamId} onClose={handleCloseExamDetail} />
      )}
    </div>
  );
};

export default ListExamPage;
