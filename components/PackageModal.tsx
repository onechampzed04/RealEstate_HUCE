import React, { useState, useEffect } from 'react';
import { fetchActivePackages } from '../services/api';
import type { Package } from '../types';
import Button from './Button';
import Spinner from './Spinner';

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPackage: (pkg: Package) => void;
  activePackageId?: string | null;
}

const PackageCard: React.FC<{ pkg: Package; onSelect: () => void }> = ({ pkg, onSelect }) => (
  <div className="border rounded-lg p-6 flex flex-col shadow-md hover:shadow-lg transition-shadow bg-white">
    <h3 className="text-2xl font-bold text-primary mb-2">{pkg.name}</h3>
    <p className="text-gray-600 mb-4 h-16">{pkg.description}</p>
    <div className="text-4xl font-extrabold text-gray-800 mb-6">
      {pkg.price.toLocaleString('vi-VN')} VNĐ
      <span className="text-base font-normal text-gray-500">/ {pkg.durationDays} ngày</span>
    </div>
    <ul className="space-y-3 text-gray-700 mb-8 flex-grow">
      <li className="flex items-center">
        <span className="text-green-500 mr-2">✔</span>
        <span>Tối đa {pkg.maxPostsPerDay} lượt/ngày</span>
      </li>
      {pkg.autoApprove && (
        <li className="flex items-center">
          <span className="text-green-500 mr-2">✔</span>
          <span>Tự động duyệt bài</span>
        </li>
      )}
      {pkg.allowHotPost && (
        <li className="flex items-center">
          <span className="text-green-500 mr-2">✔</span>
          <span>Đăng tin HOT</span>
        </li>
      )}
    </ul>
    <Button variant="primary" className="mt-auto w-full" onClick={onSelect}>Chọn Gói</Button>
  </div>
);


const PackageModal: React.FC<PackageModalProps> = ({ isOpen, onClose, onSelectPackage, activePackageId }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filteredPackages = activePackageId 
      ? packages.filter(p => p._id !== activePackageId) 
      : packages;
  useEffect(() => {
    if (isOpen) {
      const loadPackages = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchActivePackages();
          setPackages(data);
        } catch (err: any) {
          setError(err.message || 'Không thể tải danh sách gói.');
        } finally {
          setLoading(false);
        }
      };
      loadPackages();
    }
  }, [isOpen]);

  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div 
        className="bg-gray-100 rounded-lg shadow-xl p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Chọn Gói Dịch Vụ</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
        </div>

        {loading && <div className="flex justify-center p-8"><Spinner /></div>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        
        {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPackages.length > 0 ? (
                  filteredPackages.map((pkg) => (
                      <PackageCard 
                          key={pkg._id} 
                          pkg={pkg} 
                          onSelect={() => onSelectPackage(pkg)} 
                      />
                  ))
              ) : (
                  <p className="col-span-full text-center text-gray-500 py-8">
                      Không có gói dịch vụ nào khác để hiển thị.
                  </p>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageModal;