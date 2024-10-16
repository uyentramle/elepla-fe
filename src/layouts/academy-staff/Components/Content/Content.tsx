import { Content } from 'antd/es/layout/layout';
import React from 'react';

export default function MyContent({ children }: { children: React.ReactNode }) {
    return (
        <Content className="py-10">
            <main className="h-full p-8">{children}</main>
        </Content>
    );
}
