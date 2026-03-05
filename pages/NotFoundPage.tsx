
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-screen bg-gray-100">
      <h1 className="text-9xl font-extrabold text-primary tracking-widest">404</h1>
      <div className="bg-secondary px-2 text-sm rounded rotate-12 absolute">
        Không Tìm Thấy Trang
      </div>
      <p className="text-2xl md:text-3xl font-light text-gray-600 mt-4">
        Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
      </p>
      <Link to="/" className="mt-8">
        <Button variant="primary" size="lg">Về Trang Chủ</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
