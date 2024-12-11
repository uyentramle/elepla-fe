import React, { useState, useEffect } from "react";
import { message, Spin } from 'antd';
import { PlanbookTemplateDetail, getPlanbookById } from "@/data/academy-staff/PlanbookData";
import { useParams } from 'react-router-dom';
import { getUserId } from "@/data/apiClient";

const PlanbookDetailPage: React.FC = () => {
    const { id: planbookId } = useParams<{ id: string }>();
    const [planbook, setPlanbook] = useState<PlanbookTemplateDetail | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // console.log('planbookId', planbookId);
                const response = await getPlanbookById(planbookId!);
                // Kiểm tra nếu response có dữ liệu hợp lệ
                if (!response || !response.planbookId || Object.keys(response).length === 0) {
                    setPlanbook(null); // Nếu không có dữ liệu hợp lệ, set planbook thành null
                } else {
                    // Kiểm tra thêm điều kiện cho trường hợp isPublic === false
                    if (response.isPublic === false && response.createdBy !== getUserId()) {
                        setPlanbook(null); // Nếu isPublic là false và không phải user hiện tại, set planbook thành null
                    } else {
                        setPlanbook(response); // Lưu dữ liệu vào state nếu có
                    }
                }
            } catch (error) {
                message.error('Không thể tải dữ liệu, vui lòng thử lại sau');
            } finally {
                setLoading(false); // Kết thúc loading
            }
        };

        fetchData();
    }, [planbookId]);

    return (
        <div className="flex mt-5">
            <div className="container mx-auto px-14 py-10"
                style={{
                    maxWidth: '800px',
                    backgroundColor: 'white',
                }}
            >
                {loading ? ( // Hiển thị loading trong khi chờ dữ liệu
                    <div className="flex justify-center items-center h-full">
                        <Spin size="large" />
                        <span className="ml-3">Đang tải dữ liệu...</span>
                    </div>
                ) : planbook ? (
                    <>
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
                    </>
                ) : ( // Hiển thị thông báo nếu không có dữ liệu
                    <div className="flex justify-center items-center">
                        <p>Không có dữ liệu để hiển thị.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlanbookDetailPage;