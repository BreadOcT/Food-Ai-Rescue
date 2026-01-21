
import React from 'react';
import { FiturProps } from '../types';
import { ScreenLayout, Header, ScrollableContent, Section, Card, Input, Button } from './ui';

// File ini sedang dalam tahap dekomposisi. 
// Komponen utama telah dipindah ke folder Penerima, Mitra, dan Umum.

export const ChangePasswordScreen: React.FC<FiturProps> = ({ goBack }) => (
  <ScreenLayout>
    <Header title="Ganti Kata Sandi" onBack={goBack} />
    <ScrollableContent>
      <div className="space-y-4">
        <Input label="Kata Sandi Lama" type="password" placeholder="••••••••" />
        <Input label="Kata Sandi Baru" type="password" placeholder="••••••••" />
        <Input label="Konfirmasi Kata Sandi Baru" type="password" placeholder="••••••••" />
        <Button className="w-full mt-6">Simpan Sandi Baru</Button>
      </div>
    </ScrollableContent>
  </ScreenLayout>
);

export const NotificationSettingsScreen: React.FC<FiturProps> = ({ goBack }) => (
  <ScreenLayout>
    <Header title="Pengaturan Notifikasi" onBack={goBack} />
    <ScrollableContent>
      <Section title="Pesan & Update">
        <div className="space-y-3">
          {['Notifikasi Push', 'Email Penawaran'].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
              <span className="font-bold text-sm">{item}</span>
              <button className="w-11 h-6 bg-primary rounded-full relative"><div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5" /></button>
            </div>
          ))}
        </div>
      </Section>
    </ScrollableContent>
  </ScreenLayout>
);

export const AddAddressScreen: React.FC<FiturProps> = ({ goBack }) => (
  <ScreenLayout>
    <Header title="Tambah Alamat" onBack={goBack} />
    <ScrollableContent>
      <div className="space-y-4">
        <Input label="Nama Alamat" placeholder="Rumah, Kantor, dll" />
        <Input label="Alamat Lengkap" placeholder="Jl. Raya No. 123..." />
        <Button className="w-full mt-6">Simpan Alamat</Button>
      </div>
    </ScrollableContent>
  </ScreenLayout>
);
