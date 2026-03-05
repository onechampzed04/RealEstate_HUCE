export interface Property {
  _id: string;
  id?: string; // Giữ id từ HEAD để tránh lỗi ở các component cũ
  title: string;
  description: string;
  
  // Hòa giải Type: Cho phép cả hai định dạng từ HEAD và than
  type: 'SALE' | 'RENT' | 'House' | 'Apartment' | 'Villa' | 'Land' | 'For Sale' | 'For Rent';
  propertyType?: 'APARTMENT' | 'HOUSE' | 'LAND' | 'VILLA'; 

  price: number;
  area: number;
  bedrooms: number; // Đổi về bắt buộc để Card hiển thị đẹp, hoặc giữ ? nếu muốn
  bathrooms: number;

  // Cấu trúc Location lồng nhau (Từ nhánh than)
  location: {
    address: string;
    city: string;
    district?: string;
    ward?: string;
    coordinates?: [number, number];
  };

  // Các trường phẳng (Từ HEAD) - Giữ lại để tương thích với dữ liệu cũ
  address?: string;
  city?: string;

  // Hình ảnh: than dùng images[], HEAD dùng imageUrl/gallery
  images: string[]; 
  imageUrl?: string; 
  gallery?: string[];

  // Trạng thái bài đăng
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'For Sale' | 'For Rent';

  createdAt: string;
  updatedAt: string;

  // Người đăng: than dùng user, HEAD dùng agent
  user?: User;
  agent?: {
    name: string;
    avatar: string;
  };

  features?: string[];
}

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: {
    url: string | null;
    publicId: string | null;
  } | string; // Cho phép cả object hoặc string avatar cũ
  avatarUrl?: string;
  role?: string;
}

export interface Package {
  _id: string;
  name: string;
  type: 'FREE' | 'BASIC' | 'PRO' | 'VIP';
  description: string;
  maxPostsPerDay: number;
  maxTotalPosts: number;
  price: number;
  durationDays: number;
  allowHotPost: boolean;
  autoApprove: boolean;
  priority: number;
  isActive: boolean;
}