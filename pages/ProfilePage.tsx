import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import Button from "../components/Button";
import { FaEdit } from "react-icons/fa";
import ChangePasswordModal from "../components/ChangePasswordModal";
import ChangeNameModal from "../components/ChangeNameModal";
import ChangeEmailModal from "../components/ChangeEmailModal";
import ChangePhoneModal from "../components/ChangePhoneModal";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Của Tôi</h1>
        <div className="flex gap-2">
          <Button
            size="lg"
            variant="primary"
            onClick={() => setPasswordModalOpen(true)}
          >
            Đổi Mật Khẩu
          </Button>
        </div>
      </div>
      <div className="mt-8 bg-white p-8 rounded-lg shadow-md">
        <p className="flex gap-2 items-center">
          <strong>Tên:</strong> {user?.name}
          <button
            onClick={() => setNameModalOpen(true)}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaEdit className="mr-2" />
          </button>
        </p>
        <p className="flex gap-2 items-center">
          <strong>Số điện thoại:</strong> {user?.phone}
          <button
            onClick={() => setPhoneModalOpen(true)}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaEdit className="mr-2" />
          </button>
        </p>
        <p className="flex gap-2 items-center">
          <strong>Email:</strong> {user?.email}
          <button
            onClick={() => setEmailModalOpen(true)}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaEdit className="mr-2" />
          </button>
        </p>
        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
          Bất động sản của tôi
        </h2>
        <div className="text-center text-gray-500 p-8 border-2 border-dashed rounded-lg">
          <p>Chức năng quản lý bất động sản sẽ được phát triển ở đây.</p>
          <p>Bạn chưa đăng bất động sản nào.</p>
        </div>
      </div>

      {/* Modals */}
      <ChangePasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
      <ChangeNameModal
        isOpen={nameModalOpen}
        onClose={() => setNameModalOpen(false)}
      />
      <ChangeEmailModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
      />
      <ChangePhoneModal
        isOpen={phoneModalOpen}
        onClose={() => setPhoneModalOpen(false)}
      />
    </div>
  );
};

export default ProfilePage;
