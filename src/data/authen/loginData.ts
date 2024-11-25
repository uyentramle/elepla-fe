import apiClient from '../apiClient';
import { getRole } from '../apiClient';
import { useNavigate } from 'react-router-dom';

interface LoginResponse {
    success: boolean;
    message: string;
    accessToken: string;
    refreshToken: string;
    tokenExpiryTime: string;
}

export const saveTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
};

export const navigateBasedOnRole = async (navigate: ReturnType<typeof useNavigate>) => {
    const role = await getRole();
    switch (role) {
        case 'Teacher':
            navigate('/teacher/list-collection');
            break;
        case 'Admin':
            navigate('/admin/');
            break;
        case 'Manager':
            navigate('/manager');
            break;
        case 'AcademicStaff':
            navigate('/academy-staff');
            break;
        default:
            navigate('/');
            break;
    }
};

export const login = async (username: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await apiClient.post('Auth/Login', {
            username,
            password,
        });
        if (response.data.success) {
            return response.data;
        }
        return {
            success: false,
            message: response.data.message,
            accessToken: '',
            refreshToken: '',
            tokenExpiryTime: '',
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message,
            accessToken: '',
            refreshToken: '',
            tokenExpiryTime: '',
        };
    }
};

export const googleLogin = async (googleToken: string): Promise<LoginResponse> => {
    try {
        const response = await apiClient.post('Auth/GoogleLogin', {
            googleToken,
            isCredential: false
        });
        if (response.data.success) {
            return response.data;
        }
        return {
            success: false,
            message: response.data.message,
            accessToken: '',
            refreshToken: '',
            tokenExpiryTime: '',
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message,
            accessToken: '',
            refreshToken: '',
            tokenExpiryTime: '',
        };
    }
};

export const facebookLogin = async (accessToken: string): Promise<LoginResponse> => {
    try {
        const response = await apiClient.post('Auth/FacebookLogin', {
            accessToken
        });
        if (response.data.success) {
            return response.data;
        }
        return {
            success: false,
            message: response.data.message,
            accessToken: '',
            refreshToken: '',
            tokenExpiryTime: '',
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message,
            accessToken: '',
            refreshToken: '',
            tokenExpiryTime: '',
        };
    }
}

export const Logout = async (navigate: ReturnType<typeof useNavigate>) => {
    localStorage.removeItem('accessToken');
    // localStorage.removeItem('refreshToken');

    navigate('/sign-in');
};