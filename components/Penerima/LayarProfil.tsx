
import React from 'react';
import { Bookmark, History, Star } from 'lucide-react';
import { FiturProps, ScreenName } from '../../types';
import { ScreenLayout, ScrollableContent, ListItem, Section, Badge } from '../ui';
import { LayarBantuan, LayarLogout } from '../Umum/LayarShared';

export const LayarProfilPenerima: React.FC<FiturProps> = ({ navigate, toggleTheme, isDarkMode, globalState, onLogout }) => {
  const user = globalState.user || { name: 'User', email: 'user@example.com', avatar: '', role: 'USER' };
  
  return (
    <ScreenLayout>
      <div className="p-6 pb-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">Profil Saya</h1>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm shrink-0">
            <img src={user.avatar || 'https://ui-avatars.com/api/?name=' + user.name} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50 truncate">{user.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
            <Badge color="blue" className="mt-1">Penerima</Badge>
          </div>
        </div>
      </div>
      <ScrollableContent className="p-0 px-2 pt-0 pb-28">
         <Section title="Aktivitas Saya" className="px-4">
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-50 dark:divide-slate-800/50 shadow-sm">
               <ListItem icon={<Bookmark size={20} className="text-blue-500" />} title="Tersimpan" onClick={() => navigate('SAVED_ITEMS')} />
               <ListItem icon={<History size={20} className="text-orange-500" />} title="Riwayat Pesanan" onClick={() => navigate('HISTORY')} />
               <ListItem icon={<Star size={20} className="text-yellow-500" />} title="Riwayat Rating" onClick={() => navigate('RATING_HISTORY')} />
            </div>
         </Section>
         {/* Shared Settings & Help */}
         <LayarBantuan navigate={navigate} isDarkMode={!!isDarkMode} toggleTheme={toggleTheme!} />
         <LayarLogout onLogout={onLogout!} navigate={navigate} />
      </ScrollableContent>
    </ScreenLayout>
  );
};
