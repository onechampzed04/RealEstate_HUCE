import React, { useState } from 'react';

// ===============================================================
// API SERVICE: Giao tiếp với Backend Node.js
// ===============================================================
const API_URL = 'http://localhost:5001/api/listings/valuation'; // Đã sửa thành /listings/

async function getValuation(data: any): Promise<{ valuation: number }> {
  console.log("Dữ liệu gửi đến backend:", JSON.stringify(data, null, 2));
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || `Lỗi từ server: ${response.status}`);
  }
  return result;
}

// ===============================================================
// DỮ LIỆU CẤU HÌNH CHO FORM (THEO QUY HOẠCH MỚI 2025 - ĐẦY ĐỦ NHẤT)
// ===============================================================
const CITIES = [
    { value: 'Thành phố Hà Nội', label: 'Thành phố Hà Nội' },
    { value: 'Thành phố Hồ Chí Minh', label: 'Thành phố Hồ Chí Minh (mới)' },
    { value: 'Thành phố Hải Phòng', label: 'Thành phố Hải Phòng (mới)' },
    { value: 'Thành phố Đà Nẵng', label: 'Thành phố Đà Nẵng (mới)' },
    { value: 'Thành phố Huế', label: 'Thành phố Huế' },
    { value: 'Thành phố Cần Thơ', label: 'Thành phố Cần Thơ (mới)' },
    { value: 'Tỉnh Tuyên Quang', label: 'Tỉnh Tuyên Quang (mới)' },
    { value: 'Tỉnh Lào Cai', label: 'Tỉnh Lào Cai (mới)' },
    { value: 'Tỉnh Thái Nguyên', label: 'Tỉnh Thái Nguyên (mới)' },
    { value: 'Tỉnh Phú Thọ', label: 'Tỉnh Phú Thọ (mới)' },
    { value: 'Tỉnh Bắc Ninh', label: 'Tỉnh Bắc Ninh (mới)' },
    { value: 'Tỉnh Hưng Yên', label: 'Tỉnh Hưng Yên (mới)' },
    { value: 'Tỉnh Ninh Bình', label: 'Tỉnh Ninh Bình (mới)' },
    { value: 'Tỉnh Quảng Trị', label: 'Tỉnh Quảng Trị (mới)' },
    { value: 'Tỉnh Quảng Ngãi', label: 'Tỉnh Quảng Ngãi (mới)' },
    { value: 'Tỉnh Gia Lai', label: 'Tỉnh Gia Lai (mới)' },
    { value: 'Tỉnh Khánh Hòa', label: 'Tỉnh Khánh Hòa (mới)' },
    { value: 'Tỉnh Lâm Đồng', label: 'Tỉnh Lâm Đồng (mới)' },
    { value: 'Tỉnh Đắk Lắk', label: 'Tỉnh Đắk Lắk (mới)' },
    { value: 'Tỉnh Đồng Nai', label: 'Tỉnh Đồng Nai (mới)' },
    { value: 'Tỉnh Tây Ninh', label: 'Tỉnh Tây Ninh (mới)' },
    { value: 'Tỉnh Vĩnh Long', label: 'Tỉnh Vĩnh Long (mới)' },
    { value: 'Tỉnh Đồng Tháp', label: 'Tỉnh Đồng Tháp (mới)' },
    { value: 'Tỉnh Cà Mau', label: 'Tỉnh Cà Mau (mới)' },
    { value: 'Tỉnh An Giang', label: 'Tỉnh An Giang (mới)' },
    // Các tỉnh không sáp nhập
    { value: 'Tỉnh Quảng Ninh', label: 'Tỉnh Quảng Ninh' }, { value: 'Tỉnh Cao Bằng', label: 'Tỉnh Cao Bằng' },
    { value: 'Tỉnh Lạng Sơn', label: 'Tỉnh Lạng Sơn' }, { value: 'Tỉnh Lai Châu', label: 'Tỉnh Lai Châu' },
    { value: 'Tỉnh Điện Biên', label: 'Tỉnh Điện Biên' }, { value: 'Tỉnh Sơn La', label: 'Tỉnh Sơn La' },
    { value: 'Tỉnh Thanh Hóa', label: 'Tỉnh Thanh Hóa' }, { value: 'Tỉnh Nghệ An', label: 'Tỉnh Nghệ An' },
    { value: 'Tỉnh Hà Tĩnh', label: 'Tỉnh Hà Tĩnh' },
];

