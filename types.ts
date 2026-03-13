export interface Property {
  _id: string;
  id?: string; // Giữ để tương thích ngược
  title: string;
  description: string;
  
  // 1. Cập nhật Type thành Hướng nhà (theo Model & UI mới)
  type: 'Đông' | 'Tây' | 'Nam' | 'Bắc' | 'Đông Bắc' | 'Đông Nam' | 'Tây Bắc' | 'Tây Nam';

  // 2. Cập nhật propertyType thành Pháp lý (theo Model & UI mới)
  propertyType: 'Sổ hồng/Sổ đỏ' | 'Hợp đồng' | 'Đang chờ sổ' | 'Khác'; 

  price: number;
  area: number;
  bedrooms: number; 
  bathrooms: number;

  // --- CÁC TRƯỜNG BỔ SUNG CHO ĐỊNH GIÁ AI ---
  floors?: number;       // Số tầng
  frontage?: number;     // Mặt tiền (m)
  furnitureStatus?: 'Nội thất đầy đủ' | 'Nội thất cơ bản' | 'Không nội thất' | 'Khác'; 

  // Cấu trúc Location lồng nhau
  location: {
    address: string;
    city: string;
    district?: string;
    ward?: string;
    coordinates?: [number, number];
  };

  // Các trường phẳng (Giữ lại nếu các trang danh sách cũ vẫn dùng)
  address?: string;
  city?: string;

  // Hình ảnh
  images: string[]; 
  imageUrl?: string; 
  gallery?: string[];

  // Trạng thái bài đăng
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

  createdAt: string;
  updatedAt: string;

  // Người đăng
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