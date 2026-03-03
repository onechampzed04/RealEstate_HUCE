
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchFeaturedProperties } from '../services/api';
import type { Property } from '../types';
import PropertyCard from '../components/PropertyCard';
import Spinner from '../components/Spinner';
import Button from '../components/Button';

const HomePage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await fetchFeaturedProperties();
        setProperties(data);
      } catch (error) {
        console.error("Failed to fetch featured properties:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProperties();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gray-800">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://picsum.photos/seed/hero/1920/1080"
            alt="Hero background"
          />
          <div className="absolute inset-0 bg-gray-800 opacity-60"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Tìm Kiếm Ngôi Nhà Mơ Ước
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-xl text-indigo-100">
            Khám phá hàng ngàn bất động sản và sử dụng công cụ định giá thông minh của chúng tôi.
          </p>
          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/listings">
              <Button size="lg" variant="primary">Xem Bất Động Sản</Button>
            </Link>
            <Link to="/valuation">
              <Button size="lg" variant="secondary">Thử Định Giá</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Bất Động Sản Nổi Bật</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Những lựa chọn tốt nhất được tuyển chọn dành riêng cho bạn.
            </p>
          </div>
          {loading ? (
            <Spinner />
          ) : (
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
