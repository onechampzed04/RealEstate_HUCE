
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';
import { login as apiLogin, register as apiRegister } from '../services/api';

interface UserInfo extends User {
  token: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, pass: string) => Promise<void>;
  updateUser: (userData: User) => void;
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
        setUser({id: userInfo._id, _id: userInfo._id, name: userInfo.name, email: userInfo.email});
        setToken(userInfo.token);
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
    setToken(userInfo.token);
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    const userInfo = await apiRegister(name, email, password);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    // FIX: The user object was missing the `_id` property, which is required by the `User` type.
    setUser({id: userInfo._id, _id: userInfo._id, name: userInfo.name, email: userInfo.email});
    setToken(userInfo.token);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    setToken(null);
  };

  const updateUser = (userData: User) => {
    setUser({id: userData._id, _id: userData._id, name: userData.name, email: userData.email});
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      userInfo.name = userData.name;
      userInfo.email = userData.email;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
