import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPropertyById, fetchFeaturedProperties } from '../services/api';
import type { Property } from '../types';
import Spinner from '../components/Spinner';
import NotFoundPage from './NotFoundPage';
import PropertyCard from '../components/PropertyCard';
import { BedIcon, BathIcon, AreaIcon, MapPinIcon } from '../assets/icons';
import { XIcon, ChevronLeft, ChevronRight, Layers, Maximize2, Sofa, Calculator } from 'lucide-react'; 

// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// ===============================================================
// API SERVICE ĐỊNH GIÁ RIÊNG (Copy y hệt logic từ SubmitPage để chạy được)
// ===============================================================
const VALUATION_API_URL = 'http://localhost:5001/api/listings/valuation';

async function getAIValuationLocal(data: any): Promise<{ valuation: number }> {
  const response = await fetch(VALUATION_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Lỗi định giá AI');
  }
  return result;
}

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State cho Định giá AI
  const [aiValuation, setAiValuation] = useState<number | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // State cho Lightbox
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

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

  // ===============================================================
  // HÀM XỬ LÝ ĐỊNH GIÁ (Chỉ cần ấn nút là máy tự hiểu access_road = 0)
  // ===============================================================
  const handleAIEstimate = async () => {
    if (!property) return;
    
    setAiLoading(true);
    setAiValuation(null);

    try {
      const payload = {
        area: property.area,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        floors: property.floors || 1,
        frontage: property.frontage || 0,
        access_road: 0, // Tự hiểu là 0 theo yêu cầu
        house_direction: property.type,
        legal_status: property.propertyType,
        furniture_state: property.furnitureStatus || 'Khác',
        address: `${property.location?.district || ''}, ${property.location?.city || ''}`
      };

      const result = await getAIValuationLocal(payload);
      // Kết quả AI thường trả về đơn vị Tỷ, nhân 1 tỷ để ra VND hiển thị
      setAiValuation(result.valuation * 1_000_000_000);
    } catch (err: any) {
      alert("AI chưa có dữ liệu định giá chính xác cho khu vực này.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (!property) return <NotFoundPage />;

  const images = property.images || (property as any).gallery || [];
  const location = property.location || { address: (property as any).address, city: (property as any).city };
  const user = property.user || (property as any).agent;

  const handlePhoneClick = (e: React.MouseEvent) => {
    window.location.href = `tel:${user.phone}`;
  };

  const renderPhoneNumber = (phone: string) => {
    if (!phone) return 'Liên hệ';
    return isLoggedIn ? phone : `${phone.substring(0, 10)} `;
  };

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
          <img src={images[selectedImageIndex]} alt="Full view" className="max-w-full max-h-[90vh] object-contain" />
          <button onClick={nextImage} className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full transition-all">
            <ChevronRight size={48} />
          </button>
          <div className="absolute bottom-6 text-white font-medium">{selectedImageIndex + 1} / {images.length}</div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{property.title}</h1>
          <div className="mt-2 flex items-center text-lg text-gray-500">
            <MapPinIcon className="h-6 w-6 mr-2 text-red-500" />
            <span>{location.address}, {location.city}</span>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {images.length > 0 ? (
            <>
              <img src={images[0]} alt={property.title} onClick={() => openLightbox(0)} className="w-full h-96 object-cover rounded-lg shadow-md cursor-pointer hover:opacity-95 transition-opacity" />
              <div className="grid grid-cols-2 gap-4">
                {images.slice(1, 5).map((img: string, index: number) => (
                  <img key={index} src={img} alt="gallery" onClick={() => openLightbox(index + 1)} className="w-full h-full object-cover rounded-lg shadow-md cursor-pointer hover:opacity-95 transition-opacity" />
                ))}
              </div>
            </>
          ) : (
            <div className="col-span-2 bg-gray-100 h-96 flex items-center justify-center rounded-lg text-gray-400 font-medium">Không có hình ảnh</div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-4xl font-bold text-blue-800">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(property.price)}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-lg font-semibold uppercase">
                        {property.propertyType}
                    </span>
                </div>

                {/* Grid Thông số mở rộng: 5 cột */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 text-gray-700 border p-6 rounded-xl shadow-sm mb-8 bg-gray-50">
                    <div className="text-center border-r border-gray-200">
                        <BedIcon className="h-6 w-6 mx-auto text-blue-700 mb-1"/>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Phòng ngủ</p>
                        <p className="font-bold">{property.bedrooms || 0}</p>
                    </div>
                    <div className="text-center border-r border-gray-200">
                        <BathIcon className="h-6 w-6 mx-auto text-blue-700 mb-1"/>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Phòng tắm</p>
                        <p className="font-bold">{property.bathrooms || 0}</p>
                    </div>
                    <div className="text-center border-r border-gray-200">
                        <Layers className="h-6 w-6 mx-auto text-blue-700 mb-1"/>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Số tầng</p>
                        <p className="font-bold">{property.floors || 1}</p>
                    </div>
                    <div className="text-center border-r border-gray-200">
                        <Maximize2 className="h-6 w-6 mx-auto text-blue-700 mb-1"/>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Mặt tiền</p>
                        <p className="font-bold">{property.frontage || 0} m</p>
                    </div>
                    <div className="text-center">
                        <AreaIcon className="h-6 w-6 mx-auto text-blue-700 mb-1"/>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Diện tích</p>
                        <p className="font-bold">{property.area} m²</p>
                    </div>
                </div>

                {/* Nội thất & Hướng */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium border border-indigo-100">
                    <Sofa size={20} className="mr-2" />
                    Nội thất: {property.furnitureStatus || 'Khác'}
                  </div>
                  <div className="flex items-center bg-orange-50 text-orange-700 px-4 py-2 rounded-lg font-medium border border-orange-100">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    Hướng nhà: {property.type}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-800 pl-3">Mô tả chi tiết</h2>
                <p className="text-gray-600 leading-relaxed mb-8 whitespace-pre-line bg-white p-4 border rounded-lg shadow-sm">{property.description}</p>

                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-800 pl-3">Vị trí trên bản đồ</h2>
                <div className="w-full h-80 rounded-xl overflow-hidden shadow-inner border mb-10">
                  <iframe 
                    width="100%" height="100%" style={{ border: 0 }} loading="lazy" title="map"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(location.address + ', ' + location.city)}&iwloc=B&output=embed`}
                  ></iframe>
                </div>
            </div>

            {/* Sidebar: Contact & AI Valuation */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Liên hệ người bán</h3>
                    <div className="flex items-center space-x-4 mb-6 p-3 bg-gray-50 rounded-xl">
                        <div className="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold overflow-hidden shadow-sm">
                            {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" /> : user?.name?.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 leading-tight">{user?.name || 'Thành viên'}</p>
                            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Đang hoạt động
                            </p>
                        </div>
                    </div>
                    
                    {user?.phone && (
                        <a 
                          href={isLoggedIn ? `tel:${user.phone}` : "#"} 
                          onClick={handlePhoneClick}
                          className="flex flex-col items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all mb-4 shadow-lg active:scale-95"
                        >
                            <span className="text-[10px] font-normal opacity-80 uppercase tracking-widest">Bấm để gọi ngay</span>
                            <span className="text-xl tracking-wide">{renderPhoneNumber(user.phone)}</span>
                        </a>
                    )}

                    {/* NÚT ĐỊNH GIÁ AI - COPY TỪ LOGIC SUBMIT PAGE */}
                    <div className="pt-6 border-t border-gray-100">
                        <p className="text-[11px] text-gray-400 mb-3 italic">Bạn muốn kiểm tra xem giá này có hợp lý hay không?</p>
                        <button 
                          onClick={handleAIEstimate}
                          disabled={aiLoading}
                          className="flex items-center justify-center w-full bg-indigo-700 hover:bg-indigo-800 text-white py-4 rounded-xl font-bold transition-all shadow-md active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          {aiLoading ? (
                            <div className="flex items-center"><Spinner /> <span className="ml-2">Đang phân tích...</span></div>
                          ) : (
                            <><Calculator size={22} className="mr-2" /> KIỂM TRA GIÁ BẰNG AI</>
                          )}
                        </button>

                        {aiValuation !== null && (
                          <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl animate-in fade-in slide-in-from-top-2">
                             <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider mb-1">AI Gợi Ý Giá:</p>
                             <p className="text-2xl font-black text-indigo-900">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(aiValuation)}
                             </p>
                             <p className="text-[9px] text-indigo-400 mt-2 leading-tight">Dựa trên thông số thực tế của bất động sản này.</p>
                          </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Related Section */}
        {featuredProperties.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
              <span className="w-2 h-8 bg-blue-600 mr-3 rounded-full"></span>
              Bất động sản tương tự
            </h2>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
              className="pb-12 property-detail-swiper"
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