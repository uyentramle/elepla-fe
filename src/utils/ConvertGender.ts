export const convertGenderToVietnamese = (gender: string | undefined) => {
    switch (gender) {
        case 'Male':
            return 'Nam';
        case 'Female':
            return 'Nữ';
        case 'Unknown':
        default:
            return 'Không xác định';
    }
};