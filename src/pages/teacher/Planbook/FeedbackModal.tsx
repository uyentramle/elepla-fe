import React, { useEffect, useState } from 'react';
import { Feedback, getFeedbackByPlanbookId, CreateFeedback, submitFeedback, hardDeleteFeedback, UpdateFeedback, updateFeedback, flagComment } from '@/data/academy-staff/FeedbackData';
import { Spin, Input, Button, Rate, message, Dropdown, Menu, Modal, Radio } from 'antd';
import { StarFilled, EditOutlined, DeleteOutlined, EllipsisOutlined, FlagOutlined } from '@ant-design/icons';
import { getUserId } from '@/data/apiClient';

const { TextArea } = Input;

const FeedbackModal: React.FC<{
    planbookId: string, createdBy: string, onFeedbackStatsChange?: (totalComments: number, avgRate: number) => void
}> = ({ planbookId, createdBy, onFeedbackStatsChange }) => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isActiveComment, setIsActiveComment] = useState(false);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null);  // Trạng thái lưu ID của feedback đang chỉnh sửa
    const [editedContent, setEditedContent] = useState<string>('');
    const [editedRating, setEditedRating] = useState<number>(0);
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getFeedbackByPlanbookId(planbookId);
                setFeedbacks(response);

                // Tính toán tổng số bình luận và đánh giá trung bình
                const totalComments = response.length;
                const totalRate = response.reduce((sum, feedback) => sum + feedback.rate, 0);
                const avgRate = totalRate / totalComments || 0;

                // Truyền dữ liệu qua callback prop
                onFeedbackStatsChange?.(totalComments, avgRate);
            } catch (error) {
                console.error('Error fetching feedbacks:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [planbookId, onFeedbackStatsChange, isDeleteModalVisible, editingFeedbackId]);

    const handleFocus = () => {
        setIsActiveComment(true); // Hiển thị nút khi người dùng click vào ô nhập liệu
    };

    const handleCancel = () => {
        setComment(""); // Xóa nội dung bình luận
        setIsActiveComment(false); // Ẩn các nút khi nhấn Hủy
    };

    const handleSend = async () => {
        if (!comment.trim() || rating === 0) {
            return; // Không gửi nếu nội dung bình luận rỗng hoặc chưa chọn sao
        }

        const feedbackData: CreateFeedback = {
            content: comment,
            rate: rating,
            type: "planbook",
            teacherId: getUserId()!,
            planbookId: planbookId,
        };

        try {
            // Gọi API để gửi bình luận
            const success = await submitFeedback(feedbackData);

            if (success) {
                message.success("Đã gửi");

                // Reset trạng thái sau khi gửi thành công
                setComment("");
                setRating(0);
                setIsActiveComment(false);

                // Gọi lại API để cập nhật danh sách feedback
                // setLoading(true);
                const updatedFeedbacks = await getFeedbackByPlanbookId(planbookId);
                setFeedbacks(updatedFeedbacks);

                // Tính toán số lượng và sao trung bình sau khi gửi thành công
                const totalComments = updatedFeedbacks.length;
                const totalRate = updatedFeedbacks.reduce((sum, feedback) => sum + feedback.rate, 0);
                const avgRate = totalRate / totalComments || 0;

                // Gửi giá trị ra ngoài
                onFeedbackStatsChange?.(totalComments, avgRate);
            } else {
                message.error("Gửi bình luận thất bại. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi khi gọi API submitFeedback:", error);
            message.error("Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại sau.");
        }
    };

    const handleMenuClick = async (key: string, feedbackId: string) => {
        const selectedFeedback = feedbacks.find(feedback => feedback.feedbackId === feedbackId);
        switch (key) {
            case "edit":
                setEditingFeedbackId(feedbackId);  // Cập nhật feedbackId để chỉnh sửa
                if (selectedFeedback) {
                    setEditedContent(selectedFeedback.content);
                    setEditedRating(selectedFeedback.rate);
                }
                break;
            case "remove":
                setSelectedFeedback(feedbackId); // Lưu ID Feedback được chọn
                setIsDeleteModalVisible(true); // Hiển thị Modal xác nhận
                break;
            case "report":
                setSelectedFeedback(feedbackId); // Lưu ID Feedback được chọn
                setIsReportModalVisible(true); // Hiển thị Modal báo cáo
                break;
            default:
                break;
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await hardDeleteFeedback(selectedFeedback!);

            if (response) {
                message.success('Đã xóa');
            } else {
                message.error('Xóa thất bại');
            }
        } catch (error) {
            message.error('Có lỗi xảy ra, vui lòng thử lại sau');
        } finally {
            setIsDeleteModalVisible(false); // Đóng Modal
        }
    };

    const handleCancelEdit = () => {
        setEditingFeedbackId(null);  // Hủy chỉnh sửa
    };

    const handleUpdate = async (feedbackId: string) => {
        const updatedFeedback: UpdateFeedback = {
            feedbackId: feedbackId,
            content: editedContent,
            rate: editedRating,
            teacherId: getUserId()!,
            planbookId: planbookId,
            type: "planbook",
        };

        const success = await updateFeedback(updatedFeedback); // Gửi dữ liệu lên API

        if (success) {
            setEditingFeedbackId(null);  // Đặt lại khi chỉnh sửa xong
            message.success("Cập nhật thành công");
        } else {
            message.error("Lưu thay đổi thất bại");
        }
    };

    const handleReportSubmit = async () => {
        const success = await flagComment(selectedFeedback!);

        if (success) {
            message.success("Đã báo cáo");
        } else {
            message.error("Báo cáo thất bại");
        }

        setIsReportModalVisible(false); // Đóng Modal
    }

    return (
        <div
            style={{
                width: "600px", // Chiều rộng cố định của bên phải
                backgroundColor: "#ffffff",
                borderLeft: "1px solid #ddd",
                display: 'flex', // Thêm flexbox để sắp xếp các phần tử
                flexDirection: 'column', // Các phần tử sẽ xếp theo chiều dọc
            }}
        >
            <h2 className="text-lg font-semibold text-center">Bình luận</h2>
            <div className="ml-5 mt-2" style={{ borderBottom: "1px solid #ddd" }}></div>
            {loading ? ( // Hiển thị loading trong khi chờ dữ liệu
                <div className="flex justify-center items-center h-full">
                    <Spin size="large" />
                    <span className="ml-3">Đang tải dữ liệu...</span>
                </div>
            ) : (
                <>
                    {feedbacks.length > 0 ? (
                        <div className="ml-4"
                            style={{
                                maxHeight: '480px',  // Giới hạn chiều cao của thẻ div
                                overflowY: 'auto',   // Thêm thanh cuộn khi chiều cao vượt quá maxHeight
                                scrollbarWidth: 'thin',
                                flexGrow: 1, // Thẻ div sẽ mở rộng theo chiều dọc khi có nhiều bình luận
                            }}
                        >
                            {feedbacks.map((feedback) => (
                                <div key={feedback.feedbackId} className="mt-4">
                                    <div className="flex items-start">
                                        <img
                                            src={feedback.avatar}
                                            className={`w-9 h-9 rounded-full mr-4 border ${!feedback.avatar ? 'bg-gray-300' : ''}`}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-1">
                                                <div className="text-sm font-semibold">{feedback.teacherName}</div>
                                                <div className="text-xs text-gray-500">{new Date(feedback.createdAt).toLocaleString()}</div>
                                            </div>
                                            {editingFeedbackId !== feedback.feedbackId && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <div className="flex">
                                                        {Array.from({ length: 5 }).map((_, index) =>
                                                            index < feedback.rate ? (
                                                                <StarFilled key={index} style={{ color: '#FADB14', fontSize: '10px' }} />
                                                            ) : (
                                                                <StarFilled key={index} style={{ color: '#d9d9d9', fontSize: '10px' }} />
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {editingFeedbackId === feedback.feedbackId ? (
                                                <>
                                                    <Input.TextArea // không cần khai báo Input
                                                        value={editedContent}
                                                        onChange={(e) => setEditedContent(e.target.value)}
                                                        autoSize={{ minRows: 1, maxRows: 3 }}
                                                        className="mt-2"
                                                    />
                                                    <div className="mt-2">
                                                        <Rate
                                                            value={editedRating}
                                                            onChange={(value) => setEditedRating(value)}
                                                            style={{ fontSize: '14px' }}
                                                        />
                                                    </div>
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            onClick={handleCancelEdit}  // Hủy chỉnh sửa
                                                            type="default"  // Nút mặc định (không có màu nổi bật)
                                                            size='small'  // Kích thước nhỏ
                                                            style={{ fontSize: '12px' }}  // Thu nhỏ chữ trong nút
                                                        >
                                                            Hủy
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleUpdate(feedback.feedbackId)}  // Lưu thay đổi
                                                            type="primary"  // Nút chính
                                                            size='small'  // Kích thước nhỏ
                                                            style={{ fontSize: '12px' }}  // Thu nhỏ chữ trong nút
                                                            disabled={!editedContent.trim() || editedRating === 0}  // Vô hiệu hóa nếu không có nội dung hoặc đánh giá
                                                        >
                                                            Lưu
                                                        </Button>
                                                    </div>

                                                </>
                                            ) : (
                                                <p>{feedback.content}</p>
                                            )}
                                        </div>
                                        <Dropdown
                                            overlay={
                                                (getUserId() === feedback.teacherId || createdBy === getUserId()) ? (
                                                    <Menu onClick={({ key }) => handleMenuClick(key, feedback.feedbackId)}>
                                                        {getUserId() === feedback.teacherId && (
                                                            <Menu.Item key="edit" icon={<EditOutlined />}>
                                                                Chỉnh sửa
                                                            </Menu.Item>
                                                        )}
                                                        <Menu.Item key="remove" danger icon={<DeleteOutlined />}>
                                                            Xóa
                                                        </Menu.Item>
                                                    </Menu>
                                                ) : (
                                                    <Menu onClick={({ key }) => handleMenuClick(key, feedback.feedbackId)}>
                                                        <Menu.Item key="report" icon={<FlagOutlined />}>
                                                            Báo cáo vi phạm
                                                        </Menu.Item>
                                                    </Menu>
                                                )
                                            }
                                            trigger={['click']}
                                        >
                                            <Button shape="default" icon={<EllipsisOutlined className="rotate-90" />} className="border-none" />
                                        </Dropdown>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="ml-4"
                            style={{
                                maxHeight: '480px',  // Giới hạn chiều cao của thẻ div
                                overflowY: 'auto',   // Thêm thanh cuộn khi chiều cao vượt quá maxHeight
                                scrollbarWidth: 'thin',
                                flexGrow: 1, // Thẻ div sẽ mở rộng theo chiều dọc khi có nhiều bình luận
                            }}
                        >
                            <p className="text-center text-gray-500 mt-2">Không có bình luận nào.</p>
                        </div>
                    )}

                    {/* Ô nhập bình luận */}
                    <div className="mt-4 p-4 border-t border-gray-300 ml-5">
                        <TextArea
                            placeholder="Nhập bình luận của bạn..."
                            autoSize={{ minRows: 1, maxRows: 3 }}
                            value={comment}
                            onChange={(e) => {
                                const input = e.target.value;
                                if (input.length <= 500) {
                                    setComment(input); // Chỉ cập nhật nếu dưới 200 ký tự
                                }
                            }} // Lưu giá trị nhập vào state
                            onFocus={handleFocus} // Kích hoạt khi người dùng click vào ô nhập liệu
                        />
                        {isActiveComment && (
                            <div className="mt-2 flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <Rate
                                        value={rating}
                                        onChange={(value) => setRating(value)} // Lưu giá trị sao
                                        style={{ fontSize: '16px' }}
                                    // className="flex justify-end"
                                    />
                                    <span className="text-sm text-gray-500">
                                        {comment.length}/500
                                    </span>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button onClick={handleCancel}>Hủy</Button>
                                    <Button
                                        type="primary"
                                        onClick={handleSend}
                                        disabled={!comment.trim() || rating === 0} // Vô hiệu hóa nếu không có bình luận hoặc đánh giá
                                    >
                                        Gửi
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            <Modal
                title="Xác nhận xóa"
                visible={isDeleteModalVisible}
                onOk={handleDeleteConfirm} // Thực hiện xóa khi người dùng nhấn "Đồng ý"
                onCancel={() => setIsDeleteModalVisible(false)} // Đóng Modal nếu người dùng hủy
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }} // Nút Xóa màu đỏ
            >
                <p>Bạn có chắc muốn xóa bình luận này không?</p>
            </Modal>

            <Modal
                title={<div className="text-center w-full">Báo cáo</div>} // Căn giữa tiêu đề
                visible={isReportModalVisible}
                onCancel={() => setIsReportModalVisible(false)} // Đóng Modal
                footer={[
                    <Button key="cancel" onClick={() => setIsReportModalVisible(false)}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => handleReportSubmit()}>
                        Báo cáo vi phạm
                    </Button>,
                ]}
            >
                <p className="font-semibold mb-2">Nội dung có vấn đề gì?</p>
                <p className="mb-2">
                    Chúng tôi sẽ kiểm tra theo tất cả Nguyên tắc cộng đồng, nên bạn đừng lo lắng về việc phải lựa chọn sao cho chính xác nhất.
                </p>
                <Radio.Group className="flex flex-col gap-2">
                    <Radio value="nudity">Nội dung khiêu dâm</Radio>
                    <Radio value="violence">Nội dung bạo lực hoặc phản cảm</Radio>
                    <Radio value="hateSpeech">Nội dung lăng mạ hoặc kích động thù hận</Radio>
                    <Radio value="harassment">Nội dung quấy rối hoặc bắt nạt</Radio>
                    <Radio value="danger">Hành động gây hại hoặc nguy hiểm</Radio>
                    <Radio value="misinformation">Thông tin sai lệch</Radio>
                    <Radio value="children">Nội dung liên quan đến việc ngược đãi trẻ</Radio>
                </Radio.Group>
            </Modal>
        </div>
    );
};

export default FeedbackModal;