const DISTRICTS_BY_CITY: Record<string, { value: string; label: string }[]> = {
  // --- CÁC TỈNH/THÀNH KHÔNG SÁP NHẬP ---
  'Thành phố Hà Nội': [
    { value: 'Quận Ba Đình', label: 'Quận Ba Đình' }, { value: 'Quận Hoàn Kiếm', label: 'Quận Hoàn Kiếm' },
    { value: 'Quận Hai Bà Trưng', label: 'Quận Hai Bà Trưng' }, { value: 'Quận Đống Đa', label: 'Quận Đống Đa' },
    { value: 'Quận Tây Hồ', label: 'Quận Tây Hồ' }, { value: 'Quận Cầu Giấy', label: 'Quận Cầu Giấy' },
    { value: 'Quận Thanh Xuân', label: 'Quận Thanh Xuân' }, { value: 'Quận Hoàng Mai', label: 'Quận Hoàng Mai' },
    { value: 'Quận Long Biên', label: 'Quận Long Biên' }, { value: 'Quận Bắc Từ Liêm', label: 'Quận Bắc Từ Liêm' },
    { value: 'Quận Hà Đông', label: 'Quận Hà Đông' }, { value: 'Quận Nam Từ Liêm', label: 'Quận Nam Từ Liêm' },
    { value: 'Thị xã Sơn Tây', label: 'Thị xã Sơn Tây' },
  ],
  'Thành phố Huế': [ { value: 'TP. Huế', label: 'TP. Huế' } ],
  'Tỉnh Quảng Ninh': [ { value: 'TP. Hạ Long', label: 'TP. Hạ Long' }, { value: 'TP. Móng Cái', label: 'TP. Móng Cái' }, { value: 'TP. Cẩm Phả', label: 'TP. Cẩm Phả' }, { value: 'TP. Uông Bí', label: 'TP. Uông Bí' }, { value: 'TX. Đông Triều', label: 'TX. Đông Triều' } ],
  'Tỉnh Cao Bằng': [ { value: 'TP. Cao Bằng', label: 'TP. Cao Bằng' } ],
  'Tỉnh Lạng Sơn': [ { value: 'TP. Lạng Sơn', label: 'TP. Lạng Sơn' } ],
  'Tỉnh Lai Châu': [ { value: 'TP. Lai Châu', label: 'TP. Lai Châu' } ],
  'Tỉnh Điện Biên': [ { value: 'TP. Điện Biên Phủ', label: 'TP. Điện Biên Phủ' }, { value: 'TX. Mường Lay', label: 'TX. Mường Lay' } ],
  'Tỉnh Sơn La': [ { value: 'TP. Sơn La', label: 'TP. Sơn La' }, { value: 'TP. Mộc Châu', label: 'TP. Mộc Châu' } ],
  'Tỉnh Thanh Hóa': [ { value: 'TP. Thanh Hóa', label: 'TP. Thanh Hóa' }, { value: 'TP. Sầm Sơn', label: 'TP. Sầm Sơn' }, { value: 'TX. Bỉm Sơn', label: 'TX. Bỉm Sơn' } ],
  'Tỉnh Nghệ An': [ { value: 'TP. Vinh', label: 'TP. Vinh' }, { value: 'TX. Thái Hòa', label: 'TX. Thái Hòa' }, { value: 'TX. Hoàng Mai', label: 'TX. Hoàng Mai' } ],
  'Tỉnh Hà Tĩnh': [ { value: 'TP. Hà Tĩnh', label: 'TP. Hà Tĩnh' }, { value: 'TX. Hồng Lĩnh', label: 'TX. Hồng Lĩnh' }, { value: 'TX. Kỳ Anh', label: 'TX. Kỳ Anh' } ],
  
  // --- CÁC TỈNH/THÀNH MỚI DO SÁP NHẬP ---
  'Tỉnh Tuyên Quang': [ { value: 'TP. Tuyên Quang', label: 'TP. Tuyên Quang' }, { value: 'TP. Hà Giang', label: 'TP. Hà Giang (từ Hà Giang)' } ],
  'Tỉnh Lào Cai': [ { value: 'TP. Lào Cai', label: 'TP. Lào Cai' }, { value: 'TP. Yên Bái', label: 'TP. Yên Bái (từ Yên Bái)' } ],
  'Tỉnh Thái Nguyên': [ { value: 'TP. Thái Nguyên', label: 'TP. Thái Nguyên' }, { value: 'TP. Sông Công', label: 'TP. Sông Công' }, { value: 'TP. Phổ Yên', label: 'TP. Phổ Yên' }, { value: 'TP. Bắc Kạn', label: 'TP. Bắc Kạn (từ Bắc Kạn)' } ],
  'Tỉnh Phú Thọ': [ { value: 'TP. Việt Trì', label: 'TP. Việt Trì' }, { value: 'TP. Vĩnh Yên', label: 'TP. Vĩnh Yên (từ Vĩnh Phúc)' }, { value: 'TP. Phúc Yên', label: 'TP. Phúc Yên (từ Vĩnh Phúc)' }, { value: 'TP. Hòa Bình', label: 'TP. Hòa Bình (từ Hòa Bình)' } ],
  'Tỉnh Bắc Ninh': [ { value: 'TP. Bắc Ninh', label: 'TP. Bắc Ninh' }, { value: 'TP. Bắc Giang', label: 'TP. Bắc Giang (từ Bắc Giang)' }, { value: 'TP. Từ Sơn', label: 'TP. Từ Sơn' } ],
  'Tỉnh Hưng Yên': [ { value: 'TP. Hưng Yên', label: 'TP. Hưng Yên' }, { value: 'TP. Thái Bình', label: 'TP. Thái Bình (từ Thái Bình)' } ],
  'Thành phố Hải Phòng': [ { value: 'TP. Thủy Nguyên', label: 'TP. Thủy Nguyên' }, { value: 'TP. Hải Dương', label: 'TP. Hải Dương (từ Hải Dương)' }, { value: 'TP. Chí Linh', label: 'TP. Chí Linh (từ Hải Dương)' } ],
  'Tỉnh Ninh Bình': [ { value: 'TP. Ninh Bình', label: 'TP. Ninh Bình' }, { value: 'TP. Nam Định', label: 'TP. Nam Định (từ Nam Định)' }, { value: 'TP. Phủ Lý', label: 'TP. Phủ Lý (từ Hà Nam)' }, { value: 'TP. Tam Điệp', label: 'TP. Tam Điệp' } ],
  'Tỉnh Quảng Trị': [ { value: 'TP. Đồng Hới', label: 'TP. Đồng Hới (từ Quảng Bình)' }, { value: 'TP. Đông Hà', label: 'TP. Đông Hà' } ],
  'Thành phố Đà Nẵng': [ { value: 'Quận Hải Châu', label: 'Quận Hải Châu' }, { value: 'Quận Thanh Khê', label: 'Quận Thanh Khê' }, { value: 'Quận Sơn Trà', label: 'Quận Sơn Trà' }, { value: 'TP. Tam Kỳ', label: 'TP. Tam Kỳ (từ Quảng Nam)' }, { value: 'TP. Hội An', label: 'TP. Hội An (từ Quảng Nam)' } ],
  'Tỉnh Quảng Ngãi': [ { value: 'TP. Quảng Ngãi', label: 'TP. Quảng Ngãi' }, { value: 'TP. Kon Tum', label: 'TP. Kon Tum (từ Kon Tum)' } ],
  'Tỉnh Gia Lai': [ { value: 'TP. Pleiku', label: 'TP. Pleiku' }, { value: 'TP. Quy Nhơn', label: 'TP. Quy Nhơn (từ Bình Định)' } ],
  'Tỉnh Khánh Hòa': [ { value: 'TP. Nha Trang', label: 'TP. Nha Trang' }, { value: 'TP. Cam Ranh', label: 'TP. Cam Ranh' }, { value: 'TP. Phan Rang - Tháp Chàm', label: 'TP. Phan Rang - Tháp Chàm (từ Ninh Thuận)' } ],
  'Tỉnh Lâm Đồng': [ { value: 'TP. Đà Lạt', label: 'TP. Đà Lạt' }, { value: 'TP. Bảo Lộc', label: 'TP. Bảo Lộc' }, { value: 'TP. Gia Nghĩa', label: 'TP. Gia Nghĩa (từ Đắk Nông)' }, { value: 'TP. Phan Thiết', label: 'TP. Phan Thiết (từ Bình Thuận)' } ],
  'Tỉnh Đắk Lắk': [ { value: 'TP. Buôn Ma Thuột', label: 'TP. Buôn Ma Thuột' }, { value: 'TP. Tuy Hòa', label: 'TP. Tuy Hòa (từ Phú Yên)' } ],
  'Thành phố Hồ Chí Minh': [
    // 16 Quận nội thành
    { value: 'Quận 1', label: 'Quận 1' }, { value: 'Quận 3', label: 'Quận 3' }, { value: 'Quận 4', label: 'Quận 4' },
    { value: 'Quận 5', label: 'Quận 5' }, { value: 'Quận 6', label: 'Quận 6' }, { value: 'Quận 7', label: 'Quận 7' },
    { value: 'Quận 8', label: 'Quận 8' }, { value: 'Quận 10', label: 'Quận 10' }, { value: 'Quận 11', label: 'Quận 11' },
    { value: 'Quận 12', label: 'Quận 12' }, { value: 'Quận Phú Nhuận', label: 'Quận Phú Nhuận' }, { value: 'Quận Bình Thạnh', label: 'Quận Bình Thạnh' },
    { value: 'Quận Gò Vấp', label: 'Quận Gò Vấp' }, { value: 'Quận Tân Bình', label: 'Quận Tân Bình' }, { value: 'Quận Bình Tân', label: 'Quận Bình Tân' },
    { value: 'Quận Tân Phú', label: 'Quận Tân Phú' },
    // Các thành phố thành viên
    { value: 'TP. Thủ Đức', label: 'TP. Thủ Đức' }, { value: 'TP. Thủ Dầu Một', label: 'TP. Thủ Dầu Một (từ Bình Dương)' },
    { value: 'TP. Thuận An', label: 'TP. Thuận An (từ Bình Dương)' }, { value: 'TP. Dĩ An', label: 'TP. Dĩ An (từ Bình Dương)' },
    { value: 'TP. Tân Uyên', label: 'TP. Tân Uyên (từ Bình Dương)' }, { value: 'TP. Vũng Tàu', label: 'TP. Vũng Tàu (từ BR-VT)' },
    { value: 'TP. Bà Rịa', label: 'TP. Bà Rịa (từ BR-VT)' },
  ],
  'Tỉnh Đồng Nai': [ { value: 'TP. Biên Hòa', label: 'TP. Biên Hòa' }, { value: 'TP. Long Khánh', label: 'TP. Long Khánh' }, { value: 'TP. Đồng Xoài', label: 'TP. Đồng Xoài (từ Bình Phước)' } ],
  'Tỉnh Tây Ninh': [ { value: 'TP. Tây Ninh', label: 'TP. Tây Ninh' }, { value: 'TP. Tân An', label: 'TP. Tân An (từ Long An)' } ],
  'Thành phố Cần Thơ': [ { value: 'Quận Ninh Kiều', label: 'Quận Ninh Kiều' }, { value: 'TP. Sóc Trăng', label: 'TP. Sóc Trăng (từ Sóc Trăng)' }, { value: 'TP. Vị Thanh', label: 'TP. Vị Thanh (từ Hậu Giang)' }, { value: 'TP. Ngã Bảy', label: 'TP. Ngã Bảy (từ Hậu Giang)' } ],
  'Tỉnh Vĩnh Long': [ { value: 'TP. Vĩnh Long', label: 'TP. Vĩnh Long' }, { value: 'TP. Bến Tre', label: 'TP. Bến Tre (từ Bến Tre)' }, { value: 'TP. Trà Vinh', label: 'TP. Trà Vinh (từ Trà Vinh)' } ],
  'Tỉnh Đồng Tháp': [ { value: 'TP. Mỹ Tho', label: 'TP. Mỹ Tho (từ Tiền Giang)' }, { value: 'TP. Cao Lãnh', label: 'TP. Cao Lãnh' }, { value: 'TP. Sa Đéc', label: 'TP. Sa Đéc' }, { value: 'TP. Hồng Ngự', label: 'TP. Hồng Ngự' } ],
  'Tỉnh Cà Mau': [ { value: 'TP. Cà Mau', label: 'TP. Cà Mau' }, { value: 'TP. Bạc Liêu', label: 'TP. Bạc Liêu (từ Bạc Liêu)' } ],
  'Tỉnh An Giang': [ { value: 'TP. Long Xuyên', label: 'TP. Long Xuyên' }, { value: 'TP. Châu Đốc', label: 'TP. Châu Đốc' }, { value: 'TP. Rạch Giá', label: 'TP. Rạch Giá (từ Kiên Giang)' }, { value: 'TP. Hà Tiên', label: 'TP. Hà Tiên (từ Kiên Giang)' }, { value: 'TP. Phú Quốc', label: 'TP. Phú Quốc (từ Kiên Giang)' } ],
  default: [],
};

