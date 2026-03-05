
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing, ListingFormData } from '../services/api';
import Spinner from '../components/Spinner';
import useAuth from '../hooks/useAuth';

const SubmitPropertyPage: React.FC = () => {
  const { user, token } = useAuth(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    description: '',
    type: 'SALE',
    propertyType: 'HOUSE',
    price: 0,
    area: 0,
    bedrooms: 0,
    bathrooms: 0,
    address: '',
    city: 'Hồ Chí Minh',
    district: '',
    ward: '',
    images: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['price', 'area', 'bedrooms', 'bathrooms'].includes(name) ? Number(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
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
    const uploadedUrls: string[] = [];
    
    try {
      // Create FormData to send files to backend
      const uploadData = new FormData();
      images.forEach(image => {
        uploadData.append('images', image);
      });
      
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/upload/images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      // Expecting array of objects with url property
      data.forEach((item: any) => {
        if (item.url) uploadedUrls.push(item.url);
      });
      
      return uploadedUrls;
    } catch (err) {
      console.error('Lỗi khi tải ảnh lên:', err);
      throw new Error('Không thể tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Vui lòng đăng nhập để đăng tin');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // BƯỚC 1: Xử lý ảnh (Chỉ upload nếu người dùng có chọn ảnh)
      let uploadedImageUrls: string[] = [];
      
      if (images.length > 0) {
        try {
          // Gọi hàm upload đã viết ở trên
          uploadedImageUrls = await uploadImages(); 
        } catch (uploadErr) {
          // Nếu lỗi upload ảnh, ta có thể dừng lại hoặc thông báo cho user
          throw new Error('Lỗi khi tải ảnh lên, vui lòng thử lại hoặc bỏ ảnh ra.');
        }
      }

      // BƯỚC 2: Chuẩn bị dữ liệu cuối cùng
      const finalData: ListingFormData = {
        ...formData,
        images: uploadedImageUrls // Sẽ là [] nếu không có ảnh, hoặc mảng URL nếu có ảnh
      };

      // BƯỚC 3: Gửi toàn bộ dữ liệu lên Backend (Đây là đoạn bạn đang thiếu)
      const result = await createListing(finalData, token);
      
      console.log('Đăng tin thành công:', result);
      setSuccess('Đăng tin thành công! Đang chuyển hướng...');
      
      // Chuyển hướng sau 2 giây
      setTimeout(() => {
        navigate('/my-listings'); 
      }, 2000);

    } catch (err: any) {
      console.error('Lỗi tổng thể:', err);
      setError(err.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // 4. KIỂM TRA QUYỀN TRUY CẬP NGAY TẠI ĐÂY (Nên thêm)
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Bạn chưa đăng nhập</h2>
        <p className="text-gray-600 mb-6">Vui lòng đăng nhập để sử dụng tính năng đăng tin.</p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-[#1A237E] text-white px-6 py-2 rounded-lg"
        >
          Đi đến Đăng Nhập
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-[#1A237E] py-6 px-8 text-white">
            <h1 className="text-2xl font-bold">Đăng tin Bất Động Sản mới</h1>
            <p className="mt-2 text-indigo-200">Điền thông tin chi tiết về bất động sản của bạn</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
                {success}
              </div>
            )}

            <div className="space-y-8">
              {/* Thông tin cơ bản */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">1. Thông tin cơ bản</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề tin đăng *</label>
                    <input 
                      type="text" 
                      name="title" 
                      required 
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="VD: Bán biệt thự 3 tầng mặt tiền đường ABC" 
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#1A237E] focus:outline-none" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hình thức *</label>
                    <select 
                      name="type" 
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#1A237E] focus:outline-none"
                    >
                      <option value="SALE">Bán</option>
                      <option value="RENT">Cho thuê</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại bất động sản *</label>
                    <select 
                      name="propertyType" 
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#1A237E] focus:outline-none"
                    >
                      <option value="APARTMENT">Căn hộ chung cư</option>
                      <option value="HOUSE">Nhà riêng/Nhà phố</option>
                      <option value="VILLA">Biệt thự</option>
                      <option value="LAND">Đất nền</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giá (VNĐ) *</label>
                    <input 
                      type="number" 
                      name="price" 
                      required 
                      min="0"
                      value={formData.price || ''}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#1A237E] focus:outline-none" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diện tích (m²) *</label>
                    <input 
                      type="number" 
                      name="area" 
                      required 
                      min="0"
                      value={formData.area || ''}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#1A237E] focus:outline-none" 
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả chi tiết *</label>
                    <textarea 
                      name="description" 
                      required 
                      rows={5}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Mô tả chi tiết về vị trí, tiện ích, nội thất, pháp lý..."
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#1A237E] focus:outline-none"
                    ></textarea>
                  </div>
                </div>
              </section>

              {/* Thông tin phòng */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">2. Cấu trúc</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số phòng ngủ</label>
                    <input 
                      type="number" 
                      name="bedrooms" 
                      min="0"
                      value={formData.bedrooms || ''}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#1A237E] focus:outline-none" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số phòng tắm/WC</label>
                    <input 
                      type="number" 
                      name="bathrooms" 
                      min="0"
                      value={formData.bathrooms || ''}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#1A237E] focus:outline-none" 
                    />
                  </div>
                </div>
              </section>

              {/* Vị trí */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">3. Vị trí</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ chi tiết *</label>
                    <input 
                      type="text" 
                      name="address" 
                      required 
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Số nhà, Tên đường..."
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#1A237E] focus:outline-none" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tỉnh / Thành phố *</label>
                    <select 
                      name="city" 
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#1A237E] focus:outline-none"
                    >
                      <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Cần Thơ">Cần Thơ</option>
                      <option value="Hải Phòng">Hải Phòng</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quận / Huyện</label>
                    <input 
                      type="text" 
                      name="district" 
                      value={formData.district}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#1A237E] focus:outline-none" 
                    />
                  </div>
                  
                  {/* Map Preview */}
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vị trí trên bản đồ</label>
                    <div className="w-full h-[300px] bg-gray-100 rounded border border-gray-300 overflow-hidden relative">
                      {formData.address ? (
                        <iframe 
                          width="100%" 
                          height="100%" 
                          style={{ border: 0 }} 
                          loading="lazy" 
                          allowFullScreen 
                          referrerPolicy="no-referrer-when-downgrade" 
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(formData.address + ', ' + formData.city)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        ></iframe>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          <p>Nhập địa chỉ để hiển thị bản đồ</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Hình ảnh */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">4. Hình ảnh</h2>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden" 
                    id="images" 
                  />
                  <label htmlFor="images" className="cursor-pointer flex flex-col items-center justify-center h-full w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400 mb-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <span className="text-[#1A237E] font-medium hover:underline">Nhấn vào đây để tải ảnh lên</span>
                    <p className="text-gray-500 text-sm mt-1">Định dạng JPEG, PNG. Tối đa 10MB/ảnh.</p>
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                        <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <div className="pt-6 border-t flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading || uploadingImages}
                  className={`bg-[#1A237E] text-white px-8 py-3 rounded font-semibold text-lg flex items-center justify-center min-w-[200px] ${loading || uploadingImages ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#0d1554]'}`}
                >
                  {loading || uploadingImages ? (
                    <Spinner />
                  ) : (
                    'Đăng Tin Ngay'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitPropertyPage;
