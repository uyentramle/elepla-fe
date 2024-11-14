import React from "react";
import { Input, Table, Typography, Button, Modal, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { IViewListChapter, fetchChapterList, deleteChapter } from '@/data/academy-staff/ChapterData';
import { Link } from "react-router-dom";

const { Title } = Typography;

const ChapterManagementPage: React.FC = () => {
    const [chapters, setChapters] = React.useState<IViewListChapter[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
    const [chapterToDelete, setChapterToDelete] = React.useState<IViewListChapter | null>(null);

    const filteredChapters = chapters.filter((chapter) =>
        chapter.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    React.useEffect(() => {
        const fetchChapters = async () => {
            const chapterList = await fetchChapterList();
            setChapters(chapterList);
        };

        fetchChapters();
    }, []);

    const handleDeleteModal = (chapter: IViewListChapter) => {
        setChapterToDelete(chapter);
        setDeleteModalVisible(true);
    };

    const handleDeleteChapter = async () => {
        try {
            if (!chapterToDelete) return;
            setDeleteModalVisible(false);

            const isDeleted = await deleteChapter(chapterToDelete.id);
            if (isDeleted) {
                message.success('Đã xóa chương thành công');
                const updatedChapters = chapters.filter((chapter) => chapter.id !== chapterToDelete.id);
                setChapters(updatedChapters);
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
        {
            title: 'No.',
            dataIndex: '1',
            key: 'chapterId',
            render: (_text: any, _record: any, index: number) => index + 1,
        },
        {
            title: 'Tên chương',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Cập nhật',
            dataIndex: 'actions',
            key: 'actions',
            render: (_text: any, _record: IViewListChapter) => (
                <Link to={`/admin/chapters/edit/${_record.id}`}>
                    <Button type="link"><EditOutlined /> Chỉnh sửa</Button>
                </Link>
            ),
        },
        {
            title: 'Xóa',
            key: 'delete',
            render: (_text: any, record: IViewListChapter) => (
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
            <Title level={2} className="my-4">Quản lý chương</Title>

            <div className="mb-4 flex justify-between items-center">
                <Input
                    placeholder="Tìm kiếm chương..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    suffix={<SearchOutlined />}
                    className="w-1/3"
                />
                <Link to="/admin/chapters/add-new">
                    <Button type="primary" icon={<PlusOutlined />}>
                        Thêm mới
                    </Button>
                </Link>
            </div>

            <div className="overflow-x-auto">
                <Table
                    columns={columns}
                    dataSource={filteredChapters}
                    rowKey="id"
                />
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
        </>
    );
};

export default ChapterManagementPage;
