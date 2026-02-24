
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from './Button';
import AvatarPlaceholder from './AvatarPlaceholder';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const navLinkClasses = ({ isActive }: { isActive: boolean }): string =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-primary text-white'
        : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
    }`;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
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
                      avatarUrl={user.avatar?.url || undefined}
                      size="sm"
                    />
                    <span className="text-gray-700">Chào, {user.name}</span>
                  </div>
                  <Link to="/profile">
                    <Button variant="secondary" size="sm">Hồ Sơ</Button>
                  </Link>
                  <Button onClick={logout} variant="outline" size="sm">Đăng Xuất</Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="outline">Đăng Nhập</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary">Đăng Ký</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
