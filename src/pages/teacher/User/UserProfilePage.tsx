import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CameraOutlined, UploadOutlined } from '@ant-design/icons';
import SidebarMenu from './SidebarMenu';
import { message, Modal, Button } from 'antd';
import { jwtDecode } from 'jwt-decode';
import { convertGenderToVietnamese } from '@/utils/ConvertGender';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../services/Firebase/firebase';

// interface UserProfile {
//     userId: string;
//     firstName: string;
//     lastName: string;
//     gender: string;
//     email: string;
//     phoneNumber: string;
//     address: string;
//     avatar: string;
//     background: string;
// }

const getUserProfile = async (): Promise<any> => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        throw new Error('Access token not found.');
    }

    try {
        const decodedToken: any = jwtDecode(accessToken);
        const id = decodedToken.userId; // Assuming 'userId' is the key in your accessToken payload

        const response = await axios.get(`https://elepla-be-production.up.railway.app/api/Account/GetUserProfile?userId=${id}`, {
            headers: {
                'accept': '*/*', // xem trong api yêu cầu gì thì copy vào
                'authorization': `Bearer ${accessToken}` // xem trong api yêu cầu gì thì copy vào
            }
        });

        // Lấy ra các trường cần thiết từ response
        const { userId, firstName, lastName, gender, teach, schoolName, email, phoneNumber, address, avatar, background } = response.data.data;

        // Trả về một đối tượng chỉ chứa các trường cần thiết
        return { userId, firstName, lastName, gender, teach, schoolName, email, phoneNumber, address, avatar, background };
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw new Error('Failed to fetch user profile.');
    }
};

