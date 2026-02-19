import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { updateUserProfile } from '../services/api';

const EditProfilePage: React.FC = () => {
    const { user, token, updateUser } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            if (!token) throw new Error('No authentication token');
            const result = await updateUserProfile(name, email, token);
            updateUser(result);
            navigate('/profile');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Cập nhật thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Chỉnh Sửa Hồ Sơ</h1>
                <div>
                    <Link to="/profile">
                    <Button size="lg" variant="primary">Quay lại</Button>
                    </Link>
                </div>
            </div>
            <div className="mt-8 bg-white p-8 rounded-lg shadow-md space-y-3">
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="flex w-full items-center justify-center gap-4">
                        <p><strong>Tên:</strong></p>
                        <label htmlFor="name" className="sr-only">Tên</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                            placeholder="Tên người dùng"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="flex w-full items-center justify-center gap-4">
                        <p><strong>Email:</strong></p>
                        <label htmlFor="email-address" className="sr-only">Email</label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                            placeholder="Địa chỉ email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Đang cập nhật...' : 'Cập Nhật Thông Tin'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage;
