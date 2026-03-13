import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import Button from '../components/Button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ChangePasswordModal from '../components/ChangePasswordModal';
import ChangeNameModal from '../components/ChangeNameModal';
import ChangeEmailModal from '../components/ChangeEmailModal';
import ChangePhoneModal from '../components/ChangePhoneModal';
import AvatarPlaceholder from '../components/AvatarPlaceholder';
import AvatarUploadModal from '../components/AvatarUploadModal';

import { fetchMyListings, deleteListing, Listing } from '../services/api';
import { useNavigate } from "react-router-dom";
const ProfilePage: React.FC = () => {

    const { user, token, updateUser } = useAuth();

    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [nameModalOpen, setNameModalOpen] = useState(false);
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [phoneModalOpen, setPhoneModalOpen] = useState(false);
    const [avatarModalOpen, setAvatarModalOpen] = useState(false);

    const [userAvatar, setUserAvatar] = useState<string | undefined>();

    const [listings, setListings] = useState<Listing[]>([]);
    const [loadingListings, setLoadingListings] = useState(true);

    const navigate = useNavigate();

    // SET AVATAR
    useEffect(() => {

        if (user?.avatar) {

            if (typeof user.avatar === 'object' && 'url' in user.avatar) {

                setUserAvatar(user.avatar.url || undefined);

            } else if (typeof user.avatar === 'string') {

                setUserAvatar(user.avatar);

            }

        }

    }, [user]);

    // LOAD LISTINGS
    useEffect(() => {

        const loadListings = async () => {

            if (!token) return;

            try {

                const data = await fetchMyListings(token);

                console.log("Listings data:", data);

                setListings(data.listings || []);

            } catch (error) {

                console.error("Lỗi lấy listings:", error);

            } finally {

                setLoadingListings(false);

            }

        };

        loadListings();

    }, [token]);

    // delete listing
    const handleDelete = async (id: string) => {

        if (!token) return;

        const confirmDelete = window.confirm("Bạn có chắc muốn xóa bài đăng này?");
        if (!confirmDelete) return;

        try {

            await deleteListing(id, token);

            setListings((prev) => prev.filter((item) => item._id !== id));

        } catch (error) {

            console.error("Xóa listing lỗi:", error);

        }

    };

    const handleAvatarUploadSuccess = (avatarUrl: string) => {

        setUserAvatar(avatarUrl);

        if (user) {

            const oldPublicId =
                typeof user.avatar === 'object' && user.avatar !== null
                    ? (user.avatar as any).publicId
                    : null;

            updateUser({
                ...user,
                avatar: {
                    url: avatarUrl,
                    publicId: oldPublicId,
                },
            });

        }

    };

    // GET IMAGE URL SAFE
    const getImageUrl = (images: any) => {

        if (!images || images.length === 0) return "/no-image.jpg";

        const first = images[0];

        if (typeof first === "string") return first;

        if (typeof first === "object" && first.url) return first.url;

        return "/no-image.jpg";

    };

    return (

        <div className="max-w-7xl mx-auto py-12 px-4">

            {/* HEADER */}

            <div className="flex justify-between items-center">

                <h1 className="text-3xl font-bold">
                    Hồ sơ của tôi
                </h1>

                <Button
                    size="lg"
                    variant="primary"
                    onClick={() => setPasswordModalOpen(true)}
                >
                    Đổi mật khẩu
                </Button>

            </div>


            {/* USER INFO */}

            <div className="mt-8 flex items-center gap-6 bg-white p-8 rounded-lg shadow">

                <div className="relative">

                    <AvatarPlaceholder
                        name={user?.name || "User"}
                        avatarUrl={userAvatar}
                        size="xl"
                    />

                    <button
                        onClick={() => setAvatarModalOpen(true)}
                        className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full"
                    >
                        <FaEdit />
                    </button>

                </div>

                <div>

                    <p className="text-2xl font-bold">
                        {user?.name}
                    </p>

                    <p className="text-gray-600">
                        {user?.email}
                    </p>

                </div>

            </div>

            {/* USER DETAILS */}

            <div className="mt-8 bg-white p-8 rounded-lg shadow">

                <p className="flex gap-2 items-center">
                    <strong>Tên:</strong> {user?.name}

                    <button
                        onClick={() => setNameModalOpen(true)}
                        className="text-blue-500"
                    >
                        <FaEdit />
                    </button>

                </p>

                <p className="flex gap-2 items-center">

                    <strong>SĐT:</strong> {user?.phone}

                    <button
                        onClick={() => setPhoneModalOpen(true)}
                        className="text-blue-500"
                    >
                        <FaEdit />
                    </button>

                </p>

                <p className="flex gap-2 items-center">

                    <strong>Email:</strong> {user?.email}

                    <button
                        onClick={() => setEmailModalOpen(true)}
                        className="text-blue-500"
                    >
                        <FaEdit />
                    </button>

                </p>


                {/* MY LISTINGS */}

                <h2 className="text-2xl font-bold mt-10 mb-6">
                    Bất động sản của tôi
                </h2>

                {loadingListings ? (

                    <p>Đang tải dữ liệu...</p>

                ) : listings.length === 0 ? (

                    <div className="text-center text-gray-500 p-8 border-2 border-dashed rounded-lg">
                        Bạn chưa đăng bất động sản nào.
                    </div>

                ) : (

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {listings.map((listing) => (

                            <div
                                key={listing._id}
                                className="border rounded-xl overflow-hidden shadow hover:shadow-xl transition bg-white"
                            >

                                {/* IMAGE */}

                                <div className="w-full h-48 overflow-hidden">

                                    <img
                                        src={getImageUrl(listing.images)}
                                        alt={listing.title}
                                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                    />

                                </div>


                                {/* CONTENT */}

                                <div className="p-4">

                                    <h3 className="font-bold text-lg line-clamp-2">
                                        {listing.title}
                                    </h3>

                                    <p className="text-red-500 font-semibold text-lg mt-1">
                                        {listing.price.toLocaleString()} VND
                                    </p>

                                    <p className="text-gray-600">
                                        {listing.area} m²
                                    </p>

                                    <p className="text-gray-500 text-sm">
                                        {listing.location?.city}
                                    </p>

                                    <div className="flex gap-3 mt-5">

                                    <button
                                        onClick={() => navigate(`/edit-listing/${listing._id}`)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-200"
                                    >
                                        <FaEdit className="text-sm" />
                                        Sửa
                                    </button>

                                    <button
                                        onClick={() => handleDelete(listing._id)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-200"
                                    >
                                        <FaTrash className="text-sm" />
                                        Xóa
                                    </button>

                                    </div>

                                </div>

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