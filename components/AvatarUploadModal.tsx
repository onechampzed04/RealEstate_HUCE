import React, { useState } from 'react';
import { uploadAvatar } from '../services/api';
import Spinner from './Spinner';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (avatarUrl: string) => void;
  token: string | null;
}

interface UploadedAvatarData {
  avatarUrl: string;
  avatarPublicId: string;
  avatar?: {
    url: string;
    publicId: string;
  };
}

const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  token,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadedData, setUploadedData] = useState<UploadedAvatarData | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !token) {
      setError('Vui lòng chọn ảnh');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn một tệp hình ảnh');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await uploadAvatar(file, token);
      const avatarUrl = result.avatar?.url || result.avatarUrl;
      const avatarPublicId = result.avatar?.publicId || result.avatarPublicId;
      
      setPreviewImage(avatarUrl);
      setUploadedData({
        avatarUrl,
        avatarPublicId,
        avatar: result.avatar,
      });
    } catch (err: any) {
      setError(err.message || 'Tải lên thất bại');
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirm = () => {
    if (uploadedData) {
      onUploadSuccess(uploadedData.avatarUrl);
      handleClose();
    }
  };

  const handleClose = () => {
    setPreviewImage(null);
    setUploadedData(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-bold mb-4">Tải lên ảnh đại diện</h2>

        {!previewImage ? (
          <div className="mb-4">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={loading}
                className="hidden"
              />
              {loading ? (
                <div className="flex justify-center">
                  <Spinner />
                </div>
              ) : (
                <>
                  <p className="text-gray-600">
                    Nhấp để chọn ảnh hoặc kéo thả tệp vào đây
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Định dạng: PNG, JPG, GIF (Tối đa 5MB)
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">Xem trước ảnh đại diện:</p>
            <div className="flex justify-center mb-4">
              <img
                src={previewImage}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
              />
            </div>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={loading}
                className="hidden"
              />
              {loading ? (
                <div className="flex justify-center py-4">
                  <Spinner />
                </div>
              ) : (
                <p className="text-sm text-gray-600 py-2">Nhấp để chọn ảnh khác</p>
              )}
            </div>
          </div>
        )}

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <div className="flex gap-2 justify-end">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Hủy
          </button>
          {previewImage && (
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Xác nhận
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarUploadModal;
