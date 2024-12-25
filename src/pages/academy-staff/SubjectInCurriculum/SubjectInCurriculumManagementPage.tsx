import React, { useState } from "react";
import { Input, Table, Typography, Button, Modal, message, Space, Dropdown, Menu, Select, Spin } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, /*IssuesCloseOutlined,*/ EllipsisOutlined } from "@ant-design/icons";
import {
    IViewListSubjectInCurriculum,
    fetchSubjectInCurriculumList,
    deleteSubjectInCurriculum,
} from "@/data/academy-staff/SubjectInCurriculumData";
import { getAllCurriculumFramework, IViewListCurriculum } from "@/data/admin/CurriculumFramworkData";
import { getAllSubject, IViewListSubject } from "@/data/admin/SubjectData";
import { getAllGrade, IViewListGrade } from "@/data/admin/GradeData";
import SubjectInCurriculumFormPage from "./SubjectInCurriculumFormPage";
import UpdateSubjectInCurriculumForm from "./UpdateSubjectInCurriculumForm";

const { Title } = Typography;
const { Option } = Select;

const SubjectInCurriculumManagementPage: React.FC = () => {
    const [subjectInCurriculums, setSubjectInCurriculums] = useState<IViewListSubjectInCurriculum[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [subjectInCurriculumToDelete, setSubjectInCurriculumToDelete] = useState<IViewListSubjectInCurriculum | null>(null);
    
    const [subjectOptions, setSubjectOptions] = useState<IViewListSubject[]>([]); // Danh sách môn học
    const [filterSubject, setFilterSubject] = useState('');
    const [gradeOptions, setGradeOptions] = useState<IViewListGrade[]>([]); // Danh sách khối lớp
    const [filterGrade, setFilterGrade] = useState('');
    const [curriculumOptions, setCurriculumOptions] = useState<IViewListCurriculum[]>([]); // Danh sách khung chương trình
    const [filterCurriculum, setFilterCurriculum] = useState('');
    const [isAddVisible, setIsAddVisible] = useState(false);
    const [isEditVisible, setIsEditVisible] = useState(false);
    const [selectedSubjectInCurriculum, setSelectedSubjectInCurriculum] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        // const fetchSubjectInCurriculums = async () => {
        //     const subjects = await fetchSubjectInCurriculumList();
        //     setCurriculums(subjects);
        // };

        // fetchSubjectInCurriculums();

        const fetchData = async () => {
            try {
                setLoading(true);
                const subjects = await fetchSubjectInCurriculumList();
                setSubjectInCurriculums(subjects);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [isAddVisible, isEditVisible, deleteModalVisible]);

    const filteredSubjectInCurriculums = subjectInCurriculums.filter((subjectInCurriculum) => {
        const subjectName = subjectInCurriculum.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = !filterSubject || subjectInCurriculum.subject === filterSubject;
        const matchesGrade = !filterGrade || subjectInCurriculum.grade === filterGrade;
        const matchesCurriculum = !filterCurriculum || subjectInCurriculum.curriculum === filterCurriculum;
        return subjectName && matchesSubject && matchesGrade && matchesCurriculum;
    });

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

    const handleMenuClick = async (key: React.Key, record: IViewListSubjectInCurriculum) => {
        if (key === 'edit') {
            setSelectedSubjectInCurriculum(record.subjectInCurriculumId);
            setIsEditVisible(true);
        } else if (key === 'delete') {
            handleDeleteModal(record);
        }
    };

    const showAddModal = () => {
        setIsAddVisible(true);
    };

    const handleAdd = () => {
        setIsAddVisible(false);
    };

    const handleDeleteModal = (subjectInCurriculum: IViewListSubjectInCurriculum) => {
        setSubjectInCurriculumToDelete(subjectInCurriculum);
        setDeleteModalVisible(true);
    };

    const handleDeleteCurriculumFramework = async () => {
        try {
            if (!subjectInCurriculumToDelete) return;
            setDeleteModalVisible(false);

            // Simulating API response success
            const isDeleted = await deleteSubjectInCurriculum(subjectInCurriculumToDelete.subjectInCurriculumId);
            if (isDeleted) {
                message.success('Đã xóa môn học trong khung chương trình thành công');
                // const updatedCurriculums = subjectInCurriculums.filter((subjectInCurriculum) => subjectInCurriculum.subjectInCurriculumId !== subjectInCurriculumToDelete.subjectInCurriculumId);
                // setCurriculums(updatedCurriculums);
            } else {
                message.error('Không xóa được môn học trong khung chương trình');
            }
        } catch (error) {
            console.error('Lỗi khi xóa môn học trong khung chương trình:', error);
            message.error('Không xóa được môn học trong khung chương trình');
        }
    };

    const handleCancelDeleteModal = () => {
        setDeleteModalVisible(false);
        setSubjectInCurriculumToDelete(null);
    };

    const columns = [
        // {
        //     title: 'No.',
        //     dataIndex: '1',
        //     render: (_text: any, _record: any, index: number) => index + 1,
        // },
        // {
        //     title: 'Tên môn học trong chương trình',
        //     dataIndex: 'name',
        //     key: 'name',
        // },
        // {
        //     title: 'Khung chương trình',
        //     dataIndex: 'curriculum_name',
        //     key: 'curriculum_name',
        // },
        // {
        //     title: 'Môn học',
        //     dataIndex: 'subject_name',
        //     key: 'subject_name',
        // },
        // {
        //     title: 'Lớp',
        //     dataIndex: 'grade_name',
        //     key: 'grade_name',
        // },
        // {
        //     title: 'Cập nhật',
        //     dataIndex: 'actions',
        //     key: 'actions',
        //     // render: (_text: any, _record: IViewListSubjectInCurriculum) => (
        //     render: () => (
        //         <Link to={`#`}>
        //             <Button type="link"><EditOutlined /> Chỉnh sửa</Button>
        //         </Link>
        //     ),
        // },
        // {
        //     title: 'Xóa',
        //     key: 'delete',
        //     render: (_text: any, record: IViewListSubjectInCurriculum) => (
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
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => name
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
            render: (record: IViewListSubjectInCurriculum) => (
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
            <Title level={2} className="my-4">Quản lý môn học trong khung chương trình</Title>
            <div className="mb-4 flex justify-between items-center">
                <div className="flex">
                    <div className="relative mr-2">
                        <Input
                            placeholder="Tìm kiếm môn học trong chương trình..."
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
                </div>
                {/* <div className="flex items-center space-x-4">
                    <Link to={`#`}>
                        <Button type="default" icon={<IssuesCloseOutlined />}>
                            Đề xuất khung chương trình
                        </Button>
                    </Link>
                    <Link to={`#`}>
                        <Button type="default" icon={<IssuesCloseOutlined />}>
                            Đề xuất môn học
                        </Button>
                    </Link>
                    <Link to={`#`}>
                        <Button type="primary" icon={<PlusOutlined />}>
                            Thêm mới
                        </Button>
                    </Link>
                </div> */}
                <div>
                    <Button
                        className="inline-flex items-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        onClick={showAddModal}
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
                        dataSource={filteredSubjectInCurriculums}
                        rowKey="id"
                        pagination={{
                            showQuickJumper: true, // Thêm ô nhảy đến trang cụ thể
                        }}
                    />
                </Spin>
            </div>

            <Modal
                title="Xác nhận xóa môn học"
                open={deleteModalVisible}
                onOk={handleDeleteCurriculumFramework}
                onCancel={handleCancelDeleteModal}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn xóa môn học này?</p>
            </Modal>

            <SubjectInCurriculumFormPage
                isVisible={isAddVisible}
                onClose={() => setIsAddVisible(false)}
                onCreate={handleAdd}
            />

            <UpdateSubjectInCurriculumForm
                isVisible={isEditVisible}
                onClose={() => setIsEditVisible(false)}
                subjectInCurriculumId={selectedSubjectInCurriculum!}
            />
        </div>
    );
};

export default SubjectInCurriculumManagementPage;