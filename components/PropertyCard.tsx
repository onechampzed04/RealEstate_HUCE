
import React from 'react';
import { Link } from 'react-router-dom';
import type { Property } from '../types';
import { BedIcon, BathIcon, AreaIcon, MapPinIcon } from '../assets/icons';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const mainImage = property.images?.[0] || '/placeholder.jpg';

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(property.price);

  const transactionLabel =
    property.type === 'SALE' ? 'Bán' : 'Cho thuê';

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
      <Link to={`/listings/${property._id}`}>
        <div className="relative">
          <img
            className="h-56 w-full object-cover"
            src={mainImage}
            alt={property.title}
          />

          {/* Loại giao dịch */}
          <div className="absolute top-0 left-0 bg-primary text-white px-3 py-1 m-2 rounded-md text-sm font-semibold">
            {transactionLabel}
          </div>

          {/* Hot badge */}
          {property.isHot && (
            <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 m-2 rounded-md text-sm font-semibold">
              🔥 HOT
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-xl text-gray-900 mb-2 truncate">
              {property.title}
            </h3>
            <span className="text-xl font-bold text-primary">
              {formattedPrice}
            </span>
          </div>

          {/* Địa chỉ */}
          <div className="flex items-center text-gray-600 mb-2">
            <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
            <span className="truncate">
              {property.location?.address || 'Chưa cập nhật địa chỉ'}
              {property.location?.city &&
                `, ${property.location.city}`}
            </span>
          </div>

          {/* Thông tin phòng */}
          <div className="flex justify-around items-center text-gray-700 border-t pt-4">
            <div className="flex items-center space-x-2">
              <BedIcon className="h-5 w-5 text-primary" />
              <span>{property.bedrooms ?? 0}</span>
            </div>

            <div className="flex items-center space-x-2">
              <BathIcon className="h-5 w-5 text-primary" />
              <span>{property.bathrooms ?? 0}</span>
            </div>

            <div className="flex items-center space-x-2">
              <AreaIcon className="h-5 w-5 text-primary" />
              <span>{property.area ?? 0} m²</span>
            </div>
          </div>

          {/* Views */}
          <div className="text-sm text-gray-400 mt-3 text-right">
            👁 {property.views} lượt xem
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;