import React from "react";
import { Input, Table, Typography, Button, Modal, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { IViewListGrade, fetchGradeList, deleteGrade } from '@/data/admin/GradeData';

const { Title } = Typography;


const GrademanagementPage: React.FC = () => {
    const [grades, setGrades] = React.useState<IViewListGrade[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
    const [gradeToDelete, setGradeToDelete] = React.useState<IViewListGrade | null>(null);

    const filteredGrades = grades.filter((grade) =>
        grade.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    React.useEffect(() => {
        const fetchGrades = async () => {
            const gradeList = await fetchGradeList();
            setGrades(gradeList);
        };

        fetchGrades();
    }, []);

    const handleDeleteModal = (grade: IViewListGrade) => {
        setGradeToDelete(grade);
        setDeleteModalVisible(true);
    };

    const handleDeleteGrade = async () => {
        try {
            if (!gradeToDelete) return;
            setDeleteModalVisible(false);

            const isDeleted = await deleteGrade(gradeToDelete.id);
            if (isDeleted) {
                message.success('Đã xóa khối lớp thành công');
                const updatedGrades = grades.filter((grade) => grade.id !== gradeToDelete.id);
                setGrades(updatedGrades);
            } else {
                message.error('Không xóa được khối lớp');
            }
        } catch (error) {
            console.error('Lỗi khi xóa khối lớp:', error);
            message.error('Không xóa được khối lớp');
        }
    };

    const handleCancelDeleteModal = () => {
        setDeleteModalVisible(false);
        setGradeToDelete(null);
    };

    const columns = [
        {
            title: 'No.',
            dataIndex: '1',
            key: 'gradeId',
            render: (_text: any, _record: any, index: number) => index + 1,
        },
        {
            title: 'Khối lớp',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Cập nhật',
            dataIndex: 'actions',
            key: 'actions',
            render: (_text: any, _record: IViewListGrade) => (
                <Link to={`/admin/grades/edit/${_record.id}`}>
                    <Button type="link"><EditOutlined /> Chỉnh sửa</Button>
                </Link>
            ),
        },
        {
            title: 'Xóa',
            key: 'delete',
            render: (_text: any, record: IViewListGrade) => (
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
            <Title level={2} className="my-4">Quản lý khối lớp</Title>
            <div className="mb-4 flex justify-between items-center">
                <Input
                    placeholder="Tìm kiếm khối lớp..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    suffix={<SearchOutlined />}
                    className="w-1/3"
                />
                <Link to="/admin/grades/add-new">
                    <Button type="primary" icon={<PlusOutlined />}>
                        Thêm mới
                    </Button>
                </Link>
            </div>

            <div className="overflow-x-auto">
                <Table
                    columns={columns}
                    dataSource={filteredGrades}
                    rowKey="id"
                />
            </div>

            <Modal
                title="Xác nhận xóa khối lớp"
                open={deleteModalVisible}
                onOk={handleDeleteGrade}
                onCancel={handleCancelDeleteModal}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn xóa khối lớp này?</p>
            </Modal>
        </>
    );
};

export default GrademanagementPage;