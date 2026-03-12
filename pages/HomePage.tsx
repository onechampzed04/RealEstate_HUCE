import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchFeaturedProperties } from '../services/api';
import type { Property } from '../types';
import PropertyCard from '../components/PropertyCard';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import { Calculator, Zap, Search, PlusCircle, ArrowRight, Home } from 'lucide-react';

const HomePage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await fetchFeaturedProperties();
        setProperties(data);
      } catch (error) {
        console.error("Failed to fetch featured properties:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProperties();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <div className="relative bg-gray-900 h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover transform scale-105 transition-transform duration-[2000ms]"
            src="https://picsum.photos/seed/realestate1/1920/1080"
            alt="Hero background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl mb-6 leading-tight">
              Tìm Kiếm Ngôi Nhà <br />
              <span className="text-indigo-400">Mơ Ước</span> Của Bạn
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Khám phá hàng ngàn bất động sản và sử dụng công cụ định giá thông minh AI để đưa ra quyết định chính xác nhất.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Nút Xem BĐS - Màu Indigo (Chủ đạo) */}
              <Link to="/listings" className="flex-1 sm:flex-none">
                <button className="w-full px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                  <Search className="w-5 h-5" />
                  Xem Bất Động Sản
                </button>
              </Link>
              
              {/* Nút Đăng Tin - Màu Emerald (Nổi bật hành động) */}
              <Link to="/submit-property" className="flex-1 sm:flex-none">
                <button className="w-full px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                  <PlusCircle className="w-5 h-5" />
                  Đăng Tin Miễn Phí
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BOX ĐỊNH GIÁ AI (FLOATING SECTION) */}
      <div className="relative z-20 -mt-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-8 transform transition-transform duration-500 hover:scale-[1.01]">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-2xl shadow-xl shadow-indigo-200">
              <Calculator className="w-12 h-12 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold mb-3 uppercase tracking-wider">
                <Zap className="w-4 h-4 mr-1 fill-current" /> Công nghệ AI
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900 mb-2">Định giá nhà đất thông minh</h3>
              <p className="text-gray-500 text-lg max-w-lg">
                Nhận ngay giá trị ước tính của bất động sản dựa trên hàng triệu dữ liệu thực tế chỉ trong vài giây.
              </p>
            </div>
          </div>
          
          <Link to="/valuation" className="w-full lg:w-auto">
            <button className="w-full px-10 py-5 bg-gray-900 hover:bg-indigo-600 text-white font-black text-lg rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group shadow-xl">
              Thử Định Giá Ngay
              <ArrowRight className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" />
            </button>
          </Link>
        </div>
      </div>

      {/* 3. FEATURED PROPERTIES SECTION */}
      <div className="bg-gray-50 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-black text-gray-900 flex items-center justify-center md:justify-start gap-3">
                <Home className="w-10 h-10 text-indigo-600" />
                Bất Động Sản <span className="text-indigo-600">Nổi Bật</span>
              </h2>
              <p className="mt-3 text-xl text-gray-500 italic">Dành cho những người tìm kiếm sự hoàn hảo.</p>
            </div>
            <Link to="/listings" className="group text-indigo-600 font-bold text-lg flex items-center gap-2 hover:text-indigo-800 transition-colors">
              Khám phá toàn bộ 
              <div className="bg-indigo-100 p-2 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Spinner />
              <p className="text-gray-400 font-medium animate-pulse">Đang tải danh sách tốt nhất...</p>
            </div>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <div key={property._id || property.id} className="transform hover:scale-[1.02] transition-transform duration-300">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;