import React, { useState } from 'react';
import { getValuation } from '../services/api'; // Giả sử API đã có
import Button from '../components/Button'; // Component Button của bạn

// Danh sách city phổ biến (dựa trên data train + thực tế BĐS VN 2025-2026)
// Mã viết tắt để encode dễ, nhưng hiển thị full name cho user
const CITIES = [
  { value: 'HCM', label: 'TP. Hồ Chí Minh' },
  { value: 'HN', label: 'Hà Nội' },
  { value: 'HP', label: 'Hải Phòng' },
  { value: 'BD', label: 'Bình Dương' },
  { value: 'Đồng Nai', label: 'Đồng Nai' },
  { value: 'ĐN', label: 'Đà Nẵng' },
  { value: 'HY', label: 'Hưng Yên' },
  { value: 'KH', label: 'Khánh Hòa' },
  { value: 'BRVT', label: 'Bà Rịa - Vũng Tàu' },
  { value: 'LA', label: 'Long An' },
  { value: 'BT', label: 'Bình Thuận' },
  { value: 'CT', label: 'Cần Thơ' },
  // Thêm nếu cần: 'QN', 'PT', 'TH', 'KG',...
  { value: 'Other', label: 'Khác' },
];

// District theo city (cập nhật phổ biến nhất 2025-2026, tập trung HCM + HN + BD + Đồng Nai)
const DISTRICTS_BY_CITY: Record<string, { value: string; label: string }[]> = {
  HCM: [
    { value: 'Quận 1', label: 'Quận 1' },
    { value: 'Quận 3', label: 'Quận 3' },
    { value: 'Quận 4', label: 'Quận 4' },
    { value: 'Quận 5', label: 'Quận 5' },
    { value: 'Quận 7', label: 'Quận 7' },
    { value: 'Quận 10', label: 'Quận 10' },
    { value: 'Quận Bình Thạnh', label: 'Bình Thạnh' },
    { value: 'Quận Gò Vấp', label: 'Gò Vấp' },
    { value: 'Quận Phú Nhuận', label: 'Phú Nhuận' },
    { value: 'Quận Tân Bình', label: 'Tân Bình' },
    { value: 'Quận Tân Phú', label: 'Tân Phú' },
    { value: 'TP. Thủ Đức', label: 'TP. Thủ Đức' },
    { value: 'Huyện Bình Chánh', label: 'Bình Chánh' },
    { value: 'Huyện Nhà Bè', label: 'Nhà Bè' },
    { value: 'Other', label: 'Khác' },
  ],
  HN: [
    { value: 'Cầu Giấy', label: 'Cầu Giấy' },
    { value: 'Đống Đa', label: 'Đống Đa' },
    { value: 'Hai Bà Trưng', label: 'Hai Bà Trưng' },
    { value: 'Hoàn Kiếm', label: 'Hoàn Kiếm' },
    { value: 'Long Biên', label: 'Long Biên' },
    { value: 'Thanh Xuân', label: 'Thanh Xuân' },
    { value: 'Hoàng Mai', label: 'Hoàng Mai' },
    { value: 'Hà Đông', label: 'Hà Đông' },
    { value: 'Ba Đình', label: 'Ba Đình' },
    { value: 'Tây Hồ', label: 'Tây Hồ' },
    { value: 'Other', label: 'Khác' },
  ],
  BD: [
    { value: 'Thủ Dầu Một', label: 'Thủ Dầu Một' },
    { value: 'Thuận An', label: 'Thuận An' },
    { value: 'Dĩ An', label: 'Dĩ An' },
    { value: 'Tân Uyên', label: 'Tân Uyên' },
    { value: 'Other', label: 'Khác' },
  ],
  'Đồng Nai': [
    { value: 'Biên Hòa', label: 'Biên Hòa' },
    { value: 'Long Thành', label: 'Long Thành' },
    { value: 'Nhơn Trạch', label: 'Nhơn Trạch' },
    { value: 'Other', label: 'Khác' },
  ],
  // Thêm city khác nếu cần
  default: [{ value: 'Other', label: 'Chọn quận/huyện' }],
};

const DIRECTIONS = [
  'Nam',
  'Đông Nam',
  'Đông',
  'Bắc',
  'Tây Bắc',
  'Tây Nam',
  'Tây',
  'Đông Bắc',
  'Missing', // Để khớp model nếu không chọn
];

const LEGAL_STATUSES = [
  'Sổ hồng riêng',
  'Sổ đỏ',
  'Đang chờ sổ',
  'Sale contract',
  'Have certificate',
  'Khác',
];

const FURNITURE_STATES = [
  'Nội thất đầy đủ',
  'Nội thất cao cấp',
  'Nội thất cơ bản',
  'Không nội thất',
  'Basic',
  'Full',
  'Missing',
];

const ValuationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    city: 'HCM',
    district: 'Other',
    area: 80,
    bedrooms: 3,
    bathrooms: 2,
    floors: 4,
    frontage: 5,
    access_road: 6,
    house_direction: 'Nam',
    legal_status: 'Sổ hồng riêng',
    furniture_state: 'Nội thất đầy đủ',
  });

  const [valuation, setValuation] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        [
          'area',
          'bedrooms',
          'bathrooms',
          'floors',
          'frontage',
          'access_road',
        ].includes(name)
          ? Number(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValuation(null);

    if (formData.area <= 0) {
      setError('Diện tích phải lớn hơn 0.');
      return;
    }
    if (formData.city === 'Other' || formData.district === 'Other') {
      setError('Vui lòng chọn thành phố và quận/huyện cụ thể.');
      return;
    }

    setLoading(true);

    try {
      const result = await getValuation(formData);
      setValuation(result); // Giả sử API trả về số tỷ VND
    } catch (err: any) {
      setError(err.message || 'Không thể định giá. Vui lòng thử lại.');
      console.error('Valuation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (val: number) => {
    const billion = val.toFixed(2);
    const fullVND = (val * 1_000_000_000).toLocaleString('vi-VN');
    return `${billion} tỷ VND (khoảng ${fullVND} VND)`;
  };

  const availableDistricts =
    DISTRICTS_BY_CITY[formData.city] || DISTRICTS_BY_CITY.default;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Công Cụ Định Giá Bất Động Sản (AI)
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Chọn thông tin chi tiết để AI ước tính giá chính xác hơn.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-2xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thành phố */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              Thành phố
            </label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              required
            >
              {CITIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quận/Huyện */}
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700">
              Quận / Huyện
            </label>
            <select
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              required
            >
              <option value="Other">Chọn quận/huyện</option>
              {availableDistricts.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Diện tích */}
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700">
              Diện tích (m²)
            </label>
            <input
              type="number"
              name="area"
              id="area"
              value={formData.area}
              onChange={handleChange}
              min="10"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Các field còn lại giữ nguyên, chỉ đổi label cho rõ */}
          <div>
            <label htmlFor="bedrooms">Số phòng ngủ</label>
            <input type="number" name="bedrooms" id="bedrooms" value={formData.bedrooms} onChange={handleChange} min="0" className="..." />
          </div>

          <div>
            <label htmlFor="bathrooms">Số phòng tắm</label>
            <input type="number" name="bathrooms" id="bathrooms" value={formData.bathrooms} onChange={handleChange} min="0" className="..." />
          </div>

          <div>
            <label htmlFor="floors">Số tầng</label>
            <input type="number" name="floors" id="floors" value={formData.floors} onChange={handleChange} min="1" className="..." />
          </div>

          <div>
            <label htmlFor="frontage">Mặt tiền (m)</label>
            <input type="number" name="frontage" id="frontage" value={formData.frontage} onChange={handleChange} step="0.1" min="0" className="..." />
          </div>

          <div>
            <label htmlFor="access_road">Đường vào (m)</label>
            <input type="number" name="access_road" id="access_road" value={formData.access_road} onChange={handleChange} step="0.1" min="0" className="..." />
          </div>

          {/* Hướng nhà - danh sách sạch, dễ encode */}
          <div>
            <label htmlFor="house_direction">Hướng nhà</label>
            <select
              id="house_direction"
              name="house_direction"
              value={formData.house_direction}
              onChange={handleChange}
              className="..."
              required
            >
              {DIRECTIONS.map((dir) => (
                <option key={dir} value={dir}>
                  {dir}
                </option>
              ))}
            </select>
          </div>

          {/* Pháp lý */}
          <div>
            <label htmlFor="legal_status">Pháp lý</label>
            <select
              id="legal_status"
              name="legal_status"
              value={formData.legal_status}
              onChange={handleChange}
              className="..."
            >
              {LEGAL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Nội thất */}
          <div>
            <label htmlFor="furniture_state">Nội thất</label>
            <select
              id="furniture_state"
              name="furniture_state"
              value={formData.furniture_state}
              onChange={handleChange}
              className="..."
            >
              {FURNITURE_STATES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded"
            >
              {loading ? 'Đang định giá bằng AI...' : 'Nhận Định Giá'}
            </Button>
          </div>
        </form>

        {error && <p className="text-red-600 mt-6 text-center font-medium">{error}</p>}
      </div>

      {valuation !== null && (
        <div className="mt-12 bg-green-50 border-l-4 border-green-500 p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-green-800 mb-4">Giá trị ước tính (AI)</h3>
          <div className="text-4xl font-extrabold text-green-700">{formatPrice(valuation)}</div>
          <p className="mt-4 text-sm text-green-600">
            Ước tính dựa trên mô hình học máy và dữ liệu thị trường. Giá thực tế có thể thay đổi.
          </p>
        </div>
      )}
    </div>
  );
};

export default ValuationPage;