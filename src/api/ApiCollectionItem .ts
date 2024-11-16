// src/api/fetchCollections.ts
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { CollectionItem } from '../data/teacher/PlanbookCollectionData'; // Cập nhật đường dẫn nếu cần

// Interface cho dữ liệu trả về từ API
interface ApiCollectionItem {
  collectionId: string;
  collectionName: string;
  createdAt: string;
  updatedAt: string | null;
}

// Helper function để lấy userId từ token lưu trong localStorage
const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    const decodedToken: { userId?: string } = jwtDecode(token);
    return decodedToken.userId || null;
  }
  return null;
};

// Hàm để lấy dữ liệu bộ sưu tập từ API
const fetchCollections = async (): Promise<CollectionItem[]> => {
  try {
    const teacherId = getUserIdFromToken();
    if (!teacherId) throw new Error('User ID not found');

    // Gửi yêu cầu lấy dữ liệu từ API
    const response = await axios.get<{
      success: boolean;
      message: string;
      data: {
        items: ApiCollectionItem[]; // Cập nhật lấy mảng items từ dữ liệu API
      };
    }>(
      // `http://localhost/api/PlanbookCollection/GetPlanbookCollectionsByTeacherId?teacherId=${teacherId}&pageIndex=0&pageSize=10`
          `https://elepla-be-production.up.railway.app/api/PlanbookCollection/GetPlanbookCollectionsByTeacherId?teacherId=${teacherId}&pageIndex=0&pageSize=10`
    );
    if (response.data.success) {
      // Map dữ liệu trả về từ API thành CollectionItem
      const collections: CollectionItem[] = response.data.data.items.map((item) => ({
        collectionId: item.collectionId,
        name: item.collectionName, // Đổi từ collectionName sang name
        createDay: item.createdAt ? new Date(item.createdAt) : new Date(), // Chuyển đổi ngày tạo
        updateDay: item.updatedAt ? new Date(item.updatedAt) : new Date(), // Chuyển đổi ngày cập nhật

      }));
      return collections;
    } else {
      console.error('Lỗi khi lấy dữ liệu từ API:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('Lỗi khi gọi API:', error);
    return [];
  }
};

export default fetchCollections;
