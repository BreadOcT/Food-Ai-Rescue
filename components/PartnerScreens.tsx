
import React, { useState, useEffect, useRef } from 'react';
import { Bell, User, UploadCloud, X, ChevronRight, AlertTriangle, Package, TrendingUp, CheckCircle, ChevronLeft, Search, Plus, Loader2, Sparkles, Zap, ShieldCheck, AlertCircle, Apple, Salad, Drumstick, Wheat, Box, Croissant, Soup, Tag, Info, Clock, ThermometerSnowflake, Calendar, Utensils, MessageCircle, Edit2, Trash2, Eye, MapPin, Minus, Camera, Image as ImageIcon } from 'lucide-react';
import { ScreenName } from '../types';
import { Button, Badge, Card, Section, Input } from './ui';
import { analyzeFoodQuality, QualityAnalysisResult, DetectedItem, detectIngredientsFromImage } from '../services/geminiService';

interface PartnerProps {
  navigate: (screen: ScreenName) => void;
  globalState: any;
  setGlobalState: (key: string, value: any) => void;
}

// --- SUB-COMPONENTS (WIDGETS) ---

const MetricCard: React.FC<{ label: string; value: string; trend: string; icon: any; color: string }> = ({ label, value, trend, icon: Icon, color }) => (
  <div className="border border-gray-100 rounded-2xl p-4 shadow-sm bg-white">
    <div className="flex justify-between items-start mb-2">
      <p className="text-xs text-gray-500">{label}</p>
      <Icon size={14} className={color} />
    </div>
    <h4 className="font-bold text-lg text-gray-900">{value}</h4>
    <p className="text-[10px] text-green-500 flex items-center gap-1 font-medium"><TrendingUp size={10} /> {trend}</p>
  </div>
);

const IssueCard: React.FC<{ title: string; desc: string; type: 'red' | 'orange' }> = ({ title, desc, type }) => {
  const styles = {
    red: { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-600', sub: 'text-red-400', icon: 'text-red-500' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-600', sub: 'text-orange-400', icon: 'text-orange-500' }
  };
  const s = styles[type];
  return (
    <div className={`${s.bg} ${s.border} rounded-xl p-4`}>
      <div className="flex items-start gap-3 mb-2">
        <AlertTriangle className={s.icon} size={18} />
        <div>
          <h4 className={`font-bold ${s.text} text-sm`}>{title}</h4>
          <p className={`${s.sub} text-xs`}>{desc}</p>
        </div>
      </div>
      <Button variant="outline" className={`h-8 py-0 text-xs ${s.text} border-current bg-white w-full hover:${s.bg}`}>Lihat Detail</Button>
    </div>
  );
};

const ProductDetailModal: React.FC<{ product: any; onClose: () => void }> = ({ product, onClose }) => {
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md h-[85vh] sm:h-auto sm:rounded-[2.5rem] rounded-t-[2.5rem] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="relative h-64 shrink-0">
          <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md z-10"><X size={20} /></button>
          <div className="absolute bottom-4 left-4 flex gap-2">
             <Badge color="blue" className="px-3 py-1 text-[11px] shadow-lg">{product.category}</Badge>
             <Badge color={product.qualityPercentage >= 80 ? 'green' : 'orange'} className="px-3 py-1 text-[11px] shadow-lg text-white">Skor: {product.qualityPercentage}%</Badge>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-orange-50/50 border-b border-orange-100 flex items-center justify-between">
           <div className="flex items-center gap-2 text-xs font-black text-orange-700 uppercase tracking-widest">
              <Clock size={16} />
              <span>Jam Distribusi</span>
           </div>
           <span className="text-sm font-black text-orange-800 bg-white px-4 py-1.5 rounded-full shadow-sm border border-orange-100">{product.serviceStart} - {product.serviceEnd}</span>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6 no-scrollbar">
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight mb-1">{product.name}</h2>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Produksi: {new Date(product.productionTime).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Stok Sisa</p>
                <p className="text-xl font-black text-primary">{product.amountValue} <span className="text-[10px] uppercase">{product.amountUnit}</span></p>
             </div>
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Metode Simpan</p>
                <p className="text-sm font-bold text-slate-700">{product.storageMethod}</p>
             </div>
          </div>

          <div>
             <h4 className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-wide">Deskripsi Produk</h4>
             <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {product.description || "Tidak ada deskripsi."}
             </p>
          </div>

          <div>
             <h4 className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-wide">Bahan Utama</h4>
             <p className="text-xs text-slate-500 italic bg-slate-50 p-4 rounded-2xl border border-slate-100">{product.ingredients}</p>
          </div>
        </div>
        <div className="p-6 border-t border-slate-100 shrink-0 bg-white">
           <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20" onClick={onClose}>Tutup Detail</Button>
        </div>
      </div>
    </div>
  );
};

const DateTimeModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (val: string) => void;
  initialValue: string; 
}> = ({ isOpen, onClose, onSave, initialValue }) => {
  const now = new Date();
  const [selectedDate, setSelectedDate] = useState(initialValue ? new Date(initialValue) : now);
  const [viewDate, setViewDate] = useState(initialValue ? new Date(initialValue) : now);
  const [time, setTime] = useState(initialValue ? initialValue.split('T')[1]?.substring(0, 5) : now.toTimeString().substring(0, 5));

  if (!isOpen) return null;

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
  };

  const handleConfirm = () => {
    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dd = String(selectedDate.getDate()).padStart(2, '0');
    const validTime = time || "00:00"; 
    onSave(`${yyyy}-${mm}-${dd}T${validTime}`);
    onClose();
  };

  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Pilih Waktu Produksi</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"><X size={20}/></button>
        </div>
        
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-white rounded-xl text-slate-600 transition-colors"><ChevronLeft size={18}/></button>
            <span className="font-bold text-slate-900 text-sm">{months[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
            <button onClick={handleNextMonth} className="p-2 hover:bg-white rounded-xl text-slate-600 transition-colors"><ChevronRight size={18}/></button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map(d => <div key={d} className="text-[10px] font-bold text-slate-400 uppercase text-center py-1">{d}</div>)}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === viewDate.getMonth() && selectedDate.getFullYear() === viewDate.getFullYear();
              const isToday = day === now.getDate() && viewDate.getMonth() === now.getMonth() && viewDate.getFullYear() === now.getFullYear();
              
              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`aspect-square rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                    isSelected ? 'bg-primary text-white shadow-md' : 
                    isToday ? 'bg-white text-primary border border-primary/20' : 
                    'text-slate-700 hover:bg-white'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 mb-6">
           <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Jam Produksi</label>
           <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="time"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
           </div>
        </div>

        <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20" onClick={handleConfirm}>
          Simpan Waktu
        </Button>
      </div>
    </div>
  );
};

const UpdateProductModal: React.FC<{
  isOpen: boolean;
  product: any;
  onClose: () => void;
  onSave: (stock: string, time: string) => void;
  onOpenDatePicker: () => void;
  editStock: string;
  setEditStock: (val: string) => void;
  editProductionTime: string;
}> = ({ isOpen, product, onClose, onSave, onOpenDatePicker, editStock, setEditStock, editProductionTime }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
          <div className="min-w-0 pr-4">
            <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-1">Update Produk</p>
            <h3 className="text-lg font-black text-slate-900 truncate leading-tight uppercase tracking-tight">{product.name}</h3>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors shrink-0"><X size={20}/></button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 py-2">
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Stok Sisa ({product.amountUnit})</label>
            <div className="relative">
              <input
                type="number"
                value={editStock}
                onChange={(e) => setEditStock(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-5 font-black text-3xl text-slate-900 focus:outline-none focus:border-primary transition-all shadow-sm"
                placeholder="0"
                autoFocus
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                 <button onClick={() => setEditStock(String(parseInt(editStock || '0') + 1))} className="p-1 text-primary hover:bg-primary/10 rounded-md transition-colors"><TrendingUp size={16} /></button>
                 <button onClick={() => setEditStock(String(Math.max(0, parseInt(editStock || '0') - 1)))} className="p-1 text-rose-400 hover:bg-rose-50 rounded-md transition-colors"><TrendingUp size={16} className="rotate-180" /></button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Waktu Produksi</label>
            <div
              onClick={onOpenDatePicker}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-5 flex items-center justify-between cursor-pointer hover:border-primary/30 transition-all shadow-sm active:scale-95"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-slate-100">
                  <Calendar size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Terpilih:</span>
                  <span className="text-sm font-black text-slate-700">
                    {editProductionTime ? new Date(editProductionTime).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : 'Pilih Waktu'}
                  </span>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300" />
            </div>
          </div>
        </div>

        <div className="pt-8 space-y-3">
          <Button
            className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20"
            onClick={() => onSave(editStock, editProductionTime)}
          >
            Simpan Perubahan
          </Button>
          <button
            onClick={onClose}
            className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            Batal & Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN SCREENS ---

export const PartnerDashboard: React.FC<PartnerProps> = ({ navigate }) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 shrink-0 bg-white z-10 flex justify-between items-center border-b border-gray-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-primary"><div className="w-4 h-4 border-2 border-current rotate-45"></div></div>
          <h1 className="font-bold text-lg text-gray-900">Partner Dashboard</h1>
        </div>
        <div className="flex gap-3">
          <button className="relative p-1 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"><Bell size={24} /><span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span></button>
          <button className="p-1 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"><User size={24} /></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8 pb-28">
        <section>
          <h3 className="font-bold text-gray-900 mb-3">Peringatan & Isu</h3>
          <div className="space-y-3">
            <IssueCard title="Peringatan Stok Rendah" desc="Stok rendah: Hanya tersisa 20 unit." type="red" />
            <IssueCard title="Masalah Kualitas" desc="Masalah kualitas terdeteksi pada batch terbaru." type="orange" />
          </div>
        </section>
        <section>
          <h3 className="font-bold text-gray-900 mb-3">Ringkasan Metrik</h3>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Penjualan Bulan Ini" value="Rp 25.000.000" trend="+12%" icon={Package} color="text-orange-300" />
            <MetricCard label="Total Pesanan" value="1,240" trend="+5%" icon={Package} color="text-blue-300" />
            <MetricCard label="Produk Terjual" value="850" trend="+8%" icon={Package} color="text-purple-300" />
            <MetricCard label="Pelanggan Baru" value="320" trend="+15%" icon={Package} color="text-green-300" />
          </div>
        </section>
        <div className="fixed bottom-24 right-6 z-30"><Button className="w-auto h-14 rounded-full px-6 shadow-xl shadow-orange-200" onClick={() => navigate('UPLOAD_PRODUCT')}>+ Tambah</Button></div>
      </div>
    </div>
  );
};

export const PartnerInventory: React.FC<PartnerProps> = ({ navigate, globalState, setGlobalState }) => {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStock, setEditStock] = useState("");
  const [editProductionTime, setEditProductionTime] = useState("");
  const [isEditDateModalOpen, setIsEditDateModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<any | null>(null);
  
  const categories = ["Semua", "Makanan Berat", "Minuman", "Roti & Kue", "Buah & Sayur", "Bahan Olahan"];
  
  const partnerInventory = globalState.partnerInventory || [];

  const filteredProducts = partnerInventory.filter((p: any) => 
    activeCategory === "Semua" ? true : p.category === activeCategory
  );

  const handleDelete = (id: number) => {
    if(confirm("Hapus produk ini dari inventory?")) {
      const newList = partnerInventory.filter((p: any) => p.id !== id);
      setGlobalState('partnerInventory', newList);
    }
  };

  const handleEditProduct = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(product.id);
    setEditStock(product.amountValue);
    setEditProductionTime(product.productionTime);
  };

  const saveProductUpdate = () => {
    const newList = partnerInventory.map((p: any) => 
      p.id === editingId ? { ...p, amountValue: editStock, productionTime: editProductionTime } : p
    );
    setGlobalState('partnerInventory', newList);
    setEditingId(null);
  };

  const currentEditingProduct = partnerInventory.find((p: any) => p.id === editingId);

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="p-6 pb-2 shrink-0 bg-white z-10 shadow-sm"><h1 className="text-xl font-bold text-center text-gray-900">Inventory</h1></div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 pb-28">
        <div className="flex gap-3">
          <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Cari produk..." /></div>
          <Button className="w-auto px-6 rounded-xl text-sm" onClick={() => navigate('UPLOAD_PRODUCT')}><Plus size={18} className="mr-1" /> Tambah</Button>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
           {categories.map((cat) => (<button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-primary/20 text-primary-hover border border-primary/20' : 'bg-gray-50 text-gray-600 border border-transparent'}`}>{cat}</button>))}
        </div>
        <div className="space-y-4">
           {filteredProducts.length > 0 ? filteredProducts.map((product: any) => (
             <Card 
               key={product.id} 
               className={`p-4 flex gap-4 animate-in fade-in slide-in-from-bottom-2 group relative cursor-pointer hover:shadow-md border-slate-100 min-h-[140px]`}
               onClick={() => setViewingProduct(product)}
             >
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100 relative shadow-sm">
                   <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <Eye size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                   </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                   <h4 className="font-black text-slate-900 text-[15px] truncate leading-tight">{product.name}</h4>
                   <div className="flex flex-wrap items-center gap-1.5">
                      <Badge color="blue" className="px-2 py-0.5 text-[9px] uppercase tracking-wider">{product.category}</Badge>
                      
                      <div className="flex items-center gap-1 text-[9px] font-black bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md border border-orange-100">
                         <Clock size={10} />
                         <span>{product.serviceStart} - {product.serviceEnd}</span>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-900 font-black bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg shadow-sm">
                        {product.amountValue} <span className="text-[9px] text-slate-400 font-bold uppercase ml-0.5">{product.amountUnit}</span>
                      </span>
                   </div>

                   <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                         <div className={`h-full rounded-full transition-all duration-500 ${product.qualityPercentage >= 60 ? 'bg-primary' : 'bg-red-500'}`} style={{ width: `${product.qualityPercentage}%` }}></div>
                      </div>
                      <span className={`text-[10px] font-black whitespace-nowrap ${product.qualityPercentage >= 60 ? 'text-primary' : 'text-red-500'}`}>{product.qualityPercentage}%</span>
                   </div>
                </div>
                <div className="flex flex-col gap-2 justify-center pl-2 border-l border-slate-50">
                   <button onClick={(e) => handleEditProduct(product, e)} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-primary transition-all active:scale-90"><Edit2 size={16} /></button>
                   <button onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }} className="p-2.5 bg-rose-50 rounded-xl text-rose-400 hover:text-rose-600 transition-all active:scale-90"><Trash2 size={16} /></button>
                </div>
             </Card>
           )) : (
             <div className="text-center py-20 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <Package className="mx-auto text-gray-200 mb-4" size={48} />
                <p className="text-gray-400 text-sm font-medium">Belum ada produk ditambahkan.</p>
             </div>
           )}
        </div>
      </div>
      
      {/* Detail Modal */}
      <ProductDetailModal product={viewingProduct} onClose={() => setViewingProduct(null)} />
      
      {/* MODAL UPDATE PRODUK TERBARU */}
      <UpdateProductModal
        isOpen={editingId !== null}
        product={currentEditingProduct}
        onClose={() => setEditingId(null)}
        onSave={saveProductUpdate}
        onOpenDatePicker={() => setIsEditDateModalOpen(true)}
        editStock={editStock}
        setEditStock={setEditStock}
        editProductionTime={editProductionTime}
      />
      
      {/* Date Picker Modal for Edit */}
      <DateTimeModal 
         isOpen={isEditDateModalOpen} 
         onClose={() => setIsEditDateModalOpen(false)} 
         onSave={(val) => setEditProductionTime(val)} 
         initialValue={editProductionTime} 
      />
    </div>
  );
};

