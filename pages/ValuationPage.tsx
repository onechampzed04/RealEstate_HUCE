
import React, { useState } from 'react';
import Button from '../components/Button';
import { getValuation } from '../services/api';

const ValuationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    address: '',
    type: 'Apartment',
    area: 100,
    bedrooms: 2,
    bathrooms: 2,
    location: 'suburb'
  });
  const [valuation, setValuation] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'area' || name === 'bedrooms' || name === 'bathrooms' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.area <= 0) {
      setError('Diện tích phải là một số dương.');
      return;
    }
    setError('');
    setLoading(true);
    setValuation(null);
    try {
      const result = await getValuation(formData);
      setValuation(result);
    } catch (err) {
      setError('Không thể nhận được định giá. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">Công Cụ Định Giá Bất Động Sản</h1>
        <p className="mt-4 text-lg text-gray-500">Nhập thông tin chi tiết để nhận ước tính giá trị tài sản của bạn.</p>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-2xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
            <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Loại hình</label>
            <select id="type" name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
              <option>Apartment</option>
              <option>House</option>
              <option>Villa</option>
              <option>Land</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Vị trí</label>
            <select id="location" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
              <option value="suburb">Ngoại thành</option>
              <option value="center">Trung tâm</option>
            </select>
          </div>

          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700">Diện tích (m²)</label>
            <input type="number" name="area" id="area" value={formData.area} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
          </div>
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Số phòng ngủ</label>
            <input type="number" name="bedrooms" id="bedrooms" min="0" value={formData.bedrooms} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>

          <div className="md:col-span-2">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Đang định giá...' : 'Nhận Định Giá'}
            </Button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>

      {valuation !== null && (
        <div className="mt-10 bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-10 w-10 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-green-800">Giá Trị Ước Tính</h3>
              <div className="mt-2 text-2xl text-green-700 font-bold">
                <p>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(valuation)}</p>
              </div>
              <p className="mt-2 text-sm text-green-600">Lưu ý: Đây chỉ là giá trị ước tính dựa trên thông tin bạn cung cấp và dữ liệu thị trường của chúng tôi. Giá trị thực tế có thể thay đổi.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValuationPage;
