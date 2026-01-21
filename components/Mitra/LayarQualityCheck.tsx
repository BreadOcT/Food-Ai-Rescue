
import React, { useState, useRef } from 'react';
import { Camera, Sparkles, CheckCircle, AlertCircle, ShieldCheck as ShieldIcon, Zap, Loader2, Info, Clock, ThermometerSnowflake, ShieldCheck, PlusCircle } from 'lucide-react';
import { Button, Card, Section, Badge, ScreenLayout, Header, ScrollableContent } from '../ui';
import { analyzeFoodQuality, QualityAnalysisResult } from '../../services/geminiService';
import { FiturProps } from '../../types';
import { dbLogQualityCheck } from '../../services/databaseService';

/**
 * AnalysisDashboard: Merender hasil detail dari analisis Gemini AI
 */
const AnalysisDashboard: React.FC<{ result: QualityAnalysisResult; onNewScan: () => void; onAddToInventory: () => void }> = ({ result, onNewScan, onAddToInventory }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      {/* Hero Stats Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-2xl border border-white/10">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Quality Percentage</p>
              <h2 className="text-6xl font-black tracking-tighter">{result.qualityPercentage}%</h2>
            </div>
            <div className={`p-4 rounded-3xl ${result.isSafe ? 'bg-emerald-500' : 'bg-rose-500'} shadow-lg animate-pulse`}>
              {result.isSafe ? <CheckCircle size={36} /> : <AlertCircle size={36} />}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/5 group hover:bg-white/20 transition-all">
              <p className="text-[10px] uppercase font-bold opacity-60 mb-1 tracking-widest">Hygiene Score</p>
              <p className="text-xl font-black flex items-center gap-2"><Zap size={20} className="text-yellow-400 fill-yellow-400"/> {result.hygieneScore}/100</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/5 group hover:bg-white/20 transition-all">
              <p className="text-[10px] uppercase font-bold opacity-60 mb-1 tracking-widest">Status Halal</p>
              <p className="text-xl font-black flex items-center gap-2">
                <ShieldIcon size={20} className={result.isHalal ? 'text-emerald-400 fill-emerald-400/20' : 'text-rose-400'}/>
                {result.isHalal ? 'Halal' : 'Non-Halal'}
              </p>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10">
             <p className="text-xs opacity-80 italic leading-relaxed">"{result.reasoning}"</p>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
      </div>

      {/* Action Buttons Area */}
      {result.isSafe && (
        <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 p-4 rounded-3xl">
           <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Kualitas Terverifikasi</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Produk ini layak untuk dijual/didonasikan.</p>
              </div>
           </div>
           <Button 
             onClick={onAddToInventory}
             className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 h-12 rounded-2xl font-bold text-xs uppercase tracking-widest"
           >
             <PlusCircle size={16} className="mr-2" /> Tambahkan ke Inventory
           </Button>
        </div>
      )}

      <Section title="Item Terdeteksi">
        <div className="flex flex-wrap gap-2">
          {result.detectedItems.map((item, idx) => (
            <Badge key={idx} color="blue" className="px-3 py-1.5 uppercase tracking-wider font-black">{item.name} • {item.category}</Badge>
          ))}
        </div>
      </Section>

      <div className="grid grid-cols-1 gap-4">
        <Card className="p-5 border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3">
             <AlertCircle size={18} className="text-rose-500" />
             <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Peringatan Alergen</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.allergens.length > 0 ? result.allergens.map((alg, idx) => (
              <Badge key={idx} color="red" className="px-2 py-1">{alg}</Badge>
            )) : (
              <span className="text-xs text-slate-500 font-medium">Tidak ada alergen kritis terdeteksi.</span>
            )}
          </div>
        </Card>
        
        <Card className="p-5 border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
             <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prediksi Masa Simpan</p>
            <p className="text-sm font-black text-slate-900 dark:text-white">{result.shelfLifePrediction}</p>
          </div>
        </Card>
      </div>

      <Section title="Panduan & Dampak">
        <div className="space-y-3">
          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
             <h4 className="text-xs font-black mb-3 uppercase tracking-widest text-primary flex items-center gap-2">
               <ThermometerSnowflake size={16} /> Tips Penyimpanan
             </h4>
             <ul className="space-y-2">
                {result.storageTips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex gap-2 font-medium">
                    <span className="text-primary font-black">{idx + 1}.</span> {tip}
                  </li>
                ))}
             </ul>
          </div>
        </div>
      </Section>

      <div className="pb-20 pt-4">
        <Button variant="ghost" className="w-full text-slate-400 font-bold text-[10px] uppercase tracking-widest" onClick={onNewScan}>Scan Ulang</Button>
      </div>
    </div>
  );
};

