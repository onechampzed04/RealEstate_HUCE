import React, { useState, useEffect } from 'react';
import { fetchProperties } from '../services/api';
import type { Property } from '../types';
import PropertyCard from '../components/PropertyCard';
import Spinner from '../components/Spinner';

const ListingsPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');

  // Load toàn bộ khi vào trang lần đầu
  useEffect(() => {
    handleSearch();
  }, []);

  // Hàm tìm kiếm
  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await fetchProperties(keyword, type, price);
      setProperties(data);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Danh Sách Bất Động Sản
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Khám phá tất cả các bất động sản đang được rao bán và cho thuê.
          </p>
        </div>

        {/* Filter Section */}
        <div className="mt-8 p-4 rounded-lg bg-gray-100 flex flex-wrap gap-4 items-center justify-center">

          {/* Keyword */}
          <input
            type="text"
            placeholder="Tìm kiếm theo địa chỉ, thành phố..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="p-2 border rounded-md w-full md:w-1/3"
          />

          {/* Type */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Loại hình</option>
            <option value="House">Nhà</option>
            <option value="Apartment">Căn hộ</option>
            <option value="Villa">Biệt thự</option>
            <option value="Land">Đất</option>
          </select>

          {/* Price */}
          <select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Mức giá</option>
            <option value="under5">Dưới 5 tỷ</option>
            <option value="5to10">5 - 10 tỷ</option>
            <option value="above10">Trên 10 tỷ</option>
          </select>

          {/* Button */}
          <button
            onClick={handleSearch}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
          >
            Tìm Kiếm
          </button>
        </div>

        {/* Listing */}
        {loading ? (
          <Spinner />
        ) : (
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {properties.length > 0 ? (
              properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                Không tìm thấy bất động sản phù hợp.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingsPage;
