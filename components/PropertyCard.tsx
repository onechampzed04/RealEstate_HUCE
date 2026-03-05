import React from 'react';
import { Link } from 'react-router-dom';
import type { Property } from '../types';
import { BedIcon, BathIcon, AreaIcon, MapPinIcon } from '../assets/icons';

interface PropertyCardProps {
  property: Property;
  viewMode?: 'grid' | 'list';
}

// Hàm format giá cực hay từ nhánh Than
const formatPrice = (price: number) => {
  if (price >= 1e9) {
    return `${(price / 1e9).toLocaleString('vi-VN')} tỷ`;
  }
  if (price >= 1e6) {
    return `${(price / 1e6).toLocaleString('vi-VN')} triệu`;
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const PropertyCard: React.FC<PropertyCardProps> = ({ property, viewMode = 'grid' }) => {
  
  // Giao diện chế độ LIST (Danh sách nằm ngang)
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300">
        <Link to={`/listings/${property._id}`} className="block">
          <div className="relative">
            {/* Grid ảnh thông minh */}
            <div className="grid grid-cols-3 gap-1 h-[250px]">
              <div className="col-span-2 h-full">
                <img 
                  className="h-full w-full object-cover" 
                  src={property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/800x600?text=No+Image'} 
                  alt={property.title} 
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Error'; }}
                />
              </div>
              <div className="col-span-1 grid grid-rows-2 gap-1 h-full">
                <img 
                  className="h-full w-full object-cover" 
                  src={property.images && property.images.length > 1 ? property.images[1] : 'https://via.placeholder.com/400x300?text=No+Image'} 
                  alt={property.title} 
                />
                <div className="relative h-full">
                  <img 
                    className="h-full w-full object-cover" 
                    src={property.images && property.images.length > 2 ? property.images[2] : 'https://via.placeholder.com/400x300?text=No+Image'} 
                    alt={property.title} 
                  />
                  {property.images && property.images.length > 3 && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white font-medium">
                      <span>+{property.images.length - 3}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-2 py-1 uppercase rounded-br-lg">
              Vip Kim Cương
            </div>
          </div>
          
          <div className="p-5">
            <h3 className="font-bold text-[#1A237E] uppercase mb-2 text-lg leading-snug line-clamp-2">
              {property.title}
            </h3>
            
            <div className="flex flex-wrap items-center text-[15px] mb-3 text-gray-700 gap-y-2">
              <span className="text-red-600 font-bold mr-3">{formatPrice(property.price)}</span>
              <span className="text-gray-400 mr-3">·</span>
              <span className="text-red-600 font-bold mr-3">{property.area} m²</span>
              
              {property.bedrooms && (
                <span className="flex items-center ml-2 mr-3 text-gray-600">
                  <BedIcon className="h-4 w-4 mr-1 text-primary"/> {property.bedrooms}
                </span>
              )}
              {property.bathrooms && (
                <span className="flex items-center mr-3 text-gray-600">
                  <BathIcon className="h-4 w-4 mr-1 text-primary"/> {property.bathrooms}
                </span>
              )}
              
              <span className="truncate flex-1 min-w-[150px] flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1 text-gray-400"/>
                {property.location?.city || property.city}
              </span>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
              {property.description}
            </p>
            
            {/* Footer với thông tin người đăng */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-3">
                  {property.user?.name ? property.user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{property.user?.name || 'Người đăng'}</div>
                  <div className="text-xs text-gray-400">Đăng ngày {new Date(property.createdAt || Date.now()).toLocaleDateString('vi-VN')}</div>
                </div>
              </div>
              
              <button className="bg-[#009688] hover:bg-[#00796B] text-white px-4 py-2 rounded font-medium text-sm transition-colors">
                 📞 {property.user?.phone || 'Liên hệ'}
              </button>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Giao diện mặc định GRID (Ô lưới)
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300">
      <Link to={`/listings/${property._id}`} className="flex-grow flex flex-col">
        <div className="relative">
          <img 
            className="h-48 w-full object-cover" 
            src={property.images && property.images.length > 0 ? property.images[0] : (property as any).imageUrl || 'https://via.placeholder.com/400x300'} 
            alt={property.title} 
          />
          <div className="absolute top-2 right-2 bg-secondary/80 text-white px-2 py-0.5 rounded text-xs">
            {property.status}
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-[#1A237E] uppercase mb-2 line-clamp-2 min-h-[2.5rem] leading-tight text-[14px]">
            {property.title}
          </h3>
          <div className="flex items-center mb-2">
            <span className="text-red-600 font-bold text-[15px]">{formatPrice(property.price)}</span>
            <span className="mx-2 text-gray-400">·</span>
            <span className="text-red-600 font-bold text-[15px]">{property.area} m²</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{property.location?.city || property.city}</span>
          </div>
          
          <div className="mt-auto pt-3 flex justify-between items-center border-t border-gray-50">
             <div className="flex space-x-3 text-gray-500 text-xs">
                <span className="flex items-center"><BedIcon className="h-3 w-3 mr-1"/>{property.bedrooms}</span>
                <span className="flex items-center"><AreaIcon className="h-3 w-3 mr-1"/>{property.area}</span>
             </div>
             <button className="p-1.5 border border-gray-200 rounded hover:bg-red-50 group">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:fill-red-500 group-hover:stroke-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
             </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;