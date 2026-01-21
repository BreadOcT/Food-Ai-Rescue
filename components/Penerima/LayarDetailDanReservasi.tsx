
import React, { useState } from 'react';
import { ChevronLeft, Store, Clock, MapPin, CheckCircle, Info, MessageSquare, Star, User } from 'lucide-react';
import { FiturProps } from '../../types';
import { ScreenLayout, ScrollableContent, Card, Badge, Section, Button, Input, Header } from '../ui';
import { dbCreateOrder } from '../../services/databaseService';

// --- LAYAR DETAIL MITRA ---
export const LayarDetailMitra: React.FC<FiturProps> = ({ goBack, navigate, globalState }) => {
  const item = globalState.reservationItem;
  const reviews = (globalState.reviews || []).filter((r: any) => r.partnerName === (item?.partnerName || item?.partner));
  
  // Calculate Dynamic Rating
  const ratingSum = reviews.reduce((acc: number, r: any) => acc + (Number(r.rating) || 0), 0);
  const dynamicRating = reviews.length > 0 ? (ratingSum / reviews.length).toFixed(1) : (item?.rating || "5.0");

  if (!item) return null;

  const handleContactWhatsApp = () => {
    // FIX: Convert to string first to avoid "replace is not a function" error if number
    const rawPhone = String(item.partnerPhone || "8123456789"); 
    let phone = rawPhone.replace(/\D/g, '');
    
    if (phone.startsWith('0')) {
        phone = '62' + phone.substring(1);
    } else if (!phone.startsWith('62')) {
        phone = '62' + phone;
    }
    
    const text = `Halo ${item.partnerName || item.partner}, saya ingin bertanya tentang produk ${item.name || item.foodName} di Food Rescue.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <ScreenLayout>
      <div className="relative h-72 shrink-0">
         <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
         <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
         <button 
           onClick={goBack} 
           className="absolute top-6 left-6 p-2 bg-white/90 dark:bg-slate-900/90 rounded-full shadow-lg text-slate-900 dark:text-white transition-transform active:scale-90"
         >
           <ChevronLeft size={24} />
         </button>
      </div>
      
      <ScrollableContent className="-mt-10 bg-white dark:bg-slate-900 rounded-t-[2.5rem] pt-10 relative z-10">
         <div className="mb-8 px-2">
            <div className="flex justify-between items-start mb-3">
               <Badge color="orange" className="px-3 py-1 text-[10px] tracking-widest">{item.category || 'Makanan'}</Badge>
               <div className="flex items-center gap-1 text-orange-500 font-bold">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm">{dynamicRating}</span>
                  <span className="text-xs text-slate-400 font-normal ml-1">({reviews.length})</span>
               </div>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-3">
               {item.name || item.foodName}
            </h1>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
               <div className="flex items-center gap-1.5">
                  <Store size={16} className="text-primary" />
                  <span>{item.partnerName || item.partner}</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-primary" />
                  <span>{item.distance}</span>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4 mb-8">
            <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/30 p-5 rounded-[2rem] flex flex-col items-center text-center">
               <p className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-2">Stok Tersisa</p>
               <p className="text-xl font-black text-slate-900 dark:text-white">{item.amountValue || item.quantity}</p>
            </Card>
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30 p-5 rounded-[2rem] flex flex-col items-center text-center">
               <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Jam Ambil</p>
               <p className="text-lg font-black text-slate-900 dark:text-white">{item.serviceStart || '19:00'} - {item.serviceEnd || '21:00'}</p>
            </Card>
         </div>

         <Section title="Deskripsi Produk" className="px-2">
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
               {item.description || "Makanan surplus berkualitas tinggi yang diselamatkan hari ini untuk mengurangi limbah pangan. Masih dalam kondisi sangat layak konsumsi."}
            </p>
         </Section>

         <Section title="Kontak Mitra" className="px-2">
            <Card className="p-4 border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-800/30">
               <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-primary shrink-0">
                  <Store size={24} />
               </div>
               <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{item.partnerName || item.partner}</h4>
                  <p className="text-xs text-slate-500">Responsif: ~15 menit</p>
               </div>
               <div className="flex gap-2">
                  <button 
                    onClick={handleContactWhatsApp}
                    className="p-3 bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-500/20 active:scale-95 transition-transform"
                  >
                     <MessageSquare size={18} />
                  </button>
               </div>
            </Card>
         </Section>

         <Section 
           title={`Ulasan (${reviews.length})`} 
           action={<button onClick={() => navigate('RATING_HISTORY')} className="text-xs font-bold text-primary">Lihat Semua</button>}
           className="px-2"
         >
            {reviews.length > 0 ? (
               <div className="space-y-3">
                  {reviews.slice(0, 2).map((rev: any) => (
                     <Card key={rev.id} className="p-4 border-slate-50 dark:border-slate-800/50">
                        <div className="flex justify-between items-start mb-2">
                           <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                                 {rev.avatar ? <img src={rev.avatar} className="w-full h-full object-cover" /> : <User size={14} className="text-slate-400" />}
                              </div>
                              <div>
                                 <p className="font-bold text-xs text-slate-900 dark:text-white">{rev.user}</p>
                                 <div className="flex text-orange-400">
                                    {[...Array(5)].map((_, i) => (
                                       <Star key={i} size={10} fill={i < rev.rating ? "currentColor" : "none"} />
                                    ))}
                                 </div>
                              </div>
                           </div>
                           <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed italic">"{rev.comment}"</p>
                     </Card>
                  ))}
               </div>
            ) : (
               <div className="py-6 text-center bg-slate-50 dark:bg-slate-800/20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-slate-400 font-medium">Belum ada ulasan untuk mitra ini.</p>
               </div>
            )}
         </Section>

         <div className="h-32" />
      </ScrollableContent>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-30 md:absolute md:bottom-0 md:rounded-b-[40px]">
         <Button 
           className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20" 
           onClick={() => navigate('RESERVATION_FORM')}
         >
            Ambil Sekarang
         </Button>
      </div>
    </ScreenLayout>
  );
};

// --- LAYAR FORM RESERVASI ---
export const LayarFormReservasi: React.FC<FiturProps> = ({ goBack, navigate, globalState, setGlobalState }) => {
  const item = globalState.reservationItem;
  const [qty, setQty] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    
    // Order Payload without ID and Pickup Code (Generated by Backend)
    const orderPayload = { 
      userName: globalState.user?.name || "Guest",
      partner: item.partnerName || item.partner,
      partnerId: item.partnerId || "",
      item: item.name || item.foodName, 
      itemId: item.id,
      quantity: `${qty} Porsi`, 
      status: 'Active', 
      method: 'pickup'
    };

    try {
      // 1. Send to Backend
      const result = await dbCreateOrder(orderPayload, globalState.user?.email || "guest@example.com", globalState.user?.name || "Guest");

      if (result.success) {
        // 2. Add complete object to local state with backend generated ID & Code
        const completedOrder = {
           ...orderPayload,
           id: result.orderId,
           pickupCode: result.pickupCode,
           date: new Date().toLocaleDateString('id-ID')
        };

        // 3. Update Local Inventory (Optimistic)
        const updatedInventory = (globalState.partnerInventory || []).map((invItem: any) => {
           if (invItem.id === item.id) {
              const currentVal = typeof invItem.amountValue === 'number' ? invItem.amountValue : parseInt(invItem.amountValue || "0");
              return { ...invItem, amountValue: Math.max(0, currentVal - qty) };
           }
           return invItem;
        });
        setGlobalState('partnerInventory', updatedInventory);
        setGlobalState('historyItems', [completedOrder, ...(globalState.historyItems || [])]);

        navigate('RESERVATION_SUCCESS');
      } else {
        alert("Gagal membuat pesanan: " + (result.message || "Kesalahan server"));
      }
    } catch (error) {
       console.error(error);
       alert("Terjadi kesalahan koneksi");
    } finally {
      setIsLoading(false);
    }
  };

  if (!item) return null;

  return (
    <ScreenLayout>
      <Header title="Konfirmasi Reservasi" onBack={goBack} />
      <ScrollableContent>
         <Card className="p-4 flex gap-4 mb-6 border-none bg-slate-50 dark:bg-slate-800 shadow-sm">
            <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" alt={item.name} />
            <div className="flex-1 min-w-0">
               <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{item.name || item.foodName}</h4>
               <p className="text-xs text-slate-500 mb-2">{item.partnerName || item.partner}</p>
               <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setQty(Math.max(1, qty-1))} 
                    className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center font-bold text-slate-600 dark:text-slate-200 active:bg-primary active:text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="font-black text-slate-900 dark:text-white">{qty}</span>
                  <button 
                    onClick={() => {
                        const maxStock = typeof item.amountValue === 'number' ? item.amountValue : parseInt(item.amountValue || "10");
                        setQty(Math.min(maxStock, qty+1))
                    }} 
                    className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center font-bold text-slate-600 dark:text-slate-200 active:bg-primary active:text-white transition-colors"
                  >
                    +
                  </button>
               </div>
            </div>
         </Card>

         <Section title="Detail Biaya">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] space-y-4 border border-slate-100 dark:border-slate-800 shadow-sm">
               <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Paket Makanan</span>
                  <span className="text-emerald-500 font-black uppercase tracking-wider">Gratis</span>
               </div>
               <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Biaya Penyelamatan</span>
                  <span className="font-black text-slate-900 dark:text-white">Rp 2.000</span>
               </div>
               <div className="h-px bg-slate-100 dark:bg-slate-700 my-2" />
               <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white">Total Bayar</span>
                  <span className="text-lg font-black text-primary">Rp 2.000</span>
               </div>
               
               <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                  <Info size={18} className="text-blue-500 shrink-0" />
                  <p className="text-[11px] text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                     Pembayaran biaya aplikasi dilakukan secara tunai/e-wallet langsung ke mitra saat Anda mengambil makanan di lokasi.
                  </p>
               </div>
            </div>
         </Section>
      </ScrollableContent>
      <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
         <Button 
           className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-lg" 
           isLoading={isLoading} 
           onClick={handleConfirm}
         >
            Konfirmasi Reservasi
         </Button>
      </div>
    </ScreenLayout>
  );
};

// --- LAYAR SUKSES RESERVASI ---
export const LayarSuksesReservasi: React.FC<FiturProps> = ({ navigate }) => (
  <ScreenLayout className="items-center justify-center text-center p-10">
     <div className="w-28 h-28 bg-emerald-100 dark:bg-emerald-900/30 rounded-[3rem] flex items-center justify-center mb-8 animate-bounce shadow-xl shadow-emerald-500/10">
        <CheckCircle size={56} className="text-emerald-500" />
     </div>
     <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tighter">Reservasi Berhasil!</h2>
     <p className="text-sm text-slate-500 dark:text-slate-400 mb-12 max-w-[260px] leading-relaxed">
        Paket makanan Anda telah disiapkan. Segera datang ke lokasi mitra sebelum jam layanan berakhir.
     </p>
     <div className="w-full space-y-4">
        <Button 
          className="w-full h-14 rounded-2xl font-black uppercase tracking-wider" 
          onClick={() => navigate('HISTORY')}
        >
          Lihat Kode Ambil
        </Button>
        <Button 
          variant="ghost" 
          className="w-full font-bold text-slate-400 uppercase tracking-widest text-[10px]" 
          onClick={() => navigate('HOME')}
        >
          Kembali ke Beranda
        </Button>
     </div>
  </ScreenLayout>
);
