import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Card, message, Dropdown, Menu, Spin, Avatar } from 'antd';
import { FileOutlined, ShareAltOutlined, SearchOutlined, BlockOutlined, EllipsisOutlined, BookOutlined, EditOutlined } from '@ant-design/icons';
import { PlanbookShared, getSharedPlanbookByUserId } from '@/data/academy-staff/PlanbookData';
import PlanbookDetailForm from '@/pages/academy-staff/PlanbookManagement/PlanbookDetailForm';
import UpdatePlanbookForm from '@/pages/academy-staff/PlanbookManagement/UpdatePlanbookForm';
import { getUserId } from '@/data/apiClient';

const { Option } = Select;

const PlanbookSharePage: React.FC = () => {
    const [planbooks, setPlanbooks] = useState<PlanbookShared[]>([]);  // Khai báo kiểu Planbook[]
    const [selectedPlanbook, setSelectedPlanbook] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'recentUpdate'>('newest');
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDetailVisible, setIsDetailVisible] = useState(false); // State để điều khiển hiển thị của modal
    const [filterStatus, setFilterStatus] = useState<'Public' | 'Private' | 'All'>('All');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getSharedPlanbookByUserId(getUserId()!);
                setPlanbooks(response);
            } catch (error) {
                message.error('Có lỗi xảy ra, vui lòng thử lại sau');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isDetailVisible, isEditModalVisible]);

    const filteredPlanbooks = planbooks.filter((planbook) => {
        const matchesSearch = planbook.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === 'All' ||
            (filterStatus === 'Public' && planbook.isPublic) ||
            (filterStatus === 'Private' && !planbook.isPublic);

        return matchesSearch && matchesStatus;
    }).sort((a, b) => {
        if (sortOrder === 'newest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortOrder === 'oldest') {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortOrder === 'recentUpdate') {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        return 0;
    });

    const handleMenuClick = async (key: string, planbookId: string) => {
        setSelectedPlanbook(planbookId); // Lưu ID Planbook được chọn vào state một lần

        switch (key) {
            case "detail":
                setIsDetailVisible(true); // Mở Modal chi tiết
                break;
            case "edit":
                setIsEditModalVisible(true); // Mở Modal chỉnh sửa
                break;
            default:
                break;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-semibold mb-4 text-center">Được chia sẻ với tôi</h1>
            {/* Search and Sort - Unchanged */}
            <div className="flex justify-between mb-6 gap-2">
                <div className="flex justify-center">
                    <div className="mb-4 w-[400px]">
                        <Input
                            type="text"
                            placeholder="Tìm kiếm bài dạy..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            suffix={<SearchOutlined />}
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Select
                        defaultValue="newest"
                        onChange={(value: 'newest' | 'oldest' | 'recentUpdate') => setSortOrder(value)}
                        className="mb-4"
                        style={{ width: 180 }}
                    >
                        <Option value="newest">Ngày tạo mới nhất</Option>
                        <Option value="oldest">Ngày tạo cũ nhất</Option>
                        <Option value="recentUpdate">Cập nhật gần nhất</Option>
                    </Select>
                    <Select
                        defaultValue="All"
                        onChange={(value: 'Public' | 'Private' | 'All') => setFilterStatus(value)}
                        className="mb-4"
                        style={{ width: 120 }}
                    >
                        <Option value="All">Tất cả</Option>
                        <Option value="Public">Công khai</Option>
                        <Option value="Private">Riêng tư</Option>
                    </Select>
                </div>
            </div>

            {/* Planbook Items with Moving Effect - Unchanged */}
            <div className="grid grid-cols-4 gap-12">
                {filteredPlanbooks.map(planbook => (
                    <Card
                        key={planbook.planbookId}
                        className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-white rounded-lg overflow-hidden w-[240px] relative"
                        hoverable
                    >
                        {/* Dropdown menu ở góc trên bên phải */}
                        <Dropdown
                            overlay={
                                <Menu onClick={({ key }) => handleMenuClick(key, planbook.planbookId)}>
                                    <Menu.Item key="detail" icon={<BlockOutlined />}>
                                        Chi tiết
                                    </Menu.Item>
                                    { planbook.isEdited && (
                                    <Menu.Item key="edit" icon={<EditOutlined />}>
                                        Chỉnh sửa
                                    </Menu.Item>
                                    )}
                                </Menu>
                            }
                            trigger={['click']}
                        >
                            <Button
                                shape="default"
                                icon={<EllipsisOutlined />}
                                className="absolute top-2 right-2 border-none"
                            />
                        </Dropdown>

                        {/* Nội dung của card */}
                        <div className="flex flex-col items-center text-center h-full">
                            {/* Icon ở giữa card */}
                            <Avatar
                                shape="square"
                                size={64}
                                icon={<FileOutlined />}
                                className="mb-3 bg-blue-100 text-blue-600"
                            />

                            {/* Tiêu đề */}
                            <div className="h-[60px]">
                                <h3 className="text-lg font-semibold text-gray-700 line-clamp-2">
                                    {planbook.title.length > 40
                                        ? `${planbook.title.slice(0, 40)}...`
                                        : planbook.title}
                                </h3>
                            </div>

                            {/* Thông tin chi tiết */}
                            <div className="flex flex-grow justify-between items-center w-full text-gray-500 text-sm mt-4">
                                <div className="flex items-center justify-start w-1/2">
                                    <ShareAltOutlined className="mr-2" />
                                    <span>{planbook.isPublic ? "Công khai" : "Riêng tư"}</span>
                                </div>
                                <div className="flex items-center justify-end w-1/2">
                                    <BookOutlined className="mr-2" />
                                    <span>
                                        {planbook.lessonName.includes(':')
                                            ? planbook.lessonName.split(':')[0]
                                            : planbook.subject}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {selectedPlanbook && (
                <PlanbookDetailForm planbookId={selectedPlanbook} isVisible={isDetailVisible} onClose={() => setIsDetailVisible(false)} isLibrary={false} />
            )}

            {selectedPlanbook && (
                <UpdatePlanbookForm planbookId={selectedPlanbook} isVisible={isEditModalVisible} onClose={() => setIsEditModalVisible(false)} />
            )}
        </div>
    );
};

export default PlanbookSharePage;