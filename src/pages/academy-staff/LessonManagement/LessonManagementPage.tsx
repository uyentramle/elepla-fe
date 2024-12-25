import React, { useState } from "react";
import { Input, Table, Typography, Button, Modal, message, Menu, Dropdown, Space, Select, Spin } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EllipsisOutlined } from "@ant-design/icons";
import { IViewListLesson, fetchLessonList, deleteLesson } from '@/data/academy-staff/LessonData';
import { getAllCurriculumFramework, IViewListCurriculum } from "@/data/admin/CurriculumFramworkData";
import { getAllSubject, IViewListSubject } from "@/data/admin/SubjectData";
import { getAllGrade, IViewListGrade } from "@/data/admin/GradeData";
import CreateLessonForm from "./CreateLessonForm";
import UpdateLessonForm from "./UpdateLessonForm";

const { Title } = Typography;
const { Option } = Select;

const LessonManagementPage: React.FC = () => {
  const [lessons, setLessons] = React.useState<IViewListLesson[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [lessonToDelete, setLessonToDelete] = React.useState<IViewListLesson | null>(null);
  const [subjectOptions, setSubjectOptions] = useState<IViewListSubject[]>([]); // Danh sách môn học
  const [filterSubject, setFilterSubject] = useState('');
  const [gradeOptions, setGradeOptions] = useState<IViewListGrade[]>([]); // Danh sách khối lớp
  const [filterGrade, setFilterGrade] = useState('');
  const [curriculumOptions, setCurriculumOptions] = useState<IViewListCurriculum[]>([]); // Danh sách khung chương trình
  const [filterCurriculum, setFilterCurriculum] = useState('');
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredLessons = lessons.filter((lesson) => {
    const lessoName = lesson.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !filterSubject || lesson.subject === filterSubject;
    const matchesGrade = !filterGrade || lesson.grade === filterGrade;
    const matchesCurriculum = !filterCurriculum || lesson.curriculum === filterCurriculum;
    return lessoName && matchesSubject && matchesGrade && matchesCurriculum;
  });

  React.useEffect(() => {
    // const fetchLessons = async () => {
    //   const lessonList = await fetchLessonList();
    //   setLessons(lessonList);
    // };

    // fetchLessons();

    setLoading(true);
    fetchLessonList()
      .then((lessonList) => setLessons(lessonList))
      .catch(() => message.error('Không thể tải dữ liệu bài học, vui lòng thử lại sau'))
      .finally(() => setLoading(false));
  }, [isAddVisible, deleteModalVisible, isEditVisible]);

  React.useEffect(() => {
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

  const handleDeleteModal = (lesson: IViewListLesson) => {
    setLessonToDelete(lesson);
    setDeleteModalVisible(true);
  };

  const showAddLessonModal = () => {
    setIsAddVisible(true);
  };

  const handleAddLesson = () => {
    setIsAddVisible(false);
  };

  const handleDeleteLesson = async () => {
    try {
      if (!lessonToDelete) return;
      setDeleteModalVisible(false);

      const isDeleted = await deleteLesson(lessonToDelete.lessonId);
      if (isDeleted) {
        message.success('Đã xóa bài học thành công');
        // const updatedLessons = lessons.filter((lesson) => lesson.lessonId !== lessonToDelete.lessonId);
        // setLessons(updatedLessons);
      } else {
        message.error('Không xóa được bài học');
      }
    } catch (error) {
      console.error('Lỗi khi xóa bài học:', error);
      message.error('Không xóa được bài học');
    }
  };

  const handleCancelDeleteModal = () => {
    setDeleteModalVisible(false);
    setLessonToDelete(null);
  };

  const handleMenuClick = async (key: React.Key, record: IViewListLesson) => {
    if (key === 'edit') {
      setSelectedLesson(record.lessonId);
      setIsEditVisible(true);
    } else if (key === 'delete') {
      handleDeleteModal(record);
    }
  };

  const columns = [
    // {
    //     title: 'No.',
    //     dataIndex: '1',
    //     key: 'id',
    //     render: (_text: any, _record: any, index: number) => index + 1,
    // },
    // {
    //     title: 'Tên bài học',
    //     dataIndex: 'name',
    //     key: 'name',
    // },
    // {
    //     title: 'Cập nhật',
    //     dataIndex: 'actions',
    //     key: 'actions',
    //     render: (_text: any, _record: IViewListLesson) => (
    //         <Link to={`/admin/lessons/edit/${_record.lessonId}`}>
    //             <Button type="link"><EditOutlined /> Chỉnh sửa</Button>
    //         </Link>
    //     ),
    // },
    // {
    //     title: 'Xóa',
    //     key: 'delete',
    //     render: (_text: any, record: IViewListLesson) => (
    //         <Button
    //             type="primary"
    //             danger
    //             icon={<DeleteOutlined />}
    //             className="bg-red-500"
    //             onClick={() => handleDeleteModal(record)}
    //         >
    //             Xóa
    //         </Button>
    //     ),
    // },
    {
      title: 'Tên bài',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => name,
    },
    {
      title: 'Tên chương',
      dataIndex: 'chapterName',
      key: 'chapterName',
      render: (chapterName: string) => chapterName,
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
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: IViewListLesson) => (
        <Space size="middle">
          <Dropdown
            overlay={
              <Menu onClick={({ key }) => handleMenuClick(key, record)}>
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
    <div className="container mx-auto px-4 py-4">
      <Title level={2} className="my-4">Quản lý bài học</Title>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex">
          <div className="relative mr-2">
            <Input
              placeholder="Tìm kiếm bài học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              suffix={<SearchOutlined />}
            // className="w-1/3"
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
          {/* <Link to="/admin/lessons/add-new">
                    <Button type="primary" icon={<PlusOutlined />}>
                        Thêm mới
                    </Button>
                </Link> */}
        </div>
        <div>
          <Button
            className="inline-flex items-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={showAddLessonModal}
          >
            <PlusOutlined className="mr-2" />
            Thêm mới
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Spin spinning={loading} tip="Đang tải dữ liệu...">
          <Table
            columns={columns}
            dataSource={filteredLessons}
            rowKey="id"
            // bordered
            pagination={{
              // pageSize: 10, // Số dòng hiển thị mỗi trang
              // showSizeChanger: true, // Cho phép thay đổi số dòng mỗi trang
              showQuickJumper: true, // Thêm ô nhảy đến trang cụ thể
            }}
            // scroll={{ x: 'max-content' }} // Kích hoạt thanh cuộn ngang khi dữ liệu quá dài
          />
        </Spin>
      </div>

      <Modal
        title="Xác nhận xóa bài học"
        open={deleteModalVisible}
        onOk={handleDeleteLesson}
        onCancel={handleCancelDeleteModal}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa bài học này?</p>
      </Modal>

      <CreateLessonForm
        isVisible={isAddVisible}
        onClose={() => setIsAddVisible(false)}
        onCreate={handleAddLesson}
      />

      <UpdateLessonForm
        isVisible={isEditVisible}
        onClose={() => setIsEditVisible(false)}
        lessonId={selectedLesson!}
      />
    </div>
  );
};

export default LessonManagementPage;
