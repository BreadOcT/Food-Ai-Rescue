
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Navigation, PlusCircle, Home, Map as MapIcon, 
  CheckCircle, Search, MapPin, ExternalLink, Activity, 
  Loader2, Sparkles, ChevronRight, Clock, Store, Truck, 
  Info, ShieldCheck, CreditCard, ShoppingBag, MessageCircle,
  Wallet, Landmark, Banknote, Smartphone, X, Copy, QrCode
} from 'lucide-react';
import { ScreenName } from '../types';
import { Button, ScreenLayout, Header, ScrollableContent, Section, Card, Badge, Input } from './ui';
import { ManualLocationForm } from './LocationComponents';
import { searchLocationByCoords, searchLocationByQuery, LocationInfo } from '../services/geminiService';
import { FoodFeedCard } from './HomeComponents';

interface FeatureProps {
  navigate: (screen: ScreenName) => void;
  goBack: () => void;
  globalState: any;
  setGlobalState: (key: string, value: any) => void;
}

// --- LOCATION SELECTION SCREEN ---

export const LocationSelectScreen: React.FC<FeatureProps> = ({ goBack, globalState, setGlobalState }) => {
   // State untuk form tambah alamat (default tertutup, user klik tambah baru)
   const [isAddingNew, setIsAddingNew] = useState(false);
   
   const [formData, setFormData] = useState({
     fullAddress: "", // Hanya fokus pada Link Google Maps
   });

   const handleSave = () => {
     if (!formData.fullAddress) {
       alert("Mohon masukkan Link Google Maps.");
       return;
     }
     
     // Validasi sederhana link
     if (!formData.fullAddress.includes('http') && !formData.fullAddress.includes('goo.gl') && !formData.fullAddress.includes('maps')) {
        alert("Mohon masukkan link Google Maps yang valid.");
        return;
     }

     const newAddress = {
       id: Date.now(),
       title: "Pin Lokasi", // Default title karena input judul dihilangkan
       desc: formData.fullAddress, // Menyimpan link sebagai deskripsi/alamat
       notes: "",
       type: 'gps',
       receiver: globalState.user?.name || 'User',
       phone: globalState.user?.phone || ''
     };
     
     setGlobalState('addresses', [newAddress, ...(globalState.addresses || [])]);
     setGlobalState('currentLocationName', newAddress.title);
     setIsAddingNew(false);
     
     // Reset form
     setFormData({
        fullAddress: "",
     });
   };

   return (
      <ScreenLayout bgClass="bg-slate-50 dark:bg-gray-950">
         <Header title="Pilih Alamat" onBack={goBack} />
         <ScrollableContent>
            
            {/* Jika sedang menambah alamat baru, tampilkan form. Jika tidak, tampilkan tombol tambah. */}
            {isAddingNew ? (
               <ManualLocationForm 
                  formData={formData} 
                  setFormData={setFormData} 
                  onSave={handleSave} 
                  onCancel={() => setIsAddingNew(false)} 
               />
            ) : (
               <Section>
                  <Button 
                     variant="outline" 
                     className="w-full h-14 bg-white dark:bg-gray-900 border-dashed border-2 border-primary/40 text-primary font-bold" 
                     onClick={() => setIsAddingNew(true)}
                  >
                     <PlusCircle size={20} className="mr-2" /> Tambah Alamat Baru
                  </Button>
               </Section>
            )}

            <Section title="Alamat Tersimpan">
               <div className="space-y-3">
                  {(globalState.addresses || []).length > 0 ? (
                     (globalState.addresses || []).map((addr: any) => (
                        <Card 
                           key={addr.id} 
                           className={`flex gap-4 p-4 border-2 transition-all cursor-pointer group ${globalState.currentLocationName === addr.title && globalState.currentLocationName !== 'Jakarta Pusat' ? 'border-primary bg-primary/5' : 'border-transparent hover:border-slate-200'}`} 
                           onClick={() => { setGlobalState('currentLocationName', addr.title); goBack(); }}
                        >
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${globalState.currentLocationName === addr.title ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-gray-800 text-slate-400'}`}>
                              {addr.type === 'home' ? <Home size={18}/> : <MapPin size={18}/>}
                           </div>
                           <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{addr.title}</h4>
                              <p className="text-xs text-slate-500 truncate mt-0.5 text-blue-500 underline decoration-dotted">{addr.desc}</p>
                              {addr.notes && <p className="text-[10px] text-slate-400 mt-1 italic line-clamp-1">"{addr.notes}"</p>}
                           </div>
                           {globalState.currentLocationName === addr.title && (
                              <div className="flex items-center justify-center text-primary">
                                 <CheckCircle size={20} fill="currentColor" className="text-white" />
                              </div>
                           )}
                        </Card>
                     ))
                  ) : (
                     <div className="text-center py-10 text-slate-400">
                        <MapPin size={40} className="mx-auto mb-2 opacity-20"/>
                        <p className="text-xs">Belum ada alamat tersimpan.</p>
                     </div>
                  )}
               </div>
            </Section>
         </ScrollableContent>
      </ScreenLayout>
   );
};

// --- PARTNER DETAIL SCREEN ---

export const PartnerDetailScreen: React.FC<FeatureProps> = ({ goBack, navigate, globalState }) => {
  const item = globalState.reservationItem;
  if (!item) return null;

  const handleAskPartner = () => {
    // Nomor default jika tidak ada data
    const phoneNumber = "6281234567890"; 
    const message = `Halo ${item.partner}, saya tertarik dengan produk surplus "${item.foodName}". Apakah masih tersedia?`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const openPartnerMap = () => {
    // Check if mapsUrl exists and use it directly to ensure accuracy
    if (item.mapsUrl) {
       window.open(item.mapsUrl, '_blank');
       return;
    }
    const query = encodeURIComponent(item.partner);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <ScreenLayout className="relative">
      {/* Background Image Container */}
      <div className="relative h-80 shrink-0">
        <img src={item.image} className="w-full h-full object-cover" alt={item.foodName} />
        {/* Overlay for better readability of floating elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
        
        {/* Back Button */}
        <button 
          onClick={goBack} 
          className="absolute top-6 left-6 p-2.5 bg-white/90 dark:bg-slate-900/90 rounded-full shadow-lg backdrop-blur-sm active:scale-90 transition-all z-20"
        >
          <ChevronLeft size={22} className="text-slate-800 dark:text-white" />
        </button>

        {/* Floating Stock Badge on Image */}
        <div className="absolute bottom-10 left-6 z-20">
          <div className="bg-orange-500 text-white text-[11px] font-black px-3 py-1.5 rounded-lg shadow-xl shadow-orange-500/30 flex items-center gap-1.5 animate-pulse uppercase tracking-wider">
            <ShoppingBag size={12} /> Sisa {item.quantity}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <ScrollableContent className="-mt-8 bg-white dark:bg-slate-950 rounded-t-[2.5rem] shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-10 p-0 overflow-visible">
        <div className="p-8 space-y-8">
          {/* Header Info */}
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {item.foodName}
            </h1>
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <Store size={16} className="text-primary" />
              </div>
              <span className="truncate">{item.partner}</span>
              <span className="shrink-0 text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-1 shrink-0">
                <MapPin size={14} className="text-slate-400" />
                <span>{item.distance}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-orange-50/50 dark:bg-orange-950/10 border-orange-100/50 dark:border-orange-900/20 flex items-center gap-3 rounded-3xl">
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                <Clock className="text-orange-500" size={20}/>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-orange-600 uppercase font-black tracking-widest">Jam Layanan</p>
                <p className="text-sm font-black text-slate-900 dark:text-white truncate">
                   {item.serviceStart ? `${item.serviceStart} - ${item.serviceEnd}` : item.timeLeft.split(',')[1]}
                </p>
              </div>
            </Card>
            <Card className="p-4 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100/50 dark:border-blue-900/20 flex items-center gap-3 rounded-3xl">
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                <ShieldCheck className="text-blue-500" size={20}/>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-blue-600 uppercase font-black tracking-widest">Halal AI</p>
                <p className="text-sm font-black text-slate-900 dark:text-white truncate">Terverifikasi</p>
              </div>
            </Card>
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-400">Deskripsi</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Makanan surplus hari ini yang masih sangat layak konsumsi. Disiapkan dengan standar kebersihan tinggi oleh {item.partner}. Bantu kurangi pemborosan pangan!
            </p>
          </div>

          {/* Location Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-400">Lokasi Pengambilan</h3>
            <Card 
               className="p-0 overflow-hidden border-none shadow-sm rounded-[2rem] bg-slate-50 dark:bg-slate-900 cursor-pointer hover:opacity-95 transition-opacity"
               onClick={openPartnerMap}
            >
               <div className="h-32 bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative">
                 <MapIcon className="text-slate-300 dark:text-slate-700" size={40}/>
                 <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                   <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Cek di Peta</span>
                 </div>
               </div>
               <div className="p-5 flex justify-between items-center">
                 <div className="min-w-0">
                   <p className="text-sm font-black text-slate-900 dark:text-white truncate">{item.partner} Store</p>
                   <p className="text-[10px] text-slate-500 font-medium truncate">Lokasi: {item.partner}, {item.distance}</p>
                 </div>
                 <button className="p-3 bg-primary/10 text-primary rounded-2xl active:scale-95 transition-all">
                   <Navigation size={20} />
                 </button>
               </div>
            </Card>
          </div>
          
          {/* Bottom Buffer */}
          <div className="h-24" />
        </div>
      </ScrollableContent>

      {/* Floating Bottom Bar */}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 flex gap-4 z-30">
        <Button 
          variant="outline" 
          className="flex-1 h-14 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest hover:bg-green-50 hover:text-green-600 hover:border-green-200"
          onClick={handleAskPartner}
        >
          <MessageCircle size={18}/> Tanya Mitra
        </Button>
        <Button className="flex-2 h-14 rounded-2xl shadow-2xl shadow-primary/20 font-black text-[10px] uppercase tracking-widest px-8" onClick={() => navigate('RESERVATION_FORM')}>
          Ambil Sekarang
        </Button>
      </div>
    </ScreenLayout>
  );
};

// --- RESERVATION FORM SCREEN ---

export const ReservationFormScreen: React.FC<FeatureProps> = ({ goBack, navigate, globalState, setGlobalState }) => {
  const item = globalState.reservationItem;
  // Set method always to pickup
  const [method, setMethod] = useState<'pickup'>('pickup');
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Batas maksimum stok dari data item (fallback ke 5 jika tidak ada data)
  const maxStock = item.rawStock || 5;

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newOrder = {
        id: Date.now(),
        partner: item.partner,
        item: item.foodName,
        quantity: `${quantity} Porsi`,
        status: 'Active',
        time: new Date().toLocaleTimeString(),
        method: method,
        payment: 'Tunai / Gratis', // Default payment status
        image: item.image
      };
      setGlobalState('historyItems', [newOrder, ...globalState.historyItems]);
      navigate('RESERVATION_SUCCESS');
      setIsProcessing(false);
    }, 1500);
  };

  const calculateTotal = () => {
    let total = 2000; // Admin fee
    return total;
  };

  return (
    <ScreenLayout>
      <Header title="Konfirmasi Reservasi" onBack={goBack} />
      <ScrollableContent>
        <Section title="Detail Pesanan">
          <Card className="flex gap-4 p-3">
            <img src={item.image} className="w-16 h-16 rounded-xl object-cover" />
            <div className="flex-1">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.foodName}</h4>
              <p className="text-[10px] text-slate-500">{item.partner}</p>
              <div className="flex items-center gap-2 mt-2">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-gray-800 flex items-center justify-center font-bold text-slate-900 dark:text-white">-</button>
                <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                {/* Validasi max stock */}
                <button 
                  onClick={() => setQuantity(q => Math.min(q+1, maxStock))} 
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${quantity >= maxStock ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-slate-100 dark:bg-gray-800 text-slate-900 dark:text-white'}`}
                  disabled={quantity >= maxStock}
                >
                  +
                </button>
              </div>
              <p className="text-[9px] text-slate-400 mt-1">Stok tersedia: {maxStock}</p>
            </div>
          </Card>
        </Section>

        {/* Removed Metode Penerimaan Section - Defaulting to Pickup implicitly */}
        <Section title="Metode Penerimaan">
           <div className="p-4 rounded-2xl border-2 border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                 <Store size={20} />
              </div>
              <div>
                 <p className="text-xs font-bold text-slate-900 dark:text-white">Ambil Sendiri di Lokasi</p>
                 <p className="text-[10px] text-slate-500">Datang ke lokasi mitra untuk mengambil pesanan.</p>
              </div>
           </div>
        </Section>

        {/* Removed Payment Section entirely */}

        <Section title="Rincian Biaya">
           <div className="bg-slate-50 dark:bg-gray-800/50 rounded-[2rem] p-6 space-y-3">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-500">Makanan Surplus ({quantity} Porsi)</span>
                <span className="text-green-500 font-bold uppercase tracking-tighter">Gratis</span>
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-500">Biaya Layanan Aplikasi</span>
                <span className="text-slate-900 dark:text-white">Rp 2.000</span>
              </div>
              <div className="h-px bg-slate-200 dark:bg-gray-700 my-1"></div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 flex items-start gap-2">
                 <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
                 <p className="text-[10px] text-blue-600 dark:text-blue-400 leading-tight">
                    Pembayaran biaya layanan dilakukan tunai saat pengambilan atau gratis jika mitra membebaskan biaya.
                 </p>
              </div>
           </div>
        </Section>
      </ScrollableContent>
      
      <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <Button 
          className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-xs" 
          isLoading={isProcessing} 
          onClick={handleConfirm}
        >
          Konfirmasi Pesanan
        </Button>
      </div>
    </ScreenLayout>
  );
};

