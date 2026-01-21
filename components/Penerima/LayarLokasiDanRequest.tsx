
import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, MapPin, Home, Map as MapIcon, Info, Search } from 'lucide-react';
import { FiturProps } from '../../types';
import { ScreenLayout, Header, ScrollableContent, Section, Button, Card, Input } from '../ui';
import { ManualLocationForm } from '../LocationComponents';
import { dbSaveAddress, dbCreateRequest } from '../../services/databaseService';

// --- LAYAR PILIH LOKASI ---
export const LayarPilihLokasi: React.FC<FiturProps> = ({ goBack, globalState, setGlobalState }) => {
   const [isAdding, setIsAdding] = useState(false);
   const [formData, setFormData] = useState({ fullAddress: "" });
   const [isLoading, setIsLoading] = useState(false);

   const handleSave = async () => {
     if (!formData.fullAddress.includes('maps')) return alert("Masukkan link Google Maps valid!");
     
     setIsLoading(true);
     const newAddr = { 
        id: Date.now(), 
        title: "Titik Lokasi Baru", 
        desc: formData.fullAddress, 
        type: 'gps' 
     };

     // 1. Optimistic UI
     const currentAddrs = globalState.addresses || [];
     setGlobalState('addresses', [newAddr, ...currentAddrs]);
     setGlobalState('currentLocationName', "Lokasi Terpilih");

     // 2. Backend Save
     if (globalState.user) {
        await dbSaveAddress(newAddr, globalState.user.email);
     }

     setIsLoading(false);
     setIsAdding(false);
   };

   return (
      <ScreenLayout bgClass="bg-slate-50 dark:bg-slate-950">
         <Header title="Pilih Alamat" onBack={goBack} />
         <ScrollableContent>
            {isAdding ? (
               <ManualLocationForm 
                  formData={formData} 
                  setFormData={setFormData} 
                  onSave={handleSave} 
                  onCancel={() => setIsAdding(false)} 
                  isLoading={isLoading}
               />
            ) : (
               <Button variant="outline" className="w-full h-14 border-dashed border-2 bg-white dark:bg-slate-900 border-primary/40 text-primary font-bold" onClick={() => setIsAdding(true)}>
                  <PlusCircle size={20} className="mr-2" /> Tambah Alamat Baru
               </Button>
            )}
            <Section title="Alamat Tersimpan">
               <div className="space-y-3">
                  {(globalState.addresses || []).length > 0 ? (
                     (globalState.addresses || []).map((addr: any) => (
                        <Card key={addr.id} className="flex gap-4 p-4 border-none shadow-sm cursor-pointer" onClick={() => { setGlobalState('currentLocationName', addr.title); goBack(); }}>
                           <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                              {addr.type === 'home' ? <Home size={18}/> : <MapPin size={18}/>}
                           </div>
                           <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm">{addr.title}</h4>
                              <p className="text-xs text-slate-500 truncate mt-0.5">{addr.desc}</p>
                           </div>
                        </Card>
                     ))
                  ) : (
                     <p className="text-center text-xs text-slate-400 py-8">Belum ada alamat tersimpan.</p>
                  )}
               </div>
            </Section>
         </ScrollableContent>
      </ScreenLayout>
   );
};

// --- LAYAR BUAT PERMINTAAN ---
export const LayarBuatPermintaan: React.FC<FiturProps> = ({ goBack, globalState }) => {
   const [foodName, setFoodName] = useState("");
   const [budget, setBudget] = useState("");
   const [isLoading, setIsLoading] = useState(false);

   const handleSubmit = async () => {
      if(!foodName) return alert("Mohon isi nama makanan");
      setIsLoading(true);
      
      await dbCreateRequest({
         userId: globalState.user?.email || "guest",
         foodName,
         budget: budget || "0",
         date: new Date().toISOString()
      });

      setIsLoading(false);
      alert("Permintaan berhasil dikirim ke mitra sekitar!");
      goBack();
   };

   return (
    <ScreenLayout>
      <Header title="Buat Permintaan" onBack={goBack} />
      <ScrollableContent>
         <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex gap-3 mb-6">
            <Info className="text-orange-500 shrink-0" size={20} />
            <p className="text-xs text-orange-700">Mitra akan melihat permintaan Anda dan merespon jika tersedia.</p>
         </div>
         <div className="space-y-4">
            <Input 
               label="Makanan yang dicari" 
               placeholder="Contoh: Roti Tawar, Nasi Kotak..." 
               value={foodName}
               onChange={(e) => setFoodName(e.target.value)}
            />
            <Input 
               label="Budget (Opsional)" 
               placeholder="Rp 0 (Gratis)" 
               value={budget}
               onChange={(e) => setBudget(e.target.value)}
            />
            <Button 
               className="w-full h-14 mt-6 font-black uppercase tracking-widest"
               onClick={handleSubmit}
               isLoading={isLoading}
            >
               Kirim Permintaan
            </Button>
         </div>
      </ScrollableContent>
    </ScreenLayout>
  );
};

