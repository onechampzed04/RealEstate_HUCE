
import React from 'react';
import useAuth from '../hooks/useAuth';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    
    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Của Tôi</h1>
                <div className="flex gap-2">
                    <Link to="/profile/password-change">
                        <Button size="lg" variant="primary">Đổi Mật Khẩu</Button>
                    </Link>
                </div>
            </div>
            <div className="mt-8 bg-white p-8 rounded-lg shadow-md">
                <p className='flex gap-2 items-center'><strong>Tên:</strong> {user?.name}
                    <Link to="/profile/edit-name"><FaEdit className="mr-2" /></Link>
                </p>
                <p className='flex gap-2 items-center'><strong>Email:</strong> {user?.email}
                    <Link to="/profile/change-email"><FaEdit className="mr-2" /></Link>
                </p>
                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Bất động sản của tôi</h2>
                <div className="text-center text-gray-500 p-8 border-2 border-dashed rounded-lg">
                    <p>Chức năng quản lý bất động sản sẽ được phát triển ở đây.</p>
                    <p>Bạn chưa đăng bất động sản nào.</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
