import React from 'react';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { InventoryProvider } from './features/inventory/context/InventoryContext';
import { MainDashboard } from './components/MainDashboard';
import { AuthScreen } from './components/AuthScreen';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <SignedIn>
        <InventoryProvider>
          <MainDashboard />
        </InventoryProvider>
      </SignedIn>
      <SignedOut>
        <AuthScreen />
      </SignedOut>
    </ClerkProvider>
  );
}