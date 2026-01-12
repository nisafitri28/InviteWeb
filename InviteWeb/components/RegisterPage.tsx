
import React, { useState } from 'react';
import { User } from '../types';
import { storage, hashPassword } from '../storage';

interface Props {
  onNavigate: (to: string) => void;
}

const RegisterPage: React.FC<Props> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    const users = storage.getUsers();
    if (users.find(u => u.email === formData.email)) {
      setError('Email sudah terdaftar');
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      passwordHash: hashPassword(formData.password)
    };

    users.push(newUser);
    storage.saveUsers(users);
    alert('Registrasi berhasil! Silakan login.');
    onNavigate('#/login');
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl w-full max-w-md animate-in slide-in-from-bottom duration-500">
        <h1 className="text-3xl font-bold font-serif text-gold text-center mb-8">Buat Akun Baru</h1>
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center font-medium">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nama Lengkap</label>
            <input 
              required 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-gold transition outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email</label>
            <input 
              type="email" 
              required 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-gold transition outline-none"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Password</label>
            <input 
              type="password" 
              required 
              minLength={6}
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-gold transition outline-none"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Konfirmasi Password</label>
            <input 
              type="password" 
              required 
              value={formData.confirmPassword} 
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-gold transition outline-none"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full bg-gold text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition shadow-lg mt-4">Daftar Akun</button>
        </form>
        <p className="text-center mt-8 text-slate-500">
          Sudah punya akun? <button onClick={() => onNavigate('#/login')} className="text-gold font-bold hover:underline">Masuk di sini</button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
