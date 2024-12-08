import React, { useState, useEffect } from "react";
import { message, Spin, Modal, Button } from 'antd';
import { PlanbookTemplateDetail, getPlanbookById, exportPlanbookToWord, exportPlanbookToPdf } from "@/data/academy-staff/PlanbookData";
import { MessageOutlined, LikeOutlined } from '@ant-design/icons';
import { getActiveUserPackageByUserId, ServicePackage } from "@/data/manager/UserPackageDatas";
import { getUserId } from "@/data/apiClient";
import PackageDetailPage from "@/pages/teacher/User/PackageDetailPage";

interface PlanbookDetailProps {
    planbookId: string;
    isVisible: boolean;
    onClose: () => void;
    isLibrary: boolean;
}

const PlanbookDetailForm: React.FC<PlanbookDetailProps> = ({ planbookId, isVisible, onClose, isLibrary }) => {
    const [planbook, setPlanbook] = useState<PlanbookTemplateDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [service, setService] = useState<ServicePackage>();
    const [showPackageDetail, setShowPackageDetail] = useState(false);

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

    useEffect(() => {
        const fetchUserPackage = async () => {
            const userPackage = await getActiveUserPackageByUserId(getUserId()!);
            setService(userPackage);
        };

        fetchUserPackage();
    }, []);

    const handleExportToWord = async () => {
        if (service?.exportWord) {
            try {
                // Gọi API exportPlanbookToWord để xuất Word
                await exportPlanbookToWord(planbookId);
            } catch (error) {
                console.error('Error exporting planbook to Word:', error);
            }
        } else {
            setShowPackageDetail(true);
        }
    };

    const handleExportToPdf = async (planbookId: string) => {
        if (service?.exportPdf) {
            try {
                // Gọi API exportPlanbookToPdf để xuất PDF
                await exportPlanbookToPdf(planbookId);
            } catch (error) {
                console.error('Error exporting planbook to PDF:', error);
            }
        } else {
            setShowPackageDetail(true);
        }
    };

    const handleOk = () => {
        setShowPackageDetail(false);
    };

    const handleCancel = () => {
        setShowPackageDetail(false);
    };

    const handleLike = () => {
        message.warning('Chức năng này đang được phát triển');
    }

    const handleComment = () => {
        message.warning('Chức năng này đang được phát triển');
    }

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
                                    onClick={handleLike}
                                />
                                <Button
                                    onClick={handleComment}
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
                                <div className="text-base">
                                    <div className="mt-1">
                                        <strong>1. Về kiến thức: </strong>
                                        <p dangerouslySetInnerHTML={{ __html: planbook?.knowledgeObjective ? planbook.knowledgeObjective.replace(/\n/g, '<br/>') : '' }}></p>
                                    </div>
                                    <div className="mt-1">
                                        <strong>2. Về năng lực: </strong>
                                        <p dangerouslySetInnerHTML={{ __html: planbook?.skillsObjective ? planbook.skillsObjective.replace(/\n/g, '<br/>') : '' }}></p>
                                    </div>
                                    <div className="mt-1">
                                        <strong>3. Về phẩm chất: </strong>
                                        <p dangerouslySetInnerHTML={{ __html: planbook?.qualitiesObjective ? planbook.qualitiesObjective.replace(/\n/g, '<br/>') : '' }}></p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-2">
                                <h3 className="text-lg font-bold">II. Thiết bị dạy học và học liệu</h3>
                                <p
                                    className="text-base"
                                    dangerouslySetInnerHTML={{
                                        __html: (planbook?.teachingTools ?? '').replace(/\n/g, '<br/>'),
                                    }}
                                ></p>
                            </div>

                            <div className="mt-2">
                                <h3 className="text-lg font-bold">III. Tiến trình dạy học</h3>
                                {planbook?.activities.map((activity, index) => (
                                    <div key={activity.activityId} className="mt-1 text-base">
                                        <h4 className="font-bold">{`Hoạt động ${index + 1}: ${activity.title}`}</h4>
                                        <div>
                                            <strong>a) Mục tiêu: </strong>
                                            <p
                                                dangerouslySetInnerHTML={{
                                                    __html: activity.objective.replace(/\n/g, '<br/>'),
                                                }}
                                            ></p>
                                        </div>
                                        <div className="mt-1">
                                            <strong>b) Nội dung: </strong>
                                            <p
                                                dangerouslySetInnerHTML={{
                                                    __html: activity.content.replace(/\n/g, '<br/>'),
                                                }}
                                            ></p>
                                        </div>
                                        <div className="mt-1">
                                            <strong>c) Sản phẩm: </strong>
                                            <p
                                                dangerouslySetInnerHTML={{
                                                    __html: activity.product.replace(/\n/g, '<br/>'),
                                                }}
                                            ></p>
                                        </div>
                                        <div className="mt-1">
                                            <strong>d) Tổ chức thực hiện: </strong>
                                            <p
                                                dangerouslySetInnerHTML={{
                                                    __html: activity.implementation.replace(/\n/g, '<br/>'),
                                                }}
                                            ></p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-2 text-base">
                                <h3 className="font-bold">Ghi chú</h3>
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: (planbook?.notes ?? '').replace(/\n/g, '<br/>'),
                                    }}
                                ></p>
                            </div>
                            {
                                !isLibrary && (
                                    <div className="flex gap-2 mt-11 absolute">
                                        <Button
                                            onClick={handleExportToWord}
                                            loading={loading}
                                            style={{
                                                backgroundColor: '#d9d9d9', // Màu xám nhẹ cho "Dữ liệu mẫu"
                                                borderColor: '#d9d9d9', // Viền màu xám giống background
                                                color: '#000', // Chữ màu đen cho dễ đọc
                                            }}
                                            className="hover:bg-gray-500 hover:border-gray-500 hover:text-white"
                                        >
                                            Xuất ra Word
                                        </Button>
                                        <Button
                                            onClick={() => handleExportToPdf(planbookId)}
                                            loading={loading}
                                            style={{
                                                backgroundColor: '#d9d9d9', // Màu xám nhẹ cho "Dữ liệu mẫu"
                                                borderColor: '#d9d9d9', // Viền màu xám giống background
                                                color: '#000', // Chữ màu đen cho dễ đọc
                                            }}
                                            className="hover:bg-gray-500 hover:border-gray-500 hover:text-white"
                                        >
                                            Xuất ra PDF
                                        </Button>
                                    </div>
                                )
                            }

                            <Modal
                                visible={showPackageDetail}
                                onOk={handleOk}
                                onCancel={handleCancel}
                                footer={null}
                                width={800}
                                style={{ top: '10vh' }}
                            >
                                <PackageDetailPage />
                            </Modal >
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

