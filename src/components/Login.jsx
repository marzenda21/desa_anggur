import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Eye, EyeOff, ArrowLeft, Lock, Mail, AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function Login({ onLoginSuccess, onBackToPublic }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (err) {
      setError('Email atau sandi salah, atau akun tidak ditemukan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-purple-100/50 to-emerald-50/30 p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-leaf/10 rounded-full blur-3xl" />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 150 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/50 relative z-10 space-y-6"
      >
        {/* Back Button */}
        <button
          onClick={onBackToPublic}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali ke Beranda</span>
        </button>

        {/* Logo / Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-gradient-to-tr from-primary to-leaf rounded-2xl shadow-lg shadow-purple-500/15 mb-2">
            <Leaf className="h-7 w-7 text-white" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-slate-900 leading-tight">
            Masuk Portal Admin
          </h2>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Budidaya Anggur Desa Krejengan
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-2 text-xs text-red-600"
          >
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span className="font-semibold">{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wide">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="email"
                required
                placeholder="username@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-2xl text-sm focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wide">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3.5 bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-2xl text-sm focus:outline-none transition-all"
              />
              {/* Show/Hide password toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 p-1 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-primary to-primary-dark hover:from-primary/95 hover:to-primary-dark/95 text-white font-extrabold rounded-2xl shadow-xl shadow-purple-500/20 hover:shadow-purple-500/35 transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span>Masuk Sekarang</span>
            )}
          </button>
        </form>

        {/* Demo Helper Tip */}
        {/* <div className="p-3.5 bg-purple-50/50 rounded-2xl border border-purple-100/30 text-[10px] text-purple-700 leading-normal">
          <span className="font-bold">Info Demo Login:</span>
          <br />
          Email: <code className="bg-white px-1 rounded select-all font-mono">anggur.krejengan@gmail.com</code>
          <br />
          Sandi: <code className="bg-white px-1 rounded select-all font-mono">anggur321</code>
        </div> */}
      </motion.div>
    </div>
  );
}
