
import React, { useRef } from 'react';
import { Camera, Mail, Phone } from 'lucide-react';
import { Input, Button } from './ui';

export const ProfileAvatarUploader: React.FC<any> = ({ avatar, onAvatarChange }) => {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => onAvatarChange(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center mb-10">
      <div 
        className="w-24 h-24 rounded-full bg-slate-100 overflow-hidden relative group border-4 border-white shadow-md cursor-pointer"
        onClick={() => avatarInputRef.current?.click()}
      >
        <img src={avatar} className="w-full h-full object-cover" alt="Profile" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
          <Camera size={28} />
        </div>
        <input 
          type="file" 
          ref={avatarInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
      </div>
      <p className="text-[10px] text-primary font-bold mt-2 uppercase tracking-widest cursor-pointer" onClick={() => avatarInputRef.current?.click()}>Ubah Foto</p>
    </div>
  );
};

export const PhoneInputModule: React.FC<any> = ({ value, onChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Validasi & Automasi numerik (Backend-style verification in frontend)
    let val = e.target.value.replace(/[^\d]/g, '');
    if (val.length > 3 && val.length <= 7) {
      val = val.slice(0, 3) + '-' + val.slice(3);
    } else if (val.length > 7) {
      val = val.slice(0, 3) + '-' + val.slice(3, 7) + '-' + val.slice(7, 11);
    }
    onChange(val);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-900 block">Nomor WhatsApp</label>
      <div className="flex items-center gap-2">
        <div className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-500 font-bold text-sm select-none">
          +62
        </div>
        <div className="relative flex-1">
          <input 
            type="text" 
            inputMode="numeric"
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm placeholder:text-slate-300 placeholder:font-normal"
            placeholder="852-XXXX-XXXX"
            value={value}
            onChange={handleInputChange}
            maxLength={13}
          />
        </div>
      </div>
      <p className="text-[10px] text-slate-400 px-1">Gunakan nomor aktif untuk koordinasi penjemputan.</p>
    </div>
  );
};
