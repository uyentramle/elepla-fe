import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Avatar, Typography, Row, Col, Select, AutoComplete, message } from 'antd';
import { UserOutlined, LinkOutlined } from '@ant-design/icons';
import { ListUserPlanbookShare, ListUserToPlanbookShare, getUserShareByPlanbook, getUserToSharedPlanbook } from "@/data/admin/UserData";
import { SharePlanbook, sharePlanbook } from "@/data/academy-staff/PlanbookData";

const { Text } = Typography;

interface ShareModalProps {
    planbookId: string;
    planbookTitle: string | undefined;
    isVisible: boolean;
    onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ planbookId, planbookTitle, isVisible, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [listUserShare, setListUserShare] = useState<ListUserPlanbookShare[]>([]);
    const [listUserToShare, setListUserToShare] = useState<ListUserToPlanbookShare[]>([]);
    const [searchResult, setSearchResult] = useState<ListUserToPlanbookShare[]>([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const userShare = await getUserShareByPlanbook(planbookId);
                const userToShare = await getUserToSharedPlanbook(planbookId);
                setListUserShare(userShare);
                setListUserToShare(userToShare);
            } catch (error) {
                message.error("Không thể tải danh sách người dùng.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [planbookId]);

    // Xử lý tìm kiếm người dùng
    const handleSearch = (value: string) => {
        setSearchText(value);
        if (value) {
            const result = listUserToShare.filter((user) => {
                // Kiểm tra từng giá trị trước khi gọi toLowerCase
                const fullName = user.fullName?.toLowerCase() || '';
                const username = user.username?.toLowerCase() || '';
                const email = user.email?.toLowerCase() || '';
                const googleEmail = user.googleEmail?.toLowerCase() || '';
                const facebookEmail = user.facebookEmail?.toLowerCase() || '';

                return (
                    fullName.includes(value.toLowerCase()) ||
                    username.includes(value.toLowerCase()) ||
                    email.includes(value.toLowerCase()) ||
                    googleEmail.includes(value.toLowerCase()) ||
                    facebookEmail.includes(value.toLowerCase())
                );
            })
                .filter((user) => !listUserShare.some((u) => u.userId === user.userId));
            setSearchResult(result);
        } else {
            setSearchResult([]);
        }
    };

    // Xử lý chọn người dùng từ kết quả tìm kiếm
    const handleSelectUser = (userId: string) => {
        // Tìm người dùng trong listUserToShare
        const selectedUser = listUserToShare.find((user) => user.userId === userId);

        if (selectedUser) {
            // Kiểm tra nếu user chưa có trong listUserShare thì thêm vào
            const isAlreadySelected = listUserShare.some((user) => user.userId === userId);
            if (!isAlreadySelected) {
                setListUserShare((prevList) => [
                    ...prevList,
                    { ...selectedUser, isEdited: false, isOwner: false },
                ]);
            }
        }

        // Xóa kết quả tìm kiếm và reset thanh tìm kiếm
        setSearchText("");
        setSearchResult([]);
    };

    // Xử lý xóa người dùng khỏi danh sách chia sẻ
    const handleRemoveUser = (userId: string) => {
        setListUserShare(listUserShare.filter((user) => user.userId !== userId));
    };

    // Xử lý thay đổi quyền (isEdited)
    const handleRoleChange = (value: boolean, userId: string) => {
        setListUserShare(
            listUserShare.map((user) =>
                user.userId === userId ? { ...user, isEdited: value } : user
            )
        );
    };

    const handleUpdateUserShare = async () => {
        // Lọc bỏ người dùng có isOwner là true trước khi gửi về API
        const shareData: SharePlanbook = {
            planbookId: planbookId, // ID của Planbook (phải có sẵn từ props hoặc state)
            sharedTo: listUserShare
                .filter((user) => !user.isOwner) // Lọc bỏ chủ sở hữu
                .map((user) => ({
                    userId: user.userId,  // Chỉ lấy userId của những người không phải chủ sở hữu
                    isEdited: user.isEdited, // Thêm quyền chỉnh sửa của người dùng
                })),
        };

        try {
            setLoading(true); // Hiển thị loading khi gọi API
            const success = await sharePlanbook(shareData); // Gọi API để chia sẻ kế hoạch

            if (success) {
                message.success("Đã cập nhật danh sách chia sẻ!");
            } else {
                message.error("Chia sẻ thất bại. Vui lòng thử lại!");
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi chia sẻ. Vui lòng thử lại sau!");
        } finally {
            setLoading(false); // Tắt trạng thái loading
            onClose(); // Đóng modal sau khi chia sẻ
        }
    };

    return (
        <Modal
            // title={<span className="font-semibold">Chia sẻ "{planbookTitle}"</span>}
            open={isVisible}
            onCancel={onClose}
            loading={loading}
            footer={(
                <div className="flex gap-3">
                    <Button
                        type="default"
                        icon={<LinkOutlined />}
                        // onClick={handleShare}
                        className="flex items-center"
                        style={{
                            borderColor: '#40a9ff',
                            color: '#40a9ff',
                        }}
                    >
                        Sao chép đường liên kết
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            handleUpdateUserShare(); // Hàm xử lý cập nhật danh sách
                        }}
                        className="ml-auto"
                    >
                        Xong
                    </Button>
                </div>
            )}
            width={500} // Chiều rộng Modal
        >
            <div className="mb-4">
                <span className="font-semibold">
                    Chia sẻ "{planbookTitle}"
                </span>
            </div>
            {/* Ô nhập tìm kiếm */}
            <AutoComplete
                options={searchResult.map((user) => ({
                    value: user.userId,
                    label: (
                        <Row align="middle">
                            <Col>
                                <Avatar src={user.avatar} icon={!user.avatar && <UserOutlined />} />
                            </Col>
                            <Col className="ml-3">
                                <Text strong>{user.fullName}</Text>
                                <div className="text-gray-500">
                                    {user.email || user.username || user.googleEmail || user.facebookEmail}
                                </div>
                            </Col>
                        </Row>
                    ),
                }))}
                onSearch={handleSearch}
                onSelect={handleSelectUser}
                value={searchText}
                style={{ width: "100%" }}
            >
                <Input placeholder="Thêm người..." />
            </AutoComplete>

            {/* Danh sách người có quyền truy cập */}
            <div className="mt-6" style={{
                maxHeight: '350px',  // Giới hạn chiều cao của thẻ div
                overflowY: 'auto',   // Thêm thanh cuộn khi chiều cao vượt quá maxHeight
                scrollbarWidth: 'thin',
            }}>
                <Text strong>Những người có quyền truy cập</Text>
                {listUserShare.map((user) => (
                    <Row align="middle" className="mt-4" key={user.userId} >
                        <Col>
                            <Avatar src={user.avatar} icon={!user.avatar && <UserOutlined />} />
                        </Col>
                        <Col className="ml-3">
                            <Text strong>
                                {user.fullName} {user.isOwner && "(you)"}
                            </Text>
                            <div className="text-gray-500">
                                {user.email || user.username || user.googleEmail || user.facebookEmail}
                            </div>
                        </Col>
                        <Col className="ml-auto mr-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            {user.isOwner ? (
                                <Text className="text-gray-500">Chủ sở hữu</Text>
                            ) : (
                                <div style={{ margin: 0 }}>
                                    <Select
                                        value={user.isEdited ? "edit" : "view"}
                                        onChange={(value) => {
                                            if (value === "delete") {
                                                handleRemoveUser(user.userId);
                                            } else {
                                                handleRoleChange(value === "edit", user.userId);
                                            }
                                        }}
                                    >
                                        <Select.Option value="edit">Được chỉnh sửa</Select.Option>
                                        <Select.Option value="view">Người xem</Select.Option>
                                        <Select.Option value="delete">
                                            <span style={{ color: "red" }}>Xóa</span>
                                        </Select.Option>
                                    </Select>
                                </div>
                            )}
                        </Col>
                    </Row>
                ))}
            </div>
        </Modal>
    );
};

export default ShareModal;