export const translatePasswordErrorToVietnamese = (error: string) => {
    switch (error) {
        case 'Password must be at least 6 characters.':
            return 'Mật khẩu phải có ít nhất 6 ký tự.';
        case 'Password must have at least one non alphanumeric character.':
            return 'Mật khẩu phải có ít nhất một ký tự đặc biệt.';
        case "Password must have at least one digit ('0'-'9').":
            return "Mật khẩu phải có ít nhất một chữ số ('0'-'9').";
        case "Password must have at least one uppercase ('A'-'Z').":
            return "Mật khẩu phải có ít nhất một ký tự viết hoa ('A'-'Z').";
        case "Password must have at least one lowercase ('a'-'z').":
            return "Mật khẩu phải có ít nhất một ký tự viết thường ('a'-'z').";
        default:
            return error; // Hoặc trả về lỗi gốc nếu không có bản dịch
    }
};

export const translateLoginErrorToVietnamese = (error: string) => {
    switch (error) {
        case 'Wrong password!':
            return 'Mật khẩu không đúng.';
        case 'User not found!':
            return 'Tên đăng nhập không chính xác.';
        case 'User account is blocked. Please contact support.':
            return 'Tài khoản người dùng đã bị khóa. Vui lòng liên hệ bộ phận hỗ trợ.';
        default:
            return 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.';
    }
};

export const translateRegisterErrorToVietnamese = (error: string) => {
    switch (error) {
        case 'Email already in use.':
            return 'Email đã được sử dụng.';
        case 'Phone number already in use.':
            return 'Số điện thoại đã được sử dụng.';            
        case 'Invalid phone number or email format.':
            return 'Định dạng số điện thoại hoặc email không hợp lệ.';
        case 'An error occurred while sending verification code.':
            return 'Đã xảy ra lỗi khi gửi mã xác minh.';
        case 'Invalid verification code.':
            return 'Mã xác minh không hợp lệ.';
        default:
            return error;
    }
};

export const translateForgotPasswordErrorToVietnamese = (error: string) => {
    switch (error) {
        case 'User not found.':
            return 'Không tìm thấy người dùng.';
        case 'An error occurred while sending verification code.':
            return 'Đã xảy ra lỗi khi gửi mã xác minh.';
        case 'Invalid verification code.':
            return 'Mã xác minh không hợp lệ.';
        default:
            return error;
    }
};
