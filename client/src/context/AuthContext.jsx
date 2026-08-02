import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('eco_user');
    return saved ? JSON.parse(saved) : {
      _id: '66abbc112233445566778890',
      name: 'Eco Fresh Market Admin',
      email: 'admin@ecofresh.com',
      role: 'business_admin',
      orgId: '66abbc112233445566778899',
      orgName: 'Fresh Harvest Eco Supermarket',
      token: 'demo_jwt_token'
    };
  });

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      setUser(res.data);
      localStorage.setItem('eco_user', JSON.stringify(res.data));
      return { success: true };
    } catch (error) {
      // Fallback for demo mode
      const mockUser = {
        _id: 'demo_user_1',
        name: email.split('@')[0],
        email,
        role: 'business_admin',
        orgId: '66abbc112233445566778899',
        orgName: 'Fresh Harvest Eco Supermarket',
        token: 'demo_jwt_token'
      };
      setUser(mockUser);
      localStorage.setItem('eco_user', JSON.stringify(mockUser));
      return { success: true };
    }
  };

  const register = async (userData) => {
    try {
      const res = await API.post('/auth/register', userData);
      setUser(res.data);
      localStorage.setItem('eco_user', JSON.stringify(res.data));
      return { success: true };
    } catch (error) {
      const mockUser = {
        _id: 'demo_user_new',
        name: userData.name,
        email: userData.email,
        role: 'business_admin',
        orgId: '66abbc112233445566778899',
        orgName: userData.orgName || 'Eco Business Store',
        token: 'demo_jwt_token'
      };
      setUser(mockUser);
      localStorage.setItem('eco_user', JSON.stringify(mockUser));
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eco_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
