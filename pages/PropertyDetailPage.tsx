
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPropertyById } from '../services/api';
import type { Property } from '../types';
import Spinner from '../components/Spinner';
import NotFoundPage from './NotFoundPage';
import { BedIcon, BathIcon, AreaIcon, MapPinIcon } from '../assets/icons';
import { fetchFeaturedProperties } from '../services/api';
import PropertyCard from '../components/PropertyCard';
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
    
    // Cuộn lên đầu trang khi ID thay đổi
    window.scrollTo(0, 0);
    
    const loadData = async () => {
      setLoading(true);
      try {
        const [propertyData, featuredData] = await Promise.all([
          fetchPropertyById(id),
          fetchFeaturedProperties()
        ]);
        
        if (propertyData) {
          setProperty(propertyData);
        }
        
        if (featuredData) {
          // Lọc bỏ bài đăng hiện tại khỏi danh sách nổi bật
          setFeaturedProperties(featuredData.filter(p => p._id !== id));
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

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{property.title}</h1>
          <div className="mt-2 flex items-center text-lg text-gray-500">
            <MapPinIcon className="h-6 w-6 mr-2" />
            <span>{property.location?.address}, {property.location?.city}</span>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {property.images && property.images.length > 0 ? (
            <>
              <img 
                src={property.images[0]} 
                alt={property.title} 
                className="w-full h-96 object-cover rounded-lg shadow-md" 
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Error'; }}
              />
              <div className="grid grid-cols-2 gap-4">
                {property.images.slice(1, 5).map((img, index) => (
                  <img 
                    key={index} 
                    src={img} 
                    alt={`${property.title} gallery ${index + 1}`} 
                    className="w-full h-full object-cover rounded-lg shadow-md" 
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Error'; }}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="col-span-1 lg:col-span-2 bg-gray-200 h-96 flex items-center justify-center rounded-lg shadow-md">
              <span className="text-gray-400">Không có hình ảnh</span>
            </div>
          )}
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

                <h2 className="text-2xl font-bold text-gray-800 mb-4">Vị trí trên bản đồ</h2>
                <div className="w-full h-80 bg-gray-200 rounded-lg overflow-hidden mb-6 relative">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    loading="lazy" 
                    allowFullScreen 
                    referrerPolicy="no-referrer-when-downgrade" 
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location?.address ? `${property.location.address}, ${property.location.city || ''}` : (property.location?.city || 'Việt Nam'))}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  ></iframe>
                </div>

            </div>
            {/* Agent Info */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md h-fit border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Thông tin liên hệ</h3>
                <div className="flex items-center space-x-4 mb-6">
                    <div className="h-16 w-16 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-800 overflow-hidden">
                        {property.user?.avatar ? (
                            <img src={property.user.avatar} alt={property.user.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl font-bold">{property.user?.name ? property.user.name.charAt(0).toUpperCase() : 'U'}</span>
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-lg text-gray-900">{property.user?.name || 'Người đăng'}</p>
                        <p className="text-sm text-gray-500 mb-1">{property.user?.email || 'Chủ sở hữu/Môi giới'}</p>
                    </div>
                </div>
                
                {property.user?.phone && (
                    <a href={`tel:${property.user.phone}`} className="flex items-center justify-center w-full bg-[#009688] hover:bg-[#00796B] text-white py-3 rounded-lg font-semibold transition-colors mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                        </svg>
                        {property.user.phone}
                    </a>
                )}
                
                <button className="w-full border border-primary text-primary py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Gửi tin nhắn
                </button>
            </div>
        </div>

        {/* Featured Properties Slider */}
        {featuredProperties.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">
              Bất Động Sản Nổi Bật Khác
            </h2>
            <div className="px-10 relative"> {/* Tăng padding ngang để đẩy nội dung tách khỏi mũi tên */}
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                navigation={{
                  nextEl: '.swiper-button-next-custom',
                  prevEl: '.swiper-button-prev-custom',
                }}
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="pb-14" // Padding bottom cho pagination dots
              >
                {featuredProperties.map((item) => (
                  <SwiperSlide key={item._id} className="h-auto">
                    <div className="h-full py-4"> {/* Thêm padding y để hover effect shadow không bị cắt */}
                      <PropertyCard property={item} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* Custom Navigation Buttons để chúng nằm ngoài khu vực ảnh */}
              <div className="swiper-button-prev-custom absolute top-1/2 left-0 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer z-10 text-gray-600 hover:text-[#1A237E] transition-colors border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </div>
              <div className="swiper-button-next-custom absolute top-1/2 right-0 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer z-10 text-gray-600 hover:text-[#1A237E] transition-colors border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PropertyDetailPage;
