
import React, { useState, useEffect, useRef } from 'react';
import { Package, Plus, Trash2, Edit2, Search, Camera, Check, ShieldCheck, Sparkles, X } from 'lucide-react';
import { FiturProps } from '../../types';
import { ScreenLayout, Header, ScrollableContent, Card, Button, Badge, Input, Section } from '../ui';
import { dbAddInventory, dbDeleteInventory } from '../../services/databaseService';

// --- LAYAR INVENTORY MITRA ---
export const LayarInventoryMitra: React.FC<FiturProps> = ({ navigate, globalState, setGlobalState, goBack }) => {
  const inventory = globalState.partnerInventory || [];
  
  const handleDelete = async (id: number | string) => {
    if(confirm("Hapus produk ini secara permanen dari daftar?")) {
      // 1. Optimistic UI Update (Hapus di layar segera)
      setGlobalState('partnerInventory', inventory.filter((p: any) => p.id !== id));
      
      // 2. Kirim perintah hapus ke DB
      await dbDeleteInventory(String(id));
    }
  };

  return (
    <ScreenLayout>
      <Header title="Kelola Inventory" onBack={goBack} />
      <div className="p-6 pb-2">
         <div className="flex gap-3">
            <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <Input placeholder="Cari..." className="pl-10 h-10 border-none bg-slate-50" />
            </div>
            <Button className="h-10 rounded-xl px-4" onClick={() => navigate('UPLOAD_PRODUCT')}><Plus size={18} /></Button>
         </div>
      </div>
      <ScrollableContent>
        {inventory.length > 0 ? (
          <div className="space-y-4">
            {inventory.map((p: any) => (
              <Card key={p.id} className="p-4 flex gap-4 border-slate-50 shadow-sm relative">
                <img src={p.image} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                   <h4 className="font-bold text-sm truncate">{p.name}</h4>
                   <Badge color="blue" className="mt-1">{p.category}</Badge>
                   {p.qualityPercentage && (
                     <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 font-bold">
                       <ShieldCheck size={10} /> AI Score: {p.qualityPercentage}%
                     </div>
                   )}
                   <p className="text-xs font-black text-primary mt-2">{p.amountValue} {p.amountUnit}</p>
                </div>
                <div className="flex flex-col gap-2">
                   <button className="p-2 bg-slate-50 rounded-lg text-slate-400"><Edit2 size={16} /></button>
                   <button onClick={() => handleDelete(p.id)} className="p-2 bg-rose-50 rounded-lg text-rose-400 hover:bg-rose-100 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                </div>
              </Card>
            ))}
          </div>
        ) : <div className="text-center py-20 text-slate-300 font-bold"><Package size={48} className="mx-auto mb-2 opacity-20"/> Inventory Kosong</div>}
      </ScrollableContent>
    </ScreenLayout>
  );
};

