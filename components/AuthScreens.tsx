
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, User as UserIcon, Lock, Smartphone, Coffee, Shield, Store, Wifi, WifiOff, RefreshCw, AlertCircle, MapPin } from 'lucide-react';
import { Button, Input, BackButton, Snackbar, Badge } from './ui';
import { ScreenName } from '../types';
import { dbRegisterUser, dbLoginUser, dbCheckConnection, dbCheckEmailExists } from '../services/databaseService';
import { encryptPassword } from '../services/cryptoService';

interface AuthProps {
  navigate: (screen: ScreenName) => void;
  onLoginSuccess?: (role: 'USER' | 'PARTNER' | 'ADMIN', userData?: any) => void;
}

export const LoginScreen: React.FC<AuthProps> = ({ navigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    visible: false, message: '', type: 'error'
  });
  
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    checkDb();
  }, []);

  const checkDb = async () => {
    setDbStatus('checking');
    const isConnected = await dbCheckConnection();
    setDbStatus(isConnected ? 'connected' : 'error');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setSnackbar({ visible: true, message: "Mohon isi email dan password", type: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const encryptedPass = encryptPassword(password);
      
      const result = await dbLoginUser(cleanEmail, encryptedPass);

      if (result && result.success && result.user) {
        onLoginSuccess?.(result.user.role as 'USER' | 'PARTNER' | 'ADMIN', result.user);
      } else {
        setSnackbar({ visible: true, message: result?.message || "Email atau password salah.", type: 'error' });
      }
    } catch (error) {
      setSnackbar({ visible: true, message: "Terjadi kesalahan koneksi. Coba lagi.", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-6 bg-white dark:bg-slate-900 overflow-y-auto no-scrollbar transition-colors">
      <div className="flex-1 flex flex-col justify-center items-center py-6">
        
        <div className="absolute top-6 right-6 flex items-center gap-2">
          {dbStatus === 'checking' && <RefreshCw size={14} className="animate-spin text-slate-400" />}
          {dbStatus === 'connected' && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-100 dark:border-emerald-800">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Database OK</span>
            </div>
          )}
          {dbStatus === 'error' && (
            <button onClick={checkDb} className="flex items-center gap-1.5 px-2 py-1 bg-rose-50 dark:bg-rose-900/20 rounded-full border border-rose-100 dark:border-rose-800">
              <WifiOff size={10} className="text-rose-500" />
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">Terputus</span>
            </button>
          )}
        </div>

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

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Belum punya akun?{' '}
            <button onClick={() => navigate('SIGNUP')} className="text-primary font-bold hover:underline">
              Daftar Sekarang
            </button>
          </p>
        </div>
      </div>
      <Snackbar 
        isVisible={snackbar.visible} 
        message={snackbar.message} 
        type={snackbar.type} 
        onClose={() => setSnackbar(prev => ({ ...prev, visible: false }))} 
      />
    </div>
  );
};

export const SignupScreen: React.FC<AuthProps> = ({ navigate }) => {
  const [isPartnerSignup, setIsPartnerSignup] = useState(false);

  // States
  const [name, setName] = useState(''); // Untuk USER: Nama Lengkap. Untuk MITRA: Nama Pemilik
  const [shopName, setShopName] = useState(''); // Khusus MITRA: Nama Toko
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [mapLink, setMapLink] = useState(''); // Khusus MITRA: Link Google Maps
  const [password, setPassword] = useState('');
  
  const [touched, setTouched] = useState({ name: false, shopName: false, email: false, phone: false, mapLink: false, password: false });
  const [errors, setErrors] = useState({ name: '', shopName: '', email: '', phone: '', mapLink: '', password: '' });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    visible: false, message: '', type: 'error'
  });

  // Validation Effects
  useEffect(() => {
    const timer = setTimeout(() => {
      if (touched.name) setErrors(prev => ({ ...prev, name: name.trim() ? '' : 'Wajib diisi' }));
    }, 1000);
    return () => clearTimeout(timer);
  }, [name, touched.name]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isPartnerSignup && touched.shopName) {
         setErrors(prev => ({ ...prev, shopName: shopName.trim() ? '' : 'Nama Toko wajib diisi' }));
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [shopName, touched.shopName, isPartnerSignup]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (touched.email) {
        if (!email.trim()) setErrors(prev => ({ ...prev, email: 'Wajib diisi' }));
        else if (!email.includes('@') || !email.includes('.')) setErrors(prev => ({ ...prev, email: 'Format email salah' }));
        else setErrors(prev => ({ ...prev, email: '' }));
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [email, touched.email]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (touched.phone) setErrors(prev => ({ ...prev, phone: phone.trim() ? '' : 'Wajib diisi' }));
    }, 1000);
    return () => clearTimeout(timer);
  }, [phone, touched.phone]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isPartnerSignup && touched.mapLink) {
        if (!mapLink.trim()) {
           setErrors(prev => ({ ...prev, mapLink: 'Link Maps wajib diisi' }));
        } else if (!mapLink.includes('http') && !mapLink.includes('maps')) {
           setErrors(prev => ({ ...prev, mapLink: 'Masukkan link Google Maps valid' }));
        } else {
           setErrors(prev => ({ ...prev, mapLink: '' }));
        }
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [mapLink, touched.mapLink, isPartnerSignup]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (touched.password) {
        if (password.length < 8) setErrors(prev => ({ ...prev, password: 'Min. 8 karakter' }));
        else setErrors(prev => ({ ...prev, password: '' }));
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [password, touched.password]);


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanEmail = email.trim().toLowerCase();
    
    // Check required fields
    let hasError = !name || !cleanEmail || !phone || !password;
    if (isPartnerSignup) {
      if (!shopName || !mapLink) hasError = true;
    }

    if (hasError || errors.email || errors.password) {
      setTouched({ name: true, shopName: true, email: true, phone: true, mapLink: true, password: true });
      setSnackbar({ visible: true, message: "Mohon lengkapi semua data.", type: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      const isEmailTaken = await dbCheckEmailExists(cleanEmail);
      if (isEmailTaken) {
         setSnackbar({ visible: true, message: "Email ini sudah terdaftar.", type: 'error' });
         setIsLoading(false);
         return;
      }

      const encryptedPassword = encryptPassword(password);
      const phoneString = String(phone);
      const formattedPhone = phoneString.replace(/^0+/, '');

      // MAPPING LOGIC PENTING:
      // Jika Mitra: Name = Nama Toko (shopName), OwnerName = Nama Pemilik (name), Address = Link Maps (mapLink)
      // Jika User: Name = Nama Lengkap (name), OwnerName = undefined
      const newUser = {
        name: isPartnerSignup ? shopName : name, 
        ownerName: isPartnerSignup ? name : undefined,
        email: cleanEmail,
        phone: formattedPhone, 
        password: encryptedPassword,
        role: isPartnerSignup ? 'PARTNER' : 'USER',
        address: isPartnerSignup ? mapLink : undefined,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(isPartnerSignup ? shopName : name)}&background=random`
      };

      const result = await dbRegisterUser(newUser);

      if (result.success) {
        setSnackbar({ visible: true, message: "Registrasi berhasil! Silakan login.", type: 'success' });
        setTimeout(() => navigate('LOGIN'), 1500);
      } else {
        setSnackbar({ visible: true, message: "Gagal mendaftar: " + (result.message || "Error"), type: 'error' });
      }
    } catch (error) {
      console.error("Signup error:", error);
      setSnackbar({ visible: true, message: "Terjadi kesalahan sistem.", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Force numbers only but treat as string
    const val = e.target.value.replace(/\D/g, '');
    setPhone(val);
    if (!touched.phone) setTouched(prev => ({...prev, phone: true}));
  };

  const toggleMode = () => {
    setIsPartnerSignup(!isPartnerSignup);
    // Reset errors when switching modes
    setErrors({ name: '', shopName: '', email: '', phone: '', mapLink: '', password: '' });
    setTouched({ name: false, shopName: false, email: false, phone: false, mapLink: false, password: false });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 p-6 transition-colors overflow-y-auto no-scrollbar">
      <BackButton onClick={() => navigate('LOGIN')} title="Kembali" />
      <div className="mt-4 mb-20">
        <div className="flex items-center gap-2 mb-2">
           <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
             {isPartnerSignup ? "Daftar Mitra" : "Buat Akun"}
           </h2>
           {isPartnerSignup && <Badge color="orange">Partner</Badge>}
        </div>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
          {isPartnerSignup 
            ? "Bergabunglah untuk menjual surplus makanan dan menjangkau lebih banyak pelanggan." 
            : "Daftar untuk mulai menyelamatkan makanan dan lingkungan."}
        </p>

        <form className="space-y-4" onSubmit={handleSignup}>
          
          {isPartnerSignup && (
            <Input 
              label="Nama Toko" 
              placeholder="Contoh: Roti Bakar 88" 
              icon={<Store size={18} className="text-slate-400" />}
              value={shopName}
              onChange={(e) => {
                setShopName(e.target.value);
                if (!touched.shopName) setTouched(prev => ({...prev, shopName: true}));
              }}
              error={errors.shopName}
            />
          )}

          <Input 
            label={isPartnerSignup ? "Nama Pemilik" : "Nama Lengkap"}
            placeholder={isPartnerSignup ? "Nama pemilik usaha" : "Masukkan nama Anda"}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!touched.name) setTouched(prev => ({...prev, name: true}));
            }}
            error={errors.name}
          />

          <Input 
            label="Email" 
            type="email" 
            placeholder="nama@email.com" 
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (!touched.email) setTouched(prev => ({...prev, email: true}));
            }}
            error={errors.email}
          />
          
          <div className="w-full space-y-1.5">
            <label className="text-sm font-semibold text-slate-900 dark:text-white block">Nomor Telepon</label>
            {errors.phone && (
              <div className="flex items-center gap-1.5 text-red-500 animate-in slide-in-from-top-1 fade-in duration-200">
                 <AlertCircle size={12} />
                 <span className="text-xs font-bold">{errors.phone}</span>
              </div>
            )}
            <div className="flex gap-3">
              <div className="w-16 flex items-center justify-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 font-bold text-sm select-none">
                +62
              </div>
              <div className="relative flex-1">
                 <input 
                   className={`w-full bg-white dark:bg-slate-900 border ${errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-slate-900 dark:border-slate-100 focus:ring-primary/20 focus:border-primary'} text-slate-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all text-sm`}
                   type="tel" 
                   placeholder="812xxxxxxxx" 
                   value={phone}
                   onChange={handlePhoneChange}
                 />
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                   <Smartphone size={18} />
                 </div>
              </div>
            </div>
          </div>

          {isPartnerSignup && (
            <Input 
              label="Lokasi Usaha" 
              placeholder="Tempel link Google Maps di sini" 
              icon={<MapPin size={18} className="text-slate-400" />}
              value={mapLink}
              onChange={(e) => {
                setMapLink(e.target.value);
                if (!touched.mapLink) setTouched(prev => ({...prev, mapLink: true}));
              }}
              error={errors.mapLink}
            />
          )}

          <Input 
            label="Sandi" 
            type={showPassword ? "text" : "password"} 
            placeholder="Min. 8 karakter" 
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (!touched.password) setTouched(prev => ({...prev, password: true}));
            }}
            rightIcon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />} 
            onRightIconClick={() => setShowPassword(!showPassword)} 
            error={errors.password}
          />
          
          <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
            {isPartnerSignup ? "Daftar sebagai Mitra" : "Daftar Sekarang"}
          </Button>

          <div className="text-center pt-2">
             <p className="text-xs text-slate-400 dark:text-slate-500">
               {isPartnerSignup ? "Daftar sebagai pengguna biasa? " : "Ingin menjadi mitra? "}
               <button 
                 type="button"
                 onClick={toggleMode}
                 className="text-primary font-bold hover:underline transition-colors"
               >
                 {isPartnerSignup ? "Klik di sini" : "Klik link ini"}
               </button>
             </p>
          </div>
        </form>
      </div>
      <Snackbar 
        isVisible={snackbar.visible} 
        message={snackbar.message} 
        type={snackbar.type} 
        onClose={() => setSnackbar(prev => ({ ...prev, visible: false }))} 
      />
    </div>
  );
};
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
