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
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>;
  refreshProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('codeshield_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const role = user?.role || null;
  const isAuthenticated = !!user;

  // Rehydrate profile on mount if token is present
  useEffect(() => {
    const token = localStorage.getItem('codeshield_token');
    if (token) {
      api.user
        .getProfile()
        .then((profile) => {
          setUser(profile);
        })
        .catch(() => {
          // If token expired, getProfile handled localStorage cleanup
        });
    }
  }, []);

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

  const updateProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const updated = await api.user.updateProfile(data as any);
    setUser(updated);
    return updated;
  };

  const refreshProfile = async (): Promise<UserProfile | null> => {
    try {
      const profile = await api.user.getProfile();
      setUser(profile);
      return profile;
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        loginCandidate,
        registerCandidate,
        loginAdmin,
        logout,
        updateProfile,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

