import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  createListing, 
  ListingFormData, 
  fetchMyActivePackage, 
  createPaymentLink, 
  checkOrderStatus 
} from '../services/api';
import Spinner from '../components/Spinner';
import useAuth from '../hooks/useAuth';
import PackageModal from '../components/PackageModal';
import PaymentModal from '../components/PaymentModal';
import ConfirmationModal from '../components/ConfirmationModal';
import WaitingForPaymentModal from '../components/WaitingForPaymentModal';
import PaymentResultModal from '../components/PaymentResultModal';
import type { Package } from '../types';

// Import dữ liệu vị trí dùng chung
import { CITIES, DISTRICTS_BY_CITY } from '../data/locationData';

// ===============================================================
// API SERVICE ĐỊNH GIÁ (Tích hợp từ valuation page)
// ===============================================================
const VALUATION_API_URL = 'http://localhost:5001/api/listings/valuation';

async function getAIValuation(data: any): Promise<{ valuation: number }> {
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

const FURNITURE_STATES = ['Nội thất đầy đủ', 'Nội thất cơ bản', 'Không nội thất', 'Khác'];

const SubmitPropertyPage: React.FC = () => {
  const { user, token } = useAuth(); 
  const navigate = useNavigate();
  
  // State quản lý tiến trình
  const [loading, setLoading] = useState(false);
  const [activePackage, setActivePackage] = useState<any>(null);
  const [checkingPackage, setCheckingPackage] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // --- STATE MỚI CHO ĐỊNH GIÁ AI ---
  const [isValuating, setIsValuating] = useState(false);
  const [valuationResult, setValuationResult] = useState<number | null>(null);
  const [valuationError, setValuationError] = useState<string | null>(null);
  
  // State quản lý Modals & Thanh toán
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [paymentData, setPaymentData] = useState<{ orderCode: number; checkoutUrl: string } | null>(null);
  const [paymentResult, setPaymentResult] = useState<{ success: boolean; message: string } | null>(null);
  const pollingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // State quản lý hình ảnh
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  // Form Data
  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    type: 'Đông', 
    propertyType: 'Sổ hồng/Sổ đỏ', 
    price: 0,
    area: 0,
    bedrooms: 0,
    bathrooms: 0,
    floors: 1,           
    furniture_state: 'Nội thất đầy đủ', 
    frontage: 0,        // Mặt tiền (m)
    address: '',
    city: 'Thành phố Hà Nội', 
    district: 'Quận Ba Đình',   
    ward: '',
    images: []
  });

  // --- HÀM XỬ LÝ ĐỊNH GIÁ KHI ẤN BUTTON ---
  const handleValuation = async () => {
    setValuationError(null);
    if (formData.area <= 0) {
      setValuationError("Vui lòng nhập diện tích trước khi định giá.");
      return;
    }
    
    setIsValuating(true);
    try {
      const payload = {
        area: formData.area,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        floors: formData.floors,
        frontage: formData.frontage,
        access_road: 0, // Máy tự hiểu là 0 theo yêu cầu
        house_direction: formData.type,
        legal_status: formData.propertyType,
        furniture_state: formData.furniture_state,
        address: `${formData.district}, ${formData.city}`
      };
      
      const result = await getAIValuation(payload);
      setValuationResult(result.valuation);
    } catch (err: any) {
      setValuationError(err.message || "Không thể định giá lúc này.");
    } finally {
      setIsValuating(false);
    }
  };

  // 1. XỬ LÝ NHẬP LIỆU & DROPDOWN CẤP BẬC
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev: any) => {
      const newState = {
        ...prev,
        // Ép kiểu số cho các trường định danh kỹ thuật
        [name]: ['price', 'area', 'bedrooms', 'bathrooms', 'floors', 'frontage'].includes(name) 
          ? Number(value) 
          : value
      };

      // Logic Cascading: Khi đổi Thành phố, tự động cập nhật Quận đầu tiên của thành phố đó
      if (name === 'city') {
        const districts = DISTRICTS_BY_CITY[value] || [];
        newState.district = districts.length > 0 ? districts[0].value : '';
      }
      
      return newState;
    });
  };

  // 2. XỬ LÝ HÌNH ẢNH (Tối đa 3 ảnh)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (images.length + newFiles.length > 3) {
        alert("Bạn chỉ được phép tải lên tối đa 3 hình ảnh.");
        return;
      }

      setImages(prev => [...prev, ...newFiles]);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return [];
    setUploadingImages(true);
    try {
      const uploadData = new FormData();
      images.forEach(image => uploadData.append('images', image));
      
      const response = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadData
      });
      
      if (!response.ok) throw new Error('Không thể upload ảnh.');
      const data = await response.json();
      return data.map((item: any) => item.url);
    } catch (err: any) {
      throw new Error(err.message || 'Lỗi tải ảnh.');
    } finally {
      setUploadingImages(false);
    }
  };

  // 3. XỬ LÝ SUBMIT TIN ĐĂNG
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { setError('Vui lòng đăng nhập.'); return; }

    setLoading(true);
    setError(null);
    try {
      let uploadedImageUrls: string[] = [];
      if (images.length > 0) {
        uploadedImageUrls = await uploadImages();
      }

      const finalData: ListingFormData = {
        ...formData,
        images: uploadedImageUrls
      };

      await createListing(finalData, token);
      setSuccess('Đăng tin thành công! Đang chuyển hướng...');
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err: any) {
      if (err.message?.includes('OUT_OF_POSTS')) {
        setError('Bạn đã hết lượt đăng tin.');
      } else {
        setError(err.message || 'Đã có lỗi xảy ra.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 4. KIỂM TRA GÓI CƯỚC & THANH TOÁN
  const fetchUserPackage = async () => {
    if (user && token) {
      try {
        const pkg = await fetchMyActivePackage(token);
        setActivePackage(pkg);
        if (!pkg || pkg.remainingPosts <= 0) setIsPackageModalOpen(true);
      } catch (error) {
        setActivePackage(null);
      } finally {
        setCheckingPackage(false);
      }
    } else {
      setCheckingPackage(false);
    }
  };

  useEffect(() => {
    fetchUserPackage();
  }, [user, token]);

  useEffect(() => {
    if (paymentData && token) {
      pollingInterval.current = setInterval(async () => {
        try {
          const data = await checkOrderStatus(paymentData.orderCode, token);
          if (data.status === 'PAID') {
            if (pollingInterval.current) clearInterval(pollingInterval.current);
            setPaymentData(null);
            setPaymentResult({ success: true, message: "Giao dịch thành công!" });
            fetchUserPackage();
          }
        } catch (error) { console.error(error); }
      }, 3000);
    }
    return () => { if (pollingInterval.current) clearInterval(pollingInterval.current); };
  }, [paymentData, token]);

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsPackageModalOpen(false);
    activePackage ? setIsConfirmationOpen(true) : setIsPaymentOpen(true);
  };

  const handleCreatePayment = async () => {
    if (!selectedPackage || !token) return;
    setLoading(true);
    try {
      const data = await createPaymentLink(selectedPackage._id, token);
      if (data.checkoutUrl) {
        setIsPaymentOpen(false);
        setPaymentData({ orderCode: data.orderCode, checkoutUrl: data.checkoutUrl });
        window.open(data.checkoutUrl, '_blank');
      }
    } catch (error: any) {
      setPaymentResult({ success: false, message: "Lỗi tạo thanh toán." });
    } finally {
      setLoading(false);
    }
  };

  const availableDistricts = DISTRICTS_BY_CITY[formData.city] || [];

  if (!user) return <div className="p-20 text-center">Vui lòng đăng nhập để tiếp tục.</div>;
  if (checkingPackage) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;

  if (!activePackage || activePackage.remainingPosts <= 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-12 flex flex-col items-center justify-center px-4">
        <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lượt đăng tin đã hết</h2>
          <p className="text-gray-600 mb-8">Bạn cần mua thêm gói để tiếp tục đăng tin bất động sản.</p>
          <button onClick={() => setIsPackageModalOpen(true)} className="bg-[#1A237E] text-white px-8 py-3 rounded-lg font-bold">Mua Gói Ngay</button>
        </div>
        
        <PackageModal isOpen={isPackageModalOpen} onClose={() => setIsPackageModalOpen(false)} onSelectPackage={handleSelectPackage} activePackageId={activePackage?.package?._id} />
        <ConfirmationModal isOpen={isConfirmationOpen} onClose={() => setIsConfirmationOpen(false)} onConfirm={() => { setIsConfirmationOpen(false); setIsPaymentOpen(true); }} title="Xác nhận">
          <p>Mua gói mới sẽ ghi đè lên gói hiện tại. Tiếp tục?</p>
        </ConfirmationModal>
        {selectedPackage && <PaymentModal isOpen={isPaymentOpen} pkg={selectedPackage} onClose={() => setIsPaymentOpen(false)} onSubmit={handleCreatePayment} loading={loading} />}
        {paymentData && <WaitingForPaymentModal orderCode={paymentData.orderCode} checkoutUrl={paymentData.checkoutUrl} onCancel={() => setPaymentData(null)} />}
        {paymentResult && <PaymentResultModal result={paymentResult} onClose={() => setPaymentResult(null)} />}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-[#1A237E] py-6 px-8 text-white">
            <h1 className="text-2xl font-bold">Đăng tin Bất Động Sản mới</h1>
            <p className="mt-1 text-indigo-200">Vui lòng nhập đầy đủ các thông tin có dấu (*)</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && <div className="bg-red-50 text-red-600 p-4 rounded border border-red-200">{error}</div>}
              {success && <div className="bg-green-50 text-green-600 p-4 rounded border border-green-200">{success}</div>}

              {/* SECTION 1: CƠ BẢN */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">1. Thông tin cơ bản</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề tin đăng *</label>
                    <input type="text" name="title" required value={formData.title} onChange={handleInputChange} placeholder="VD: Bán căn hộ cao cấp 2PN..." className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#1A237E]" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pháp lý *</label>
                    <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded">
                      <option value="Sổ hồng/Sổ đỏ">Sổ hồng/Sổ đỏ</option>
                      <option value="Hợp đồng">Hợp đồng</option>
                      <option value="Đang chờ sổ">Đang chờ sổ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hướng nhà *</label>
                    <select name="type" value={formData.type} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded">
                      <option value="Đông">Đông</option>
                      <option value="Tây">Tây</option>
                      <option value="Nam">Nam</option>
                      <option value="Bắc">Bắc</option>
                      <option value="Đông Bắc">Đông Bắc</option>
                      <option value="Đông Nam">Đông Nam</option>
                      <option value="Tây Bắc">Tây Bắc</option>
                      <option value="Tây Nam">Tây Nam</option>
                    </select>
                  </div>

                  {/* CỤM GIÁ & ĐỊNH GIÁ AI */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Giá (VNĐ) *</label>
                    <div className="flex gap-2">
                      <input type="number" name="price" required value={formData.price || ''} onChange={handleInputChange} className="flex-1 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#1A237E]" />
                      <button 
                        type="button" 
                        onClick={handleValuation}
                        disabled={isValuating}
                        className="bg-[#1A237E] text-white px-4 py-2 rounded text-sm font-bold hover:bg-indigo-800 disabled:bg-gray-400"
                      >
                        {isValuating ? 'Đang tính...' : 'Định giá AI'}
                      </button>
                    </div>
                    {valuationError && <p className="text-red-500 text-xs italic">{valuationError}</p>}
                    {valuationResult && (
                      <div className="bg-green-50 p-2 rounded border border-green-200">
                        <p className="text-green-700 text-sm font-bold">Gợi ý AI: {valuationResult.toFixed(2)} tỷ VND</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diện tích (m²) *</label>
                    <input type="number" name="area" required value={formData.area || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#1A237E]" />
                  </div>
                </div>
              </section>

              {/* SECTION 2: CẤU TRÚC & THÔNG SỐ (Bổ sung Frontage) */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">2. Cấu trúc & Thông số</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số tầng *</label>
                  <input 
                    type="number" 
                    name="floors" 
                    min="1" 
                    value={formData.floors} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#1A237E] focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mặt tiền (m) *</label>
                  <input 
                    type="number" 
                    name="frontage" 
                    min="0" 
                    step="0.1" 
                    value={formData.frontage} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#1A237E] focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phòng ngủ</label>
                  <input 
                    type="number" 
                    name="bedrooms" 
                    value={formData.bedrooms} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#1A237E] focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phòng tắm</label>
                  <input 
                    type="number" 
                    name="bathrooms" 
                    value={formData.bathrooms} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#1A237E] focus:outline-none" 
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nội thất *</label>
                  <select 
                    name="furniture_state" 
                    value={formData.furniture_state} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#1A237E] focus:outline-none"
                  >
                    {FURNITURE_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                
              </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tỉnh / Thành phố *</label>
                    <select name="city" required value={formData.city} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded">
                      {CITIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quận / Huyện *</label>
                    <select name="district" required value={formData.district} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded">
                      {availableDistricts.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ chi tiết *</label>
                    <input type="text" name="address" required value={formData.address} onChange={handleInputChange} placeholder="Số nhà, tên đường..." className="w-full p-3 border border-gray-300 rounded" />
                  </div>

                  <div className="col-span-2">
                    <div className="w-full h-[300px] bg-gray-100 rounded border border-gray-300 overflow-hidden">
                      {formData.address ? (
                        <iframe 
                          width="100%" height="100%" style={{ border: 0 }} loading="lazy" 
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(formData.address + ', ' + formData.district + ', ' + formData.city)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        ></iframe>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">Nhập địa chỉ để xem vị trí trên bản đồ</div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
              <section>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả chi tiết bài đăng *
                  </label>
                  <textarea 
                    name="description" 
                    required 
                    rows={8} 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    placeholder="Mô tả đặc điểm về bất động sản của bạn..." 
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-400 resize-y min-h-[150px]"
                  ></textarea>
                </div>
              </section>
              {/* SECTION 3: HÌNH ẢNH */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">3. Hình ảnh (Tối đa 3 ảnh)</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="images" />
                  <label htmlFor="images" className="cursor-pointer flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-400 mb-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <span className="text-[#1A237E] font-medium underline">Nhấn để tải ảnh lên</span>
                    <p className="text-xs text-gray-500 mt-1">Hỗ trợ JPG, PNG. Dung lượng tối đa 10MB/ảnh.</p>
                  </label>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                        <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <div className="pt-8 border-t flex justify-end">
                <button type="submit" disabled={loading || uploadingImages} className={`bg-[#1A237E] text-white px-12 py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-[#0d1554] transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {loading || uploadingImages ? <Spinner /> : 'ĐĂNG TIN NGAY'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitPropertyPage;