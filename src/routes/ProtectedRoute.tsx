import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getRole } from "@/data/apiClient"; // Hàm lấy role từ token

interface ProtectedRouteProps {
    allowedRoles: string[]; // Danh sách vai trò được phép truy cập
    children: ReactNode;    // Component sẽ được render nếu vai trò hợp lệ
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
    const role = getRole(); // Lấy role từ token
    if (!role || !allowedRoles.includes(role)) {
        // Nếu không có role hoặc vai trò không hợp lệ
        return <Navigate to="/not-found" replace />;
    }
    return <>{children}</>;
};

export default ProtectedRoute;
