import React from "react";
import { Input, Table, Typography, Button, Modal, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { IViewListLesson, fetchLessonList, deleteLesson } from '@/data/academy-staff/LessonData';
import { Link } from "react-router-dom";

const { Title } = Typography;

const LessonManagementPage: React.FC = () => {
    const [lessons, setLessons] = React.useState<IViewListLesson[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
    const [lessonToDelete, setLessonToDelete] = React.useState<IViewListLesson | null>(null);

    const filteredLessons = lessons.filter((lesson) =>
        lesson.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    React.useEffect(() => {
        const fetchLessons = async () => {
            const lessonList = await fetchLessonList();
            setLessons(lessonList);
        };

        fetchLessons();
    }, []);

    const handleDeleteModal = (lesson: IViewListLesson) => {
        setLessonToDelete(lesson);
        setDeleteModalVisible(true);
    };

    const handleDeleteLesson = async () => {
        try {
            if (!lessonToDelete) return;
            setDeleteModalVisible(false);

            const isDeleted = await deleteLesson(lessonToDelete.id);
            if (isDeleted) {
                message.success('Đã xóa bài học thành công');
                const updatedLessons = lessons.filter((lesson) => lesson.id !== lessonToDelete.id);
                setLessons(updatedLessons);
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

    const columns = [
        {
            title: 'No.',
            dataIndex: '1',
            key: 'id',
            render: (_text: any, _record: any, index: number) => index + 1,
        },
        {
            title: 'Tên bài học',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Cập nhật',
            dataIndex: 'actions',
            key: 'actions',
            render: (_text: any, _record: IViewListLesson) => (
                <Link to={`/admin/lessons/edit/${_record.id}`}>
                    <Button type="link"><EditOutlined /> Chỉnh sửa</Button>
                </Link>
            ),
        },
        {
            title: 'Xóa',
            key: 'delete',
            render: (_text: any, record: IViewListLesson) => (
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
            <Title level={2} className="my-4">Quản lý bài học</Title>

            <div className="mb-4 flex justify-between items-center">
                <Input
                    placeholder="Tìm kiếm bài học..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    suffix={<SearchOutlined />}
                    className="w-1/3"
                />
                <Link to="/admin/lessons/add-new">
                    <Button type="primary" icon={<PlusOutlined />}>
                        Thêm mới
                    </Button>
                </Link>
            </div>

            <div className="overflow-x-auto">
                <Table
                    columns={columns}
                    dataSource={filteredLessons}
                    rowKey="id"
                />
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
        </>
    );
};

export default LessonManagementPage;
