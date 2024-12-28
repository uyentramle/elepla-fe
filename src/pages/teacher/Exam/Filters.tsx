import React, { useEffect, useState } from "react";
import { Select, Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getAllCurriculumFramework, IViewListCurriculum } from "@/data/admin/CurriculumFramworkData";
import { getAllGrade, IViewListGrade } from "@/data/admin/GradeData";

const { Option } = Select;

interface FiltersProps {
  onFiltersChange: (filters: {
    searchTerm: string;
    grade: string;
    curriculum: string;
  }) => void;
}

const Filters: React.FC<FiltersProps> = ({ onFiltersChange }) => {
  const [filterGrade, setFilterGrade] = useState<string>("");
  const [filterCurriculum, setFilterCurriculum] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [gradeOptions, setGradeOptions] = useState<IViewListGrade[]>([]);
  const [curriculumOptions, setCurriculumOptions] = useState<IViewListCurriculum[]>([]);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await getAllGrade();
        setGradeOptions(response);
      } catch (error) {
        message.error("Không thể tải dữ liệu khối lớp, vui lòng thử lại sau");
      }
    };

    const fetchCurriculums = async () => {
      try {
        const response = await getAllCurriculumFramework();
        setCurriculumOptions(response);
      } catch (error) {
        message.error("Không thể tải dữ liệu khung chương trình, vui lòng thử lại sau");
      }
    };

    fetchGrades();
    fetchCurriculums();
  }, []);

  useEffect(() => {
    onFiltersChange({
      searchTerm,
      grade: filterGrade,
      curriculum: filterCurriculum,
    });
  }, [searchTerm, filterGrade, filterCurriculum, onFiltersChange]);

  return (
    <div className="mb-4 flex gap-4">
      <Input
        placeholder="Tìm kiếm câu hỏi..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        prefix={<SearchOutlined />}
      />

      <Select
        id="grade-filter"
        className="w-48"
        value={filterGrade}
        onChange={(value) => setFilterGrade(value)}
        placeholder="Chọn khối lớp"
      >
        <Option value="">Tất cả lớp</Option>
        {gradeOptions.map((option) => (
          <Option key={option.name} value={option.name}>
            {option.name}
          </Option>
        ))}
      </Select>

      <Select
        id="curriculum-filter"
        className="w-48"
        value={filterCurriculum}
        onChange={(value) => setFilterCurriculum(value)}
        placeholder="Chọn khung chương trình"
      >
        <Option value="">Tất cả khung chương trình</Option>
        {curriculumOptions.map((option) => (
          <Option key={option.name} value={option.name}>
            {option.name}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default Filters;
