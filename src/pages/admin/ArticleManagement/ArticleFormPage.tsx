import React, { useEffect, ChangeEvent } from "react";
import { Button, Form, Input, Select, Typography, Upload } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import data_articles, { IArticle } from "@/data/admin/ArticleData";
import categoryData from "@/data/admin/CategoryData";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

const ArticleFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const [formData, setFormData] = React.useState<IArticle>({
        id: "",
        title: "",
        url: "",
        content: "",
        status: "Public",
        thumb: "",
        createdAt: new Date(),
        createdBy: "",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null,
        isDelete: false,
        categoryId: "",
    });
    const [selectedCategories, setSelectedCategories] = React.useState<number[]>([]);

    const navigate = useNavigate();

    // Fetch Article data if editing
    useEffect(() => {
        if (id) {
            const article = data_articles.find((art) => art.id === id);
            if (article) {
                setFormData(article);
                form.setFieldsValue({
                    title: article.title,
                    url: article.url,
                    content: article.content,
                    status: article.status,
                    thumb: article.thumb,
                });
                // setSelectedCategories(article.category || []);
            }
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
    const handleCategoryChange = (value: number[]) => {
        setSelectedCategories(value);
    };

    const handleSubmit = () => {
        const updatedArticle: IArticle = {
            ...formData,
            // category: selectedCategories,
        };

        if (id) {
            // Edit Article logic
            const updatedArticles = data_articles.map((article) =>
                article.id === id ? updatedArticle : article
            );
            console.log("Updated Articles:", updatedArticles);
        } else {
            // Add new Article logic
            console.log("New Article:", updatedArticle);
            data_articles.push(updatedArticle);
        }
        navigate(-1);
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
                        <Input
                            id="url"
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
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
                                    value={formData.content}
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