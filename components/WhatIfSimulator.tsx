import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { SimulationState, SimulationFeedback } from '../types';
import { Sliders, Activity, AlertTriangle, Zap, BrainCircuit, RefreshCw, BarChart2 } from 'lucide-react';
import { getSimulationInsight } from '../services/geminiService';

const WhatIfSimulator: React.FC = () => {
  // --- STATE ---
  const [state, setState] = useState<SimulationState>({
    priceChange: 0,
    marketingBudget: 'Balanced',
    leadQuality: 'Broad',
    contentFreq: 'Weekly'
  });

  const [feedback, setFeedback] = useState<SimulationFeedback | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- LOGIC: Probabilistic Math Engine (Client-Side) ---
  const simulationData = useMemo(() => {
    // Base Baseline
    let baseRevenue = 340000; // Monthly
    let baseChurn = 5.0; // %
    let baseSubs = 5000;
    
    // Coefficients
    const priceElasticity = -0.4; // Demand drops when price rises
    const churnSensitivityToPrice = 0.05; // Churn rises slightly with price
    
    const budgetFactors = { 'Limited': 0.8, 'Balanced': 1.0, 'Aggressive': 1.4 };
    const qualityFactors = { 'Broad': { vol: 1.2, churn: 1.1 }, 'High Value': { vol: 0.8, churn: 0.7 } };
    const freqFactors = { 'Monthly': { cost: 1.0, ret: 1.0 }, 'Weekly': { cost: 1.2, ret: 0.9 }, 'Daily': { cost: 1.5, ret: 0.8 } };

    // Apply Impacts
    const priceFactor = 1 + (state.priceChange / 100);
    const volumeImpact = (1 + (state.priceChange / 100 * priceElasticity));
    
    const budgetMult = budgetFactors[state.marketingBudget];
    const qualityMult = qualityFactors[state.leadQuality];
    const freqMult = freqFactors[state.contentFreq];

    // Forecast Generation (6 Months)
    const months = ['Ay 1', 'Ay 2', 'Ay 3', 'Ay 4', 'Ay 5', 'Ay 6'];
    let currentSubs = baseSubs;
    let currentChurn = baseChurn * priceFactor * qualityMult.churn * freqMult.ret;
    if (state.priceChange > 20) currentChurn += (state.priceChange - 20) * 0.1; // Penalty for extreme price hikes

    return months.map((month, i) => {
        // Growth Logic
        let newSubs = (500 * volumeImpact * budgetMult * qualityMult.vol);
        
        // Random Noise (Uncertainty)
        const volatility = 0.05 + (i * 0.02); // Uncertainty grows over time
        
        // Calculate Bounds
        const bestCaseGrowth = newSubs * (1 + volatility);
        const worstCaseGrowth = newSubs * (1 - volatility);
        const bestCaseChurn = Math.max(0.5, currentChurn * (1 - volatility));
        const worstCaseChurn = currentChurn * (1 + volatility);

        // Update Running Totals (Expected)
        const lostSubs = currentSubs * (currentChurn / 100);
        currentSubs = currentSubs - lostSubs + newSubs;
        const revenue = currentSubs * (68 * priceFactor); // $68 avg ARPU base

        // Calculate Revenue Bounds (Approximation for visualization)
        const revBest = revenue * (1 + (volatility * 1.5));
        const revWorst = revenue * (1 - (volatility * 1.5));

        return {
            name: month,
            revenue: Math.round(revenue / 1000), // in K
            revenueRange: [Math.round(revWorst/1000), Math.round(revBest/1000)], // [min, max]
            churn: parseFloat(currentChurn.toFixed(1)),
            churnRange: [parseFloat(bestCaseChurn.toFixed(1)), parseFloat(worstCaseChurn.toFixed(1))],
            newSubs: Math.round(newSubs)
        };
    });
  }, [state]);

  // --- AUTOMATED STORY ---
  const autoStory = useMemo(() => {
     const revChange = state.priceChange > 0 ? "artış" : state.priceChange < 0 ? "azalış" : "stabil";
     const churnDir = state.priceChange > 10 ? "ciddi risk" : "yönetilebilir";
     return `Fiyatı %${state.priceChange} ${revChange} yönünde değiştirip ${state.marketingBudget === 'Aggressive' ? 'agresif' : 'dengeli'} bütçe uygularsanız, ciroda %${Math.abs(Math.round(state.priceChange * 0.6))} değişim öngörülürken, churn riski ${churnDir} seviyesindedir.`;
  }, [state]);

  // --- AI TRIGGER (Debounced) ---
  useEffect(() => {
      setIsProcessing(true);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      
      debounceTimer.current = setTimeout(async () => {
          const result = await getSimulationInsight(state);
          setFeedback(result);
          setIsProcessing(false);
      }, 1000); // 1 sec delay after last interaction

      return () => {
          if (debounceTimer.current) clearTimeout(debounceTimer.current);
      };
  }, [state]);

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-full animate-in fade-in duration-700">
      
      {/* LEFT: COCKPIT CONTROLS */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
         <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.1)] relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
             
             <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-cyan-950 rounded-lg border border-cyan-500/50">
                     <Sliders className="text-cyan-400" />
                 </div>
                 <div>
                     <h2 className="font-cyber font-bold text-white tracking-widest text-lg">SİMÜLASYON KONTROL</h2>
                     <p className="text-[10px] text-slate-400 uppercase">Parametreleri Ayarla • Geleceği Test Et</p>
                 </div>
             </div>

             {/* Controls */}
             <div className="space-y-8">
                 
                 {/* 1. Price Slider */}
                 <div className="space-y-3">
                     <div className="flex justify-between text-xs font-bold uppercase text-slate-400">
                         <span>Premium Fiyat Değişimi</span>
                         <span className={`${state.priceChange > 0 ? 'text-green-400' : state.priceChange < 0 ? 'text-red-400' : 'text-white'}`}>
                             {state.priceChange > 0 ? '+' : ''}{state.priceChange}%
                         </span>
                     </div>
                     <input 
                        type="range" 
                        min="-50" max="50" step="5"
                        value={state.priceChange}
                        onChange={(e) => setState({...state, priceChange: parseInt(e.target.value)})}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
                     />
                     <div className="flex justify-between text-[10px] text-slate-600 font-cyber">
                         <span>-50% (İndirim)</span>
                         <span>0%</span>
                         <span>+50% (Zam)</span>
                     </div>
                 </div>

                 {/* 2. Marketing Budget (Toggle) */}
                 <div className="space-y-3">
                     <label className="text-xs font-bold uppercase text-slate-400">Pazarlama Bütçesi</label>
                     <div className="grid grid-cols-3 gap-2">
                         {['Limited', 'Balanced', 'Aggressive'].map((opt) => (
                             <button
                                key={opt}
                                onClick={() => setState({...state, marketingBudget: opt as any})}
                                className={`py-2 px-1 rounded text-[10px] font-cyber border transition-all ${
                                    state.marketingBudget === opt 
                                    ? 'bg-fuchsia-900/40 border-fuchsia-500 text-fuchsia-300 shadow-[0_0_10px_#d946ef]' 
                                    : 'bg-slate-950 border-slate-700 text-slate-500 hover:border-slate-500'
                                }`}
                             >
                                 {opt}
                             </button>
                         ))}
                     </div>
                 </div>

                 {/* 3. Lead Quality (Toggle) */}
                 <div className="space-y-3">
                     <label className="text-xs font-bold uppercase text-slate-400">Lider Kalite Hedefi</label>
                     <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                         {['Broad', 'High Value'].map((opt) => (
                             <button
                                key={opt}
                                onClick={() => setState({...state, leadQuality: opt as any})}
                                className={`flex-1 py-2 rounded text-xs font-bold transition-all ${
                                    state.leadQuality === opt 
                                    ? 'bg-emerald-600 text-white shadow-lg' 
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                             >
                                 {opt === 'Broad' ? 'Geniş Kitle (Hacim)' : 'Yüksek Değer (Kalite)'}
                             </button>
                         ))}
                     </div>
                 </div>

                 {/* 4. Content Frequency (Knob Simulation - Simple Buttons here) */}
                 <div className="space-y-3">
                     <label className="text-xs font-bold uppercase text-slate-400">İçerik Yayın Sıklığı</label>
                     <div className="flex justify-between items-center bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                         {['Monthly', 'Weekly', 'Daily'].map((freq, idx) => (
                             <div key={freq} className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setState({...state, contentFreq: freq as any})}>
                                 <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                                     state.contentFreq === freq 
                                     ? 'bg-amber-400 border-amber-400 shadow-[0_0_10px_#fbbf24] scale-125' 
                                     : 'bg-transparent border-slate-600'
                                 }`}></div>
                                 <span className={`text-[10px] uppercase ${state.contentFreq === freq ? 'text-amber-300' : 'text-slate-600'}`}>{freq}</span>
                             </div>
                         ))}
                         <div className="h-0.5 bg-slate-700 w-full absolute mx-6 -z-10 top-1/2 -translate-y-2"></div> 
                     </div>
                 </div>

             </div>
         </div>

         {/* AI FEEDBACK PANEL */}
         <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative min-h-[200px]">
             <div className="flex items-center justify-between mb-4">
                 <h3 className="font-cyber text-sm text-indigo-300 flex items-center gap-2">
                     <BrainCircuit size={16} /> STRATEJİK GERİ BİLDİRİM
                 </h3>
                 {isProcessing && <RefreshCw size={14} className="animate-spin text-indigo-500" />}
             </div>

             {feedback ? (
                 <div className="space-y-4 animate-in slide-in-from-left-4 duration-500">
                     <div className="flex gap-3 items-start">
                         <AlertTriangle size={16} className="text-rose-400 mt-1 flex-shrink-0" />
                         <div>
                             <span className="text-[10px] font-bold text-rose-400 uppercase">Risk</span>
                             <p className="text-xs text-slate-300 leading-snug">{feedback.risk}</p>
                         </div>
                     </div>
                     <div className="flex gap-3 items-start">
                         <Zap size={16} className="text-emerald-400 mt-1 flex-shrink-0" />
                         <div>
                             <span className="text-[10px] font-bold text-emerald-400 uppercase">Fırsat</span>
                             <p className="text-xs text-slate-300 leading-snug">{feedback.opportunity}</p>
                         </div>
                     </div>
                     <div className="flex gap-3 items-start">
                         <Activity size={16} className="text-amber-400 mt-1 flex-shrink-0" />
                         <div>
                             <span className="text-[10px] font-bold text-amber-400 uppercase">Uyarı</span>
                             <p className="text-xs text-slate-300 leading-snug">{feedback.warning}</p>
                         </div>
                     </div>
                 </div>
             ) : (
                 <div className="text-center text-slate-600 text-xs py-8">Simülasyon başlatılıyor...</div>
             )}
         </div>
      </div>

      {/* RIGHT: VISUALIZATION */}
      <div className="w-full xl:w-2/3 flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6 backdrop-blur-md flex-1 flex flex-col relative overflow-hidden">
               {/* Background Grid */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

               <div className="flex justify-between items-start mb-6 z-10">
                   <div>
                       <h3 className="font-cyber font-bold text-white text-xl flex items-center gap-2">
                           <BarChart2 className="text-fuchsia-400" /> PROJEKSİYON (6 AY)
                       </h3>
                       <p className="text-xs text-slate-400 mt-1">Belirsizlik Bantları: En İyi - En Kötü Senaryo Aralığı</p>
                   </div>
                   <div className="bg-slate-950 px-4 py-2 rounded-lg border border-slate-800">
                       <span className="text-[10px] text-slate-500 uppercase block">Tahmini 6. Ay MRR</span>
                       <span className="text-2xl font-bold text-fuchsia-400 font-cyber">${simulationData[5].revenue}K</span>
                   </div>
               </div>

               <div className="flex-1 min-h-[300px] z-10">
                   <ResponsiveContainer width="100%" height="100%">
                       <ComposedChart data={simulationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                           <defs>
                               <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#d946ef" stopOpacity={0.5}/>
                                   <stop offset="95%" stopColor="#d946ef" stopOpacity={0.1}/>
                               </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                           <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                           <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                           <Tooltip 
                              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#d946ef', borderRadius: '8px' }}
                              itemStyle={{ color: '#fff' }}
                              labelStyle={{ color: '#d946ef', fontWeight: 'bold' }}
                           />
                           <Legend />
                           
                           {/* Revenue Range (Uncertainty) - Visual Trick: Area for range */}
                           <Area 
                                type="monotone" 
                                dataKey="revenueRange" 
                                stroke="none" 
                                fill="#d946ef" 
                                fillOpacity={0.2} 
                                name="Gelir Aralığı (Belirsizlik)"
                           />
                           
                           {/* Expected Revenue Line */}
                           <Line 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#d946ef" 
                                strokeWidth={3} 
                                dot={{r:4, fill:'#0f172a', stroke:'#d946ef'}} 
                                name="Beklenen Gelir (MRR)"
                           />

                           {/* Churn Rate (Secondary Axis usually better, but for simplicity showing scaled or distinct) */}
                           {/* NOTE: Churn is small number (5-10), Revenue is large (300k). 
                               Ideally allow toggle. For this demo, let's just stick to Revenue focus 
                               or use a customized component for Churn. 
                               Let's skip plotting Churn line on same axis to avoid scaling issues, 
                               instead show Churn stats in a summary box below.
                           */}
                       </ComposedChart>
                   </ResponsiveContainer>
               </div>

               {/* Result Summary Bar */}
               <div className="grid grid-cols-3 gap-4 mt-6 border-t border-slate-700 pt-4 z-10">
                   <div className="text-center">
                       <span className="text-[10px] text-slate-500 uppercase font-bold">Beklenen Yeni Abone</span>
                       <div className="text-xl font-bold text-emerald-400 font-cyber">+{simulationData.reduce((a,b)=>a+b.newSubs, 0)}</div>
                   </div>
                   <div className="text-center border-l border-slate-700">
                       <span className="text-[10px] text-slate-500 uppercase font-bold">Ort. Churn Riski</span>
                       <div className="text-xl font-bold text-rose-400 font-cyber">%{simulationData[5].churn}</div>
                   </div>
                   <div className="text-center border-l border-slate-700">
                       <span className="text-[10px] text-slate-500 uppercase font-bold">Güven Aralığı</span>
                       <div className="text-xl font-bold text-cyan-400 font-cyber">±%8.5</div>
                   </div>
               </div>
          </div>

          {/* Story Bar */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-full animate-pulse">
                  <Activity size={16} className="text-indigo-400" />
              </div>
              <div>
                  <h4 className="font-cyber text-xs text-indigo-300 uppercase mb-1">Data Storytelling</h4>
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                      "{autoStory}"
                  </p>
              </div>
          </div>
      </div>

    </div>
  );
};

export default WhatIfSimulator;