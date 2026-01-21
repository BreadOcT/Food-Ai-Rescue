
import React from 'react';
import { Search, SlidersHorizontal, ChevronRight, Bell, Grid, Bookmark, MessageCircle, Truck, Store, Clock, Leaf, Sparkles, Share2, RefreshCw } from 'lucide-react';
import { Button, Badge } from './ui';

export const HomeHeader: React.FC<any> = ({ user, locationName, onProfileClick, onLocationClick, onNotificationClick, onRefresh, isRefreshing }) => (
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
    <div className="flex gap-2">
      {onRefresh && (
        <button onClick={onRefresh} className={`p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors ${isRefreshing ? 'animate-spin text-primary' : ''}`}>
           <RefreshCw size={24} />
        </button>
      )}
      <button onClick={onNotificationClick} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative transition-colors">
        <Bell size={24} />
        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
      </button>
    </div>
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

export const FoodFeedCard: React.FC<any> = ({ item, isSaved, onSaveToggle, onClick, onActionClick, isGrid = false }) => {
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Fallback function for copying to clipboard
    const copyToClipboard = () => {
      const shareText = `Ayo selamatkan ${item.foodName} dari ${item.partner}! Masih ada ${item.quantity}. Ambil di Food Rescue.`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
          alert("Info produk berhasil disalin ke papan klip!");
        }).catch(() => {
          alert("Gagal menyalin teks.");
        });
      }
    };

    // Main share logic
    if (navigator.share) {
      try {
        // Constructing a valid absolute URL for sharing
        const shareUrl = window.location.origin + window.location.pathname;
        
        navigator.share({
          title: item.foodName,
          text: `Ayo selamatkan ${item.foodName} dari ${item.partner}! Masih ada ${item.quantity}.`,
          url: shareUrl,
        }).catch((err) => {
          console.error("Share failed:", err);
          copyToClipboard();
        });
      } catch (err) {
        console.error("Invalid URL for share:", err);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div 
      className={`bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all cursor-pointer group relative flex flex-col w-full`} 
      onClick={onClick}
    >
      {/* Gambar dengan Aspect Ratio 2:1 (4x2 horizontal look) */}
      <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-900 aspect-[2/1] w-full shrink-0`}>
        <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.foodName} />
        
        {/* Overlay Badges & Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40"></div>
        
        <div className="absolute top-2 right-2 z-20 flex flex-col gap-1.5">
          {onSaveToggle && (
             <button 
               onClick={(e) => { e.stopPropagation(); onSaveToggle(item.id); }} 
               className={`p-1.5 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-full shadow-lg transition-all active:scale-150 duration-500 ${isSaved ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
             >
               <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} className={isSaved ? 'animate-pulse' : ''} />
             </button>
          )}
          <button 
            onClick={handleShare}
            className="p-1.5 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-full shadow-lg text-slate-400 hover:text-blue-500 transition-all active:scale-150 duration-500"
          >
            <Share2 size={16} />
          </button>
        </div>

        <div className="absolute bottom-2 left-2 z-10">
          {item.deliveryType === 'delivery' 
            ? <span className="bg-blue-500 text-white text-[7px] font-black uppercase px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm"><Truck size={8} /> Delivery</span> 
            : <span className="bg-orange-500 text-white text-[7px] font-black uppercase px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm"><Store size={8} /> Pickup</span>
          }
        </div>
      </div>

      {/* Bagian Konten */}
      <div className="p-3 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
           <img src={item.avatar} className="w-3.5 h-3.5 rounded-full object-cover border border-slate-100 shrink-0" alt={item.partner} />
           <h3 className="text-[10px] font-bold text-slate-400 truncate tracking-tight">{item.partner}</h3>
        </div>
        
        <h2 className="font-bold text-slate-900 dark:text-white leading-tight line-clamp-2 text-[13px] h-[2.6em]">
          {item.foodName}
        </h2>

        <div className="flex flex-col gap-2 mt-0.5">
          <div className="flex items-center justify-between gap-1">
             <h3 className="flex items-center gap-1 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase">
                <Clock size={12} /> {item.timeLeft?.split(',')[1]?.trim() || item.timeLeft}
             </h3>
             <h3 className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">
                <Leaf size={12} /> {item.quantity}
             </h3>
          </div>
          <Button 
            className="w-full h-8 rounded-xl shadow-sm overflow-hidden" 
            onClick={(e: any) => { e.stopPropagation(); onActionClick(); }}
          >
            <h2 className="text-[11px] font-black uppercase tracking-widest">Ambil</h2>
          </Button>
        </div>
      </div>
    </div>
  );
};
