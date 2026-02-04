
import React from 'react';

const SubmitPropertyPage: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Đăng tin Bất Động Sản</h1>
            <div className="mt-8 bg-white p-8 rounded-lg shadow-md">
                <div className="text-center text-gray-500 p-8 border-2 border-dashed rounded-lg">
                    <p>Form đăng tin chi tiết cho một bất động sản mới sẽ được xây dựng tại đây.</p>
                    <p>Các trường sẽ bao gồm: Tiêu đề, mô tả, giá, địa chỉ, diện tích, số phòng, hình ảnh, v.v.</p>
                </div>
            </div>
        </div>
    );
};

export default SubmitPropertyPage;
