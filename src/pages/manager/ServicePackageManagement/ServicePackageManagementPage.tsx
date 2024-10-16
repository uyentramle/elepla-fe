import React, { useState } from "react";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Input, Table, Modal, message, Typography } from 'antd';
import { Link } from "react-router-dom";

import service_packages_data, { IServicePackage } from "@/data/manager/ServicePackageData";

const { Title } = Typography;

const ServicePackageManagementPage: React.FC = () => {
    const [servicePackages, setServicePackages] = useState(service_packages_data);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [servicePackageToDelete, setServicePackageToDelete] = useState<IServicePackage | null>(null);

    const filteredServicePackages = servicePackages.filter((c) => {
        const matchesSearch = `${c.packageName}`.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const handleDeleteModal = (servicePackage: IServicePackage) => {
        setServicePackageToDelete(servicePackage);
        setDeleteModalVisible(true);
    };

    const handleDeletePackage = async () => {
        try {
            if (!servicePackageToDelete) return;
            setDeleteModalVisible(false);

            // Simulating API response success
            const response = { data: { success: true } };
            if (response.data.success) {
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
            render: (_text: any, _record: any, index: number) => index + 1,
        },
        {
            title: 'Tên gói',
            dataIndex: 'packageName',
            key: 'packageName',
            render: (text: string, _record: IServicePackage) => (
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
            render: (text: number) => <span className="font-">{text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>,
        },
        {
            title: 'Thời hạn (ngày)',
            dataIndex: 'duration',
            key: 'duration',
            render: (text: number) => <span className="">{text}</span>,
        },
        {
            title: 'Cập nhật',
            key: 'update',
            render: (_text: any, _record: IServicePackage) => (
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
            render: (_text: any, record: IServicePackage) => (
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