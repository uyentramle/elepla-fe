import React, { useState } from "react";
import { Input, Table, Typography, Button, Modal, message, Space, Dropdown, Menu, Select, Spin } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EllipsisOutlined } from "@ant-design/icons";
import { IViewListChapter, fetchChapterList, deleteChapter } from '@/data/academy-staff/ChapterData';
import { getAllCurriculumFramework, IViewListCurriculum } from "@/data/admin/CurriculumFramworkData";
import { getAllSubject, IViewListSubject } from "@/data/admin/SubjectData";
import { getAllGrade, IViewListGrade } from "@/data/admin/GradeData";
import CreateChapterForm from "./CreateChapterForm";
import UpdateChapterForm from "./UpdateChapterForm";

const { Title } = Typography;
const { Option } = Select;

const ChapterManagementPage: React.FC = () => {
    const [chapters, setChapters] = React.useState<IViewListChapter[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
    const [chapterToDelete, setChapterToDelete] = React.useState<IViewListChapter | null>(null);
    const [subjectOptions, setSubjectOptions] = useState<IViewListSubject[]>([]); // Danh sách môn học
    const [filterSubject, setFilterSubject] = useState('');
    const [gradeOptions, setGradeOptions] = useState<IViewListGrade[]>([]); // Danh sách khối lớp
    const [filterGrade, setFilterGrade] = useState('');
    const [curriculumOptions, setCurriculumOptions] = useState<IViewListCurriculum[]>([]); // Danh sách khung chương trình
    const [filterCurriculum, setFilterCurriculum] = useState('');
    const [isAddVisible, setIsAddVisible] = useState(false);
    const [isEditVisible, setIsEditVisible] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const filteredChapters = chapters.filter((chapter) => {
        const chapterName = chapter.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = !filterSubject || chapter.subject === filterSubject;
        const matchesGrade = !filterGrade || chapter.grade === filterGrade;
        const matchesCurriculum = !filterCurriculum || chapter.curriculum === filterCurriculum;
        return chapterName && matchesSubject && matchesGrade && matchesCurriculum;
    });

    React.useEffect(() => {
        // const fetchChapters = async () => {
        //     const chapterList = await fetchChapterList();
        //     setChapters(chapterList);
        // };

        // fetchChapters();

        const fetchData = async () => {
            try {
                setLoading(true);
                const chapterList = await fetchChapterList();
                setChapters(chapterList);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAddVisible, isEditVisible, deleteModalVisible]);

    const handleDeleteModal = (chapter: IViewListChapter) => {
        setChapterToDelete(chapter);
        setDeleteModalVisible(true);
    };

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

    const handleMenuClick = async (key: React.Key, record: IViewListChapter) => {
        if (key === 'edit') {
            setSelectedChapter(record.chapterId);
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

    const handleDeleteChapter = async () => {
        try {
            if (!chapterToDelete) return;
            setDeleteModalVisible(false);

            const isDeleted = await deleteChapter(chapterToDelete.chapterId);
            if (isDeleted) {
                message.success('Đã xóa chương thành công');
                // const updatedChapters = chapters.filter((chapter) => chapter.id !== chapterToDelete.id);
                // setChapters(updatedChapters);
            } else {
                message.error('Không xóa được chương');
            }
        } catch (error) {
            console.error('Lỗi khi xóa chương:', error);
            message.error('Không xóa được chương');
        }
    };

    const handleCancelDeleteModal = () => {
        setDeleteModalVisible(false);
        setChapterToDelete(null);
    };

    const columns = [
        // {
        //     title: 'No.',
        //     dataIndex: '1',
        //     key: 'id',
        //     render: (_text: any, _record: any, index: number) => index + 1,
        // },
        // {
        //     title: 'Tên chương',
        //     dataIndex: 'name',
        //     key: 'name',
        // },
        // {
        //     title: 'Cập nhật',
        //     dataIndex: 'actions',
        //     key: 'actions',
        //     render: (_text: any, _record: IViewListChapter) => (
        //         <Link to={`/admin/chapters/edit/${_record.chapterId}`}>
        //             <Button type="link"><EditOutlined /> Chỉnh sửa</Button>
        //         </Link>
        //     ),
        // },
        // {
        //     title: 'Xóa',
        //     key: 'delete',
        //     render: (_text: any, record: IViewListChapter) => (
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
            title: 'Tên chương',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => name,
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
            render: (record: IViewListChapter) => (
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
            <Title level={2} className="my-4">Quản lý chương</Title>

            <div className="mb-4 flex justify-between items-center">
                <div className="flex">
                    <div className="relative mr-2">
                        <Input
                            placeholder="Tìm kiếm chương..."
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
                <div>
                    {/* <Link to="/admin/chapters/add-new">
                    <Button type="primary" icon={<PlusOutlined />}>
                        Thêm mới
                    </Button>
                </Link> */}
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
                        dataSource={filteredChapters}
                        rowKey="id"
                        pagination={{
                            showQuickJumper: true, // Thêm ô nhảy đến trang cụ thể
                        }}
                    />
                </Spin>
            </div>

            <Modal
                title="Xác nhận xóa chương"
                open={deleteModalVisible}
                onOk={handleDeleteChapter}
                onCancel={handleCancelDeleteModal}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn xóa chương này?</p>
            </Modal>

            <CreateChapterForm
                isVisible={isAddVisible}
                onClose={() => setIsAddVisible(false)}
                onCreate={handleAdd}
            />

            <UpdateChapterForm
                chapterId={selectedChapter!}
                isVisible={isEditVisible}
                onClose={() => setIsEditVisible(false)}
            />
        </div>
    );
};

export default ChapterManagementPage;
