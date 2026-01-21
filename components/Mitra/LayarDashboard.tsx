
import React from 'react';
import { TrendingUp, Package, Bell, User, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { FiturProps } from '../../types';
import { ScreenLayout, ScrollableContent, Card, Button, Badge, Section } from '../ui';

export const LayarDashboardMitra: React.FC<FiturProps> = ({ navigate, globalState }) => {
  const inventory = globalState.partnerInventory || [];
  const transactions = globalState.historyItems || [];
  const myTransactions = transactions.filter((item: any) => item.partner === globalState.user?.name || item.partner === "Mitra");

  return (
    <ScreenLayout>
      <div className="p-6 flex justify-between items-center border-b border-slate-50 dark:border-slate-800 transition-colors">
         <h1 className="font-bold text-lg text-slate-900 dark:text-white">Dashboard Mitra</h1>
         <div className="flex gap-3">
            <button className="p-1 text-slate-400"><Bell size={24} /></button>
            <button className="p-1 text-slate-400" onClick={() => navigate('PROFILE')}><User size={24} /></button>
         </div>
      </div>
      <ScrollableContent>
         <div className="grid grid-cols-2 gap-4 mb-8">
            <Card className="p-4 border-none shadow-sm bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300">
               <p className="text-[10px] font-bold uppercase mb-1">Total Pesanan</p>
               <h3 className="text-2xl font-black">{myTransactions.length}</h3>
            </Card>
            <Card className="p-4 border-none shadow-sm bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-300">
               <p className="text-[10px] font-bold uppercase mb-1">Produk Aktif</p>
               <h3 className="text-2xl font-black">{inventory.length}</h3>
            </Card>
         </div>

         <Section title="Quick Actions">
            <div className="grid grid-cols-2 gap-4">
               <Card 
                 onClick={() => navigate('CHECK_QUALITY')}
                 className="p-5 bg-gradient-to-br from-primary/10 to-orange-500/5 border-primary/20 flex flex-col items-center text-center gap-2 group"
               >
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-primary group-active:scale-90 transition-transform">
                     <ShieldCheck size={28} />
                  </div>
                  <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">AI Quality Check</p>
                  <p className="text-[10px] text-slate-500 font-medium">Verifikasi sebelum listing</p>
               </Card>

               <Card 
                 onClick={() => navigate('UPLOAD_PRODUCT')}
                 className="p-5 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 flex flex-col items-center text-center gap-2 group"
               >
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-green-500 group-active:scale-90 transition-transform">
                     <Package size={28} />
                  </div>
                  <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Tambah Produk</p>
                  <p className="text-[10px] text-slate-500 font-medium">Listing makanan baru</p>
               </Card>
            </div>
         </Section>

         <div className="p-6 bg-slate-900 dark:bg-primary rounded-[2.5rem] text-white shadow-xl mb-8 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold mb-1 flex items-center gap-2">
                 <Sparkles size={18} className="text-orange-400" />
                 Optimalkan Toko Anda
              </h3>
              <p className="text-[11px] opacity-80 mb-4 leading-relaxed">Gunakan fitur Quality Check untuk mendapatkan badge "Kualitas Terverifikasi AI" pada produk Anda.</p>
              <Button className="bg-white text-slate-900 hover:bg-slate-50 shadow-none font-black text-xs px-6 py-2 h-10" onClick={() => navigate('CHECK_QUALITY')}>COBA SEKARANG</Button>
            </div>
            <ShieldCheck size={100} className="absolute -right-4 -bottom-4 opacity-10 transform -rotate-12" />
         </div>
      </ScrollableContent>
    </ScreenLayout>
  );
};

export const LayarTransaksiMitra: React.FC<FiturProps> = ({ goBack, globalState }) => {
  const transactions = (globalState.historyItems || []).filter((item: any) => 
    item.partner === globalState.user?.name || item.partner === "Mitra" || item.partner === "Bakery Pagi Sore" // Demo fallbacks
  );

  return (
    <ScreenLayout>
      <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-center"><h1 className="font-bold text-slate-900 dark:text-white">Daftar Transaksi</h1></div>
      <ScrollableContent>
         {transactions.length > 0 ? transactions.map((t: any) => (
            <Card key={t.id} className="p-4 flex gap-4 border-slate-50 dark:border-slate-800">
               <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                  <User size={16} />
               </div>
               <div className="flex-1 min-w-0 text-left">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.item}</h4>
                  <p className="text-[10px] text-slate-500 uppercase">{t.date} • {t.quantity}</p>
               </div>
               <Badge color={t.status === 'Selesai' ? 'green' : 'blue'}>{t.status}</Badge>
            </Card>
         )) : (
            <div className="text-center py-20 text-slate-300 font-bold">Belum ada transaksi</div>
         )}
      </ScrollableContent>
    </ScreenLayout>
  );
};
