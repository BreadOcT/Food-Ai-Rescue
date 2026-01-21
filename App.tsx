
import React, { useState, useEffect } from 'react';
import { Home, User as UserIcon, Store, FileText, Loader2 } from 'lucide-react';
import { ScreenName, User, Product, Order, Review, Notification, Report } from './types';

// Auth
import { LoginScreen, SignupScreen, ForgotPasswordScreen, VerificationScreen, NewPasswordScreen } from './components/AuthScreens';

// Domain: Penerima (Localized)
import { LayarBeranda } from './components/Penerima/LayarBeranda';
import { LayarProfilPenerima } from './components/Penerima/LayarProfil';
import { LayarEksplorasi } from './components/Penerima/LayarEksplorasi';
import { LayarDetailMitra, LayarFormReservasi, LayarSuksesReservasi } from './components/Penerima/LayarDetailDanReservasi';
import { LayarRiwayatPesanan, LayarRiwayatUlasan, LayarLaporanDampak } from './components/Penerima/LayarAktivitas';
import { LayarPilihLokasi, LayarBuatPermintaan, LayarPeta } from './components/Penerima/LayarLokasiDanRequest';
import { LayarLaporProduk } from './components/Penerima/LayarLaporan';

// Domain: Mitra
import { LayarProfilMitra } from './components/Mitra/LayarProfil';
import { LayarDashboardMitra, LayarTransaksiMitra } from './components/Mitra/LayarDashboard';
import { LayarInventoryMitra, LayarUploadProduk, LayarBerhasilUpload } from './components/Mitra/LayarInventory';
import { LayarQualityCheck } from './components/Mitra/LayarQualityCheck';

// Domain: Admin
import { LayarDashboardAdmin, LayarPengaturanSistem, SidebarAdmin } from './components/Admin/LayarUtama';
import { LayarModerasiLaporan, LayarKelolaPengguna, LayarKelolaProduk } from './components/Admin/LayarManajemen';

// Shared
import { LayarEditProfil, LayarNotifikasi, LayarFAQ } from './components/Umum/LayarShared';
import { ChangePasswordScreen, NotificationSettingsScreen, AddAddressScreen } from './components/AppScreens'; 
import { 
  dbFetchInventory, 
  dbFetchReviews, 
  dbFetchHistory, 
  dbFetchReports, 
  dbFetchAddresses, 
  dbFetchAllUsers,
  dbFetchNotifications,
  dbFetchSavedItems
} from './services/databaseService';

// --- INITIAL GLOBAL STATE (EMPTY) ---
// Semua data sekarang dimulai dari kosong dan akan diisi oleh fetch dari Database.

