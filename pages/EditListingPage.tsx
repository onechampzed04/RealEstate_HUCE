import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateListing, fetchPropertyById } from "../services/api";
import Spinner from "../components/Spinner";
import useAuth from "../hooks/useAuth";

// Import dữ liệu dùng chung
import { CITIES, DISTRICTS_BY_CITY } from "../data/locationData";

const FURNITURE_STATES = ['Nội thất đầy đủ', 'Nội thất cơ bản', 'Không nội thất', 'Khác'];

const EditListingPage: React.FC = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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
    frontage: 0,
    furniture_state: 'Nội thất đầy đủ',
    address: '',
    city: 'Thành phố Hà Nội',
    district: '',
    ward: ''
  });

  // Tái sử dụng class CSS từ trang Submit
  const inputStyle = "w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-gray-800 shadow-sm";
  const labelStyle = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1";

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await fetchPropertyById(id!);
        if (!data) return;
        
        setFormData({
          title: data.title,
          description: data.description,
          type: data.type,
          propertyType: data.propertyType,
          price: data.price,
          area: data.area,
          bedrooms: data.bedrooms || 0,
          bathrooms: data.bathrooms || 0,
          floors: data.floors || 1,
          frontage: data.frontage || 0,
          furniture_state: data.furnitureStatus || 'Nội thất đầy đủ', // Chú ý map đúng tên từ Backend
          address: data.location?.address || "",
          city: data.location?.city || "Thành phố Hà Nội",
          district: data.location?.district || "",
          ward: data.location?.ward || "",
        });

        if (data.images) {
          setExistingImages(data.images);
          setImagePreviews(data.images.map((img: any) => typeof img === 'string' ? img : img.url));
        }
      } catch (err) {
        setError("Không thể tải dữ liệu BĐS");
      } finally {
        setFetching(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev: any) => {
      const newState = {
        ...prev,
        [name]: ["price", "area", "bedrooms", "bathrooms", "floors", "frontage"].includes(name) 
          ? Number(value) 
          : value,
      };

      // Logic Cascading: Khi đổi Thành phố, tự động cập nhật Quận đầu tiên
      if (name === 'city') {
        const districts = DISTRICTS_BY_CITY[value] || [];
        newState.district = districts.length > 0 ? districts[0].value : '';
      }

      return newState;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    
    if (existingImages.length + images.length + newFiles.length > 10) {
      alert("Tối đa 10 ảnh");
      return;
    }

    setImages(prev => [...prev, ...newFiles]);
    const previews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeImage = (index: number) => {
    if (index < existingImages.length) {
      const newExisting = [...existingImages];
      newExisting.splice(index, 1);
      setExistingImages(newExisting);
    } else {
      const newImages = [...images];
      newImages.splice(index - existingImages.length, 1);
      setImages(newImages);
    }

    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Bạn cần đăng nhập");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const submitData = new FormData();
      
      // Append basic fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Append existing images as JSON string
      submitData.append("existingImages", JSON.stringify(existingImages));

      // Append new files
      images.forEach(file => {
        submitData.append("images", file);
      });

      await updateListing(id!, submitData, token);
      setSuccess("Cập nhật thành công!");
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err: any) {
      setError(err.message || "Lỗi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  const availableDistricts = DISTRICTS_BY_CITY[formData.city] || [];

  if (fetching) {
    return <div className="flex justify-center mt-20"><Spinner /></div>;
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-[#1A237E] text-white py-8 px-10">
          <h1 className="text-3xl font-bold">Chỉnh sửa tin</h1>
          <p className="mt-2 text-indigo-100 opacity-80">Cập nhật các thông số để tin đăng của bạn chính xác nhất</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 p-4 rounded-lg border border-green-100">{success}</div>}

          {/* SECTION 1: CƠ BẢN */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">1</span>
              <h2 className="text-xl font-bold text-gray-800">Thông tin cơ bản</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className={labelStyle}>Tiêu đề tin đăng *</label>
                <input name="title" value={formData.title} onChange={handleInputChange} required className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Hình thức *</label>
                <select name="type" value={formData.type} onChange={handleInputChange} className={inputStyle}>
                  <option value="Đông">Đông</option><option value="Tây">Tây</option><option value="Nam">Nam</option><option value="Bắc">Bắc</option>
                  <option value="Đông Bắc">Đông Bắc</option><option value="Đông Nam">Đông Nam</option><option value="Tây Bắc">Tây Bắc</option><option value="Tây Nam">Tây Nam</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Pháp lý *</label>
                <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className={inputStyle}>
                  <option value="Sổ hồng/Sổ đỏ">Sổ hồng/Sổ đỏ</option>
                  <option value="Hợp đồng">Hợp đồng</option>
                  <option value="Đang chờ sổ">Đang chờ sổ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Giá (VNĐ) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Diện tích (m²) *</label>
                <input type="number" name="area" value={formData.area} onChange={handleInputChange} required className={inputStyle} />
              </div>
            </div>
          </section>

          {/* SECTION 2: CẤU TRÚC (GỌN GÀNG) */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">2</span>
              <h2 className="text-xl font-bold text-gray-800">Cấu trúc & Vị trí</h2>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                <div className="flex flex-col">
                  <label className={labelStyle}>Số tầng *</label>
                  <input type="number" name="floors" min="1" value={formData.floors} onChange={handleInputChange} className={inputStyle} />
                </div>
                <div className="flex flex-col">
                  <label className={labelStyle}>Mặt tiền (m) *</label>
                  <input type="number" name="frontage" min="0" step="0.1" value={formData.frontage} onChange={handleInputChange} className={inputStyle} />
                </div>
                <div className="flex flex-col">
                  <label className={labelStyle}>Phòng ngủ</label>
                  <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className={inputStyle} />
                </div>
                <div className="flex flex-col">
                  <label className={labelStyle}>Phòng tắm</label>
                  <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className={inputStyle} />
                </div>
                <div className="flex flex-col col-span-2 lg:col-span-1">
                  <label className={labelStyle}>Nội thất *</label>
                  <select name="furniture_state" value={formData.furniture_state} onChange={handleInputChange} className={inputStyle}>
                    {FURNITURE_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Tỉnh / Thành phố *</label>
                <select name="city" value={formData.city} onChange={handleInputChange} className={inputStyle}>
                  {CITIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelStyle}>Quận / Huyện *</label>
                <select name="district" value={formData.district} onChange={handleInputChange} className={inputStyle}>
                  {availableDistricts.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className={labelStyle}>Địa chỉ chi tiết *</label>
                <input name="address" value={formData.address} onChange={handleInputChange} required className={inputStyle} />
              </div>
            </div>
          </section>

          {/* SECTION 3: MÔ TẢ & HÌNH ẢNH */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">3</span>
              <h2 className="text-xl font-bold text-gray-800">Mô tả & Hình ảnh</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className={labelStyle}>Mô tả chi tiết *</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={6} className={`${inputStyle} resize-none`} placeholder="Mô tả ưu điểm của bất động sản..." />
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50 transition-all group relative">
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" id="images" />
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <span className="text-indigo-600 font-bold">Thêm hình ảnh</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {imagePreviews.map((img, index) => (
                  <div key={index} className="relative aspect-video group">
                    <img src={img} className="h-full w-full object-cover rounded-xl shadow-md" alt="Preview" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="pt-8 border-t flex justify-end gap-4">
            <button type="button" onClick={() => navigate("/profile")} className="px-8 py-4 rounded-xl border font-bold text-gray-600 hover:bg-gray-100 transition-colors">Hủy</button>
            <button disabled={loading} className="bg-[#1A237E] text-white px-12 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-indigo-200 hover:translate-y-[-2px] transition-all disabled:opacity-50">
              {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListingPage;