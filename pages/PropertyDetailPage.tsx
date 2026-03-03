import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchPropertyById } from "../services/api";
import type { Property } from "../types";
import Spinner from "../components/Spinner";
import NotFoundPage from "./NotFoundPage";
import { BedIcon, BathIcon, AreaIcon, MapPinIcon } from "../assets/icons";

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!id) return;

  const loadProperty = async () => {
    try {
      const data = await fetchPropertyById(id);
      setProperty(data ?? null); // ✅ fix ở đây
    } catch (error) {
      console.error("Failed to fetch property:", error);
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  loadProperty();
}, [id]);

  if (loading) return <Spinner />;
  if (!property) return <NotFoundPage />;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            {property.title}
          </h1>

          <div className="mt-2 flex items-center text-lg text-gray-500">
            <MapPinIcon className="h-6 w-6 mr-2" />
            <span>
              {property.location?.address || "Không rõ địa chỉ"},
              {" "}
              {property.location?.city || ""}
            </span>
          </div>
        </div>

        {/* IMAGE GALLERY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <img
            src={property.images?.[0] || "/no-image.jpg"}
            alt={property.title}
            className="w-full h-96 object-cover rounded-lg shadow-md"
          />

          <div className="grid grid-cols-2 gap-4">
            {property.images?.slice(1, 5).map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${property.title} ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* MAIN INFO */}
          <div className="md:col-span-2">

            <div className="flex justify-between items-center mb-6">
              <span className="text-4xl font-bold text-primary">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(property.price)}
              </span>

              <span className="bg-secondary text-white px-4 py-2 rounded-full text-lg font-semibold">
                {property.status}
              </span>
            </div>

            {/* INFO BOX */}
            <div className="flex justify-around items-center text-gray-700 border p-4 rounded-lg shadow-sm mb-6">

              <div className="flex items-center space-x-2 text-lg">
                <BedIcon className="h-7 w-7 text-primary" />
                <span>{property.bedrooms || 0} Phòng ngủ</span>
              </div>

              <div className="flex items-center space-x-2 text-lg">
                <BathIcon className="h-7 w-7 text-primary" />
                <span>{property.bathrooms || 0} Phòng tắm</span>
              </div>

              <div className="flex items-center space-x-2 text-lg">
                <AreaIcon className="h-7 w-7 text-primary" />
                <span>{property.area || 0} m²</span>
              </div>

            </div>

            {/* DESCRIPTION */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Mô tả
            </h2>

            <p className="text-gray-600 leading-relaxed">
              {property.description || "Chưa có mô tả."}
            </p>
          </div>

          {/* SIDEBAR */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md h-fit">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Thông tin bài đăng
            </h3>

            <p className="mb-2">
              <strong>Loại:</strong> {property.type}
            </p>

            <p className="mb-2">
              <strong>Phân loại:</strong> {property.propertyType}
            </p>

            <p className="mb-2">
              <strong>Lượt xem:</strong> {property.views || 0}
            </p>

            <p className="mb-2">
              <strong>Lượt yêu thích:</strong> {property.favoriteCount || 0}
            </p>

            <p className="mb-2">
              <strong>Ngày đăng:</strong>{" "}
              {new Date(property.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;