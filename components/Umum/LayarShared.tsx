
import React, { useState } from 'react';
import { Sun, Moon, HelpCircle, LogOut, Edit2, Lock, MapPin, Bell, MessageSquare, ChevronRight, Info, Store, User } from 'lucide-react';
import { ScreenName, FiturProps } from '../../types';
import { Section, ListItem, Header, ScreenLayout, ScrollableContent, Card, Button, Input } from '../ui';
import { ProfileAvatarUploader, PhoneInputModule } from '../ProfileComponents';
import { dbUpdateUserProfile } from '../../services/databaseService';

// --- BAGIAN PENGATURAN APLIKASI (SHARED) ---
export const LayarBantuan: React.FC<{ navigate: (s: ScreenName) => void; isDarkMode: boolean; toggleTheme: () => void }> = ({ navigate, isDarkMode, toggleTheme }) => (
  <Section title="Aplikasi" className="px-4">
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-50 dark:divide-slate-800/50 shadow-sm">
        <div className="flex items-center justify-between py-3.5 px-4">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-xl">
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <p className="font-bold text-sm text-slate-900 dark:text-slate-50">Mode Gelap</p>
           </div>
           <button onClick={toggleTheme} className={`w-11 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>
             <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform ${isDarkMode ? 'left-[22px]' : 'left-0.5'}`}></div>
           </button>
        </div>
        <ListItem icon={<Edit2 size={20} />} title="Edit Profil" onClick={() => navigate('EDIT_PROFILE')} />
        <ListItem icon={<Lock size={20} />} title="Ganti Kata Sandi" onClick={() => navigate('CHANGE_PASSWORD')} />
        <ListItem icon={<HelpCircle size={20} />} title="Bantuan & FAQ" onClick={() => navigate('HELP_FAQ')} />
    </div>
  </Section>
);

export const LayarLogout: React.FC<{ onLogout: () => void; navigate: (s: ScreenName) => void }> = ({ onLogout, navigate }) => (
  <div className="px-4 py-8">
    <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 p-4 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-bold rounded-2xl transition-all shadow-sm border border-rose-100 dark:border-rose-900/20">
      <LogOut size={20} strokeWidth={2.5} /> <span>Keluar</span>
    </button>
  </div>
);

// --- LAYAR EDIT PROFIL ---
export const LayarEditProfil: React.FC<FiturProps> = ({ goBack, globalState, setGlobalState }) => {
  const user = globalState.user || {};
  const isPartner = user.role === 'PARTNER';

  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  // Fix TypeError: Ensure phone is string before replace
  const [phone, setPhone] = useState(String(user.phone || '').replace('+62', '').replace(/^62/, '').trim());
  
  // Fields khusus Mitra
  const [ownerName, setOwnerName] = useState(user.ownerName || '');
  const [address, setAddress] = useState(user.address || '');

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simpan hanya angka
    const cleanPhone = phone.replace(/^0+/, '');

    const updatedUser = { 
      ...user, 
      name, 
      email, 
      phone: cleanPhone,
      avatar,
      // Include fields if partner
      ...(isPartner && { ownerName, address })
    };

    // 1. Optimistic UI Update
    setGlobalState('user', updatedUser);
    
    // 2. Update to Database
    await dbUpdateUserProfile(updatedUser);

    setIsLoading(false);
    goBack();
  };

  return (
    <ScreenLayout>
      <Header title="Edit Profil" onBack={goBack} />
      <ScrollableContent>
        <ProfileAvatarUploader avatar={avatar} onAvatarChange={setAvatar} />
        <div className="space-y-6">
          <Input 
             label={isPartner ? "Nama Toko / Usaha" : "Nama Lengkap"}
             value={name} 
             onChange={(e: any) => setName(e.target.value)}
             icon={isPartner ? <Store size={18} className="text-slate-400"/> : <User size={18} className="text-slate-400"/>}
          />
          
          <Input label="Email" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} disabled className="opacity-70 bg-slate-100" />
          
          <PhoneInputModule value={phone} onChange={setPhone} />

          {isPartner && (
            <>
               <Input 
                 label="Nama Pemilik" 
                 value={ownerName} 
                 onChange={(e: any) => setOwnerName(e.target.value)} 
                 placeholder="Nama pemilik usaha"
                 icon={<User size={18} className="text-slate-400"/>}
               />
               <Input 
                 label="Link Google Maps (Lokasi)" 
                 value={address} 
                 onChange={(e: any) => setAddress(e.target.value)} 
                 placeholder="https://maps.app.goo.gl/..."
                 icon={<MapPin size={18} className="text-slate-400"/>}
               />
            </>
          )}
        </div>
        <div className="pt-10">
           <Button className="w-full" onClick={handleSave} isLoading={isLoading}>Simpan Perubahan</Button>
        </div>
      </ScrollableContent>
    </ScreenLayout>
  );
};

// --- LAYAR NOTIFIKASI ---
export const LayarNotifikasi: React.FC<{ goBack: () => void; globalState?: any }> = ({ goBack, globalState }) => {
  const notifications = globalState?.notifications || [];

  return (
    <ScreenLayout>
      <Header title="Notifikasi" onBack={goBack} />
      <ScrollableContent>
        {notifications.length > 0 ? (
           <div className="space-y-3">
              {notifications.map((notif: any, i: number) => (
                 <Card key={i} className={`p-4 flex gap-3 ${notif.isRead ? 'bg-white dark:bg-slate-800' : 'bg-orange-50 dark:bg-slate-800 border-l-4 border-l-primary'}`}>
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                       <Bell size={20} />
                    </div>
                    <div>
                       <h4 className="font-bold text-sm text-slate-900 dark:text-white">{notif.title}</h4>
                       <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight mt-1">{notif.message}</p>
                       <p className="text-[10px] text-slate-400 mt-2">{notif.time || 'Baru saja'}</p>
                    </div>
                 </Card>
              ))}
           </div>
        ) : (
          <div className="text-center py-20">
            <Bell size={48} className="mx-auto text-slate-300 mb-4 opacity-50" />
            <p className="text-slate-500 font-medium">Belum ada notifikasi baru.</p>
          </div>
        )}
      </ScrollableContent>
    </ScreenLayout>
  );
};

// --- LAYAR FAQ ---
export const LayarFAQ: React.FC<{ goBack: () => void }> = ({ goBack }) => {
  const handleContactDev = () => window.open(`https://wa.me/6285215376975`, '_blank');
  return (
    <ScreenLayout>
      <Header title="Bantuan & FAQ" onBack={goBack} />
      <ScrollableContent>
        <div className="bg-gradient-to-r from-primary to-orange-400 rounded-3xl p-6 text-white shadow-lg mb-8">
           <h3 className="font-bold text-lg mb-1">Butuh Bantuan?</h3>
           <Button className="w-full bg-slate-900 text-white mt-4" onClick={handleContactDev}>
             <MessageSquare size={18} className="mr-2" /> Chat WhatsApp
           </Button>
        </div>
        <Section title="FAQ">
           <Card className="p-4 mb-3">
              <h4 className="font-bold text-sm mb-1">Apa itu Food AI Rescue?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Platform penyelamat surplus makanan halal dengan teknologi AI.</p>
           </Card>
        </Section>
      </ScrollableContent>
    </ScreenLayout>
  );
};
