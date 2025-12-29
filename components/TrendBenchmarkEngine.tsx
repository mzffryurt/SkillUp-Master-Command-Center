import React, { useState, useEffect } from 'react';
import { BenchmarkScenario, BenchmarkMetric, KPIMetric, BenchmarkAnalysis } from '../types';
import { ArrowUpRight, ArrowDownRight, GitCompare, Zap, MoveRight, TrendingUp, AlertTriangle, X, RefreshCw } from 'lucide-react';
import { getTrendAnalysis } from '../services/geminiService';

interface Props {
  metrics: KPIMetric[];
}

const TrendBenchmarkEngine: React.FC<Props> = ({ metrics }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState<BenchmarkScenario>('Week vs Week');
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkMetric[]>([]);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analysis, setAnalysis] = useState<BenchmarkAnalysis | null>(null);

  // Generate Mock Previous Data based on current metrics and scenario
  useEffect(() => {
    if (!isOpen) return;

    const varianceMap = {
        'Week vs Week': 0.15, // +/- 15%
        'Month vs Month': 0.25,
        'Year vs Year': 0.40,
        'Campaign Pre/Post': 0.30
    };
    
    const variance = varianceMap[activeScenario];
    
    // Select top 4 metrics to benchmark to keep UI clean
    const targetMetrics = metrics.slice(0, 4);

    const data: BenchmarkMetric[] = targetMetrics.map(m => {
        const currentVal = parseFloat(m.value.toString().replace(/[^0-9.]/g, '')) || 50;
        // Randomly determine if previous was higher or lower
        const direction = Math.random() > 0.5 ? 1 : -1;
        const changeFactor = Math.random() * variance * direction;
        const previousVal = currentVal * (1 - changeFactor);
        const changePct = ((currentVal - previousVal) / previousVal) * 100;

        return {
            name: m.title,
            current: parseFloat(currentVal.toFixed(1)),
            previous: parseFloat(previousVal.toFixed(1)),
            change: parseFloat(changePct.toFixed(1)),
            unit: m.unit
        };
    });

    setBenchmarkData(data);
    setAnalysis(null); // Reset analysis on scenario change
  }, [activeScenario, metrics, isOpen]);

  const handleRunAnalysis = async () => {
      setIsAnalysing(true);
      const result = await getTrendAnalysis(benchmarkData, activeScenario);
      setAnalysis(result);
      setIsAnalysing(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/50 hover:bg-emerald-900/50 text-emerald-400 font-cyber text-sm transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]"
      >
        <GitCompare size={16} />
        <span className="hidden lg:inline">Trend Kıyasla</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
           {/* Background Waves Animation */}
           <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
               <div className="absolute top-1/2 left-0 right-0 h-1 bg-emerald-500 blur-xl animate-pulse"></div>
               <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-cyan-500 blur-lg animate-pulse delay-100"></div>
               <div className="absolute bottom-1/4 left-0 right-0 h-0.5 bg-fuchsia-500 blur-lg animate-pulse delay-200"></div>
           </div>

           <div className="relative w-full max-w-4xl bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-[0_0_80px_rgba(16,185,129,0.1)] overflow-hidden flex flex-col max-h-[90vh]">
               
               {/* Header */}
               <div className="p-6 border-b border-emerald-500/20 flex justify-between items-center bg-slate-950/50 flex-shrink-0">
                   <div>
                       <h2 className="text-2xl font-cyber font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center gap-3">
                           <GitCompare className="text-emerald-400" />
                           PERFORMANS & TREND MOTORU
                       </h2>
                       <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Zamanlar Arası Veri Çarpıştırma Simülasyonu</p>
                   </div>
                   <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={24}/></button>
               </div>

               {/* Scenario Selector (Fixed below header) */}
               <div className="flex gap-2 p-4 bg-slate-950/80 border-b border-white/5 overflow-x-auto flex-shrink-0">
                   {(['Week vs Week', 'Month vs Month', 'Year vs Year', 'Campaign Pre/Post'] as BenchmarkScenario[]).map(s => (
                       <button
                          key={s}
                          onClick={() => setActiveScenario(s)}
                          className={`px-4 py-2 rounded text-xs font-cyber font-bold whitespace-nowrap transition-all border ${
                              activeScenario === s 
                              ? 'bg-emerald-900/30 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                              : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                          }`}
                       >
                           {s}
                       </button>
                   ))}
               </div>

               {/* Scrollable Body */}
               <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 custom-scrollbar">
                   
                   {/* Visualization Engine */}
                   <div className="space-y-6">
                       <h3 className="font-cyber text-sm text-slate-300 uppercase tracking-wider flex items-center gap-2">
                           <TrendingUp size={16} className="text-emerald-400" /> Kıyaslama Görselleri
                       </h3>

                       {benchmarkData.map((data, idx) => (
                           <div key={idx} className="bg-slate-950/40 p-4 rounded-xl border border-white/5 relative group">
                               <div className="flex justify-between items-center mb-3">
                                   <span className="text-sm font-bold text-white">{data.name}</span>
                                   <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded ${data.change >= 0 ? 'bg-emerald-900/30 text-emerald-400' : 'bg-rose-900/30 text-rose-400'}`}>
                                       {data.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                       %{Math.abs(data.change)}
                                   </div>
                               </div>

                               {/* Comparison Bars */}
                               <div className="space-y-2">
                                   {/* Current */}
                                   <div className="flex items-center gap-3">
                                       <span className="text-[10px] text-slate-500 w-12 uppercase text-right">Şu An</span>
                                       <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                           <div 
                                             className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4] transition-all duration-1000"
                                             style={{ width: `${Math.min((data.current / (Math.max(data.current, data.previous) * 1.2)) * 100, 100)}%` }}
                                           ></div>
                                       </div>
                                       <span className="text-xs text-cyan-300 w-12 font-cyber text-right">{data.current}</span>
                                   </div>
                                   {/* Previous */}
                                   <div className="flex items-center gap-3">
                                       <span className="text-[10px] text-slate-500 w-12 uppercase text-right">Önce</span>
                                       <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                           <div 
                                             className="h-full bg-slate-500 opacity-50 transition-all duration-1000"
                                             style={{ width: `${Math.min((data.previous / (Math.max(data.current, data.previous) * 1.2)) * 100, 100)}%` }}
                                           ></div>
                                       </div>
                                       <span className="text-xs text-slate-500 w-12 font-cyber text-right">{data.previous}</span>
                                   </div>
                               </div>
                           </div>
                       ))}
                   </div>

                   {/* AI Insight Engine */}
                   <div className="flex flex-col h-full bg-slate-950/60 rounded-xl border border-emerald-500/20 p-6 relative overflow-hidden min-h-[400px]">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px] pointer-events-none"></div>

                       <div className="flex items-center justify-between mb-6 relative z-10">
                           <h3 className="font-cyber text-sm text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                               <Zap size={16} /> AI Trend Yönetimi
                           </h3>
                           {!isAnalysing && !analysis && (
                               <button 
                                onClick={handleRunAnalysis}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-cyber flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all"
                               >
                                   <RefreshCw size={12} /> ANALİZ ET
                               </button>
                           )}
                       </div>

                       {isAnalysing ? (
                           <div className="flex-1 flex flex-col items-center justify-center gap-4">
                               <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                               <p className="font-cyber text-emerald-200 animate-pulse text-xs">MOMENTUM HESAPLANIYOR...</p>
                           </div>
                       ) : analysis ? (
                           <div className="flex-1 flex flex-col gap-6 animate-in slide-in-from-right-4 duration-500">
                               
                               {/* Story Section */}
                               <div>
                                   <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1 mb-2">
                                       <MoveRight size={12} /> Otomatik Hikaye
                                   </span>
                                   <p className="text-white text-sm leading-relaxed border-l-2 border-slate-600 pl-3">
                                       "{analysis.story}"
                                   </p>
                               </div>

                               {/* Action Section */}
                               <div className={`p-4 rounded-lg border flex-1 flex flex-col justify-center ${
                                   analysis.strategyType === 'OPPORTUNITY' 
                                   ? 'bg-emerald-900/20 border-emerald-500/40' 
                                   : 'bg-amber-900/20 border-amber-500/40'
                               }`}>
                                   <h4 className={`font-cyber font-bold mb-2 flex items-center gap-2 ${
                                       analysis.strategyType === 'OPPORTUNITY' ? 'text-emerald-400' : 'text-amber-400'
                                   }`}>
                                       {analysis.strategyType === 'OPPORTUNITY' ? <Zap size={18} /> : <AlertTriangle size={18} />}
                                       {analysis.actionTitle}
                                   </h4>
                                   <p className="text-slate-300 text-sm">
                                       {analysis.actionDetail}
                                   </p>
                                   <button className={`mt-4 w-full py-2 rounded text-xs font-bold font-cyber bg-slate-900 border transition-all ${
                                       analysis.strategyType === 'OPPORTUNITY'
                                       ? 'text-emerald-400 border-emerald-500 hover:bg-emerald-900/50'
                                       : 'text-amber-400 border-amber-500 hover:bg-amber-900/50'
                                   }`}>
                                       STRATEJİYİ UYGULA
                                   </button>
                               </div>

                               <button 
                                onClick={handleRunAnalysis}
                                className="text-xs text-slate-500 hover:text-white underline self-center"
                               >
                                   Yeniden Analiz Et
                               </button>
                           </div>
                       ) : (
                           <div className="flex-1 flex items-center justify-center text-slate-500 text-sm italic">
                               Trend verilerini işlemek için analizi başlatın.
                           </div>
                       )}
                   </div>

               </div>
           </div>
        </div>
      )}
    </>
  );
};

export default TrendBenchmarkEngine;