import React, { useState, useMemo } from 'react';
import { LeadProfile, SalesStage } from '../types';
import { 
  Filter, Search, Zap, LayoutList, Kanban, Clock, 
  BrainCircuit, CheckCircle, AlertTriangle, User,
  MoreHorizontal, DollarSign, Calendar
} from 'lucide-react';
import { getIndividualLeadInsight } from '../services/geminiService';

// --- MOCK DATA GENERATOR ---
const generateMockLeads = (): LeadProfile[] => [
  { 
    id: '1', name: 'Ahmet Y.', segment: 'Z Kuşağı', avatarInitials: 'AY', source: 'TikTok', interest: 'Yazılım', 
    leadScore: 92, status: 'Premium', lastActive: 'Şimdi', preferredTime: 'Gece', completedModules: 5, 
    story: 'TikTok üzerinden geldi ve 3 Python dersini arka arkaya bitirdi.',
    pipelineStage: 'Decision', potentialValue: 1200,
    timelineActivity: [{dayOffset: 0, type: 'module'}, {dayOffset: -1, type: 'login'}, {dayOffset: -2, type: 'module'}, {dayOffset: -3, type: 'gap'}]
  },
  { 
    id: '2', name: 'Selin K.', segment: 'Profesyonel', avatarInitials: 'SK', source: 'LinkedIn', interest: 'Veri', 
    leadScore: 45, status: 'Riskli', lastActive: '3 gün önce', preferredTime: 'Sabah', completedModules: 1, 
    story: 'Excel modülünü yarıda bıraktı, geri dönüş sinyali düşük.',
    pipelineStage: 'Trial', potentialValue: 450,
    timelineActivity: [{dayOffset: 0, type: 'gap'}, {dayOffset: -1, type: 'gap'}, {dayOffset: -2, type: 'gap'}, {dayOffset: -3, type: 'login'}]
  },
  { 
    id: '3', name: 'Mert D.', segment: 'Üniversiteli', avatarInitials: 'MD', source: 'Instagram', interest: 'Tasarım', 
    leadScore: 72, status: 'Freemium', lastActive: '12 dk önce', preferredTime: 'Öğle', completedModules: 3, 
    story: 'Instagram hikayesinden kaydoldu, UX giriş dersini tamamladı.',
    pipelineStage: 'Decision', potentialValue: 800,
    timelineActivity: [{dayOffset: 0, type: 'login'}, {dayOffset: -1, type: 'module'}, {dayOffset: -2, type: 'gap'}]
  },
  { 
    id: '4', name: 'Elif B.', segment: 'Kariyer Değişimi', avatarInitials: 'EB', source: 'Referans', interest: 'Pazarlama', 
    leadScore: 95, status: 'Premium', lastActive: '1 saat önce', preferredTime: 'Akşam', completedModules: 12, 
    story: 'Arkadaş davetiyle geldi, Dijital Pazarlama sertifikasına %90 yaklaştı.',
    pipelineStage: 'Payment', potentialValue: 2500,
    timelineActivity: [{dayOffset: 0, type: 'payment_attempt'}, {dayOffset: -1, type: 'module'}, {dayOffset: -2, type: 'module'}, {dayOffset: -3, type: 'module'}]
  },
  { 
    id: '5', name: 'Can T.', segment: 'Z Kuşağı', avatarInitials: 'CT', source: 'TikTok', interest: 'Blockchain', 
    leadScore: 60, status: 'Yeni', lastActive: '5 dk önce', preferredTime: 'Gece', completedModules: 0, 
    story: 'Hesabı yeni oluşturdu, cüzdan bağlama aşamasında bekliyor.',
    pipelineStage: 'New', potentialValue: 600,
    timelineActivity: [{dayOffset: 0, type: 'login'}, {dayOffset: -1, type: 'gap'}]
  },
  { 
    id: '6', name: 'Zeynep A.', segment: 'Profesyonel', avatarInitials: 'ZA', source: 'LinkedIn', interest: 'Yazılım', 
    leadScore: 82, status: 'Freemium', lastActive: '20 dk önce', preferredTime: 'Sabah', completedModules: 4, 
    story: 'Java 101 testinden tam puan aldı, ödeme sayfasını görüntüledi.',
    pipelineStage: 'Decision', potentialValue: 1500,
    timelineActivity: [{dayOffset: 0, type: 'module'}, {dayOffset: -1, type: 'login'}, {dayOffset: -2, type: 'gap'}]
  },
  { 
    id: '7', name: 'Mehmet O.', segment: 'Profesyonel', avatarInitials: 'MO', source: 'Direkt', interest: 'Liderlik', 
    leadScore: 30, status: 'Riskli', lastActive: '1 hafta önce', preferredTime: 'Akşam', completedModules: 2, 
    story: 'Şirket hesabıyla girdi ama aktivite kesti.',
    pipelineStage: 'Trial', potentialValue: 3000,
    timelineActivity: [{dayOffset: 0, type: 'gap'}, {dayOffset: -1, type: 'gap'}, {dayOffset: -2, type: 'gap'}, {dayOffset: -3, type: 'gap'}]
  },
  { 
    id: '8', name: 'Lara S.', segment: 'Z Kuşağı', avatarInitials: 'LS', source: 'Instagram', interest: 'Tasarım', 
    leadScore: 98, status: 'Premium', lastActive: 'Şimdi', preferredTime: 'Gece', completedModules: 15, 
    story: 'Portfolyo modülünü tamamladı, mentörlük talep etti.',
    pipelineStage: 'Won', potentialValue: 5000,
    timelineActivity: [{dayOffset: 0, type: 'module'}, {dayOffset: -1, type: 'module'}, {dayOffset: -2, type: 'login'}, {dayOffset: -3, type: 'module'}]
  },
];