const UserProfilePage: React.FC = () => {
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [avatar, setAvatar] = useState<string | null>(null); // For storing the avatar URL
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const userId = userData?.userId;
    const navigate = useNavigate();

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const navigateToSignInPage = () => {
        navigate('/sign-in');
    };

    const showUpdateModal = () => {
        setIsUpdateModalOpen(true);
    }

    const handleUpdateModalOk = () => {
        setIsUpdateModalOpen(false);
    }

    const handleUpdateModalCancel = () => {
        setIsUpdateModalOpen(false);
    }

    const handleLogout = () => {
        // Clear local items
        localStorage.removeItem('accessToken');
        // Redirect to sign-in page
        navigateToSignInPage();
    };

    const handleOpenAvatarModal = (userId: string) => {
        setCurrentUserId(userId);
        setIsAvatarModalOpen(true);
    };

    const handleCloseAvatarModal = () => {
        setIsAvatarModalOpen(false);
    };

    const fetchData = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            navigateToSignInPage(); return;
        }

        try {
            const userProfileData = await getUserProfile();
            setUserData(userProfileData);
            setAvatar(userProfileData.avatar);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            navigateToSignInPage(); // Redirect to sign-in page on error
        } finally {
            //setLoading(false); // Set loading to false after data fetching
        }
    };

    useEffect(() => {
        const interval = setInterval(fetchData, 1000); // Cập nhật mỗi 1 giây

        return () => clearInterval(interval);
    }, []);

    // const handleSaveAvatar = (file: File) => {
    //     const reader = new FileReader();
    //     reader.onload = () => {
    //         setAvatar(reader.result as string); // Set the avatar URL
    //     };
    //     reader.readAsDataURL(file);
    // };

    if (!userData) {
        navigateToSignInPage();
    }

    return (
        <div className="container mx-auto w-4/5 p-4 pt-10">
            <div className="flex flex-col gap-10 lg:flex-row">
                {' '}
                <SidebarMenu onLogout={handleLogout} />
                <div className="w-full lg:flex-1">
                    <div className="rounded bg-white p-4 shadow">
                        <div className="flex flex-col gap-12 sm:flex-row">
                            {' '}
                            {/* items-center */}
                            {/* Phần Avatar và Change Photo */}
                            <div className="mb-4 ml-6 mr-0 flex-shrink-0 sm:mb-0 sm:mr-4">
                                <div className="flex h-44 w-44 items-center justify-center rounded-full bg-white">
                                    {avatar || userData?.avatar ? (
                                        <img src={avatar ?? userData?.avatar} alt="Avatar" className="h-40 w-40 rounded-full object-cover" />
                                    ) : (
                                        <div className="text-xl text-gray-400 bg-gray-200 h-40 w-40 rounded-full flex justify-center items-center">140x140</div>
                                    )}
                                </div>
                                <div className="mt-4 flex flex-col items-center justify-center">
                                    <button
                                        className="rounded bg-blue-500 px-3 py-1.5 text-white transition-colors duration-300 hover:bg-blue-600"
                                        onClick={() => handleOpenAvatarModal(userId)}
                                    >
                                        {/* <i className="fa fa-fw fa-camera mr-2"></i> */}
                                        <CameraOutlined className="mr-2" />
                                        <span>Thay ảnh đại diện</span>
                                    </button>
                                </div>
                            </div>
                            {/* Phần Thông tin cá nhân */}
                            <div className="flex-1 sm:text-left">
                                <nav className="mb-4 flex">
                                    <b className="inline-flex items-center rounded-t border-l border-r border-t border-blue-500 px-4 py-2 pb-1.5 text-blue-500">
                                        <span className="mr-2">Thông tin cá nhân</span>
                                    </b>
                                    <div className="flex-grow border-b border-blue-500"></div>
                                </nav>
                                <div className="space-y-3">
                                    <div className="flex flex-wrap sm:flex-nowrap sm:space-x-3">
                                        <div className="flex-1 min-w-[150px]">
                                            <label className="block text-sm font-medium text-gray-700">Họ</label>
                                            <input
                                                className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 focus:border-blue-500 focus:outline-none"
                                                type="text"
                                                name="lastName"
                                                value={userData?.lastName || ''}
                                                readOnly
                                            />
                                        </div>
                                        <div className="flex-1 min-w-[150px]">
                                            <label className="block text-sm font-medium text-gray-700">Tên</label>
                                            <input
                                                className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 focus:border-blue-500 focus:outline-none"
                                                type="text"
                                                name="firstName"
                                                value={userData?.firstName || ''}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap sm:flex-nowrap sm:space-x-3">
                                        <div className="flex-1 min-w-[150px]">
                                            <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                                            <input
                                                className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 focus:border-blue-500 focus:outline-none"
                                                type="text"
                                                name="gender"
                                                value={convertGenderToVietnamese(userData?.gender)}
                                                readOnly
                                            />
                                        </div>
                                        <div className="flex-1 min-w-[150px]">
                                            <label className="block text-sm font-medium text-gray-700">Môn</label>
                                            <input
                                                className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 focus:border-blue-500 focus:outline-none"
                                                type="text"
                                                name="subject"
                                                value={userData?.teach || '...'}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap sm:flex-nowrap sm:space-x-3">
                                        <div className="flex-1 min-w-[150px]">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Email
                                            </label>
                                            <input
                                                className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 focus:border-blue-500 focus:outline-none"
                                                type="email"
                                                name="email"
                                                value={userData?.email || 'Chưa liên kết'}
                                                readOnly
                                            />
                                        </div>
                                        <div className="flex-1 min-w-[150px]">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Số điện thoại
                                            </label>
                                            <input
                                                className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 focus:border-blue-500 focus:outline-none"
                                                type="text"
                                                name="phone"
                                                value={userData?.phoneNumber || 'Chưa liên kết'}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Trường
                                        </label>
                                        <input
                                            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 focus:border-blue-500 focus:outline-none"
                                            type="text"
                                            name="address"
                                            value={userData?.schoolName || '...'}
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Địa chỉ
                                        </label>
                                        <input
                                            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 focus:border-blue-500 focus:outline-none"
                                            type="text"
                                            name="address"
                                            value={userData?.address || '...'}
                                            readOnly
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            type="primary"
                                            onClick={showUpdateModal}
                                            className="bg-blue-500 hover:bg-blue-600"
                                        >
                                            Cập nhật
                                        </Button>

                                        <Modal
                                            title = "Cập nhật thông tin cá nhân"
                                            visible = {isUpdateModalOpen}
                                            onOk={handleUpdateModalOk}
                                            onCancel={handleUpdateModalCancel}
                                            okText="Cập nhật"
                                            cancelText="Hủy"
                                        >
                                            <p>Nội dung của modal ở đây.</p>
                                        </Modal>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AvatarModal isOpen={isAvatarModalOpen} onClose={handleCloseAvatarModal} /*onSave={handleSaveAvatar}*/ userId={currentUserId} />
        </div>
    );
};

