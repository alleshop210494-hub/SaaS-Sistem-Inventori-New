import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('saas_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error('Email dan kata sandi wajib diisi.');
    }
    
    // Simulasi proses login SaaS
    const fakeUser = {
      email,
      name: email.split('@')[0],
      role: 'Administrator'
    };
    
    setUser(fakeUser);
    localStorage.setItem('saas_user', JSON.stringify(fakeUser));
    return fakeUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('saas_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  // Pengaman jika terpanggil di luar Provider agar tidak merusak aplikasi (tidak undefined)
  if (!context) {
    return {
      user: null,
      login: async () => {},
      logout: () => {}
    };
  }
  return context;
}