import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  RadialBarChart, RadialBar, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid 
} from 'recharts';
import { SegmentMetric, SourceMetric, VelocityMetric } from '../types';
import { Target, Zap, TrendingUp, AlertOctagon, Layers, X } from 'lucide-react';
import { getSegmentOptimizationAdvice } from '../services/geminiService';

interface Props {
  segments: SegmentMetric[];
  sources: SourceMetric[];
  velocity: VelocityMetric[];
  isProcessing: boolean;
}

const SegmentOpportunityUniverse: React.FC<Props> = ({ segments, sources, velocity, isProcessing }) => {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const bestSource = useMemo(() => sources.reduce((prev, current) => (prev.leadScore > current.leadScore) ? prev : current), [sources]);
  const bestSegment = useMemo(() => segments.reduce((prev, current) => (prev.value > current.value) ? prev : current), [segments]);

  const handleAiStrategy = async () => {
    setAiModalOpen(true);
    setAiLoading(true);
    setAiResult(null);
    const result = await getSegmentOptimizationAdvice(sources, segments);
    setAiResult(result);
    setAiLoading(false);
  };

  return (
    <div className="relative w-full bg-slate-900/40 border border-fuchsia-900/30 rounded-2xl p-6 backdrop-blur-sm shadow-2xl overflow-hidden mt-6">
      
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-white/5 pb-4">
        <div>
           <h2 className="text-2xl font-cyber font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-amber-300 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)] flex items-center gap-2">
             <Layers className="text-fuchsia-400" />
             SEGMENT VE FIRSAT EVRENİ
           </h2>
           <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">
             Kaynak Akışı • Değer Dağılımı • Dönüşüm Hızı
           </p>
        </div>

        <button 
          onClick={handleAiStrategy}
          className="group relative flex items-center space-x-2 bg-amber-950/30 border border-amber-500/50 hover:bg-amber-900/40 px-5 py-2 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
        >
          <Target className="text-amber-400 w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
          <span className="font-cyber text-xs font-bold text-amber-200 group-hover:text-white tracking-wider">
            STRATEJİK YÖNLENDİRME
          </span>
        </button>
      </div>

      {/* Content Grid */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-opacity duration-700 ${isProcessing ? 'opacity-40 blur-sm' : 'opacity-100'}`}>
          
          {/* Column 1: Source Flow (Waterfall/Funnel Vibe) */}
          <div className="bg-slate-950/40 rounded-xl p-4 border border-white/5 relative group hover:border-cyan-500/30 transition-colors">
              <h3 className="font-cyber text-xs text-cyan-300 uppercase mb-4 flex items-center gap-2">
                  <TrendingUp size={14} /> Kaynak Kalite Akışı
              </h3>
              <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sources} layout="vertical" margin={{ left: 0 }}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="source" type="category" width={70} tick={{fill: '#94a3b8', fontSize: 10}} tickLine={false} axisLine={false} />
                          <Tooltip 
                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#22d3ee', borderRadius: '8px' }}
                            itemStyle={{ color: '#22d3ee' }}
                          />
                          <Bar dataKey="leadScore" barSize={15} radius={[0, 4, 4, 0]}>
                            {sources.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill="url(#sourceGradient)" />
                            ))}
                          </Bar>
                          <defs>
                              <linearGradient id="sourceGradient" x1="0" y1="0" x2="1" y2="0">
                                  <stop offset="0%" stopColor="#0891b2" stopOpacity={0.4} />
                                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={1} />
                              </linearGradient>
                          </defs>
                      </BarChart>
                  </ResponsiveContainer>
              </div>
              <div className="mt-2 pt-2 border-t border-white/5">
                  <p className="text-[10px] text-slate-400 italic">
                      "<span className="text-cyan-400 font-bold">{bestSource.source}</span> kaynaklı liderlerin kalite puanı diğerlerinden %25 daha yüksek."
                  </p>
              </div>
          </div>

          {/* Column 2: Segment Universe (Radial/Orbital) */}
          <div className="bg-slate-950/40 rounded-xl p-4 border border-white/5 relative group hover:border-fuchsia-500/30 transition-colors flex flex-col items-center">
              <div className="absolute top-0 right-0 p-2">
                  <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-ping"></div>
              </div>
              <h3 className="font-cyber text-xs text-fuchsia-300 uppercase mb-2 w-full text-left flex items-center gap-2">
                  <Layers size={14} /> Fırsat Evreni (B2B/B2C)
              </h3>
              <div className="h-56 w-full relative">
                  {/* Holographic Glow for Best Segment */}
                  <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-500/10 to-transparent rounded-full blur-xl pointer-events-none"></div>
                  
                  <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart 
                        innerRadius="20%" 
                        outerRadius="100%" 
                        barSize={20} 
                        data={segments} 
                        startAngle={180} 
                        endAngle={0}
                      >
                          <RadialBar
                            label={{ position: 'insideStart', fill: '#fff', fontSize: 10, fontWeight: 'bold' }} 
                            background={{ fill: '#334155', opacity: 0.3 }}
                            dataKey="value"
                          />
                          <Legend 
                            iconSize={8} 
                            layout="horizontal" 
                            verticalAlign="bottom" 
                            align="center"
                            wrapperStyle={{ fontSize: '10px', color: '#94a3b8' }} 
                          />
                          <Tooltip 
                             contentStyle={{ backgroundColor: '#0f172a', borderColor: '#d946ef', borderRadius: '8px' }}
                             itemStyle={{ color: '#fff' }}
                          />
                      </RadialBarChart>
                  </ResponsiveContainer>
              </div>
              <div className="mt-[-10px] text-center w-full">
                  <p className="text-[10px] text-slate-400 italic">
                      "<span className="text-fuchsia-400 font-bold">{bestSegment.name}</span> segmenti toplam değer havuzunun %{(bestSegment.value / segments.reduce((a,b)=>a+b.value, 0) * 100).toFixed(0)}'ini oluşturuyor."
                  </p>
              </div>
          </div>

          {/* Column 3: Velocity (Speedometer/Gauge Concept) */}
          <div className="bg-slate-950/40 rounded-xl p-4 border border-white/5 relative group hover:border-green-500/30 transition-colors">
              <h3 className="font-cyber text-xs text-green-300 uppercase mb-4 flex items-center gap-2">
                  <Zap size={14} /> Dönüşüm Hızı (Velocity)
              </h3>
              
              <div className="space-y-6 mt-4">
                  {velocity.map((v, i) => (
                      <div key={i} className="relative">
                          <div className="flex justify-between text-[10px] text-slate-400 mb-1 uppercase tracking-wider">
                              <span>{v.segment}</span>
                              <span className="text-white font-bold">{v.velocityDays} Gün</span>
                          </div>
                          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative">
                              {/* Velocity Bar */}
                              <div 
                                className={`h-full rounded-full relative overflow-hidden ${i === 0 ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24]' : 'bg-slate-500'}`}
                                style={{ width: `${100 - (v.velocityDays * 2)}%` }} // Inverse logic: fewer days = longer bar (speed)
                              >
                                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                              </div>
                          </div>
                          <span className="text-[9px] text-slate-500 mt-1 block">
                             {v.volume} Kullanıcı / Dönüşüm
                          </span>
                      </div>
                  ))}
              </div>
              <div className="mt-8 pt-2 border-t border-white/5">
                  <p className="text-[10px] text-slate-400 italic">
                      "Premium kullanıcılar Freemium'a göre <span className="text-green-400 font-bold">2.5 kat</span> daha hızlı karar veriyor."
                  </p>
              </div>
          </div>
      </div>

      {/* AI Strategy Modal - MOVED TO PORTAL FOR FULL SCREEN VIEW */}
      {aiModalOpen && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in zoom-in duration-300">
              {/* Main Modal Container */}
              <div className="bg-slate-900 border border-amber-500 rounded-2xl w-full max-w-3xl shadow-[0_0_100px_rgba(245,158,11,0.3)] flex flex-col max-h-[85vh] overflow-hidden relative">
                  
                  {/* Fixed Header */}
                  <div className="flex-shrink-0 p-6 bg-amber-950/30 border-b border-amber-500/30 flex justify-between items-center">
                       <div>
                           <h3 className="font-cyber text-amber-400 flex items-center gap-2 text-xl tracking-wider">
                              <Target size={24} />
                              STRATEJİK YÖNLENDİRME PROTOKOLÜ
                           </h3>
                           <p className="text-[10px] text-amber-500/60 uppercase mt-1">Yapay Zeka Destekli Karar Mekanizması</p>
                       </div>
                       <button onClick={() => setAiModalOpen(false)} className="text-slate-500 hover:text-white transition-colors bg-slate-950 p-2 rounded-full border border-slate-800 hover:border-white">
                          <X size={24}/>
                       </button>
                  </div>
                  
                  {/* Scrollable Content Body */}
                  <div className="p-8 flex-1 overflow-y-auto custom-scrollbar relative">
                      {aiLoading ? (
                          <div className="flex flex-col items-center gap-6 h-full justify-center min-h-[300px]">
                              <div className="relative">
                                  <div className="w-24 h-24 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                      <Zap className="text-amber-500 animate-pulse" size={32} />
                                  </div>
                              </div>
                              <p className="font-cyber text-amber-200 animate-pulse text-sm tracking-widest">PAZAR VERİLERİ SİMÜLE EDİLİYOR...</p>
                          </div>
                      ) : aiResult ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              
                              {/* Left Column: Alerts */}
                              <div className="space-y-6">
                                  {/* Budget Allocation Advice */}
                                  <div className="relative bg-gradient-to-r from-emerald-900/40 to-slate-900 p-6 rounded-xl border-l-4 border-emerald-500 shadow-lg">
                                      <div className="absolute top-0 right-0 p-3 opacity-20">
                                          <TrendingUp size={40} className="text-emerald-500" />
                                      </div>
                                      <h4 className="text-emerald-400 font-bold text-xs uppercase mb-3 tracking-widest flex items-center gap-2">
                                          <Zap size={14} /> Bütçe Optimizasyonu
                                      </h4>
                                      <p className="text-white text-lg leading-relaxed">{aiResult.allocationAdvice}</p>
                                  </div>

                                  {/* Efficiency Alert */}
                                  <div className="relative bg-gradient-to-r from-red-900/40 to-slate-900 p-6 rounded-xl border-l-4 border-red-500 shadow-lg">
                                      <div className="absolute top-0 right-0 p-3 opacity-20">
                                          <AlertOctagon size={40} className="text-red-500" />
                                      </div>
                                      <h4 className="text-red-400 font-bold text-xs uppercase mb-3 tracking-widest flex items-center gap-2">
                                          <AlertOctagon size={14} /> Verimsizlik Alarmı
                                      </h4>
                                      <p className="text-white text-lg leading-relaxed">{aiResult.inefficiencyAlert}</p>
                                  </div>
                              </div>

                              {/* Right Column: Rationale & Action */}
                              <div className="flex flex-col justify-between space-y-6">
                                  {/* Rationale */}
                                  <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800 flex-1">
                                      <span className="text-slate-500 text-[10px] uppercase font-bold block mb-3 border-b border-slate-800 pb-2">ANALİZ GEREKÇESİ (AI LOG)</span>
                                      <p className="text-slate-300 italic text-lg leading-relaxed">"{aiResult.rationale}"</p>
                                  </div>

                                  <button onClick={() => setAiModalOpen(false)} className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-cyber py-4 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 font-bold text-lg">
                                      <Target size={20} /> ÖNERİLERİ KAYDET VE KAPAT
                                  </button>
                              </div>
                          </div>
                      ) : (
                          <div className="text-red-400 text-center text-xl font-bold">Analiz başarısız oldu.</div>
                      )}
                  </div>
              </div>
          </div>,
          document.body
      )}

    </div>
  );
};

export default SegmentOpportunityUniverse;