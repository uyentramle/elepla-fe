import React, { useState, useEffect } from "react";
import { message, Spin, Modal, Button } from 'antd';
import { PlanbookTemplateDetail, getPlanbookById } from "@/data/academy-staff/PlanbookData";
import { MessageOutlined, LikeOutlined } from '@ant-design/icons';

interface PlanbookDetailProps {
    planbookId: string;
    isVisible: boolean;
    onClose: () => void;
}

const PlanbookDetailForm: React.FC<PlanbookDetailProps> = ({ planbookId, isVisible, onClose }) => {
    const [planbook, setPlanbook] = useState<PlanbookTemplateDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [isFirstModalVisible, setIsFirstModalVisible] = useState(false);
    const [isSecondModalVisible, setIsSecondModalVisible] = useState(false);
    const toggleSecondModal = () => {
        setIsFirstModalVisible(!isFirstModalVisible);
        setIsSecondModalVisible(!isSecondModalVisible);
    };

    // const onCloseSecondModal = () => {
    //     setIsSecondModalVisible(false);
    // };


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await getPlanbookById(planbookId);
                setPlanbook(response);
            } catch (error) {
                message.error('Không thể tải dữ liệu, vui lòng thử lại sau');
            } finally {
                setLoading(false); // Kết thúc loading
            }
        };
        fetchData();
    }, [planbookId]);

    return (
        <div>
            <Modal
                // title="Chi tiết Planbook"
                visible={isVisible}
                onCancel={onClose}
                footer={[
                    <Button key="close" onClick={onClose}>
                        Đóng
                    </Button>,
                ]}
                width={800} // Điều chỉnh chiều rộng modal
                style={{ top: '5vh' }}
            >
                <div className="container mx-auto px-4 py-8">
                    {loading ? ( // Hiển thị loading trong khi chờ dữ liệu
                        <div className="flex justify-center items-center h-full">
                            <Spin size="large" />
                            <span className="ml-3">Đang tải dữ liệu...</span>
                        </div>
                    ) : (
                        <>
                            <div
                                style={{
                                    position: 'fixed', // Đặt thẻ cố định trên màn hình
                                    top: '400px',       // Vị trí từ trên xuống
                                    right: '300px',     // Vị trí từ phải qua
                                    zIndex: 999,        // Đảm bảo thẻ nằm trên tất cả các thành phần khác
                                    display: 'flex',    // Sử dụng Flexbox để căn chỉnh các nút
                                    flexDirection: 'column', // Sắp xếp các thẻ theo chiều dọc
                                    gap: '12px',         // Khoảng cách giữa các nút
                                }}
                            >
                                <Button
                                    icon={<LikeOutlined style={{ fontSize: '30px' }} />}
                                    shape="circle"
                                    style={{
                                        border: 'none',
                                        backgroundColor: 'white',
                                        width: '60px',
                                        height: '60px',
                                    }}
                                />
                                <Button
                                    onClick={toggleSecondModal}
                                    icon={<MessageOutlined style={{ fontSize: '30px' }} />}
                                    shape="circle"
                                    style={{
                                        border: 'none',
                                        backgroundColor: 'white',
                                        width: '60px',
                                        height: '60px',
                                    }}
                                />
                            </div>

                            <div className="flex justify-between mb-12">
                                <div>
                                    <p className="text-base font-semibold">
                                        Trường {planbook?.schoolName ? planbook.schoolName : "Trường: ..."}
                                    </p>
                                    <p className="text-base font-semibold">Tổ: ...</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-base font-semibold">Họ và tên giáo viên</span>
                                    <p className="text-base font-semibold">{planbook?.teacherName ? planbook.teacherName : "..."}</p>
                                </div>
                            </div>

                            <div className="mt-4 text-center">
                                <h1 className="text-lg font-bold uppercase">{`Tên bài dạy: ${planbook?.title}`}</h1>
                                <p className="text-base">{`Môn học: ${planbook?.subject}, Lớp: ${planbook?.className ? planbook.className : "..."}`}</p>
                                <p className="text-base">{`Thời gian thực hiện: (${planbook?.durationInPeriods} tiết)`}</p>
                            </div>
                            <div className="mt-6">
                                <h3 className="text-lg font-bold">I. Mục tiêu</h3>
                                <div className="mt-1 text-base">
                                    <strong>1. Về kiến thức: </strong>
                                    <p>{planbook?.knowledgeObjective}</p>
                                    <strong>2. Về năng lực: </strong>
                                    <p>{planbook?.skillsObjective}</p>
                                    <strong>3. Về phẩm chất: </strong>
                                    <p>{planbook?.qualitiesObjective}</p>
                                </div>
                            </div>
                            <div className="mt-2">
                                <h3 className="text-lg font-bold">II. Thiết bị dạy học và học liệu</h3>
                                <p className="mt-1 text-base">{planbook?.teachingTools}</p>
                            </div>
                            <div className="mt-2">
                                <h3 className="text-lg font-bold">III. Tiến trình dạy học</h3>
                                {planbook?.activities.map((activity, index) => (
                                    <div key={activity.activityId} className="mt-1 text-base">
                                        <h4 className="font-bold">{`Hoạt động ${index + 1}: ${activity.title}`}</h4>
                                        <div>
                                            <strong>a) Mục tiêu: </strong>
                                            <p>{activity.objective}</p>
                                        </div>
                                        <div>
                                            <strong>b) Nội dung: </strong>
                                            <p>{activity.content}</p>
                                        </div>
                                        <div>
                                            <strong>c) Sản phẩm: </strong>
                                            <p>{activity.product}</p>
                                        </div>
                                        <div>
                                            <strong>d) Tổ chức thực hiện: </strong>
                                            <p>{activity.implementation}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2 text-base ">
                                <h3 className="font-bold">Ghi chú</h3>
                                <p>{planbook?.notes}</p>
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            {/* Modal thứ hai (nằm bên cạnh modal đầu tiên) */}
            {/* {isSecondModalVisible && (
        <div
          style={{
            position: 'absolute',
            top: '5vh',
            left: '50vw', // Đặt modal thứ hai ở bên phải của modal đầu tiên
            width: '800px',
            padding: '20px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            zIndex: 998, // Đảm bảo modal này không che khuất modal đầu tiên
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3>Đây là modal thứ hai</h3>
          <Button onClick={() => setIsSecondModalVisible(false)}>Đóng Modal Thứ Hai</Button>
        </div>
      )} */}
        </div>
    );
}

export default PlanbookDetailForm;