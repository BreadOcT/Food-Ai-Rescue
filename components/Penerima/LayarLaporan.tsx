
import React, { useState } from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { FiturProps } from '../../types';
import { ScreenLayout, Header, ScrollableContent, Section, Button, Snackbar } from '../ui';
import { dbSubmitReport } from '../../services/databaseService';

export const LayarLaporProduk: React.FC<FiturProps> = ({ goBack, globalState }) => {
   const [desc, setDesc] = useState("");
   const [reason, setReason] = useState("Kualitas Makanan Buruk");
   const [isSending, setIsSending] = useState(false);
   const [showSuccess, setShowSuccess] = useState(false);

   const handleSubmit = async () => {
      if (!desc.trim()) return alert("Isi deskripsi masalah!");
      setIsSending(true);

      await dbSubmitReport({
          userId: globalState.user?.email || "Guest",
          reason: reason,
          description: desc,
          date: new Date().toISOString()
      });

      setIsSending(false);
      setShowSuccess(true);
      setTimeout(goBack, 1500);
   };

   return (
      <ScreenLayout>
         <Header title="Laporkan Produk" onBack={goBack} />
         <ScrollableContent>
            <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 flex gap-3 mb-6">
               <AlertTriangle className="text-rose-500 shrink-0" size={20} />
               <p className="text-xs text-rose-700">Laporan Anda membantu menjaga kualitas komunitas kami.</p>
            </div>
            <Section title="Detail Masalah">
               <div className="space-y-4">
                  <div className="space-y-1.5">
                     <label className="text-sm font-semibold">Alasan</label>
                     <select 
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 rounded-xl text-sm appearance-none"
                     >
                        <option>Kualitas Makanan Buruk</option>
                        <option>Lokasi Tidak Ditemukan</option>
                        <option>Lainnya</option>
                     </select>
                  </div>
                  <textarea 
                     value={desc} onChange={(e) => setDesc(e.target.value)}
                     className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 rounded-xl text-sm h-32"
                     placeholder="Jelaskan masalah secara detail..."
                  />
               </div>
            </Section>
            <Button className="w-full bg-rose-500 hover:bg-rose-600 rounded-2xl" isLoading={isSending} onClick={handleSubmit}>Kirim Laporan</Button>
         </ScrollableContent>
         <Snackbar message="Laporan terkirim!" isVisible={showSuccess} onClose={() => setShowSuccess(false)} />
      </ScreenLayout>
   );
};
