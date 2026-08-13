import React, { useState } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';

export const AuthScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#FAF9F6] p-4 overflow-y-auto">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-orange-100/80 shadow-2xl max-w-md w-full flex flex-col space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-50 rounded-full blur-2xl pointer-events-none"></div>
        
        {/* Header / Logo */}
        <div className="flex items-center space-x-3.5 w-full pb-5 border-b border-orange-100 relative z-10">
          <div className="w-12 h-12 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-500/25 flex-shrink-0">
            I
          </div>
          <div className="text-left">
            <h2 className="text-xl font-black text-orange-950 tracking-tight">SELAMAT DATANG</h2>
            <p className="text-xs text-orange-600/70 font-semibold mt-0.5">Sistem Manajemen Inventori 2026</p>
          </div>
        </div>

        {/* Clerk Component Container */}
        <div className="w-full flex justify-center relative z-10">
          {isSignUp ? (
            <SignUp 
              routing="hash" 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "!shadow-none !p-0 !bg-transparent !border-none w-full",
                  header: { display: "none" },
                  footer: { display: "none" }
                }
              }}
            />
          ) : (
            <SignIn 
              routing="hash" 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "!shadow-none !p-0 !bg-transparent !border-none w-full",
                  header: { display: "none" },
                  footer: { display: "none" }
                }
              }}
            />
          )}
        </div>

        {/* Toggle Button Inside Card */}
        <div className="w-full pt-4 border-t border-orange-100 flex justify-end relative z-10">
          {isSignUp ? (
            <button 
              onClick={() => setIsSignUp(false)} 
              className="text-xs font-bold text-orange-600 hover:text-orange-800 transition-colors bg-orange-50 px-3 py-2 rounded-xl border border-orange-100"
            >
              Sudah punya akun? Masuk (Sign In)
            </button>
          ) : (
            <button 
              onClick={() => setIsSignUp(true)} 
              className="text-xs font-bold text-orange-600 hover:text-orange-800 transition-colors bg-orange-50 px-3 py-2 rounded-xl border border-orange-100"
            >
              Belum punya akun? Daftar (Sign Up)
            </button>
          )}
        </div>

      </div>
    </div>
  );
};