// --- LAYAR PETA INTERAKTIF (Leaflet Implementation) ---
export const LayarPeta: React.FC<FiturProps> = ({ goBack, globalState, navigate, setGlobalState }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const inventory = globalState.partnerInventory || [];

  useEffect(() => {
    // 1. Check if Leaflet is loaded and map container exists
    if (typeof window === 'undefined' || !(window as any).L || !mapContainerRef.current) return;
    
    // 2. Prevent re-initialization
    if (mapInstanceRef.current) return;

    const L = (window as any).L;

    // 3. Initialize Map (Center: Jakarta)
    const map = L.map(mapContainerRef.current).setView([-6.1751, 106.8650], 12);
    mapInstanceRef.current = map;

    // 4. Add Tile Layer (CartoDB Positron for clean look)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    // 5. Add Markers for Inventory Items
    inventory.forEach((item: any) => {
       // Mock coordinates generation based on Item ID to simulate spread locations around Jakarta
       // This ensures the marker stays in the same place for the same item but is random enough.
       const idNum = typeof item.id === 'string' ? item.id.length : item.id;
       const randomLat = -6.1751 + (Math.sin(idNum) * 0.05);
       const randomLng = 106.8650 + (Math.cos(idNum) * 0.05);

       const marker = L.marker([randomLat, randomLng]).addTo(map);
       
       // Custom Popup Content
       const popupContent = `
         <div style="min-width: 150px; font-family: 'Inter', sans-serif;">
           <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 2px;">${item.name}</h3>
           <p style="font-size: 11px; color: #666; margin-bottom: 8px;">${item.partnerName}</p>
           <button 
             id="btn-${item.id}"
             style="background-color: #FF8C42; color: white; border: none; border-radius: 8px; padding: 6px 12px; font-size: 11px; font-weight: bold; cursor: pointer; width: 100%;"
           >
             Lihat Detail
           </button>
         </div>
       `;
       
       marker.bindPopup(popupContent);
       
       // Event delegation for the button inside popup
       marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-${item.id}`);
          if(btn) {
             btn.onclick = () => {
                setGlobalState('reservationItem', item);
                navigate('PARTNER_DETAIL');
             };
          }
       });
    });

    // Add "You are Here" marker
    L.circle([-6.1751, 106.8650], {
       color: '#3B82F6',
       fillColor: '#3B82F6',
       fillOpacity: 0.2,
       radius: 800
    }).addTo(map);
    L.marker([-6.1751, 106.8650], {
       icon: L.divIcon({
          className: 'custom-div-icon',
          html: "<div style='background-color:#3B82F6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.2);'></div>",
          iconSize: [12, 12],
          iconAnchor: [6, 6]
       })
    }).addTo(map);

    return () => {
      // Cleanup map on unmount
      if (mapInstanceRef.current) {
         mapInstanceRef.current.remove();
         mapInstanceRef.current = null;
      }
    };
  }, [inventory, navigate, setGlobalState]);

  return (
    <ScreenLayout className="relative">
      <div className="absolute top-0 left-0 right-0 z-[1000] p-4">
         <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-md flex items-center justify-between border border-slate-200/50">
            <button onClick={goBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><MapIcon className="text-slate-600" size={20}/></button>
            <h3 className="font-bold text-slate-900 text-sm">Peta Makanan Sekitar</h3>
            <div className="w-9"></div> 
         </div>
      </div>
      
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full bg-slate-100 z-0" />

      {/* Floating Info Card */}
      <div className="absolute bottom-8 left-4 right-4 z-[1000]">
         <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-slate-100">
            <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-orange-100 text-primary flex items-center justify-center shrink-0">
                  <MapPin size={20} fill="currentColor" />
               </div>
               <div>
                  <h4 className="font-bold text-slate-900 text-sm">{inventory.length} Lokasi Ditemukan</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                     Menampilkan lokasi mitra yang memiliki surplus makanan hari ini di sekitar Jakarta Pusat.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </ScreenLayout>
  );
};
