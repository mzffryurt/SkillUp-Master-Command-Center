import React, { useState, useMemo } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid 
} from 'recharts';
import { ExperienceData, StudentFeedback, RecoveryAlert } from '../types';
import { 
  Heart, Activity, ThumbsUp, ThumbsDown, Megaphone, ShieldAlert, TrendingUp, 
  Wifi, BookOpen, Layout, Award, Users, AlertOctagon, Gift, MessageSquare
} from 'lucide-react';
import { getCrisisManagementAdvice } from '../services/geminiService';

interface Props {
  data: ExperienceData;
  isProcessing: boolean;
}

// Mock Data Generator specifically for this component view if not present in main data
const generateLocalMockData = (baseData: ExperienceData) => {
    // 1. Radar Data (Performance)
    const radarData = [
        { subject: 'İçerik Kalitesi', A: 92, fullMark: 100 },
        { subject: 'Video Hızı', A: 65, fullMark: 100 }, // Intentionally low for demo
        { subject: 'Uygulama UX', A: 88, fullMark: 100 },
        { subject: 'Oyunlaştırma', A: 75, fullMark: 100 },
        { subject: 'Destek', A: 50, fullMark: 100 },
    ];

    // 2. Live Feedback (Voice of Customer)
    const liveFeedback: StudentFeedback[] = [
        { id: '1', user: 'Ahmet Y.', userType: 'Premium', comment: 'Dersler harika ama sertifikamı indiremiyorum ve uygulama sürekli çöküyor.', sentiment: 'negative', highlights: ['sertifikamı indiremiyorum', 'uygulama sürekli çöküyor'], source: 'App Store' },
        { id: '2', user: 'Selin K.', userType: 'Free', comment: 'Video player mobilde çok yavaş, donma sorunu var.', sentiment: 'negative', highlights: ['çok yavaş', 'donma sorunu'], source: 'Support' },
        { id: '3', user: 'Mehmet T.', userType: 'Premium', comment: 'Python modülü efsane! Mentör desteği çok hızlı.', sentiment: 'positive', highlights: ['efsane', 'çok hızlı'], source: 'Twitter' },
        { id: '4', user: 'Ayşe B.', userType: 'Premium', comment: 'Ödeme yaptım ama premium açılmadı, acil yardım.', sentiment: 'negative', highlights: ['premium açılmadı', 'acil yardım'], source: 'Support' },
        { id: '5', user: 'Canan L.', userType: 'Free', comment: 'Arayüz biraz karışık, aradığım dersi bulamıyorum.', sentiment: 'neutral', highlights: ['biraz karışık'], source: 'Anket' },
    ];

    // 3. Financial Correlation
    const financialCorrelation = [
        { segment: 'Mutlu (9-10)', ltv: 850, retention: 14, color: '#34d399' },
        { segment: 'Nötr (7-8)', ltv: 320, retention: 6, color: '#94a3b8' },
        { segment: 'Mutsuz (0-6)', ltv: 80, retention: 1.5, color: '#f43f5e' },
    ];

    // 4. Recovery Alerts
    const recoveryAlerts: RecoveryAlert[] = [
        { id: 'r1', user: 'Ayşe B.', issue: 'Ödeme Hatası / Hizmet Alamama', severity: 'critical', status: 'pending' },
        { id: 'r2', user: 'Burak D.', issue: '1 Yıldız - "Paramı İade Edin"', severity: 'high', status: 'pending' },
    ];

    return { ...baseData, radarData, liveFeedback, financialCorrelation, recoveryAlerts };
};

