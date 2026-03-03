export interface Property {
  _id: string;

  user: string | User; // nếu có populate

  title: string;
  description?: string;

  slug?: string;

  type: 'SALE' | 'RENT';

  propertyType: 'APARTMENT' | 'HOUSE' | 'LAND' | 'VILLA';

  price: number;
  area?: number;

  location?: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
    address?: string;
    city?: string;
    district?: string;
    ward?: string;
  };

  bedrooms?: number;
  bathrooms?: number;

  images: string[];

  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

  approvedAt?: string;
  expiredAt?: string;

  favoriteCount: number;
  isHot: boolean;
  views: number;

  createdAt: string;
  updatedAt: string;
}
export interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: {
    url: string | null;
    publicId: string | null;
  };
  avatarUrl?: string; // Legacy field for backward compatibility
  role?: string;
}

export interface Package {
  _id: string;
  name: string;
  type: 'FREE' | 'BASIC' | 'PRO' | 'VIP';
  description: string;
  maxPostsPerDay: number;
  maxTotalPosts: number; // k dung
  price: number;
  durationDays: number;
  allowHotPost: boolean;
  autoApprove: boolean;
  priority: number;
  isActive: boolean;
}