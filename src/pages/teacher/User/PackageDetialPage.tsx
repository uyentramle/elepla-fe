import React from 'react';
import { Button, Card } from 'antd';
import { CheckCircleOutlined, CrownOutlined, RocketOutlined } from '@ant-design/icons';

const PackageDetialPage: React.FC = () => {

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-center text-3xl font-bold mb-8">Các gói đăng ký</h1>

      <div className="flex justify-center space-x-6">
        {/* Gói miễn phí */}
        <Card
          className="w-80 shadow-lg"
          title="Gói miễn phí"
          bordered={false}
          style={{ textAlign: 'center' }}
        >
          <div className="flex justify-center mb-4">
            <CheckCircleOutlined className="text-6xl text-green-500" />
          </div>
          <p className="text-lg mb-4">Truy cập hạn chế vào các tính năng cơ bản của trang web.</p>
          <div className="text-xl font-bold mb-6">Miễn phí</div>
          <Button type="default" size="large" disabled className="w-full">
            Gói hiện tại
          </Button>
        </Card>

        {/* Gói tiêu chuẩn */}
        <Card
          className="w-80 shadow-lg"
          title="Gói tiêu chuẩn"
          bordered={false}
          style={{ textAlign: 'center' }}
        >
          <div className="flex justify-center mb-4">
            <CrownOutlined className="text-6xl text-blue-500" />
          </div>
          <p className="text-lg mb-4">Nâng cấp để truy cập thêm nhiều tính năng hữu ích.</p>
          <div className="text-xl font-bold mb-6">200.000đ/năm học</div>
          <Button type="primary" size="large" className="w-full bg-blue-500" onClick={() => alert('Nâng cấp ngay')}>
            Nâng cấp ngay
          </Button>
        </Card>

        {/* Gói cao cấp */}
        <Card
          className="w-80 shadow-lg"
          title="Gói cao cấp"
          bordered={false}
          style={{ textAlign: 'center' }}
        >
          <div className="flex justify-center mb-4">
            <RocketOutlined className="text-6xl text-red-500" />
          </div>
          <p className="text-lg mb-4">Truy cập tất cả tính năng và hỗ trợ cao cấp.</p>
          <div className="text-xl font-bold mb-6">500.000đ/năm học</div>
          <Button type="primary" size="large" className="w-full bg-red-500" onClick={() => alert('Nâng cấp ngay')}>
            Nâng cấp ngay
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default PackageDetialPage;