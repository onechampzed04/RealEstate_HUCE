import React, { useState, useEffect } from 'react';
import { fetchProperties } from '../services/api';
import type { Property } from '../types';
import PropertyCard from '../components/PropertyCard';
import Spinner from '../components/Spinner';

const ListingsPage: React.FC = () => {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  // --- STATE BỘ LỌC (Kết hợp từ cả 2 nhánh) ---
  const [filters, setFilters] = useState({
    keyword: '',
    type: '',         // SALE | RENT
    propertyType: '', // HOUSE | APARTMENT | VILLA | LAND
    priceRange: '',
    city: '',
    page: 1
  });

  // activeFilters: Chỉ dùng để trigger useEffect khi người dùng nhấn "Tìm Kiếm"
  const [activeFilters, setActiveFilters] = useState({ ...filters });

  useEffect(() => {
    const fetchFilteredData = async () => {
      setLoading(true);
      try {
        // Gọi API với các tham số từ activeFilters
        const response = await fetchProperties(
          activeFilters.keyword,
          activeFilters.propertyType,
          activeFilters.priceRange,
          activeFilters.page,
          activeFilters.city,
          activeFilters.type
        );

        // Giả sử API trả về cấu trúc: { success: true, data: { listings: [], pagination: {} } }
        if (response.success) {
          setProperties(response.data.listings);
          setPagination(response.data.pagination);
        } else {
          // Fallback cho trường hợp API trả về mảng trực tiếp (nhánh cũ)
          setProperties(Array.isArray(response) ? response : []);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bài đăng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredData();
  }, [activeFilters]);

  // --- HANDLERS ---
  const onSearchClick = () => {
    setActiveFilters({ ...filters, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    const updated = { ...filters, page: newPage };
    setFilters(updated);
    setActiveFilters(updated);
  };

  const resetFilters = () => {
    const initial = { keyword: '', type: '', propertyType: '', priceRange: '', city: '', page: 1 };
    setFilters(initial);
    setActiveFilters(initial);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header Section (Style từ nhánh than) */}
      <div className="bg-[#1A237E]">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl font-extrabold mb-4">Danh Sách Bất Động Sản</h1>
          <p className="text-lg text-indigo-100">
            Khám phá hàng ngàn cơ hội đầu tư và an cư tốt nhất.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        {/* Filter Section (Giao diện hiện đại) */}
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            
            {/* Keyword Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Từ khóa</label>
              <input
                type="text"
                placeholder="Tìm kiếm khu vực, dự án..."
                value={filters.keyword}
                onChange={(e) => setFilters({...filters, keyword: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && onSearchClick()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Selects Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:w-[60%]">
              <select 
                value={filters.type} 
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="p-2.5 border border-gray-300 rounded-lg bg-white"
              >
                <option value="">Nhu cầu</option>
                <option value="SALE">Mua bán</option>
                <option value="RENT">Cho thuê</option>
              </select>

              <select 
                value={filters.propertyType} 
                onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
                className="p-2.5 border border-gray-300 rounded-lg bg-white"
              >
                <option value="">Loại hình</option>
                <option value="HOUSE">Nhà riêng</option>
                <option value="APARTMENT">Căn hộ</option>
                <option value="VILLA">Biệt thự</option>
                <option value="LAND">Đất nền</option>
              </select>

              <select 
                value={filters.priceRange} 
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                className="p-2.5 border border-gray-300 rounded-lg bg-white"
              >
                <option value="">Mức giá</option>
                <option value="under5">Dưới 5 tỷ</option>
                <option value="5to10">5 - 10 tỷ</option>
                <option value="above10">Trên 10 tỷ</option>
              </select>

              <select 
                value={filters.city} 
                onChange={(e) => setFilters({...filters, city: e.target.value})}
                className="p-2.5 border border-gray-300 rounded-lg bg-white"
              >
                <option value="">Toàn quốc</option>
                <option value="Hồ Chí Minh">TP.HCM</option>
                <option value="Hà Nội">Hà Nội</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={onSearchClick}
                className="bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-2.5 rounded-lg font-semibold transition"
              >
                Tìm
              </button>
              <button
                onClick={resetFilters}
                className="bg-gray-100 hover:bg-gray-200 p-2.5 rounded-lg text-gray-500 transition"
                title="Xóa bộ lọc"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="py-20"><Spinner /></div>
        ) : (
          <>
            <div className="mt-10 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {properties.length > 0 ? (
                properties.map((item) => (
                  <PropertyCard key={item._id || item.id} property={item} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-xl text-gray-500 font-medium">Không tìm thấy bất động sản phù hợp.</p>
                  <button onClick={resetFilters} className="mt-2 text-indigo-600 hover:underline">Xóa tất cả bộ lọc</button>
                </div>
              )}
            </div>

            {/* Pagination UI */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 rounded-md border ${
                      activeFilters.page === i + 1 
                        ? 'bg-[#1A237E] text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ListingsPage;