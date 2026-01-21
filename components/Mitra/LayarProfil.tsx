
import React from 'react';
import { Settings, Store, FileText, UploadCloud, Star, ShieldCheck } from 'lucide-react';
import { FiturProps } from '../../types';
import { ScreenLayout, ScrollableContent, ListItem, Section, Badge, Card } from '../ui';
import { LayarBantuan, LayarLogout } from '../Umum/LayarShared';

export const LayarProfilMitra: React.FC<FiturProps> = ({ navigate, toggleTheme, isDarkMode, globalState, onLogout }) => {
  const user = globalState.user || { name: 'Mitra', email: 'mitra@example.com', avatar: '', role: 'PARTNER' };
  
  // --- LOGIC DATA REAL ---
  // 1. Hitung Rating dari Reviews
  const reviews = globalState.reviews || [];
  const myReviews = reviews.filter((r: any) => r.partnerName === user.name);
  
  const ratingSum = myReviews.reduce((acc: number, r: any) => acc + (Number(r.rating) || 0), 0);
  const averageRating = myReviews.length > 0 ? (ratingSum / myReviews.length).toFixed(1) : "0.0";

  // 2. Hitung Penjualan dari History (Transaksi Selesai)
  const transactions = globalState.historyItems || [];
  // Karena historyItems untuk Mitra berisi semua transaksi toko mereka
  const totalSold = transactions.filter((t: any) => t.status === 'Selesai').length;

  return (
    <ScreenLayout>
      <div className="p-6 pb-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">Profil Toko</h1>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm shrink-0">
            <img src={user.avatar || 'https://ui-avatars.com/api/?name=' + user.name} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50 truncate">{user.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
            <Badge color="orange" className="mt-1">Mitra Terverifikasi</Badge>
          </div>
        </div>
      </div>
      <ScrollableContent className="p-0 px-2 pt-0 pb-28">
         <div className="px-4 mb-6">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex justify-between items-center">
               <div className="text-center flex-1 border-r border-primary/10">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Rating</p>
                  <div className="flex items-center justify-center gap-1 text-slate-900 dark:text-white font-black text-lg">
                    <Star className="text-orange-400 fill-orange-400" size={18} /> 
                    {averageRating}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">({myReviews.length} Ulasan)</p>
               </div>
               <div className="text-center flex-1">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Terjual</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white">{totalSold}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Pesanan Selesai</p>
               </div>
            </div>
         </div>
         <Section title="Manajemen Bisnis" className="px-4">
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-50 dark:divide-slate-800/50 shadow-sm">
               <ListItem icon={<Settings size={20} className="text-slate-600" />} title="Dashboard Utama" onClick={() => navigate('PARTNER_DASHBOARD')} />
               <ListItem icon={<ShieldCheck size={20} className="text-primary" />} title="AI Quality Check" onClick={() => navigate('CHECK_QUALITY')} />
               <ListItem icon={<Store size={20} className="text-primary" />} title="Kelola Inventory" onClick={() => navigate('PARTNER_INVENTORY')} />
               <ListItem icon={<FileText size={20} className="text-blue-500" />} title="Transaksi" onClick={() => navigate('TRANSACTIONS')} />
               <ListItem icon={<UploadCloud size={20} className="text-green-500" />} title="Upload Produk Baru" onClick={() => navigate('UPLOAD_PRODUCT')} />
            </div>
         </Section>
         <LayarBantuan navigate={navigate} isDarkMode={!!isDarkMode} toggleTheme={toggleTheme!} />
         <LayarLogout onLogout={onLogout!} navigate={navigate} />
      </ScrollableContent>
    </ScreenLayout>
  );
};
