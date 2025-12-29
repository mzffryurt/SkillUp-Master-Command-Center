import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, 
  Cell, ReferenceLine, AreaChart, Area, PieChart, Pie
} from 'recharts';
import { DNAUniverseData, PersonaType, MatrixZone, PersonaProfile } from '../types';
import { 
  Users, Globe, Smartphone, UserPlus, Fingerprint, MapPin, X, 
  Briefcase, Compass, Award, BrainCircuit, Target, Zap, Clock, TrendingUp
} from 'lucide-react';
import { getPersonaTacticalAdvice } from '../services/geminiService';

interface Props {
  data: DNAUniverseData;
  isProcessing: boolean;
}

// MOCK DATA GENERATION FOR BEHAVIORAL ECOSYSTEM
const generateBehavioralData = (baseData: DNAUniverseData): DNAUniverseData => {
    // 1. Personas
    const personas: PersonaProfile[] = [
        { 
            type: 'Career Hunter', count: 1250, avgLTV: 450, completionRate: 92, 
            description: "Terfi ve maaş artışı odaklı. Hız ve akreditasyon arıyor.", color: '#facc15', icon: 'briefcase' 
        },
        { 
            type: 'Curious Explorer', count: 3400, avgLTV: 120, completionRate: 45, 
            description: "Hobi amaçlı, daldan dala atlayan öğrenici.", color: '#22d3ee', icon: 'compass' 
        },
        { 
            type: 'Certificate Collector', count: 890, avgLTV: 200, completionRate: 98, 
            description: "CV doldurmak için hızlıca video geçenler.", color: '#a855f7', icon: 'award' 
        },
        { 
            type: 'Micro Learner', count: 5600, avgLTV: 80, completionRate: 30, 
            description: "Mobil odaklı, günde 3-4 dakika ayıran kitle.", color: '#f43f5e', icon: 'smartphone' 
        }
    ];

    // 2. Matrix Data (Scatter)
    // Generating distinct clusters
    const matrix = [];
    // Risky VIP (High LTV, Low Engagement) - Top Left
    for(let i=0; i<20; i++) matrix.push({ id: `rv-${i}`, x: 10 + Math.random()*20, y: 800 + Math.random()*400, z: 10, zone: 'Risky VIP' as MatrixZone, userCount: 15 });
    // Hidden Gems (Low LTV, High Engagement) - Bottom Right
    for(let i=0; i<30; i++) matrix.push({ id: `hg-${i}`, x: 70 + Math.random()*25, y: 50 + Math.random()*100, z: 20, zone: 'Hidden Gem' as MatrixZone, userCount: 45 });
    // Ambassadors (High LTV, High Engagement) - Top Right
    for(let i=0; i<25; i++) matrix.push({ id: `ba-${i}`, x: 75 + Math.random()*20, y: 700 + Math.random()*500, z: 30, zone: 'Brand Ambassador' as MatrixZone, userCount: 20 });
    // Passive (Low/Low) - Bottom Left
    for(let i=0; i<40; i++) matrix.push({ id: `p-${i}`, x: 5 + Math.random()*30, y: 20 + Math.random()*150, z: 5, zone: 'Passive' as MatrixZone, userCount: 100 });

    // 3. Learning Modes (Context)
    const learningTime = [
        { time: '06:00', mobile: 10, desktop: 5, contextLabel: 'Early Birds' },
        { time: '08:00', mobile: 85, desktop: 10, contextLabel: 'Commuters' },
        { time: '10:00', mobile: 20, desktop: 60, contextLabel: 'Work Focus' },
        { time: '12:00', mobile: 70, desktop: 20, contextLabel: 'Lunch Learners' },
        { time: '15:00', mobile: 30, desktop: 50, contextLabel: 'Work Focus' },
        { time: '18:00', mobile: 90, desktop: 15, contextLabel: 'Commuters' },
        { time: '21:00', mobile: 40, desktop: 80, contextLabel: 'Night Owls' },
        { time: '23:00', mobile: 60, desktop: 40, contextLabel: 'Night Owls' },
    ];

    // 4. Category ROI (Bubbles)
    const roi = [
        { category: 'Python', revenue: 120000, retention: 14, growth: 25 },
        { category: 'Design', revenue: 85000, retention: 8, growth: 12 },
        { category: 'Marketing', revenue: 60000, retention: 6, growth: 40 },
        { category: 'Blockchain', revenue: 45000, retention: 5, growth: 5 },
        { category: 'Leadership', revenue: 95000, retention: 11, growth: 8 },
    ];

    return { ...baseData, personas, matrix, learningTime, roi };
};


