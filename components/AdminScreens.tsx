import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Flag, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Plus, 
  Download, 
  Filter, 
  MoreVertical, 
  Eye, 
  Trash2, 
  Edit,
  ShieldAlert,
  Server,
  Database,
  CheckCircle2,
  X
} from 'lucide-react';
import { ScreenName } from '../types';
import { Button } from './ui';

interface AdminProps {
  navigate: (screen: ScreenName) => void;
  currentScreen?: ScreenName;
  onLogout?: () => void;
}

// --- SIDEBAR COMPONENT ---
export const AdminSidebar: React.FC<AdminProps> = ({ navigate, currentScreen, onLogout }) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, screen: 'ADMIN_DASHBOARD' },
    { name: 'Laporan Negatif', icon: Flag, screen: 'ADMIN_REPORTS' },
    { name: 'Pengaturan Sistem', icon: Settings, screen: 'ADMIN_SETTINGS' },
    { name: 'Manajemen Produk', icon: Package, screen: 'ADMIN_PRODUCTS' },
    { name: 'Pengguna & Mitra', icon: Users, screen: 'ADMIN_USERS' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed md:relative z-20">
      <div className="p-6 border-b border-gray-100 flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">F</div>
        <span className="font-bold text-lg text-gray-800 tracking-tight">FoodRescue Admin</span>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.screen as ScreenName)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              currentScreen === item.screen 
                ? 'bg-orange-50 text-primary' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon size={20} />
            {item.name}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

// --- HEADER COMPONENT ---
const AdminHeader: React.FC<{ title: string, subtitle?: string }> = ({ title, subtitle }) => (
  <div className="flex justify-between items-start mb-8">
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      {subtitle && <p className="text-slate-500 mt-1 text-sm">{subtitle}</p>}
    </div>
    <div className="flex items-center gap-4">
      <button className="p-2 text-slate-400 hover:bg-white hover:shadow-sm rounded-full transition-all">
        <Bell size={20} />
      </button>
      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
        <img src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff" alt="Admin" />
      </div>
    </div>
  </div>
);

// --- SCREEN 1: DASHBOARD ---
export const AdminDashboard: React.FC<AdminProps> = ({ navigate }) => {
  return (
    <div className="max-w-7xl mx-auto">
      <AdminHeader 
        title="Dashboard Admin" 
        subtitle="Ikhtisar metrik sistem utama dan status kesehatan." 
      />

      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
           { label: 'Total Pengguna', val: '12.345', sub: 'Naik 5.2% bulan lalu', icon: Users },
           { label: 'Total Mitra', val: '1.890', sub: 'Turun 1.1% bulan lalu', icon: Package },
           { label: 'Total Produk', val: '567', sub: 'Baru 23 bulan ini', icon: Package },
           { label: 'Laporan Negatif', val: '42', sub: '10 belum diselesaikan', icon: Flag },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start mb-4">
               <span className="text-sm font-medium text-gray-500">{stat.label}</span>
               <stat.icon size={16} className="text-gray-400" />
             </div>
             <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.val}</h3>
             <p className="text-xs text-green-500 font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
         {/* System Status Mock */}
         <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Server size={20} /></div>
               <div>
                  <p className="font-bold text-sm text-gray-800">Status Server</p>
                  <p className="text-xs text-green-600">● Ok</p>
               </div>
            </div>
            <span className="text-xs text-gray-400">Semua server beroperasi normal.</span>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Database size={20} /></div>
               <div>
                  <p className="font-bold text-sm text-gray-800">Status Database</p>
                  <p className="text-xs text-green-600">● Ok</p>
               </div>
            </div>
            <span className="text-xs text-gray-400">Koneksi database stabil.</span>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Mock Chart 1 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 col-span-2">
           <h3 className="font-bold text-gray-900 mb-6">Status Laporan Negatif</h3>
           <div className="flex items-center justify-center gap-12">
              <div className="w-40 h-40 rounded-full border-[16px] border-orange-100 border-t-orange-500 border-r-orange-300 transform -rotate-45"></div>
              <div className="space-y-3">
                 <div className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-full bg-orange-500"></span> Baru</div>
                 <div className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-full bg-orange-300"></span> Dalam Proses</div>
                 <div className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-full bg-orange-100"></span> Diselesaikan</div>
              </div>
           </div>
        </div>

        {/* Mock Chart 2 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
           <h3 className="font-bold text-gray-900 mb-6">Distribusi Kategori Produk</h3>
           <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-blue-500 via-blue-300 to-blue-100 mb-6"></div>
              <div className="flex flex-wrap gap-2 justify-center">
                 <span className="text-[10px] px-2 py-1 bg-gray-100 rounded-full">Elektronik</span>
                 <span className="text-[10px] px-2 py-1 bg-gray-100 rounded-full">Pakaian</span>
                 <span className="text-[10px] px-2 py-1 bg-gray-100 rounded-full">Makanan</span>
              </div>
           </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Log Aktivitas Terbaru</h3>
        </div>
        <div className="p-0">
           {[
             { msg: 'Pengguna baru "John Doe" terdaftar.', time: '2 menit yang lalu' },
             { msg: 'Produk "Smartwatch X" diperbarui.', time: '1 jam yang lalu' },
             { msg: 'Laporan negatif #00123 diselesaikan.', time: '3 jam yang lalu' },
             { msg: 'Login gagal dari IP 192.168.1.100.', time: 'Kemarin' },
             { msg: 'Pengaturan sistem diperbarui oleh Admin.', time: '2 hari yang lalu' },
           ].map((log, i) => (
             <div key={i} className="flex justify-between items-center px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50">
               <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                 <span className="text-sm text-gray-600">{log.msg}</span>
               </div>
               <span className="text-xs text-gray-400 font-medium">{log.time}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

// --- SCREEN 2: MANAJEMEN PENGGUNA ---
export const AdminUsers: React.FC<AdminProps> = ({ navigate }) => {
  const users = [
    { name: 'Aditya Pratama', email: 'aditya.pratama@example.com', role: 'Admin', status: 'Aktif', lastActive: '3 jam yang lalu', joined: '10 Mei 2023', roleColor: 'bg-purple-100 text-purple-700' },
    { name: 'Budi Santoso', email: 'budi.santoso@example.com', role: 'Mitra', status: 'Tertunda', lastActive: '1 hari yang lalu', joined: '15 April 2024', roleColor: 'bg-blue-100 text-blue-700' },
    { name: 'Citra Dewi', email: 'citra.dewi@example.com', role: 'Member', status: 'Aktif', lastActive: '2 jam yang lalu', joined: '22 Maret 2023', roleColor: 'bg-green-100 text-green-700' },
    { name: 'Doni Firmansyah', email: 'doni.firmansyah@example.com', role: 'Editor', status: 'Tidak Aktif', lastActive: '5 hari yang lalu', joined: '01 Januari 2024', roleColor: 'bg-gray-100 text-gray-700' },
    { name: 'Eka Wijaya', email: 'eka.wijaya@example.com', role: 'Member', status: 'Aktif', lastActive: '1 jam yang lalu', joined: '05 Februari 2023', roleColor: 'bg-green-100 text-green-700' },
    { name: 'Fitriani Lestari', email: 'fitriani.lestari@example.com', role: 'Mitra', status: 'Ditangguhkan', lastActive: '2 hari yang lalu', joined: '18 Juni 2023', roleColor: 'bg-blue-100 text-blue-700' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-2 text-sm text-gray-400">Beranda / Pengguna & Mitra</div>
      <AdminHeader title="Manajemen Pengguna & Mitra" />
      
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-3 items-center justify-between">
           <div className="flex gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Cari pengguna atau mitra" />
              </div>
              <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 outline-none"><option>Status</option></select>
              <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 outline-none"><option>Peran</option></select>
           </div>
           <div className="flex gap-2">
             <Button className="w-auto px-4 py-2 h-auto text-sm bg-primary hover:bg-orange-600"><Plus size={16} className="mr-2" /> Tambah Baru</Button>
             <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"><Download size={16} /> Ekspor Data</button>
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                <tr>
                   <th className="px-6 py-4">Pengguna/Mitra</th>
                   <th className="px-6 py-4">Peran</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4">Aktivitas Terakhir</th>
                   <th className="px-6 py-4">Tanggal Bergabung</th>
                   <th className="px-6 py-4 text-right">Tindakan</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {users.map((user, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors group">
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">{user.name.charAt(0)}</div>
                           <div>
                              <p className="font-bold text-sm text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${user.roleColor}`}>{user.role}</span>
                     </td>
                     <td className="px-6 py-4">
                        <span className={`text-xs font-semibold ${
                           user.status === 'Aktif' ? 'text-green-600' : 
                           user.status === 'Tertunda' ? 'text-orange-500' :
                           user.status === 'Ditangguhkan' ? 'text-red-500' : 'text-gray-400'
                        }`}>{user.status}</span>
                     </td>
                     <td className="px-6 py-4 text-sm text-gray-600">{user.lastActive}</td>
                     <td className="px-6 py-4 text-sm text-gray-600">{user.joined}</td>
                     <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="p-1.5 hover:bg-gray-200 rounded text-gray-500"><Edit size={16} /></button>
                           <button className="p-1.5 hover:bg-red-50 rounded text-red-500"><Trash2 size={16} /></button>
                           <button className="p-1.5 hover:bg-gray-200 rounded text-gray-500"><MoreVertical size={16} /></button>
                        </div>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
           <p className="text-xs text-gray-500">Menampilkan 1-10 dari 100 entri</p>
           <div className="flex gap-1">
              <button className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50">Previous</button>
              <button className="px-3 py-1 text-xs bg-primary text-white rounded">1</button>
              <button className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50">2</button>
              <button className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50">3</button>
              <button className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}

// --- SCREEN 3: MANAJEMEN PRODUK ---
export const AdminProducts: React.FC<AdminProps> = ({ navigate }) => {
  return (
    <div className="flex gap-6 h-full">
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="mb-2 text-sm text-gray-400">Dashboard / Manajemen Produk</div>
        <div className="flex justify-between items-center mb-6">
           <h1 className="text-2xl font-bold text-slate-900">Manajemen Produk</h1>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 flex flex-col">
           {/* Toolbar */}
           <div className="p-4 border-b border-gray-200 flex justify-between gap-4">
              <div className="flex gap-3 flex-1">
                 <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" placeholder="Cari produk..." />
                 </div>
                 <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 outline-none"><option>Semua</option></select>
                 <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 outline-none"><option>Semua</option></select>
              </div>
              <Button className="w-auto px-4 py-2 h-auto text-sm bg-primary hover:bg-orange-600"><Plus size={16} className="mr-2" /> Tambah Produk</Button>
           </div>

           {/* Table */}
           <div className="flex-1 overflow-auto">
              <table className="w-full text-left">
                 <thead className="bg-gray-50 text-gray-500 text-xs uppercase sticky top-0 z-10">
                    <tr>
                       <th className="px-4 py-3 w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
                       <th className="px-4 py-3">Gambar</th>
                       <th className="px-4 py-3">Nama Produk</th>
                       <th className="px-4 py-3">Kategori</th>
                       <th className="px-4 py-3">Harga</th>
                       <th className="px-4 py-3">Stok</th>
                       <th className="px-4 py-3">Status</th>
                       <th className="px-4 py-3 w-10"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 text-sm">
                    {[
                      { name: 'Kopi Susu Premium', cat: 'Minuman', price: 'Rp 25.000,00', stock: 150, status: 'Aktif', active: true },
                      { name: 'Roti Gandum Utuh', cat: 'Makanan', price: 'Rp 18.000,00', stock: 80, status: 'Aktif', active: true },
                      { name: 'Pasta Carbonara Instan', cat: 'Makanan', price: 'Rp 35.000,00', stock: 200, status: 'Aktif', active: true },
                      { name: 'Teh Herbal Detoks', cat: 'Minuman', price: 'Rp 20.000,00', stock: 120, status: 'Dinonaktifkan', active: false },
                      { name: 'Donat Manis Aneka Rasa', cat: 'Makanan Ringan', price: 'Rp 10.000,00', stock: 90, status: 'Aktif', active: true },
                    ].map((item, i) => (
                       <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300" /></td>
                          <td className="px-4 py-3">
                             <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                          <td className="px-4 py-3 text-gray-500">{item.cat}</td>
                          <td className="px-4 py-3 text-gray-900">{item.price}</td>
                          <td className="px-4 py-3 text-gray-500">{item.stock}</td>
                          <td className="px-4 py-3">
                             <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.active ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-500 border-red-200'}`}>
                               {item.status}
                             </span>
                          </td>
                          <td className="px-4 py-3">
                             <button className="p-1 hover:bg-gray-200 rounded text-gray-500"><Edit size={14} /></button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           
           <div className="p-4 border-t border-gray-200 flex justify-center gap-2">
              <button className="text-xs text-gray-500 hover:text-gray-900">&lt; Previous</button>
              <button className="w-6 h-6 bg-primary text-white text-xs rounded">1</button>
              <button className="w-6 h-6 hover:bg-gray-100 text-gray-600 text-xs rounded">2</button>
              <button className="text-xs text-gray-500 hover:text-gray-900">Next &gt;</button>
           </div>
        </div>
      </div>

      {/* Product Detail Sidebar (Mock) */}
      <div className="w-80 bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col items-center justify-center text-center">
         <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <Package size={32} className="text-gray-300" />
         </div>
         <h3 className="font-bold text-gray-900">Detail Produk</h3>
         <p className="text-sm text-gray-500 mt-2">Pilih produk dari daftar untuk melihat detail.</p>
      </div>
    </div>
  );
};

// --- SCREEN 4: LAPORAN NEGATIF ---
export const AdminReports: React.FC<AdminProps> = ({ navigate }) => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-2 text-sm text-gray-400">Dashboard</div>
      <AdminHeader title="Moderasi Laporan Negatif" subtitle="Kelola dan tinjau semua laporan negatif atau bermasalah yang diajukan oleh pengguna." />

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
         <h3 className="font-bold text-gray-900 mb-4">Filter Laporan</h3>
         <div className="grid grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
               <label className="text-xs font-medium text-gray-500">Cari Laporan</label>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm" placeholder="Subjek, pengirim..." />
               </div>
            </div>
            <div className="space-y-1">
               <label className="text-xs font-medium text-gray-500">Status</label>
               <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none"><option>Semua Status</option></select>
            </div>
            <div className="space-y-1">
               <label className="text-xs font-medium text-gray-500">Jenis Laporan</label>
               <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none"><option>Semua Jenis</option></select>
            </div>
            <div className="space-y-1">
               <label className="text-xs font-medium text-gray-500">Dari Tanggal</label>
               <input type="date" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-500" />
            </div>
         </div>
         <div className="flex justify-end mt-4">
            <button className="text-xs text-red-500 font-medium hover:underline flex items-center gap-1"><X size={12} /> Bersihkan Filter</button>
         </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
               <tr>
                  <th className="px-6 py-4">ID Laporan</th>
                  <th className="px-6 py-4">Subjek</th>
                  <th className="px-6 py-4">Jenis</th>
                  <th className="px-6 py-4">Pengirim</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Tanggal Kirim</th>
                  <th className="px-6 py-4">Tindakan</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
               {[
                 { id: '1001', subj: 'Produk Cacat: Headphone tidak...', type: 'Product Issue', sender: 'Rina Wijaya', status: 'Tertunda', date: '2023-10-26', color: 'bg-orange-100 text-orange-600' },
                 { id: '1002', subj: 'Perilaku tidak pantas pengguna...', type: 'User Misconduct', sender: 'Budi Santoso', status: 'Dalam Peninjauan', date: '2023-10-25', color: 'bg-blue-100 text-blue-600' },
                 { id: '1003', subj: 'Bug: Fitur pencarian tidak mu...', type: 'Service Bug', sender: 'Siti Aminah', status: 'Terselesaikan', date: '2023-10-24', color: 'bg-green-100 text-green-600' },
                 { id: '1004', subj: 'Spam berulang dari akun "Promo..."', type: 'Spam', sender: 'David Pratama', status: 'Diteruskan', date: '2023-10-23', color: 'bg-red-100 text-red-600' },
                 { id: '1005', subj: 'Konten tidak layak pada ulasan...', type: 'Content Violation', sender: 'Maya Sari', status: 'Tertunda', date: '2023-10-22', color: 'bg-orange-100 text-orange-600' },
               ].map((row, i) => (
                 <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-900">{row.id}</td>
                    <td className="px-6 py-4 text-gray-700 max-w-xs truncate">{row.subj}</td>
                    <td className="px-6 py-4 text-gray-500">{row.type}</td>
                    <td className="px-6 py-4 text-gray-700">{row.sender}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-[10px] font-bold ${row.color}`}>{row.status}</span></td>
                    <td className="px-6 py-4 text-gray-500">{row.date}</td>
                    <td className="px-6 py-4 flex gap-2">
                       <button className="p-1 border border-gray-200 rounded hover:bg-gray-50 text-gray-500"><Eye size={14} /></button>
                       <button className="p-1 border border-gray-200 rounded hover:bg-red-50 text-red-500"><ShieldAlert size={14} /></button>
                       <button className="p-1 bg-primary text-white rounded hover:bg-orange-600"><CheckCircle2 size={14} /></button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
         <div className="p-4 flex justify-end gap-2 border-t border-gray-100">
            <span className="text-sm text-gray-400 mr-4 self-center">Sebelmnya</span>
            <button className="w-8 h-8 bg-primary text-white rounded">1</button>
            <button className="w-8 h-8 border border-gray-200 text-gray-600 rounded">2</button>
            <span className="text-sm text-gray-500 self-center ml-2 cursor-pointer hover:text-gray-900">Berikutnya</span>
         </div>
      </div>
    </div>
  );
};

// --- SCREEN 5: PENGATURAN SISTEM ---
export const AdminSettings: React.FC<AdminProps> = ({ navigate }) => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-2 text-sm text-gray-400">Dashboard</div>
      <AdminHeader title="Pengaturan Sistem" subtitle="Kelola kontrol akses, tinjau log aktivitas, dan konfigurasikan notifikasi aplikasi." />

      <div className="flex gap-1 mb-6 border-b border-gray-200">
         <button className="px-6 py-3 border-b-2 border-slate-900 text-slate-900 font-bold text-sm">Kontrol Akses</button>
         <button className="px-6 py-3 border-b-2 border-transparent text-gray-500 hover:text-gray-800 font-medium text-sm">Log Audit</button>
         <button className="px-6 py-3 border-b-2 border-transparent text-gray-500 hover:text-gray-800 font-medium text-sm">Pengaturan Notifikasi</button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Daftar Administrator</h3>
            <Button className="w-auto px-4 h-9 text-sm">Tambah Administrator</Button>
         </div>
         <p className="text-sm text-gray-500 mb-4">Kelola daftar administrator sistem dan peran mereka.</p>

         <table className="w-full text-left mb-6">
            <thead className="text-xs text-gray-400 uppercase border-b border-gray-100">
               <tr>
                  <th className="py-3 font-medium">Nama</th>
                  <th className="py-3 font-medium">Email</th>
                  <th className="py-3 font-medium">Peran</th>
                  <th className="py-3 font-medium">Ditambahkan Pada</th>
                  <th className="py-3 font-medium text-right">Tindakan</th>
               </tr>
            </thead>
            <tbody className="text-sm">
               {[
                 { name: 'Budi Santoso', email: 'budi.santoso@example.com', role: 'Administrator Utama', date: '2023-01-15' },
                 { name: 'Siti Aminah', email: 'siti.aminah@example.com', role: 'Moderator Konten', date: '2023-03-01' },
                 { name: 'Joko Susilo', email: 'joko.susilo@example.com', role: 'Analis Laporan', date: '2023-04-20' },
                 { name: 'Rina Wijaya', email: 'rina.wijaya@example.com', role: 'Administrator Utama', date: '2023-06-10' },
                 { name: 'Agus Salim', email: 'agus.salim@example.com', role: 'Analis Laporan', date: '2023-07-25' },
               ].map((admin, i) => (
                 <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="py-4 font-medium text-gray-900">{admin.name}</td>
                    <td className="py-4 text-gray-600">{admin.email}</td>
                    <td className="py-4 text-gray-600">{admin.role}</td>
                    <td className="py-4 text-gray-500">{admin.date}</td>
                    <td className="py-4 text-right">
                       <button className="mr-2 text-gray-400 hover:text-gray-600"><Edit size={16} /></button>
                       <button className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
         <h3 className="text-lg font-bold text-gray-900 mb-2">Kelola Peran & Izin</h3>
         <p className="text-sm text-gray-500 mb-6">Konfigurasikan peran yang tersedia dan izin yang terkait dengan setiap peran.</p>

         <div className="space-y-3 max-w-3xl">
            {['Administrator Utama', 'Moderator Konten', 'Analis Laporan'].map((role, i) => (
               <div key={i} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg">
                  <span className="font-medium text-gray-700">{role}</span>
                  <button className="px-4 py-1.5 border border-gray-200 rounded text-xs font-medium hover:bg-gray-50">Lihat Izin</button>
               </div>
            ))}
         </div>
         <Button className="w-auto mt-6 px-6 h-10 bg-primary hover:bg-orange-600">Buat Peran Baru</Button>
      </div>
    </div>
  );
};