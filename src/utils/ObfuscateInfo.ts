export const obfuscateContactInfo = (phoneNumberOrEmail: string) => {
    if (!phoneNumberOrEmail) return '';

    if (phoneNumberOrEmail.includes('@')) {
        // Nếu là email
        const [name, domain] = phoneNumberOrEmail.split('@');
        if (name.length <= 2) return phoneNumberOrEmail;
        return name[0] + '*'.repeat(name.length - 3) + name.slice(-2) + '@' + domain;
    } else {
        // Nếu là số điện thoại
        const countryCode = '+84'; // Giả sử mã quốc gia luôn là +84
        const localNumber = phoneNumberOrEmail.slice(1); // Bỏ mã quốc gia từ chuỗi số điện thoại
        return `(${countryCode})${localNumber.slice(0, 3)}****${localNumber.slice(-2)}`;
    }
};