
import React from 'react';
import { Search, SlidersHorizontal, ChevronRight, Bell, Grid, Bookmark, MessageCircle, Truck, Store, Clock, Leaf, Sparkles } from 'lucide-react';
import { Button, Badge } from './ui';

export const HomeHeader: React.FC<any> = ({ user, locationName, onProfileClick, onLocationClick, onNotificationClick }) => (
  <div className="flex justify-between items-center mb-4">
    <div className="flex items-center gap-3">
       <div onClick={onProfileClick} className="w-10 h-10 rounded-full bg-pink-100 overflow-hidden border border-slate-100 dark:border-slate-800 cursor-pointer">
         <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
       </div>
       <div onClick={onLocationClick} className="cursor-pointer">
         <p className="text-xs text-slate-500 dark:text-slate-400">Lokasi Anda,</p>
         <div className="flex items-center gap-1">
           <h3 className="font-bold text-slate-900 dark:text-white text-sm">{locationName}</h3>
           <ChevronRight size={14} className="text-primary" />
         </div>
       </div>
    </div>
    <button onClick={onNotificationClick} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative transition-colors">
      <Bell size={24} />
      <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
    </button>
  </div>
);

export const HomeSearch: React.FC<any> = ({ onSearchClick, onFilterClick }) => (
  <div className="relative mb-4">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
    <input 
      className="w-full pl-11 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:border-primary text-slate-900 dark:text-white shadow-sm cursor-text" 
      placeholder="Cari makanan di sekitar..." 
      onClick={onSearchClick} 
      readOnly 
    />
    <button onClick={onFilterClick} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
      <SlidersHorizontal size={18} />
    </button>
  </div>
);

export const CategoryTabs: React.FC<any> = ({ activeCategory, onCategoryChange, onMoreClick }) => (
  <div className="pb-2">
     <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
       <button onClick={onMoreClick} className="px-4 py-1.5 rounded-full text-xs font-medium shadow-sm whitespace-nowrap border flex items-center gap-1 transition-all bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
         <Grid size={12} /> Lainnya
       </button>
       {['Semua', 'Tersimpan', 'Roti & Kue', 'Makanan Berat', 'Sayur & Buah', 'Minuman'].map(cat => (
         <button 
           key={cat} 
           onClick={() => onCategoryChange(cat)} 
           className={`px-4 py-1.5 rounded-full text-xs font-medium shadow-sm whitespace-nowrap border transition-all ${activeCategory === cat ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
         >
           {cat === 'Tersimpan' && <Bookmark size={10} className="inline mr-1" fill="currentColor" />}
           {cat}
         </button>
       ))}
     </div>
  </div>
);

export const HomePromoBanner: React.FC<any> = ({ onMapClick, onRequestClick }) => (
  <div className="w-full bg-gradient-to-r from-primary to-orange-400 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
     <div className="relative z-10">
       <h2 className="text-lg font-bold mb-1 text-white">Forum Berbagi Makanan</h2>
       <p className="text-xs text-orange-50 mb-4 max-w-[70%]">Lihat surplus makanan yang dibagikan mitra hari ini.</p>
       <div className="flex gap-2">
          <button onClick={onMapClick} className="bg-white text-primary px-4 py-2 rounded-full text-xs font-bold hover:bg-slate-50 transition-colors">Peta Lokasi</button>
          <button onClick={onRequestClick} className="bg-orange-600 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-orange-700 transition-colors">Buat Request</button>
       </div>
     </div>
     <div className="absolute right-[-10px] bottom-[-20px] opacity-20 transform rotate-12"><MessageCircle size={100} /></div>
  </div>
);

export const FoodFeedCard: React.FC<any> = ({ item, isSaved, onSaveToggle, onClick, onActionClick }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all cursor-pointer group relative" onClick={onClick}>
    <div className="p-3 flex items-center gap-3 border-b border-slate-50 dark:border-slate-700">
       <img src={item.avatar} className="w-8 h-8 rounded-full object-cover" />
       <div className="flex-1">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.partner}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge color={item.status === 'Buka' ? 'green' : 'red'}>{item.status}</Badge>
            <span className="text-[10px] text-slate-500">• {item.distance}</span>
          </div>
       </div>
       <button onClick={(e) => { e.stopPropagation(); onSaveToggle(item.id); }} className="text-slate-400 hover:text-primary transition-colors z-20">
         <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-primary" : ""} />
       </button>
    </div>
    <div className="h-40 bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
      <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-2 right-2 z-10">
        {item.deliveryType === 'delivery' 
          ? <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"><Truck size={10} /> Dikirim</span> 
          : <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"><Store size={10} /> Ambil</span>
        }
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">{item.foodName}</h3>
      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
        <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-medium"><Clock size={14} /> {item.timeLeft}</div>
        <div className="w-px h-3 bg-slate-300 dark:bg-slate-700"></div>
        <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium"><Leaf size={14} /> Sisa {item.quantity}</div>
      </div>
      <Button className="w-full py-2.5 text-sm rounded-xl h-10" onClick={(e) => { e.stopPropagation(); onActionClick(); }}>Ambil Makanan</Button>
    </div>
  </div>
);
