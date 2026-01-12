
import React, { useState } from 'react';
import { User } from '../types';
import { storage, hashPassword } from '../storage';

interface Props {
  onLogin: (user: User) => void;
  onNavigate: (to: string) => void;
}

const LoginPage: React.FC<Props> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = storage.getUsers();
    const user = users.find(u => u.email === email && u.passwordHash === hashPassword(password));
    
    if (user) {
      onLogin(user);
    } else {
      setError('Email atau password salah');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl w-full max-w-md animate-in slide-in-from-bottom duration-500">
        <h1 className="text-3xl font-bold font-serif text-gold text-center mb-8">Selamat Datang Kembali</h1>
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center font-medium">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-gold transition outline-none"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-gold transition outline-none"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full bg-gold text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition shadow-lg">Masuk</button>
        </form>
        <p className="text-center mt-8 text-slate-500">
          Belum punya akun? <button onClick={() => onNavigate('#/register')} className="text-gold font-bold hover:underline">Daftar sekarang</button>
        </p>
        <button onClick={() => onNavigate('#/')} className="w-full mt-4 text-slate-400 text-sm hover:text-slate-600 transition">Kembali ke Beranda</button>
      </div>
    </div>
  );
};

export default LoginPage;
