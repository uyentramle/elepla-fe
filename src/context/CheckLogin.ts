async function login(username: string, password: string) {
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
            // Lưu token và thông tin người dùng vào localStorage
            localStorage.setItem('accessToken', data.accessToken);
            const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
            localStorage.setItem('userRole', payload.role);
            localStorage.setItem('tokenExpiryTime', data.tokenExpiryTime);
            alert('Đăng nhập thành công');
        } else {
            alert('Đăng nhập thất bại');
        }
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        alert('Lỗi khi đăng nhập');
    }
}
