import React from 'react';
import { AuthProvider, useAuth } from './features/auth/context/AuthContext';
import { InventoryProvider } from './features/inventory/context/InventoryContext';
import AuthScreen from './components/AuthScreen';
import MainDashboard from './components/MainDashboard';

function AppContent() {
  const { user } = useAuth();
  const savedUser = localStorage.getItem('saas_user');
  const activeUser = user || (savedUser ? JSON.parse(savedUser) : null);

  if (!activeUser) {
    return <AuthScreen />;
  }

  return (
    <InventoryProvider>
      <MainDashboard />
    </InventoryProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}