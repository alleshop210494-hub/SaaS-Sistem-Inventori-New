import React from 'react';
import { SignIn } from '@clerk/clerk-react';

export default function AuthScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 flex flex-col items-center">
        
        {/* Header Branding SaaS Anda */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md mb-4">
            SI
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Sistem Inventori SaaS
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Silakan masuk ke akun perusahaan Anda untuk melanjutkan
          </p>
        </div>

        {/* Komponen Resmi Clerk dengan appearance untuk menyembunyikan branding */}
        <div className="w-full flex justify-center mt-4">
          <SignIn 
            appearance={{
              elements: {
                footer: "hidden",
              }
            }}
          />
        </div>

      </div>
    </div>
  );
}