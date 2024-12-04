import React, { useState, useEffect } from "react";
import { SearchOutlined, PlusOutlined, EditOutlined, EllipsisOutlined, DeleteOutlined, BlockOutlined } from '@ant-design/icons';
import { Input, Select, Button, Table, Space, Dropdown, Menu, Pagination, message, Modal } from 'antd';
import { getAllPlanbookTemplates, PlanbookTemplate, deletePlanbookTemplate } from "@/data/academy-staff/PlanbookData";
import { getAllCurriculumFramework, IViewListCurriculum } from "@/data/admin/CurriculumFramworkData";
import { getAllSubject, IViewListSubject } from "@/data/admin/SubjectData";
import { getAllGrade, IViewListGrade } from "@/data/admin/GradeData";
import PlanbookTemplateDetailForm from "./PlanbookTemplateDetailForm";
import UpdatePlanbookTemplateForm from "./UpdatePlanbookTemplateForm";
import CreatePlanbookTemplateForm from "./CreatePlanbookTemplateForm";

const { Option } = Select;

const PlanbookManagementPage: React.FC = () => {
  const [planbooks, setPlanbooks] = useState<PlanbookTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectOptions, setSubjectOptions] = useState<IViewListSubject[]>([]); // Danh sách môn học
  const [filterSubject, setFilterSubject] = useState('');
  const [gradeOptions, setGradeOptions] = useState<IViewListGrade[]>([]); // Danh sách khối lớp
  const [filterGrade, setFilterGrade] = useState('');
  const [curriculumOptions, setCurriculumOptions] = useState<IViewListCurriculum[]>([]); // Danh sách khung chương trình
  const [filterCurriculum, setFilterCurriculum] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [selectedPlanbook, setSelectedPlanbook] = useState<string | null>(null); // State để lưu trữ thông tin planbook được chọn
  const [addVisible, setAddVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false); // State để điều khiển hiển thị của modal
  const [updateVisible, setUpdateVisible] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPlanbookTemplates(pageIndex, pageSize);
        setPlanbooks(response.data.items);
        setTotalItemsCount(response.data.totalItemsCount);
        setIsDelete(false);
      } catch (error) {
        message.error('Không thể tải dữ liệu, vui lòng thử lại sau');
      }
    };
    fetchData();
  }, [pageIndex, pageSize, detailVisible, updateVisible, addVisible, isDelete]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await getAllSubject();
        setSubjectOptions(response);
      } catch (error) {
        message.error("Không thể tải dữ liệu môn học, vui lòng thử lại sau");
      }
    };

    const fetchGrades = async () => {
      try {
        const response = await getAllGrade();
        setGradeOptions(response);
      } catch (error) {
        message.error("Không thể tải dữ liệu khối lớp, vui lòng thử lại sau");
      }
    }

    const fetchCurriculums = async () => {
      try {
        const response = await getAllCurriculumFramework();
        setCurriculumOptions(response);
      } catch (error) {
        message.error("Không thể tải dữ liệu khung chương trình, vui lòng thử lại sau");
      }
    };

    fetchSubjects();
    fetchGrades();
    fetchCurriculums();
  }, []);

  const handlePageChange = (page: number, pageSize?: number) => {
    setPageIndex(page - 1); // Adjust for 0-based index
    if (pageSize) {
      setPageSize(pageSize);
    }
  };

  // Lọc dữ liệu kế hoạch bài dạy
  const filteredPlanbooks = planbooks.filter((a) => {
    const matchesSearch = `${a.title}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !filterSubject || a.subject === filterSubject;
    const matchesGrade = !filterGrade || a.grade === filterGrade;
    const matchesCurriculum = !filterCurriculum || a.curriculum === filterCurriculum;
    return matchesSearch && matchesSubject && matchesGrade && matchesCurriculum;
  });

  const handleMenuClick = async (key: React.Key, record: PlanbookTemplate) => {
    if (key === 'detail') {
      setSelectedPlanbook(record.planbookId); // Lưu ID Planbook được chọn
      setDetailVisible(true); // Mở Modal
    } else if (key === 'edit') {
      setSelectedPlanbook(record.planbookId); // Lưu ID Planbook được chọn
      setUpdateVisible(true); // Mở Modal
    } else if (key === 'delete') {
      try {
        const response = await deletePlanbookTemplate(record.planbookId);
        if (response) {
          message.success('Xóa kế hoạch bài dạy thành công');
          setIsDelete(true);
        } else {
          message.error('Xóa kế hoạch bài dạy thất bại');
        }
      } catch (error) {
        message.error('Có lỗi xảy ra, vui lòng thử lại sau');
      }
    }
  };

  const showAddPlanbookModal = () => {
    setAddVisible(true);
  };

  const handleAddPlanbook = () => {
    setAddVisible(false);
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => title,
    },
    {
      title: 'Môn học',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject: string) => subject
    },
    {
      title: 'Khối lớp',
      dataIndex: 'grade',
      key: 'grade',
      render: (grade: string) => grade
    },
    {
      title: 'Khung chương trình',
      dataIndex: 'curriculum',
      key: 'curriculum',
      render: (curriculum: string) => curriculum
    },
    {
      title: 'Ngày khởi tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: PlanbookTemplate) => (
        <Space size="middle">
          <Dropdown
            overlay={
              <Menu onClick={({ key }) => handleMenuClick(key, record)}>
                <Menu.Item key="detail" icon={<BlockOutlined />}>Chi tiết</Menu.Item>
                <Menu.Item key="edit" icon={<EditOutlined />}>Chỉnh sửa</Menu.Item>
                <Menu.Item key="delete" icon={<DeleteOutlined />} danger>Xóa</Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button shape="default" icon={<EllipsisOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-semibold">Quản lý Kế hoạch bài dạy mẫu</h1>
      <div className="mb-4 flex justify-between">
        <div className="flex">
          <div className="relative mr-2">
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              suffix={<SearchOutlined />}
            />
          </div>
          <div>
            {/* <span className="mr-2">Khung chương trình:</span> */}
            <Select
              id="subject-filter"
              className="w-48 mr-2"
              value={filterSubject}
              onChange={(value) => setFilterSubject(value)}
              placeholder="Chọn môn học"
            >
              <Option value="">Tất cả môn học</Option>
              {subjectOptions.map((option) => (
                <Option key={option.name} value={option.name}>
                  {option.name}
                </Option>
              ))}
            </Select>
            <Select
              id="grade-filter"
              className="w-48 mr-2"
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
              <Option value="">Tất cả chương trình</Option>
              {curriculumOptions.map((option) => (
                <Option key={option.name} value={option.name}>
                  {option.name}
                </Option>
              ))}
            </Select>
          </div>

        </div>
        <div>
          <Button
            className="inline-flex items-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={showAddPlanbookModal}
          >
            <PlusOutlined className="mr-2" />
            Thêm mới
          </Button>
        </div>
      </div>
      <Table columns={columns} dataSource={filteredPlanbooks} rowKey="id" pagination={false} />
      <Pagination
        className="mt-10 flex justify-center"
        current={pageIndex + 1}
        pageSize={pageSize}
        total={totalItemsCount}
        onChange={handlePageChange}
        // prevIcon={<Button type="text">Trước</Button>}
        // nextIcon={<Button type="text">Sau</Button>}
        showSizeChanger
      />

      {/* Modal chi tiết Planbook */}
      <Modal
        // title="Chi tiết Planbook"
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={800} // Điều chỉnh chiều rộng modal
        style={{ top: '5vh' }}
      >
        {selectedPlanbook && <PlanbookTemplateDetailForm planbookId={selectedPlanbook} />}
      </Modal>

      {/* Modal cập nhật Planbook */}
      <Modal
        visible={updateVisible}
        onCancel={() => setUpdateVisible(false)}
        footer={null}
        width={800} // Điều chỉnh chiều rộng modal
        style={{ top: '5vh' }}
      >
        {selectedPlanbook && <UpdatePlanbookTemplateForm planbookId={selectedPlanbook} />}
      </Modal>

      {/* Modal thêm mới Planbook */}
      <CreatePlanbookTemplateForm isVisible={addVisible} onClose={() => setAddVisible(false)} onCreate={handleAddPlanbook} />
    </div>
  );
}

export default PlanbookManagementPage;