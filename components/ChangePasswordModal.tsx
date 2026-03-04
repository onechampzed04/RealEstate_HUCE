import React, { useState } from 'react';
import Button from './Button';
import { requestPasswordChange, verifyPasswordChangeOtp } from '../services/api';
import useAuth from '../hooks/useAuth';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
    const { token } = useAuth();
    const [step, setStep] = useState<'password' | 'otp'>('password');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
            await requestPasswordChange(newPassword, token || '');
            setStep('otp');
        } catch (err: any) {
            setError(err instanceof Error ? err.message : 'Không thể gửi mã OTP. Vui lòng thử lại.');
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
            await verifyPasswordChangeOtp(otp, token || '');
            setStep('password');
            setNewPassword('');
            setConfirmPassword('');
            setOtp('');
            onClose();
        } catch (err: any) {
            setError(err instanceof Error ? err.message : 'Xác thực OTP thất bại. Vui lòng kiểm tra mã.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep('password');
        setNewPassword('');
        setConfirmPassword('');
        setOtp('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full mx-4">
                <h2 className="text-2xl font-bold mb-4">Đổi Mật Khẩu</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {step === 'password' ? (
                    <form onSubmit={handleRequestPasswordChange}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Mật khẩu mới
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="Nhập mật khẩu mới"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Xác nhận mật khẩu
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="Xác nhận mật khẩu"
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button
                                type="submit"
                                disabled={loading}
                                variant="primary"
                                className="flex-1"
                            >
                                {loading ? 'Đang xử lý...' : 'Tiếp tục'}
                            </Button>
                            <Button
                                type="button"
                                onClick={handleClose}
                                variant="secondary"
                                className="flex-1"
                            >
                                Hủy
                            </Button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyPasswordChange}>
                        <div className="mb-4">
                            <p className="text-gray-600 mb-3">Mã OTP đã được gửi. Vui lòng kiểm tra email của bạn.</p>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Mã OTP
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="Nhập mã OTP"
                                maxLength={6}
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button
                                type="submit"
                                disabled={loading}
                                variant="primary"
                                className="flex-1"
                            >
                                {loading ? 'Đang xác thực...' : 'Xác thực'}
                            </Button>
                            <Button
                                type="button"
                                onClick={() => setStep('password')}
                                variant="secondary"
                                className="flex-1"
                            >
                                Quay lại
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ChangePasswordModal;
