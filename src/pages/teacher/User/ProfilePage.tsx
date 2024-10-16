import React  from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CameraOutlined} from '@ant-design/icons';
import SidebarMenu from './SidebarMenu';



const ProfilePage: React.FC = () => {
    const navigate = useNavigate();

const navigateToSignInPage = () => {
    navigate('/sign-in');
};

const handleLogout = () => {
    // Clear local items
    localStorage.removeItem('accessToken');
    // Redirect to sign-in page
    navigateToSignInPage();
};

    return (
        <div className="container mx-auto p-4 pt-10">
            <div className="flex flex-col gap-10 lg:flex-row">
                {' '}
                <SidebarMenu onLogout={handleLogout} />
                <div className="w-full lg:flex-1">
                    <div className="rounded bg-white p-6 shadow">
                        <div className="mb-4 flex flex-col gap-12 sm:flex-row">
                            {' '}
                            {/* items-center */}
                            {/* Phần Avatar và Change Photo */}
                            <div className="mb-4 ml-6 mr-0 flex-shrink-0 sm:mb-0 sm:mr-4">
                                <div className="flex h-44 w-44 items-center justify-center rounded-full bg-white">
                                    {/* {avatar || userData.avatar ? (
                                        <img src={avatar ?? userData.avatar} alt="Avatar" className="h-40 w-40 rounded-full object-cover" />
                                    ) : (
                                        <div className="text-xl text-gray-400 bg-gray-200 h-40 w-40 rounded-full flex justify-center items-center">140x140</div>
                                    )} */}
                                                                            <div className="text-xl text-gray-400 bg-gray-200 h-40 w-40 rounded-full flex justify-center items-center">140x140</div>

                                </div>
                                <div className="mt-4 flex flex-col items-center justify-center">
                                    <button
                                        className="rounded bg-blue-500 px-3 py-1.5 text-white transition-colors duration-300 hover:bg-blue-600"
                                        // onClick={() => handleOpenModal(userId)}
                                    >
                                        {/* <i className="fa fa-fw fa-camera mr-2"></i> */}
                                        <CameraOutlined className="mr-2" />
                                        <span>Thay ảnh đại diện</span>
                                    </button>
                                </div>
                            </div>
                            {/* Phần Thông tin cá nhân */}
                            <div className="flex-1 sm:text-left">
                                {/* <nav className="mb-4">
                                    <b className="border-b-2 border-pink-500 pb-1.5 text-pink-500">
                                        Thông tin cá nhân
                                    </b>
                                </nav> */}
                                <nav className="mb-4 flex">
                                    <b className="inline-flex items-center rounded-t border-l border-r border-t border-blue-500 px-4 py-2 pb-1.5 text-blue-500">
                                        <span className="mr-2">Thông tin cá nhân</span>
                                    </b>
                                    <div className="flex-grow border-b border-blue-500"></div>
                                </nav>
                                <div className="space-y-3">
                                    <form className="mt-6 space-y-3">
                                        <div className="flex flex-wrap sm:flex-nowrap sm:space-x-3">
                                            <div className="flex-1 min-w-[150px]">
                                                <label className="block text-sm font-medium text-gray-700">Họ</label>
                                                <input
                                                    className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 focus:border-blue-500 focus:outline-none"
                                                    type="text"
                                                    name="lastName"
                                                    // ref={el => inputRef.current['lastName'] = el}
                                                    // value={tempUserData.lastName || userData.lastName || ''}
                                                    // onChange={handleInputChange}
                                                    // onFocus={() => setIsEditing(true)}
                                                    // onBlur={() => setIsEditing(false)}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-[150px]">
                                                <label className="block text-sm font-medium text-gray-700">Tên</label>
                                                <input
                                                    className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 focus:border-blue-500 focus:outline-none"
                                                    type="text"
                                                    name="firstName"
                                                    // ref={el => inputRef.current['firstName'] = el}
                                                    // value={tempUserData.firstName || userData.firstName || ''}
                                                    // onChange={handleInputChange}
                                                    // onFocus={() => setIsEditing(true)}
                                                    // onBlur={() => setIsEditing(false)}
                                                />
                                            </div>
                                            {/* <div className="flex items-end justify-end mt-4 mb-2 sm:mt-0">
                                                <button
                                                    className="rounded bg-blue-500 px-2 py-1 text-white transition-colors duration-300 hover:bg-blue-600 text-xs"
                                                    type="submit"
                                                >
                                                    Cập nhật
                                                </button>
                                            </div> */}
                                        </div>
                                        <div className="flex flex-wrap sm:flex-nowrap sm:space-x-3">
                                        <div className="flex-1 min-w-[150px]">
                                            <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                                            <select
                                                className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 focus:border-blue-500 focus:outline-none"
                                                name="gender"
                                                // value={tempUserData.gender ?? userData.gender ?? ''}
                                                // onChange={handleInputChange}
                                                // onFocus={() => setIsEditing(true)}
                                                // onBlur={() => setIsEditing(false)}
                                            >
                                                <option value="Male">Nam</option>
                                                <option value="Female">Nữ</option>
                                                <option value="Unknown">Chưa xác định</option>
                                            </select>
                                        </div>
                                            <div className="flex-1 min-w-[150px]">
                                                <label className="block text-sm font-medium text-gray-700">Môn</label>
                                                <input
                                                    className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 focus:border-blue-500 focus:outline-none"
                                                    type="text"
                                                    name="firstName"
                                                    // ref={el => inputRef.current['firstName'] = el}
                                                    // value={tempUserData.firstName || userData.firstName || ''}
                                                    // onChange={handleInputChange}
                                                    // onFocus={() => setIsEditing(true)}
                                                    // onBlur={() => setIsEditing(false)}
                                                />
                                            </div>
                                        </div>
                                        
                                    </form>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <input
                                            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 focus:border-blue-500 focus:outline-none"
                                            type="email"
                                            name="email"
                                            // value={userData.email}
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Số điện thoại
                                        </label>
                                        <input
                                            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 focus:border-blue-500 focus:outline-none"
                                            type="text"
                                            name="phone"
                                            // value={userData.phoneNumber}
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
                                            // value={userData.address}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <AvatarModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveAvatar} userId={currentUserId} /> */}
        </div>
    );
};

export default ProfilePage;

// const AvatarModal: React.FC<{ isOpen: boolean, onClose: () => void, onSave: (file: File) => void, userId: string | null }> = ({ isOpen, onClose, onSave, userId: userIdd }) => {
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [preview, setPreview] = useState<string | null>(null);
//     const [modalClass, setModalClass] = useState('');

    
//     useEffect(() => {
//         // Add or remove transition class based on modal state
//         setModalClass(
//             isOpen
//                 ? 'translate-y-0 transition-all duration-500 ease-in-out'
//                 : '-translate-y-full transition-all duration-500 ease-in-out',
//         );
//     }, [isOpen]);

//     // Function to handle Escape key press
//     useEffect(() => {
//         const handleEsc = (event: KeyboardEvent) => {
//             if (event.key === 'Escape') {
//                 onClose();
//             }
//         };

//         document.addEventListener('keydown', handleEsc);

//         return () => {
//             document.removeEventListener('keydown', handleEsc);
//         };
//     }, [onClose]);

//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files && event.target.files[0]) {
//             const file = event.target.files[0];
//             setSelectedFile(file);

//             const reader = new FileReader();
//             reader.onload = () => {
//                 setPreview(reader.result as string);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleUpload = async (file: File) => {
//         // const storageRef = ref(storage, `avatars/${file.name}`);
//         // const uploadTask = uploadBytesResumable(storageRef, file);

//         return new Promise<string>((resolve, reject) => {
//             // uploadTask.on(
//             //     'state_changed',
//             //     (snapshot) => {
//             //         // Handle progress if needed
//             //     },
//             //     (error) => {
//             //         console.error('Upload failed:', error);
//             //         reject(error);
//             //     },
//             //     () => {
//             //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//             //             resolve(downloadURL);
//             //         });
//             //     }
//             // );
//         });
//     };

//     const handleSave = async () => {
//         // if (selectedFile) {
//         //     try {
//         //         const url = await handleUpload(selectedFile);
//         //         console.log('Uploaded file URL:', url);

//         //         // Gọi API để cập nhật URL ảnh đại diện của người dùng
//         //         const response = await axios.put('https://localhost:44329/api/Account/UpdateUserAvatar', {
//         //             userId: userIdd,
//         //             avatarUrl: url
//         //         }, {
//         //             headers: {
//         //                 'Content-Type': 'application/json',
//         //                 'accept': '*/*',
//         //                 'authorization': `Bearer ${accessToken}` // xem trong api yêu cầu gì thì copy vào
//         //             }
//         //         });

//         //         if (response.data.success) {
//         //             console.log('Avatar updated successfully');
//         //             message.success('Cập nhật ảnh đại diện thành công.');

//         //             onClose();
//         //         } else {
//         //             console.error('Failed to update avatar:', response.data.message);
//         //             message.error('Cập nhật ảnh đại diện thất bại.');
//         //         }

//         //     } catch (error) {
//         //         console.error('Error uploading file:', error);
//         //     }
//         // }
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//             <div className={`w-full max-w-screen-sm rounded-lg bg-white pl-8 pr-8 pt-4 pb-4 shadow-xl ${modalClass}`}>
//                 <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">Chọn ảnh đại diện</h2>
//                 <div className="border mb-6 flex justify-center p-6 bg-gray-100 rounded-lg">
//                     {preview ? (
//                         <img src={preview} alt="Preview" className="rounded-full w-48 h-48 object-cover shadow-md" />
//                     ) : (
//                         <div className="flex items-center justify-center w-48 h-48 bg-gray-300 rounded-full">
//                             <span className="text-gray-500">No Image</span>
//                         </div>
//                     )}
//                 </div>
//                 {/* <input type="file" accept="image/*" className="w-full p-2 text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring focus:ring-pink-200 focus:border-pink-300" onChange={handleFileChange} /> */}

//                 <div className="mt-6 flex justify-between space-x-4">
//                     <label className="flex items-center gap-2 px-2 py-1 bg-white text-pink-500 rounded-lg shadow-lg tracking-wide uppercase border border-pink-500 cursor-pointer hover:bg-pink-600 hover:text-white text-sm">
//                         <UploadOutlined className="text-xs" />
//                         <span className="mt-1 text-xs">Chọn ảnh</span>
//                         <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
//                     </label>
//                     <div className="flex space-x-4">
//                         <button
//                             className="rounded-lg bg-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-400 transition-colors text-sm"
//                             onClick={onClose}
//                         // style={{ minWidth: '100px' }}
//                         >
//                             Hủy
//                         </button>
//                         <button
//                             className="rounded-lg bg-pink-500 px-3 py-1 text-white hover:bg-pink-600 transition-colors text-sm"
//                             onClick={handleSave}
//                         // style={{ minWidth: '100px' }}
//                         >
//                             Lưu
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
