
import React from 'react';
import useAuth from '../hooks/useAuth';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    
    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Của Tôi</h1>
                <div>
                    <Link to="/profile/edit">
                    <Button size="lg" variant="primary">Sửa hồ sơ</Button>
                    </Link>
                </div>
            </div>
            <div className="mt-8 bg-white p-8 rounded-lg shadow-md">
                <p><strong>Tên:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
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
