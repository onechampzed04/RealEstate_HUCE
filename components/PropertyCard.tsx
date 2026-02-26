
import React from 'react';
import { Link } from 'react-router-dom';
import type { Property } from '../types';
import { BedIcon, BathIcon, AreaIcon, MapPinIcon } from '../assets/icons';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
      <Link to={`/listings/${property._id}`}>
        <div className="relative">
          <img className="h-56 w-full object-cover" src={property.imageUrl} alt={property.title} />
          <div className="absolute top-0 right-0 bg-secondary text-white px-3 py-1 m-2 rounded-md text-sm font-semibold">
            {property.status}
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-xl text-gray-900 mb-2 truncate">{property.title}</h3>
            <span className="text-xl font-bold text-primary">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(property.price)}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
            <span className="truncate">
              {property.address}, {property.city}
            </span>
          </div>

          {property.distance !== undefined && (
            <div className="text-sm text-green-600 font-medium mb-2">
              📍 Cách bạn {(property.distance / 1000).toFixed(2)} km
            </div>
          )}
          <div className="flex justify-around items-center text-gray-700 border-t pt-4">
            <div className="flex items-center space-x-2">
              <BedIcon className="h-5 w-5 text-primary"/>
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center space-x-2">
              <BathIcon className="h-5 w-5 text-primary"/>
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center space-x-2">
              <AreaIcon className="h-5 w-5 text-primary"/>
              <span>{property.area} m²</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
