import React, { useEffect, ChangeEvent } from "react";
import { Button, Form, Input, Select, Typography, Upload } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import categoryData from "@/data/admin/CategoryData";
import { UploadOutlined } from "@ant-design/icons";
import {
    getArticleById,
    createArticle,
    updateArticle,
    ICreateArticle,
    IUpdateArticle
} from '@/data/admin/ArticleData';

const { Title } = Typography;
const { Option } = Select;

const ArticleFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const [formData, setFormData] = React.useState<ICreateArticle | IUpdateArticle>({
        id: "",
        title: "",
        slug: "",
        content: "",
        status: "Public",
        thumb: "",
        categories: [],
    });
    const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);

    const navigate = useNavigate();

    // Fetch Article data if editing
    useEffect(() => {
        if (id) {
            (async () => {
                const article = await getArticleById(id);
                if (article) {
                    setFormData({
                        ...article,
                        categories: article.categories || [],
                    });
                    form.setFieldsValue({
                        id: article.id,
                        title: article.title,
                        slug: article.slug,
                        content: article.content,
                        status: article.status,
                        thumb: article.thumb,
                    });
                }
            })();
        }
    }, [id, form]);

    // Handle form input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle changes in the ReactQuill editor
    const handleContentChange = (value: string) => {
        setFormData((prevState) => ({
            ...prevState,
            content: value,
        }));
    };

    // Handle file changes
    const handleFileChange = (info: any) => {
        const thumb = info.fileList.length > 0 ? info.fileList[0].originFileObj : "";
        setFormData((prevState) => ({
            ...prevState,
            thumb: thumb,
        }));
    };

    // Handle category changes
    const handleCategoryChange = (value: string[]) => {
        setSelectedCategories(value);
    };

    const handleSubmit = async () => {
        const updatedArticle: ICreateArticle | IUpdateArticle = {
            ...formData,
            categories: selectedCategories,
        };

        try {
            if (id) {
                const success = await updateArticle({
                    id: id,
                    ...updatedArticle,
                } as IUpdateArticle);

                if (success) {
                    console.log("Article updated successfully");
                } else {
                    console.error("Failed to update the article");
                }
            } else {
                const success = await createArticle(updatedArticle as ICreateArticle);

                if (success) {
                    console.log("Article created successfully");
                } else {
                    console.error("Failed to create the article");
                }
            }
            navigate(-1);
        } catch (error) {
            console.error("Error handling submit:", error);
        }
    };

    return (
        <>
            <Title level={2} className="my-4">{id ? "Chỉnh sửa bài viết" : "Bài viết mới"}</Title>

            <Form
                form={form}
                layout="vertical"
                className="flex flex-wrap"
                onFinish={handleSubmit}
            >
                <div className="w-1/2 px-4">
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
                    >
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Slug"
                        name="url"
                    >
                        {/* <Input
                            id="slug"
                            name="slug"
                            value={formData.slug || ""}
                            onChange={handleChange}
                            className="w-full"
                        /> */}
                        <Input
                            id="slug"
                            name="slug"
                            value={formData.slug || ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                const formattedValue = value
                                    .toLowerCase()
                                    .replace(/ /g, '-')
                                    .normalize('NFD')
                                    .replace(/[\u0300-\u036f]/g, '');
                                setFormData((prevState) => ({
                                    ...prevState,
                                    slug: formattedValue,
                                }));
                            }}
                            className="w-full"
                        />
                    </Form.Item>
                </div>

                <div className="flex w-full px-4">
                    <div className="w-2/3 mr-10">
                        <div className="mb-4 pb-4">
                            <Form.Item
                                label="Nội dung"
                                name="content"
                            >
                                <ReactQuill
                                    value={formData.content || ""}
                                    onChange={handleContentChange}
                                    className="h-80 mb-4"
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="w-1/3">
                        <div className="pb-4">
                            <Form.Item
                                label="Trạng thái"
                                name="status"
                            >
                                <Select
                                    placeholder="Chọn trạng thái"
                                    value={formData.status}
                                    onChange={(value) => setFormData({ ...formData, status: value })}
                                >
                                    <Option value="Draft">Nháp</Option>
                                    <Option value="Public">Công khai</Option>
                                    <Option value="Private">Riêng tư</Option>
                                    <Option value="Trash">Thùng rác</Option>
                                </Select>
                            </Form.Item>
                        </div>

                        <div className="pb-4">
                            <Form.Item label="Danh mục" name="category">
                                <Select
                                    mode="multiple"
                                    placeholder="Chọn danh mục"
                                    value={selectedCategories}
                                    onChange={handleCategoryChange}
                                >
                                    {categoryData.map((category) => (
                                        <Option key={category.id} value={category.id}>
                                            {category.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>

                        <div className="pb-4">
                            <Form.Item
                                label="Hình đại diện"
                                name="thumb"
                            >
                                <Upload
                                    name="thumbnail"
                                    listType="picture"
                                    beforeUpload={() => false}
                                    onChange={handleFileChange}
                                >
                                    <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                                </Upload>
                                {formData.thumb && typeof formData.thumb !== 'string' && (
                                    <img src={URL.createObjectURL(formData.thumb)} alt="Thumbnail" className="mt-2" style={{ width: '100%' }} />
                                )}
                            </Form.Item>
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-center pt-4">
                    <Form.Item>
                        <div className="flex space-x-4">
                            <Button type="primary" htmlType="submit">
                                {id ? "Cập nhật" : "Thêm mới"}
                            </Button>
                            <Button type="default" onClick={() => navigate(-1)}>
                                Quay lại
                            </Button>
                        </div>
                    </Form.Item>
                </div>

            </Form>
        </>
    );
};

export default ArticleFormPage;