type ViewMode = 'list' | 'kanban' | 'timeline';

const LiveLeadStream: React.FC = () => {
  const [leads, setLeads] = useState<LeadProfile[]>(generateMockLeads());
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [selectedLead, setSelectedLead] = useState<LeadProfile | null>(null);

  // --- AI AURA LOGIC ---
  const getAIAura = (lead: LeadProfile) => {
    // High Score + Payment Stage = GOLD (Upsell/Close)
    if (lead.leadScore > 85 || lead.pipelineStage === 'Payment') {
      return 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)] animate-pulse-slow';
    }
    // Low Score + Inactivity = RED (Risk)
    if (lead.leadScore < 50 || lead.status === 'Riskli') {
      return 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
    }
    // Standard = BLUE
    return 'border-slate-700 hover:border-cyan-500/50';
  };

  const handleLeadClick = async (lead: LeadProfile) => {
    setSelectedLead(lead);
    setAiModalOpen(true);
    setAiLoading(true);
    setAiResult(null);
    const result = await getIndividualLeadInsight(lead);
    setAiResult(result);
    setAiLoading(false);
  };

  const filteredLeads = useMemo(() => {
    if (activeFilter === 'All') return leads;
    return leads.filter(l => l.status === activeFilter);
  }, [leads, activeFilter]);

  // --- SUB-COMPONENT: DAILY GROWTH PULSE ---
  const DailyGrowthPulse = () => (
    <div className="w-full bg-slate-950 border-b border-cyan-900/30 p-2 px-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-4 rounded-xl border-t border-l border-r mt-2 relative overflow-hidden">
        {/* Background Scanline */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(6,182,212,0.05),transparent)] animate-scan pointer-events-none"></div>
        
        <div className="flex items-center gap-6 z-10 w-full md:w-auto overflow-x-auto no-scrollbar">
            {/* Hot Leads */}
            <div className="flex items-center gap-3 pr-6 border-r border-slate-800 min-w-max">
                <div className="bg-amber-500/20 p-2 rounded-full">
                    <Zap className="text-amber-400 w-4 h-4" />
                </div>
                <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Sıcak Temas (Bugün)</div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-cyber font-bold text-white">12 Kişi</span>
                        <span className="text-xs text-amber-400 font-bold">~$14.5K Potansiyel</span>
                    </div>
                </div>
            </div>

            {/* Sales Target */}
            <div className="flex items-center gap-3 pr-6 border-r border-slate-800 min-w-max">
                <div className="bg-green-500/20 p-2 rounded-full">
                    <CheckCircle className="text-green-400 w-4 h-4" />
                </div>
                <div className="w-32">
                    <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                        <span>Satış Hedefi</span>
                        <span className="text-green-400">%68</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[68%] shadow-[0_0_10px_#22c55e]"></div>
                    </div>
                </div>
            </div>

            {/* Risk Alert */}
            <div className="flex items-center gap-3 min-w-max">
                <div className="bg-red-500/20 p-2 rounded-full animate-pulse">
                    <AlertTriangle className="text-red-400 w-4 h-4" />
                </div>
                <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Risk Alarmı</div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-cyber font-bold text-red-400">5 Kullanıcı</span>
                        <span className="text-xs text-slate-500">Son 24s pasif</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700 gap-4">
      
      {/* 1. DAILY PULSE */}
      <DailyGrowthPulse />

      {/* 2. CONTROLS HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-800 backdrop-blur-md gap-4">
          
          {/* Filters */}
          <div className="flex items-center gap-2">
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-slate-400">
                  <Filter size={16} />
              </div>
              {['All', 'Premium', 'Riskli'].map(status => (
                  <button
                    key={status}
                    onClick={() => setActiveFilter(status)}
                    className={`px-3 py-1.5 rounded text-xs font-cyber transition-all border ${activeFilter === status ? 'bg-cyan-900/40 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                  >
                    {status}
                  </button>
              ))}
          </div>

          {/* View Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                title="Liste Görünümü"
              >
                  <LayoutList size={16} />
              </button>
              <button 
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded transition-all ${viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                title="Pipeline (Kanban)"
              >
                  <Kanban size={16} />
              </button>
              <button 
                onClick={() => setViewMode('timeline')}
                className={`p-2 rounded transition-all ${viewMode === 'timeline' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                title="Yolculuk (Timeline)"
              >
                  <Clock size={16} />
              </button>
          </div>
      </div>

      {/* 3. MAIN VIEW ENGINE */}
      <div className="flex-1 min-h-[500px] relative">
          
          {/* VIEW: KANBAN BOARD */}
          {viewMode === 'kanban' && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-full overflow-x-auto pb-4">
                  {(['New', 'Trial', 'Decision', 'Payment', 'Won'] as SalesStage[]).map(stage => (
                      <div key={stage} className="bg-slate-900/30 border border-slate-800 rounded-xl flex flex-col min-w-[200px]">
                          <div className="p-3 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900/80 backdrop-blur z-10 rounded-t-xl">
                              <span className="text-xs font-bold font-cyber text-slate-300 uppercase tracking-wider">
                                  {stage === 'New' ? 'Yeni Kayıt' : stage === 'Trial' ? 'Deneme' : stage === 'Decision' ? 'Karar (Sıcak)' : stage === 'Payment' ? 'Ödeme' : 'Kazanıldı'}
                              </span>
                              <span className="bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded-full">
                                  {filteredLeads.filter(l => l.pipelineStage === stage).length}
                              </span>
                          </div>
                          <div className="p-2 space-y-2 flex-1 overflow-y-auto max-h-[600px] scrollbar-hide">
                              {filteredLeads.filter(l => l.pipelineStage === stage).map(lead => (
                                  <div 
                                    key={lead.id} 
                                    onClick={() => handleLeadClick(lead)}
                                    className={`bg-slate-900 p-3 rounded-lg border-2 cursor-pointer transition-all hover:-translate-y-1 relative group ${getAIAura(lead)}`}
                                  >
                                      {/* Aura Glow Background */}
                                      {lead.leadScore > 85 && <div className="absolute inset-0 bg-amber-500/5 rounded-lg pointer-events-none"></div>}
                                      {lead.status === 'Riskli' && <div className="absolute inset-0 bg-red-500/5 rounded-lg pointer-events-none"></div>}

                                      <div className="flex justify-between items-start mb-2 relative z-10">
                                          <div className="flex items-center gap-2">
                                              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white border border-slate-600">
                                                  {lead.avatarInitials}
                                              </div>
                                              <span className="text-xs font-bold text-white truncate w-20">{lead.name}</span>
                                          </div>
                                          <div className={`text-[10px] font-cyber px-1 rounded ${lead.leadScore > 80 ? 'text-green-400 bg-green-900/20' : 'text-slate-400 bg-slate-800'}`}>
                                              {lead.leadScore}
                                          </div>
                                      </div>
                                      <div className="flex justify-between items-center text-[10px] text-slate-500 relative z-10">
                                          <span className="flex items-center gap-1"><DollarSign size={10} />{lead.potentialValue}</span>
                                          <span>{lead.lastActive}</span>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          )}

          {/* VIEW: TIMELINE HORIZON */}
          {viewMode === 'timeline' && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr>
                              <th className="p-2 w-48 text-xs font-bold text-slate-500 uppercase border-b border-slate-800 sticky left-0 bg-slate-900 z-20">Kullanıcı</th>
                              {[...Array(7)].map((_, i) => (
                                  <th key={i} className="p-2 text-center border-b border-slate-800 min-w-[60px]">
                                      <div className="text-[10px] text-slate-500">Gün -{i}</div>
                                  </th>
                              ))}
                          </tr>
                      </thead>
                      <tbody>
                          {filteredLeads.map(lead => (
                              <tr key={lead.id} className="group hover:bg-slate-800/30 transition-colors border-b border-slate-800/50 cursor-pointer" onClick={() => handleLeadClick(lead)}>
                                  <td className="p-3 sticky left-0 bg-slate-900 z-10 group-hover:bg-slate-800/30 transition-colors border-r border-slate-800">
                                      <div className="flex items-center gap-3">
                                          <div className={`w-2 h-8 rounded-full ${lead.leadScore > 80 ? 'bg-amber-400' : lead.status === 'Riskli' ? 'bg-red-500' : 'bg-slate-600'}`}></div>
                                          <div>
                                              <div className="text-sm font-bold text-white">{lead.name}</div>
                                              <div className="text-[10px] text-slate-400">{lead.segment}</div>
                                          </div>
                                      </div>
                                  </td>
                                  {[...Array(7)].map((_, i) => {
                                      const activity = lead.timelineActivity.find(a => Math.abs(a.dayOffset) === i);
                                      return (
                                          <td key={i} className="p-2 text-center border-l border-slate-800/30">
                                              {activity ? (
                                                  <div className="flex justify-center">
                                                      {activity.type === 'module' && <div className="w-8 h-6 bg-cyan-500/20 border border-cyan-500 rounded flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.3)]"><div className="w-2 h-2 bg-cyan-400 rounded-full"></div></div>}
                                                      {activity.type === 'login' && <div className="w-8 h-6 bg-indigo-500/20 border border-indigo-500 rounded flex items-center justify-center"><User size={12} className="text-indigo-400"/></div>}
                                                      {activity.type === 'gap' && <div className="w-8 h-6 bg-slate-800/50 border border-slate-700 rounded flex items-center justify-center"><div className="w-4 h-0.5 bg-slate-600"></div></div>}
                                                      {activity.type === 'payment_attempt' && <div className="w-8 h-6 bg-amber-500/20 border border-amber-500 rounded flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.3)]"><DollarSign size={12} className="text-amber-400"/></div>}
                                                  </div>
                                              ) : (
                                                  <div className="w-full h-full flex justify-center opacity-10"><div className="w-1 h-1 bg-slate-500 rounded-full"></div></div>
                                              )}
                                          </td>
                                      );
                                  })}
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          )}

          {/* VIEW: ENHANCED LIST */}
          {viewMode === 'list' && (
              <div className="space-y-3 pr-2 h-full overflow-y-auto">
                  {filteredLeads.map((lead) => (
                     <div 
                        key={lead.id} 
                        onClick={() => handleLeadClick(lead)}
                        className={`group bg-slate-900/60 hover:bg-slate-800/80 border-2 rounded-xl p-4 transition-all cursor-pointer relative overflow-hidden flex items-center gap-4 ${getAIAura(lead)}`}
                     >
                        <div className="relative">
                           <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-slate-900 ${lead.leadScore > 80 ? 'bg-cyan-400' : lead.leadScore > 50 ? 'bg-slate-300' : 'bg-red-400'}`}>
                              {lead.avatarInitials}
                           </div>
                        </div>

                        <div className="flex-1">
                           <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-white font-bold">{lead.name}</h4>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                 {lead.pipelineStage}
                              </span>
                           </div>
                           <p className="text-sm text-slate-300 leading-snug truncate max-w-md">
                              <span className="text-cyan-400 font-bold">{lead.source}</span>: {lead.story}
                           </p>
                        </div>

                        <div className="text-right hidden md:block">
                            <div className="text-xs text-slate-500 uppercase font-bold">Skor</div>
                            <div className="text-xl font-cyber font-bold text-white">{lead.leadScore}</div>
                        </div>
                        
                        <div className="p-2 rounded-full hover:bg-slate-700 transition-colors text-slate-400">
                            <MoreHorizontal size={20} />
                        </div>
                     </div>
                  ))}
              </div>
          )}

      </div>

      {/* AI ANALYST MODAL */}
      {aiModalOpen && selectedLead && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in zoom-in duration-300">
              <div className="bg-slate-900 border border-cyan-500 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden flex flex-col max-h-[85vh]">
                  
                  {/* Fixed Header */}
                  <div className="p-5 bg-cyan-950/30 border-b border-cyan-500/30 flex justify-between items-center flex-shrink-0">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/50">
                             {selectedLead.avatarInitials}
                          </div>
                          <div>
                             <h3 className="font-cyber text-white text-sm tracking-wider">LİDER ANALİZ RAPORU</h3>
                             <p className="text-[10px] text-slate-400 uppercase">{selectedLead.name} • {selectedLead.pipelineStage}</p>
                          </div>
                       </div>
                       <button onClick={() => setAiModalOpen(false)} className="text-slate-500 hover:text-white"><Zap size={20}/></button>
                  </div>
                  
                  {/* Scrollable Content */}
                  <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                      {aiLoading ? (
                          <div className="flex flex-col items-center gap-4 py-6 justify-center h-full">
                              <div className="relative">
                                 <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                                 <div className="absolute inset-0 flex items-center justify-center">
                                    <BrainCircuit size={20} className="text-cyan-500 animate-pulse" />
                                 </div>
                              </div>
                              <p className="font-cyber text-cyan-200 animate-pulse text-xs">DAVRANIŞSAL PROFİL ÇIKARILIYOR...</p>
                          </div>
                      ) : aiResult ? (
                          <div className="space-y-5">
                              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
                                  <span className="text-xs text-slate-400 uppercase font-bold">Dönüşüm Olasılığı</span>
                                  <div className="flex items-center gap-2">
                                      <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                                          <div 
                                            className={`h-full rounded-full ${aiResult.conversionProbability > 70 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                                            style={{ width: `${aiResult.conversionProbability}%` }}
                                          ></div>
                                      </div>
                                      <span className="font-cyber font-bold text-white">%{aiResult.conversionProbability}</span>
                                  </div>
                              </div>

                              <div className="bg-gradient-to-r from-indigo-900/20 to-slate-900 border-l-4 border-indigo-500 p-4 rounded-r">
                                  <h4 className="text-indigo-400 font-bold text-xs uppercase mb-1 flex items-center gap-2">
                                     <Zap size={12} /> UPSELL FIRSATI
                                  </h4>
                                  <p className="text-white font-medium text-sm mb-1">{aiResult.upsell.suggestion}</p>
                                  <p className="text-xs text-slate-400 italic">"{aiResult.upsell.reason}"</p>
                              </div>

                              <div className="bg-gradient-to-r from-red-900/20 to-slate-900 border-l-4 border-red-500 p-4 rounded-r">
                                  <h4 className="text-red-400 font-bold text-xs uppercase mb-1 flex items-center gap-2">
                                     <AlertTriangle size={12} /> RİSK ANALİZİ ({aiResult.churn.riskLevel})
                                  </h4>
                                  <p className="text-slate-300 text-sm">{aiResult.churn.prevention}</p>
                              </div>

                              <button onClick={() => setAiModalOpen(false)} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-cyber py-3 rounded shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-transform active:scale-95">
                                  AKSİYON AL VE KAPAT
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

export default LiveLeadStream;