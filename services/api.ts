import type { Property } from '../types';
import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api';

const getNoCacheUrl = (url: string) => {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${new Date().getTime()}`;
};

async function handleResponse(response: Response) {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'An API error occurred');
    }
    return data.data || data;
}

export const fetchProperties = async (
  keyword: string, 
  propertyType: string, 
  priceRange: string, 
  page: number = 1,
  city?: string,
  type?: string
) => {
  // Phân tích priceRange thành minPrice và maxPrice
  let minPrice = undefined;
  let maxPrice = undefined;
  
  if (priceRange === 'under5') {
    maxPrice = 5000000000;
  } else if (priceRange === '5to10') {
    minPrice = 5000000000;
    maxPrice = 10000000000;
  } else if (priceRange === 'above10') {
    minPrice = 10000000000;
  }

  const response = await axios.get(`${BASE_URL}/listings`, {
    params: {
      keyword: keyword || undefined,
      propertyType: propertyType ? propertyType.toUpperCase() : undefined,
      minPrice,
      maxPrice,
      city: city || undefined,
      type: type || undefined,
      limit: 10,
      page,
      t: new Date().getTime() // Cache busting cho Axios
    }
  });
  return response.data;
};

export const fetchFeaturedProperties = async (): Promise<Property[]> => {
    // Thêm timestamp vào URL
    const response = await fetch(getNoCacheUrl(`${BASE_URL}/listings`));
    const data = await handleResponse(response);
    return data.listings.slice(0, 6) || [];
};


export const fetchPropertyById = async (id: string): Promise<Property | undefined> => {
    const response = await fetch(getNoCacheUrl(`${BASE_URL}/listings/${id}`));
    return handleResponse(response);
};

export const getValuation = async (details: any): Promise<number> => {
    const response = await fetch(`${BASE_URL}/properties/valuation`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(details),
    });
    const data = await handleResponse(response);
    return data.valuation;
}

export const login = async (email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
};

export const register = async (name: string, email: string, password: string, phone: string = '') => {
    const response = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone }),
    });
    return handleResponse(response);
};

export const verifyRegistrationOtp = async (email: string, otp: string) => {
    const response = await fetch(`${BASE_URL}/users/verify-registration-otp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
    });
    return handleResponse(response);
};

export const verifyOtp = async (email: string, otp: string) => {
    const response = await fetch(`${BASE_URL}/users/verify-otp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
    });
    return handleResponse(response);
};

export const requestPasswordChange = async (newPassword: string, token: string) => {
    const response = await fetch(`${BASE_URL}/users/request-password-change`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
    });
    return handleResponse(response);
};

export const verifyPasswordChangeOtp = async (otp: string, token: string) => {
    const response = await fetch(`${BASE_URL}/users/verify-password-change`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ otp }),
    });
    return handleResponse(response);
};

export const updateUserProfile = async (name: string, email: string, token: string) => {
    const response = await fetch(`${BASE_URL}/users/profile/edit`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
    });
    const data = await handleResponse(response);
    return data;
}

export const requestNameChange = async (newName: string, token: string) => {
    const response = await fetch(`${BASE_URL}/users/request-name-change`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newName }),
    });
    return handleResponse(response);
};

export const verifyNameChangeOtp = async (otp: string, token: string) => {
    const response = await fetch(`${BASE_URL}/users/verify-name-change`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ otp }),
    });
    return handleResponse(response);
};

export const requestEmailChange = async (newEmail: string, token: string) => {
    const response = await fetch(`${BASE_URL}/users/request-email-change`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newEmail }),
    });
    return handleResponse(response);
};

export const verifyEmailChangeOtp = async (otp: string, token: string) => {
    const response = await fetch(`${BASE_URL}/users/verify-email-change`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ otp }),
    });
    return handleResponse(response);
};

export const requestPhoneChange = async (newPhone: string, token: string) => {
    const response = await fetch(`${BASE_URL}/users/request-phone-change`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newPhone }),
    });
    return handleResponse(response);
};

export const verifyPhoneChangeOtp = async (otp: string, token: string) => {
    const response = await fetch(`${BASE_URL}/users/verify-phone-change`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ otp }),
    });
    return handleResponse(response);
};

export const uploadAvatar = async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${BASE_URL}/users/upload-avatar`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });
    return handleResponse(response);
};

// api cho gói đăng tin
export const fetchActivePackages = async (): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/packages`);
    return handleResponse(response);
};

export const fetchMyActivePackage = async (token: string): Promise<any | null> => {
    const response = await fetch(getNoCacheUrl(`${BASE_URL}/user-packages/my-active`), {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (response.status === 404) return null;
    return handleResponse(response);
};
// api cho thanh toán
export const createPaymentLink = async (packageId: string, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/payments/create-link`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ packageId }),
    });
    return handleResponse(response);
};

export const checkOrderStatus = async (orderCode: number, token: string): Promise<{ status: string }> => {
    const response = await fetch(getNoCacheUrl(`${BASE_URL}/payments/status/${orderCode}`), {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

// =============================================
// API quản lý bài đăng bất động sản (Listing)
// =============================================

export interface ListingFormData {
    title: string;
    description: string;
    type: 'Đông' | 'Tây' | 'Nam' | 'Bắc' | 'Đông Bắc' | 'Đông Nam' | 'Tây Bắc' | 'Tây Nam';
    propertyType: 'Sổ hồng/Sổ đỏ' | 'Hợp đồng' | 'Đang chờ sổ' | 'Khác';
    price: number;
    area: number;
    bedrooms?: number;
    bathrooms?: number;
    address: string;
    city: string;
    district?: string;
    ward?: string;
    images?: any[];
}

export interface Listing {
    _id: string;
    title: string;
    description: string;
    type: 'Đông' | 'Tây' | 'Nam' | 'Bắc' | 'Đông Bắc' | 'Đông Nam' | 'Tây Bắc' | 'Tây Nam';
    propertyType: 'Sổ hồng/Sổ đỏ' | 'Hợp đồng' | 'Đang chờ sổ' | 'Khác';
    price: number;
    area: number;
    bedrooms?: number;
    bathrooms?: number;
    location: {
        address?: string;
        city?: string;
        district?: string;
        ward?: string;
        coordinates?: [number, number];
    };
    images: any[];
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
    createdAt: string;
    updatedAt: string;
}

/** Lấy danh sách bài đăng của người dùng hiện tại */
export const fetchMyListings = async (token: string): Promise<{ listings: Listing[]; pagination: any }> => {
    const response = await fetch(getNoCacheUrl(`${BASE_URL}/listings/my-listings`), {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    return handleResponse(response);
};

/** Tạo bài đăng mới */
export const createListing = async (data: ListingFormData, token: string): Promise<Listing> => {
    const response = await fetch(`${BASE_URL}/listings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

/** Cập nhật bài đăng */
export const updateListing = async (id: string, data: FormData | Partial<ListingFormData>, token: string): Promise<Listing> => {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${BASE_URL}/listings/${id}`, {
        method: 'PUT',
        headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            'Authorization': `Bearer ${token}`,
        },
        body: isFormData ? data : JSON.stringify(data),
    });
    return handleResponse(response);
};

/** Xóa bài đăng */
export const deleteListing = async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/listings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    return handleResponse(response);
};
