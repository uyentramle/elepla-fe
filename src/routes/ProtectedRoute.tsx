import { Navigate } from 'react-router-dom';
import React from 'react';

interface ProtectedRouteProps {
    isAuthenticated: boolean;
    allowedRoles: string[];
    userRole: string;
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    isAuthenticated,
    allowedRoles,
    userRole,
    children
}) => {
    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;  
    }

    return <>{children}</>;
};

export default ProtectedRoute;
