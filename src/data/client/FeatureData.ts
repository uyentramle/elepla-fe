import { ReactNode } from 'react';
import { HeartOutlined, ClockCircleOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import React from 'react';

interface FeatureItem {
    id: number;
    name: string;
    icon: ReactNode;
    desc: string | null;
}

const feature_data: FeatureItem[] = [
    {
        id: 1,
        name: 'Kho kế hoạch bài giảng phong phú',
        icon: React.createElement(HeartOutlined, { className: "mb-4 text-4xl" }),
        desc: 'Hàng nghìn kế hoạch bài giảng được thiết kế đa dạng, đáp ứng mọi nhu cầu giảng dạy của bạn.',
    },
    {
        id: 2,
        name: 'Tiết kiệm thời gian',
        icon: React.createElement(ClockCircleOutlined, { className: "mb-4 text-4xl" }),
        desc: 'Truy cập nhanh chóng và dễ dàng vào tài liệu sẵn có, giúp giảm thiểu thời gian chuẩn bị kế hoạch bài giảng.',
    },
    {
        id: 3,
        name: 'Chi phí phù hợp',
        icon: React.createElement(DollarOutlined, { className: "mb-4 text-4xl" }),
        desc: 'Dịch vụ chất lượng với mức giá hợp lý, phù hợp với ngân sách của mọi giáo viên.',
    },
    {
        id: 4,
        name: 'Nhiều sự lựa chọn',
        icon: React.createElement(CheckCircleOutlined, { className: "mb-4 text-4xl" }),
        desc: 'Cung cấp hàng loạt tùy chọn tài liệu và nội dung, giúp bạn dễ dàng tìm thấy giải pháp phù hợp nhất.',
    },
];

export default feature_data;