const DIRECTIONS = ['Nam', 'Đông Nam', 'Đông', 'Bắc', 'Tây Bắc', 'Tây Nam', 'Tây', 'Đông Bắc', 'Missing'];
const LEGAL_STATUSES = ['Sổ hồng/Sổ đỏ', 'Hợp đồng', 'Đang chờ sổ', 'Khác'];
const FURNITURE_STATES = ['Nội thất đầy đủ', 'Nội thất cơ bản', 'Không nội thất', 'Khác'];

// ===============================================================
// COMPONENT CHÍNH
// ===============================================================
const ValuationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    city: 'Thành phố Hà Nội',
    district: 'Quận Đống Đa',
    area: 80, bedrooms: 3, bathrooms: 2, floors: 4,
    frontage: 5, access_road: 6, house_direction: 'Nam',
    legal_status: 'Sổ hồng/Sổ đỏ',
    furniture_state: 'Nội thất đầy đủ',
  });
  const [valuation, setValuation] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
        const newState = { ...prev, [name]: ['area', 'bedrooms', 'bathrooms', 'floors', 'frontage', 'access_road'].includes(name) ? Number(value) || 0 : value };
        if (name === 'city') {
            newState.district = DISTRICTS_BY_CITY[value]?.[0]?.value || '';
        }
        return newState;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValuation(null);
    if (formData.area <= 0) { setError('Diện tích phải lớn hơn 0.'); return; }
    if (!formData.city || !formData.district) { setError('Vui lòng chọn đầy đủ Tỉnh/Thành và Quận/Huyện.'); return; }
    setLoading(true);
    try {
      const { city, district, ...restOfData } = formData;
      const payload = { ...restOfData, address: `${district}, ${city}` };
      const result = await getValuation(payload);
      setValuation(result.valuation);
    } catch (err: any) {
      setError(err.message || 'Không thể định giá. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (val: number) => {
    if (val === null) return '';
    const billion = val.toFixed(2);
    const fullVND = (val * 1_000_000_000).toLocaleString('vi-VN');
    return `${billion} tỷ VND (khoảng ${fullVND} VND)`;
  };

  const availableDistricts = DISTRICTS_BY_CITY[formData.city] || DISTRICTS_BY_CITY.default;
  const inputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const selectClass = "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md";

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">Công Cụ Định Giá Bất Động Sản (AI)</h1>
        <p className="mt-4 text-lg text-gray-500">Cung cấp thông tin chi tiết để AI ước tính giá chính xác hơn.</p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-2xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">Tỉnh / Thành phố (theo quy hoạch mới)</label>
            <select id="city" name="city" value={formData.city} onChange={handleChange} className={selectClass} required>
              {CITIES.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700">Quận / Huyện / TP trực thuộc</label>
            <select id="district" name="district" value={formData.district} onChange={handleChange} className={selectClass} required disabled={availableDistricts.length === 0}>
              {availableDistricts.length === 0 ? (
                 <option value="">Chọn tỉnh/thành trước</option>
              ) : (
                availableDistricts.map((d) => (<option key={d.value} value={d.value}>{d.label}</option>))
              )}
            </select>
          </div>
          <div><label htmlFor="area" className="block text-sm font-medium text-gray-700">Diện tích (m²)</label><input type="number" name="area" id="area" value={formData.area} onChange={handleChange} min="10" className={inputClass} required /></div>
          <div><label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Số phòng ngủ</label><input type="number" name="bedrooms" id="bedrooms" value={formData.bedrooms} onChange={handleChange} min="0" className={inputClass} /></div>
          <div><label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Số phòng tắm</label><input type="number" name="bathrooms" id="bathrooms" value={formData.bathrooms} onChange={handleChange} min="0" className={inputClass} /></div>
          <div><label htmlFor="floors" className="block text-sm font-medium text-gray-700">Số tầng</label><input type="number" name="floors" id="floors" value={formData.floors} onChange={handleChange} min="1" className={inputClass} /></div>
          <div><label htmlFor="frontage" className="block text-sm font-medium text-gray-700">Mặt tiền (m)</label><input type="number" name="frontage" id="frontage" value={formData.frontage} onChange={handleChange} step="0.1" min="0" className={inputClass} /></div>
          <div><label htmlFor="access_road" className="block text-sm font-medium text-gray-700">Đường vào (m)</label><input type="number" name="access_road" id="access_road" value={formData.access_road} onChange={handleChange} step="0.1" min="0" className={inputClass} /></div>
          <div>
            <label htmlFor="house_direction" className="block text-sm font-medium text-gray-700">Hướng nhà</label>
            <select id="house_direction" name="house_direction" value={formData.house_direction} onChange={handleChange} className={selectClass}>{DIRECTIONS.map((dir) => (<option key={dir} value={dir}>{dir}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="legal_status" className="block text-sm font-medium text-gray-700">Pháp lý</label>
            <select id="legal_status" name="legal_status" value={formData.legal_status} onChange={handleChange} className={selectClass}>{LEGAL_STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="furniture_state" className="block text-sm font-medium text-gray-700">Nội thất</label>
            <select id="furniture_state" name="furniture_state" value={formData.furniture_state} onChange={handleChange} className={selectClass}>{FURNITURE_STATES.map((f) => (<option key={f} value={f}>{f}</option>))}
            </select>
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
              {loading ? 'Đang phân tích...' : 'Nhận Định Giá'}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-6 text-center font-semibold">{error}</p>}
      </div>
      {valuation !== null && !loading && (
        <div className="mt-12 bg-green-50 border-l-4 border-green-500 p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-green-800 mb-4">Giá trị ước tính (AI)</h3>
          <div className="text-4xl font-extrabold text-green-700">{formatPrice(valuation)}</div>
          <p className="mt-4 text-sm text-green-600">Lưu ý: Ước tính này dựa trên mô hình học máy và dữ liệu thị trường. Giá trị giao dịch thực tế có thể thay đổi tùy thuộc vào các yếu tố thương lượng và đặc điểm riêng của bất động sản.</p>
        </div>
      )}
    </div>
  );
};

export default ValuationPage;