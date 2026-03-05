import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from './Button';
import AvatarPlaceholder from './AvatarPlaceholder';
import { fetchMyActivePackage, createPaymentLink, checkOrderStatus } from '../services/api';
import type { Package } from '../types';

// Import modal mới
import PackageModal from './PackageModal';
import PaymentModal from './PaymentModal';
import WaitingForPaymentModal from './WaitingForPaymentModal';
import PaymentResultModal from './PaymentResultModal';
import ConfirmationModal from './ConfirmationModal'; // <-- IMPORT MODAL XÁC NHẬN

const Header: React.FC = () => {
  const { user, logout, token } = useAuth();
  const pollingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // === STATE QUẢN LÝ LUỒNG MỚI ===
  const [activeUserPackage, setActiveUserPackage] = useState<any | null>(null); // Lưu trữ toàn bộ gói active
  const [isHovering, setIsHovering] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Quản lý các modal
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [paymentData, setPaymentData] = useState<{ orderCode: number; checkoutUrl: string } | null>(null);
  const [paymentResult, setPaymentResult] = useState<{ success: boolean; message: string } | null>(null);

  const fetchUserPackage = async () => {
    if (user && token) {
      try {
        const pkg = await fetchMyActivePackage(token);
        setActiveUserPackage(pkg);
      } catch (error) {
        console.error("Failed to fetch active package:", error);
        setActiveUserPackage(null);
      }
    } else {
        setActiveUserPackage(null);
    }
  };

  useEffect(() => {
    fetchUserPackage();
  }, [user, token]);

  // Luồng Polling không thay đổi
  useEffect(() => {
    if (paymentData && token) {
      pollingInterval.current = setInterval(async () => {
        try {
          const data = await checkOrderStatus(paymentData.orderCode, token);
          if (data.status === 'PAID') handlePaymentSuccess();
        } catch (error) { console.error("Polling error:", error); }
      }, 3000);
    }
    return () => { if (pollingInterval.current) clearInterval(pollingInterval.current); };
  }, [paymentData, token]);


  // === CÁC HÀM XỬ LÝ LUỒNG MỚI ===
  
  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg); // Lưu lại gói người dùng muốn mua
    setIsPackageModalOpen(false);

    if (activeUserPackage) {
      // Nếu đang có gói active, mở modal xác nhận
      setIsConfirmationOpen(true);
    } else {
      // Nếu không, mở thẳng modal thanh toán
      setIsPaymentOpen(true);
    }
  };

  const handleConfirmAndProceedToPayment = () => {
    // Khi người dùng đồng ý hủy gói cũ
    setIsConfirmationOpen(false);
    setIsPaymentOpen(true); // Mở modal thanh toán
  };

  const handleCreatePayment = async () => {
    if (!selectedPackage || !token) return;
    setLoading(true);
    try {
      const data = await createPaymentLink(selectedPackage._id, token);
      if (data.checkoutUrl) {
        setIsPaymentOpen(false); // Đóng modal thanh toán
        setPaymentData({ orderCode: data.orderCode, checkoutUrl: data.checkoutUrl });
        window.open(data.checkoutUrl, '_blank');
      }
    } catch (error: any) {
      setPaymentResult({ success: false, message: error.message || "Lỗi tạo link thanh toán." });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePaymentSuccess = () => {
    if (pollingInterval.current) clearInterval(pollingInterval.current);
    setPaymentData(null);
    setPaymentResult({ success: true, message: "Giao dịch thành công! Gói cước của bạn đã được cập nhật." });
    fetchUserPackage(); // Lấy lại thông tin gói mới nhất
  };

  const cancelPaymentProcess = () => {
    if (pollingInterval.current) clearInterval(pollingInterval.current);
    setPaymentData(null);
    setIsPackageModalOpen(true);
  };

  const closeAllResultModals = () => {
    setPaymentResult(null);
  };
  
  const navLinkClasses = ({ isActive }: { isActive: boolean }): string =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-200'
    }`;
  
  const remainingPosts = activeUserPackage?.remainingPosts ?? 0;
  
  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-40">
        {/* Giữ nguyên phần render header, không thay đổi gì */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <span className="text-2xl font-bold text-primary">HUCE 1 TY</span>
              </Link>
              <nav className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <NavLink to="/" className={navLinkClasses}>Trang Chủ</NavLink>
                  <NavLink to="/listings" className={navLinkClasses}>Bất Động Sản</NavLink>
                  <NavLink to="/valuation" className={navLinkClasses}>Định Giá</NavLink>
                </div>
              </nav>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center gap-2">
                      <AvatarPlaceholder
                        name={user.name}
                        avatarUrl={
                          typeof user.avatar === 'object' && user.avatar !== null
                            ? user.avatar.url || undefined
                            : typeof user.avatar === 'string'
                              ? user.avatar
                              : undefined
                        }
                        size="sm"
                      />
                      <span className="text-gray-700">Chào, {user.name}</span>
                    </div>
                    {activeUserPackage !== undefined && (
                      <Button
                        variant="primary"
                        size="sm"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        onClick={() => setIsPackageModalOpen(true)}
                      >
                        {isHovering ? 'Mua Credit?' : `Credits: ${remainingPosts}`}
                      </Button>
                    )}
                    <Link to="/profile">
                      <Button variant="secondary" size="sm">Hồ Sơ</Button>
                    </Link>
                    <Button onClick={logout} variant="outline" size="sm">Đăng Xuất</Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link to="/login"><Button variant="outline">Đăng Nhập</Button></Link>
                    <Link to="/register"><Button variant="primary">Đăng Ký</Button></Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Quản lý hiển thị các Modal */}
      <PackageModal
        isOpen={isPackageModalOpen}
        onClose={() => setIsPackageModalOpen(false)}
        onSelectPackage={handleSelectPackage}
        activePackageId={activeUserPackage?.package?._id || activeUserPackage?.package}
      />
      
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleConfirmAndProceedToPayment}
        title="Xác nhận thay đổi gói"
      >
        <p>Bạn đang có một gói dịch vụ đang hoạt động. Mua gói mới sẽ <strong className="font-bold text-red-600">xóa bỏ hoàn toàn</strong> gói cước hiện tại của bạn.</p>
        <p className="mt-2">Bạn có chắc chắn muốn tiếp tục không?</p>
      </ConfirmationModal>

      {selectedPackage && (
        <PaymentModal
          isOpen={isPaymentOpen}
          pkg={selectedPackage}
          onClose={() => setIsPaymentOpen(false)}
          onSubmit={handleCreatePayment}
          loading={loading}
        />
      )}

      {paymentData && (
        <WaitingForPaymentModal
            orderCode={paymentData.orderCode}
            checkoutUrl={paymentData.checkoutUrl}
            onCancel={cancelPaymentProcess}
        />
      )}
      
      {paymentResult && (
        <PaymentResultModal
            result={paymentResult}
            onClose={closeAllResultModals}
        />
      )}
    </>
  );
};

export default Header;