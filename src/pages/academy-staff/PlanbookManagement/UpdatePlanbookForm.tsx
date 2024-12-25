import React, { useEffect, useState, useRef } from "react";
import { Form, Button, Switch, message, Spin, Input, Collapse, InputRef, Modal } from "antd";
import { UpdatePlanbookTemplate, updatePlanbookTemplate, getPlanbookById, mapPlanbookDetailToUpdateTemplate, PlanbookTemplateDetail } from "@/data/academy-staff/PlanbookData";

const { TextArea } = Input;

interface UpdatePlanbookProps {
    planbookId: string;
    isVisible: boolean;
    onClose: () => void;
}

const UpdatePlanbookForm: React.FC<UpdatePlanbookProps> = ({ planbookId, isVisible, onClose }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [planbook, setPlanbook] = useState<PlanbookTemplateDetail | null>(null);
    const [inputWidth, setInputWidth] = useState(200); // Chiều rộng ban đầu của input
    const [subjectWidth, setSubjectWidth] = useState(80); // Chiều rộng ban đầu của input
    const [classWidth, setClassWidth] = useState(80); // Chiều rộng ban đầu của input
    const inputRef = useRef<InputRef>(null); // Tham chiếu đến input DOM element
    const subjectRef = useRef<InputRef>(null); // Tham chiếu đến input môn học
    const classRef = useRef<InputRef>(null); // Tham chiếu đến input lớp

    // Hàm để tính toán chiều rộng của ô nhập liệu dựa trên nội dung
    const updateInputWidth = () => {
        if (inputRef.current) {
            const inputLength = inputRef.current.input?.value.length || 0; // Lấy độ dài nội dung trong input
            const newWidth = inputLength < 10 ? 200 : inputLength * 10.5; // Đặt chiều rộng dựa trên độ dài
            // setInputWidth(newWidth); // Cập nhật chiều rộng
            setInputWidth(Math.min(newWidth, 600));
        }
    };

    const updateSubjectWidth = () => {
        if (subjectRef.current) {
            const inputLength = subjectRef.current.input?.value.length || 0;
            const newWidth = inputLength < 10 ? 80 : inputLength * 8;
            setSubjectWidth(Math.min(newWidth, 150));
        }
    }

    const updateClassWidth = () => {
        if (classRef.current) {
            const inputLength = classRef.current.input?.value.length || 0;
            const newWidth = inputLength < 10 ? 80 : inputLength * 8;
            setClassWidth(Math.min(newWidth, 150));
        }
    }

    // Hàm tính toán chiều rộng của ô nhập liệu khi dữ liệu được load vào
    useEffect(() => {
        if (planbook?.title) {
            const inputLength = planbook.title.length || 0;
            const newWidth = inputLength < 10 ? 200 : inputLength * 10; // Tính toán chiều rộng dựa trên độ dài
            setInputWidth(newWidth); // Cập nhật chiều rộng ngay khi dữ liệu được tải
        }

        if (planbook?.subject) {
            const inputLength = planbook.subject.length || 0;
            const newWidth = inputLength < 10 ? 80 : inputLength * 10;
            setSubjectWidth(newWidth);
        }

        if (planbook?.className) {
            const inputLength = planbook.className.length || 0;
            const newWidth = inputLength < 10 ? 80 : inputLength * 10;
            setSubjectWidth(newWidth);
        }
    }, [planbook]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const detail = await getPlanbookById(planbookId); // API lấy chi tiết planbook
                setPlanbook(detail);
                const mappedData = mapPlanbookDetailToUpdateTemplate(detail); // Chuyển đổi dữ liệu
                form.setFieldsValue(mappedData); // Đổ dữ liệu vào form
            } catch (error) {
                message.error("Không thể tải dữ liệu kế hoạch bài dạy.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [planbookId, form]);

    const handleUpdate = async (values: UpdatePlanbookTemplate) => {
        setLoading(true);
        try {
            const success = await updatePlanbookTemplate(values);
            if (success) {
                message.success("Cập nhật thành công!");
                // onClose(); // Đóng modal sau khi cập nhật thành công
            } else {
                message.error("Cập nhật thất bại!");
            }
        } catch (error) {
            message.error("Đã xảy ra lỗi khi cập nhật.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={isVisible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose} loading={loading}>
                    Hủy
                </Button>,
                <Button
                    key="update"
                    type="primary"
                    loading={loading}
                    onClick={() => form.submit()} // Gọi submit form từ nút này
                >
                    Cập nhật
                </Button>,
            ]
            }
            width={850} // Điều chỉnh chiều rộng modal
            style={{ top: '5vh' }}
        >
            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <Spin size="large" />
                        <span className="ml-3">Đang tải dữ liệu...</span>
                    </div>
                ) : (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleUpdate}
                        initialValues={{
                            ...planbook, // Dữ liệu mặc định từ planbook
                        }}
                    >
                        {/* Thông tin trường và giáo viên */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-semibold">Trường:</span>
                                    <Form.Item
                                        name="schoolName"
                                        rules={[{ required: true, message: '' }]}
                                        style={{ marginBottom: 0 }} // Loại bỏ margin dưới Form.Item
                                    >
                                        <Input
                                            placeholder="Nhập tên trường"
                                            style={{
                                                fontSize: "14px",
                                                padding: "4px 8px",
                                                width: "200px",
                                                fontWeight: "600", // semibold
                                            }}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-semibold">Tổ:</span>
                                    <span className="text-lg font-semibold">...</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold">Họ và tên giáo viên</p>
                                <Form.Item
                                    name="teacherName"
                                    rules={[{ required: true, message: '' }]}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Input
                                        placeholder="Nhập tên giáo viên"
                                        style={{
                                            fontSize: "14px",
                                            padding: "4px 8px",
                                            width: "200px",
                                            textAlign: "right",
                                            fontWeight: "600", // semibold
                                        }}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                        {/* Tên bài dạy và thông tin môn học */}
                        <div className="text-center mb-6">
                            <div className="flex items-center justify-center space-x-2">
                                {/* Tên bài dạy */}
                                <h1 className="text-lg font-bold">Tên bài dạy:</h1>
                                {/* Ô nhập liệu */}
                                <Form.Item name="planbookId" noStyle>
                                    <Input type="hidden" value={planbook?.planbookId} />
                                </Form.Item>
                                <Form.Item
                                    name="title"
                                    initialValue={planbook?.title}
                                    rules={[{ required: true, message: 'Vui lòng nhập tên bài dạy' }]}
                                >
                                    <Input
                                        ref={inputRef} // Gán ref cho Input
                                        style={{
                                            fontSize: '17px',
                                            fontWeight: 'bold',
                                            borderRadius: '8px',
                                            paddingLeft: '10px',
                                            marginTop: '25px',
                                            width: `${inputWidth}px`, // Chiều rộng thay đổi tự động
                                            transition: 'width 0.3s ease', // Hiệu ứng chuyển động mượt mà
                                        }}
                                        onChange={updateInputWidth} // Cập nhật chiều rộng mỗi khi người dùng thay đổi
                                    />
                                </Form.Item>
                            </div>
                            {/* <p className="text-base">{`Môn học: ${planbook?.subject || "..."}, Lớp: ${planbook?.className || "..."}`}</p> */}
                            <div className="flex items-center justify-center">
                                {/* Môn học */}
                                <span className="text-base mr-1">Môn học:</span>
                                <Form.Item
                                    name="subject"
                                    // rules={[{ required: true, message: "Vui lòng nhập tên môn học" }]}
                                    rules={[{ required: true, message: '' }]}  // Kiểm tra trường hợp không nhập, không hiển thị message lỗi
                                    style={{ marginBottom: 0 }} // Loại bỏ margin để tránh khoảng cách thừa
                                >
                                    <Input
                                        ref={subjectRef} // Gán ref cho Input
                                        placeholder="Nhập môn học"
                                        style={{
                                            fontSize: "14px",
                                            padding: "4px 8px",
                                            // width: "80px", // Đặt chiều rộng hợp lý
                                            width: `${subjectWidth}px`, // Chiều rộng thay đổi tự động
                                            transition: 'width 0.3s ease', // Hiệu ứng chuyển động mượt mà
                                        }}
                                        onChange={updateSubjectWidth} // Cập nhật chiều rộng mỗi khi người dùng thay đổi
                                    />
                                </Form.Item>
                                {/* Dấu phẩy */}
                                <span className="text-base mr-1">, Lớp:</span>
                                {/* Lớp */}
                                <Form.Item
                                    name="className"
                                    rules={[{ required: true, message: '' }]}
                                    style={{ marginBottom: 0 }} // Loại bỏ margin để tránh khoảng cách thừa
                                >
                                    <Input
                                        ref={classRef} // Gán ref cho Input
                                        placeholder="Nhập lớp"
                                        style={{
                                            fontSize: "14px",
                                            padding: "4px 8px",
                                            // width: "80px", // Đặt chiều rộng hợp lý
                                            width: `${classWidth}px`, // Chiều rộng thay đổi tự động
                                            transition: 'width 0.3s ease', // Hiệu ứng chuyển động mượt mà
                                        }}
                                        onChange={updateClassWidth}
                                    />
                                </Form.Item>
                            </div>
                            {/* <p className="text-base">{`Thời gian thực hiện: (${planbook?.durationInPeriods || "0"} tiết)`}</p> */}
                            <div className="text-base mt-1">
                                <p className="inline-block">Thời gian thực hiện: (</p>
                                <Form.Item
                                    name="durationInPeriods"
                                    initialValue={planbook?.durationInPeriods || 0}
                                    rules={[{ required: true, message: 'Vui lòng nhập số tiết' }]}
                                    style={{ display: 'inline-block', width: 'auto' }}
                                >
                                    <Input
                                        type="number"
                                        min={1} // Đặt giá trị tối thiểu là 1 tiết
                                        max={9} // Đặt giá trị tối đa là 100 tiết
                                        className="w-12 text-center border rounded-md"
                                        placeholder="1"
                                        style={{ marginTop: '-5px' }}
                                    />
                                </Form.Item>
                                <span className="inline-block ml-1">tiết)</span>
                            </div>
                        </div>
                        {/* Mục tiêu */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold">I. Mục tiêu</h3>
                            {/* Về kiến thức */}
                            <Form.Item
                                label={<span className="font-bold text-base">1. Về kiến thức</span>}
                                name="knowledgeObjective"
                                rules={[{ required: true, message: "Vui lòng nhập mục tiêu về kiến thức" }]} // Đặt luật bắt buộc nhập
                            >
                                <TextArea
                                    placeholder="Nhập mục tiêu về kiến thức"
                                    autoSize // Kích thước tự động điều chỉnh theo nội dung
                                    style={{
                                        fontSize: "14px",
                                        lineHeight: "1.5", // Dòng chữ cân đối
                                        padding: "10px",
                                    }}
                                />
                            </Form.Item>
                            {/* Về năng lực */}
                            <Form.Item
                                label={<span className="font-bold text-base">2. Về năng lực</span>}
                                name="skillsObjective"
                                rules={[{ required: true, message: "Vui lòng nhập mục tiêu về năng lực" }]} // Đặt luật bắt buộc nhập
                            >
                                <TextArea
                                    placeholder="Nhập mục tiêu về năng lực"
                                    autoSize
                                    style={{
                                        fontSize: "14px",
                                        lineHeight: "1.5",
                                        padding: "10px",
                                    }}
                                />
                            </Form.Item>
                            {/* Về phẩm chất */}
                            <Form.Item
                                label={<span className="font-bold text-base">3. Về phẩm chất</span>}
                                name="qualitiesObjective"
                                rules={[{ required: true, message: "Vui lòng nhập mục tiêu về phẩm chất" }]} // Đặt luật bắt buộc nhập
                            >
                                <TextArea
                                    placeholder="Nhập mục tiêu về phẩm chất"
                                    autoSize
                                    style={{
                                        fontSize: "14px",
                                        lineHeight: "1.5",
                                        padding: "10px",
                                    }}
                                />
                            </Form.Item>
                        </div>
                        {/* Thiết bị dạy học */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold">II. Thiết bị dạy học và học liệu</h3>
                            <Form.Item name="teachingTools"
                                rules={[{ required: true, message: "Vui lòng nhập thiết bị dạy học và học liệu" }]} // Đặt luật bắt buộc nhập
                            >
                                <TextArea
                                    placeholder="Nhập thiết bị dạy học và học liệu"
                                    autoSize
                                    style={{
                                        fontSize: "14px",
                                        lineHeight: "1.5",
                                        padding: "10px",
                                    }}
                                />
                            </Form.Item>
                        </div>
                        {/* Tiến trình dạy học */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold">III. Tiến trình dạy học</h3>
                            <Form.List name="activities">
                                {(fields, { add, remove }) => (
                                    <>
                                        <Collapse>
                                            {fields.map((field, index) => (
                                                <Collapse.Panel
                                                    header={
                                                        <h4 className="font-bold">{`Hoạt động ${index + 1}: ${planbook?.activities[index]?.title || "Chưa có tiêu đề"}`}</h4>
                                                    }
                                                    key={planbook?.activities[index]?.activityId || `activity-${index}`}
                                                >
                                                    {/* Tiêu đề */}
                                                    <Form.Item
                                                        label={<strong>Tiêu đề</strong>}
                                                        name={[field.name, "title"]}
                                                        initialValue={planbook?.activities[index]?.title || ""}
                                                        rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                                                    >
                                                        <Input placeholder="Nhập tiêu đề hoạt động" />
                                                    </Form.Item>
                                                    {/* Mục tiêu */}
                                                    <Form.Item
                                                        label={<strong>a) Mục tiêu</strong>}
                                                        name={[field.name, "objective"]}
                                                        initialValue={planbook?.activities[index]?.objective || ""}
                                                        rules={[{ required: true, message: "Vui lòng nhập mục tiêu" }]}
                                                    >
                                                        <TextArea
                                                            placeholder="Nhập mục tiêu"
                                                            autoSize
                                                            style={{
                                                                fontSize: "14px",
                                                                lineHeight: "1.5",
                                                                padding: "10px",
                                                            }}
                                                        />
                                                    </Form.Item>
                                                    {/* Nội dung */}
                                                    <Form.Item
                                                        label={<strong>b) Nội dung</strong>}
                                                        name={[field.name, "content"]}
                                                        initialValue={planbook?.activities[index]?.content || ""}
                                                        rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
                                                    >
                                                        <TextArea
                                                            placeholder="Nhập nội dung"
                                                            autoSize
                                                            style={{
                                                                fontSize: "14px",
                                                                lineHeight: "1.5",
                                                                padding: "10px",
                                                            }}
                                                        />
                                                    </Form.Item>
                                                    {/* Sản phẩm */}
                                                    <Form.Item
                                                        label={<strong>c) Sản phẩm</strong>}
                                                        name={[field.name, "product"]}
                                                        initialValue={planbook?.activities[index]?.product || ""}
                                                        rules={[{ required: true, message: "Vui lòng nhập sản phẩm" }]}
                                                    >
                                                        <TextArea
                                                            placeholder="Nhập sản phẩm"
                                                            autoSize
                                                            style={{
                                                                fontSize: "14px",
                                                                lineHeight: "1.5",
                                                                padding: "10px",
                                                            }}
                                                        />
                                                    </Form.Item>
                                                    {/* Tổ chức thực hiện */}
                                                    <Form.Item
                                                        label={<strong>d) Tổ chức thực hiện</strong>}
                                                        name={[field.name, "implementation"]}
                                                        initialValue={planbook?.activities[index]?.implementation || ""}
                                                        rules={[{ required: true, message: "Vui lòng nhập cách tổ chức thực hiện" }]}
                                                    >
                                                        <TextArea
                                                            placeholder="Nhập cách tổ chức thực hiện"
                                                            autoSize
                                                            style={{
                                                                fontSize: "14px",
                                                                lineHeight: "1.5",
                                                                padding: "10px",
                                                            }}
                                                        />
                                                    </Form.Item>
                                                    <Button type="default" danger onClick={() => remove(field.name)} style={{ marginTop: '10px' }}>
                                                        Xóa hoạt động
                                                    </Button>
                                                </Collapse.Panel>
                                            ))}
                                        </Collapse>
                                        <Button type="dashed" onClick={() => add()} style={{ marginTop: '20px' }}>
                                            Thêm hoạt động
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                        </div>
                        {/* Ghi chú */}
                        <div className="mb-6">
                            <h3 className="text-base font-bold">Ghi chú</h3>
                            <Form.Item name="notes">
                                <TextArea
                                    placeholder="Nhập ghi chú"
                                    autoSize // Tự động điều chỉnh chiều cao theo nội dung
                                    style={{
                                        fontSize: "14px",
                                        lineHeight: "1.5",
                                        padding: "10px",
                                    }}
                                />
                            </Form.Item>
                        </div>
                        {/* Công khai */}
                        <Form.Item name="isPublic" valuePropName="checked">
                            <Switch checkedChildren="Công khai" unCheckedChildren="Riêng tư" />
                        </Form.Item>
                    </Form>
                )}
            </div>
        </Modal>
    );
};

export default UpdatePlanbookForm;