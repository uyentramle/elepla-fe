import React, { useState, useEffect } from 'react';
import { Button, Card, message, Spin } from 'antd';
import { CheckCircleOutlined, CrownOutlined, RocketOutlined } from '@ant-design/icons';
import axios from 'axios';
import { getActiveUserPackageByUserId, ServicePackage } from '@/data/manager/UserPackageDatas';
import { getUserId } from '@/data/apiClient';
import { createPaymentLink } from "@/data/manager/PaymentData";

interface ServicePackages {
  packageId: string;
  packageName: string;
  description: string | null;
  useTemplate: boolean;
  useAI: boolean;
  exportWord: boolean;
  exportPdf: boolean;
  price: number;
  discount: number;
  startDate: string;
  endDate: string;
  maxLessonPlans: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    totalItemsCount: number;
    pageSize: number;
    totalPagesCount: number;
    pageIndex: number;
    next: boolean;
    previous: boolean;
    items: ServicePackages[];
  };
}

const getAllServicePackages = async (pageIndex: number, pageSize: number): Promise<ApiResponse> => {
  try {
    const response = await axios.get<ApiResponse>('https://elepla-be-production.up.railway.app/api/ServicePackage/GetAllServicePackages', {
      params: {
        pageIndex,
        pageSize
      },
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
      }
    });

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('Error searching service package:', error);
    throw error;
  }
};

const PackageDetailPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [servicePackages, setServicePackages] = useState<ServicePackages[]>([]);
  const [activePackage, setActivePackage] = useState<ServicePackage | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const data = await getAllServicePackages(0, 10);
        // console.log('Service packages:', data); // Debug dữ liệu trả về
        setServicePackages(data.data.items);
      } catch (error) {
        console.error(error);
        message.error('Không thể tải danh sách gói đăng ký.');
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    const fetchActivePackage = async () => {
      try {
        const activePackageData = await getActiveUserPackageByUserId(getUserId() || '');
        setActivePackage(activePackageData); // Cập nhật state
      } catch (error) {
        console.error('Error fetching active package:', error);
      }
    };

    fetchActivePackage(); // Gọi hàm lấy gói dịch vụ khi component mount
  }, []);

  const handleUpgradePackage = async (packageId: string) => {
    try {
      const createPayment = await createPaymentLink(getUserId() || '', packageId);
      window.open(createPayment.paymentUrl, '_blank');
    } catch (error) {
      console.error('Error upgrading package:', error);
      message.error('Không thể nâng cấp gói dịch vụ.');
    }
  };

  return (
    <div className="container mx-auto">
      {/* <h1 className="text-center text-2xl font-bold mb-4">Các gói dịch vụ</h1> */}
      {loading ?
        <div className="flex justify-center items-center h-[200px]">
          <Spin size="large" />
          <span className="ml-3">Đang tải dữ liệu...</span>
        </div> :
        <div className="flex justify-center">
          {servicePackages.map((pkg) => (
            <Card
              key={pkg.packageId}
              className="card shadow-lg"
              title={pkg.packageName}
              bordered={false}
              style={{ textAlign: 'center' }}
            >
              <div className="flex justify-center mb-4">
                {pkg.packageName.includes('miễn phí') ? (
                  <CheckCircleOutlined className="text-6xl text-green-500" />
                ) : pkg.packageName.includes('cao cấp') ? (
                  <RocketOutlined className="text-6xl text-red-500" />
                ) : (
                  <CrownOutlined className="text-6xl text-blue-500" />
                )}
              </div>
              <p className="text-lg mb-4">
                {pkg.description || ''}
              </p>
              <ul className="text-left mb-8" style={{ height: '200px' }}>
                <li>- {pkg.useTemplate ? 'Hỗ trợ sử dụng mẫu bài giảng.' : 'Không hỗ trợ sử dụng mẫu bài giảng.'}</li>
                <li>
                  - {pkg.useAI ? 'Tích hợp AI hỗ trợ tạo nội dung và kiểm tra lỗi.' : 'Không tích hợp AI.'}
                </li>
                <li>
                  - {pkg.exportWord
                    ? 'Cho phép xuất giáo án sang định dạng Word.'
                    : 'Không hỗ trợ xuất sang Word.'}
                </li>
                <li>
                  - {pkg.exportPdf
                    ? 'Cho phép xuất giáo án sang định dạng PDF.'
                    : 'Không hỗ trợ xuất sang PDF.'}
                </li>
                <li>- Quản lý tối đa {pkg.maxLessonPlans} kế hoạch bài học trong năm học.</li>
              </ul>
              <div className="text-xl font-bold mb-6" style={{ height: '40px', display: 'flex', justifyContent: 'center', alignItems: pkg.price > 0 ? 'center' : 'flex-end' }}>
                {pkg.price > 0
                  ? `${pkg.price.toLocaleString()}đ/năm học (Giảm giá: ${pkg.discount}%)`
                  : 'Miễn phí'}
              </div>
              <Button
                type={pkg.price > 0 ? 'primary' : 'default'}
                size="middle"
                className="w-full"
                disabled={
                  activePackage?.packageName === "Gói cao cấp" || // Disable tất cả nút nếu gói hiện tại là Gói cao cấp
                  pkg.price === 0 || // Vô hiệu hóa nếu là gói miễn phí
                  activePackage?.packageId === pkg.packageId // Vô hiệu hóa nếu là gói hiện tại
                }
                onClick={() => handleUpgradePackage(pkg.packageId)}
              >
                {activePackage?.packageId === pkg.packageId
                  ? 'Gói hiện tại'
                  : activePackage?.packageName === "Gói cao cấp" && pkg.packageName === "Gói cơ bản"
                    ? 'Gói cơ bản'
                    : pkg.price === 0
                      ? 'Gói miễn phí'
                      : 'Nâng cấp ngay'}
              </Button>
            </Card>
          ))}
        </div>
      }
    </div>
  );
};

export default PackageDetailPage;