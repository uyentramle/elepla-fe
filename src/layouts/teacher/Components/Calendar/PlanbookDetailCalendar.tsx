import React, { useState, useEffect } from "react";
import { message, Spin, Modal, Button } from 'antd';
import { PlanbookTemplateDetail, getPlanbookById, exportPlanbookToWord, exportPlanbookToPdf } from "@/data/academy-staff/PlanbookData";
import { getActiveUserPackageByUserId, ServicePackage } from "@/data/manager/UserPackageDatas";
import { getUserId } from "@/data/apiClient";
import PackageDetailPage from "@/pages/teacher/User/PackageDetailPage";

interface PlanbookDetailProps {
    planbookId: string;
    isVisible: boolean;
    onClose: () => void;
    isLibrary: boolean;
}

const PlanbookDetailCalendar: React.FC<PlanbookDetailProps> = ({ planbookId, isVisible, onClose, isLibrary }) => {
    const [planbook, setPlanbook] = useState<PlanbookTemplateDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [service, setService] = useState<ServicePackage>();
    const [isShowPackageDetail, setIsShowPackageDetail] = useState(false);
    const [isRightVisible, setIsRightVisible] = useState(false); // Trạng thái hiển thị bên phải
    const [modalWidth, setModalWidth] = useState(800); // Chiều rộng modal mặc định


    useEffect(() => {
        setModalWidth(800); // Chiều rộng mặc định của modal
        setIsRightVisible(false); // Ẩn bên phải khi mở modal

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
    }, [planbookId, planbook?.averageRate, planbook?.commentCount, isVisible]);

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
            setIsShowPackageDetail(true);
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
            setIsShowPackageDetail(true);
        }
    };

    const handlePackageOk = () => {
        setIsShowPackageDetail(false);
    };

    const handlePackageCancel = () => {
        setIsShowPackageDetail(false);
    };


    return (
        <div>
            <Modal
                // title="Chi tiết Planbook"
                visible={isVisible}
                onCancel={onClose}
                footer={[
                    <div key="footer-buttons" className="flex w-full">
                        {
                            !isLibrary && (
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleExportToWord}
                                        loading={loading}
                                        style={{
                                            backgroundColor: '#d9d9d9',
                                            borderColor: '#d9d9d9',
                                            color: '#000',
                                        }}
                                        className="hover:bg-gray-500 hover:border-gray-500 hover:text-white"
                                    >
                                        Xuất ra Word
                                    </Button>
                                    <Button
                                        onClick={() => handleExportToPdf(planbookId)}
                                        loading={loading}
                                        style={{
                                            backgroundColor: '#d9d9d9',
                                            borderColor: '#d9d9d9',
                                            color: '#000',
                                        }}
                                        className="hover:bg-gray-500 hover:border-gray-500 hover:text-white"
                                    >
                                        Xuất ra PDF
                                    </Button>
                                </div>
                            )
                        }
                        <div className="ml-auto flex gap-2">
                            <Button key="close" onClick={onClose}>
                                Đóng
                            </Button>
                        </div>

                    </div>
                ]}
                width={modalWidth} // Điều chỉnh chiều rộng modal
                style={{ top: '4vh' }}
            >
                <div className="flex mt-7">
                    <div className="container mx-auto px-4"
                        style={{
                            maxHeight: 'calc(100vh - 166px)',  // Giới hạn chiều cao của thẻ div
                            overflowY: 'auto',   // Thêm thanh cuộn khi chiều cao vượt quá maxHeight
                            scrollbarWidth: 'thin',
                        }}
                    >
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
                                        top: 'calc(50vh - 150px)', // Tính toán vị trí top động (50% chiều cao màn hình trừ đi 150px)
                                        left: isRightVisible ? '6vw' : '19vw', // Điều chỉnh left dựa trên trạng thái isRightVisible (dùng vw để linh hoạt)
                                        zIndex: 999, // Đảm bảo thẻ nằm trên tất cả các thành phần khác
                                        display: 'flex', // Sử dụng Flexbox để căn chỉnh các nút
                                        flexDirection: 'column', // Sắp xếp các thẻ theo chiều dọc
                                        gap: '12px', // Khoảng cách giữa các nút (dùng vh để tỷ lệ với chiều cao viewport)
                                    }}
                                >
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
                                <Modal
                                    visible={isShowPackageDetail}
                                    onOk={handlePackageOk}
                                    onCancel={handlePackageCancel}
                                    footer={null}
                                    width={800}
                                    style={{ top: '10vh' }}
                                >
                                    <PackageDetailPage />
                                </Modal >
                            </>
                        )}
                    </div>
                    <div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default PlanbookDetailCalendar;

