import React, { useState, useEffect } from "react";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Input, Table, Modal, message, Typography } from 'antd';
import { Link } from "react-router-dom";

import { IViewListServicePackage, fetchServicePackages, deleteServicePackage } from "@/data/manager/ServicePackageData";

const { Title } = Typography;

const ServicePackageManagementPage: React.FC = () => {
    const [servicePackages, setServicePackages] = useState<IViewListServicePackage[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [servicePackageToDelete, setServicePackageToDelete] = useState<IViewListServicePackage | null>(null);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const data = await fetchServicePackages();
                setServicePackages(data);
            } catch (error) {
                message.error('Không thể tải danh sách gói dịch vụ');
                console.error('Lỗi khi tải danh sách gói dịch vụ:', error);
            }
        };

        fetchPackages();
    }, []);

    const filteredServicePackages = servicePackages.filter((c) => {
        const matchesSearch = `${c.packageName}`.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const handleDeleteModal = (servicePackage: IViewListServicePackage) => {
        setServicePackageToDelete(servicePackage);
        setDeleteModalVisible(true);
    };

    const handleDeletePackage = async () => {
        try {
            if (!servicePackageToDelete) return;
            setDeleteModalVisible(false);

            // Simulating API response success
            const isDeleted = await deleteServicePackage(servicePackageToDelete.packageId);
            if (isDeleted) {
                message.success('Đã xóa gói dịch vụ thành công');
                const updatedPackages = servicePackages.filter((servicePackage) => servicePackage.packageId !== servicePackageToDelete.packageId);
                setServicePackages(updatedPackages);
            } else {
                message.error('Không xóa được gói dịch vụ');
            }
        } catch (error) {
            console.error('Lỗi khi xóa gói dịch vụ:', error);
            message.error('Không xóa được gói dịch vụ');
        }
    };

    const handleCancelDeleteModal = () => {
        setDeleteModalVisible(false);
        setServicePackageToDelete(null);
    };

    const columns = [
        {
            title: 'No.',
            dataIndex: '1',
            key: 'packageId',
            render: (_text: any, _record: any, index: number) => index + 1,
        },
        {
            title: 'Tên gói',
            dataIndex: 'packageName',
            key: 'packageName',
            render: (text: string, _record: IViewListServicePackage) => (
                <Link to={`/manager/service-packages/edit/${_record.packageId}`}>
                    <span className="font-semibold">{text}</span>
                </Link>
            ),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (text: number) => <span>{text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>,
        },
        {
            title: 'Giảm giá',
            dataIndex: 'discount',
            key: 'discount',
            render: (text: number) => <span>{text} %</span>,
        },
        {
            title: 'Số lượng KHBD',
            dataIndex: 'maxLessonPlans',
            key: 'maxLessonPlans',
            render: (text: number) => <span className="">{text}</span>,
        },
        {
            title: 'Bắt đầu',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text: number) => <span className="">{new Date(text).toLocaleDateString('vi-VN')}</span>,
        },
        {
            title: 'Kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (text: number) => <span className="">{new Date(text).toLocaleDateString('vi-VN')}</span>,
        },
        {
            title: 'Cập nhật',
            key: 'update',
            render: (_text: any, _record: IViewListServicePackage) => (
                <Link to={`/manager/service-packages/edit/${_record.packageId}`}>
                    <Button type="primary" icon={<EditOutlined />} className="bg-blue-500">
                        Cập nhật
                    </Button>
                </Link>
            ),
        },
        {
            title: 'Xóa',
            key: 'delete',
            render: (_text: any, record: IViewListServicePackage) => (
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
            <Title level={2} className="my-4">Quản lý gói dịch vụ</Title>
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
                </div>
                <div>
                    <Button type="primary" className="mr-4">
                        <Link
                            to="/manager/service-packages/add-new"
                            className="flex items-center"
                        >
                            <PlusOutlined className="mr-2" />
                            Thêm mới
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table columns={columns} dataSource={filteredServicePackages} rowKey="id" />
            </div>

            <Modal
                title="Xác nhận xóa gói dịch vụ"
                open={deleteModalVisible}
                onOk={handleDeletePackage}
                onCancel={handleCancelDeleteModal}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn xóa gói này?</p>
            </Modal>
        </>
    );
};

export default ServicePackageManagementPage;