import React from 'react';
import { Loader2 } from 'lucide-react';

interface WaitingModalProps {
  orderCode: number;
  checkoutUrl: string;
  onCancel: () => void;
}

const WaitingForPaymentModal: React.FC<WaitingModalProps> = ({ orderCode, checkoutUrl, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
      <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8 text-center">
        <div className="mb-8">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Đang chờ thanh toán</h2>
          <p className="text-slate-500">Vui lòng hoàn tất thanh toán tại cửa sổ PayOS vừa mở.</p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Mã đơn hàng:</span>
            <span className="font-mono font-bold">#{orderCode}</span>
          </div>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => window.open(checkoutUrl, '_blank')}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
          >
            Mở lại trang thanh toán
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaitingForPaymentModal;