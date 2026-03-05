
import React from 'react';
import { Link } from 'react-router-dom';
import type { Property } from '../types';
import { MapPinIcon } from '../assets/icons';

interface PropertyCardProps {
  property: Property;
  viewMode?: 'grid' | 'list';
}

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
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300">
        <Link to={`/listings/${property._id}`} className="block">
          <div className="relative">
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
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Error'; }}
                />
                <div className="relative h-full">
                  <img 
                    className="h-full w-full object-cover" 
                    src={property.images && property.images.length > 2 ? property.images[2] : 'https://via.placeholder.com/400x300?text=No+Image'} 
                    alt={property.title} 
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Error'; }}
                  />
                  {property.images && property.images.length > 3 && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white font-medium cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                      {property.images.length}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Tag VIP/Badge could go here */}
            <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-2 py-1 uppercase rounded-br-lg">
              Vip Kim Cương
            </div>
          </div>
          <div className="p-5">
            <h3 className="font-bold text-[#1A237E] uppercase mb-2 text-lg leading-snug">
              <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded mr-2 align-middle border border-green-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 inline mr-1 -mt-0.5">
                  <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                Xác thực
              </span>
              {property.title}
            </h3>
            
            <div className="flex flex-wrap items-center text-[15px] mb-3 text-gray-700 gap-y-2">
              <span className="text-red-600 font-bold mr-3">{formatPrice(property.price)}</span>
              <span className="text-gray-400 mr-3">·</span>
              <span className="text-red-600 font-bold mr-3">{property.area} m²</span>
              <span className="text-gray-400 mr-3">·</span>
              <span className="mr-3">{property.price / property.area > 0 ? (property.price / property.area / 1e6).toFixed(2) : 0} tr/m²</span>
              
              {property.bedrooms && property.bedrooms > 0 && (
                <>
                  <span className="text-gray-400 mr-3">·</span>
                  <span className="flex items-center mr-3">
                    {property.bedrooms} <span className="ml-1 text-gray-500 text-lg leading-none">🛏</span>
                  </span>
                </>
              )}
              {property.bathrooms && property.bathrooms > 0 && (
                <>
                  <span className="text-gray-400 mr-3">·</span>
                  <span className="flex items-center mr-3">
                    {property.bathrooms} <span className="ml-1 text-gray-500 text-lg leading-none">🛁</span>
                  </span>
                </>
              )}
              <span className="text-gray-400 mr-3">·</span>
              <span className="truncate flex-1 min-w-[150px]">{property.location?.city || property.location?.address}</span>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
              {property.description}
            </p>
            
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-blue-800 font-bold mr-3 border border-gray-200 overflow-hidden">
                  {property.user?.name ? property.user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{property.user?.name || 'Người đăng'}</div>
                  <div className="text-xs text-gray-400">
                    {property.createdAt 
                      ? `Đăng ngày ${new Date(property.createdAt).toLocaleDateString('vi-VN')}` 
                      : 'Đăng hôm nay'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  className="bg-[#009688] hover:bg-[#00796B] text-white px-4 py-2 rounded font-medium flex items-center transition-colors text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                  </svg>
                  {property.user?.phone ? `${property.user.phone.slice(0, 4)} ${property.user.phone.slice(4, 10)} ` : ''} 
                </button>
                <button 
                  className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle favorite toggle here
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Default Grid View
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300">
      <Link to={`/listings/${property._id}`} className="flex-grow flex flex-col">
        <div className="relative">
          <img 
            className="h-48 w-full object-cover" 
            src={property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/400x300?text=No+Image'} 
            alt={property.title} 
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Error';
            }}
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-[#1A237E] uppercase mb-2 line-clamp-2 min-h-[3rem] leading-tight text-[15px]">
            {property.title}
          </h3>
          <div className="flex items-center mb-2">
            <span className="text-red-600 font-bold text-[15px]">{formatPrice(property.price)}</span>
            <span className="mx-2 text-gray-400">·</span>
            <span className="text-red-600 font-bold text-[15px]">{property.area} m²</span>
          </div>
          <div className="flex items-center text-gray-600 mb-4 text-sm">
            <MapPinIcon className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" />
            <span className="truncate">{property.location?.city || property.location?.address}</span>
          </div>
          
          <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-100">
            <span className="text-xs text-gray-400">
              {property.createdAt 
                ? `Đăng ngày ${new Date(property.createdAt).toLocaleDateString('vi-VN')}` 
                : 'Đăng hôm nay'}
            </span>
            <button 
              className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // Handle favorite toggle here
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-600">
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
