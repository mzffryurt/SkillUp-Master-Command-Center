import React, { useState, useEffect } from 'react';
import { AutonomousOffer } from '../types';
import { getAutonomousOfferSuggestion } from '../services/geminiService';
import { 
  Zap, ShieldAlert, TrendingUp, Lock, ScanLine, Terminal, CheckCircle2, 
  XCircle, Rocket, BarChart3 
} from 'lucide-react';

const AutonomousOfferEngine: React.FC = () => {
  const [status, setStatus] = useState<'SCANNING' | 'DETECTED' | 'LAUNCHING' | 'ACTIVE' | 'DISMISSED'>('SCANNING');
  const [offer, setOffer] = useState<AutonomousOffer | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [revenueBoost, setRevenueBoost] = useState(0);

  // Simulate Scanning Logs
  useEffect(() => {
    if (status !== 'SCANNING') return;

    const interval = setInterval(() => {
      const actions = [
        "Analiz ediliyor: Kullanıcı ID #8921 (Propensity: %45)...",
        "Segment Taranıyor: 'Python Mezunları'...",
        "Churn Riski Kontrolü: Stabil.",
        "Aktivite Sinyali: Düşük.",
        "Veri Akışı: 420 events/sec...",
        "Fiyat Esnekliği Hesaplanıyor...",
        "Rakip Analizi: Nötr."
      ];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setLogs(prev => [randomAction, ...prev].slice(0, 5));
    }, 800);

    // Randomly find an opportunity after 3-6 seconds
    const triggerTime = Math.random() * 3000 + 3000;
    const timeout = setTimeout(async () => {
        const aiOffer = await getAutonomousOfferSuggestion();
        if (aiOffer) {
            setOffer(aiOffer);
            setStatus('DETECTED');
        }
    }, triggerTime);

    return () => {
        clearInterval(interval);
        clearTimeout(timeout);
    };
  }, [status]);

  const handleLaunch = () => {
      setStatus('LAUNCHING');
      setTimeout(() => {
          setStatus('ACTIVE');
          // Animate revenue boost
          let current = 0;
          const target = parseInt(offer?.predictedImpact.replace(/[^0-9]/g, '') || "10");
          const counter = setInterval(() => {
              current += 1;
              setRevenueBoost(current);
              if (current >= target) clearInterval(counter);
          }, 50);
      }, 1500);
  };

  const handleDismiss = () => {
      setStatus('DISMISSED');
      setTimeout(() => setStatus('SCANNING'), 2000);
  };

  const getThemeColor = () => {
      if (!offer) return 'cyan';
      switch(offer.type) {
          case 'UPSELL': return 'fuchsia';
          case 'RETENTION': return 'rose';
          case 'CROSS_SELL': return 'emerald';
          case 'RESTRICTION': return 'amber';
          default: return 'cyan';
      }
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-700">
        
        {/* TOP: LIVE MONITORING HUD */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs relative overflow-hidden h-32 flex flex-col">
            <div className="absolute top-0 right-0 p-2 text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                LIVE SIGNAL PROCESSING
            </div>
            <div className="flex-1 overflow-hidden flex flex-col justify-end space-y-1 z-10">
                {logs.map((log, i) => (
                    <div key={i} className={`opacity-${100 - i*20} text-slate-400`}>
                        <span className="text-cyan-600 mr-2">{`>`}</span>
                        {log}
                    </div>
                ))}
            </div>
            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-full w-full pointer-events-none animate-scan"></div>
        </div>

        {/* CENTER: DECISION CORE */}
        <div className="flex-1 flex items-center justify-center relative">
            
            {/* IDLE STATE */}
            {status === 'SCANNING' && (
                <div className="flex flex-col items-center gap-4 opacity-50">
                    <div className="w-32 h-32 border-4 border-slate-800 border-t-cyan-500 rounded-full animate-spin"></div>
                    <p className="font-cyber text-cyan-500 tracking-widest animate-pulse">FIRSAT TARANIYOR...</p>
                </div>
            )}

            {/* DETECTED STATE (THE CARD) */}
            {status === 'DETECTED' && offer && (
                <div className={`relative w-full max-w-2xl bg-slate-900/90 backdrop-blur-xl border-2 rounded-2xl p-1 shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300 border-${getThemeColor()}-500 shadow-${getThemeColor()}-500/20`}>
                    <div className="absolute -top-3 -left-3 bg-slate-950 text-white px-3 py-1 rounded border border-slate-700 text-xs font-bold uppercase tracking-wider shadow-xl z-20 flex items-center gap-2">
                        <ScanLine size={14} className={`text-${getThemeColor()}-400 animate-pulse`} />
                        AI TESPİTİ: {offer.type}
                    </div>
                    
                    <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
                        
                        {/* Left: Data Viz / Icon */}
                        <div className={`flex-shrink-0 w-32 h-32 rounded-full bg-${getThemeColor()}-900/20 border border-${getThemeColor()}-500/50 flex items-center justify-center relative`}>
                            <div className={`absolute inset-0 rounded-full border border-${getThemeColor()}-400 opacity-20 animate-ping`}></div>
                            {offer.type === 'UPSELL' && <TrendingUp size={48} className={`text-${getThemeColor()}-400`} />}
                            {offer.type === 'RETENTION' && <ShieldAlert size={48} className={`text-${getThemeColor()}-400`} />}
                            {offer.type === 'CROSS_SELL' && <Zap size={48} className={`text-${getThemeColor()}-400`} />}
                            {offer.type === 'RESTRICTION' && <Lock size={48} className={`text-${getThemeColor()}-400`} />}
                        </div>

                        {/* Right: Content */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <h2 className="text-2xl font-cyber font-bold text-white leading-none mb-2">{offer.title}</h2>
                                <p className="text-slate-400 text-sm">Hedef: <span className="text-white font-bold">{offer.targetSegment}</span> ({offer.targetSize} Kişi)</p>
                            </div>
                            
                            <div className={`bg-${getThemeColor()}-950/50 border-l-4 border-${getThemeColor()}-500 p-4 rounded`}>
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">AI Önerisi</div>
                                <p className={`text-${getThemeColor()}-300 font-medium text-lg`}>"{offer.proposal}"</p>
                                <div className="text-xs text-slate-400 mt-1 italic">Nedeni: {offer.triggerReason}</div>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button 
                                    onClick={handleLaunch}
                                    className={`flex-1 bg-${getThemeColor()}-600 hover:bg-${getThemeColor()}-500 text-white font-cyber py-3 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all transform hover:scale-105 flex items-center justify-center gap-2`}
                                >
                                    <Rocket size={18} /> KAMPANYAYI BAŞLAT
                                </button>
                                <button 
                                    onClick={handleDismiss}
                                    className="px-6 border border-slate-600 hover:bg-slate-800 text-slate-400 rounded-lg font-bold transition-colors"
                                >
                                    YOK SAY
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ACTIVE STATE (RESULT) */}
            {status === 'ACTIVE' && offer && (
                <div className="w-full max-w-3xl bg-slate-900 border border-green-500/30 rounded-2xl p-8 relative overflow-hidden animate-in slide-in-from-bottom-8">
                    {/* Success Burst Background */}
                    <div className="absolute inset-0 bg-green-500/5 radial-gradient(circle at center, green-500/10, transparent)"></div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                        <div className="text-center md:text-left">
                            <div className="flex items-center gap-2 text-green-400 mb-2">
                                <CheckCircle2 size={24} />
                                <span className="font-cyber font-bold tracking-widest uppercase">Kampanya Aktif</span>
                            </div>
                            <h2 className="text-3xl text-white font-bold mb-4">Otomasyon Başlatıldı</h2>
                            <p className="text-slate-300 italic max-w-md border-l-2 border-slate-600 pl-4">
                                "{offer.rationale}"
                            </p>
                        </div>

                        {/* Revenue Spike Gauge */}
                        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center min-w-[200px]">
                            <span className="text-xs text-slate-500 uppercase font-bold mb-2">Tahmini MRR Artışı</span>
                            <div className="flex items-end gap-1">
                                <span className="text-4xl font-cyber font-bold text-green-400">
                                    +${revenueBoost}k
                                </span>
                                <TrendingUp className="text-green-500 mb-2 animate-bounce" />
                            </div>
                            <div className="w-full h-1 bg-slate-800 mt-2 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 animate-pulse" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => setStatus('SCANNING')}
                        className="absolute top-4 right-4 text-slate-600 hover:text-white"
                    >
                        <XCircle size={24} />
                    </button>
                </div>
            )}

            {/* DISMISSED STATE */}
            {status === 'DISMISSED' && (
                 <div className="text-slate-500 font-cyber animate-pulse">
                     ÖNERİ REDDEDİLDİ. SİSTEM TARAMAYA DÖNÜYOR...
                 </div>
            )}

        </div>

    </div>
  );
};

export default AutonomousOfferEngine;