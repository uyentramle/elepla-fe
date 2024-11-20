// apiClient.ts
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const apiClient = axios.create({
    baseURL: "https://elepla-be-production.up.railway.app/api/",
    // baseURL: "https://localhost:44314/api/",
});

// Thêm interceptor để thêm `accessToken` vào tất cả các request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;

// Hàm chung để giải mã token và lấy thông tin từ decodedToken
const getDecodedToken = (field: string): any => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        try {
            const decodedToken: any = jwtDecode(accessToken); // Giải mã token
            return decodedToken[field] || null; // Trả về trường cần thiết từ decoded token
        } catch (error) {
            console.error("Error decoding token", error);
            return null;
        }
    }
    return null;
};

// Hàm lấy userId từ accessToken
export const getUserId = (): string | null => {
    return getDecodedToken("userId");
};

// Hàm lấy Role từ accessToken
export const getRole = (): string | null => {
    return getDecodedToken("http://schemas.microsoft.com/ws/2008/06/identity/claims/role");
};