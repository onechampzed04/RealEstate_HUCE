import React, { useState } from 'react';
import Button from './Button';
import { requestNameChange, verifyNameChangeOtp } from '../services/api';
import useAuth from '../hooks/useAuth';

interface ChangeNameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const ChangeNameModal: React.FC<ChangeNameModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { user, token, updateUser } = useAuth();
    const [step, setStep] = useState<'name' | 'otp'>('name');
    const [newName, setNewName] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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

        if (newName === user?.name) {
            setError('Tên mới phải khác tên hiện tại');
            return;
        }

        setLoading(true);
        try {
            await requestNameChange(newName, token || '');
            setStep('otp');
        } catch (err: any) {
            setError(err instanceof Error ? err.message : 'Không thể gửi mã OTP. Vui lòng thử lại.');
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
            const result = await verifyNameChangeOtp(otp, token || '');
            updateUser(result.user || result);
            setStep('name');
            setNewName('');
            setOtp('');
            onClose();
            onSuccess?.();
        } catch (err: any) {
            setError(err instanceof Error ? err.message : 'Xác thực OTP thất bại. Vui lòng kiểm tra mã.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep('name');
        setNewName('');
        setOtp('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full mx-4">
                <h2 className="text-2xl font-bold mb-4">Sửa Tên</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {step === 'name' ? (
                    <form onSubmit={handleRequestNameChange}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Tên mới
                            </label>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="Nhập tên mới"
                            />
                            <p className="text-gray-500 text-xs mt-1">Tên hiện tại: {user?.name}</p>
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
                    <form onSubmit={handleVerifyNameChange}>
                        <div className="mb-4">
                            <p className="text-gray-600 mb-3">Mã OTP đã được gửi đến email hiện tại.<br></br>Vui lòng kiểm tra email của bạn.</p>
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
                                onClick={() => setStep('name')}
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

export default ChangeNameModal;