// --- RESERVATION SUCCESS SCREEN ---

export const ReservationSuccessScreen: React.FC<FeatureProps> = ({ navigate }) => (
  <ScreenLayout bgClass="bg-white dark:bg-gray-900">
    <ScrollableContent className="flex flex-col items-center justify-center text-center px-8">
      <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-950/30 rounded-[2rem] flex items-center justify-center mb-6 animate-bounce">
        <CheckCircle size={48} className="text-emerald-500" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Pesanan Diterima!</h2>
      <p className="text-sm text-slate-500 mb-10 leading-relaxed font-medium">Silakan datang ke lokasi mitra sesuai jam layanan untuk mengambil paket Anda.</p>
      
      <div className="w-full space-y-3">
        <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs" onClick={() => navigate('HISTORY')}>Lihat Detail Pesanan</Button>
        <Button variant="ghost" className="w-full text-slate-400 font-bold" onClick={() => navigate('HOME')}>Lanjut Berbagi</Button>
      </div>
    </ScrollableContent>
  </ScreenLayout>
);

// --- HISTORY SCREEN ---

// MODAL UNTUK MENAMPILKAN KODE AMBIL
const PickupCodeModal: React.FC<{ order: any; onClose: () => void }> = ({ order, onClose }) => {
  if (!order) return null;
  const code = order.pickupCode || `ORD-${order.id.toString().slice(-4)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col items-center">
        <div className="w-full flex justify-end mb-2">
           <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"><X size={20}/></button>
        </div>
        
        <div className="text-center mb-8">
           <h3 className="font-bold text-slate-500 text-xs uppercase tracking-widest mb-2">Kode Pengambilan</h3>
           <div className="text-4xl font-black text-slate-900 dark:text-white tracking-widest font-mono bg-slate-100 dark:bg-slate-800 py-4 px-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 select-all">
              {code}
           </div>
        </div>

        <div className="w-48 h-48 bg-white p-2 rounded-2xl border border-slate-200 mb-6 flex items-center justify-center">
           <QrCode size={160} className="text-slate-900" />
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/20 w-full mb-6">
           <div className="flex items-start gap-3">
             <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
               <Store size={16} />
             </div>
             <div>
               <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-0.5">Tunjukkan ke Mitra</p>
               <p className="text-sm font-bold text-slate-900 dark:text-white">{order.partner}</p>
               <p className="text-xs text-slate-500 mt-1">{order.item} ({order.quantity})</p>
             </div>
           </div>
        </div>

        <Button className="w-full h-12 rounded-xl" onClick={onClose}>Tutup</Button>
      </div>
    </div>
  );
};

export const HistoryScreen: React.FC<FeatureProps> = ({ goBack, globalState }) => {
  const history = globalState.historyItems || [];
  const [viewingCodeOrder, setViewingCodeOrder] = useState<any | null>(null);
  
  return (
    <ScreenLayout>
      <Header title="Riwayat Pesanan" onBack={goBack} />
      <ScrollableContent>
        {history.length > 0 ? (
          <div className="space-y-4">
            {history.map((order: any) => (
              <Card key={order.id} className="p-5 space-y-4 border-none shadow-sm rounded-[2rem]">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-orange-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center shrink-0">
                      <ShoppingBag size={24} className="text-primary"/>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{order.partner}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{order.time}</p>
                    </div>
                  </div>
                  <Badge color={order.status === 'Active' ? 'blue' : order.status === 'Selesai' ? 'green' : 'gray'} className="rounded-lg">{order.status}</Badge>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-slate-100 dark:border-gray-700">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{order.item}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">{order.quantity} • {order.method === 'pickup' ? 'Ambil Sendiri' : 'Pengiriman Gojek'}</p>
                  {order.payment && (
                    <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-100 dark:border-gray-700">
                      <CreditCard size={12} className="text-slate-400"/>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{order.payment}</span>
                    </div>
                  )}
                </div>
                {order.status === 'Active' && (
                  <div className="flex gap-2">
                    <Button variant="outline-primary" size="sm" className="flex-1 rounded-xl font-black uppercase tracking-widest text-[9px]">Tanya Mitra</Button>
                    <Button 
                      size="sm" 
                      className="flex-1 rounded-xl font-black uppercase tracking-widest text-[9px]"
                      onClick={() => setViewingCodeOrder(order)}
                    >
                      Kode Ambil
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag size={32} className="text-slate-200"/>
            </div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Belum ada pesanan</p>
          </div>
        )}
      </ScrollableContent>
      
      {/* Render Modal if an order is selected */}
      <PickupCodeModal order={viewingCodeOrder} onClose={() => setViewingCodeOrder(null)} />
    </ScreenLayout>
  );
};

export const ExploreScreen: React.FC<any> = ({ navigate, goBack, globalState, setGlobalState }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const savedItems = globalState.savedItems || [];
  
  // Ambil data produk dari globalState
  const rawInventory = globalState.partnerInventory || [];
  
  // Map data ke format yang sesuai untuk tampilan
  const allProducts = rawInventory.map((item: any) => ({
    id: item.id,
    partner: item.partnerName || "Mitra Food Rescue",
    status: item.status || "Buka",
    foodName: item.name,
    distance: item.distance || "0.5 km",
    timeLeft: `Hari ini, s/d ${item.serviceEnd || '21:00'}`,
    // Pass raw data
    rawStock: item.amountValue, 
    serviceStart: item.serviceStart,
    serviceEnd: item.serviceEnd,
    quantity: `${item.amountValue} ${item.amountUnit}`,
    image: item.image,
    avatar: item.partnerAvatar || "https://picsum.photos/100/100?random=99",
    category: item.category,
    deliveryType: item.deliveryType || 'pickup',
    rating: item.rating || 5.0,
    isHalal: item.isHalal,
    mapsUrl: item.mapsUrl // Pass mapsUrl from inventory to search results
  }));

  const filteredProducts = allProducts.filter((p: any) => 
    p.foodName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSave = (id: number) => {
    const newSaved = savedItems.includes(id) ? savedItems.filter((i: number) => i !== id) : [...savedItems, id];
    setGlobalState('savedItems', newSaved);
  };

  return (
    <ScreenLayout>
      <div className="p-6 pb-2 border-b border-gray-100 bg-white dark:bg-slate-900 sticky top-0 z-20">
         <div className="flex items-center gap-3 mb-4">
            <button onClick={goBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
               <ChevronLeft size={24} className="text-slate-900 dark:text-white" />
            </button>
            <div className="relative flex-1">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                 className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900 dark:text-white" 
                 placeholder="Cari makanan, mitra..." 
                 autoFocus
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>
         <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {['Makanan Berat', 'Minuman', 'Roti & Kue', 'Buah & Sayur'].map(cat => (
               <button key={cat} onClick={() => setSearchTerm(cat)} className="px-4 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap hover:bg-primary hover:text-white hover:border-primary transition-colors">
                  {cat}
               </button>
            ))}
         </div>
      </div>
      <ScrollableContent>
         <h3 className="font-bold text-slate-900 dark:text-white mb-4">Hasil Pencarian ({filteredProducts.length})</h3>
         {filteredProducts.length > 0 ? (
            <div className="space-y-4">
               {filteredProducts.map((item: any) => (
                  <FoodFeedCard 
                     key={item.id} 
                     item={item} 
                     isSaved={savedItems.includes(item.id)} 
                     onSaveToggle={toggleSave}
                     onClick={() => { setGlobalState('reservationItem', item); navigate('PARTNER_DETAIL'); }}
                     onActionClick={() => { setGlobalState('reservationItem', item); navigate('RESERVATION_FORM'); }}
                  />
               ))}
            </div>
         ) : (
            <div className="text-center py-20 opacity-50">
               <Search size={48} className="mx-auto mb-4 text-slate-300"/>
               <p className="text-sm font-bold text-slate-400">Tidak ditemukan hasil untuk "{searchTerm}"</p>
            </div>
         )}
      </ScrollableContent>
    </ScreenLayout>
  );
};

export const ImpactReportScreen: React.FC<any> = ({ goBack }) => (<ScreenLayout><Header title="Dampak Sosial" onBack={goBack}/><ScrollableContent>Impact Report</ScrollableContent></ScreenLayout>);
export const MapViewScreen: React.FC<any> = ({ goBack }) => (<ScreenLayout><Header title="Peta Lokasi" onBack={goBack}/><ScrollableContent>Map View</ScrollableContent></ScreenLayout>);
export const CreateRequestScreen: React.FC<any> = ({ goBack }) => (<ScreenLayout><Header title="Buat Request" onBack={goBack}/><ScrollableContent>Request Form</ScrollableContent></ScreenLayout>);
