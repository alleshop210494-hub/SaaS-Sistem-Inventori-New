import React from 'react';
import LoginForm from '../features/auth/components/LoginForm';

export function AuthScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 text-white font-bold text-xl">
            SI
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900">
          Sistem Inventori SaaS
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Silakan masuk ke akun Anda untuk melanjutkan
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-100 sm:rounded-2xl sm:px-10 border border-gray-100">
          <LoginForm />
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} SaaS Inventory System. All rights reserved.
      </div>
    </div>
  );
}

export default AuthScreen;