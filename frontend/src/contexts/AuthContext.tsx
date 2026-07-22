import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, UserRole } from '../types';
import { api } from '../api/client';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  loginCandidate: (email: string, pass: string) => Promise<void>;
  registerCandidate: (data: any) => Promise<void>;
  loginAdmin: (adminId: string, pass: string, code2FA?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('codeshield_auth_user');
    return saved ? JSON.parse(saved) : {
      id: 'USR001',
      name: 'Vijay Rathinam',
      email: 'vijay@shakthi.edu',
      role: 'candidate',
      college: 'Sri Shakthi Institute of Engineering and Technology',
      department: 'Computer Science & Engineering',
      phone: '+91 9876543210',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
  });

  const role = user?.role || null;
  const isAuthenticated = !!user;

  useEffect(() => {
    if (user) {
      localStorage.setItem('codeshield_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('codeshield_auth_user');
    }
  }, [user]);

  const loginCandidate = async (email: string, pass: string) => {
    const res = await api.auth.login(email, pass);
    setUser(res);
  };

  const registerCandidate = async (data: any) => {
    const res = await api.auth.register(data);
    setUser(res);
  };

  const loginAdmin = async (adminId: string, pass: string, code2FA?: string) => {
    const res = await api.auth.adminLogin(adminId, pass, code2FA);
    setUser(res);
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, loginCandidate, registerCandidate, loginAdmin, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
