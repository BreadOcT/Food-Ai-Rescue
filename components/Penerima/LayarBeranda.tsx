
import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { FiturProps } from '../../types';
import { ScreenLayout, ScrollableContent } from '../ui';
import { HomeHeader, HomeSearch, CategoryTabs, HomePromoBanner, FoodFeedCard } from '../HomeComponents';

const calculateMatchScore = (item: any) => {
  let score = 0;
  const distance = parseFloat(item.distance.split(' ')[0]);
  if (distance < 1.0) score += 50;
  else if (distance < 3.0) score += 30;
  else score += 10;
  if (item.timeLeft.includes("20:00") || item.timeLeft.includes("21:00")) score += 40;
  const qty = parseInt(item.quantity.split(' ')[0]);
  if (qty < 3) score += 15;
  if (item.rating && item.rating >= 4.8) score += 20;
  return score;
};

// Add onRefresh and isRefreshing props
export const LayarBeranda: React.FC<FiturProps & { onRefresh?: () => void; isRefreshing?: boolean }> = ({ navigate, setGlobalState, globalState, onRefresh, isRefreshing }) => {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const savedItems = globalState.savedItems || [];
  const user = globalState.user || { name: 'User', avatar: 'https://picsum.photos/100/100?random=1' };

  const rawInventory = globalState.partnerInventory || [];
  
  const allFoodFeed = rawInventory.map((item: any) => ({
    id: item.id,
    partner: item.partnerName || "Mitra Food Rescue",
    status: item.status || "Buka",
    foodName: item.name,
    distance: item.distance || "0.5 km",
    timeLeft: `Hari ini, s/d ${item.serviceEnd || '21:00'}`,
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
    mapsUrl: item.mapsUrl
  }));

  const toggleSave = (id: number) => {
    const newSaved = savedItems.includes(id) ? savedItems.filter((i: number) => i !== id) : [...savedItems, id];
    setGlobalState('savedItems', newSaved);
  };

  const filteredFeed = activeCategory === 'Semua' 
    ? allFoodFeed 
    : activeCategory === 'Tersimpan' 
      ? allFoodFeed.filter((item: any) => savedItems.includes(item.id)) 
      : allFoodFeed.filter((item: any) => item.category === activeCategory);
  
  const processedFeed = filteredFeed
    .map((item: any) => ({ ...item, matchScore: calculateMatchScore(item) }))
    .sort((a: any, b: any) => b.matchScore - a.matchScore);

  return (
    <ScreenLayout bgClass="bg-slate-50 dark:bg-slate-950">
      <div className="p-6 pb-2 bg-white dark:bg-slate-900 shrink-0 z-20 shadow-sm relative transition-colors duration-300">
        <HomeHeader 
          user={user} 
          locationName={globalState.currentLocationName || 'Jakarta Pusat'} 
          onProfileClick={() => navigate('PROFILE')} 
          onLocationClick={() => navigate('LOCATION_SELECT')} 
          onNotificationClick={() => navigate('NOTIFICATIONS')}
          onRefresh={onRefresh} // Pass refresh handler
          isRefreshing={isRefreshing}
        />
        <HomeSearch onSearchClick={() => navigate('EXPLORE')} onFilterClick={() => navigate('EXPLORE')} />
        <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} onMoreClick={() => {}} />
      </div>
      <ScrollableContent className="p-6 pt-2 pb-28">
        <HomePromoBanner onMapClick={() => navigate('MAP_VIEW')} onRequestClick={() => navigate('CREATE_REQUEST')} />
        
        {processedFeed.length > 0 ? (
          <div className="space-y-5 mt-6">
             {processedFeed.map((item: any) => (
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
          <div className="text-center py-20">
             <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
               <Bookmark size={24} className="text-slate-300" />
             </div>
             <p className="text-slate-500 text-sm font-medium">Belum ada makanan tersedia.</p>
             {onRefresh && <button onClick={onRefresh} className="text-primary text-xs font-bold mt-2 hover:underline">Refresh Data</button>}
          </div>
        )}
      </ScrollableContent>
    </ScreenLayout>
  );
};
