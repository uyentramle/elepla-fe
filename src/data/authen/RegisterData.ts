import apiClient from "../apiClient";

interface RegisterResponse<T> {
    success: boolean;
    message: string;
    data: T
}

interface VerifyRegisterCodeResponse {
    token: string;
    tokenExpiryTime: string;
}

interface SendRegisterVerificationCode {
    phoneNumberOrEmail: string;
}

interface VerifyRegisterCode {
    phoneNumberOrEmail: string;
    verificationCode: string;
}

export interface Register {
    registerToken: string;
    phoneNumberOrEmail: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
}

export const sendRegisterVerificationCode = async (data: SendRegisterVerificationCode): Promise<RegisterResponse<string>> => {
    try {
        const response = await apiClient.post('Auth/SendRegisterVerificationCode', data);
        return response.data;
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message,
            data: ''
        };
    }
};

export const verifyRegisterCode = async (data: VerifyRegisterCode): Promise<RegisterResponse<VerifyRegisterCodeResponse>> => {
    try {
        const response = await apiClient.post('Auth/VerifyRegisterCode', data);
        return response.data;
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message,
            data: {
                token: '',
                tokenExpiryTime: ''
            }
        };
    }
};

export const register = async (data: Register): Promise<RegisterResponse<string>> => {
    try {
        const response = await apiClient.post('Auth/Register', data);
        return response.data;
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message,
            data: ''
        };
    }
};