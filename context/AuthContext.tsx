
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';
import { login as apiLogin, register as apiRegister } from '../services/api';

interface UserInfo extends User {
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, pass: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        const userInfo: UserInfo = JSON.parse(storedUserInfo);
        // FIX: The user object was missing the `_id` property, which is required by the `User` type.
        setUser({id: userInfo._id, _id: userInfo._id, name: userInfo.name, email: userInfo.email});
      }
    } catch (error) {
      console.error("Failed to parse user info from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const userInfo = await apiLogin(email, password);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    // FIX: The user object was missing the `_id` property, which is required by the `User` type.
    setUser({id: userInfo._id, _id: userInfo._id, name: userInfo.name, email: userInfo.email});
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    const userInfo = await apiRegister(name, email, password);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    // FIX: The user object was missing the `_id` property, which is required by the `User` type.
    setUser({id: userInfo._id, _id: userInfo._id, name: userInfo.name, email: userInfo.email});
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
