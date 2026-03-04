
export interface Property {
  _id: string;
  title: string;
  description: string;
  type: 'SALE' | 'RENT';
  propertyType: 'APARTMENT' | 'HOUSE' | 'LAND' | 'VILLA';
  price: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  location: {
    address?: string;
    city?: string;
    district?: string;
    ward?: string;
  };
  images: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
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