import React from 'react';
import { Link } from 'react-router-dom';
import type { Property } from '../types';
import { MapPinIcon } from '../assets/icons';

interface PropertyCardProps {
  property: Property;
  viewMode?: 'grid' | 'list';
}

const formatPrice = (price: number) => {
  if (price >= 1e9) return `${(price / 1e9).toLocaleString('vi-VN')} tỷ`;
  if (price >= 1e6) return `${(price / 1e6).toLocaleString('vi-VN')} triệu`;
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const PropertyCard: React.FC<PropertyCardProps> = ({ property, viewMode = 'grid' }) => {
  const getImg = (index: number) => {
    if (property.images?.[index]) return property.images[index];
    return `https://via.placeholder.com/400x300?text=No+Image`;
  };

  // Helper để tránh chia cho 0 hoặc undefined
  const pricePerM2 = property.area && property.area > 0
    ? (property.price / property.area / 1e6).toFixed(1)
    : '—';

  const areaDisplay = property.area ? `${property.area} m²` : '— m²';

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
        <Link to={`/listings/${property._id}`} className="flex flex-col md:flex-row h-full">
          {/* Image Section */}
          <div className="relative w-full md:w-[400px] flex-shrink-0 bg-gray-100">
            <div className="grid grid-cols-3 gap-0.5 h-64 md:h-full min-h-[250px]">
              <div className="col-span-2 overflow-hidden">
                <img
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                  src={getImg(0)}
                  alt={property.title}
                />
              </div>
              <div className="col-span-1 grid grid-rows-2 gap-0.5">
                <div className="overflow-hidden">
                  <img className="h-full w-full object-cover" src={getImg(1)} alt="" />
                </div>
                <div className="relative overflow-hidden">
                  <img className="h-full w-full object-cover" src={getImg(2)} alt="" />
                  {property.images && property.images.length > 3 && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-xs font-bold">
                      +{property.images.length - 2} ảnh
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase rounded shadow-sm">
              Vip Kim Cương
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-grow min-w-0">
            <h3 className="font-bold text-[#1A237E] uppercase mb-2 text-base line-clamp-2">
              <span className="inline-flex items-center bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded mr-2 border border-green-200 shrink-0">
                ✓ Xác thực
              </span>
              {property.title}
            </h3>

            <div className="flex flex-wrap items-center text-sm mb-3 text-gray-700 gap-2">
              <span className="text-red-600 font-bold">{formatPrice(property.price)}</span>
              <span className="text-gray-300">|</span>
              <span className="text-red-600 font-bold">{areaDisplay}</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500">{pricePerM2} tr/m²</span>
            </div>

            <div className="flex items-center text-gray-500 text-sm mb-3">
              <MapPinIcon className="h-4 w-4 mr-1 shrink-0" />
              <span className="truncate">
                {property.location?.city || property.location?.address || 'Chưa cập nhật vị trí'}
              </span>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2 mb-4 hidden md:block">
              {property.description || 'Không có mô tả'}
            </p>

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
              <div className="flex items-center overflow-hidden">
                <div className="h-8 w-8 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center text-blue-700 font-bold text-xs border border-blue-100">
                  {property.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="ml-2 text-xs font-medium text-gray-700 truncate max-w-[100px]">
                  {property.user?.name || 'Người đăng'}
                </span>
              </div>

              <div className="flex gap-2">
                <button className="bg-[#009688] hover:bg-[#00796B] text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">
                  GỌI ĐIỆN
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300 h-full">
      <Link to={`/listings/${property._id}`} className="flex flex-col h-full">
        <div className="relative w-full pt-[66.67%] overflow-hidden bg-gray-100">
          <img
            className="absolute inset-0 h-full w-full object-cover hover:scale-110 transition-transform duration-700"
            src={getImg(0)}
            alt={property.title}
            loading="lazy"
          />
          <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">
            VIP
          </div>
        </div>

        <div className="p-3 flex flex-col flex-grow">
          <h3 className="font-bold text-[#1A237E] uppercase mb-2 line-clamp-2 text-sm h-10 leading-tight">
            {property.title}
          </h3>
          <div className="flex items-center justify-between mb-3">
            <span className="text-red-600 font-bold text-sm">{formatPrice(property.price)}</span>
            <span className="text-red-600 font-bold text-sm">{areaDisplay}</span>
          </div>
          <div className="flex items-center text-gray-500 text-xs mb-3 mt-auto">
            <MapPinIcon className="h-3 w-3 mr-1 shrink-0" />
            <span className="truncate">
              {property.location?.city || property.location?.address || 'Chưa cập nhật'}
            </span>
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-gray-100 text-[10px] text-gray-400">
            <span>
              {property.createdAt
                ? new Date(property.createdAt).toLocaleDateString('vi-VN')
                : 'Vừa xong'}
            </span>
            <button className="text-gray-400 hover:text-red-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;