import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const ChangeEmailPage: React.FC = () => {
    const { user, token, updateUser } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [newEmail, setNewEmail] = useState('');
    const [otp, setOtp] = useState('');

    const handleRequestEmailChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!newEmail) {
            setError('Vui lòng nhập email mới');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            setError('Email không hợp lệ');
            return;
        }

        if (newEmail === user?.email) {
            setError('Email mới phải khác email hiện tại');
            return;
        }

        setLoading(true);
        try {
            console.log('[Change Email] Requesting email change OTP...');
            const { requestEmailChange } = await import('../services/api');
            await requestEmailChange(newEmail, token || '');
            console.log('[Change Email] OTP sent successfully');
            setStep('otp');
        } catch (err: any) {
            console.error('[Change Email] Error:', err);
            const errorMsg = err instanceof Error ? err.message : 'Không thể gửi mã OTP. Vui lòng thử lại.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmailChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!otp) {
            setError('Vui lòng nhập mã OTP');
            return;
        }

        setLoading(true);
        try {
            console.log('[Verify Email Change] Verifying OTP...');
            const { verifyEmailChangeOtp } = await import('../services/api');
            const result = await verifyEmailChangeOtp(otp, token || '');
            console.log('[Verify Email Change] Email changed successfully');
            updateUser(result);
            navigate('/profile');
        } catch (err: any) {
            console.error('[Verify Email Change] Error:', err);
            const errorMsg = err instanceof Error ? err.message : 'Xác thực OTP thất bại. Vui lòng kiểm tra mã.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Vui lòng đăng nhập để đổi email</p>
                <Link to="/login">
                    <Button className="mt-4">Đăng Nhập</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Đổi Email</h1>
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

                {step === 'email' && (
                    <form className="space-y-6" onSubmit={handleRequestEmailChange}>
                        <div>
                            <label htmlFor="currentEmail" className="block text-sm font-medium text-gray-700">
                                Email Hiện Tại
                            </label>
                            <input
                                id="currentEmail"
                                type="email"
                                value={user.email}
                                disabled
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                            />
                        </div>

                        <div>
                            <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700">
                                Email Mới
                            </label>
                            <input
                                id="newEmail"
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder="Nhập email mới"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Đang gửi mã...' : 'Tiếp Tục'}
                        </Button>
                    </form>
                )}

                {step === 'otp' && (
                    <form className="space-y-6" onSubmit={handleVerifyEmailChange}>
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                            <p className="text-sm text-blue-800">
                                Mã OTP đã được gửi đến email mới: <strong>{newEmail}</strong>
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
                                setStep('email');
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

export default ChangeEmailPage;
