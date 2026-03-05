import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPropertyById, fetchFeaturedProperties } from '../services/api';
import type { Property } from '../types';
import Spinner from '../components/Spinner';
import NotFoundPage from './NotFoundPage';
import PropertyCard from '../components/PropertyCard';
import { BedIcon, BathIcon, AreaIcon, MapPinIcon } from '../assets/icons';

// Import Swiper (Cần thiết cho phần BĐS liên quan)
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    // Cuộn lên đầu trang khi chuyển BĐS
    window.scrollTo(0, 0);
    
    const loadData = async () => {
      setLoading(true);
      try {
        // Gọi song song cả chi tiết và danh sách nổi bật để tối ưu thời gian
        const [propertyData, featuredData] = await Promise.all([
          fetchPropertyById(id),
          fetchFeaturedProperties()
        ]);
        
        if (propertyData) setProperty(propertyData);
        
        if (featuredData) {
          // Lọc bỏ chính bài đang xem khỏi danh sách gợi ý
          const list = Array.isArray(featuredData) ? featuredData : (featuredData as any).listings || [];
          setFeaturedProperties(list.filter((p: Property) => (p._id || (p as any).id) !== id));
        }
      } catch (error) {
        console.error("Failed to fetch property details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]);

  if (loading) return <Spinner />;
  if (!property) return <NotFoundPage />;

  // Đồng bộ hóa các trường dữ liệu (Fallback giữa 2 nhánh)
  const images = property.images || (property as any).gallery || [];
  const location = property.location || { address: (property as any).address, city: (property as any).city };
  const user = property.user || (property as any).agent;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{property.title}</h1>
          <div className="mt-2 flex items-center text-lg text-gray-500">
            <MapPinIcon className="h-6 w-6 mr-2" />
            <span>{location.address}, {location.city}</span>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {images.length > 0 ? (
            <>
              <img 
                src={images[0]} 
                alt={property.title} 
                className="w-full h-96 object-cover rounded-lg shadow-md" 
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=No+Image'; }}
              />
              <div className="grid grid-cols-2 gap-4">
                {images.slice(1, 5).map((img: string, index: number) => (
                  <img 
                    key={index} 
                    src={img} 
                    alt="gallery" 
                    className="w-full h-full object-cover rounded-lg shadow-md" 
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="col-span-2 bg-gray-100 h-96 flex items-center justify-center rounded-lg">Không có hình ảnh</div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-4xl font-bold text-blue-800">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(property.price)}
                    </span>
                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-lg font-semibold uppercase">
                        {property.status}
                    </span>
                </div>

                <div className="flex justify-around items-center text-gray-700 border p-4 rounded-lg shadow-sm mb-6 bg-gray-50">
                    <div className="text-center">
                        <BedIcon className="h-7 w-7 mx-auto text-blue-700"/>
                        <p className="font-semibold">{property.bedrooms || 0} Ngủ</p>
                    </div>
                    <div className="text-center">
                        <BathIcon className="h-7 w-7 mx-auto text-blue-700"/>
                        <p className="font-semibold">{property.bathrooms || 0} Tắm</p>
                    </div>
                    <div className="text-center">
                        <AreaIcon className="h-7 w-7 mx-auto text-blue-700"/>
                        <p className="font-semibold">{property.area} m²</p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">Mô tả chi tiết</h2>
                <p className="text-gray-600 leading-relaxed mb-8 whitespace-pre-line">{property.description}</p>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">Vị trí</h2>
                <div className="w-full h-80 rounded-lg overflow-hidden shadow-inner">
                  <iframe 
                    width="100%" height="100%" style={{ border: 0 }} loading="lazy" 
                    src={`https://www.google.com/maps?q=${encodeURIComponent(location.address + ', ' + location.city)}&output=embed`}
                  ></iframe>
                </div>
            </div>

            {/* Sidebar: Contact Info */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Liên hệ chính chủ</h3>
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                            {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.name?.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-lg text-gray-900">{user?.name || 'Thành viên'}</p>
                            <p className="text-sm text-gray-500">Hoạt động 24/7</p>
                        </div>
                    </div>
                    
                    {user?.phone && (
                        <a href={`tel:${user.phone}`} className="flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-all mb-3 shadow-md">
                            Gọi {user.phone}
                        </a>
                    )}
                    
                    <button className="w-full border-2 border-blue-800 text-blue-800 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all">
                        Gửi lời nhắn
                    </button>
                </div>
            </div>
        </div>

        {/* Related Section */}
        {featuredProperties.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Bất động sản tương tự</h2>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
              className="pb-12"
            >
              {featuredProperties.map((item) => (
                <SwiperSlide key={item._id}>
                  <PropertyCard property={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetailPage;