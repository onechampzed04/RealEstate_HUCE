import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const EditNamePage: React.FC = () => {
    const { user, token, updateUser } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [step, setStep] = useState<'name' | 'otp'>('name');
    const [newName, setNewName] = useState('');
    const [otp, setOtp] = useState('');

    const handleRequestNameChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!newName) {
            setError('Vui lòng nhập tên mới');
            return;
        }

        if (newName.trim().length < 2) {
            setError('Tên phải có ít nhất 2 ký tự');
            return;
        }

        setLoading(true);
        try {
            console.log('[Edit Name] Requesting name change OTP...');
            const { requestNameChange } = await import('../services/api');
            await requestNameChange(newName, token || '');
            console.log('[Edit Name] OTP sent successfully');
            setStep('otp');
        } catch (err: any) {
            console.error('[Edit Name] Error:', err);
            const errorMsg = err instanceof Error ? err.message : 'Không thể gửi mã OTP. Vui lòng thử lại.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyNameChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!otp) {
            setError('Vui lòng nhập mã OTP');
            return;
        }

        setLoading(true);
        try {
            console.log('[Verify Name Change] Verifying OTP...');
            const { verifyNameChangeOtp } = await import('../services/api');
            const result = await verifyNameChangeOtp(otp, token || '');
            console.log('[Verify Name Change] Name changed successfully');
            updateUser(result);
            navigate('/profile');
        } catch (err: any) {
            console.error('[Verify Name Change] Error:', err);
            const errorMsg = err instanceof Error ? err.message : 'Xác thực OTP thất bại. Vui lòng kiểm tra mã.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Vui lòng đăng nhập để chỉnh sửa tên</p>
                <Link to="/login">
                    <Button className="mt-4">Đăng Nhập</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Sửa Tên</h1>
                <div>
                    <Link to="/profile">
                        <Button size="lg" variant="primary">Quay lại</Button>
                    </Link>
                </div>
            </div>
            <div className="mt-8 bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {step === 'name' && (
                    <form className="space-y-6" onSubmit={handleRequestNameChange}>
                        <div>
                            <label htmlFor="currentName" className="block text-sm font-medium text-gray-700">
                                Tên Hiện Tại
                            </label>
                            <input
                                id="currentName"
                                type="text"
                                value={user.name}
                                disabled
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                            />
                        </div>

                        <div>
                            <label htmlFor="newName" className="block text-sm font-medium text-gray-700">
                                Tên Mới
                            </label>
                            <input
                                id="newName"
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder="Nhập tên mới"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Đang gửi mã...' : 'Tiếp Tục'}
                        </Button>
                    </form>
                )}

                {step === 'otp' && (
                    <form className="space-y-6" onSubmit={handleVerifyNameChange}>
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                            <p className="text-sm text-blue-800">
                                Mã OTP đã được gửi đến email: <strong>{user.email}</strong>
                            </p>
                        </div>

                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                Mã OTP
                            </label>
                            <input
                                id="otp"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary text-center text-lg tracking-widest"
                                placeholder="000000"
                                maxLength={6}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Đang xác thực...' : 'Xác Thực OTP'}
                        </Button>

                        <button
                            type="button"
                            onClick={() => {
                                setStep('name');
                                setOtp('');
                            }}
                            className="w-full text-sm text-primary hover:underline"
                        >
                            Quay lại
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EditNamePage;