export default UserProfilePage;

const AvatarModal: React.FC<{ isOpen: boolean, onClose: () => void, /*onSave: (file: File) => void,*/ userId: string | null }> = ({ isOpen, onClose, /*onSave,*/ userId: userId }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [modalClass, setModalClass] = useState('');

    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        throw new Error('Access token not found.');
    }

    useEffect(() => {
        // Add or remove transition class based on modal state
        setModalClass(
            isOpen
                ? 'translate-y-0 transition-all duration-500 ease-in-out'
                : '-translate-y-full transition-all duration-500 ease-in-out',
        );
    }, [isOpen]);

    // Function to handle Escape key press
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEsc);

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async (file: File) => {
        const storageRef = ref(storage, `avatars/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise<string>((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                // (snapshot) => {
                //     // Handle progress if needed
                // },
                (error) => {
                    console.error('Upload failed:', error);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handleSave = async () => {
        if (selectedFile) {
            try {
                const url = await handleUpload(selectedFile);
                console.log('Uploaded file URL:', url);

                // Gọi API để cập nhật URL ảnh đại diện của người dùng
                const response = await axios.put('https://elepla-be-production.up.railway.app/api/Account/UpdateUserAvatar', {
                    userId: userId,
                    avatarUrl: url
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': '*/*',
                        'authorization': `Bearer ${accessToken}` // xem trong api yêu cầu gì thì copy vào
                    }
                });

                if (response.data.success) {
                    console.log('Avatar updated successfully');
                    message.success('Cập nhật ảnh đại diện thành công.');

                    onClose();
                } else {
                    console.error('Failed to update avatar:', response.data.message);
                    message.error('Cập nhật ảnh đại diện thất bại.');
                }

            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className={`w-full max-w-screen-sm rounded-lg bg-white pl-8 pr-8 pt-4 pb-4 shadow-xl ${modalClass}`}>
                <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">Chọn ảnh đại diện</h2>
                <div className="border mb-6 flex justify-center p-6 bg-gray-100 rounded-lg">
                    {preview ? (
                        <img src={preview} alt="Preview" className="rounded-full w-48 h-48 object-cover shadow-md" />
                    ) : (
                        <div className="flex items-center justify-center w-48 h-48 bg-gray-300 rounded-full">
                            <span className="text-gray-500">No Image</span>
                        </div>
                    )}
                </div>
                {/* <input type="file" accept="image/*" className="w-full p-2 text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring focus:ring-pink-200 focus:border-pink-300" onChange={handleFileChange} /> */}

                <div className="mt-6 flex justify-between space-x-4">
                    <label className="flex items-center gap-2 px-2 py-1 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-600 hover:text-white text-sm">
                        <UploadOutlined className="text-xs" />
                        <span className="mt-1 text-xs">Chọn ảnh</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                    <div className="flex space-x-4">
                        <button
                            className="rounded-lg bg-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-400 transition-colors text-sm"
                            onClick={onClose}
                        // style={{ minWidth: '100px' }}
                        >
                            Hủy
                        </button>
                        <button
                            className="rounded-lg bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 transition-colors text-sm"
                            onClick={handleSave}
                        // style={{ minWidth: '100px' }}
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
