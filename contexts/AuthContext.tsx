'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { userService } from '@/services/userService';

interface AuthContextType {
  user: any;
  session: any;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string, phoneNumber?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const sessionData = await userService.getSession();
      setSession(sessionData);
      
      if (sessionData?.user) {
        setUser(sessionData.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await userService.signIn(email, password);
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug('AuthContext.login - signIn data:', data);
      }
      setSession(data.session);
      setUser(data.user);
    } catch (error) {
      setUser(null);
      setSession(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, fullName: string, phoneNumber?: string) => {
    setLoading(true);
    try {
      const data = await userService.signUp(email, password, fullName, phoneNumber);
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug('AuthContext.signup - signUp data:', data);
      }
      // If signUp returned a session (or we signed in programmatically), set session and user
      if (data?.session) {
        setSession(data.session);
        setUser(data.user);
      } else if (data?.user) {
        // user created but no session (email confirmation may be required)
        setUser(data.user);
      }
      return data;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await userService.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!session?.user,
    login,
    signup,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
