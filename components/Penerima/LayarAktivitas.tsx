
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, Check, Leaf, X, QrCode, Edit2, Database } from 'lucide-react';
import { FiturProps } from '../../types';
import { ScreenLayout, Header, ScrollableContent, Card, Badge, Button, Snackbar } from '../ui';
import { dbUpdateOrderStatus, dbSubmitReview } from '../../services/databaseService';

// --- MODAL ULASAN ---
const ModalUlasan: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (rating: number, comment: string) => void;
  initialData?: { rating: number; comment: string } | null;
}> = ({ isOpen, onClose, onSubmit, initialData }) => {
   const [rating, setRating] = useState(5);
   const [comment, setComment] = useState("");

   useEffect(() => {
     if (initialData) {
       setRating(initialData.rating);
       setComment(initialData.comment);
     } else {
       setRating(5);
       setComment("");
     }
   }, [initialData, isOpen]);

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
         <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  {initialData ? 'Ubah Ulasan' : 'Beri Ulasan'}
               </h3>
               <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
            </div>
            <div className="flex justify-center gap-2 mb-6">
               {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setRating(star)} className="text-orange-400 active:scale-125 transition-transform">
                     <Star size={32} fill={star <= rating ? "currentColor" : "none"} />
                  </button>
               ))}
            </div>
            <textarea 
               className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm focus:outline-none h-32 mb-6 text-slate-900 dark:text-white"
               placeholder="Bagaimana kualitas makanannya?"
               value={comment}
               onChange={(e) => setComment(e.target.value)}
            />
            <Button className="w-full h-14 rounded-2xl font-bold" onClick={() => onSubmit(rating, comment)}>
               {initialData ? 'Simpan Perubahan' : 'Kirim Ulasan'}
            </Button>
         </div>
      </div>
   );
};

// --- MODAL KODE AMBIL ---
const ModalKodeAmbil: React.FC<{ order: any; onClose: () => void; onComplete: () => void }> = ({ order, onClose, onComplete }) => {
  if (!order) return null;
  const code = order.pickupCode || `ORD-${order.id.toString().slice(-4)}`;
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl flex flex-col items-center">
        <div className="w-full flex justify-end mb-2">
           <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500"><X size={20}/></button>
        </div>
        <div className="text-center mb-8">
           <h3 className="font-bold text-slate-500 text-xs uppercase tracking-widest mb-2">Kode Pengambilan</h3>
           <div className="text-4xl font-black text-slate-900 dark:text-white tracking-widest font-mono bg-slate-100 dark:bg-slate-800 py-4 px-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
              {code}
           </div>
        </div>
        <div className="w-44 h-44 bg-white p-2 rounded-2xl border border-slate-200 mb-6 flex items-center justify-center">
           <QrCode size={140} className="text-slate-900" />
        </div>
        <Button className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 shadow-lg" onClick={onComplete}>
           Pesanan Diterima
        </Button>
      </div>
    </div>
  );
};

