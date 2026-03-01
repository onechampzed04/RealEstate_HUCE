import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <div className="bg-yellow-100 p-3 rounded-full mr-4">
            <AlertTriangle className="text-yellow-500 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className="text-gray-600 mb-8">
            {children}
        </div>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Đồng ý
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;