const UserDNAUniverse: React.FC<Props> = ({ data, isProcessing }) => {
  // Enhance data with local generator
  const ecosystemData = useMemo(() => generateBehavioralData(data), [data]);
  
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [selectedZone, setSelectedZone] = useState<string>('');

  const handleZoneClick = async (zone: string) => {
    setSelectedZone(zone);
    setAiModalOpen(true);
    setAiLoading(true);
    setAiResult(null);
    const result = await getPersonaTacticalAdvice(zone);
    setAiResult(result);
    setAiLoading(false);
  };

  const getZoneColor = (zone: string) => {
      switch(zone) {
          case 'Risky VIP': return '#ef4444'; // Red
          case 'Hidden Gem': return '#10b981'; // Green
          case 'Brand Ambassador': return '#f59e0b'; // Gold
          default: return '#64748b'; // Slate
      }
  };

  return (
    <div className={`space-y-6 transition-all duration-700 ${isProcessing ? 'opacity-50 blur-sm' : 'opacity-100'}`}>
      
      {/* HEADER */}
      <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-2xl border border-indigo-500/30 backdrop-blur-md">
        <div>
          <h2 className="text-3xl font-cyber font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-300 flex items-center gap-3">
             <Fingerprint className="text-indigo-400 w-8 h-8" />
             KULLANICI PERSONA & DAVRANIŞ EKOSİSTEMİ
          </h2>
          <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest">
            Davranışsal Segmentasyon • LTV Matrisi • Bağlamsal Öğrenme
          </p>
        </div>
      </div>

      {/* 1. PERSONA SPOTLIGHT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ecosystemData.personas.map((p, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-700 hover:border-white/30 rounded-xl p-5 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      {p.icon === 'briefcase' && <Briefcase size={80} color={p.color} />}
                      {p.icon === 'compass' && <Compass size={80} color={p.color} />}
                      {p.icon === 'award' && <Award size={80} color={p.color} />}
                      {p.icon === 'smartphone' && <Smartphone size={80} color={p.color} />}
                  </div>
                  
                  <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 rounded-lg bg-slate-950/50" style={{ color: p.color, border: `1px solid ${p.color}40` }}>
                              {p.icon === 'briefcase' && <Briefcase size={18} />}
                              {p.icon === 'compass' && <Compass size={18} />}
                              {p.icon === 'award' && <Award size={18} />}
                              {p.icon === 'smartphone' && <Smartphone size={18} />}
                          </div>
                          <h3 className="font-cyber font-bold text-white text-sm uppercase">{p.type}</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-3">
                          <div>
                              <div className="text-[10px] text-slate-500 uppercase">Ort. LTV</div>
                              <div className="text-lg font-bold" style={{ color: p.color }}>${p.avgLTV}</div>
                          </div>
                          <div>
                              <div className="text-[10px] text-slate-500 uppercase">Bitirme %</div>
                              <div className="text-lg font-bold" style={{ color: p.color }}>%{p.completionRate}</div>
                          </div>
                      </div>
                      
                      <p className="text-xs text-slate-400 italic leading-relaxed h-10">
                          "{p.description}"
                      </p>
                      
                      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                           <span className="text-xs text-slate-500 font-bold">{p.count} Kullanıcı</span>
                           <button className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-white transition-colors">
                               Detay
                           </button>
                      </div>
                  </div>
              </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 2. VALUE & ENGAGEMENT MATRIX (SCATTER) */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-700 rounded-xl p-6 relative group min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-cyber text-sm text-fuchsia-300 uppercase tracking-wider flex items-center gap-2">
                      <Target size={16} /> Değer & Etkileşim Matrisi
                  </h3>
                  <div className="flex gap-4 text-[10px] uppercase font-bold">
                      <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Riskli VIP</span>
                      <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Gizli Hazine</span>
                      <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Elçiler</span>
                  </div>
              </div>

              <div className="h-[320px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                          <XAxis type="number" dataKey="x" name="Etkileşim" unit="p" stroke="#64748b" fontSize={10} domain={[0, 100]} label={{ value: 'Ders Etkileşimi', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 10 }} />
                          <YAxis type="number" dataKey="y" name="LTV" unit="$" stroke="#64748b" fontSize={10} domain={[0, 1500]} label={{ value: 'Harcama Potansiyeli (LTV)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                          <ZAxis type="number" dataKey="z" range={[50, 400]} />
                          <Tooltip 
                            cursor={{ strokeDasharray: '3 3' }} 
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-slate-950 border border-white/20 p-2 rounded shadow-xl text-xs">
                                            <div className="font-bold text-white mb-1">{data.zone}</div>
                                            <div>Etkileşim: {data.x.toFixed(0)}</div>
                                            <div>LTV: ${data.y.toFixed(0)}</div>
                                            <div>Kullanıcı: {data.userCount}</div>
                                            <div className="text-cyan-400 mt-1 text-[10px]">Tıkla & Analiz Et</div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                          />
                          {/* Quadrant Dividers */}
                          <ReferenceLine x={50} stroke="#334155" strokeDasharray="3 3" />
                          <ReferenceLine y={600} stroke="#334155" strokeDasharray="3 3" />
                          
                          <Scatter name="Users" data={ecosystemData.matrix} onClick={(data) => handleZoneClick(data.zone)}>
                              {ecosystemData.matrix.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={getZoneColor(entry.zone)} fillOpacity={0.6} stroke={getZoneColor(entry.zone)} strokeWidth={1} className="cursor-pointer hover:opacity-100 transition-opacity" />
                              ))}
                          </Scatter>
                      </ScatterChart>
                  </ResponsiveContainer>
                  
                  {/* Zone Labels Overlay */}
                  <div className="absolute top-4 left-10 text-xs font-bold text-red-500/50 uppercase pointer-events-none">Riskli VIP</div>
                  <div className="absolute top-4 right-10 text-xs font-bold text-amber-500/50 uppercase pointer-events-none">Marka Elçileri</div>
                  <div className="absolute bottom-10 right-10 text-xs font-bold text-emerald-500/50 uppercase pointer-events-none">Gizli Hazineler</div>
                  <div className="absolute bottom-10 left-10 text-xs font-bold text-slate-500/50 uppercase pointer-events-none">Pasif</div>
              </div>
          </div>

          {/* 3. CONTEXTUAL LEARNING MODES */}
          <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-6 relative group h-[400px]">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-cyber text-sm text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                      <Clock size={16} /> Öğrenme Modu Analizi
                  </h3>
              </div>
              
              <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={ecosystemData.learningTime} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                          <defs>
                              <linearGradient id="gradientMobile" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="gradientDesktop" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                          <Area type="monotone" dataKey="mobile" stackId="1" stroke="#f43f5e" fill="url(#gradientMobile)" name="Mobil" />
                          <Area type="monotone" dataKey="desktop" stackId="1" stroke="#3b82f6" fill="url(#gradientDesktop)" name="Desktop" />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
              {/* Context Labels */}
              <div className="flex justify-between px-2 mt-[-20px] relative z-10 text-[10px] font-bold uppercase text-slate-400">
                  <span>Commuters</span>
                  <span>Lunch</span>
                  <span>Night Owls</span>
              </div>
          </div>
      </div>

      {/* 4. INTEREST ECONOMY (SKILL ROI) */}
      <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-6 relative">
           <div className="flex items-center gap-3 mb-6">
              <Zap className="text-amber-400 animate-pulse" />
              <h3 className="font-cyber text-lg text-white uppercase tracking-wider">İlgi Alanı Ekonomisi (Skill ROI)</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
               {ecosystemData.roi.map((cat, idx) => (
                   <div key={idx} className="bg-slate-950/50 p-4 rounded border border-slate-800 hover:border-amber-500/50 transition-all group relative overflow-hidden">
                       <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/5 rounded-full group-hover:scale-150 transition-transform"></div>
                       
                       <h4 className="text-white font-bold text-lg mb-1">{cat.category}</h4>
                       <div className="text-[10px] text-slate-400 uppercase mb-3">Sadakat: {cat.retention} Ay</div>
                       
                       <div className="flex justify-between items-end">
                           <div>
                               <div className="text-xs text-slate-500">Ciro</div>
                               <div className="text-amber-400 font-cyber font-bold">${(cat.revenue/1000).toFixed(0)}k</div>
                           </div>
                           <div className="text-green-400 text-xs font-bold flex items-center gap-1">
                               <TrendingUp size={12} /> {cat.growth}%
                           </div>
                       </div>
                   </div>
               ))}
           </div>
      </div>

      {/* AI TACTICAL ADVICE MODAL */}
      {aiModalOpen && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in zoom-in duration-300">
              <div className="bg-slate-900 border border-cyan-500 rounded-2xl w-full max-w-lg shadow-[0_0_60px_rgba(6,182,212,0.3)] flex flex-col max-h-[85vh]">
                  
                  {/* Fixed Header */}
                  <div className="p-5 bg-cyan-950/30 border-b border-cyan-500/30 flex justify-between items-center flex-shrink-0">
                       <h3 className="font-cyber text-cyan-300 flex items-center gap-2 text-lg">
                          <BrainCircuit size={20} />
                          DAVRANIŞSAL EKONOMİ TAKTİĞİ
                       </h3>
                       <button onClick={() => setAiModalOpen(false)} className="text-slate-500 hover:text-white"><X size={20}/></button>
                  </div>
                  
                  {/* Scrollable Content */}
                  <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                      {aiLoading ? (
                          <div className="flex flex-col items-center gap-4 py-8 justify-center h-full">
                              <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                              <p className="font-cyber text-cyan-200 animate-pulse">SEGMENT {selectedZone.toUpperCase()} ANALİZ EDİLİYOR...</p>
                          </div>
                      ) : aiResult ? (
                          <div className="space-y-6">
                              <div className="bg-slate-950 p-4 rounded border-l-4 border-cyan-500">
                                  <h4 className="text-cyan-400 font-bold text-xs uppercase mb-1 tracking-widest">{aiResult.strategyName}</h4>
                                  <p className="text-white text-lg font-light leading-snug">{aiResult.tactic}</p>
                              </div>

                              <div className="space-y-2">
                                  <label className="text-xs text-slate-500 uppercase font-bold">Önerilen Mesaj</label>
                                  <div className="bg-white/5 p-3 rounded italic text-slate-300 text-sm">
                                      "{aiResult.message}"
                                  </div>
                              </div>

                              <div className="flex justify-between items-center pt-2">
                                  <div className="text-xs text-slate-500 uppercase font-bold">Beklenen Sonuç</div>
                                  <div className="text-green-400 font-cyber font-bold text-lg">{aiResult.expectedResult}</div>
                              </div>

                              <button onClick={() => setAiModalOpen(false)} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-cyber py-3 rounded shadow-lg transition-transform active:scale-95">
                                  AKSİYONU UYGULA
                              </button>
                          </div>
                      ) : (
                          <div className="text-red-400 text-center">Analiz başarısız oldu.</div>
                      )}
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default UserDNAUniverse;