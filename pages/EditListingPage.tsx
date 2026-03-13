import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateListing, fetchPropertyById } from "../services/api";
import Spinner from "../components/Spinner";
import useAuth from "../hooks/useAuth";

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
    address: '',
    city: 'Hồ Chí Minh',
    district: '',
    ward: ''
  });

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
          address: data.location?.address || "",
          city: data.location?.city || "Hồ Chí Minh",
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
    setFormData((prev: any) => ({
      ...prev,
      [name]: ["price", "area", "bedrooms", "bathrooms"].includes(name) ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    if (existingImages.length + images.length + files.length > 10) {
      alert("Tối đa 10 ảnh");
      return;
    }

    setImages(prev => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeImage = (index: number) => {
    // Check if it's an existing image or a new one
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

  if (fetching) {
    return <div className="flex justify-center mt-20"><Spinner /></div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#1A237E] text-white p-6">
          <h1 className="text-2xl font-bold">Chỉnh sửa tin Bất Động Sản</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded border border-red-200">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 p-3 rounded border border-green-200">{success}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block mb-2 font-medium">Tiêu đề</label>
              <input name="title" value={formData.title} onChange={handleInputChange} required className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div>
              <label className="block mb-2 font-medium">Hình thức</label>
              <select name="type" value={formData.type} onChange={handleInputChange} className="w-full border p-3 rounded">
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

            <div>
              <label className="block mb-2 font-medium">Loại BĐS</label>
              <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className="w-full border p-3 rounded">
                <option value="Sổ hồng/Sổ đỏ">Sổ hồng/Sổ đỏ</option>
                <option value="Hợp đồng">Hợp đồng</option>
                <option value="Đang chờ sổ">Đang chờ sổ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">Giá (VNĐ)</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="w-full border p-3 rounded" />
            </div>

            <div>
              <label className="block mb-2 font-medium">Diện tích (m²)</label>
              <input type="number" name="area" value={formData.area} onChange={handleInputChange} required className="w-full border p-3 rounded" />
            </div>

            <div>
              <label className="block mb-2 font-medium">Phòng ngủ</label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className="w-full border p-3 rounded" />
            </div>

            <div>
              <label className="block mb-2 font-medium">Phòng vệ sinh</label>
              <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className="w-full border p-3 rounded" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Vị trí</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Địa chỉ</label>
                <input name="address" value={formData.address} onChange={handleInputChange} required className="w-full border p-3 rounded" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="city" value={formData.city} onChange={handleInputChange} placeholder="Tỉnh/Thành phố" className="border p-3 rounded w-full md:col-span-3" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Hình ảnh</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="text-blue-600 font-medium">Thêm hình ảnh mới</div>
                <div className="text-sm text-gray-500">Tối đa 10 ảnh</div>
              </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {imagePreviews.map((img, index) => (
                <div key={index} className="relative group aspect-video">
                  <img src={img} className="h-full w-full object-cover rounded shadow-sm" alt="Preview" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t flex justify-end gap-4">
            <button type="button" onClick={() => navigate("/profile")} className="px-6 py-3 rounded border font-medium hover:bg-gray-100 transition-colors">Hủy</button>
            <button disabled={loading} className="bg-[#1A237E] text-white px-10 py-3 rounded font-bold shadow-md hover:bg-blue-900 transition-colors disabled:opacity-50">
              {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListingPage;
