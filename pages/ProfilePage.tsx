import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import Button from '../components/Button';
import { FaEdit } from 'react-icons/fa';
import ChangePasswordModal from '../components/ChangePasswordModal';
import ChangeNameModal from '../components/ChangeNameModal';
import ChangeEmailModal from '../components/ChangeEmailModal';
import ChangePhoneModal from '../components/ChangePhoneModal';
import AvatarPlaceholder from '../components/AvatarPlaceholder';
import AvatarUploadModal from '../components/AvatarUploadModal';
import PropertyCard from '../components/PropertyCard';
import { fetchMyListings } from '../services/api';
import type { Property } from '../types';

const ProfilePage: React.FC = () => {
    const { user, token, updateUser } = useAuth();
    
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [nameModalOpen, setNameModalOpen] = useState(false);
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [phoneModalOpen, setPhoneModalOpen] = useState(false);
    const [avatarModalOpen, setAvatarModalOpen] = useState(false);
    const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);

    const [myListings, setMyListings] = useState<Property[]>([]);
    const [loadingListings, setLoadingListings] = useState(true);

    useEffect(() => {
        setUserAvatar(user?.avatar?.url || undefined);
    }, [user]);

    useEffect(() => {
        const loadMyListings = async () => {
            try {
                if (token) {
                    const data = await fetchMyListings(token);
                    setMyListings(data);
                }
            } catch (error) {
                console.error('Lỗi tải bài đăng:', error);
            } finally {
                setLoadingListings(false);
            }
        };

        loadMyListings();
    }, [token]);

    const handleAvatarUploadSuccess = (avatarUrl: string) => {
        setUserAvatar(avatarUrl);
        if (user) {
            updateUser({ 
                ...user, 
                avatar: {
                    url: avatarUrl,
                    publicId: user.avatar?.publicId || null,
                }
            });
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "APPROVED":
                return "bg-green-100 text-green-800";
            case "REJECTED":
                return "bg-red-100 text-red-800";
            case "EXPIRED":
                return "bg-gray-100 text-gray-800";
            default:
                return "";
        }
    };
    
    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Của Tôi</h1>
                <Button 
                    size="lg" 
                    variant="primary"
                    onClick={() => setPasswordModalOpen(true)}
                >
                    Đổi Mật Khẩu
                </Button>
            </div>

            {/* USER INFO */}
            <div className="mt-8 flex items-center gap-6 bg-white p-8 rounded-lg shadow-md mb-8">
                <div className="relative">
                    <AvatarPlaceholder
                        name={user?.name || 'User'}
                        avatarUrl={userAvatar}
                        size="xl"
                    />
                    <button
                        onClick={() => setAvatarModalOpen(true)}
                        className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg transition"
                        title="Chỉnh sửa ảnh đại diện"
                    >
                        <FaEdit />
                    </button>
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900">{user?.name}</p>
                    <p className="text-gray-600">{user?.email}</p>
                </div>
            </div>

            {/* DETAIL + LISTINGS */}
            <div className="mt-8 bg-white p-8 rounded-lg shadow-md">

                <p className='flex gap-2 items-center'>
                    <strong>Tên:</strong> {user?.name}
                    <button onClick={() => setNameModalOpen(true)} className="text-blue-500 hover:text-blue-700">
                        <FaEdit />
                    </button>
                </p>

                <p className='flex gap-2 items-center'>
                    <strong>Số điện thoại:</strong> {user?.phone}
                    <button onClick={() => setPhoneModalOpen(true)} className="text-blue-500 hover:text-blue-700">
                        <FaEdit />
                    </button>
                </p>

                <p className='flex gap-2 items-center'>
                    <strong>Email:</strong> {user?.email}
                    <button onClick={() => setEmailModalOpen(true)} className="text-blue-500 hover:text-blue-700">
                        <FaEdit />
                    </button>
                </p>

                {/* LISTINGS */}
                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                    Bất động sản của tôi
                </h2>

                {loadingListings ? (
                    <p>Đang tải...</p>
                ) : myListings.length === 0 ? (
                    <div className="text-center text-gray-500 p-8 border-2 border-dashed rounded-lg">
                        <p>Bạn chưa đăng bất động sản nào.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myListings.map((property) => (
                            <div key={property._id} className="relative">

                                {/* STATUS BADGE */}
                                <span
                                    className={`absolute top-2 left-2 px-2 py-1 text-xs rounded font-medium ${getStatusStyle(property.status)}`}
                                >
                                    {property.status}
                                </span>

                                <PropertyCard property={property} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODALS */}
            <ChangePasswordModal 
                isOpen={passwordModalOpen}
                onClose={() => setPasswordModalOpen(false)}
            />
            <ChangeNameModal 
                isOpen={nameModalOpen}
                onClose={() => setNameModalOpen(false)}
            />
            <ChangeEmailModal 
                isOpen={emailModalOpen}
                onClose={() => setEmailModalOpen(false)}
            />
            <ChangePhoneModal 
                isOpen={phoneModalOpen}
                onClose={() => setPhoneModalOpen(false)}
            />
            <AvatarUploadModal
                isOpen={avatarModalOpen}
                onClose={() => setAvatarModalOpen(false)}
                onUploadSuccess={handleAvatarUploadSuccess}
                token={token}
            />
        </div>
    );
};

export default ProfilePage;