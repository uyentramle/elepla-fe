import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface RequireAuthProps {
    children: ReactNode; // Component cần render nếu đã đăng nhập
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem("accessToken"); // Kiểm tra token trong localStorage

    if (!isAuthenticated) {
        // Nếu không có token, chuyển hướng đến trang đăng nhập
        return <Navigate to="/sign-in" replace />;
    }

    return <>{children}</>;
};

export default RequireAuth;
