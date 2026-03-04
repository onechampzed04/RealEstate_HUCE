import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {
  fetchMyListings,
  createListing,
  updateListing,
  deleteListing,
  type Listing,
  type ListingFormData,
} from '../services/api';
import Spinner from '../components/Spinner';
import ConfirmationModal from '../components/ConfirmationModal';
import { toast } from 'react-toastify';

// ─── Helpers ────────────────────────────────────────────────────────────────

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  APARTMENT: 'Căn hộ',
  HOUSE: 'Nhà ở',
  LAND: 'Đất',
  VILLA: 'Biệt thự',
};

const LISTING_TYPE_LABELS: Record<string, string> = {
  SALE: 'Bán',
  RENT: 'Cho thuê',
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Chờ duyệt', className: 'bg-yellow-100 text-yellow-800' },
  APPROVED: { label: 'Đã duyệt', className: 'bg-green-100 text-green-800' },
  REJECTED: { label: 'Bị từ chối', className: 'bg-red-100 text-red-800' },
  EXPIRED: { label: 'Hết hạn', className: 'bg-gray-100 text-gray-600' },
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

// ─── Default form state ───────────────────────────────────────────────────────

const defaultForm: ListingFormData = {
  title: '',
  description: '',
  type: 'SALE',
  propertyType: 'APARTMENT',
  price: 0,
  area: 0,
  bedrooms: undefined,
  bathrooms: undefined,
  address: '',
  city: '',
  district: '',
  ward: '',
  images: [],
};

// ─── Listing Form Modal ───────────────────────────────────────────────────────

interface ListingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ListingFormData) => Promise<void>;
  initialData?: Listing | null;
  isSubmitting: boolean;
}

