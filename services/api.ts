
import type { Property } from '../types';

const BASE_URL = 'http://localhost:5001/api';

async function handleResponse(response: Response) {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'An API error occurred');
    }
    return data;
}

export const fetchProperties = async (): Promise<Property[]> => {
    const response = await fetch(`${BASE_URL}/properties`);
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

export const register = async (name: string, email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
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
