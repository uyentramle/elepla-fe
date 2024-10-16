import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Input, Table, Select, Modal, message, Typography } from 'antd';
import article_data, { IArticle } from '@/data/admin/ArticleData';

const { Option } = Select;
const { Title } = Typography;

const ArticleManagementPage: React.FC = () => {
    const [articles, setArticles] = useState(article_data);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'Draft' | 'Public' | 'Private' | 'Trash' | 'All'>('All');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState<IArticle | null>(null);

    const filteredArticles = articles.filter((b) => {
        const matchesSearch = `${b.title}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            filterStatus === 'All' ||
            (filterStatus === 'Draft' && b.status === 'Draft') ||
            (filterStatus === 'Public' && b.status === 'Public') ||
            (filterStatus === 'Private' && b.status === 'Private') ||
            (filterStatus === 'Trash' && b.isDelete);
        return matchesSearch && matchesStatus;
    });

    const handleDeleteModal = (article: IArticle) => {
        setArticleToDelete(article);
        setDeleteModalVisible(true);
    };

    const columns = [
        {
            title: 'No.',
            dataIndex: '1',
            // key: 'id',
            render: (_text: any, _record: any, index: number) => index + 1,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'thumb',
            key: 'thumb',
            render: (text: string) => <img src={text} alt="article" className="w-16 h-auto" />,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            render: (text: string) => <span className="font-semibold">{text}</span>,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: Date) => <span className="font-semibold">{new Date(text).toLocaleDateString()}</span>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text: string) => <span>
                {text === 'Public' && 'Công khai'}
                {text === 'Private' && 'Không công khai'}
                {text === 'Draft' && <><EditOutlined /> Nháp</>}
                {text === 'Trash' && 'Thùng rác'}
            </span>,
        },
        {
            title: 'Cập nhật',
            key: 'update',
            render: (_text: any, _record: IArticle) => (
                <Link to={`/admin/articles/edit/${_record.id}`}>
                    <Button type="primary" icon={<EditOutlined />} className="bg-blue-500">
                        Cập nhật
                    </Button>
                </Link>
            ),
        },
        {
            title: 'Xóa',
            key: 'delete',
            render: (_text: any, record: IArticle) => (
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

    const handleDeleteArticle = async () => {
        try {
            if (!articleToDelete) return;
            setDeleteModalVisible(false);

            // Simulating API response success
            const response = { data: { success: true } };
            if (response.data.success) {
                message.success('Đã xóa bài viết thành công');
                const updatedArticles = articles.filter((article) => article.id !== articleToDelete.id);
                setArticles(updatedArticles);
            } else {
                message.error('Không xóa được bài viết');
            }
        } catch (error) {
            console.error('Lỗi khi xóa bài viết:', error);
            message.error('Không xóa được bài viết');
        }
    };

    const handleCancelDeleteModal = () => {
        setDeleteModalVisible(false);
        setArticleToDelete(null);
    };

    return (
        <>
            <Title level={2} className="my-4">Quản lý bài viết</Title>
            <div className="mb-4 flex justify-between">
                <div className="flex">
                    <div className="relative mr-4">
                        <Input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            suffix={<SearchOutlined />}
                        />
                    </div>
                    <div>
                        <Select
                            id="status-filter"
                            className="w-48"
                            value={filterStatus}
                            onChange={(value) => setFilterStatus(value as 'Public' | 'Private' | 'Draft' | 'Trash' | 'All')}
                        >
                            <Option value="All">Tất cả</Option>
                            <Option value="Public">Công khai</Option>
                            <Option value="Private">Không công khai</Option>
                            <Option value="Draft">Nháp</Option>
                            <Option value="Trash">Thùng rác</Option>
                        </Select>
                    </div>
                </div>
                <div>
                    <Button type="primary" className="mr-4">
                        <Link
                            to="/admin/articles/add-new"
                            className="flex items-center"
                        >
                            <PlusOutlined className="mr-2" />
                            Thêm mới
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table columns={columns} dataSource={filteredArticles} rowKey="id" />
            </div>

            <Modal
                title="Xác nhận xóa bài viết"
                open={deleteModalVisible}
                onOk={handleDeleteArticle}
                onCancel={handleCancelDeleteModal}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn xóa bài viết này?</p>
            </Modal>
        </>
    );
};

export default ArticleManagementPage;