export const PartnerTransactions: React.FC<PartnerProps> = ({ navigate }) => {
  return (
    <div className="flex flex-col h-full bg-white">
       <div className="p-6 shrink-0 bg-white z-10 border-b border-gray-50 flex items-center justify-between shadow-sm"><h1 className="text-xl font-bold text-gray-900 mx-auto">Transaksi</h1></div>
       <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-28">
         <section>
           <h3 className="font-bold text-gray-900 mb-4">Transaksi Terbaru</h3>
           <div className="space-y-6">
             {[
               { name: "Budi Santoso", date: "28 Juli 2024", amount: "+Rp 150.000", status: "Selesai", color: "text-green-500", img: 12 },
               { name: "Dewi Lestari", date: "25 Juli 2024", amount: "-Rp 120.000", status: "Gagal", color: "text-red-500", img: 13 },
             ].map((tx, i) => (
               <div key={i} className="flex items-center gap-4">
                 <img src={`https://picsum.photos/100/100?random=${tx.img}`} alt={tx.name} className="w-10 h-10 rounded-full object-cover" />
                 <div className="flex-1"><h4 className="font-bold text-gray-900 text-sm">{tx.name}</h4><p className="text-gray-400 text-xs">{tx.date}</p></div>
                 <div className="text-right"><p className={`font-bold text-sm ${tx.color}`}>{tx.amount}</p><span className={`text-[10px] px-2 py-0.5 rounded-full ${tx.status === 'Selesai' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{tx.status}</span></div>
               </div>
             ))}
           </div>
         </section>
       </div>
    </div>
  );
};

export const UploadProduct: React.FC<PartnerProps> = ({ navigate, globalState, setGlobalState }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Form State
  const [productName, setProductName] = useState("");
  const [productionTime, setProductionTime] = useState("");
  const [amountValue, setAmountValue] = useState<number>(0);
  const [amountUnit, setAmountUnit] = useState("Porsi");
  const [ingredients, setIngredients] = useState("");
  const [category, setCategory] = useState("Makanan Berat");
  const [storageMethod, setStorageMethod] = useState("Suhu Ruang");
  const [description, setDescription] = useState("");
  const [serviceStart, setServiceStart] = useState("");
  const [serviceEnd, setServiceEnd] = useState("");
  const [mapsUrl, setMapsUrl] = useState(""); // State baru untuk Link Maps
  
  // Validation UI state
  const [formError, setFormError] = useState<string | null>(null);
  
  const [qualityResult, setQualityResult] = useState<QualityAnalysisResult | null>(null);
  const [hasCheckedQuality, setHasCheckedQuality] = useState(false);
  
  // UI States
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isDetectingIngredients, setIsDetectingIngredients] = useState(false);

  // Refs for camera and file inputs
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear error when user interacts
  useEffect(() => {
    if (formError) setFormError(null);
  }, [productName, description, productionTime, amountValue, image, ingredients, serviceStart, serviceEnd, mapsUrl]);

  const processImage = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setImage(base64);
      setHasCheckedQuality(false);
      setQualityResult(null);

      setIsDetectingIngredients(true);
      try {
        const detected = await detectIngredientsFromImage(base64);
        if (detected) {
          setIngredients(prev => prev ? `${prev}, ${detected}` : detected);
        }
      } catch (error) {
        console.error("Failed to detect ingredients", error);
      } finally {
        setIsDetectingIngredients(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files?.[0]) {
       await processImage(e.target.files[0]);
     }
  };

  const runQualityCheck = async () => {
    // STRICT VALIDATION
    let error = null;
    if (!productName || !productName.trim()) error = "Nama Produk";
    else if (!description || !description.trim()) error = "Deskripsi Produk";
    else if (!productionTime) error = "Waktu Produksi";
    else if (amountValue <= 0) error = "Jumlah Sisa (Stok minimal 1)";
    else if (!image) error = "Foto Produk";
    else if (!ingredients || !ingredients.trim()) error = "Daftar Bahan Utama";
    else if (!serviceStart || !serviceEnd) error = "Jam Distribusi";
    else if (!mapsUrl) error = "Link Lokasi (Google Maps)"; // Validasi baru

    if (error) {
      const msg = `Anda belum mengisi bagian ${error}`;
      setFormError(msg);
      return;
    }

    setIsAnalyzing(true);
    setQualityResult(null);
    setFormError(null);
    
    try {
      const promptContext = `
        Produk: ${productName}. 
        Diproduksi: ${productionTime}. 
        Deskripsi: ${description}. 
        Bahan-bahan: ${ingredients}.
        Jam Distribusi: ${serviceStart} s/d ${serviceEnd}.
        Metode Simpan: ${storageMethod}.
      `;
      
      const result = await analyzeFoodQuality([promptContext], image!);
      setQualityResult(result);
      setHasCheckedQuality(true);
      
      if (result.detectedItems && result.detectedItems.length > 0) {
         const detectedCat = result.detectedItems[0].category;
         if (detectedCat === 'Roti') setCategory('Roti & Kue');
         else if (detectedCat === 'Sayur' || detectedCat === 'Buah') setCategory('Buah & Sayur');
         else if (detectedCat === 'Olahan') setCategory('Bahan Olahan');
         else setCategory('Makanan Berat');
      }

    } catch (error) {
      console.error("Quality Check Error:", error);
      alert("Terjadi kesalahan saat analisis AI. Silakan coba lagi.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleContactCS = () => {
    const text = `Halo Admin Food AI Rescue, saya mitra ingin memvalidasi produk surplus saya.\n\nNama Produk: ${productName}\nAlasan: Hasil analisis AI menunjukkan kualitas rendah/non-halal namun produk saya sudah sesuai standar keamanan.\n\nMohon bantuannya untuk verifikasi manual. Terima kasih.`;
    const url = `https://wa.me/6285694813059?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleUpload = () => {
    if (!hasCheckedQuality || !qualityResult) {
      alert("Silakan lakukan Cek Kualitas AI terlebih dahulu.");
      return;
    }

    const isQualified = qualityResult.qualityPercentage >= 60 && qualityResult.isHalal;

    if (!isQualified) {
      alert("Produk tidak memenuhi standar kualitas AI. Silakan hubungi CS untuk verifikasi manual.");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name: productName,
      partnerName: globalState.user?.name || "Mitra Food Rescue",
      partnerAvatar: globalState.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(globalState.user?.name || 'Mitra')}`,
      image: image,
      category: category,
      amountValue: amountValue,
      amountUnit: amountUnit,
      productionTime: productionTime,
      qualityPercentage: qualityResult.qualityPercentage,
      shelfLifePrediction: qualityResult.shelfLifePrediction,
      storageMethod: storageMethod,
      ingredients: ingredients,
      description: description,
      serviceStart: serviceStart,
      serviceEnd: serviceEnd,
      mapsUrl: mapsUrl, // Menyimpan link maps
      status: "Buka",
      distance: "0.5 km", // Default distance for demo since no GPS logic
      deliveryType: "pickup", // Default to pickup
      rating: 5.0,
      isHalal: qualityResult.isHalal
    };

    const currentInventory = globalState.partnerInventory || [];
    setGlobalState('partnerInventory', [newProduct, ...currentInventory]);
    navigate('SUCCESS');
  };

  const isQualified = qualityResult ? (qualityResult.qualityPercentage >= 60 && qualityResult.isHalal) : false;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setAmountValue(isNaN(val) || val < 0 ? 0 : val);
  };

  const incrementAmount = () => setAmountValue(prev => prev + 1);
  const decrementAmount = () => setAmountValue(prev => Math.max(0, prev - 1));

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="p-4 border-b border-gray-50 flex items-center gap-4 shrink-0 bg-white z-10 shadow-sm">
         <button onClick={() => navigate('PARTNER_INVENTORY')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"><ChevronLeft size={24} /></button>
         <h1 className="font-bold text-lg text-gray-900">Tambah Produk Baru</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-12">
         
         <Section title="Informasi Produk">
            <div className="space-y-6">
               <Input 
                  label="Nama Produk *" 
                  placeholder="Contoh: Nasi Box Ayam Bakar" 
                  value={productName} 
                  onChange={(e: any) => setProductName(e.target.value)} 
               />
               
               <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-900 block">Deskripsi Produk *</label>
                  <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none h-24 font-medium" 
                    placeholder="Jelaskan kondisi makanan, isi paket, dan detail lainnya..." 
                  />
               </div>

               <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-900 block">Waktu Produksi *</label>
                    <div className="relative" onClick={() => setIsDateModalOpen(true)}>
                       <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                       <div className={`w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-2 py-4 text-[11px] font-bold ${productionTime ? 'text-slate-900' : 'text-slate-400'}`}>
                         {productionTime ? new Date(productionTime).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : 'Pilih Waktu'}
                       </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-900 block">Jumlah Sisa *</label>
                    <div className="flex gap-2">
                       <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex-1 h-14">
                          <button 
                            type="button"
                            className="px-4 h-full hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
                            onClick={decrementAmount}
                            disabled={amountValue <= 0}
                          >
                             <Minus size={18} strokeWidth={3} />
                          </button>
                          <input 
                            type="number" 
                            className="flex-1 bg-transparent text-center focus:outline-none text-xl font-black text-slate-900 min-w-0 px-2"
                            value={amountValue}
                            onChange={handleAmountChange}
                            min="0"
                          />
                          <button 
                            type="button"
                            className="px-4 h-full hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
                            onClick={incrementAmount}
                          >
                             <Plus size={18} strokeWidth={3} />
                          </button>
                       </div>
                       <select 
                          className="bg-slate-100 border border-slate-200 rounded-xl px-4 text-[10px] font-black uppercase w-28 text-slate-900"
                          value={amountUnit}
                          onChange={(e) => setAmountUnit(e.target.value)}
                       >
                          <option>Porsi</option>
                          <option>Kg</option>
                          <option>Box</option>
                       </select>
                    </div>
                  </div>
               </div>
            </div>
         </Section>

         <Section title="Visual & Bahan Baku">
            <div className="space-y-4">
               <div>
                  <label className="block font-bold text-gray-900 mb-3 text-sm">Foto Produk *</label>
                  <div className="min-h-[220px] border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden group transition-all shadow-sm">
                     {image ? (
                       <div className="w-full h-full relative group">
                          <img src={image} className="w-full h-56 object-cover" alt="Upload" />
                          <button onClick={() => setImage(null)} className="absolute top-4 right-4 bg-white/90 p-2.5 rounded-full shadow-xl hover:bg-white transition-colors z-20"><X size={20} className="text-slate-800" /></button>
                       </div>
                     ) : (
                       <div className="p-6 text-center w-full space-y-5">
                          <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-md mx-auto text-primary animate-in zoom-in duration-300">
                             <UploadCloud size={32} strokeWidth={2} />
                          </div>
                          <div className="space-y-1">
                             <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Unggah Foto Produk</p>
                             <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[200px] mx-auto">AI membutuhkan foto yang jelas untuk memverifikasi standar higienitas.</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 pt-2">
                             <button 
                                onClick={() => cameraInputRef.current?.click()}
                                className="flex flex-col items-center justify-center gap-2 p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all group"
                             >
                                <Camera size={24} />
                                <span className="text-[10px] font-black uppercase tracking-wider">Ambil Foto</span>
                             </button>
                             <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 text-slate-600 rounded-2xl shadow-sm active:scale-95 transition-all"
                             >
                                <ImageIcon size={24} />
                                <span className="text-[10px] font-black uppercase tracking-wider">Pilih File</span>
                             </button>
                          </div>

                          <div className="pt-3 flex items-center justify-center gap-2 text-primary">
                             <div className="p-1 bg-primary/10 rounded-full"><Sparkles size={12} /></div>
                             <p className="text-[10px] font-bold">Tips: Pastikan pencahayaan cukup terang</p>
                          </div>
                       </div>
                     )}
                     {/* HIDDEN INPUTS MOVED OUTSIDE BUTTONS */}
                     <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleImageUpload} />
                     <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </div>
               </div>

               <div>
                 <label className="block font-bold text-gray-900 mb-2 text-xs uppercase tracking-wider flex justify-between items-center">
                   Daftar Bahan Utama *
                   {isDetectingIngredients && <span className="text-[10px] text-primary flex items-center gap-1 normal-case font-normal"><Loader2 size={10} className="animate-spin" /> Mendeteksi...</span>}
                 </label>
                 <textarea 
                   value={ingredients} 
                   onChange={(e) => setIngredients(e.target.value)} 
                   className="w-full p-4 bg-slate-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 h-24 shadow-sm font-medium transition-all" 
                   placeholder={isDetectingIngredients ? "AI sedang mendeteksi bahan dari foto..." : "Contoh: Ayam, Nasi, Lalapan, Sambal, Minyak Goreng..."}
                 />
                 <p className="text-[10px] text-slate-400 mt-2">*Wajib diisi agar AI dapat mendeteksi alergen dan kehalalan.</p>
               </div>
            </div>
         </Section>

         <Section title="Konfigurasi Layanan">
            <div className="space-y-4">
                <div className="space-y-1.5">
                   <label className="text-sm font-semibold text-slate-900 block">Link Lokasi (Google Maps) *</label>
                   <Input 
                      placeholder="https://maps.app.goo.gl/..." 
                      value={mapsUrl} 
                      onChange={(e: any) => setMapsUrl(e.target.value)} 
                      icon={<MapPin size={18} />}
                   />
                   <p className="text-[10px] text-slate-400 px-1">Tempelkan link share lokasi agar penerima tidak tersasar.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block font-bold text-gray-900 mb-2 text-xs uppercase tracking-wider">Kategori</label>
                      <div className="relative">
                         <select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)} 
                            className="w-full p-4 bg-slate-50 border border-gray-200 rounded-2xl text-[10px] text-gray-700 font-black focus:outline-none appearance-none shadow-sm uppercase tracking-widest"
                         >
                            <option>Makanan Berat</option>
                            <option>Minuman</option>
                            <option>Roti & Kue</option>
                            <option>Buah & Sayur</option>
                            <option>Bahan Olahan</option>
                         </select>
                         <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" size={16} />
                      </div>
                   </div>
                   <div>
                      <label className="block font-bold text-gray-900 mb-2 text-xs uppercase tracking-wider">Metode Simpan</label>
                      <div className="relative">
                         <select 
                            className="w-full p-4 bg-slate-50 border border-gray-200 rounded-2xl text-[10px] text-gray-700 font-black focus:outline-none appearance-none shadow-sm uppercase tracking-widest"
                            value={storageMethod}
                            onChange={(e) => setStorageMethod(e.target.value)}
                         >
                            <option>Suhu Ruang</option>
                            <option>Lemari Es</option>
                            <option>Freezer</option>
                         </select>
                         <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" size={16} />
                      </div>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="block font-bold text-gray-900 text-xs uppercase tracking-wider">Jam Distribusi Surplus *</label>
                   <div className="flex items-center gap-3">
                      <div className="flex-1 relative">
                         <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                         <input 
                            type="time" 
                            className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={serviceStart}
                            onChange={(e) => setServiceStart(e.target.value)}
                         />
                         <p className="text-[10px] text-center mt-1 text-slate-400 font-bold">BUKA</p>
                      </div>
                      <span className="text-slate-300 font-bold">-</span>
                      <div className="flex-1 relative">
                         <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                         <input 
                            type="time" 
                            className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={serviceEnd}
                            onChange={(e) => setServiceEnd(e.target.value)}
                         />
                         <p className="text-[10px] text-center mt-1 text-slate-400 font-bold">TUTUP</p>
                      </div>
                   </div>
                </div>
            </div>
         </Section>

         {isAnalyzing && (
            <div className="flex flex-col items-center gap-3 py-10 bg-orange-50/50 rounded-[2.5rem] border-2 border-orange-100 border-dashed animate-pulse">
               <Loader2 className="animate-spin text-primary" size={40} />
               <div className="text-center">
                  <p className="text-sm font-black text-primary uppercase tracking-widest">AI sedang Menganalisis...</p>
                  <p className="text-[10px] text-orange-400 font-medium">Memverifikasi kesegaran, kehalalan & nutrisi</p>
               </div>
            </div>
         )}

         {qualityResult && (
            <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
               <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-2xl rounded-[2.5rem] overflow-hidden relative">
                  <div className="relative z-10 space-y-6">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">AI Quality Score</p>
                           <h2 className="text-5xl font-black">{qualityResult.qualityPercentage}%</h2>
                        </div>
                        <div className={`p-3.5 rounded-2xl ${qualityResult.isSafe ? 'bg-emerald-500' : 'bg-rose-500'} shadow-lg`}>
                           {qualityResult.isSafe ? <CheckCircle size={28} /> : <AlertCircle size={28} />}
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/5">
                           <p className="text-[9px] uppercase font-bold opacity-60 mb-1">Higienitas</p>
                           <p className="text-sm font-black flex items-center gap-2"><Zap size={16} className="text-yellow-400 fill-yellow-400"/> {qualityResult.hygieneScore}/100</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/5">
                           <p className="text-[9px] uppercase font-bold opacity-60 mb-1">Status Halal</p>
                           <p className="text-sm font-black flex items-center gap-2">
                              <ShieldCheck size={16} className={qualityResult.isHalal ? 'text-emerald-400' : 'text-rose-400'}/>
                              {qualityResult.isHalal ? 'Halal AI' : 'Non-Halal'}
                           </p>
                        </div>
                     </div>
                     
                     <div className="pt-3 border-t border-white/10">
                        <p className="text-[10px] opacity-70 italic leading-relaxed">"{qualityResult.reasoning}"</p>
                     </div>
                  </div>
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
               </Card>
               
               {!isQualified && (
                 <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex gap-3 animate-in shake duration-300">
                    <AlertTriangle size={24} className="text-rose-500 shrink-0" />
                    <div>
                      <p className="text-[11px] text-rose-700 font-bold uppercase tracking-wider mb-1">Produk Tidak Lolos Verifikasi</p>
                      <p className="text-[10px] text-rose-600 leading-relaxed">
                        Maaf, skor kualitas di bawah 60% atau terdeteksi Non-Halal. Jika Anda yakin produk ini aman dan halal, silakan hubungi CS untuk validasi manual via Voice Chat.
                      </p>
                    </div>
                 </div>
               )}
            </div>
         )}

         <div className="space-y-4 pt-4">
            {formError && (
              <div className="bg-rose-50 border-2 border-rose-200 p-4 rounded-[1.5rem] flex items-center gap-4 animate-in slide-in-from-bottom-2 duration-300">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                   <AlertCircle className="text-rose-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-rose-800 leading-tight">{formError}</p>
                </div>
                <button onClick={() => setFormError(null)} className="p-1 hover:bg-rose-100 rounded-full text-rose-400 transition-colors">
                  <X size={16} />
                </button>
              </div>
            )}

            {!hasCheckedQuality ? (
              <Button 
                variant="outline-primary" 
                className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs border-2" 
                onClick={runQualityCheck}
                isLoading={isAnalyzing}
              >
                <Sparkles size={18} className="mr-2"/> Cek Kualitas AI
              </Button>
            ) : (
              <div className="flex flex-col gap-3">
                 {isQualified ? (
                   <Button 
                     className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-xs" 
                     onClick={handleUpload}
                   >
                     Simpan ke Inventory
                   </Button>
                 ) : (
                   <Button 
                     variant="outline" 
                     className="w-full h-14 rounded-2xl border-primary text-primary font-black uppercase tracking-widest text-xs hover:bg-primary/5" 
                     onClick={handleContactCS}
                   >
                     <MessageCircle size={18} className="mr-2"/> Kontak CS via Voice Chat
                   </Button>
                 )}
                 <Button variant="ghost" className="w-full text-slate-400 text-xs font-bold" onClick={() => setHasCheckedQuality(false)}>Analisis Ulang</Button>
              </div>
            )}
            {!hasCheckedQuality && (
              <button onClick={() => navigate('PARTNER_INVENTORY')} className="w-full py-3 text-slate-400 font-bold text-xs uppercase tracking-widest">Batal</button>
            )}
         </div>
      </div>
      
      <DateTimeModal 
         isOpen={isDateModalOpen} 
         onClose={() => setIsDateModalOpen(false)} 
         onSave={(val) => setProductionTime(val)} 
         initialValue={productionTime} 
      />
    </div>
  );
};

export const SuccessScreen: React.FC<PartnerProps> = ({ navigate }) => {
  return (
    <div className="flex flex-col h-full bg-white items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
       <div className="w-24 h-24 bg-emerald-100 rounded-[2rem] flex items-center justify-center mb-8 shadow-sm">
          <CheckCircle size={48} className="text-emerald-500" />
       </div>
       <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Produk Ditambahkan!</h2>
       <p className="text-sm text-slate-500 mb-12 max-w-[240px] leading-relaxed font-medium">
          Terima kasih telah berkontribusi mengurangi food waste. Produk Anda kini terlihat oleh pengguna sekitar.
       </p>
       
       <div className="w-full space-y-3">
          <Button 
             className="w-full h-14 rounded-2xl shadow-xl shadow-emerald-500/20 bg-emerald-500 hover:bg-emerald-600 font-black uppercase tracking-widest text-xs" 
             onClick={() => navigate('PARTNER_INVENTORY')}
          >
             Lihat Inventory
          </Button>
          <Button 
             variant="ghost" 
             className="w-full text-slate-400 font-bold text-xs uppercase tracking-widest" 
             onClick={() => navigate('PARTNER_DASHBOARD')}
          >
             Ke Beranda
          </Button>
       </div>
    </div>
  );
};
