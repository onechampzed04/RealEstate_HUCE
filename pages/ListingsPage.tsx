
import React, { useState, useEffect } from 'react';
import { fetchProperties } from '../services/api';
import type { Property } from '../types';
import PropertyCard from '../components/PropertyCard';
import Spinner from '../components/Spinner';

const ListingsPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await fetchProperties();
        setProperties(data);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProperties();
  }, []);

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">Danh Sách Bất Động Sản</h1>
          <p className="mt-4 text-lg text-gray-500">Khám phá tất cả các bất động sản đang được rao bán và cho thuê.</p>
        </div>
        
        {/* Filter Section - Placeholder */}
        <div className="mt-8 p-4 rounded-lg bg-gray-100 flex flex-wrap gap-4 items-center justify-center">
          <input type="text" placeholder="Tìm kiếm theo địa chỉ, thành phố..." className="p-2 border rounded-md w-full md:w-1/3"/>
          <select className="p-2 border rounded-md">
            <option>Loại hình</option>
            <option>Nhà</option>
            <option>Căn hộ</option>
            <option>Biệt thự</option>
          </select>
           <select className="p-2 border rounded-md">
            <option>Mức giá</option>
            <option>Dưới 5 tỷ</option>
            <option>5 - 10 tỷ</option>
            <option>Trên 10 tỷ</option>
          </select>
          <button className="bg-primary text-white px-4 py-2 rounded-md">Tìm Kiếm</button>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingsPage;
