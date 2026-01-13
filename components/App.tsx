
import React, { useState, useEffect } from 'react';
import { Home, CheckCircle, User as UserIcon, Store, FileText, BarChart3, Users, ShieldCheck } from 'lucide-react';
import { ScreenName } from '../types';
import { LoginScreen, SignupScreen, ForgotPasswordScreen, VerificationScreen, NewPasswordScreen } from './components/AuthScreens';
import { HomeScreen, UserProfileScreen, PartnerProfileScreen, NotificationScreen, EditProfileScreen, ChangePasswordScreen, NotificationSettingsScreen, AddAddressScreen, HelpScreen } from './components/AppScreens';
import { QualityCheckScreen } from './components/QualityCheck';
import { PartnerDashboard, PartnerTransactions, UploadProduct, SuccessScreen, PartnerInventory } from './components/PartnerScreens';
import { AdminDashboard, AdminUsers, AdminProducts, AdminReports, AdminSettings, AdminSidebar } from './components/AdminScreens';
import { MapViewScreen, PartnerDetailScreen, ImpactReportScreen, ReservationSuccessScreen, ReservationFormScreen, HistoryScreen, ExploreScreen, LocationSelectScreen, CreateRequestScreen } from './components/UserFeatureScreens';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('LOGIN');
  const [userMode, setUserMode] = useState<'USER' | 'PARTNER' | 'ADMIN'>('USER');
  const [history, setHistory] = useState<ScreenName[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // GLOBAL STATE INITIALIZATION
  const [globalState, setGlobalState] = useState<any>({
    user: { name: 'Budi Santoso', email: 'user@gmail.com', phone: '+62 812-3456-7890', avatar: 'https://picsum.photos/200/200?random=1', role: 'USER' },
    savedItems: [],
    qualityHistory: [],
    partnerInventory: [
      { 
        id: 1, 
        name: "Roti Manis & Donat Sisa Produksi", 
        partnerName: "Bakery Pagi Sore", 
        partnerAvatar: "https://picsum.photos/100/100?random=1",
        status: "Buka", 
        distance: "0.5 km",
        serviceStart: "17:00",
        serviceEnd: "21:00",
        amountValue: 5, 
        amountUnit: "Paket",
        category: "Roti & Kue",
        image: "https://picsum.photos/400/200?random=101", 
        deliveryType: 'pickup',
        description: "Roti sisa produksi hari ini, masih sangat lembut dan layak konsumsi.",
        ingredients: "Tepung, Gula, Telur, Mentega",
        qualityPercentage: 95,
        rating: 4.8,
        mapsUrl: "https://maps.app.goo.gl/ZnsLWRaiSVxhdc648" // Link yang Anda berikan
      },
      { 
        id: 2, 
        name: "Nasi Lauk Campur (Layak Makan)", 
        partnerName: "Restoran Padang Murah", 
        partnerAvatar: "https://picsum.photos/100/100?random=2",
        status: "Buka", 
        distance: "1.2 km",
        serviceStart: "15:00",
        serviceEnd: "17:00",
        amountValue: 2, 
        amountUnit: "Porsi",
        category: "Makanan Berat",
        image: "https://picsum.photos/400/200?random=102", 
        deliveryType: 'delivery',
        description: "Nasi dengan lauk ayam dan sayur nangka sisa makan siang.",
        ingredients: "Nasi, Ayam, Santan, Cabai, Nangka",
        qualityPercentage: 88,
        rating: 4.5,
        mapsUrl: "https://maps.app.goo.gl/ZnsLWRaiSVxhdc648"
      },
      { 
        id: 3, 
        name: "Paket Buah Potong & Jus", 
        partnerName: "Toko Buah Segar Jaya", 
        partnerAvatar: "https://picsum.photos/100/100?random=3",
        status: "Buka", 
        distance: "2.0 km",
        serviceStart: "16:00",
        serviceEnd: "19:00",
        amountValue: 8, 
        amountUnit: "Paket",
        category: "Sayur & Buah",
        image: "https://picsum.photos/400/200?random=103", 
        deliveryType: 'pickup',
        description: "Buah potong segar yang sudah dipotong namun belum terjual.",
        ingredients: "Semangka, Melon, Nanas",
        qualityPercentage: 92,
        rating: 4.9,
        mapsUrl: "https://maps.app.goo.gl/ZnsLWRaiSVxhdc648"
      },
      { 
        id: 4, 
        name: "Es Kopi Susu Gula Aren", 
        partnerName: "Kopi Senja", 
        partnerAvatar: "https://picsum.photos/100/100?random=4",
        status: "Buka", 
        distance: "0.8 km",
        serviceStart: "20:00",
        serviceEnd: "22:00",
        amountValue: 4, 
        amountUnit: "Cup",
        category: "Minuman",
        image: "https://picsum.photos/400/200?random=104", 
        deliveryType: 'delivery',
        description: "Kopi susu gula aren salah buat order, kondisi masih tertutup rapat.",
        ingredients: "Kopi, Susu, Gula Aren",
        qualityPercentage: 100,
        rating: 4.7,
        mapsUrl: "https://maps.app.goo.gl/ZnsLWRaiSVxhdc648"
      }
    ], 
    currentLocationName: 'Jakarta Pusat',
    addresses: [
      { id: 1, title: 'Rumah', desc: 'Jl. Melati No. 12, Jakarta Selatan', type: 'home', receiver: 'Budi Santoso', phone: '+62 812-3456-7890' },
      { id: 2, title: 'Kantor', desc: 'Gedung Pencakar Langit Lt. 5, Jakarta Pusat', type: 'office', receiver: 'Budi Santoso', phone: '+62 812-3456-7890' }
    ],
    historyItems: [
      { id: 101, name: "Bakery Pagi Sore", item: "5x Roti Manis", date: "28 Okt 2024", price: "Rp 25.000", status: "Selesai", type: 'pickup', img: 1 },
      { id: 104, name: "Sate Khas Senayan", item: "10 Tusuk Sate", date: "Hari ini", price: "Rp 50.000", status: "Dikemas", type: 'delivery', img: 4 }
    ]
  });

  const navigate = (screen: ScreenName) => {
    setHistory((prev) => [...prev, currentScreen]);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    setHistory((prev) => {
      const newHistory = [...prev];
      const previousScreen = newHistory.pop();
      if (previousScreen) {
        setCurrentScreen(previousScreen);
      }
      return newHistory;
    });
  };

  const updateGlobalState = (key: string, value: any) => {
     setGlobalState((prev: any) => ({ ...prev, [key]: value }));
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // --- ADMIN DESKTOP LAYOUT ---
  if (userMode === 'ADMIN') {
    const renderAdminContent = () => {
      switch (currentScreen) {
        case 'ADMIN_DASHBOARD': return <AdminDashboard navigate={setCurrentScreen} />;
        case 'ADMIN_USERS': return <AdminUsers navigate={setCurrentScreen} />;
        case 'ADMIN_PRODUCTS': return <AdminProducts navigate={setCurrentScreen} />;
        case 'ADMIN_REPORTS': return <AdminReports navigate={setCurrentScreen} />;
        case 'ADMIN_SETTINGS': return <AdminSettings navigate={setCurrentScreen} />;
        default: return <AdminDashboard navigate={setCurrentScreen} />;
      }
    };

    return (
      <div className={`flex min-h-screen font-sans ${isDarkMode ? 'dark bg-gray-950 text-white' : 'bg-gray-50 text-slate-800'}`}>
        <AdminSidebar 
          currentScreen={currentScreen} 
          navigate={setCurrentScreen} 
          onLogout={() => {
            setUserMode('USER');
            setCurrentScreen('LOGIN');
            setHistory([]);
          }}
        />
        <main className="flex-1 p-8 overflow-y-auto h-screen">
          {renderAdminContent()}
        </main>
      </div>
    );
  }

  // --- MOBILE LAYOUT (USER & PARTNER) ---
  const renderMobileScreen = () => {
    const props = {
      navigate,
      goBack,
      globalState,
      setGlobalState: updateGlobalState,
      isDarkMode,
      toggleTheme,
      onLogout: () => {
        // Reset state aplikasi
        setUserMode('USER');
        setCurrentScreen('LOGIN');
        setHistory([]);
        // Reset data user di global state agar bersih saat login kembali
        updateGlobalState('user', { name: '', email: '', role: 'USER', avatar: '' });
      }
    };

    switch (currentScreen) {
      case 'LOGIN': return <LoginScreen navigate={navigate} onLoginSuccess={(role) => { updateGlobalState('user', { ...globalState.user, role }); setUserMode(role); setHistory([]); setCurrentScreen(role === 'ADMIN' ? 'ADMIN_DASHBOARD' : role === 'PARTNER' ? 'PARTNER_DASHBOARD' : 'HOME'); }} />;
      case 'SIGNUP': return <SignupScreen navigate={navigate} />;
      case 'FORGOT_PASSWORD': return <ForgotPasswordScreen navigate={navigate} />;
      case 'VERIFICATION': return <VerificationScreen navigate={navigate} />;
      case 'NEW_PASSWORD': return <NewPasswordScreen navigate={navigate} />;
      
      case 'HOME': return <HomeScreen {...props} />;
      case 'PROFILE': return <UserProfileScreen {...props} />;
      case 'EDIT_PROFILE': return <EditProfileScreen {...props} />;
      case 'CHANGE_PASSWORD': return <ChangePasswordScreen {...props} />;
      case 'NOTIFICATION_SETTINGS': return <NotificationSettingsScreen {...props} />;
      case 'ADD_ADDRESS': return <AddAddressScreen {...props} />;
      case 'CHECK_QUALITY': return <QualityCheckScreen {...props} />;
      case 'NOTIFICATIONS': return <NotificationScreen {...props} />;
      case 'HELP_FAQ': return <HelpScreen {...props} />;
      case 'MAP_VIEW': return <MapViewScreen {...props} />;
      case 'PARTNER_DETAIL': return <PartnerDetailScreen {...props} />;
      case 'RESERVATION_FORM': return <ReservationFormScreen {...props} />;
      case 'RESERVATION_SUCCESS': return <ReservationSuccessScreen {...props} />;
      case 'IMPACT_REPORT': return <ImpactReportScreen {...props} />;
      case 'HISTORY': return <HistoryScreen {...props} />;
      case 'EXPLORE': return <ExploreScreen {...props} />;
      case 'LOCATION_SELECT': return <LocationSelectScreen {...props} />;
      case 'CREATE_REQUEST': return <CreateRequestScreen {...props} />;
      
      case 'PARTNER_DASHBOARD': return <PartnerDashboard navigate={navigate} globalState={globalState} setGlobalState={updateGlobalState} />;
      case 'PARTNER_INVENTORY': return <PartnerInventory navigate={navigate} globalState={globalState} setGlobalState={updateGlobalState} />;
      case 'TRANSACTIONS': return <PartnerTransactions navigate={navigate} globalState={globalState} setGlobalState={updateGlobalState} />;
      case 'UPLOAD_PRODUCT': return <UploadProduct navigate={navigate} globalState={globalState} setGlobalState={updateGlobalState} />;
      case 'SUCCESS': return <SuccessScreen navigate={navigate} globalState={globalState} setGlobalState={updateGlobalState} />;
      
      default: return <LoginScreen navigate={navigate} />;
    }
  };

  const isMainMobileScreen = [
    'HOME', 'PROFILE', 'CHECK_QUALITY', 
    'PARTNER_DASHBOARD', 'PARTNER_INVENTORY', 'TRANSACTIONS'
  ].includes(currentScreen);

  return (
    <div className={`min-h-screen bg-gray-100 flex items-center justify-center p-0 md:p-4 font-sans ${isDarkMode ? 'dark' : ''}`}>
      <div className={`w-full h-[100dvh] md:h-[844px] md:w-[390px] bg-white md:rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col text-slate-900 dark:text-white transition-colors duration-300`}>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative bg-white dark:bg-gray-900 transition-colors duration-300">
          {renderMobileScreen()}
        </div>

        {/* Bottom Navigation */}
        {isMainMobileScreen && (
          <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 px-4 py-4 flex justify-evenly items-center z-50 rounded-t-2xl shadow-[0_-5px_10px_rgba(0,0,0,0.02)] transition-colors duration-300">
             {userMode === 'USER' && (
               <>
                 <button 
                   onClick={() => { setHistory([]); setCurrentScreen('HOME'); }}
                   className={`flex flex-col items-center gap-1 transition-colors min-w-[64px] ${currentScreen === 'HOME' ? 'text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                 >
                   <Home size={24} strokeWidth={currentScreen === 'HOME' ? 2.5 : 2} />
                   <span className="text-[10px] font-medium">Beranda</span>
                 </button>
                 
                 <button 
                   onClick={() => { setHistory([]); setCurrentScreen('CHECK_QUALITY'); }}
                   className={`flex flex-col items-center gap-1 transition-colors min-w-[64px] ${currentScreen === 'CHECK_QUALITY' ? 'text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                 >
                   <CheckCircle size={24} strokeWidth={currentScreen === 'CHECK_QUALITY' ? 2.5 : 2} />
                   <span className="text-[10px] font-medium">Cek Kualitas</span>
                 </button>
                 
                 <button 
                   onClick={() => { setHistory([]); setCurrentScreen('PROFILE'); }}
                   className={`flex flex-col items-center gap-1 transition-colors min-w-[64px] ${currentScreen === 'PROFILE' ? 'text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                 >
                   <UserIcon size={24} strokeWidth={currentScreen === 'PROFILE' ? 2.5 : 2} />
                   <span className="text-[10px] font-medium">Profil</span>
                 </button>
               </>
             )}

             {userMode === 'PARTNER' && (
               <>
                 <button 
                   onClick={() => { setHistory([]); setCurrentScreen('PARTNER_DASHBOARD'); }}
                   className={`flex flex-col items-center gap-1 transition-colors min-w-[64px] ${currentScreen === 'PARTNER_DASHBOARD' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   <Home size={24} strokeWidth={currentScreen === 'PARTNER_DASHBOARD' ? 2.5 : 2} />
                   <span className="text-[10px] font-medium">Beranda</span>
                 </button>
                 
                 <button 
                   onClick={() => { setHistory([]); setCurrentScreen('TRANSACTIONS'); }}
                   className={`flex flex-col items-center gap-1 transition-colors min-w-[64px] ${currentScreen === 'TRANSACTIONS' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   <FileText size={24} strokeWidth={currentScreen === 'TRANSACTIONS' ? 2.5 : 2} />
                   <span className="text-[10px] font-medium">Transaksi</span>
                 </button>
                 
                 <button 
                   onClick={() => { setHistory([]); setCurrentScreen('PARTNER_INVENTORY'); }}
                   className={`flex flex-col items-center gap-1 transition-colors min-w-[64px] ${currentScreen === 'PARTNER_INVENTORY' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   <Store size={24} strokeWidth={currentScreen === 'PARTNER_INVENTORY' ? 2.5 : 2} />
                   <span className="text-[10px] font-medium">Mitra</span>
                 </button>
                 
                 <button 
                   onClick={() => { setHistory([]); setCurrentScreen('PROFILE'); }}
                   className={`flex flex-col items-center gap-1 transition-colors min-w-[64px] ${currentScreen === 'PROFILE' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   <UserIcon size={24} strokeWidth={currentScreen === 'PROFILE' ? 2.5 : 2} />
                   <span className="text-[10px] font-medium">Profil</span>
                 </button>
               </>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
