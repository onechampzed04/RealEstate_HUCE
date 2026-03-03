import React from 'react';
import type { Package } from '../types';
import Button from './Button';
import { CreditCard, XCircle } from 'lucide-react';

interface PaymentModalProps {
  pkg: Package;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ pkg, isOpen, onClose, onSubmit, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1">Xác nhận thanh toán</h2>
              <p className="text-slate-500">Vui lòng kiểm tra thông tin gói cước</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
            <div className="flex justify-between mb-4">
              <span className="text-slate-500">Tên gói</span>
              <span className="font-medium">{pkg.name}</span>
            </div>
            <div className="h-px bg-slate-200 my-4" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Tổng cộng</span>
              <span className="text-2xl font-bold text-primary">
                {pkg.price.toLocaleString('vi-VN')} VNĐ
              </span>
            </div>
          </div>

          <Button
            disabled={loading}
            onClick={onSubmit}
            className="w-full text-lg"
          >
            {loading ? 'Đang xử lý...' : (
              <div className='flex items-center justify-center gap-2'>
                <CreditCard />
                <span>Thanh toán qua PayOS</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;