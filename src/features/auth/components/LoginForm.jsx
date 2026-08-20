import React, { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { useAuth } from '../context/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { isLoaded, signIn } = useSignIn();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.errors ? err.errors[0].message : 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!isLoaded) return;
    
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Silakan masukkan alamat email Anda terlebih dahulu.');
      return;
    }

    setLoading(true);

    try {
      // 1. Inisialisasi sign-in attempt berdasarkan email pengguna
      const signInAttempt = await signIn.create({ identifier: email });

      // 2. Cari faktor verifikasi reset password yang sesuai
      const factor = signInAttempt.supportedFirstFactors?.find(
        (f) => f.strategy === 'reset_password_email_code'
      );

      if (!factor) {
        throw new Error('Metode pemulihan kata sandi tidak tersedia untuk akun ini.');
      }

      // 3. Siapkan pengiriman kode reset menggunakan emailAddressId yang ditemukan
      await signIn.prepareFirstFactor({
        strategy: 'reset_password_email_code',
        emailAddressId: factor.emailAddressId,
      });

      setMessage(`Instruksi pemulihan telah dikirim ke ${email}. Silakan periksa kotak masuk atau folder Spam Anda.`);
    } catch (err) {
      console.error(err);
      const errorMsg = err.errors ? err.errors[0].message : err.message;
      setError(errorMsg || 'Gagal mengirim email reset. Pastikan email terdaftar atau coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 rounded-md text-sm text-emerald-700">
          {message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Alamat Email
        </label>
        <div className="mt-1">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
            placeholder="nama@perusahaan.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Kata Sandi
        </label>
        <div className="mt-1">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-gray-900">
            Ingat saya
          </label>
        </div>

        <div className="text-sm">
          <button
            type="button"
            disabled={loading}
            onClick={handleForgotPassword}
            className="font-medium text-indigo-600 hover:text-indigo-500 bg-transparent border-none cursor-pointer p-0 disabled:opacity-50"
          >
            {loading ? 'Mengirim...' : 'Lupa kata sandi?'}
          </button>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </div>
    </form>
  );
}