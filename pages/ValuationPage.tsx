import React, { useState } from 'react';

// ===============================================================
// API SERVICE: Giao tiếp với Backend Node.js
// ===============================================================
const API_URL = 'http://localhost:5001/api/properties/valuation'; // Đảm bảo đây là cổng backend của bạn

async function getValuation(data: any): Promise<{ valuation: number }> {
  console.log("Dữ liệu gửi đến backend:", JSON.stringify(data, null, 2));

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    // Nếu server trả về lỗi, ném lỗi đó ra để catch block xử lý
    throw new Error(result.message || `Lỗi từ server: ${response.status}`);
  }

  return result; // Backend trả về { success: true, valuation: 12.34 }
}

// ===============================================================
// DỮ LIỆU CẤU HÌNH CHO FORM (MỞ RỘNG 63 TỈNH THÀNH)
// ===============================================================
const CITIES = [
    { value: 'HN', label: 'Hà Nội' }, { value: 'HCM', label: 'TP. Hồ Chí Minh' },
    { value: 'HP', label: 'Hải Phòng' }, { value: 'ĐN', label: 'Đà Nẵng' },
    { value: 'CT', label: 'Cần Thơ' }, { value: 'An Giang', label: 'An Giang' },
    { value: 'Bà Rịa Vũng Tàu', label: 'Bà Rịa - Vũng Tàu' }, { value: 'Bắc Giang', label: 'Bắc Giang' },
    { value: 'Bắc Kạn', label: 'Bắc Kạn' }, { value: 'Bạc Liêu', label: 'Bạc Liêu' },
    { value: 'Bắc Ninh', label: 'Bắc Ninh' }, { value: 'Bến Tre', label: 'Bến Tre' },
    { value: 'Bình Định', label: 'Bình Định' }, { value: 'Bình Dương', label: 'Bình Dương' },
    { value: 'Bình Phước', label: 'Bình Phước' }, { value: 'Bình Thuận', label: 'Bình Thuận' },
    { value: 'Cà Mau', label: 'Cà Mau' }, { value: 'Cao Bằng', label: 'Cao Bằng' },
    { value: 'Đắk Lắk', label: 'Đắk Lắk' }, { value: 'Đắk Nông', label: 'Đắk Nông' },
    { value: 'Điện Biên', label: 'Điện Biên' }, { value: 'Đồng Nai', label: 'Đồng Nai' },
    { value: 'Đồng Tháp', label: 'Đồng Tháp' }, { value: 'Gia Lai', label: 'Gia Lai' },
    { value: 'Hà Giang', label: 'Hà Giang' }, { value: 'Hà Nam', label: 'Hà Nam' },
    { value: 'Hà Tĩnh', label: 'Hà Tĩnh' }, { value: 'Hải Dương', label: 'Hải Dương' },
    { value: 'Hậu Giang', label: 'Hậu Giang' }, { value: 'Hòa Bình', label: 'Hòa Bình' },
    { value: 'Hưng Yên', label: 'Hưng Yên' }, { value: 'Khánh Hòa', label: 'Khánh Hòa' },
    { value: 'Kiên Giang', label: 'Kiên Giang' }, { value: 'Kon Tum', label: 'Kon Tum' },
    { value: 'Lai Châu', label: 'Lai Châu' }, { value: 'Lâm Đồng', label: 'Lâm Đồng' },
    { value: 'Lạng Sơn', label: 'Lạng Sơn' }, { value: 'Lào Cai', label: 'Lào Cai' },
    { value: 'Long An', label: 'Long An' }, { value: 'Nam Định', label: 'Nam Định' },
    { value: 'Nghệ An', label: 'Nghệ An' }, { value: 'Ninh Bình', label: 'Ninh Bình' },
    { value: 'Ninh Thuận', label: 'Ninh Thuận' }, { value: 'Phú Thọ', label: 'Phú Thọ' },
    { value: 'Phú Yên', label: 'Phú Yên' }, { value: 'Quảng Bình', label: 'Quảng Bình' },
    { value: 'Quảng Nam', label: 'Quảng Nam' }, { value: 'Quảng Ngãi', label: 'Quảng Ngãi' },
    { value: 'Quảng Ninh', label: 'Quảng Ninh' }, { value: 'Quảng Trị', label: 'Quảng Trị' },
    { value: 'Sóc Trăng', label: 'Sóc Trăng' }, { value: 'Sơn La', label: 'Sơn La' },
    { value: 'Tây Ninh', label: 'Tây Ninh' }, { value: 'Thái Bình', label: 'Thái Bình' },
    { value: 'Thái Nguyên', label: 'Thái Nguyên' }, { value: 'Thanh Hóa', label: 'Thanh Hóa' },
    { value: 'Thừa Thiên Huế', label: 'Thừa Thiên Huế' }, { value: 'Tiền Giang', label: 'Tiền Giang' },
    { value: 'Trà Vinh', label: 'Trà Vinh' }, { value: 'Tuyên Quang', label: 'Tuyên Quang' },
    { value: 'Vĩnh Long', label: 'Vĩnh Long' }, { value: 'Vĩnh Phúc', label: 'Vĩnh Phúc' },
    { value: 'Yên Bái', label: 'Yên Bái' },
];