export const LayarQualityCheck: React.FC<FiturProps> = ({ navigate, goBack, globalState, setGlobalState }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<QualityAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalysis = async (base64: string) => {
    setImage(base64);
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeFoodQuality(["Hasil scan kamera"], base64);
      setResult(analysis);
      
      const history = globalState.qualityHistory || [];
      setGlobalState('qualityHistory', [
        { ...analysis, id: Date.now(), image: base64, timestamp: new Date().toISOString() },
        ...history
      ]);

      // Kirim log ke Sheets untuk laporan dampak
      dbLogQualityCheck(analysis, globalState.user?.name || "User");

    } catch (error) {
      console.error("AI Analysis error:", error);
      alert("Terjadi kesalahan teknis saat analisis. Silakan coba kembali.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => handleAnalysis(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddToInventory = () => {
    if (!result || !image) return;
    
    // Simpan data sementara ke global state untuk diambil di halaman Upload
    setGlobalState('tempProductData', {
      name: result.detectedItems[0]?.name || "",
      category: result.detectedItems[0]?.category || "Makanan Berat",
      image: image,
      qualityPercentage: result.qualityPercentage,
      description: result.reasoning || "Diverifikasi oleh AI",
      shelfLife: result.shelfLifePrediction
    });

    navigate('UPLOAD_PRODUCT');
  };

  return (
    <ScreenLayout bgClass="bg-slate-50 dark:bg-slate-950">
      <Header 
        title="AI Quality Check" 
        onBack={result ? () => setResult(null) : goBack} 
      />
      <ScrollableContent className="p-6">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-24 gap-8">
            <div className="relative">
              <div className="w-28 h-28 bg-orange-50 dark:bg-orange-900/10 rounded-[3rem] flex items-center justify-center animate-pulse">
                <Sparkles className="text-primary" size={56} />
              </div>
              <div className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg">
                <Loader2 className="animate-spin text-primary" size={24} />
              </div>
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Menganalisis Kualitas...</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[240px] mx-auto font-medium leading-relaxed">
                Gemini AI sedang memverifikasi standar higienitas, kehalalan, dan memprediksi masa simpan produk surplus Anda.
              </p>
            </div>
          </div>
        ) : result ? (
          <AnalysisDashboard 
            result={result} 
            onNewScan={() => { setResult(null); setImage(null); }} 
            onAddToInventory={handleAddToInventory}
          />
        ) : (
          <div className="space-y-12 py-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                 <ShieldCheck size={40} className="text-primary" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Food Guard AI</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto font-medium">
                Pindai makanan surplus Anda. Dapatkan verifikasi kualitas profesional berbasis AI dalam hitungan detik.
              </p>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square w-full max-w-[320px] mx-auto rounded-[3.5rem] border-4 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center justify-center gap-5 cursor-pointer hover:border-primary/50 transition-all group overflow-hidden relative shadow-xl hover:shadow-primary/5"
            >
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <Camera size={44} className="text-slate-300 group-hover:text-primary transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Ketuk Kamera</p>
                <p className="text-xs text-slate-400 font-bold mt-1 uppercase">Scan atau Unggah Foto</p>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onFileChange} />
            </div>
            
            <div className="pb-10">
               <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                 <Info size={12} /> Hasil analisis AI hanya sebagai panduan tambahan.
               </p>
            </div>
          </div>
        )}
      </ScrollableContent>
    </ScreenLayout>
  );
};
