import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    userRole: string | null;
    accessToken: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('userRole');
        const expiry = localStorage.getItem('tokenExpiryTime');

        if (token && role && expiry && new Date(expiry) > new Date()) {
            setIsAuthenticated(true);
            setUserRole(role);
            setAccessToken(token);
        }
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await fetch('https://elepla-be-production.up.railway.app/api/Auth/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('userRole', data.role);
                localStorage.setItem('tokenExpiryTime', data.tokenExpiryTime);

                setIsAuthenticated(true);
                setUserRole(data.role);
                setAccessToken(data.accessToken);
                alert('Đăng nhập thành công');
            } else {
                alert('Đăng nhập thất bại');
            }
        } catch (error) {
            console.error('Lỗi khi đăng nhập:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('tokenExpiryTime');
        setIsAuthenticated(false);
        setUserRole(null);
        setAccessToken(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
