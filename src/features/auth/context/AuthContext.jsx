import React, { createContext, useContext } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();

  // Menyesuaikan format user agar kompatibel dengan sistem inventori Anda
  const user = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress,
    name: clerkUser.fullName || clerkUser.primaryEmailAddress?.emailAddress?.split('@')[0],
    role: 'Administrator'
  } : null;

  const logout = () => {
    signOut();
  };

  return (
    <AuthContext.Provider value={{ user, logout, isLoaded }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      logout: () => {},
      isLoaded: true
    };
  }
  return context;
}