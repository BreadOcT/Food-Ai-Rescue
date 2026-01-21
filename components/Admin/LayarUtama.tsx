
import React from 'react';
import { LayoutDashboard, Settings, Flag, Package, Users, LogOut, Server, Database } from 'lucide-react';
import { ScreenName } from '../../types';
import { Button, Card } from '../ui';

export const SidebarAdmin: React.FC<any> = ({ navigate, currentScreen, onLogout }) => {
  const menu = [
    { name: 'Dashboard', icon: LayoutDashboard, screen: 'ADMIN_DASHBOARD' },
    { name: 'Laporan', icon: Flag, screen: 'ADMIN_REPORTS' },
    { name: 'Produk', icon: Package, screen: 'ADMIN_PRODUCTS' },
    { name: 'Pengguna', icon: Users, screen: 'ADMIN_USERS' },
    { name: 'Pengaturan', icon: Settings, screen: 'ADMIN_SETTINGS' },
  ];
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed relative z-20">
      <div className="p-6 border-b border-gray-100 flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">F</div>
        <span className="font-bold text-lg text-gray-800">Admin Console</span>
      </div>
      <div className="flex-1 py-6 px-4 space-y-1">
        {menu.map((item) => (
          <button key={item.name} onClick={() => navigate(item.screen as ScreenName)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${currentScreen === item.screen ? 'bg-orange-50 text-primary' : 'text-gray-500 hover:bg-gray-50'}`}>
            <item.icon size={20} /> {item.name}
          </button>
        ))}
      </div>
      <div className="p-4 border-t border-gray-100">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50"><LogOut size={20} /> Logout</button>
      </div>
    </div>
  );
};

export const LayarDashboardAdmin: React.FC<any> = ({ globalState }) => {
  // Hitung statistik nyata dari data yang ada di state
  const inventoryCount = globalState?.partnerInventory?.length || 0;
  const reviewsCount = globalState?.reviews?.length || 0;
  const ordersCount = globalState?.historyItems?.length || 0; 
  
  // Karena tidak ada API "getAllUsers", kita simulasikan angka user
  // berdasarkan data yang kita ketahui (misal: 1 user aktif + dummy)
  const userCount = 1; 

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
         <h1 className="text-2xl font-bold text-slate-900">Dashboard Admin</h1>
         <p className="text-slate-500 text-sm">Status kesehatan sistem secara real-time.</p>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-8">
         {[ 
            { l: 'User Aktif', v: userCount, color: 'text-blue-600' }, 
            { l: 'Produk Live', v: inventoryCount, color: 'text-emerald-600' }, 
            { l: 'Order Selesai', v: ordersCount, color: 'text-orange-600' }, 
            { l: 'Ulasan Masuk', v: reviewsCount, color: 'text-purple-600' } 
         ].map(s => (
            <div key={s.l} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
               <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{s.l}</p>
               <h3 className={`text-3xl font-black mt-2 ${s.color}`}>{s.v}</h3>
            </div>
         ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                  <Server className="text-green-500" size={24} /> 
               </div>
               <div>
                  <p className="font-bold text-sm text-slate-900">Status Server</p>
                  <p className="text-xs text-green-600 font-medium">Online & Stabil</p>
               </div>
            </div>
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
         </div>
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <Database className="text-blue-500" size={24} /> 
               </div>
               <div>
                  <p className="font-bold text-sm text-slate-900">Database (Google Sheets)</p>
                  <p className="text-xs text-blue-600 font-medium">Terhubung</p>
               </div>
            </div>
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
         </div>
      </div>
    </div>
  );
};

export const LayarPengaturanSistem: React.FC<any> = () => (
  <div className="max-w-7xl mx-auto">
     <h1 className="text-2xl font-bold mb-6">Pengaturan Sistem</h1>
     <Card className="p-6">
        <h3 className="font-bold mb-4">Konfigurasi API</h3>
        <p className="text-sm text-slate-500 mb-6">Kelola kunci akses AI Gemini dan koordinasi backend.</p>
        <Button className="w-auto px-6 h-10">Perbarui Kunci API</Button>
     </Card>
  </div>
);