const INITIAL_GLOBAL_STATE = {
  user: null, 
  savedItems: [],
  qualityHistory: [],
  reviews: [], 
  partnerInventory: [], 
  currentLocationName: 'Jakarta Pusat',
  addresses: [],
  historyItems: [],
  reports: [], 
  allUsers: [], 
  notifications: [] 
};

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('LOGIN');
  const [userMode, setUserMode] = useState<'USER' | 'PARTNER' | 'ADMIN'>('USER');
  const [history, setHistory] = useState<ScreenName[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  
  // Persist Global State
  const [globalState, setGlobalState] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('food_ai_state');
        // Jika ada data tersimpan, gunakan. Jika tidak, gunakan initial state bersih.
        return saved ? JSON.parse(saved) : INITIAL_GLOBAL_STATE;
      } catch (e) {
        console.error("Failed to load state", e);
        return INITIAL_GLOBAL_STATE;
      }
    }
    return INITIAL_GLOBAL_STATE;
  });

  const updateGlobalState = (key: string, value: any) => {
    setGlobalState((prev: any) => {
      const newState = { ...prev, [key]: value };
      localStorage.setItem('food_ai_state', JSON.stringify(newState));
      return newState;
    });
  };

  // STAGE 2-6: Reusable Refresh Function
  const refreshAppState = async () => {
    setIsAppLoading(true);
    try {
      // 1. Ambil Inventory & Review (Public)
      const [inventory, reviews] = await Promise.all([
         dbFetchInventory(),
         dbFetchReviews()
      ]);

      if (inventory && Array.isArray(inventory)) updateGlobalState('partnerInventory', inventory);
      if (reviews && Array.isArray(reviews)) updateGlobalState('reviews', reviews);

      // 2. Data Spesifik User Login
      if (globalState.user) {
        // Fetch History
        const identifier = globalState.user.role === 'USER' ? globalState.user.email : globalState.user.name;
        const historyData = await dbFetchHistory(globalState.user.role, identifier);
        if (historyData && Array.isArray(historyData)) updateGlobalState('historyItems', historyData);

        // Fetch Notifications (All Roles)
        const notifs = await dbFetchNotifications(globalState.user.email);
        if (notifs && Array.isArray(notifs)) updateGlobalState('notifications', notifs);

        // Fetch User Specific Data
        if (globalState.user.role === 'USER') {
           const [addresses, saved] = await Promise.all([
             dbFetchAddresses(globalState.user.email),
             dbFetchSavedItems(globalState.user.email)
           ]);
           if (addresses && Array.isArray(addresses)) updateGlobalState('addresses', addresses);
           if (saved && Array.isArray(saved)) updateGlobalState('savedItems', saved);
        }

        // Fetch Admin Data (Admin Only)
        if (globalState.user.role === 'ADMIN') {
           const [reports, users] = await Promise.all([
             dbFetchReports(),
             dbFetchAllUsers()
           ]);
           if (reports && Array.isArray(reports)) updateGlobalState('reports', reports);
           if (users && Array.isArray(users)) updateGlobalState('allUsers', users);
        }
      }

      return true;
    } catch (error) {
      console.error("Gagal refresh data:", error);
      return false;
    } finally {
      setIsAppLoading(false);
    }
  };

  // Trigger Refresh saat User Login berubah
  useEffect(() => {
    if (globalState.user) {
       refreshAppState();
    }
  }, [globalState.user?.email, globalState.user?.role]);

  // STAGE 1: Fetch Public Data on Mount
  useEffect(() => {
    const initAppData = async () => {
      await refreshAppState();
      
      // Cek login status dari localStorage untuk set screen awal
      if (globalState.user) {
         setUserMode(globalState.user.role || 'USER');
         // Jika user sudah login, arahkan ke Home/Dashboard bukan Login
         if (currentScreen === 'LOGIN') {
           setCurrentScreen(globalState.user.role === 'ADMIN' ? 'ADMIN_DASHBOARD' : globalState.user.role === 'PARTNER' ? 'PARTNER_DASHBOARD' : 'HOME');
         }
      }
    };

    initAppData();
  }, []); // Run once on mount

  const navigate = (screen: ScreenName) => {
    setHistory((prev) => [...prev, currentScreen]);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    setHistory((prev) => {
      const newHistory = [...prev];
      const previousScreen = newHistory.pop();
      if (previousScreen) setCurrentScreen(previousScreen);
      return newHistory;
    });
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  
  const handleLogout = () => { 
    setUserMode('USER'); 
    setCurrentScreen('LOGIN'); 
    setHistory([]); 
    localStorage.removeItem('food_ai_state');
    // Reset ke initial state tapi pertahankan struktur
    setGlobalState(INITIAL_GLOBAL_STATE); 
  };

  // Handle Login Success (memperbarui global state dengan data user dari DB)
  const handleLoginSuccess = (role: 'USER' | 'PARTNER' | 'ADMIN', userData?: any) => {
     // Gunakan data user asli dari database
     updateGlobalState('user', userData || { ...globalState.user, role });
     setUserMode(role);
     setCurrentScreen(role === 'ADMIN' ? 'ADMIN_DASHBOARD' : role === 'PARTNER' ? 'PARTNER_DASHBOARD' : 'HOME');
  };

  if (isAppLoading && currentScreen === 'LOGIN' && !globalState.user) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center gap-4">
             <Loader2 size={40} className="animate-spin text-primary" />
             <p className="text-sm font-bold text-slate-500">Menghubungkan ke Server...</p>
          </div>
       </div>
     );
  }

  if (userMode === 'ADMIN') {
    return (
      <div className={`flex min-h-screen font-sans ${isDarkMode ? 'dark bg-gray-950 text-white' : 'bg-gray-50 text-slate-800'}`}>
        <SidebarAdmin currentScreen={currentScreen} navigate={setCurrentScreen} onLogout={handleLogout} />
        <main className="flex-1 p-8 overflow-y-auto h-screen">
          {(() => {
            switch (currentScreen) {
              case 'ADMIN_DASHBOARD': return <LayarDashboardAdmin globalState={globalState} />;
              case 'ADMIN_USERS': return <LayarKelolaPengguna globalState={globalState} />;
              case 'ADMIN_PRODUCTS': return <LayarKelolaProduk globalState={globalState} />;
              case 'ADMIN_REPORTS': return <LayarModerasiLaporan globalState={globalState} />;
              case 'ADMIN_SETTINGS': return <LayarPengaturanSistem />;
              default: return <LayarDashboardAdmin globalState={globalState} />;
            }
          })()}
        </main>
      </div>
    );
  }

  const commonProps = { navigate, goBack, globalState, setGlobalState: updateGlobalState, isDarkMode, toggleTheme, onLogout: handleLogout };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'LOGIN': return <LoginScreen navigate={navigate} onLoginSuccess={handleLoginSuccess} />;
      case 'SIGNUP': return <SignupScreen navigate={navigate} />;
      case 'FORGOT_PASSWORD': return <ForgotPasswordScreen navigate={navigate} />;
      case 'VERIFICATION': return <VerificationScreen navigate={navigate} />;
      case 'NEW_PASSWORD': return <NewPasswordScreen navigate={navigate} />;
      // Pass refresh function to Home
      case 'HOME': return <LayarBeranda {...commonProps} onRefresh={refreshAppState} isRefreshing={isAppLoading} />;
      case 'PROFILE': return userMode === 'PARTNER' ? <LayarProfilMitra {...commonProps} /> : <LayarProfilPenerima {...commonProps} />;
      case 'EDIT_PROFILE': return <LayarEditProfil {...commonProps} />;
      case 'CHANGE_PASSWORD': return <ChangePasswordScreen {...commonProps} />;
      case 'NOTIFICATION_SETTINGS': return <NotificationSettingsScreen {...commonProps} />;
      case 'ADD_ADDRESS': return <AddAddressScreen {...commonProps} />;
      case 'CHECK_QUALITY': return <LayarQualityCheck {...commonProps} />;
      case 'NOTIFICATIONS': return <LayarNotifikasi goBack={goBack} globalState={globalState} />;
      case 'HELP_FAQ': return <LayarFAQ goBack={goBack} />;
      case 'MAP_VIEW': return <LayarPeta {...commonProps} />;
      case 'PARTNER_DETAIL': return <LayarDetailMitra {...commonProps} />;
      case 'REPORT_PRODUCT': return <LayarLaporProduk {...commonProps} />;
      case 'RESERVATION_FORM': return <LayarFormReservasi {...commonProps} />;
      case 'RESERVATION_SUCCESS': return <LayarSuksesReservasi {...commonProps} />;
      case 'IMPACT_REPORT': return <LayarLaporanDampak {...commonProps} />;
      case 'HISTORY': return <LayarRiwayatPesanan {...commonProps} />;
      case 'RATING_HISTORY': return <LayarRiwayatUlasan {...commonProps} />;
      case 'EXPLORE': return <LayarEksplorasi {...commonProps} viewMode="ALL" />;
      case 'SAVED_ITEMS': return <LayarEksplorasi {...commonProps} viewMode="SAVED" />;
      case 'LOCATION_SELECT': return <LayarPilihLokasi {...commonProps} />;
      case 'CREATE_REQUEST': return <LayarBuatPermintaan {...commonProps} />;
      case 'PARTNER_DASHBOARD': return <LayarDashboardMitra {...commonProps} />;
      case 'PARTNER_INVENTORY': return <LayarInventoryMitra {...commonProps} />;
      case 'TRANSACTIONS': return <LayarTransaksiMitra {...commonProps} />;
      case 'UPLOAD_PRODUCT': return <LayarUploadProduk {...commonProps} />;
      case 'SUCCESS': return <LayarBerhasilUpload {...commonProps} />;
      default: return <LoginScreen navigate={navigate} />;
    }
  };

  const isMainScreen = ['HOME', 'PROFILE', 'PARTNER_DASHBOARD', 'PARTNER_INVENTORY', 'TRANSACTIONS', 'CHECK_QUALITY'].includes(currentScreen);

  return (
    <div className={`min-h-screen bg-gray-100 flex items-center justify-center p-0 md:p-4 font-sans ${isDarkMode ? 'dark' : ''}`}>
      <div className={`w-full h-[100dvh] md:h-[844px] md:w-[390px] bg-white md:rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col text-slate-900 dark:text-white transition-colors duration-300`}>
        <div className="flex-1 overflow-hidden relative bg-white dark:bg-gray-900 transition-colors duration-300">
          {renderScreen()}
        </div>
        
        {isMainScreen && (
          <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 px-4 py-4 flex justify-evenly items-center z-50 rounded-t-2xl shadow-lg transition-colors">
             {userMode === 'USER' && (
               <>
                 <button onClick={() => { setHistory([]); setCurrentScreen('HOME'); }} className={`flex flex-col items-center gap-1 transition-colors min-w-[64px] ${currentScreen === 'HOME' ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}>
                   <Home size={24} /> <span className="text-[10px] font-medium">Beranda</span>
                 </button>
                 <button onClick={() => { setHistory([]); setCurrentScreen('PROFILE'); }} className={`flex flex-col items-center gap-1 transition-colors min-w-[64px] ${currentScreen === 'PROFILE' ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}>
                   <UserIcon size={24} /> <span className="text-[10px] font-medium">Profil</span>
                 </button>
               </>
             )}
             {userMode === 'PARTNER' && (
               <>
                 <button onClick={() => { setHistory([]); setCurrentScreen('PARTNER_DASHBOARD'); }} className={`flex flex-col items-center gap-1 transition-colors min-w-[64px] ${currentScreen === 'PARTNER_DASHBOARD' || currentScreen === 'CHECK_QUALITY' ? 'text-primary' : 'text-gray-400'}`}>
                   <Home size={24} /> <span className="text-[10px] font-medium">Beranda</span>
                 </button>
                 <button onClick={() => { setHistory([]); setCurrentScreen('TRANSACTIONS'); }} className={`flex flex-col items-center gap-1 transition-colors min-w-[64px] ${currentScreen === 'TRANSACTIONS' ? 'text-primary' : 'text-gray-400'}`}>
                   <FileText size={24} /> <span className="text-[10px] font-medium">Transaksi</span>
                 </button>
                 <button onClick={() => { setHistory([]); setCurrentScreen('PARTNER_INVENTORY'); }} className={`flex flex-col items-center gap-1 transition-colors min-w-[64px] ${currentScreen === 'PARTNER_INVENTORY' ? 'text-primary' : 'text-gray-400'}`}>
                   <Store size={24} /> <span className="text-[10px] font-medium">Mitra</span>
                 </button>
                 <button onClick={() => { setHistory([]); setCurrentScreen('PROFILE'); }} className={`flex flex-col items-center gap-1 transition-colors min-w-[64px] ${currentScreen === 'PROFILE' ? 'text-primary' : 'text-gray-400'}`}>
                   <UserIcon size={24} /> <span className="text-[10px] font-medium">Profil</span>
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
