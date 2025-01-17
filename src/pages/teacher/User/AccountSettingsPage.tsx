import React, { useState, useEffect } from 'react';
import SidebarMenu from './SidebarMenu';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Input, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, KeyOutlined, TwitterOutlined, GoogleOutlined } from '@ant-design/icons';
import { obfuscateUsername, obfuscateEmail, obfuscatePhoneNumber } from '@/utils/ObfuscateInfo';
import { translatePasswordErrorToVietnamese } from '@/utils/TranslateError';
import LinkGoogleAccountButton from '@/layouts/teacher/Button/LinkGoogleAccountButton';
import { getUserId } from '@/data/apiClient';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface LinkedAccountProps {
    username: string;
    setUsername: (newUsername: string) => void; // Hàm để cập nhật username mới, dòng này có thể bỏ do dùng để test
}

interface LinkedEmailProps {
    email: string;
    setEmail: (newEmail: string) => void; // Hàm để cập nhật email mới, dòng này có thể bỏ do dùng để test
}

interface NewEmailDTO {
    userId: string;
    newEmail: string;
}

interface VerifyEmailDTO {
    userId: string;
    newEmail: string;
    verificationCode: string;
}

interface LinkedPhoneProps {
    phoneNumber: string;
    setPhoneNumber: (newPhoneNumber: string) => void; // Hàm để cập nhật số điện thoại mới, dòng này có thể bỏ do dùng để test
}

const getUserIdFromToken = () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        throw new Error('Access token not found.');
    }

    const decodedToken: any = jwtDecode(accessToken);
    return decodedToken.userId;
};

const getUserProfile = async (): Promise<any> => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        throw new Error('Access token not found.');
    }

    try {
        const decodedToken: any = jwtDecode(accessToken);
        const id = decodedToken.userId;

        const response = await axios.get(`https://elepla-be-production.up.railway.app/api/Account/GetUserProfile?userId=${id}`, {
            headers: {
                'accept': '*/*',
                'authorization': `Bearer ${accessToken}`
            }
        });

        const { userId, phoneNumber, username, email, googleEmail, facebookEmail } = response.data.data;

        return { userId, phoneNumber, username, email, googleEmail, facebookEmail };
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw new Error('Failed to fetch user profile.');
    }
};

const AccountSettingsPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [googleEmail, setGoogleEmail] = useState('');
    const [facebookEmail, setFacebookEmail] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear local items
        localStorage.removeItem('token');
        // Redirect to sign-in page
        navigate('/sign-in');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUserProfile();
                setUsername(obfuscateUsername(userData.username));
                setEmail(obfuscateEmail(userData.email));
                setPhoneNumber(obfuscatePhoneNumber(userData.phoneNumber));
                setGoogleEmail(obfuscateEmail(userData.googleEmail));
                setFacebookEmail(obfuscateEmail(userData.facebookEmail));
            } catch (error) {
                console.error(error);
                message.error('Failed to fetch user data.');
            }
        };

        fetchData();
    }, [googleEmail]);

    const handleClick = () => {
        message.info('Chức năng này đang được phát triển.');
    }

    return (
        <div className="container mx-auto w-4/5 p-4 pt-10">
            <div className="flex flex-col gap-10 lg:flex-row">
                {' '}
                <SidebarMenu onLogout={handleLogout} />
                <div className="w-full lg:flex-1">
                    <div className="rounded bg-white p-6 shadow">
                        <nav className="mb-4 flex">
                            <b className="inline-flex items-center rounded-t border-l border-r border-t border-blue-500 px-4 py-2 pb-1.5 text-blue-500">
                                <span className="mr-2">Thiết lập an toàn tài khoản</span>
                            </b>
                            <div className="flex-grow border-b border-blue-500"></div>
                        </nav>
                        <div className="space-y-4">
                            <LinkedAccount username={username} setUsername={setUsername} />
                            <LinkedEmail email={email} setEmail={setEmail} /> {/* Thêm dòng này để test */}
                            <LinkedPhone phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} /> {/* Thêm dòng này để test */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="rounded-full bg-blue-400 p-2 text-xs text-white">
                                        <KeyOutlined style={{ fontSize: '20px' }} />
                                    </div>
                                    <div>
                                        <div className="text-gray-700">Đổi mật khẩu</div>
                                    </div>
                                </div>
                                {username ? (
                                    <a
                                        href="/teacher/change-password"
                                        className="rounded bg-gray-300 px-3 py-1 text-sm text-gray-700"
                                    >
                                        Đổi
                                    </a>
                                ) : (
                                    <div className="rounded bg-gray-300 px-3 py-1 text-sm text-gray-700  bg-gray-300">
                                        Hãy liên kết với tên người dùng
                                    </div>
                                )}
                            </div>
                        </div>
                        <h6 className="mb-4 mt-8 border-t pt-5 text-xl">Tài khoản liên kết</h6>
                        <div className="flex items-center justify-between">
                            <div className="">
                                <div className="flex items-center space-x-2">
                                    {/* <div className="bg-blue-600 text-white rounded-full p-2" >
                        <FacebookFilled style={{ fontSize: '24px' }} />
                    </div> */}
                                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-blue-600">
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png"
                                            alt="Facebook"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-gray-700">Facebook</div>
                                        {/* <div className="text-gray-500">Phạm Tum</div> */}
                                        <div
                                            className={`text-xs ${facebookEmail ? 'text-gray-500' : 'text-red-500'
                                                }`}
                                        >
                                            {facebookEmail || 'Chưa liên kết'}
                                        </div>
                                    </div>
                                </div>
                                <Button size="small" className="mt-1 rounded bg-gray-300 px-2 py-1 text-sm text-gray-700" onClick={handleClick}>
                                    {facebookEmail ? 'Hủy liên kết' : 'Liên Kết'}
                                </Button>
                            </div>
                            <div className="">
                                <div className="flex items-center space-x-2">
                                    <div className="rounded-full bg-blue-400 p-2 text-white">
                                        <TwitterOutlined style={{ fontSize: '24px' }} />
                                    </div>
                                    <div>
                                        <div className="text-gray-700">Twitter</div>
                                        <div className="text-red-500 text-xs">Chưa liên kết</div>
                                    </div>
                                </div>
                                <Button size="small" className="mt-1 rounded bg-gray-300 px-2 py-1 text-sm text-gray-700" onClick={handleClick}>
                                    Liên Kết
                                </Button>
                            </div>
                            <div className="">
                                <div className="flex items-center space-x-2">
                                    <div className="rounded-full bg-red-500 p-2 text-white">
                                        <GoogleOutlined style={{ fontSize: '24px' }} />
                                    </div>
                                    <div>
                                        <div className="text-gray-700">Google</div>
                                        {/* <div className="text-gray-500">Ngô Bá Tô</div> */}
                                        <div
                                            className={`text-xs ${googleEmail ? 'text-gray-500' : 'text-red-500'
                                                }`}
                                        >
                                            {googleEmail || 'Chưa liên kết'}
                                        </div>
                                    </div>
                                </div>
                                {/* <Button size="small" className="mt-1 rounded bg-gray-300 px-2 py-1 text-sm text-gray-700" onClick={handleClick}>
                                    {googleEmail ? 'Hủy liên kết' : 'Liên Kết'}
                                </Button> */}
                                <GoogleOAuthProvider clientId="448683717226-p7kuea7e82t5l4g4ge8q3j1f2ok92r3q.apps.googleusercontent.com">
                                    <LinkGoogleAccountButton currentUserId={getUserId()!} googleEmail={googleEmail} />
                                </GoogleOAuthProvider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSettingsPage;

const LinkedAccount: React.FC<LinkedAccountProps> = ({ username, setUsername }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const isLinked = username !== '';

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        if (password !== confirmPassword) {
            message.error('Mật khẩu không khớp. Vui lòng thử lại.');
            return;
        }

        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                throw new Error('Access token not found.');
            }

            const decodedToken: any = jwtDecode(accessToken);
            const userId = decodedToken.userId;

            const data = {
                userId,
                userName: newUsername,
                password
            };

            const response = await axios.put('https://elepla-be-production.up.railway.app/api/Account/LinkAccountWithUserName', data, {
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.data.success) {
                message.success('Liên kết tài khoản thành công.');
                setUsername(newUsername); // Update the username in the parent component
                setIsModalVisible(false);
                setNewUsername(''); // Clear the input field
                setPassword(''); // Clear the input field
                setConfirmPassword(''); // Clear the input field
            } else {
                // Handle general failure
                message.error(response.data.message || 'Liên kết tài khoản thất bại.');
            }
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                // Handle specific errors based on server response
                switch (error.response.data.message) {
                    case 'Username must be between 6 and 20 characters long.':
                        message.error('Tên người dùng phải từ 6 đến 20 ký tự.');
                        break;
                    case 'Username is already taken.':
                        message.error('Tên người dùng đã tồn tại. Vui lòng chọn tên khác.');
                        break;
                    case 'Password is not in correct format.':
                        if (error.response.data.errors && error.response.data.errors.length > 0) {
                            error.response.data.errors.forEach((err: string) => {
                                const errorMessage = translatePasswordErrorToVietnamese(err);
                                message.error(errorMessage);
                            });
                        }
                        break;
                    default:
                        message.error(error.response.data.message || 'Liên kết tài khoản thất bại.');
                        break;
                }
            } else {
                // Handle other types of errors
                message.error('Liên kết tài khoản thất bại.');
            }
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-blue-400 p-2 text-xs text-white">
                        <UserOutlined style={{ fontSize: '20px' }} />
                    </div>
                    <div>
                        <div className="text-gray-700">Tên người dùng</div>
                        <div className="text-gray-500">{isLinked ? username : 'Chưa liên kết'}</div>
                    </div>
                </div>
                <Button
                    className={`rounded px-3 py-1 text-sm ${isLinked ? 'cursor-not-allowed bg-gray-300 text-gray-700' : 'bg-blue-500 text-white'}`}
                    onClick={!isLinked ? showModal : undefined}
                    disabled={isLinked}
                >
                    {isLinked ? 'Đã liên kết' : 'Liên kết'}
                </Button>
            </div>

            <Modal
                title="Liên Kết Tài Khoản"
                className="text-center"
                visible={isModalVisible}
                okText="Lưu"
                cancelText="Hủy"
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <form className="mt-5 space-y-4">
                    <div className="flex items-center">
                        <label
                            htmlFor="username"
                            className="w-1/4 whitespace-nowrap pr-4 text-left"
                        >
                            Tên người dùng
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="w-3/4 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center">
                        <label
                            htmlFor="password"
                            className="w-1/4 whitespace-nowrap pr-4 text-left"
                        >
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-3/4 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center">
                        <label
                            htmlFor="confirmPassword"
                            className="w-1/4 whitespace-nowrap pr-4 text-left"
                        >
                            Nhập lại mật khẩu
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-3/4 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export const LinkedEmail: React.FC<LinkedEmailProps> = ({ email, setEmail }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [emailError, setEmailError] = useState('');


    const showModal = () => {
        setIsModalVisible(true);
        setEmailSent(false); // Reset state khi mở modal
        setVerificationCode(['', '', '', '', '', '']); // Reset state khi mở modal
        setEmailError(''); // Reset state khi mở modal

        setNewEmail('');
    };

    const handleOk = async () => {
        if (!emailSent) {
            if (!validateEmail(newEmail)) {
                setEmailError('Địa chỉ email không hợp lệ.');
                return;
            }
            try {
                await sendVerificationCodeEmail(newEmail);
            } catch (error: any) {
                // sendVerificationCodeEmail đã xử lý lỗi, không cần xử lý lại ở đây
            }
        } else {
            // Xử lý khi người dùng nhập xong mã xác thực và ấn nút xác nhận
            const code = verificationCode.join('');
            try {
                await verifyNewEmail(newEmail, code);
                message.success('Liên kết email thành công');
                setEmail(obfuscateEmail(newEmail));
                setIsModalVisible(false);
            } catch (error) {
                message.error('Mã xác thực không đúng. Vui lòng thử lại.');
            }
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleChangeCode = (index: number, value: string) => {
        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);
    };

    // Hàm Test, có thể bỏ
    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const sendVerificationCodeEmail = async (newEmail: string) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const userId = getUserIdFromToken();
            const data: NewEmailDTO = {
                userId,
                newEmail
            };

            const response = await axios.post('https://elepla-be-production.up.railway.app/api/Account/SendVerificationCodeEmail', data, {
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            // Check the success field in the response
            if (response.data.success) {
                // If successful, show success message and update state
                message.success('Mã xác thực đã được gửi đến email của bạn.');
                setEmailSent(true);
            }
        } catch (error: any) {
            // Handle other errors, e.g., network error
            if (error.response && error.response.status === 400 && error.response.data.message === 'Email is already in use.') {
                message.error('Email đã được sử dụng. Vui lòng nhập một địa chỉ email khác.');
            } else {
                message.error('Gửi mã xác thực thất bại.');
            }
        }
    };

    const verifyNewEmail = async (newEmail: string, verificationCode: string) => {
        const accessToken = localStorage.getItem('accessToken');

        const userId = getUserIdFromToken();

        console.log('userId', userId);
        console.log('newEmail', newEmail);
        console.log('verificationCode', verificationCode);

        const data: VerifyEmailDTO = {
            userId,
            newEmail,
            verificationCode
        };
        await axios.put('https://elepla-be-production.up.railway.app/api/Account/VerifyAndUpdateNewEmail', data,
            {
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-blue-400 p-2 text-xs text-white">
                        <MailOutlined style={{ fontSize: '20px' }} />
                    </div>
                    <div>
                        <div className="text-gray-700">Email</div>
                        <div className="text-gray-500">{email ? email : 'Chưa liên kết'}</div>
                    </div>
                </div>
                <Button
                    className={`rounded px-3 py-1 text-sm ${email ? 'bg-gray-300 text-gray-700' : 'bg-blue-500 text-white'}`}
                    onClick={showModal}
                >
                    {email ? 'Đổi liên kết' : 'Liên kết'}
                </Button>
            </div>

            <Modal
                title={emailSent ? 'Xác nhận Mã Xác Thực' : 'Liên Kết Email'}
                className="text-center"
                visible={isModalVisible}
                okText={emailSent ? 'Xác nhận' : 'Gửi mã xác thực'}
                cancelText="Hủy"
                onOk={handleOk}
                onCancel={handleCancel}
            >
                {!emailSent ? (
                    <form className="mt-5 space-y-4">
                        <div className="flex items-center">
                            <label
                                htmlFor="newEmail"
                                className="w-1/4 whitespace-nowrap pr-4 text-left"
                            >
                                Nhập Email
                            </label>
                            <input
                                type="email"
                                id="newEmail"
                                name="newEmail"
                                value={newEmail}
                                // onChange={(e) => setNewEmail(e.target.value)}
                                onChange={(e) => {
                                    setNewEmail(e.target.value);
                                    setEmailError('');
                                }}
                                className="w-3/4 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        {emailError && (
                            <div className="text-red-500 text-sm text-center w-full mt-1">
                                {emailError}
                            </div>
                        )}
                    </form>
                ) : (
                    <form className="mt-5 space-y-4">
                        <div className="flex items-center space-x-2">
                            {verificationCode.map((digit, index) => (
                                <Input
                                    key={index}
                                    className="w-1/6 text-center"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChangeCode(index, e.target.value)}
                                />
                            ))}
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export const LinkedPhone: React.FC<LinkedPhoneProps> = ({ phoneNumber, setPhoneNumber }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [phoneNumberSent, setPhoneNumberSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [phoneNumberError, setPhoneNumberError] = useState('');

    const showModal = () => {
        setIsModalVisible(true);
        setPhoneNumberSent(false); // Reset state khi mở modal
        setVerificationCode(['', '', '', '', '', '']); // Reset state khi mở modal
        setPhoneNumberError(''); // Reset state khi mở modal
        setNewPhoneNumber('');
    };

    const handleOk = async () => {
        if (!phoneNumberSent) {
            if (!validatePhoneNumber(newPhoneNumber)) {
                setPhoneNumberError('Số điện thoại không hợp lệ.');
                return;
            }
            try {
                await sendVerificationCode(newPhoneNumber);
                message.success('Mã xác thực đã được gửi đến số điện thoại của bạn.');
                setPhoneNumberSent(true);
            } catch (error) {
                message.error('Gửi mã xác thực thất bại.');
            }
        } else {
            const code = verificationCode.join('');
            try {
                await verifyNewPhoneNumber(newPhoneNumber, code);
                message.success('Liên kết số điện thoại thành công');
                setPhoneNumber(obfuscatePhoneNumber(newPhoneNumber));
                setIsModalVisible(false);
            } catch (error) {
                message.error('Mã xác thực không đúng. Vui lòng thử lại.');
            }
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleChangeCode = (index: number, value: string) => {
        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);
    };

    // Hàm Test, có thể bỏ
    const validatePhoneNumber = (phoneNumber: string) => {
        // Số điện thoại bắt đầu bằng dấu + hoặc số 0, theo sau là các chữ số, dấu cách, dấu chấm hoặc dấu gạch ngang
        const re = /^(\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?(\d{1,4}[-.\s]?){1,4}$/;
        return re.test(String(phoneNumber).trim());
    };

    const sendVerificationCode = async (newPhoneNumber: string) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const userId = getUserIdFromToken();
            const data = {
                userId,
                newPhoneNumber
            };

            await axios.post('https://elepla-be-production.up.railway.app/api/Account/SendVerificationCode', data, {
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
        } catch (error) {
            throw new Error('Gửi mã xác thực thất bại.');
        }
    };

    const verifyNewPhoneNumber = async (newPhoneNumber: string, verificationCode: string) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const userId = getUserIdFromToken();
            const data = {
                userId,
                newPhoneNumber,
                verificationCode
            };

            await axios.put('https://elepla-be-production.up.railway.app/api/Account/VerifyAndUpdateNewPhoneNumber', data, {
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
        } catch (error) {
            throw new Error('Xác nhận số điện thoại thất bại.');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-blue-400 p-2 text-xs text-white">
                        <PhoneOutlined style={{ fontSize: '20px' }} />
                    </div>
                    <div>
                        <div className="text-gray-700">Số điện thoại</div>
                        <div className="text-gray-500">{phoneNumber ? phoneNumber : 'Chưa liên kết'}</div>
                    </div>
                </div>
                <Button
                    className={`rounded px-3 py-1 text-sm ${phoneNumber ? 'bg-gray-300 text-gray-700' : 'bg-blue-500 text-white'}`}
                    onClick={showModal}
                >
                    {phoneNumber ? 'Đổi số điện thoại' : 'Liên kết'}
                </Button>
            </div>

            <Modal
                title={phoneNumberSent ? 'Xác nhận Mã Xác Thực' : 'Liên Kết Số Điện Thoại'}
                className="text-center"
                visible={isModalVisible}
                okText={phoneNumberSent ? 'Xác nhận' : 'Gửi mã xác thực'}
                cancelText="Hủy"
                onOk={handleOk}
                onCancel={handleCancel}
            >
                {!phoneNumberSent ? (
                    <form className="mt-5 space-y-4">
                        <div className="flex items-center gap-4">
                            <label
                                htmlFor="newEmail"
                                className="w-1/4 whitespace-nowrap pr-4 text-left"
                            >
                                Nhập số điện thoại
                            </label>
                            <input
                                type="phone"
                                id="newPhoneNumber"
                                name="newPhoneNumber"
                                value={newPhoneNumber}
                                // onChange={(e) => setNewEmail(e.target.value)}
                                onChange={(e) => {
                                    setNewPhoneNumber(e.target.value);
                                    setPhoneNumberError('');
                                }}
                                className="w-3/4 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        {phoneNumberError && (
                            <div className="text-red-500 text-sm text-center w-full mt-1">
                                {phoneNumberError}
                            </div>
                        )}
                    </form>
                ) : (
                    <form className="mt-5 space-y-4">
                        <div className="flex items-center space-x-2">
                            {verificationCode.map((digit, index) => (
                                <Input
                                    key={index}
                                    className="w-1/6 text-center"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChangeCode(index, e.target.value)}
                                />
                            ))}
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};