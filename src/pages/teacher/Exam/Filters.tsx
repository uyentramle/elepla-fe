import React, { useEffect, useState } from "react";
import { Select, Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getAllCurriculumFramework, IViewListCurriculum } from "@/data/admin/CurriculumFramworkData";
import { getAllGrade, IViewListGrade } from "@/data/admin/GradeData";
import fetchSubjectsByGradeAndCurriculum, { SubjectInCurriculumItem } from "@/api/ApiSubjectItem"; // Import API lấy môn học

const { Option } = Select;

interface FiltersProps {
  onFiltersChange: (filters: {
    searchTerm: string;
    grade: string;
    curriculum: string;
    subject: string;
  }) => void;
}

const Filters: React.FC<FiltersProps> = ({ onFiltersChange }) => {
  const [filterGrade, setFilterGrade] = useState<string>("");
  const [filterCurriculum, setFilterCurriculum] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterSubject, setFilterSubject] = useState<string>(""); // State cho bộ lọc môn học
  const [gradeOptions, setGradeOptions] = useState<IViewListGrade[]>([]);
  const [curriculumOptions, setCurriculumOptions] = useState<IViewListCurriculum[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<SubjectInCurriculumItem[]>([]); // State cho môn học

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
    // Khi cả lớp và khung chương trình thay đổi, gọi API để lấy danh sách môn học
    const fetchSubjects = async () => {
      if (filterGrade && filterCurriculum) {
        try {
          const subjects = await fetchSubjectsByGradeAndCurriculum(filterGrade, filterCurriculum);
          setSubjectOptions(subjects);
        } catch (error) {
          message.error("Không thể tải dữ liệu môn học, vui lòng thử lại sau");
        }
      }
    };

    fetchSubjects();
  }, [filterGrade, filterCurriculum]); // Gọi API khi thay đổi khối lớp hoặc khung chương trình

  useEffect(() => {
    onFiltersChange({
      searchTerm,
      grade: filterGrade,
      curriculum: filterCurriculum,
      subject: filterSubject,
    });
  }, [searchTerm, filterGrade, filterCurriculum, filterSubject, onFiltersChange]);

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

      {/* Thêm Select cho môn học */}
      <Select
        id="subject-filter"
        className="w-48"
        value={filterSubject}
        onChange={(value) => setFilterSubject(value)}
        placeholder="Chọn môn học"
        disabled={!filterGrade || !filterCurriculum} // Chỉ bật khi đã chọn lớp và khung chương trình
      >
        <Option value="">Tất cả môn học</Option>
        {subjectOptions.map((subject) => (
          <Option key={subject.subject} value={subject.subject}>
            {subject.subject}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default Filters;
