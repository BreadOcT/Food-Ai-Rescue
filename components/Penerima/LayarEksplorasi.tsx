
import React, { useState } from 'react';
import { Search, Bookmark, Check, Trash2, ChevronLeft, Filter } from 'lucide-react';
import { FiturProps } from '../../types';
import { ScreenLayout, ScrollableContent, Input, Snackbar, Button } from '../ui';
import { FoodFeedCard, CategoryTabs } from '../HomeComponents';
import { dbSyncSavedItems } from '../../services/databaseService';

export const LayarEksplorasi: React.FC<FiturProps & { viewMode?: 'ALL' | 'SAVED' }> = ({ navigate, goBack, globalState, setGlobalState, viewMode = 'ALL' }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const inventory = globalState.partnerInventory || [];
  const savedItems = globalState.savedItems || [];

  const filteredItems = inventory.filter((item: any) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.partnerName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'Semua' || item.category === activeCategory;
    
    if (viewMode === 'SAVED') return matchesSearch && matchesCategory && savedItems.includes(item.id);
    return matchesSearch && matchesCategory;
  });

  const toggleSave = async (id: number) => {
    const newSaved = savedItems.includes(id) ? savedItems.filter((i: number) => i !== id) : [...savedItems, id];
    setGlobalState('savedItems', newSaved);
    setSnackbar({ 
      visible: true, 
      message: savedItems.includes(id) ? 'Dihapus dari favorit' : 'Disimpan ke favorit' 
    });

    // Sync to DB
    if (globalState.user) {
       await dbSyncSavedItems(globalState.user.email, newSaved);
    }
  };

  const handleDeleteSelected = async () => {
    const newSaved = savedItems.filter((id: number) => !selectedIds.includes(id));
    setGlobalState('savedItems', newSaved);
    setSelectedIds([]);
    setIsSelectionMode(false);
    setSnackbar({ visible: true, message: 'Item favorit berhasil dihapus' });

    // Sync to DB
    if (globalState.user) {
       await dbSyncSavedItems(globalState.user.email, newSaved);
    }
  };

  return (
    <ScreenLayout>
      <div className="p-6 pb-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0 z-30 shadow-sm transition-colors">
         <div className="flex items-center gap-3 mb-4">
            {!isSelectionMode ? <button onClick={goBack} className="text-slate-500"><ChevronLeft size={24}/></button> : 
            <button onClick={() => {
               if(selectedIds.length === filteredItems.length) setSelectedIds([]);
               else setSelectedIds(filteredItems.map((i: any) => i.id));
            }} className="text-xs font-black text-primary uppercase">Pilih Semua</button>}
            
            <div className="flex-1">
               <Input 
                  placeholder={viewMode === 'SAVED' ? "Cari di favorit..." : "Cari makanan..."} 
                  value={search} 
                  onChange={(e:any) => setSearch(e.target.value)} 
                  icon={<Search size={18} className="text-slate-400" />} 
                  className="h-11 border-none bg-slate-50 dark:bg-slate-800/50"
                  containerClassName="!space-y-0"
               />
            </div>

            {viewMode === 'SAVED' && filteredItems.length > 0 && (
               <button onClick={() => { setIsSelectionMode(!isSelectionMode); setSelectedIds([]); }} className="text-xs font-black text-slate-500 uppercase tracking-tighter">
                  {isSelectionMode ? 'Batal' : 'Kelola'}
               </button>
            )}
         </div>
         
         {/* Filter Kategori Tambahan */}
         <div className="px-1">
            <CategoryTabs 
               activeCategory={activeCategory} 
               onCategoryChange={setActiveCategory} 
               onMoreClick={() => {}} 
            />
         </div>
      </div>

      <ScrollableContent className="p-4">
         <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item: any) => (
               <div key={item.id} className="relative h-full">
                  {isSelectionMode && (
                     <div className={`absolute inset-0 z-30 rounded-2xl cursor-pointer ${selectedIds.includes(item.id) ? 'bg-primary/10 ring-2 ring-primary' : 'bg-transparent'}`} 
                          onClick={() => selectedIds.includes(item.id) ? setSelectedIds(selectedIds.filter(i => i !== item.id)) : setSelectedIds([...selectedIds, item.id])}>
                        <div className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center border-2 ${selectedIds.includes(item.id) ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-slate-200 shadow-sm'}`}>
                           {selectedIds.includes(item.id) && <Check size={14} strokeWidth={4} />}
                        </div>
                     </div>
                  )}
                  <FoodFeedCard 
                     isGrid={true}
                     item={{...item, foodName: item.name, partner: item.partnerName, timeLeft: `${item.serviceStart} - ${item.serviceEnd}`, quantity: `${item.amountValue} ${item.amountUnit}`, avatar: item.partnerAvatar}} 
                     isSaved={savedItems.includes(item.id)}
                     onSaveToggle={isSelectionMode ? undefined : toggleSave}
                     onClick={() => !isSelectionMode && (setGlobalState('reservationItem', item), navigate('PARTNER_DETAIL'))}
                     onActionClick={() => !isSelectionMode && (setGlobalState('reservationItem', item), navigate('RESERVATION_FORM'))}
                  />
               </div>
            ))}
         </div>
         {filteredItems.length === 0 && (
            <div className="text-center py-24">
               <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bookmark size={28} className="text-slate-300" />
               </div>
               <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Item tidak ditemukan</p>
            </div>
         )}
         <div className="h-24" />
      </ScrollableContent>

      {isSelectionMode && selectedIds.length > 0 && (
         <div className="absolute bottom-6 left-0 w-full px-6 z-40 animate-in slide-in-from-bottom-4">
            <Button className="w-full bg-rose-500 hover:bg-rose-600 rounded-2xl h-14 shadow-xl shadow-rose-500/20 font-black uppercase tracking-widest" onClick={handleDeleteSelected}>
               <Trash2 size={20} className="mr-2" /> Hapus Favorit ({selectedIds.length})
            </Button>
         </div>
      )}
      <Snackbar isVisible={snackbar.visible} message={snackbar.message} onClose={() => setSnackbar({...snackbar, visible: false})} />
    </ScreenLayout>
  );
};
