
import type { Property } from '../types';

const BASE_URL = 'http://localhost:5001/api';

async function handleResponse(response: Response) {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'An API error occurred');
    }
    return data.data || data;
}

export const fetchProperties = async (
  keyword?: string,
  type?: string,
  price?: string
): Promise<Property[]> => {

  const params = new URLSearchParams();

  if (keyword) params.append("keyword", keyword);
  if (type) params.append("type", type);
  if (price) params.append("price", price);

  const response = await fetch(`${BASE_URL}/listings?${params.toString()}`);
  return handleResponse(response);
};


export const fetchFeaturedProperties = async (): Promise<Property[]> => {
    const response = await fetch(`${BASE_URL}/properties/featured`);
    return handleResponse(response);
};

export const fetchPropertyById = async (id: string): Promise<Property | undefined> => {
    const response = await fetch(`${BASE_URL}/properties/${id}`);
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
    const response = await fetch(`${BASE_URL}/user-packages/my-active`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    // Gói cước có thể không tồn tại, nên cần xử lý lỗi 404 một cách nhẹ nhàng
    if (response.status === 404) {
        return null;
    }
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
    const response = await fetch(`${BASE_URL}/payments/status/${orderCode}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};