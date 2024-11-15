import React from "react";
import { Input, Table, Typography, Button, Modal, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { IViewListSubject, fetchSubjectList, deleteSubject } from '@/data/admin/SubjectData';
import { Link } from "react-router-dom";

const { Title } = Typography;

const SubjectManagementPage: React.FC = () => {
    const [subjects, setSubjects] = React.useState<IViewListSubject[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
    const [subjectToDelete, setCFToDelete] = React.useState<IViewListSubject | null>(null);

    const filteredSubjects = subjects.filter((subject) =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    React.useEffect(() => {
        const fetchSubjects = async () => {
            const subjectList = await fetchSubjectList();
            setSubjects(subjectList);
        };

        fetchSubjects();
    }, []);

    const handleDeleteModal = (subject: IViewListSubject) => {
        setCFToDelete(subject);
        setDeleteModalVisible(true);
    };

    const handleDeleteSubject = async () => {
        try {
            if (!subjectToDelete) return;
            setDeleteModalVisible(false);

            const isDeleted = await deleteSubject(subjectToDelete.subjectId);
            if (isDeleted) {
                message.success('Đã xóa môn học thành công');
                const updatedSubjects = subjects.filter((subject) => subject.subjectId !== subjectToDelete.subjectId);
                setSubjects(updatedSubjects);
            } else {
                message.error('Không xóa được môn học');
            }
        } catch (error) {
            console.error('Lỗi khi xóa môn học:', error);
            message.error('Không xóa được môn học');
        }
    };

    const handleCancelDeleteModal = () => {
        setDeleteModalVisible(false);
        setCFToDelete(null);
    };

    const columns = [
        {
            title: 'No.',
            dataIndex: '1',
            key: 'subjectId',
            render: (_text: any, _record: any, index: number) => index + 1,
        },
        {
            title: 'Tên môn học',
            dataIndex: 'name',
            key: 'name',
        },
        // {
        //     title: 'Kiểm duyệt',
        //     dataIndex: 'is_approved',
        //     key: 'is_approved',
        //     render: (isApproved: boolean) => (
        //         <span className={`text-${isApproved ? 'green' : 'red'}-500`}>
        //             {isApproved ? 'Đã kiểm duyệt' : 'Chưa kiểm duyệt'}
        //         </span>
        //     ),
        // },
        {
            title: 'Cập nhật',
            dataIndex: 'actions',
            key: 'actions',
            render: (_text: any, _record: IViewListSubject) => (
                <Link to={`/admin/subjects/edit/${_record.subjectId}`}>
                    <Button type="link"><EditOutlined /> Chỉnh sửa</Button>
                </Link>
            ),
        },
        {
            title: 'Xóa',
            key: 'delete',
            render: (_text: any, record: IViewListSubject) => (
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
            <Title level={2} className="my-4">Quản lý môn học</Title>

            <div className="mb-4 flex justify-between items-center">
                <Input
                    placeholder="Tìm kiếm môn học..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    suffix={<SearchOutlined />}
                    className="w-1/3"
                />
                <Link to="/admin/subjects/add-new">
                    <Button type="primary" icon={<PlusOutlined />}>
                        Thêm mới
                    </Button>
                </Link>
            </div>

            <div className="overflow-x-auto">
                <Table
                    columns={columns}
                    dataSource={filteredSubjects}
                    rowKey="id"
                />
            </div>

            <Modal
                title="Xác nhận xóa môn học"
                open={deleteModalVisible}
                onOk={handleDeleteSubject}
                onCancel={handleCancelDeleteModal}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn xóa môn học này?</p>
            </Modal>
        </>
    );
};

export default SubjectManagementPage;
