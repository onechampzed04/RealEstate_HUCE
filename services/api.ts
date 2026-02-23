
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

  const response = await fetch(`${BASE_URL}/properties?${params.toString()}`);
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
