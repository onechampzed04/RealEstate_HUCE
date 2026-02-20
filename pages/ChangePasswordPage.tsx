import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const ChangePasswordPage: React.FC = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [step, setStep] = useState<'password' | 'otp'>('password');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');

    const handleRequestPasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!newPassword || !confirmPassword) {
            setError('Vui lòng điền đầy đủ mật khẩu');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setLoading(true);
        try {
            console.log('[Change Password] Requesting password change OTP...');
            const { requestPasswordChange } = await import('../services/api');
            await requestPasswordChange(newPassword, token || '');
            console.log('[Change Password] OTP sent successfully');
            setStep('otp');
        } catch (err: any) {
            console.error('[Change Password] Error:', err);
            const errorMsg = err instanceof Error ? err.message : 'Không thể gửi mã OTP. Vui lòng thử lại.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyPasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!otp) {
            setError('Vui lòng nhập mã OTP');
            return;
        }

        setLoading(true);
        try {
            console.log('[Verify Password Change] Verifying OTP...');
            const { verifyPasswordChangeOtp } = await import('../services/api');
            await verifyPasswordChangeOtp(otp, token || '');
            console.log('[Verify Password Change] Password changed successfully');
            navigate('/profile');
        } catch (err: any) {
            console.error('[Verify Password Change] Error:', err);
            const errorMsg = err instanceof Error ? err.message : 'Xác thực OTP thất bại. Vui lòng kiểm tra mã.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Vui lòng đăng nhập để đổi mật khẩu</p>
                <Link to="/login">
                    <Button className="mt-4">Đăng Nhập</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Đổi Mật Khẩu</h1>
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

                {step === 'password' && (
                    <form className="space-y-6" onSubmit={handleRequestPasswordChange}>
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                Mật Khẩu Mới
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder="Nhập mật khẩu mới"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Xác Nhận Mật Khẩu
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder="Xác nhận mật khẩu mới"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Đang gửi mã...' : 'Tiếp Tục'}
                        </Button>
                    </form>
                )}

                {step === 'otp' && (
                    <form className="space-y-6" onSubmit={handleVerifyPasswordChange}>
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
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder="Nhập mã OTP từ email"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Đang xác thực...' : 'Xác Thực OTP'}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ChangePasswordPage;
