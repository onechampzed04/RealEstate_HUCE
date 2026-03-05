import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPropertyById, fetchFeaturedProperties } from '../services/api';
import type { Property } from '../types';
import Spinner from '../components/Spinner';
import NotFoundPage from './NotFoundPage';
import PropertyCard from '../components/PropertyCard';
import { BedIcon, BathIcon, AreaIcon, MapPinIcon } from '../assets/icons';
import { XIcon, ChevronLeft, ChevronRight } from 'lucide-react'; // Cần cài lucide-react hoặc dùng icon có sẵn

// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State cho Lightbox (Mở ảnh)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Logic kiểm tra đăng nhập
  const isLoggedIn = !!localStorage.getItem('token'); 

  useEffect(() => {
    if (!id) return;
    window.scrollTo(0, 0);
    const loadData = async () => {
      setLoading(true);
      try {
        const [propertyData, featuredData] = await Promise.all([
          fetchPropertyById(id),
          fetchFeaturedProperties()
        ]);
        if (propertyData) setProperty(propertyData);
        if (featuredData) {
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

  const images = property.images || (property as any).gallery || [];
  const location = property.location || { address: (property as any).address, city: (property as any).city };
  const user = property.user || (property as any).agent;

  // Xử lý số điện thoại
  const handlePhoneClick = (e: React.MouseEvent) => {
    window.location.href = `tel:${user.phone}`;
  };

  const renderPhoneNumber = (phone: string) => {
    if (!phone) return 'Liên hệ';
    return isLoggedIn ? phone : `${phone.substring(0, 10)} `;
  };

  // --- Logic Lightbox ---
  const openLightbox = (index: number) => setSelectedImageIndex(index);
  const closeLightbox = () => setSelectedImageIndex(null);
  const nextImage = () => setSelectedImageIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
  const prevImage = () => setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));

  return (
    <div className="bg-white">
      {/* LIGHTBOX MODAL */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black bg-opacity-95 flex items-center justify-center p-4">
          <button onClick={closeLightbox} className="absolute top-6 right-6 text-white hover:text-gray-300 z-[110]">
            <XIcon size={40} />
          </button>
          
          <button onClick={prevImage} className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full transition-all">
            <ChevronLeft size={48} />
          </button>

          <img 
            src={images[selectedImageIndex]} 
            alt="Full view" 
            className="max-w-full max-h-[90vh] object-contain transition-all duration-300"
          />

          <button onClick={nextImage} className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full transition-all">
            <ChevronRight size={48} />
          </button>

          <div className="absolute bottom-6 text-white font-medium">
            {selectedImageIndex + 1} / {images.length}
          </div>
        </div>
      )}

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
                onClick={() => openLightbox(0)} // Mở ảnh đầu tiên
                className="w-full h-96 object-cover rounded-lg shadow-md cursor-pointer hover:opacity-95 transition-opacity" 
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=No+Image'; }}
              />
              <div className="grid grid-cols-2 gap-4">
                {images.slice(1, 5).map((img: string, index: number) => (
                  <img 
                    key={index} 
                    src={img} 
                    alt="gallery" 
                    onClick={() => openLightbox(index + 1)} // Mở các ảnh sau
                    className="w-full h-full object-cover rounded-lg shadow-md cursor-pointer hover:opacity-95 transition-opacity" 
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="col-span-2 bg-gray-100 h-96 flex items-center justify-center rounded-lg text-gray-400 font-medium">Không có hình ảnh</div>
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
                    width="100%" height="100%" style={{ border: 0 }} loading="lazy" title="map"
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
                            {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" /> : user?.name?.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-lg text-gray-900">{user?.name || 'Thành viên'}</p>
                            <p className="text-sm text-gray-500">Hoạt động 24/7</p>
                        </div>
                    </div>
                    
                    {user?.phone && (
                        <a 
                          href={isLoggedIn ? `tel:${user.phone}` : "#"} 
                          onClick={handlePhoneClick}
                          className="flex flex-col items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-all mb-3 shadow-md"
                        >
                            <span className="text-xs font-normal opacity-80">
                                Bấm để gọi ngay
                            </span>
                            <span className="text-xl">
                                {renderPhoneNumber(user.phone)}
                            </span>
                        </a>
                    )}

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
                <SwiperSlide key={item._id || (item as any).id}>
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