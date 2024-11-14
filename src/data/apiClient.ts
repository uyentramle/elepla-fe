// apiClient.ts
import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://elepla-be-production.up.railway.app/api/",
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
