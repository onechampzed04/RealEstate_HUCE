// src/constants/locationData.ts

export const CITIES = [
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
    { value: 'Tỉnh Quảng Ninh', label: 'Tỉnh Quảng Ninh' }, 
    { value: 'Tỉnh Cao Bằng', label: 'Tỉnh Cao Bằng' },
    { value: 'Tỉnh Lạng Sơn', label: 'Tỉnh Lạng Sơn' }, 
    { value: 'Tỉnh Lai Châu', label: 'Tỉnh Lai Châu' },
    { value: 'Tỉnh Điện Biên', label: 'Tỉnh Điện Biên' }, 
    { value: 'Tỉnh Sơn La', label: 'Tỉnh Sơn La' },
    { value: 'Tỉnh Thanh Hóa', label: 'Tỉnh Thanh Hóa' }, 
    { value: 'Tỉnh Nghệ An', label: 'Tỉnh Nghệ An' },
    { value: 'Tỉnh Hà Tĩnh', label: 'Tỉnh Hà Tĩnh' },
];

export const DISTRICTS_BY_CITY: Record<string, { value: string; label: string }[]> = {
    'Thành phố Hà Nội': [
        { value: 'Quận Ba Đình', label: 'Quận Ba Đình' }, { value: 'Quận Hoàn Kiếm', label: 'Quận Hoàn Kiếm' },
        { value: 'Quận Hai Bà Trưng', label: 'Quận Hai Bà Trưng' }, { value: 'Quận Đống Đa', label: 'Quận Đống Đa' },
        { value: 'Quận Tây Hồ', label: 'Quận Tây Hồ' }, { value: 'Quận Cầu Giấy', label: 'Quận Cầu Giấy' },
        { value: 'Quận Thanh Xuân', label: 'Quận Thanh Xuân' }, { value: 'Quận Hoàng Mai', label: 'Quận Hoàng Mai' },
        { value: 'Quận Long Biên', label: 'Quận Long Biên' }, { value: 'Quận Bắc Từ Liêm', label: 'Quận Bắc Từ Liêm' },
        { value: 'Quận Hà Đông', label: 'Quận Hà Đông' }, { value: 'Quận Nam Từ Liêm', label: 'Quận Nam Từ Liêm' },
        { value: 'Thị xã Sơn Tây', label: 'Thị xã Sơn Tây' },
    ],
    'Thành phố Huế': [{ value: 'TP. Huế', label: 'TP. Huế' }],
    'Tỉnh Quảng Ninh': [
        { value: 'TP. Hạ Long', label: 'TP. Hạ Long' }, { value: 'TP. Móng Cái', label: 'TP. Móng Cái' }, 
        { value: 'TP. Cẩm Phả', label: 'TP. Cẩm Phả' }, { value: 'TP. Uông Bí', label: 'TP. Uông Bí' }, 
        { value: 'TX. Đông Triều', label: 'TX. Đông Triều' }
    ],
    'Tỉnh Cao Bằng': [{ value: 'TP. Cao Bằng', label: 'TP. Cao Bằng' }],
    'Tỉnh Lạng Sơn': [{ value: 'TP. Lạng Sơn', label: 'TP. Lạng Sơn' }],
    'Tỉnh Lai Châu': [{ value: 'TP. Lai Châu', label: 'TP. Lai Châu' }],
    'Tỉnh Điện Biên': [{ value: 'TP. Điện Biên Phủ', label: 'TP. Điện Biên Phủ' }, { value: 'TX. Mường Lay', label: 'TX. Mường Lay' }],
    'Tỉnh Sơn La': [{ value: 'TP. Sơn La', label: 'TP. Sơn La' }, { value: 'TP. Mộc Châu', label: 'TP. Mộc Châu' }],
    'Tỉnh Thanh Hóa': [{ value: 'TP. Thanh Hóa', label: 'TP. Thanh Hóa' }, { value: 'TP. Sầm Sơn', label: 'TP. Sầm Sơn' }, { value: 'TX. Bỉm Sơn', label: 'TX. Bỉm Sơn' }],
    'Tỉnh Nghệ An': [{ value: 'TP. Vinh', label: 'TP. Vinh' }, { value: 'TX. Thái Hòa', label: 'TX. Thái Hòa' }, { value: 'TX. Hoàng Mai', label: 'TX. Hoàng Mai' }],
    'Tỉnh Hà Tĩnh': [{ value: 'TP. Hà Tĩnh', label: 'TP. Hà Tĩnh' }, { value: 'TX. Hồng Lĩnh', label: 'TX. Hồng Lĩnh' }, { value: 'TX. Kỳ Anh', label: 'TX. Kỳ Anh' }],
    
    'Tỉnh Tuyên Quang': [{ value: 'TP. Tuyên Quang', label: 'TP. Tuyên Quang' }, { value: 'TP. Hà Giang', label: 'TP. Hà Giang (từ Hà Giang)' }],
    'Tỉnh Lào Cai': [{ value: 'TP. Lào Cai', label: 'TP. Lào Cai' }, { value: 'TP. Yên Bái', label: 'TP. Yên Bái (từ Yên Bái)' }],
    'Tỉnh Thái Nguyên': [
        { value: 'TP. Thái Nguyên', label: 'TP. Thái Nguyên' }, { value: 'TP. Sông Công', label: 'TP. Sông Công' }, 
        { value: 'TP. Phổ Yên', label: 'TP. Phổ Yên' }, { value: 'TP. Bắc Kạn', label: 'TP. Bắc Kạn (từ Bắc Kạn)' }
    ],
    'Tỉnh Phú Thọ': [
        { value: 'TP. Việt Trì', label: 'TP. Việt Trì' }, { value: 'TP. Vĩnh Yên', label: 'TP. Vĩnh Yên (từ Vĩnh Phúc)' }, 
        { value: 'TP. Phúc Yên', label: 'TP. Phúc Yên (từ Vĩnh Phúc)' }, { value: 'TP. Hòa Bình', label: 'TP. Hòa Bình (từ Hòa Bình)' }
    ],
    'Tỉnh Bắc Ninh': [{ value: 'TP. Bắc Ninh', label: 'TP. Bắc Ninh' }, { value: 'TP. Bắc Giang', label: 'TP. Bắc Giang (từ Bắc Giang)' }, { value: 'TP. Từ Sơn', label: 'TP. Từ Sơn' }],
    'Tỉnh Hưng Yên': [{ value: 'TP. Hưng Yên', label: 'TP. Hưng Yên' }, { value: 'TP. Thái Bình', label: 'TP. Thái Bình (từ Thái Bình)' }],
    'Thành phố Hải Phòng': [
        { value: 'TP. Thủy Nguyên', label: 'TP. Thủy Nguyên' }, { value: 'TP. Hải Dương', label: 'TP. Hải Dương (từ Hải Dương)' }, 
        { value: 'TP. Chí Linh', label: 'TP. Chí Linh (từ Hải Dương)' }
    ],
    'Tỉnh Ninh Bình': [
        { value: 'TP. Ninh Bình', label: 'TP. Ninh Bình' }, { value: 'TP. Nam Định', label: 'TP. Nam Định (từ Nam Định)' }, 
        { value: 'TP. Phủ Lý', label: 'TP. Phủ Lý (từ Hà Nam)' }, { value: 'TP. Tam Điệp', label: 'TP. Tam Điệp' }
    ],
    'Tỉnh Quảng Trị': [{ value: 'TP. Đồng Hới', label: 'TP. Đồng Hới (từ Quảng Bình)' }, { value: 'TP. Đông Hà', label: 'TP. Đông Hà' }],
    'Thành phố Đà Nẵng': [
        { value: 'Quận Hải Châu', label: 'Quận Hải Châu' }, { value: 'Quận Thanh Khê', label: 'Quận Thanh Khê' }, 
        { value: 'Quận Sơn Trà', label: 'Quận Sơn Trà' }, { value: 'TP. Tam Kỳ', label: 'TP. Tam Kỳ (từ Quảng Nam)' }, 
        { value: 'TP. Hội An', label: 'TP. Hội An (từ Quảng Nam)' }
    ],
    'Tỉnh Quảng Ngãi': [{ value: 'TP. Quảng Ngãi', label: 'TP. Quảng Ngãi' }, { value: 'TP. Kon Tum', label: 'TP. Kon Tum (từ Kon Tum)' }],
    'Tỉnh Gia Lai': [{ value: 'TP. Pleiku', label: 'TP. Pleiku' }, { value: 'TP. Quy Nhơn', label: 'TP. Quy Nhơn (từ Bình Định)' }],
    'Tỉnh Khánh Hòa': [
        { value: 'TP. Nha Trang', label: 'TP. Nha Trang' }, { value: 'TP. Cam Ranh', label: 'TP. Cam Ranh' }, 
        { value: 'TP. Phan Rang - Tháp Chàm', label: 'TP. Phan Rang - Tháp Chàm (từ Ninh Thuận)' }
    ],
    'Tỉnh Lâm Đồng': [
        { value: 'TP. Đà Lạt', label: 'TP. Đà Lạt' }, { value: 'TP. Bảo Lộc', label: 'TP. Bảo Lộc' }, 
        { value: 'TP. Gia Nghĩa', label: 'TP. Gia Nghĩa (từ Đắk Nông)' }, { value: 'TP. Phan Thiết', label: 'TP. Phan Thiết (từ Bình Thuận)' }
    ],
    'Tỉnh Đắk Lắk': [{ value: 'TP. Buôn Ma Thuột', label: 'TP. Buôn Ma Thuột' }, { value: 'TP. Tuy Hòa', label: 'TP. Tuy Hòa (từ Phú Yên)' }],
    'Thành phố Hồ Chí Minh': [
        { value: 'Quận 1', label: 'Quận 1' }, { value: 'Quận 3', label: 'Quận 3' }, { value: 'Quận 4', label: 'Quận 4' },
        { value: 'Quận 5', label: 'Quận 5' }, { value: 'Quận 6', label: 'Quận 6' }, { value: 'Quận 7', label: 'Quận 7' },
        { value: 'Quận 8', label: 'Quận 8' }, { value: 'Quận 10', label: 'Quận 10' }, { value: 'Quận 11', label: 'Quận 11' },
        { value: 'Quận 12', label: 'Quận 12' }, { value: 'Quận Phú Nhuận', label: 'Quận Phú Nhuận' }, { value: 'Quận Bình Thạnh', label: 'Quận Bình Thạnh' },
        { value: 'Quận Gò Vấp', label: 'Quận Gò Vấp' }, { value: 'Quận Tân Bình', label: 'Quận Tân Bình' }, { value: 'Quận Bình Tân', label: 'Quận Bình Tân' },
        { value: 'Quận Tân Phú', label: 'Quận Tân Phú' }, { value: 'TP. Thủ Đức', label: 'TP. Thủ Đức' }, 
        { value: 'TP. Thủ Dầu Một', label: 'TP. Thủ Dầu Một (từ Bình Dương)' }, { value: 'TP. Thuận An', label: 'TP. Thuận An (từ Bình Dương)' }, 
        { value: 'TP. Dĩ An', label: 'TP. Dĩ An (từ Bình Dương)' }, { value: 'TP. Tân Uyên', label: 'TP. Tân Uyên (từ Bình Dương)' }, 
        { value: 'TP. Vũng Tàu', label: 'TP. Vũng Tàu (từ BR-VT)' }, { value: 'TP. Bà Rịa', label: 'TP. Bà Rịa (từ BR-VT)' },
    ],
    'Tỉnh Đồng Nai': [{ value: 'TP. Biên Hòa', label: 'TP. Biên Hòa' }, { value: 'TP. Long Khánh', label: 'TP. Long Khánh' }, { value: 'TP. Đồng Xoài', label: 'TP. Đồng Xoài (từ Bình Phước)' }],
    'Tỉnh Tây Ninh': [{ value: 'TP. Tây Ninh', label: 'TP. Tây Ninh' }, { value: 'TP. Tân An', label: 'TP. Tân An (từ Long An)' }],
    'Thành phố Cần Thơ': [
        { value: 'Quận Ninh Kiều', label: 'Quận Ninh Kiều' }, { value: 'TP. Sóc Trăng', label: 'TP. Sóc Trăng (từ Sóc Trăng)' }, 
        { value: 'TP. Vị Thanh', label: 'TP. Vị Thanh (từ Hậu Giang)' }, { value: 'TP. Ngã Bảy', label: 'TP. Ngã Bảy (từ Hậu Giang)' }
    ],
    'Tỉnh Vĩnh Long': [{ value: 'TP. Vĩnh Long', label: 'TP. Vĩnh Long' }, { value: 'TP. Bến Tre', label: 'TP. Bến Tre (từ Bến Tre)' }, { value: 'TP. Trà Vinh', label: 'TP. Trà Vinh (từ Trà Vinh)' }],
    'Tỉnh Đồng Tháp': [
        { value: 'TP. Mỹ Tho', label: 'TP. Mỹ Tho (từ Tiền Giang)' }, { value: 'TP. Cao Lãnh', label: 'TP. Cao Lãnh' }, 
        { value: 'TP. Sa Đéc', label: 'TP. Sa Đéc' }, { value: 'TP. Hồng Ngự', label: 'TP. Hồng Ngự' }
    ],
    'Tỉnh Cà Mau': [{ value: 'TP. Cà Mau', label: 'TP. Cà Mau' }, { value: 'TP. Bạc Liêu', label: 'TP. Bạc Liêu (từ Bạc Liêu)' }],
    'Tỉnh An Giang': [
        { value: 'TP. Long Xuyên', label: 'TP. Long Xuyên' }, { value: 'TP. Châu Đốc', label: 'TP. Châu Đốc' }, 
        { value: 'TP. Rạch Giá', label: 'TP. Rạch Giá (từ Kiên Giang)' }, { value: 'TP. Hà Tiên', label: 'TP. Hà Tiên (từ Kiên Giang)' }, 
        { value: 'TP. Phú Quốc', label: 'TP. Phú Quốc (từ Kiên Giang)' }
    ],
    default: [],
};

// Các danh sách hằng số bổ sung
export const DIRECTIONS = ['Nam', 'Đông Nam', 'Đông', 'Bắc', 'Tây Bắc', 'Tây Nam', 'Tây', 'Đông Bắc', 'Missing'];
export const LEGAL_STATUSES = ['Sổ hồng/Sổ đỏ', 'Hợp đồng', 'Đang chờ sổ', 'Khác'];
export const FURNITURE_STATES = ['Nội thất đầy đủ', 'Nội thất cơ bản', 'Không nội thất', 'Khác'];