import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateListing, fetchPropertyById } from "../services/api";
import Spinner from "../components/Spinner";
import useAuth from "../hooks/useAuth";

const EditListingPage: React.FC = () => {

  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    type: "SALE",
    propertyType: "HOUSE",
    price: 0,
    area: 0,
    bedrooms: 0,
    bathrooms: 0,
    address: "",
    city: "",
    district: "",
    ward: "",
    images: []
  });

  // ================================
  // LOAD DATA CŨ
  // ================================

  useEffect(() => {

    const fetchListing = async () => {

      try {

        const data = await fetchPropertyById(id!);
        if (!data) return;
        setFormData(data);

        if (data.images) {
          setImagePreviews(data.images);
        }

      } catch (err) {
        setError("Không thể tải dữ liệu BĐS");
      } finally {
        setFetching(false);
      }

    };

    fetchListing();

  }, [id]);

  // ================================
  // INPUT CHANGE
  // ================================

  const handleInputChange = (e: any) => {

    const { name, value } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]:
        ["price", "area", "bedrooms", "bathrooms"].includes(name)
          ? Number(value)
          : value,
    }));

  };

  // ================================
  // IMAGE
  // ================================

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return;

  const files = Array.from(e.target.files); // File[]

  setImages(files);

  const previews = files.map((file) =>
    URL.createObjectURL(file)
  );

  setImagePreviews(previews);
};

  // ================================
  // SUBMIT UPDATE
  // ================================

  const handleSubmit = async (e: any) => {

    e.preventDefault();

    if (!token) {
      setError("Bạn cần đăng nhập");
      return;
    }

    setLoading(true);

    try {

      const finalData = {
        ...formData
      };

      await updateListing(id!, finalData, token);

      setSuccess("Cập nhật thành công!");

      setTimeout(() => {
        navigate("/my-listings");
      }, 2000);

    } catch (err: any) {

      setError(err.message || "Lỗi cập nhật");

    } finally {

      setLoading(false);

    }

  };

  // ================================
  // UI
  // ================================

  if (fetching) {
    return (
      <div className="flex justify-center mt-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg">

        <div className="bg-[#1A237E] text-white p-6">
          <h1 className="text-2xl font-bold">
            Chỉnh sửa tin Bất Động Sản
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded">
              {success}
            </div>
          )}

          {/* TITLE */}

          <div>
            <label className="block mb-2">Tiêu đề</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
            />
          </div>

          {/* TYPE */}

          <div>
            <label className="block mb-2">Hình thức</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
            >
              <option value="SALE">Bán</option>
              <option value="RENT">Cho thuê</option>
            </select>
          </div>

          {/* PRICE */}

          <div>
            <label className="block mb-2">Giá</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
            />
          </div>

          {/* AREA */}

          <div>
            <label className="block mb-2">Diện tích</label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
            />
          </div>

          {/* ADDRESS */}

          <div>
            <label className="block mb-2">Địa chỉ</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="block mb-2">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
              rows={4}
            />
          </div>

          {/* IMAGE */}

          <div>

            <label className="block mb-2">Hình ảnh</label>

            <input
              type="file"
              multiple
              onChange={handleImageChange}
            />

            <div className="grid grid-cols-3 gap-3 mt-4">

              {imagePreviews.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  className="h-24 w-full object-cover rounded"
                />
              ))}

            </div>

          </div>

          {/* BUTTON */}

          <button
            disabled={loading}
            className="bg-[#1A237E] text-white px-6 py-3 rounded"
          >
            {loading ? "Đang cập nhật..." : "Cập nhật tin"}
          </button>

        </form>

      </div>

    </div>
  );

};

export default EditListingPage;