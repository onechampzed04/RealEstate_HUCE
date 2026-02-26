
export interface Property {
  id: string;
  _id: string;
  title: string;
  price: number;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // in square meters
  description: string;
  type: 'House' | 'Apartment' | 'Villa' | 'Land';
  status: 'For Sale' | 'For Rent';
  distance?: number;
  imageUrl: string;
  gallery: string[];
  agent: {
    name: string;
    avatar: string;
  };
  features: string[];
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