// --- LAYAR UPLOAD PRODUK ---
export const LayarUploadProduk: React.FC<FiturProps> = ({ navigate, goBack, globalState, setGlobalState }) => {
   const [name, setName] = useState('');
   const [amount, setAmount] = useState('');
   const [image, setImage] = useState<string | null>(null);
   const [qualityScore, setQualityScore] = useState<number | null>(null);
   const [aiDesc, setAiDesc] = useState('');
   const [category, setCategory] = useState('Makanan Berat');
   
   const [isLoading, setIsLoading] = useState(false);
   const fileInputRef = useRef<HTMLInputElement>(null);

   // Check for AI Data on mount
   useEffect(() => {
     if (globalState.tempProductData) {
       const data = globalState.tempProductData;
       setName(data.name || '');
       setCategory(data.category || 'Makanan Berat');
       setImage(data.image || null);
       setQualityScore(data.qualityPercentage || null);
       setAiDesc(data.description || '');
       
       // Clear temp data so it doesn't persist if user leaves and comes back manually
       setGlobalState('tempProductData', null);
     }
   }, []);

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => setImage(reader.result as string);
        reader.readAsDataURL(file);
      }
   };

   const handleUpload = async () => {
      if (!name || !amount) return alert("Mohon lengkapi data produk");
      
      setIsLoading(true);

      const newItemData = {
          name: name,
          amountValue: parseInt(amount),
          amountUnit: "Porsi",
          category: category,
          image: image || "https://picsum.photos/400/200?random=" + Math.floor(Math.random() * 100),
          qualityPercentage: qualityScore || null, // Kirim skor AI jika ada
          description: aiDesc || "Makanan surplus berkualitas",
          partnerName: globalState.user?.name || "Mitra",
          partnerAvatar: globalState.user?.avatar,
          partnerPhone: globalState.user?.phone || "",
          status: "Buka",
          distance: "0 km",
          serviceStart: "Now",
          serviceEnd: "22:00",
          rating: 5.0
      };

      const result = await dbAddInventory(newItemData, globalState.user?.name || "Mitra");
      
      if (result.success && result.inventoryId) {
          const newItem = { ...newItemData, id: result.inventoryId };
          const currentInv = globalState.partnerInventory || [];
          setGlobalState('partnerInventory', [newItem, ...currentInv]);
          setIsLoading(false);
          navigate('SUCCESS');
      } else {
          alert("Gagal upload: " + (result.message || "Unknown error"));
          setIsLoading(false);
      }
   };

   return (
      <ScreenLayout>
         <Header title="Tambah Produk" onBack={goBack} />
         <ScrollableContent>
            
            {/* Image Preview / Upload Area */}
            <div className="relative mb-6">
               {image ? (
                 <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-md relative group">
                   <img src={image} className="w-full h-full object-cover" alt="Preview" />
                   <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>Ganti Foto</Button>
                   </div>
                   {qualityScore && (
                     <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-black shadow-lg flex items-center gap-1.5 animate-in fade-in zoom-in">
                       <Sparkles size={12} fill="currentColor" />
                       AI Score: {qualityScore}%
                     </div>
                   )}
                 </div>
               ) : (
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="aspect-video border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-100 transition-colors"
                 >
                   <Camera size={40} className="mb-2" />
                   <p className="text-xs font-bold uppercase tracking-widest">Ketuk untuk Foto</p>
                 </div>
               )}
               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>

            {/* Auto-fill Notice */}
            {qualityScore && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800 flex items-start gap-3 mb-6">
                 <ShieldCheck className="text-emerald-500 mt-0.5" size={18} />
                 <div>
                    <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Data Terisi Otomatis</h4>
                    <p className="text-xs text-emerald-600/80 dark:text-emerald-400/70 mt-1">
                       Nama dan deskripsi telah diisi berdasarkan hasil analisis AI. Silakan sesuaikan jika perlu.
                    </p>
                 </div>
              </div>
            )}

            <Section title="Informasi Dasar">
               <div className="space-y-4">
                  <Input 
                     label="Nama Makanan" 
                     placeholder="Contoh: Nasi Goreng Spesial" 
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                  />
                  
                  <div className="w-full space-y-1.5">
                    <label className="text-sm font-semibold text-slate-900 dark:text-white block">Kategori</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-900 dark:border-slate-100 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm appearance-none"
                    >
                      <option value="Makanan Berat">Makanan Berat</option>
                      <option value="Roti & Kue">Roti & Kue</option>
                      <option value="Sayur & Buah">Sayur & Buah</option>
                      <option value="Minuman">Minuman</option>
                      <option value="Bahan Masak">Bahan Masak</option>
                    </select>
                  </div>

                  <Input 
                     label="Jumlah Sisa" 
                     placeholder="Contoh: 5" 
                     type="number" 
                     value={amount}
                     onChange={(e) => setAmount(e.target.value)}
                  />

                  {aiDesc && (
                    <div className="w-full space-y-1.5">
                      <label className="text-sm font-semibold text-slate-900 dark:text-white block">Deskripsi AI</label>
                      <textarea 
                        value={aiDesc}
                        onChange={(e) => setAiDesc(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-900 dark:border-slate-100 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm h-24"
                      />
                    </div>
                  )}
               </div>
            </Section>
            <Button 
               className="w-full h-14 rounded-2xl font-black uppercase tracking-widest mt-8" 
               onClick={handleUpload}
               isLoading={isLoading}
            >
               Upload & Simpan
            </Button>
         </ScrollableContent>
      </ScreenLayout>
   );
};

// --- LAYAR BERHASIL UPLOAD ---
export const LayarBerhasilUpload: React.FC<FiturProps> = ({ navigate }) => (
  <ScreenLayout className="items-center justify-center text-center p-8">
     <div className="w-24 h-24 bg-emerald-100 rounded-[2rem] flex items-center justify-center mb-8">
        <Check size={48} className="text-emerald-500" />
     </div>
     <h2 className="text-2xl font-black mb-2 uppercase">Produk Live!</h2>
     <p className="text-sm text-slate-500 mb-10">Produk Anda kini sudah terlihat oleh pengguna sekitar.</p>
     <Button className="w-full h-14 rounded-2xl" onClick={() => navigate('PARTNER_INVENTORY')}>Cek Inventory</Button>
  </ScreenLayout>
);