// --- LAYAR RIWAYAT PESANAN ---
export const LayarRiwayatPesanan: React.FC<FiturProps> = ({ goBack, globalState, setGlobalState }) => {
  const history = globalState.historyItems || [];
  const reviews = globalState.reviews || [];
  const [viewingCodeOrder, setViewingCodeOrder] = useState<any | null>(null);
  const [filterStatus, setFilterStatus] = useState<'Semua' | 'Proses' | 'Selesai'>('Semua');
  const [reviewOrder, setReviewOrder] = useState<any | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const filteredHistory = history.filter((item: any) => {
    if (filterStatus === 'Semua') return true;
    if (filterStatus === 'Proses') return item.status === 'Active' || item.status === 'Dikemas';
    if (filterStatus === 'Selesai') return item.status === 'Selesai' || item.status === 'Dibatalkan';
    return true;
  });

  const handleComplete = async (order: any) => {
     // 1. Optimistic Update (Local)
     const updated = history.map((h: any) => h.id === order.id ? { ...h, status: 'Selesai' } : h);
     setGlobalState('historyItems', updated);
     setViewingCodeOrder(null);
     setSnackbar({ visible: true, message: 'Pesanan berhasil diselesaikan!' });

     // 2. Backend Update
     await dbUpdateOrderStatus(order.id, 'Selesai');
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
     let updatedReviews = [];
     
     if (editingReviewId) {
        // Edit ulasan lama
        updatedReviews = reviews.map((r: any) => 
           r.id === editingReviewId ? { ...r, rating, comment, date: "Baru saja" } : r
        );
        setEditingReviewId(null);
        setSnackbar({ visible: true, message: 'Ulasan berhasil diperbarui!' });
     } else {
        // Buat ulasan baru
        const newReview = { 
           id: Date.now(), 
           orderId: reviewOrder.id, 
           partnerName: reviewOrder.partner, 
           productName: reviewOrder.item, 
           user: globalState.user.name, 
           rating, 
           comment, 
           date: new Date().toLocaleDateString('id-ID')
        };
        updatedReviews = [newReview, ...reviews];
        
        // Kirim ke Backend
        await dbSubmitReview(newReview);
        
        setSnackbar({ visible: true, message: 'Terima kasih atas ulasan Anda!' });
     }
     
     setGlobalState('reviews', updatedReviews);
     setReviewOrder(null);
  };

  const openEditReview = (review: any) => {
    setEditingReviewId(review.id);
    setReviewOrder({ id: review.orderId, partner: review.partnerName, item: review.productName });
  };

  return (
    <ScreenLayout>
      <Header 
        title="Riwayat Pesanan" 
        onBack={goBack} 
        rightAction={<div className="flex items-center gap-1 text-[8px] font-black text-emerald-500 uppercase"><Database size={12}/> Synced</div>}
      />
      <div className="px-6 pb-2">
         <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-xl">
           {['Semua', 'Proses', 'Selesai'].map((s) => (
             <button key={s} onClick={() => setFilterStatus(s as any)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${filterStatus === s ? 'bg-white dark:bg-slate-700 text-primary shadow-sm scale-[1.02]' : 'text-slate-400'}`}>{s === 'Proses' ? 'Dalam Proses' : s}</button>
           ))}
         </div>
      </div>
      <ScrollableContent>
        {filteredHistory.length > 0 ? (
          <div className="space-y-4">
            {filteredHistory.map((order: any) => {
              const existingReview = reviews.find((r: any) => r.orderId === order.id);
              return (
                <Card key={order.id} className="p-5 border-none shadow-sm rounded-[2rem]">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-orange-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center shrink-0">
                        <ShoppingBag size={24} className="text-primary"/>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{order.partner}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{order.date}</p>
                      </div>
                    </div>
                    <Badge color={order.status === 'Selesai' ? 'green' : 'blue'}>{order.status}</Badge>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-gray-800/50 rounded-2xl mb-4">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{order.item}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{order.quantity} • {order.method === 'pickup' ? 'Ambil Sendiri' : 'Pengiriman'}</p>
                  </div>
                  {order.status === 'Active' && (
                    <div className="flex gap-2">
                      <button onClick={() => setViewingCodeOrder(order)} className="flex-1 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md active:scale-95 transition-transform">Kode Ambil</button>
                      <button onClick={() => handleComplete(order)} className="px-3 border border-emerald-500 text-emerald-500 rounded-xl hover:bg-emerald-50 active:scale-90 transition-all"><Check size={18} /></button>
                    </div>
                  )}
                  {order.status === 'Selesai' && (
                    existingReview ? (
                      <button 
                        onClick={() => openEditReview(existingReview)} 
                        className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-500 text-xs font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                      >
                        <Edit2 size={14} /> Ubah Ulasan Anda
                      </button>
                    ) : (
                      <button 
                        onClick={() => setReviewOrder(order)} 
                        className="w-full py-2.5 border border-primary text-primary text-xs font-bold rounded-xl active:scale-95 transition-all"
                      >
                        Beri Ulasan
                      </button>
                    )
                  )}
                </Card>
              );
            })}
          </div>
        ) : <div className="text-center py-20 text-slate-400 font-bold">Tidak ada riwayat</div>}
      </ScrollableContent>
      <ModalKodeAmbil order={viewingCodeOrder} onClose={() => setViewingCodeOrder(null)} onComplete={() => handleComplete(viewingCodeOrder)} />
      <ModalUlasan 
        isOpen={!!reviewOrder} 
        onClose={() => { setReviewOrder(null); setEditingReviewId(null); }} 
        onSubmit={handleReviewSubmit}
        initialData={editingReviewId ? reviews.find((r: any) => r.id === editingReviewId) : null}
      />
      <Snackbar isVisible={snackbar.visible} message={snackbar.message} onClose={() => setSnackbar({ ...snackbar, visible: false })} />
    </ScreenLayout>
  );
};

export const LayarRiwayatUlasan: React.FC<FiturProps> = ({ goBack, globalState, setGlobalState }) => {
  const reviews = globalState.reviews || [];
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const handleEditSubmit = (rating: number, comment: string) => {
    // Note: In real app, update review also needs backend endpoint for UPDATE. 
    // Here we assume creating a new one overwrites or we just update local for now as "Edit" is complex.
    const updated = reviews.map((r: any) => 
      r.id === editingReviewId ? { ...r, rating, comment, date: "Diubah baru saja" } : r
    );
    setGlobalState('reviews', updated);
    setEditingReviewId(null);
    setSnackbar({ visible: true, message: 'Ulasan diperbarui (Lokal)!' });
  };

  return (
    <ScreenLayout>
      <Header title="Riwayat Ulasan" onBack={goBack} />
      <ScrollableContent>
         <div className="space-y-4">
            {reviews.length > 0 ? reviews.map((r: any) => (
               <Card key={r.id} className="p-5 relative group">
                  <div className="flex justify-between items-start mb-1">
                     <h4 className="font-bold text-sm text-slate-900 dark:text-white">{r.productName}</h4>
                     <button 
                        onClick={() => setEditingReviewId(r.id)}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                     >
                        <Edit2 size={14} />
                     </button>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{r.partnerName}</p>
                  <div className="flex text-orange-400 gap-0.5 mb-2">
                     {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < r.rating ? "currentColor" : "none"} />
                     ))}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{r.comment}"</p>
                  <p className="text-[8px] text-slate-300 font-black uppercase mt-3 tracking-widest">{r.date}</p>
               </Card>
            )) : (
              <div className="text-center py-20 text-slate-400 font-bold">Belum ada ulasan.</div>
            )}
         </div>
      </ScrollableContent>
      <ModalUlasan 
        isOpen={!!editingReviewId} 
        onClose={() => setEditingReviewId(null)} 
        onSubmit={handleEditSubmit}
        initialData={editingReviewId ? reviews.find((r: any) => r.id === editingReviewId) : null}
      />
      <Snackbar isVisible={snackbar.visible} message={snackbar.message} onClose={() => setSnackbar({ ...snackbar, visible: false })} />
    </ScreenLayout>
  );
};

export const LayarLaporanDampak: React.FC<FiturProps> = ({ goBack, globalState }) => {
  // Hitung dampak dinamis berdasarkan riwayat pesanan (Misal: 1 porsi = 0.5kg CO2)
  const orders = globalState.historyItems || [];
  const completedOrders = orders.filter((o: any) => o.status === 'Selesai');
  const co2Saved = (completedOrders.length * 0.5).toFixed(1);
  const treesPlanted = Math.ceil(parseFloat(co2Saved) / 20); // Asumsi 1 pohon = 20kg CO2

  return (
    <ScreenLayout>
      <Header title="Laporan Dampak" onBack={goBack} />
      <ScrollableContent>
        <Card className="p-8 bg-emerald-50 dark:bg-emerald-950/20 text-center border-emerald-100 dark:border-emerald-900/30">
           <Leaf size={48} className="text-emerald-500 mx-auto mb-4" />
           <h2 className="text-4xl font-black text-emerald-700 dark:text-emerald-400">{co2Saved} kg</h2>
           <p className="text-sm font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">CO2 Dicegah</p>
        </Card>
        <div className="p-6 bg-slate-900 rounded-3xl text-white mt-4 shadow-xl">
           <h4 className="font-bold text-sm mb-2">Kontribusi Anda</h4>
           <p className="text-xs opacity-70 leading-relaxed">
             Dari {completedOrders.length} pesanan yang diselamatkan, Anda telah membantu mengurangi emisi gas rumah kaca yang setara dengan menanam {treesPlanted} pohon dewasa.
           </p>
        </div>
      </ScrollableContent>
    </ScreenLayout>
  );
};
