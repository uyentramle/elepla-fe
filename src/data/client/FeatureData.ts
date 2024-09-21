import { ReactNode } from 'react';
import { HeartOutlined, ClockCircleOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import React from 'react';

interface FeatureItem {
    id: number;
    name: string;
    icon: ReactNode;
    desc: string;
}

const feature_data: FeatureItem[] = [
    {
        id: 1,
        name: 'Hỗ trợ tận tâm',
        icon: React.createElement(HeartOutlined, { className: "mb-4 text-4xl" }),
        desc: 'Ipsum yorem dolor amet sit elit. Duis at est id leosco for it',
    },
    {
        id: 2,
        name: 'Điều kiện nhiều hơn',
        icon: React.createElement(ClockCircleOutlined, { className: "mb-4 text-4xl" }),
        desc: 'Ipsum yorem dolor amet sit elit. Duis at est id leosco for it',
    },
    {
        id: 3,
        name: 'Giá tốt',
        icon: React.createElement(DollarOutlined, { className: "mb-4 text-4xl" }),
        desc: 'Ipsum yorem dolor amet sit elit. Duis at est id leosco for it',
    },
    {
        id: 4,
        name: 'Nhiều sự lựa chọn',
        icon: React.createElement(CheckCircleOutlined, { className: "mb-4 text-4xl" }),
        desc: 'Ipsum yorem dolor amet sit elit. Duis at est id leosco for it',
    },
];

export default feature_data;
