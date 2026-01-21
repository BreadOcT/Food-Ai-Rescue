
import React from 'react';
import { Search, MoreVertical, ShieldAlert, CheckCircle2, Package, User } from 'lucide-react';

export const LayarModerasiLaporan: React.FC<any> = ({ globalState }) => {
  const reports = globalState.reports || [];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Moderasi Laporan</h1>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
         <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-bold">
               <tr>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Pelapor</th>
                  <th className="p-4">Masalah</th>
                  <th className="p-4">Deskripsi</th>
                  <th className="p-4">Tindakan</th>
               </tr>
            </thead>
            <tbody className="text-sm divide-y">
               {reports.length > 0 ? reports.map((rpt: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50">
                     <td className="p-4 text-gray-500 text-xs">{new Date(rpt.date).toLocaleDateString()}</td>
                     <td className="p-4 font-bold">{rpt.userId}</td>
                     <td className="p-4"><span className="px-2 py-1 bg-rose-100 text-rose-600 rounded-md text-xs font-bold">{rpt.reason}</span></td>
                     <td className="p-4 text-gray-600 truncate max-w-xs">{rpt.description}</td>
                     <td className="p-4 flex gap-2">
                        <button className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><ShieldAlert size={18}/></button>
                        <button className="p-1.5 bg-green-50 text-green-500 rounded-lg hover:bg-green-100"><CheckCircle2 size={18}/></button>
                     </td>
                  </tr>
               )) : (
                 <tr><td colSpan={5} className="p-8 text-center text-gray-400 font-medium">Tidak ada laporan baru.</td></tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export const LayarKelolaPengguna: React.FC<any> = ({ globalState }) => {
  const users = globalState.allUsers || [];
  
  return (
    <div className="max-w-7xl mx-auto">
       <h1 className="text-2xl font-bold mb-6">Manajemen Pengguna</h1>
       <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input className="w-full max-w-md pl-10 p-2.5 bg-white border rounded-xl text-sm" placeholder="Cari pengguna..." />
       </div>
       <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
          {users.length > 0 ? (
             <div className="divide-y">
                {users.map((u: any, i: number) => (
                   <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                         {u.avatar ? <img src={u.avatar} className="w-full h-full rounded-full object-cover"/> : <User size={20} className="text-gray-400"/>}
                      </div>
                      <div className="flex-1">
                         <h4 className="font-bold text-gray-900">{u.name}</h4>
                         <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'PARTNER' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                         {u.role}
                      </span>
                   </div>
                ))}
             </div>
          ) : (
            <p className="p-10 text-center text-slate-400">Data pengguna kosong atau belum dimuat.</p>
          )}
       </div>
    </div>
  );
};

export const LayarKelolaProduk: React.FC<any> = ({ globalState }) => {
  const products = globalState.partnerInventory || [];

  return (
    <div className="max-w-7xl mx-auto">
       <h1 className="text-2xl font-bold mb-6">Katalog Produk Global</h1>
       <p className="text-sm text-slate-500 mb-6">Pantau semua item surplus yang sedang aktif di platform.</p>
       
       {products.length > 0 ? (
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p: any) => (
               <div key={p.id} className="bg-white rounded-xl border p-3 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                     <img src={p.image} className="w-full h-full object-cover" />
                     <span className="absolute top-2 right-2 bg-black/60 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                        {p.amountValue} Stok
                     </span>
                  </div>
                  <div>
                     <h4 className="font-bold text-sm truncate">{p.name}</h4>
                     <p className="text-xs text-slate-500">{p.partnerName}</p>
                  </div>
               </div>
            ))}
         </div>
       ) : (
         <div className="text-center py-20 bg-white rounded-xl border border-dashed">
            <Package size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">Belum ada produk live.</p>
         </div>
       )}
    </div>
  );
};
