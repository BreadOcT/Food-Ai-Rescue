
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, User as UserIcon, Lock, Smartphone, Coffee, Shield, Store } from 'lucide-react';
import { Button, Input, BackButton } from './ui';
import { ScreenName } from '../types';

const MOCK_USERS = [
  { id: 1, email: 'user@gmail.com', password: '123', name: 'Budi Santoso', role: 'USER' },
  { id: 2, email: 'admin@gmail.com', password: '123', name: 'System Admin', role: 'ADMIN' },
  { id: 3, email: 'mitra@gmail.com', password: '123', name: 'Mitra Sukses', role: 'PARTNER' }
];

interface AuthProps {
  navigate: (screen: ScreenName) => void;
  onLoginSuccess?: (role: 'USER' | 'PARTNER' | 'ADMIN') => void;
}

export const LoginScreen: React.FC<AuthProps> = ({ navigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      if (user) {
        onLoginSuccess?.(user.role as 'USER' | 'PARTNER' | 'ADMIN');
      } else {
        alert('Coba: user@gmail.com / 123');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full p-6 bg-white dark:bg-slate-900 overflow-y-auto no-scrollbar transition-colors">
      <div className="flex-1 flex flex-col justify-center items-center py-6">
        <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950/30 rounded-2xl flex items-center justify-center mb-6">
          <Coffee className="w-8 h-8 text-primary" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2 text-center">Selamat Datang Kembali</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-center text-sm">Masuk untuk melanjutkan penyelamatan makanan Anda.</p>
        
        <form className="w-full space-y-4" onSubmit={handleLogin}>
          <Input 
            label="Email" 
            type="email" 
            placeholder="user@gmail.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <Input 
            label="Password" 
            type={showPassword ? "text" : "password"} 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            rightIcon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />} 
            onRightIconClick={() => setShowPassword(!showPassword)} 
          />
          <Button type="submit" className="mt-6 w-full" variant="primary" isLoading={isLoading}>
            Masuk
          </Button>
        </form>

        <div className="w-full flex items-center gap-4 my-8">
          <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1"></div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Akses Cepat (Demo)</span>
          <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1"></div>
        </div>

        <div className="w-full space-y-3">
          <Button 
            variant="outline-primary" 
            className="w-full justify-start px-6" 
            onClick={() => onLoginSuccess?.('USER')}
          >
            <UserIcon size={18} />
            <span>Login sebagai Penerima</span>
          </Button>
          
          <Button 
            variant="outline-primary" 
            className="w-full justify-start px-6" 
            onClick={() => onLoginSuccess?.('PARTNER')}
          >
            <Store size={18} />
            <span>Login sebagai Mitra</span>
          </Button>
          
          <Button 
            variant="outline-primary" 
            className="w-full justify-start px-6" 
            onClick={() => onLoginSuccess?.('ADMIN')}
          >
            <Shield size={18} />
            <span>Login sebagai Admin</span>
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Belum punya akun?{' '}
            <button onClick={() => navigate('SIGNUP')} className="text-primary font-bold hover:underline">
              Daftar Sekarang
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export const SignupScreen: React.FC<AuthProps> = ({ navigate }) => (
  <div className="flex flex-col h-full bg-white dark:bg-slate-900 p-6 transition-colors">
    <BackButton onClick={() => navigate('LOGIN')} title="Daftar" />
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Buat Akun</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">Daftar untuk mulai menyelamatkan makanan dan lingkungan.</p>
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); navigate('VERIFICATION'); }}>
        <Input label="Nama Lengkap" placeholder="Masukkan nama Anda" />
        <Input label="Email" type="email" placeholder="nama@email.com" />
        <Input label="Sandi" type="password" placeholder="••••••••" />
        <Button type="submit" className="w-full mt-6">Daftar Sekarang</Button>
      </form>
    </div>
  </div>
);

export const ForgotPasswordScreen: React.FC<AuthProps> = ({ navigate }) => (
  <div className="p-6 bg-white dark:bg-slate-900 h-full flex flex-col transition-colors">
    <BackButton onClick={() => navigate('LOGIN')} title="Lupa Kata Sandi" />
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Reset Sandi</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Masukkan email Anda untuk menerima kode verifikasi.</p>
      <form className="w-full space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('VERIFICATION'); }}>
        <Input label="Email" type="email" placeholder="nama@email.com" />
        <Button type="submit" className="w-full">Kirim Kode</Button>
      </form>
    </div>
  </div>
);

export const VerificationScreen: React.FC<AuthProps> = ({ navigate }) => (
  <div className="p-6 bg-white dark:bg-slate-900 h-full flex flex-col transition-colors">
    <BackButton onClick={() => navigate('LOGIN')} title="Verifikasi" />
    <div className="flex-1 pt-8 text-center">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">Masukkan Kode</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">Kode OTP telah dikirim ke email Anda.</p>
      <div className="flex gap-4 justify-center mb-10">
         {[1, 2, 3, 4].map((i) => (
           <input key={i} className="w-14 h-14 text-center text-2xl font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-slate-50" maxLength={1} />
         ))}
      </div>
      <Button className="w-full" onClick={() => navigate('HOME')}>Verifikasi</Button>
      <button className="mt-6 text-sm text-slate-400">
        Belum menerima kode? <span className="text-primary font-bold">Kirim ulang</span>
      </button>
    </div>
  </div>
);

export const NewPasswordScreen: React.FC<AuthProps> = ({ navigate }) => (
  <div className="p-6 bg-white dark:bg-slate-900 h-full transition-colors">
    <BackButton onClick={() => navigate('LOGIN')} title="Sandi Baru" />
    <div className="mt-8 space-y-4">
      <Input label="Sandi Baru" type="password" />
      <Input label="Konfirmasi Sandi" type="password" />
      <Button className="w-full mt-6" onClick={() => navigate('LOGIN')}>Simpan Sandi</Button>
    </div>
  </div>
);