const ExperienceSentimentRadar: React.FC<Props> = ({ data, isProcessing }) => {
  const enhancedData = useMemo(() => generateLocalMockData(data), [data]);
  
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [recoveredIds, setRecoveredIds] = useState<string[]>([]);

  const handleAiAnalysis = async () => {
    setAiModalOpen(true);
    setAiLoading(true);
    setAiResult(null);
    const result = await getCrisisManagementAdvice(enhancedData.radarData);
    setAiResult(result);
    setAiLoading(false);
  };

  const handleRecover = (id: string) => {
      setRecoveredIds(prev => [...prev, id]);
  };

  // Helper to render text with neon highlights
  const renderHighlightedText = (text: string, highlights: string[], sentiment: string) => {
      let parts = [{ text, isHighlight: false }];
      
      highlights.forEach(highlight => {
          const newParts: any[] = [];
          parts.forEach(part => {
              if (part.isHighlight) {
                  newParts.push(part);
                  return;
              }
              const split = part.text.split(highlight);
              split.forEach((s, i) => {
                  if (s) newParts.push({ text: s, isHighlight: false });
                  if (i < split.length - 1) newParts.push({ text: highlight, isHighlight: true });
              });
          });
          parts = newParts;
      });

      return (
          <p className="text-sm text-slate-300 leading-relaxed">
              {parts.map((part, i) => 
                  part.isHighlight ? (
                      <span key={i} className={`font-bold mx-1 px-1 rounded ${sentiment === 'negative' ? 'text-red-400 bg-red-900/30 animate-pulse shadow-[0_0_10px_rgba(248,113,113,0.3)]' : 'text-emerald-400 bg-emerald-900/30'}`}>
                          {part.text}
                      </span>
                  ) : (
                      <span key={i}>{part.text}</span>
                  )
              )}
          </p>
      );
  };

  return (
    <div className={`space-y-6 transition-all duration-700 ${isProcessing ? 'opacity-50 blur-sm' : 'opacity-100'}`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900/40 p-6 rounded-2xl border border-pink-500/30 backdrop-blur-md gap-4">
        <div>
          <h2 className="text-3xl font-cyber font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300 flex items-center gap-3">
             <Heart className="text-pink-400 w-8 h-8 fill-pink-900/40" />
             DENEYİM KALİTESİ & DUYGU MERKEZİ
          </h2>
          <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest">
            Platform Performans Radarı • Canlı Öğrenci Sesi • Finansal Etki
          </p>
        </div>
        
        <button 
          onClick={handleAiAnalysis}
          className="relative overflow-hidden group bg-rose-950 border border-rose-500 hover:border-pink-400 px-6 py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 to-pink-600/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <span className="relative font-cyber font-bold text-rose-100 flex items-center gap-2">
            <Megaphone size={18} /> KRİZ YÖNETİMİ BAŞLAT
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 1. PLATFORM PERFORMANCE RADAR */}
          <div className="lg:col-span-1 bg-slate-900/60 border border-slate-700 rounded-xl p-5 relative group h-[400px] flex flex-col items-center">
              <h3 className="font-cyber text-sm text-pink-300 uppercase tracking-wider flex items-center gap-2 mb-2 w-full">
                  <Activity size={16} /> Performans Radarı
              </h3>
              
              <div className="flex-1 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={enhancedData.radarData}>
                          <PolarGrid stroke="#334155" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar
                              name="SkillUp"
                              dataKey="A"
                              stroke="#ec4899"
                              strokeWidth={2}
                              fill="#ec4899"
                              fillOpacity={0.4}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ec4899', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                          />
                      </RadarChart>
                  </ResponsiveContainer>
                  
                  {/* Icons Overlay for Axes */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-pink-400 bg-slate-900 p-1 rounded-full border border-pink-500/30"><BookOpen size={14}/></div>
                  <div className="absolute top-1/3 right-0 text-pink-400 bg-slate-900 p-1 rounded-full border border-pink-500/30"><Wifi size={14}/></div>
                  <div className="absolute bottom-1/3 right-0 text-pink-400 bg-slate-900 p-1 rounded-full border border-pink-500/30"><Layout size={14}/></div>
                  <div className="absolute bottom-1/3 left-0 text-pink-400 bg-slate-900 p-1 rounded-full border border-pink-500/30"><Award size={14}/></div>
                  <div className="absolute top-1/3 left-0 text-pink-400 bg-slate-900 p-1 rounded-full border border-pink-500/30"><Users size={14}/></div>
              </div>
              
              <div className="text-center mt-[-10px]">
                  <span className="text-[10px] text-slate-500 uppercase">Ortalama Skor</span>
                  <div className="text-2xl font-cyber font-bold text-white">
                      {(enhancedData.radarData.reduce((a,b)=>a+b.A,0) / 5).toFixed(1)}/100
                  </div>
              </div>
          </div>

          {/* 2. SENTIMENT VS LTV & RECOVERY CENTER */}
          <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Financial Correlation */}
              <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-5 min-h-[220px] relative overflow-hidden flex flex-col">
                  <h3 className="font-cyber text-sm text-emerald-300 uppercase tracking-wider flex items-center gap-2 mb-4">
                      <TrendingUp size={16} /> Duygu & Değer Korelasyonu (LTV)
                  </h3>
                  <div className="flex items-end justify-around flex-1 px-2 gap-4">
                      {enhancedData.financialCorrelation.map((item, i) => (
                          <div key={i} className="flex flex-col items-center justify-end w-1/3 group h-full">
                              
                              {/* Text Group (Label + Value) */}
                              <div className="text-center mb-2 transition-transform group-hover:-translate-y-1 duration-300">
                                  <span className="block text-xs text-slate-400 font-bold mb-1">{item.segment}</span>
                                  <div className="font-cyber font-bold text-xl drop-shadow-md" style={{ color: item.color }}>
                                      ${item.ltv}
                                  </div>
                              </div>

                              {/* Bar */}
                              <div className="w-full max-w-[60px] bg-slate-800 rounded-t-lg relative group-hover:bg-slate-700 transition-colors overflow-hidden" style={{ height: `${Math.max((item.ltv / 1000) * 100, 15)}%` }}>
                                  <div className="absolute bottom-0 w-full bg-current opacity-20" style={{ color: item.color, height: '100%' }}></div>
                                  <div className="absolute bottom-0 w-full h-1 bg-current opacity-50" style={{ color: item.color }}></div>
                              </div>
                              
                              {/* Bottom Label */}
                              <span className="text-[10px] text-slate-500 mt-2 font-medium">{item.retention} Ay Tutundurma</span>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Service Recovery Cards */}
              <div className="flex-1 bg-slate-900/60 border border-slate-700 rounded-xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                      <AlertOctagon size={80} className="text-red-500" />
                  </div>
                  <h3 className="font-cyber text-sm text-red-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                      <ShieldAlert size={16} className="animate-pulse" /> Deneyim Kurtarma Alarmı (Acil)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {enhancedData.recoveryAlerts.map((alert) => (
                          <div key={alert.id} className={`bg-slate-950/80 border ${recoveredIds.includes(alert.id) ? 'border-green-500/50 opacity-50' : 'border-red-500/50'} rounded-lg p-4 transition-all`}>
                              <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-xs">
                                          {alert.user.charAt(0)}
                                      </div>
                                      <div>
                                          <div className="font-bold text-white text-sm">{alert.user}</div>
                                          <div className="text-[10px] text-red-400 uppercase font-bold">{alert.issue}</div>
                                      </div>
                                  </div>
                                  {recoveredIds.includes(alert.id) && <span className="text-green-400 text-xs font-bold">ÇÖZÜLDÜ</span>}
                              </div>
                              
                              {!recoveredIds.includes(alert.id) && (
                                  <div className="flex gap-2 mt-3">
                                      <button 
                                        onClick={() => handleRecover(alert.id)}
                                        className="flex-1 bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 text-red-200 text-[10px] py-2 rounded flex items-center justify-center gap-1 transition-colors"
                                      >
                                          <Gift size={12} /> HEDİYE ET & ÖZÜR
                                      </button>
                                      <button className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 text-[10px] py-2 rounded flex items-center justify-center gap-1 transition-colors">
                                          <MessageSquare size={12} /> DESTEK AÇ
                                      </button>
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      {/* 3. LIVE FEEDBACK TICKER (Highlight Engine) */}
      <div className="bg-slate-950 border border-cyan-900/50 rounded-xl overflow-hidden relative h-[250px] flex flex-col">
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center z-10">
              <h3 className="font-cyber text-sm text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare size={16} /> Öğrencinin Sesi (Live AI Highlight)
              </h3>
              <div className="flex gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] text-slate-400 uppercase">Canlı Akış</span>
              </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/0 via-slate-950/0 to-slate-950/80 pointer-events-none z-10"></div>
              
              {enhancedData.liveFeedback.map((fb) => (
                  <div key={fb.id} className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg hover:bg-slate-900 transition-colors group">
                      <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold ${fb.sentiment === 'positive' ? 'text-emerald-400' : fb.sentiment === 'negative' ? 'text-red-400' : 'text-slate-400'}`}>
                                  {fb.user}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 rounded text-slate-500 border border-slate-700">
                                  {fb.userType}
                              </span>
                          </div>
                          <span className="text-[10px] text-slate-600 uppercase">{fb.source}</span>
                      </div>
                      
                      {renderHighlightedText(fb.comment, fb.highlights, fb.sentiment)}
                  </div>
              ))}
          </div>
      </div>

      {/* AI Crisis Management Modal */}
      {aiModalOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in zoom-in duration-300">
              <div className="bg-slate-900 border border-rose-500 rounded-2xl w-full max-w-lg shadow-[0_0_60px_rgba(244,63,94,0.3)] flex flex-col max-h-[85vh]">
                  
                  {/* Fixed Header */}
                  <div className="flex-shrink-0 p-5 bg-rose-950/30 border-b border-rose-500/30 flex justify-between items-center">
                       <h3 className="font-cyber text-rose-300 flex items-center gap-2 text-lg">
                          <ShieldAlert size={20} />
                          DENEYİM MÜHENDİSLİĞİ RAPORU
                       </h3>
                       <button onClick={() => setAiModalOpen(false)} className="text-slate-500 hover:text-white">✕</button>
                  </div>
                  
                  {/* Scrollable Content */}
                  <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                      {aiLoading ? (
                          <div className="flex flex-col items-center gap-4 h-full justify-center">
                              <div className="w-16 h-16 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
                              <p className="font-cyber text-rose-200 animate-pulse">RADAR VE GERİ BİLDİRİMLER TARANIYOR...</p>
                          </div>
                      ) : aiResult ? (
                          <div className="space-y-6">
                              
                              <div className="bg-slate-950 p-4 rounded border-l-4 border-slate-500">
                                  <h4 className="text-slate-400 font-bold text-xs uppercase mb-1">Kök Neden Analizi</h4>
                                  <p className="text-white text-lg font-light leading-snug">{aiResult.analysis}</p>
                              </div>

                              <div className="bg-rose-950/20 border border-rose-500/30 p-4 rounded">
                                  <h4 className="text-rose-400 font-bold text-xs uppercase mb-2 flex items-center gap-2">
                                      <TrendingUp size={14} /> Acil Aksiyon Planı
                                  </h4>
                                  <p className="text-rose-100 text-sm">{aiResult.action}</p>
                              </div>

                              <div className="text-center pt-2">
                                  <span className="text-[10px] text-slate-500 uppercase font-bold">TAHMİNİ ETKİ</span>
                                  <div className="text-emerald-400 font-cyber font-bold text-lg">{aiResult.impact}</div>
                              </div>

                              <button onClick={() => setAiModalOpen(false)} className="w-full bg-rose-700 hover:bg-rose-600 text-white font-cyber py-3 rounded shadow-lg transition-transform active:scale-95">
                                  EKİPLERE GÖREV ATA
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

export default ExperienceSentimentRadar;