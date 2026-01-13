
import React, { useState } from 'react';
import { X, MapPin, HelpCircle, ExternalLink } from 'lucide-react';
import { Button, Card } from './ui';

export const ManualLocationForm: React.FC<any> = ({ 
  formData, 
  setFormData, 
  onSave, 
  onCancel 
}) => {
  const [showHelp, setShowHelp] = useState(false);

  const openGoogleMaps = () => {
    window.open("https://www.google.com/maps", "_blank");
  };

  return (
    <>
      <Card className="p-5 animate-in slide-in-from-top-2 border-primary/20 bg-white dark:bg-gray-800/50 shadow-md">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">Lokasi Pengiriman</h4>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
        </div>
        
        <div className="space-y-5">
          {/* Google Maps Link Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
               <label className="text-sm font-semibold text-slate-900 dark:text-slate-200">Titik Lokasi (Link Google Maps)</label>
               <button 
                 onClick={() => setShowHelp(true)}
                 className="text-[10px] flex items-center gap-1 text-primary font-bold hover:underline"
               >
                 <HelpCircle size={12} /> Cara menyalin link?
               </button>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
               <button 
                 onClick={openGoogleMaps}
                 className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all active:scale-95"
               >
                 <MapPin size={16} className="text-red-500" />
                 Buka Aplikasi Google Maps
               </button>
               
               <div className="relative">
                 <input 
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all text-sm placeholder:text-slate-400"
                    placeholder="Tempel (Paste) link Google Maps di sini..."
                    value={formData.fullAddress}
                    onChange={e => setFormData({...formData, fullAddress: e.target.value})}
                 />
                 <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               </div>
            </div>
          </div>

          <Button className="w-full font-bold shadow-lg" onClick={onSave}>Simpan Alamat</Button>
        </div>
      </Card>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
              <button onClick={() => setShowHelp(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"><X size={18}/></button>
              
              <div className="text-center mb-6">
                 <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
                    <MapPin size={24} />
                 </div>
                 <h3 className="font-bold text-lg text-slate-900">Cara Menyalin Link</h3>
              </div>

              <div className="space-y-4">
                 <div className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-900 shrink-0 mt-0.5">1</div>
                    <div>
                       <p className="text-sm font-bold text-slate-900">Buka Google Maps</p>
                       <p className="text-xs text-slate-500 mt-1">Cari alamat Anda atau tekan lama pada peta untuk menandai titik lokasi.</p>
                    </div>
                 </div>
                 <div className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-900 shrink-0 mt-0.5">2</div>
                    <div>
                       <p className="text-sm font-bold text-slate-900">Bagikan Lokasi</p>
                       <p className="text-xs text-slate-500 mt-1">Ketuk nama lokasi di bagian bawah, lalu pilih menu <span className="font-bold text-slate-700">Share (Bagikan)</span>.</p>
                    </div>
                 </div>
                 <div className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-900 shrink-0 mt-0.5">3</div>
                    <div>
                       <p className="text-sm font-bold text-slate-900">Salin & Tempel</p>
                       <p className="text-xs text-slate-500 mt-1">Pilih <span className="font-bold text-slate-700">Copy to clipboard (Salin)</span> lalu tempelkan pada kolom input di aplikasi ini.</p>
                    </div>
                 </div>
              </div>

              <Button className="w-full mt-8" onClick={() => setShowHelp(false)}>Saya Mengerti</Button>
           </div>
        </div>
      )}
    </>
  );
};
