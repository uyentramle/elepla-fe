import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Input, Table, Select, Modal, message, Typography } from 'antd';
import { fetchListCategory, deleteCategory, IViewListCategory } from "@/data/admin/CategoryData";

const { Option } = Select;
const { Title } = Typography;

const CategoryManagementPage: React.FC = () => {
    const [categories, setCategorys] = useState<IViewListCategory[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'Active' | 'Inactive' | 'All'>('All');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<IViewListCategory | null>(null);

    const fetchCategories = async () => {
        const categoriesData = await fetchListCategory();
        setCategorys(categoriesData);
    };

    React.useEffect(() => {
        fetchCategories();
    }, []);

    const filteredCategorys = categories.filter((c) => {
        const matchesSearch = `${c.name}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            filterStatus === 'All' ||
            (filterStatus === 'Active' && c.status) ||
            (filterStatus === 'Inactive' && !c.status);
        return matchesSearch && matchesStatus;
    });

    const handleDeleteModal = (category: IViewListCategory) => {
        setCategoryToDelete(category);
        setDeleteModalVisible(true);
    };

    const handleDeleteCategory = async () => {
    try {
        if (!categoryToDelete) return;
        setDeleteModalVisible(false);

        const isDeleted = await deleteCategory(categoryToDelete.id);
        if (isDeleted) {
            message.success('Đã xóa danh mục bài viết thành công');
            const updatedCategorys = categories.filter((category) => category.id !== categoryToDelete.id);
            setCategorys(updatedCategorys);
        } else {
            message.error('Không xóa được danh mục bài viết');
        }
    } catch (error) {
        console.error('Lỗi khi xóa danh mục bài viết:', error);
        message.error('Không xóa được danh mục bài viết');
    }
};

    const handleCancelDeleteModal = () => {
        setDeleteModalVisible(false);
        setCategoryToDelete(null);
    };

    const columns = [
        {
            title: 'No.',
            dataIndex: '1',
            key: 'id',
            render: (_text: any, _record: any, index: number) => index + 1,
        },
        // {
        //     title: 'Hình ảnh',
        //     dataIndex: 'thumb',
        //     key: 'thumb',
        //     render: (text: string) => <img src={text} alt="category" className="w-16 h-auto" />,
        // },
        {
            title: 'Tiêu đề',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <span className="font-semibold">{text}</span>,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text: Date) => <span className="font-semibold">{new Date(text).toLocaleDateString()}</span>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text: boolean) => (text ? 'Công khai' : 'Nháp'),
        },
        {
            title: 'Cập nhật',
            key: 'update',
            render: (_text: any, _record: IViewListCategory) => (
                <Link to={`/admin/categories/edit/${_record.id}`}>
                    <Button type="primary" icon={<EditOutlined />} className="bg-blue-500">
                        Cập nhật
                    </Button>
                </Link>
            ),
        },
        {
            title: 'Xóa',
            key: 'delete',
            render: (_text: any, record: IViewListCategory) => (
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
            <Title level={2} className="my-4">Quản lý danh mục bài viết</Title>
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
                            onChange={(value) => setFilterStatus(value as 'Active' | 'Inactive' | 'All')}
                        >
                            <Option value="All">Tất cả</Option>
                            <Option value="Active">Công khai</Option>
                            <Option value="Inactive">Không công khai</Option>
                        </Select>
                    </div>
                </div>
                <div>
                    <Button type="primary" className="mr-4">
                        <Link
                            to="/admin/categories/add-new"
                            className="flex items-center"
                        >
                            <PlusOutlined className="mr-2" />
                            Thêm mới
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table columns={columns} dataSource={filteredCategorys} rowKey="id" />
            </div>

            <Modal
                title="Xác nhận xóa danh mục bài viết"
                open={deleteModalVisible}
                onOk={handleDeleteCategory}
                onCancel={handleCancelDeleteModal}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn xóa danh mục này?</p>
            </Modal>
        </>
    );
};

export default CategoryManagementPage;