import React, { useState, useEffect } from 'react';
import { BrainCircuit, X, Zap, ChevronRight, Target, Stethoscope, AlertOctagon } from 'lucide-react';
import { getStrategicConsultation } from '../services/geminiService';
import { ConsultationResult } from '../types';

interface Props {
  contextType: 'dashboard' | 'dna' | 'live' | 'experience';
  data: any;
}

const AIBrainProtocol: React.FC<Props> = ({ contextType, data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [insight, setInsight] = useState<ConsultationResult | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleActivate = async () => {
    setIsOpen(true);
    setIsLoading(true);
    setInsight(null);
    
    // Simulate thinking time for effect
    setTimeout(async () => {
        const result = await getStrategicConsultation(contextType, data);
        setInsight(result);
        setIsLoading(false);
    }, 1500);
  };

  const getThemeColor = () => {
      switch(contextType) {
          case 'dashboard': return 'text-fuchsia-400 border-fuchsia-500 bg-fuchsia-950';
          case 'dna': return 'text-indigo-400 border-indigo-500 bg-indigo-950';
          case 'live': return 'text-cyan-400 border-cyan-500 bg-cyan-950';
          case 'experience': return 'text-pink-400 border-pink-500 bg-pink-950';
          default: return 'text-fuchsia-400 border-fuchsia-500 bg-fuchsia-950';
      }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={handleActivate}
        className={`fixed bottom-8 right-6 z-50 group flex items-center space-x-3 bg-slate-900/95 border rounded-full pl-5 pr-2 py-2 shadow-2xl transition-all duration-300 hover:scale-105 ${getThemeColor().split(' ')[1]}`}
      >
        <span className={`font-cyber text-sm font-bold tracking-wider group-hover:text-white transition-colors ${getThemeColor().split(' ')[0]}`}>
          AI STRATEJİST
        </span>
        <div className={`rounded-full p-3 group-hover:rotate-90 transition-transform duration-500 ${contextType === 'dashboard' ? 'bg-fuchsia-600' : contextType === 'dna' ? 'bg-indigo-600' : contextType === 'live' ? 'bg-cyan-600' : 'bg-pink-600'}`}>
            <BrainCircuit className="text-white w-6 h-6" />
        </div>
      </button>

      {/* Modal / Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`relative w-full max-w-xl bg-slate-900 border-2 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${getThemeColor().split(' ')[1]}`}>
            
            {/* Header */}
            <div className={`flex flex-shrink-0 items-center justify-between p-5 border-b border-opacity-30 ${getThemeColor().split(' ')[2] + '/50'} ${getThemeColor().split(' ')[1]}`}>
              <div className="flex items-center space-x-3">
                <BrainCircuit className={`w-6 h-6 ${getThemeColor().split(' ')[0]}`} />
                <div>
                    <h3 className={`font-cyber font-bold text-lg ${getThemeColor().split(' ')[0]}`}>STRATEJİK DANIŞMAN</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                        SAHNE: {contextType.toUpperCase()} | MOD: ÇÖZÜM ORTAĞI
                    </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto flex-1">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] space-y-6">
                  <div className="relative w-20 h-20">
                    <div className={`absolute inset-0 border-4 border-opacity-20 rounded-full ${getThemeColor().split(' ')[1]}`}></div>
                    <div className={`absolute inset-0 border-4 border-t-transparent rounded-full animate-spin ${getThemeColor().split(' ')[1]}`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Zap className={`${getThemeColor().split(' ')[0]} animate-pulse`} size={24} />
                    </div>
                  </div>
                  <p className={`font-cyber text-sm animate-pulse ${getThemeColor().split(' ')[0]}`}>VERİ SETİ ANALİZ EDİLİYOR...</p>
                </div>
              ) : insight ? (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-2">
                    
                    {/* Header Title */}
                    <div className="text-center mb-2">
                        <h2 className="text-2xl font-bold text-white mb-1">{insight.title}</h2>
                        <div className={`h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-transparent via-current to-transparent ${getThemeColor().split(' ')[0]}`}></div>
                    </div>

                    {/* Problem Definition */}
                    <div className="bg-slate-950/50 p-4 rounded-lg border-l-4 border-red-500 relative">
                        <div className="absolute -left-3 -top-3 bg-red-500 rounded-full p-1.5 shadow-lg">
                            <AlertOctagon size={16} className="text-white" />
                        </div>
                        <h4 className="text-xs text-red-400 font-bold uppercase tracking-wider mb-1 pl-2">Tespit Edilen Sorun</h4>
                        <p className="text-slate-200 text-sm leading-relaxed pl-2">{insight.problem}</p>
                    </div>

                    {/* Diagnosis */}
                    <div className="flex items-start gap-3">
                        <Stethoscope className={`mt-1 ${getThemeColor().split(' ')[0]}`} size={20} />
                        <div>
                             <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${getThemeColor().split(' ')[0]}`}>Uzman Teşhisi</h4>
                             <p className="text-slate-400 text-sm italic">"{insight.diagnosis}"</p>
                        </div>
                    </div>

                    {/* Action Plan */}
                    <div className={`rounded-xl p-5 border border-opacity-20 bg-opacity-10 ${getThemeColor().split(' ')[1]} ${getThemeColor().split(' ')[2]}`}>
                        <h4 className="text-white font-bold text-sm uppercase mb-3 flex items-center gap-2">
                            <Target size={16} /> Önerilen Aksiyon Planı
                        </h4>
                        <ul className="space-y-3">
                            {insight.actions.map((action, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                                    <ChevronRight size={16} className={`mt-0.5 flex-shrink-0 ${getThemeColor().split(' ')[0]}`} />
                                    <span>{action}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Target KPI */}
                    <div className="text-center pt-2">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">BEKLENEN ETKİ</span>
                        <p className={`text-lg font-bold ${getThemeColor().split(' ')[0]}`}>{insight.kpiTarget}</p>
                    </div>

                    <button 
                        onClick={() => setIsOpen(false)}
                        className={`w-full mt-2 py-3.5 rounded font-cyber text-white font-bold shadow-lg transform transition-all active:scale-95 bg-gradient-to-r ${
                            contextType === 'dashboard' ? 'from-fuchsia-600 to-purple-600 hover:from-fuchsia-500' : 
                            contextType === 'dna' ? 'from-indigo-600 to-blue-600 hover:from-indigo-500' :
                            contextType === 'live' ? 'from-cyan-600 to-teal-600 hover:from-cyan-500' :
                            'from-pink-600 to-rose-600 hover:from-pink-500'
                        }`}
                    >
                        ÖNERİLERİ ONAYLA VE UYGULA
                    </button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[300px]">
                    <p className="text-red-400 text-center">Bağlantı Başarısız.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIBrainProtocol;