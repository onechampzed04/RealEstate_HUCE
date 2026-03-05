
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

const ProfilePage: React.FC = () => {
    const { user, token, updateUser } = useAuth();
    
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [nameModalOpen, setNameModalOpen] = useState(false);
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [phoneModalOpen, setPhoneModalOpen] = useState(false);
    const [avatarModalOpen, setAvatarModalOpen] = useState(false);
    const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (user?.avatar) {
            if (typeof user.avatar === 'object' && 'url' in user.avatar) {
                setUserAvatar(user.avatar.url || undefined);
            } else if (typeof user.avatar === 'string') {
                setUserAvatar(user.avatar);
            }
        }
    }, [user]);

    const handleAvatarUploadSuccess = (avatarUrl: string) => {
        setUserAvatar(avatarUrl);
        if (user) {
            // Lấy publicId cũ một cách an toàn
            const oldPublicId = (typeof user.avatar === 'object' && user.avatar !== null) 
                ? (user.avatar as any).publicId 
                : null;

            updateUser({ 
                ...user, 
                avatar: {
                    url: avatarUrl,
                    publicId: oldPublicId,
                }
            });
        }
    };
    
    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Của Tôi</h1>
                <div className="flex gap-2">
                    <Button 
                        size="lg" 
                        variant="primary"
                        onClick={() => setPasswordModalOpen(true)}
                    >
                        Đổi Mật Khẩu
                    </Button>
                </div>
            </div>

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

            <div className="mt-8 bg-white p-8 rounded-lg shadow-md">
                <p className='flex gap-2 items-center'><strong>Tên:</strong> {user?.name}
                    <button 
                        onClick={() => setNameModalOpen(true)}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        <FaEdit className="mr-2" />
                    </button>
                </p>
                <p className='flex gap-2 items-center'><strong>Số điện thoại:</strong> {user?.phone}
                    <button 
                        onClick={() => setPhoneModalOpen(true)}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        <FaEdit className="mr-2" />
                    </button>
                </p>
                <p className='flex gap-2 items-center'><strong>Email:</strong> {user?.email}
                    <button 
                        onClick={() => setEmailModalOpen(true)}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        <FaEdit className="mr-2" />
                    </button>
                </p>
                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Bất động sản của tôi</h2>
                <div className="text-center text-gray-500 p-8 border-2 border-dashed rounded-lg">
                    <p>Chức năng quản lý bất động sản sẽ được phát triển ở đây.</p>
                    <p>Bạn chưa đăng bất động sản nào.</p>
                </div>
            </div>

            {/* Modals */}
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
