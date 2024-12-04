import React from "react";
import { Input, Table, Typography, Button, Modal, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, IssuesCloseOutlined } from "@ant-design/icons";
import {
    IViewListSubjectInCurriculum,
    fetchSubjectInCurriculumList,
    deleteSubjectInCurriculum,
} from "@/data/academy-staff/SubjectInCurriculumData";
import { Link } from "react-router-dom";

const { Title } = Typography;

const SubjectInCurriculumManagementPage: React.FC = () => {
    const [subjectInCurriculums, setCurriculums] = React.useState<IViewListSubjectInCurriculum[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
    const [subjectInCurriculumToDelete, setSubjectInCurriculumToDelete] = React.useState<IViewListSubjectInCurriculum | null>(null);

    React.useEffect(() => {
        const fetchSubjectInCurriculums = async () => {
            const subjects = await fetchSubjectInCurriculumList();
            setCurriculums(subjects);
        };

        fetchSubjectInCurriculums();
    }, []);

    const filteredCurriculums = subjectInCurriculums.filter((subjectInCurriculum) =>
        subjectInCurriculum.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                const updatedCurriculums = subjectInCurriculums.filter((subjectInCurriculum) => subjectInCurriculum.subjectInCurriculumId !== subjectInCurriculumToDelete.subjectInCurriculumId);
                setCurriculums(updatedCurriculums);
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
        {
            title: 'No.',
            dataIndex: '1',
            render: (_text: any, _record: any, index: number) => index + 1,
        },
        {
            title: 'Tên môn học trong chương trình',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Khung chương trình',
            dataIndex: 'curriculum_name',
            key: 'curriculum_name',
        },
        {
            title: 'Môn học',
            dataIndex: 'subject_name',
            key: 'subject_name',
        },
        {
            title: 'Lớp',
            dataIndex: 'grade_name',
            key: 'grade_name',
        },
        {
            title: 'Cập nhật',
            dataIndex: 'actions',
            key: 'actions',
            render: (_text: any, _record: IViewListSubjectInCurriculum) => (
                <Link to={`#`}>
                    <Button type="link"><EditOutlined /> Chỉnh sửa</Button>
                </Link>
            ),
        },
        {
            title: 'Xóa',
            key: 'delete',
            render: (_text: any, record: IViewListSubjectInCurriculum) => (
                <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    className="bg-red-500"
                    onClick={() => handleDeleteModal(record)}
                >
                    Xóa
                </Button>
            ),
        },
    ];

    return (
        <>
            <Title level={2} className="my-4">Quản lý môn học trong khung chương trình</Title>

            <div className="mb-4 flex justify-between items-center">
                <Input
                    placeholder="Tìm kiếm môn học trong chương trình..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    suffix={<SearchOutlined />}
                    className="w-1/3"
                />
                <div className="flex items-center space-x-4">
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
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table
                    columns={columns}
                    dataSource={filteredCurriculums}
                    rowKey="id"
                />
            </div>

            <Modal
                title="Xác nhận xóa môn học trong khung chương trình"
                open={deleteModalVisible}
                onOk={handleDeleteCurriculumFramework}
                onCancel={handleCancelDeleteModal}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn xóa môn học trong khung chương trình này?</p>
            </Modal>
        </>
    );
};

export default SubjectInCurriculumManagementPage;