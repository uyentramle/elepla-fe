export const translateErrorToVietnamese = (error: string) => {
    switch (error) {
        case 'Password must be at least 6 characters.':
            return 'Mật khẩu phải có ít nhất 6 ký tự.';
        case 'Password must have at least one non alphanumeric character.':
            return 'Mật khẩu phải có ít nhất một ký tự đặc biệt.';
        case 'Password must have at least one digit (\'0\'-\'9\').':
            return 'Mật khẩu phải có ít nhất một chữ số (\'0\'-\'9\').';
        case 'Password must have at least one uppercase (\'A\'-\'Z\').':
            return 'Mật khẩu phải có ít nhất một ký tự viết hoa (\'A\'-\'Z\').';
        case 'Password must have at least one lowercase (\'a\'-\'z\').':
            return 'Mật khẩu phải có ít nhất một ký tự viết thường (\'a\'-\'z\').';
        default:
            return error; // Hoặc trả về lỗi gốc nếu không có bản dịch
    }
};