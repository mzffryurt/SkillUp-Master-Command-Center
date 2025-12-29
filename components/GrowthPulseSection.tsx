import React, { useState, useMemo } from 'react';
import { 
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { GrowthPulseData } from '../types';
import { Bot, X, Sparkles, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import { getRetentionActionSuggestion } from '../services/geminiService';

interface Props {
  data: GrowthPulseData[];
  isProcessing: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const leadScore = payload.find((p: any) => p.dataKey === 'leadScore')?.value;
    const churnRisk = payload.find((p: any) => p.dataKey === 'churnRisk')?.value;
    const extraData = payload[0]?.payload;

    return (
      <div className="bg-slate-900/95 border border-cyan-500/50 p-4 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.2)] backdrop-blur-xl max-w-xs z-50">
        <h4 className="font-cyber text-cyan-300 border-b border-cyan-500/30 pb-2 mb-3 text-sm">{label}</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs uppercase tracking-wider">Lider Skoru</span>
            <div className="flex items-center space-x-2">
                <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" style={{ width: `${leadScore}%` }}></div>
                </div>
                <span className="text-cyan-400 font-bold font-cyber">{leadScore}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs uppercase tracking-wider">Churn Riski</span>
            <div className="flex items-center space-x-2">
                <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-fuchsia-500 shadow-[0_0_10px_#d946ef]" style={{ width: `${churnRisk}%` }}></div>
                </div>
                <span className="text-fuchsia-400 font-bold font-cyber text-sm">%{churnRisk}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-1">
             <span className="text-slate-400 text-xs">Yeni Potansiyel:</span>
             <span className="text-white font-bold text-sm">+{extraData.newLeads}</span>
          </div>

          <div className="mt-2 bg-indigo-900/30 border border-indigo-500/20 p-2 rounded text-[10px] text-indigo-200 italic leading-snug">
            <span className="mr-1">💬</span>
            "{extraData.crmComment}"
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const GrowthPulseSection: React.FC<Props> = ({ data, isProcessing }) => {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // Data Storytelling Logic
  const story = useMemo(() => {
    if (data.length === 0) return "";
    const avgScore = data.reduce((acc, curr) => acc + curr.leadScore, 0) / data.length;
    const maxRisk = data.reduce((prev, current) => (prev.churnRisk > current.churnRisk) ? prev : current);
    
    const trendText = avgScore > 75 ? "yüksek ve kararlı" : avgScore > 50 ? "orta seviyede stabil" : "düşüş eğiliminde";
    
    return `Seçilen dönem boyunca lider kalitesi ${trendText} seyretmiştir. En yüksek churn riski (${maxRisk.churnRisk}%) ${maxRisk.label} tarihinde tespit edilmiş olup, bu noktaya dikkat edilmelidir.`;
  }, [data]);

  const handleAiAction = async () => {
    setAiModalOpen(true);
    setAiLoading(true);
    setAiResult(null);

    // Call simulated/real AI service
    // In a real app, this would send the 'data' array to the backend
    const result = await getRetentionActionSuggestion(data);
    setAiResult(result);
    setAiLoading(false);
  };

  return (
    <div className="relative w-full bg-slate-900/40 border border-cyan-900/30 rounded-2xl p-6 backdrop-blur-sm shadow-2xl overflow-hidden group">
      
      {/* Background Grid Decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
           <h2 className="text-2xl font-cyber font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] flex items-center gap-2">
             <Activity className="text-cyan-400" />
             BÜYÜME VE ETKİLEŞİM NABZI
           </h2>
           <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">
             Lider Kalitesi vs. Churn Riski Korelasyonu
           </p>
        </div>

        {/* AI Action Trigger */}
        <button 
          onClick={handleAiAction}
          className="relative group/btn flex items-center space-x-2 bg-indigo-950/50 border border-indigo-500 hover:bg-indigo-900/50 px-4 py-2 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
        >
          <div className="relative">
             <Bot className="text-indigo-400 w-5 h-5 group-hover/btn:text-white transition-colors" />
             <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
             <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
          <span className="font-cyber text-xs font-bold text-indigo-300 group-hover/btn:text-white">
            AI RETENTION ACTION
          </span>
        </button>
      </div>

      {/* Chart Area */}
      <div className={`h-[350px] w-full transition-opacity duration-500 ${isProcessing ? 'opacity-50 blur-sm' : 'opacity-100'}`}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d946ef" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#d946ef" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
                dataKey="label" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
            />
            <YAxis 
                yAxisId="left" 
                orientation="left" 
                stroke="#22d3ee" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                label={{ value: 'Lider Skoru', angle: -90, position: 'insideLeft', fill: '#22d3ee', fontSize: 10 }}
            />
            <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#d946ef" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                label={{ value: 'Churn Riski %', angle: 90, position: 'insideRight', fill: '#d946ef', fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }} />
            
            {/* Churn Risk Area */}
            <Area 
                yAxisId="right" 
                type="monotone" 
                dataKey="churnRisk" 
                stroke="#d946ef" 
                fillOpacity={1} 
                fill="url(#colorRisk)" 
                strokeWidth={2}
            />
            
            {/* Lead Score Line */}
            <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="leadScore" 
                stroke="#22d3ee" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#0f172a', stroke: '#22d3ee', strokeWidth: 2 }}
                activeDot={{ r: 8, fill: '#22d3ee', stroke: '#fff' }}
            />

            {/* Critical Zone Highlight (Example threshold) */}
            <ReferenceLine yAxisId="right" y={80} stroke="#ef4444" strokeDasharray="3 3" opacity={0.5} label={{ value: 'KRİTİK RİSK EŞİĞİ', fill: '#ef4444', fontSize: 10 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer / Data Story */}
      <div className="relative z-10 mt-4 bg-slate-950/50 border-t border-slate-800 pt-4 flex items-start space-x-3">
         <div className="bg-cyan-500/20 p-2 rounded-full animate-pulse">
            <TrendingUp size={16} className="text-cyan-400" />
         </div>
         <div>
            <h4 className="font-cyber text-xs text-slate-400 uppercase">Otomatik Analiz Raporu</h4>
            <p className="text-slate-200 text-sm font-light leading-relaxed">
               {story}
            </p>
         </div>
      </div>

      {/* AI Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-slate-900 border border-indigo-500 rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.4)] flex flex-col max-h-[85vh]">
              
              {/* Fixed Header */}
              <div className="p-4 bg-indigo-950/50 flex justify-between items-center border-b border-indigo-500/30 flex-shrink-0">
                 <h3 className="font-cyber text-white flex items-center gap-2">
                    <Sparkles className="text-yellow-400" size={18} />
                    AI AKSİYON ÖNERİSİ
                 </h3>
                 <button onClick={() => setAiModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                    <X size={20} />
                 </button>
              </div>
              
              {/* Scrollable Content */}
              <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                 {aiLoading ? (
                    <div className="flex flex-col items-center py-8 space-y-4 justify-center h-full">
                       <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                       <p className="text-indigo-300 font-cyber text-xs animate-pulse">CRM VERİLERİ İŞLENİYOR...</p>
                    </div>
                 ) : aiResult ? (
                    <div className="space-y-4">
                        <div className={`p-3 rounded border-l-4 ${aiResult.type === 'CLOSING' ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
                           <div className="flex items-center justify-between mb-1">
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${aiResult.type === 'CLOSING' ? 'text-green-400' : 'text-red-400'}`}>
                                 {aiResult.type === 'CLOSING' ? 'SATIŞ FIRSATI' : 'ACİL RETENTION'}
                              </span>
                           </div>
                           <h4 className="text-white font-bold text-lg">{aiResult.title}</h4>
                        </div>

                        <div className="space-y-2">
                           <label className="text-xs text-slate-500 uppercase font-bold">Hedef Kitle</label>
                           <p className="text-slate-300 text-sm bg-slate-950 p-2 rounded border border-slate-800">
                              {aiResult.targetAudience}
                           </p>
                        </div>

                        <div className="space-y-2">
                           <label className="text-xs text-slate-500 uppercase font-bold">Önerilen Mesaj</label>
                           <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 text-cyan-100 italic text-sm relative">
                              <span className="absolute -top-2 -left-2 text-2xl text-slate-600">"</span>
                              {aiResult.message}
                              <span className="absolute -bottom-4 -right-1 text-2xl text-slate-600">"</span>
                           </div>
                        </div>

                        <button 
                           onClick={() => setAiModalOpen(false)}
                           className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-cyber py-3 rounded transition-colors shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                        >
                           KAMPANYAYI BAŞLAT
                        </button>
                    </div>
                 ) : (
                    <div className="text-center text-red-400">Veri alınamadı.</div>
                 )}
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default GrowthPulseSection;