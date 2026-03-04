
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';
import { login as apiLogin, register as apiRegister } from '../services/api';

interface UserInfo extends User {
  token: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, pass: string, phone: string) => Promise<void>;
  updateUser: (userData: User) => void;
  completeRegister: (userInfo: any) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        const userInfo: UserInfo = JSON.parse(storedUserInfo);
        // FIX: The user object was missing the `_id` property, which is required by the `User` type.
        setUser({id: userInfo._id, _id: userInfo._id, name: userInfo.name, email: userInfo.email, phone: userInfo.phone});
        setToken(userInfo.token);
      }
    } catch (error) {
      console.error("Failed to parse user info from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const result = await apiLogin(email, password);
    const userInfo = {
      _id: result.user._id,
      id: result.user._id,
      name: result.user.name,
      email: result.user.email,
      phone: result.user.phone,
      token: result.accessToken,
      role: result.user.role,
    };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    setUser({id: result.user._id, _id: result.user._id, name: result.user.name, email: result.user.email, phone: result.user.phone});
    setToken(result.accessToken);
  };

  const register = async (name: string, email: string, password: string, phone: string): Promise<void> => {
    // Initiate registration (sends OTP to email). Completion happens in verify step.
    await apiRegister(name, email, password, phone);
  };

  const completeRegister = (userInfo: any) => {
    const fullUserInfo = {
      _id: userInfo.user._id,
      id: userInfo.user._id,
      name: userInfo.user.name,
      email: userInfo.user.email,
      phone: userInfo.user.phone,
      token: userInfo.accessToken,
      role: userInfo.user.role,
    };
    localStorage.setItem('userInfo', JSON.stringify(fullUserInfo));
    setUser({id: userInfo.user._id, _id: userInfo.user._id, name: userInfo.user.name, email: userInfo.user.email, phone: userInfo.user.phone});
    setToken(userInfo.accessToken);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    setToken(null);
  };

  const updateUser = (userData: User) => {
    setUser({id: userData._id, _id: userData._id, name: userData.name, email: userData.email, phone: userData.phone});
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      userInfo.name = userData.name;
      userInfo.email = userData.email;
      userInfo.phone = userData.phone;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register, completeRegister, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