const DISTRICTS_BY_CITY: Record<string, { value: string; label: string }[]> = {
  'HCM': [ { value: 'Quận 1', label: 'Quận 1' }, { value: 'Quận 3', label: 'Quận 3' }, { value: 'Bình Thạnh', label: 'Bình Thạnh' }, { value: 'Thủ Đức', label: 'TP. Thủ Đức' }, /* ... */ ],
  'HN': [ { value: 'Ba Đình', label: 'Ba Đình' }, { value: 'Cầu Giấy', label: 'Cầu Giấy' }, { value: 'Đống Đa', label: 'Đống Đa' }, { value: 'Hoàn Kiếm', label: 'Hoàn Kiếm' }, /* ... */ ],
  'BD': [ { value: 'Thủ Dầu Một', label: 'TP. Thủ Dầu Một' }, { value: 'Dĩ An', label: 'TP. Dĩ An' }, { value: 'Thuận An', label: 'TP. Thuận An' }, /* ... */ ],
  'Đồng Nai': [ { value: 'Biên Hòa', label: 'TP. Biên Hòa' }, { value: 'Long Thành', label: 'Huyện Long Thành' }, { value: 'Nhơn Trạch', label: 'Huyện Nhơn Trạch' } ],
  'Khánh Hòa': [ { value: 'Nha Trang', label: 'TP. Nha Trang' }, { value: 'Cam Ranh', label: 'TP. Cam Ranh' } ],
  'Bà Rịa Vũng Tàu': [ { value: 'Vũng Tàu', label: 'TP. Vũng Tàu' }, { value: 'Bà Rịa', label: 'TP. Bà Rịa' } ],
  'Bình Thuận': [ { value: 'Phan Thiết', label: 'TP. Phan Thiết' } ],
  'Lâm Đồng': [ { value: 'Đà Lạt', label: 'TP. Đà Lạt' }, { value: 'Bảo Lộc', label: 'TP. Bảo Lộc' } ],
  // Mặc định không có quận/huyện, yêu cầu người dùng nhập
  default: [],
};

const DIRECTIONS = ['Nam', 'Đông Nam', 'Đông', 'Bắc', 'Tây Bắc', 'Tây Nam', 'Tây', 'Đông Bắc', 'Missing'];
const LEGAL_STATUSES = [
  'Sổ hồng/Sổ đỏ', 
  'Hợp đồng', 
  'Đang chờ sổ',
  'Khác'
];

const FURNITURE_STATES = [
  'Nội thất đầy đủ', 
  'Nội thất cơ bản', 
  'Không nội thất',
  'Khác'
];


