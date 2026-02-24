import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import Button from './Button';

interface ResultModalProps {
  result: { success: boolean; message: string };
  onClose: () => void;
}

const PaymentResultModal: React.FC<ResultModalProps> = ({ result, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
      <div className="relative bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border">
        {result.success ? (
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
        ) : (
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
        )}
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {result.success ? "Thanh toán thành công!" : "Thanh toán thất bại"}
        </h2>
        <p className="text-slate-600 mb-8">{result.message}</p>
        <Button onClick={onClose} className="w-full">
          Đóng
        </Button>
      </div>
    </div>
  );
};

export default PaymentResultModal;