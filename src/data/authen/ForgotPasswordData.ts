import apiClient from "../apiClient";

interface ForgotPasswordResponse<T> {
    success: boolean;
    message: string;
    data: T
}

interface VerifyForgotPasswordCodeResponse {
    resetToken: string;
    tokenExpiryTime: string;
}

interface SendForgotPasswordVerificationCode {
    phoneNumberOrEmail: string;
}

interface VerifyForgotPasswordCode {
    phoneNumberOrEmail: string;
    verificationCode: string;
}

interface ResetPassword {
    phoneNumberOrEmail: string;
    resetPasswordToken: string;
    newPassword: string;
}


export const sendForgotPasswordVerificationCode = async (data: SendForgotPasswordVerificationCode): Promise<ForgotPasswordResponse<string>> => {
    try {
        const response = await apiClient.post('Auth/SendForgotPasswordVerificationCode', data);
        return response.data;
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message,
            data: ''
        };
    }
};

export const verifyForgotPasswordCode = async (data: VerifyForgotPasswordCode): Promise<ForgotPasswordResponse<VerifyForgotPasswordCodeResponse>> => {
    try {
        const response = await apiClient.post('Auth/VerifyForgotPasswordCode', data);
        return response.data;
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message,
            data: {
                resetToken: '',
                tokenExpiryTime: ''
            }
        };
    }
};

export const resetPassword = async (data: ResetPassword): Promise<ForgotPasswordResponse<string>> => {
    try {
        const response = await apiClient.post('Auth/ResetPassword', data);
        return response.data;
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message,
            data: ''
        };
    }
};