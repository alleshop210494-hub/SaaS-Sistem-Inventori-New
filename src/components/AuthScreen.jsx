import React, { useState } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        
        {/* Tombol Tab Pilihan Login / Sign Up */}
        <div className="flex justify-center mb-6 border-b pb-3 gap-4">
          <button
            onClick={() => setIsSignUp(false)}
            className={`px-6 py-2 font-semibold rounded-lg transition-all ${
              !isSignUp 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`px-6 py-2 font-semibold rounded-lg transition-all ${
              isSignUp 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Komponen Clerk dengan pengaturan appearance untuk menyembunyikan footer */}
        <div className="flex justify-center">
          {isSignUp ? (
            <SignUp 
              routing="hash" 
              appearance={{
                elements: {
                  footer: "hidden" // Menyembunyikan bagian footer/branding Clerk
                }
              }}
            />
          ) : (
            <SignIn 
              routing="hash" 
              appearance={{
                elements: {
                  footer: "hidden" // Menyembunyikan bagian footer/branding Clerk
                }
              }}
            />
          )}
        </div>

      </div>
    </div>
  );
}