import React, { useState, useEffect } from 'react';
import { fetchProperties } from '../services/api'; // Đảm bảo bạn cập nhật hàm này như hướng dẫn trước
import type { Property } from '../types';
import PropertyCard from '../components/PropertyCard';
import Spinner from '../components/Spinner';

const ListingsPage: React.FC = () => {
  // State quản lý dữ liệu và UI
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  // State quản lý bộ lọc (Khớp với ListingService.getAll)
  const [filters, setFilters] = useState({
    keyword: '',
    type: '', // Bán/Cho thuê
    propertyType: '', // Căn hộ/Nhà/Đất
    priceRange: '',
    city: '',
    page: 1
  });

  const [activeFilters, setActiveFilters] = useState({ ...filters }); // Chỉ fetch khi activeFilters đổi (khi bấm tìm kiếm)

  // Load dữ liệu khi vào trang hoặc thay đổi activeFilters (khi nhấn tìm kiếm/chuyển trang)
  useEffect(() => {
    const fetchFilteredData = async () => {
      setLoading(true);
      try {
        const response = await fetchProperties(
          activeFilters.keyword,
          activeFilters.propertyType,
          activeFilters.priceRange,
          activeFilters.page,
          activeFilters.city,
          activeFilters.type
        );

        if (response.success) {
          setProperties(response.data.listings);
          setPagination(response.data.pagination);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bài đăng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredData();
  }, [activeFilters]);

  // Xử lý khi nhấn nút Tìm Kiếm
  const onSearchClick = () => {
    // Cập nhật activeFilters và reset về trang 1
    setActiveFilters({ ...filters, page: 1 });
  };

  // Hàm chuyển trang trực tiếp sửa activeFilters
  const handlePageChange = (newPage: number) => {
    setActiveFilters(prev => ({ ...prev, page: newPage }));
    setFilters(prev => ({ ...prev, page: newPage })); // Đồng bộ UI
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header Section */}
      <div className="bg-[#1A237E]">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl font-extrabold mb-4">
            Danh Sách Bất Động Sản
          </h1>
          <p className="text-lg text-indigo-100">
            Khám phá hàng ngàn cơ hội đầu tư và an cư tốt nhất đã được kiểm duyệt.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        
        {/* Filter Section - Tương tác với ListingService.getAll */}
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Từ khóa tìm kiếm</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Nhập tên đường, khu vực, dự án..."
                  value={filters.keyword}
                  onChange={(e) => setFilters({...filters, keyword: e.target.value})}
                  onKeyDown={(e) => e.key === 'Enter' && onSearchClick()}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-[#1A237E] outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:w-[60%]">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nhu cầu</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] outline-none bg-white"
                >
                  <option value="">Tất cả</option>
                  <option value="SALE">Mua bán</option>
                  <option value="RENT">Cho thuê</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Loại hình</label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] outline-none bg-white"
                >
                  <option value="">Tất cả loại</option>
                  <option value="HOUSE">Nhà riêng</option>
                  <option value="APARTMENT">Căn hộ</option>
                  <option value="VILLA">Biệt thự</option>
                  <option value="LAND">Đất nền</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mức giá</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] outline-none bg-white"
                >
                  <option value="">Mọi mức giá</option>
                  <option value="under5">Dưới 5 tỷ</option>
                  <option value="5to10">5 - 10 tỷ</option>
                  <option value="above10">Trên 10 tỷ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Khu vực</label>
                <select
                  value={filters.city}
                  onChange={(e) => setFilters({...filters, city: e.target.value})}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] outline-none bg-white"
                >
                  <option value="">Toàn quốc</option>
                  <option value="Hồ Chí Minh">TP.HCM</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto h-[46px]">
              <button
                onClick={onSearchClick}
                className="bg-[#009688] hover:bg-[#00796B] text-white px-6 py-2.5 rounded-lg font-semibold transition shadow-md flex-1 md:flex-none"
              >
                Tìm Kiếm
              </button>
              
              <button
                onClick={() => {
                  const resetFilters = { keyword: '', type: '', propertyType: '', priceRange: '', city: '', page: 1 };
                  setFilters(resetFilters);
                  setActiveFilters(resetFilters);
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-lg font-semibold transition border border-gray-300 shadow-sm flex items-center justify-center"
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
            <div className="mt-10 grid gap-8 grid-cols-1 md:grid-cols-2">
              {properties.length > 0 ? (
                properties.map((item) => (
                  <PropertyCard key={item._id} property={item} viewMode="list" />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-xl text-gray-500 font-medium">Không tìm thấy bất động sản phù hợp.</p>
                  <button 
                    onClick={() => {
                      const resetFilters = { keyword: '', type: '', propertyType: '', priceRange: '', city: '', page: 1 };
                      setFilters(resetFilters);
                      setActiveFilters(resetFilters);
                    }}
                    className="mt-4 text-blue-600 hover:underline"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              )}
            </div>

            {/* Pagination UI - Sử dụng dữ liệu từ Service */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                <button 
                  onClick={() => handlePageChange(Math.max(1, activeFilters.page - 1))}
                  disabled={activeFilters.page === 1}
                  className="px-3 py-2 rounded-md border bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trang trước
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 rounded-md border ${
                      activeFilters.page === i + 1 
                        ? 'bg-[#1A237E] text-white border-[#1A237E]' 
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  onClick={() => handlePageChange(Math.min(pagination.totalPages, activeFilters.page + 1))}
                  disabled={activeFilters.page === pagination.totalPages}
                  className="px-3 py-2 rounded-md border bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trang sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ListingsPage;