const ListingFormModal: React.FC<ListingFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}) => {
  const [form, setForm] = useState<ListingFormData>(defaultForm);
  const [imagesInput, setImagesInput] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof ListingFormData, string>>>({});

  // Đổ dữ liệu khi mở form sửa
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        description: initialData.description,
        type: initialData.type,
        propertyType: initialData.propertyType,
        price: initialData.price,
        area: initialData.area,
        bedrooms: initialData.bedrooms,
        bathrooms: initialData.bathrooms,
        address: initialData.location?.address || '',
        city: initialData.location?.city || '',
        district: initialData.location?.district || '',
        ward: initialData.location?.ward || '',
        images: initialData.images || [],
      });
      setImagesInput((initialData.images || []).join('\n'));
    } else {
      setForm(defaultForm);
      setImagesInput('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'area' || name === 'bedrooms' || name === 'bathrooms'
          ? value === '' ? undefined : Number(value)
          : value,
    }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ListingFormData, string>> = {};
    if (!form.title.trim()) newErrors.title = 'Vui lòng nhập tiêu đề';
    if (!form.price || form.price <= 0) newErrors.price = 'Vui lòng nhập giá hợp lệ';
    if (!form.area || form.area <= 0) newErrors.area = 'Vui lòng nhập diện tích hợp lệ';
    if (!form.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (!form.city.trim()) newErrors.city = 'Vui lòng nhập thành phố';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const images = imagesInput
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean);
    await onSubmit({ ...form, images });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-start overflow-y-auto py-8">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-primary rounded-t-xl">
          <h2 className="text-xl font-bold text-white">
            {initialData ? '✏️ Chỉnh sửa bài đăng' : '➕ Thêm bài đăng mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Tiêu đề */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ví dụ: Căn hộ 2PN view sông Hồng..."
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.title ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Loại hình + Loại BĐS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hình thức</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="SALE">Bán</option>
                <option value="RENT">Cho thuê</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Loại bất động sản</label>
              <select
                name="propertyType"
                value={form.propertyType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="APARTMENT">Căn hộ</option>
                <option value="HOUSE">Nhà ở</option>
                <option value="LAND">Đất</option>
                <option value="VILLA">Biệt thự</option>
              </select>
            </div>
          </div>

          {/* Giá + Diện tích */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Giá (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={form.price || ''}
                onChange={handleChange}
                placeholder="Ví dụ: 3500000000"
                min={0}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.price ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Diện tích (m²) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="area"
                value={form.area || ''}
                onChange={handleChange}
                placeholder="Ví dụ: 75"
                min={0}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.area ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
            </div>
          </div>

          {/* Phòng ngủ + Phòng tắm */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Số phòng ngủ</label>
              <input
                type="number"
                name="bedrooms"
                value={form.bedrooms ?? ''}
                onChange={handleChange}
                placeholder="Ví dụ: 2"
                min={0}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Số phòng tắm</label>
              <input
                type="number"
                name="bathrooms"
                value={form.bathrooms ?? ''}
                onChange={handleChange}
                placeholder="Ví dụ: 2"
                min={0}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Số nhà, tên đường..."
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.address ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          {/* Thành phố + Quận + Phường */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Thành phố <span className="text-red-500">*</span>
              </label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Hà Nội"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.city ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Quận / Huyện</label>
              <input
                name="district"
                value={form.district}
                onChange={handleChange}
                placeholder="Cầu Giấy"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phường / Xã</label>
              <input
                name="ward"
                value={form.ward}
                onChange={handleChange}
                placeholder="Dịch Vọng"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Mô tả chi tiết về bất động sản..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* URL ảnh */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              URL ảnh (mỗi ảnh một dòng)
            </label>
            <textarea
              value={imagesInput}
              onChange={(e) => setImagesInput(e.target.value)}
              rows={3}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono"
            />
            <p className="text-xs text-gray-400 mt-1">Ảnh đầu tiên sẽ được dùng làm ảnh đại diện</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition text-sm font-semibold disabled:opacity-60 flex items-center gap-2"
            >
              {isSubmitting && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              {isSubmitting ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Đăng bài'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const ManageListingsPage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal trạng thái
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Listing | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Lọc theo trạng thái
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const loadListings = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMyListings(token);
      setListings(result.listings || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách bài đăng');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);


  // Mở form thêm
  const handleOpenCreate = () => {
    setEditTarget(null);
    setSubmitError(null);
    setFormOpen(true);
  };

  // Mở form sửa
  const handleOpenEdit = (listing: Listing) => {
    setEditTarget(listing);
    setSubmitError(null);
    setFormOpen(true);
  };

  // Submit form thêm / sửa
  const handleFormSubmit = async (data: ListingFormData) => {
    if (!token) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (editTarget) {
        await updateListing(editTarget._id, data, token);
        toast.success('Cập nhật bài đăng thành công!');
      } else {
        await createListing(data, token);
        toast.success('Đăng bài thành công! Bài đăng đang chờ duyệt.');
      }
      setFormOpen(false);
      await loadListings();
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xóa bài đăng
  const handleDelete = async () => {
    if (!token || !deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteListing(deleteTarget._id, token);
      toast.success('Đã xóa bài đăng thành công!');
      setDeleteTarget(null);
      await loadListings();
    } catch (err: any) {
      toast.error(err.message || 'Không thể xóa bài đăng');
    } finally {
      setIsDeleting(false);
    }
  };

  // Lọc theo trạng thái
  const filteredListings = filterStatus === 'all'
    ? listings
    : listings.filter((l) => l.status === filterStatus);

  const statusCounts = listings.reduce<Record<string, number>>((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">🏠 Quản lý Bài đăng</h1>
            <p className="text-gray-500 mt-1">Danh sách bất động sản bạn đã đăng</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary/90 transition font-semibold shadow"
          >
            <span className="text-lg">＋</span> Thêm bài đăng
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            ⚠️ {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { status: 'all', label: 'Tất cả', color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { status: 'PENDING', label: 'Chờ duyệt', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
            { status: 'APPROVED', label: 'Đã duyệt', color: 'bg-green-50 text-green-700 border-green-200' },
            { status: 'REJECTED', label: 'Bị từ chối', color: 'bg-red-50 text-red-700 border-red-200' },
          ].map(({ status, label, color }) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition font-semibold ${color} ${filterStatus === status ? 'ring-2 ring-offset-1 ring-primary' : 'opacity-80 hover:opacity-100'}`}
            >
              <span className="text-2xl font-bold">
                {status === 'all' ? listings.length : statusCounts[status] || 0}
              </span>
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>

        {/* Listing Table */}
        {loading ? (
          <Spinner />
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-4">🏘️</div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">Chưa có bài đăng nào</h3>
            <p className="text-gray-400 mb-6">Hãy thêm bất động sản đầu tiên của bạn!</p>
            <button
              onClick={handleOpenCreate}
              className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary/90 font-semibold"
            >
              Thêm bài đăng ngay
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Bài đăng</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Loại</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Giá</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Diện tích</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Địa chỉ</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Trạng thái</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Ngày đăng</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredListings.map((listing) => {
                    const statusInfo = STATUS_CONFIG[listing.status] || STATUS_CONFIG.PENDING;
                    return (
                      <tr key={listing._id} className="hover:bg-gray-50 transition">
                        {/* Tiêu đề + ảnh */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {listing.images?.[0] ? (
                              <img
                                src={listing.images[0]}
                                alt={listing.title}
                                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://placehold.co/56x56/e5e7eb/9ca3af?text=No+Img';
                                }}
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl">🏠</span>
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-800 truncate max-w-[200px]">
                                {listing.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {listing.bedrooms != null && `${listing.bedrooms} PN`}
                                {listing.bedrooms != null && listing.bathrooms != null && ' · '}
                                {listing.bathrooms != null && `${listing.bathrooms} PT`}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Loại */}
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${listing.type === 'SALE' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                              {LISTING_TYPE_LABELS[listing.type]}
                            </span>
                            <span className="text-xs text-gray-500">{PROPERTY_TYPE_LABELS[listing.propertyType]}</span>
                          </div>
                        </td>

                        {/* Giá */}
                        <td className="px-4 py-3 font-semibold text-primary whitespace-nowrap">
                          {formatPrice(listing.price)}
                        </td>

                        {/* Diện tích */}
                        <td className="px-4 py-3 text-gray-600">{listing.area} m²</td>

                        {/* Địa chỉ */}
                        <td className="px-4 py-3 text-gray-600 max-w-[180px]">
                          <p className="truncate">
                            {[listing.location?.address, listing.location?.district, listing.location?.city]
                              .filter(Boolean)
                              .join(', ') || '—'}
                          </p>
                        </td>

                        {/* Trạng thái */}
                        <td className="px-4 py-3">
                          <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${statusInfo.className}`}>
                            {statusInfo.label}
                          </span>
                        </td>

                        {/* Ngày đăng */}
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {new Date(listing.createdAt).toLocaleDateString('vi-VN')}
                        </td>

                        {/* Thao tác */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEdit(listing)}
                              title="Chỉnh sửa"
                              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => setDeleteTarget(listing)}
                              title="Xóa"
                              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredListings.map((listing) => {
                const statusInfo = STATUS_CONFIG[listing.status] || STATUS_CONFIG.PENDING;
                return (
                  <div key={listing._id} className="p-4">
                    <div className="flex gap-3">
                      {listing.images?.[0] ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://placehold.co/80x80/e5e7eb/9ca3af?text=No+Img';
                          }}
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-3xl">
                          🏠
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 truncate">{listing.title}</p>
                        <p className="text-primary font-semibold text-sm mt-0.5">{formatPrice(listing.price)}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {listing.area} m²
                          {listing.bedrooms != null && ` · ${listing.bedrooms} PN`}
                          {listing.bathrooms != null && ` · ${listing.bathrooms} PT`}
                        </p>
                        <p className="text-gray-400 text-xs truncate">
                          {[listing.location?.address, listing.location?.city].filter(Boolean).join(', ') || '—'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusInfo.className}`}>
                            {statusInfo.label}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(listing.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleOpenEdit(listing)}
                        className="flex-1 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 transition"
                      >
                        ✏️ Chỉnh sửa
                      </button>
                      <button
                        onClick={() => setDeleteTarget(listing)}
                        className="flex-1 py-2 rounded-lg bg-red-50 text-red-700 font-semibold text-sm hover:bg-red-100 transition"
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-4 py-3 bg-gray-50 border-t text-sm text-gray-500">
              Hiển thị {filteredListings.length} / {listings.length} bài đăng
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <ListingFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editTarget}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Xác nhận xóa bài đăng"
      >
        <p>
          Bạn có chắc chắn muốn xóa bài đăng{' '}
          <strong>"{deleteTarget?.title}"</strong> không?
        </p>
        <p className="mt-2 text-sm text-red-500">Hành động này không thể hoàn tác.</p>
      </ConfirmationModal>
    </div>
  );
};

export default ManageListingsPage;
