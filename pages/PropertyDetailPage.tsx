
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPropertyById } from '../services/api';
import type { Property } from '../types';
import Spinner from '../components/Spinner';
import NotFoundPage from './NotFoundPage';
import { BedIcon, BathIcon, AreaIcon, MapPinIcon } from '../assets/icons';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const loadProperty = async () => {
      try {
        const data = await fetchPropertyById(id);
        if (data) {
          setProperty(data);
        }
      } catch (error) {
        console.error("Failed to fetch property:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProperty();
  }, [id]);

  if (loading) return <Spinner />;
  if (!property) return <NotFoundPage />;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{property.title}</h1>
          <div className="mt-2 flex items-center text-lg text-gray-500">
            <MapPinIcon className="h-6 w-6 mr-2" />
            <span>{property.address}, {property.city}</span>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <img src={property.imageUrl} alt={property.title} className="w-full h-96 object-cover rounded-lg shadow-md" />
          <div className="grid grid-cols-2 gap-4">
            {property.gallery.slice(0, 4).map((img, index) => (
              <img key={index} src={img} alt={`${property.title} gallery ${index + 1}`} className="w-full h-full object-cover rounded-lg shadow-md" />
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-4xl font-bold text-primary">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(property.price)}</span>
                    <span className="bg-secondary text-white px-4 py-2 rounded-full text-lg font-semibold">{property.status}</span>
                </div>
                 <div className="flex justify-around items-center text-gray-700 border p-4 rounded-lg shadow-sm mb-6">
                    <div className="flex items-center space-x-2 text-lg">
                        <BedIcon className="h-7 w-7 text-primary"/>
                        <span>{property.bedrooms} Phòng ngủ</span>
                    </div>
                    <div className="flex items-center space-x-2 text-lg">
                        <BathIcon className="h-7 w-7 text-primary"/>
                        <span>{property.bathrooms} Phòng tắm</span>
                    </div>
                    <div className="flex items-center space-x-2 text-lg">
                        <AreaIcon className="h-7 w-7 text-primary"/>
                        <span>{property.area} m²</span>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">Mô tả</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{property.description}</p>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">Đặc điểm</h2>
                <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-gray-600">
                    {property.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                            <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
            {/* Agent Info */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md h-fit">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Thông tin liên hệ</h3>
                <div className="flex items-center space-x-4">
                    <img src={property.agent.avatar} alt={property.agent.name} className="h-20 w-20 rounded-full" />
                    <div>
                        <p className="font-bold text-lg">{property.agent.name}</p>
                        <p className="text-gray-500">Chuyên viên tư vấn</p>
                    </div>
                </div>
                <button className="w-full bg-primary text-white py-3 mt-6 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
                    Liên Hệ: 09xx.xxx.xxx
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