// ===============================================================
// COMPONENT CHÍNH
// ===============================================================
const ValuationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    city: 'HN',
    district: 'Đống Đa',
    area: 80, bedrooms: 3, bathrooms: 2, floors: 4,
    frontage: 5, access_road: 6, house_direction: 'Nam',
    legal_status: 'Sổ hồng/Sổ đỏ', // Đảm bảo giá trị mặc định khớp
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
    if (!formData.city || !formData.district) { setError('Vui lòng chọn đầy đủ Thành phố và Quận/Huyện.'); return; }

    setLoading(true);
    try {
      const cityLabel = CITIES.find(c => c.value === formData.city)?.label;
      const districtLabel = DISTRICTS_BY_CITY[formData.city]?.find(d => d.value === formData.district)?.label;
      if (!cityLabel || !districtLabel) { throw new Error("Thông tin địa chỉ không hợp lệ."); }
      
      const { city, district, ...restOfData } = formData;
      const payload = { ...restOfData, address: `${districtLabel}, ${cityLabel}` };
      
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
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">Thành phố / Tỉnh</label>
            <select id="city" name="city" value={formData.city} onChange={handleChange} className={selectClass} required>
              {CITIES.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700">Quận / Huyện / TP</label>
            <select id="district" name="district" value={formData.district} onChange={handleChange} className={selectClass} required disabled={availableDistricts.length === 0}>
              {availableDistricts.length === 0 ? (
                 <option value="">Chọn thành phố trước</option>
              ) : (
                availableDistricts.map((d) => (<option key={d.value} value={d.value}>{d.label}</option>))
              )}
            </select>
          </div>
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700">Diện tích (m²)</label>
            <input type="number" name="area" id="area" value={formData.area} onChange={handleChange} min="10" className={inputClass} required />
          </div>
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Số phòng ngủ</label>
            <input type="number" name="bedrooms" id="bedrooms" value={formData.bedrooms} onChange={handleChange} min="0" className={inputClass} />
          </div>
          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Số phòng tắm</label>
            <input type="number" name="bathrooms" id="bathrooms" value={formData.bathrooms} onChange={handleChange} min="0" className={inputClass} />
          </div>
          <div>
            <label htmlFor="floors" className="block text-sm font-medium text-gray-700">Số tầng</label>
            <input type="number" name="floors" id="floors" value={formData.floors} onChange={handleChange} min="1" className={inputClass} />
          </div>
          <div>
            <label htmlFor="frontage" className="block text-sm font-medium text-gray-700">Mặt tiền (m)</label>
            <input type="number" name="frontage" id="frontage" value={formData.frontage} onChange={handleChange} step="0.1" min="0" className={inputClass} />
          </div>
          <div>
            <label htmlFor="access_road" className="block text-sm font-medium text-gray-700">Đường vào (m)</label>
            <input type="number" name="access_road" id="access_road" value={formData.access_road} onChange={handleChange} step="0.1" min="0" className={inputClass} />
          </div>
          <div>
            <label htmlFor="house_direction" className="block text-sm font-medium text-gray-700">Hướng nhà</label>
            <select id="house_direction" name="house_direction" value={formData.house_direction} onChange={handleChange} className={selectClass}>
              {DIRECTIONS.map((dir) => (<option key={dir} value={dir}>{dir}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="legal_status" className="block text-sm font-medium text-gray-700">Pháp lý</label>
            <select id="legal_status" name="legal_status" value={formData.legal_status} onChange={handleChange} className={selectClass}>
              {LEGAL_STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="furniture_state" className="block text-sm font-medium text-gray-700">Nội thất</label>
            <select id="furniture_state" name="furniture_state" value={formData.furniture_state} onChange={handleChange} className={selectClass}>
              {FURNITURE_STATES.map((f) => (<option key={f} value={f}>{f}</option>))}
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
          <p className="mt-4 text-sm text-green-600">
            Lưu ý: Ước tính này dựa trên mô hình học máy và dữ liệu thị trường. Giá trị giao dịch thực tế có thể thay đổi tùy thuộc vào các yếu tố thương lượng và đặc điểm riêng của bất động sản.
          </p>
        </div>
      )}
    </div>
  );
};

export default ValuationPage;