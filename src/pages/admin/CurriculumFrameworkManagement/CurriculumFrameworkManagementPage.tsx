import React from "react";
import { Input, Table, Typography, Button, Modal, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import curriculumData, { ICurriculumFramework } from '@/data/admin/CurriculumFramworkData';
import { Link } from "react-router-dom";

const { Title } = Typography;

const CurriculumFrameworkManagementPage: React.FC = () => {
    const [curriculums, setCurriculums] = React.useState<ICurriculumFramework[]>(curriculumData);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
    const [curriculumToDelete, setCFToDelete] = React.useState<ICurriculumFramework | null>(null);

    const filteredCurriculums = curriculums.filter((curriculum) =>
        curriculum.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteModal = (curriculum: ICurriculumFramework) => {
        setCFToDelete(curriculum);
        setDeleteModalVisible(true);
    };

    const handleDeleteCurriculumFramework = async () => {
        try {
            if (!curriculumToDelete) return;
            setDeleteModalVisible(false);

            // Simulating API response success
            const response = { data: { success: true } };
            if (response.data.success) {
                message.success('Đã xóa khung chương trình thành công');
                const updatedCurriculums = curriculums.filter((curriculum) => curriculum.id !== curriculumToDelete.id);
                setCurriculums(updatedCurriculums);
            } else {
                message.error('Không xóa được khung chương trình');
            }
        } catch (error) {
            console.error('Lỗi khi xóa khung chương trình:', error);
            message.error('Không xóa được khung chương trình');
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
            render: (_text: any, _record: any, index: number) => index + 1,
        },
        {
            title: 'Tên chương trình',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Kiểm duyệt',
            dataIndex: 'is_approved',
            key: 'is_approved',
            render: (isApproved: boolean) => (
                <span className={`text-${isApproved ? 'green' : 'red'}-500`}>
                    {isApproved ? 'Đã kiểm duyệt' : 'Chưa kiểm duyệt'}
                </span>
            ),
        },
        {
            title: 'Cập nhật',
            dataIndex: 'actions',
            key: 'actions',
            render: (_text: any, _record: ICurriculumFramework) => (
                <Link to={`#`}>
                    <Button type="link"><EditOutlined /> Chỉnh sửa</Button>
                </Link>
            ),
        },
        {
            title: 'Xóa',
            key: 'delete',
            render: (_text: any, record: ICurriculumFramework) => (
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
            <Title level={2} className="my-4">Quản lý khung chương trình</Title>

            <div className="mb-4 flex justify-between items-center">
                <Input
                    placeholder="Tìm kiếm chương trình..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    suffix={<SearchOutlined />}
                    className="w-1/3"
                />
                <Button type="primary" icon={<PlusOutlined />}>
                    Thêm mới
                </Button>
            </div>

            <div className="overflow-x-auto">
                <Table
                    columns={columns}
                    dataSource={filteredCurriculums}
                    rowKey="id"
                />
            </div>

            <Modal
                title="Xác nhận xóa khung chương trình"
                open={deleteModalVisible}
                onOk={handleDeleteCurriculumFramework}
                onCancel={handleCancelDeleteModal}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn xóa khung chương trình này?</p>
            </Modal>
        </>
    );
};

export default CurriculumFrameworkManagementPage;
