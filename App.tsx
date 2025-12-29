import React, { useState, useEffect } from 'react';
import { TimeFilter, KPIMetric, SkillEvent, TrendingSkill, DateRange, GrowthPulseData, SegmentMetric, SourceMetric, VelocityMetric, DNAUniverseData, ExperienceData } from './types';
import KPICard from './components/KPICard';
import LiveTicker from './components/LiveTicker';
import AIBrainProtocol from './components/AIBrainProtocol';
import TrendingMap from './components/TrendingMap';
import TimePerspectiveEngine from './components/TimePerspectiveEngine';
import GrowthPulseSection from './components/GrowthPulseSection';
import SegmentOpportunityUniverse from './components/SegmentOpportunityUniverse';
import UserDNAUniverse from './components/UserDNAUniverse';
import LiveLeadStream from './components/LiveLeadStream';
import ExperienceSentimentRadar from './components/ExperienceSentimentRadar';
import TrendBenchmarkEngine from './components/TrendBenchmarkEngine';
import WhatIfSimulator from './components/WhatIfSimulator';
import AutonomousOfferEngine from './components/AutonomousOfferEngine';
import { Info, LayoutDashboard, Dna, Activity, Heart, Sliders, Zap } from 'lucide-react';

// --- MOCK DATA GENERATOR WITH CONTEXT ---
const generateData = (filter: TimeFilter): { 
    metrics: KPIMetric[], 
    summary: string, 
    pulseData: GrowthPulseData[],
    segments: SegmentMetric[],
    sources: SourceMetric[],
    velocity: VelocityMetric[],
    dnaData: DNAUniverseData,
    experienceData: ExperienceData
} => {
  let summary = "";
  let pulseData: GrowthPulseData[] = [];
  let segments: SegmentMetric[] = [];
  let sources: SourceMetric[] = [];
  let velocity: VelocityMetric[] = [];
  let dnaData: DNAUniverseData = { geo: [], generations: [], learningTime: [], loyalty: [], personas: [], matrix: [], roi: [], story: { generation: '', time: '' } };
  let experienceData: ExperienceData = { trends: [], words: [], impact: [], radarData: [], liveFeedback: [], financialCorrelation: [], recoveryAlerts: [], story: '' };

  // Helper to generate pulse data
  const createPulseData = (count: number, labelPrefix: string): GrowthPulseData[] => {
      return Array.from({ length: count }).map((_, i) => ({
          label: `${labelPrefix} ${i + 1}`,
          leadScore: Math.floor(Math.random() * (95 - 60) + 60),
          churnRisk: Math.floor(Math.random() * (40 - 10) + 10),
          newLeads: Math.floor(Math.random() * 50 + 10),
          crmComment: Math.random() > 0.5 ? "Yüksek etkileşim sinyali." : "Durgunluk belirtisi, risk analizi yapıldı."
      }));
  };

  // Mock Segment Data
  segments = [
      { name: 'B2B Kurumsal', value: 450000, fill: '#d946ef', leadCount: 120 },
      { name: 'B2C Pro', value: 280000, fill: '#8b5cf6', leadCount: 850 },
      { name: 'B2C Freemium', value: 120000, fill: '#06b6d4', leadCount: 2500 },
      { name: 'Akademik', value: 90000, fill: '#10b981', leadCount: 300 }
  ];

  // Mock Source Data
  sources = [
      { source: 'LinkedIn', leadScore: 88, volume: 450, churnRate: 5 },
      { source: 'Instagram', leadScore: 65, volume: 1200, churnRate: 15 },
      { source: 'TikTok', leadScore: 55, volume: 2000, churnRate: 25 },
      { source: 'Direkt', leadScore: 78, volume: 300, churnRate: 8 },
  ];

  // Mock Velocity
  velocity = [
      { segment: 'Hızlı Dönüşüm (Fast Track)', velocityDays: 4, volume: 150 },
      { segment: 'Standart Akış', velocityDays: 14, volume: 890 },
      { segment: 'Düşük İvme', velocityDays: 35, volume: 420 }
  ];

  // Mock DNA Data Base
  const baseDNA: DNAUniverseData = {
    geo: [
        { city: 'İstanbul', country: 'TR', users: 3200, growth: 12 },
        { city: 'Berlin', country: 'DE', users: 1500, growth: 8 },
        { city: 'Londra', country: 'UK', users: 1200, growth: 15 },
        { city: 'Bakü', country: 'AZ', users: 800, growth: 22 },
    ],
    generations: [
        { name: 'Z Kuşağı', value: 55, fill: '#22d3ee', behavior: 'Video & Oyunlaştırma' },
        { name: 'Y Kuşağı', value: 35, fill: '#d946ef', behavior: 'Sertifika Odaklı' },
        { name: 'X Kuşağı', value: 10, fill: '#94a3b8', behavior: 'Kariyer Dönüşümü' }
    ],
    learningTime: [
        { time: '08:00', mobile: 20, desktop: 10 },
        { time: '12:00', mobile: 60, desktop: 30 },
        { time: '16:00', mobile: 40, desktop: 50 },
        { time: '20:00', mobile: 85, desktop: 20 },
        { time: '00:00', mobile: 30, desktop: 10 },
    ],
    loyalty: [
        { subject: 'Video İzleme', loyal: 90, risk: 40, fullMark: 100 },
        { subject: 'Ödev Tamamlama', loyal: 80, risk: 20, fullMark: 100 },
        { subject: 'Platforma Giriş', loyal: 95, risk: 10, fullMark: 100 },
        { subject: 'Paylaşım', loyal: 60, risk: 5, fullMark: 100 },
        { subject: 'Satın Alma', loyal: 70, risk: 2, fullMark: 100 },
    ],
    personas: [],
    matrix: [],
    roi: [],
    story: {
        generation: "Z Kuşağı kullanıcıları video içeriklere %40 daha fazla tepki veriyor.",
        time: "Akşam 20:00-22:00 arası mobil kullanım zirve yapıyor."
    }
  };
  
  // Base Experience Data
  const baseExperience: ExperienceData = {
      trends: Array.from({length: 7}, (_, i) => ({
          date: `Gün ${i+1}`,
          positive: Math.floor(Math.random() * 30) + 50,
          neutral: Math.floor(Math.random() * 20) + 10,
          negative: Math.floor(Math.random() * 10) + 5,
          nps: Math.floor(Math.random() * 20) + 60
      })),
      words: [
          { text: 'Hızlı', weight: 9, sentiment: 'positive' },
          { text: 'Pratik', weight: 8, sentiment: 'positive' },
          { text: 'Pahalı', weight: 4, sentiment: 'negative' },
          { text: 'Donuyor', weight: 3, sentiment: 'negative' },
          { text: 'Eğlenceli', weight: 7, sentiment: 'positive' },
          { text: 'Sertifika', weight: 6, sentiment: 'positive' },
          { text: 'Destek', weight: 5, sentiment: 'negative' },
          { text: 'Modern', weight: 6, sentiment: 'positive' },
      ],
      impact: [
          { feature: 'Dikey Video', score: 85, fullMark: 100 },
          { feature: 'Oyunlaştırma', score: 60, fullMark: 100 },
          { feature: 'Mobil Arayüz', score: 40, fullMark: 100 },
          { feature: 'Fiyatlandırma', score: -20, fullMark: 100 },
          { feature: 'Onay Süresi', score: -45, fullMark: 100 },
      ],
      // New fields init
      radarData: [],
      liveFeedback: [],
      financialCorrelation: [],
      recoveryAlerts: [],
      story: "Son güncelleme ile 'video hızı' şikayetleri %40 azalırken, 'içerik çeşitliliği' talebi duygu durumunu nötr seviyeye çekmektedir."
  };

  if (filter === 'Last 24 Hours') {
    summary = "ANLIK AKIŞ: Son 24 saatte Asya pazarında mikro-öğrenme artışı (%15) tespit edildi. Churn riski minimum seviyede.";
    pulseData = [
        { label: '00:00', leadScore: 65, churnRisk: 12, newLeads: 5, crmComment: 'Gece trafiği düşük.' },
        { label: '04:00', leadScore: 70, churnRisk: 10, newLeads: 8, crmComment: 'Asya pazarı açılıyor.' },
        { label: '08:00', leadScore: 85, churnRisk: 15, newLeads: 42, crmComment: 'Sabah yoğunluğu başladı.' },
        { label: '12:00', leadScore: 92, churnRisk: 22, newLeads: 55, crmComment: 'Öğle arası rekor katılım.' },
        { label: '16:00', leadScore: 88, churnRisk: 18, newLeads: 38, crmComment: 'Kurumsal çıkış saatleri.' },
        { label: '20:00', leadScore: 75, churnRisk: 14, newLeads: 25, crmComment: 'Bireysel kullanıcılar aktif.' },
    ];
    dnaData = { ...baseDNA, story: { generation: "Bugün Z Kuşağı oyunlaştırma modüllerinde %20 daha aktif.", time: "Anlık olarak mobil trafik desktop'ı geçti." } };
    experienceData = { ...baseExperience, story: "Anlık NPS skoru son 4 saattir yükselişte, 'Gece Modu' güncellemesi övgü alıyor." };

    return {
      summary, pulseData, segments, sources, velocity, dnaData, experienceData,
      metrics: [
        {
          id: '1', title: 'Tamamlama Oranı', value: 92.4, unit: '%', trend: 5.2, trendDirection: 'up',
          dataStory: 'Gece vardiyasında rekor tamamlama!', color: 'cyan', history: [80, 82, 85, 88, 90, 91, 92]
        },
        {
          id: '2', title: 'Ort. Dikkat Süresi', value: 65, unit: 'sn', trend: 12.0, trendDirection: 'up',
          dataStory: 'Kısa içerikler dikkati %12 artırdı.', color: 'pink', history: [40, 45, 50, 55, 60, 62, 65]
        },
        {
          id: '3', title: 'Anlık Aktif Kullanıcı', value: '3,205', trend: 22.1, trendDirection: 'up',
          dataStory: 'Canlı oturumlarda yoğunluk var.', color: 'purple', history: [1500, 2000, 2500, 3000, 3100, 3205]
        },
        {
          id: '4', title: 'Bilgi Tutma Skoru', value: '+5', unit: '%', trend: 1.1, trendDirection: 'neutral',
          dataStory: 'Kısa vadeli hafıza testleri başarılı.', color: 'cyan', history: [2, 3, 4, 3, 4, 5, 5]
        },
        {
            id: '5', title: 'Yeni Rozetler', value: 142, unit: ' adet', trend: 8.5, trendDirection: 'up',
            dataStory: 'Hızlı tüketim ödülleri tetiklendi.', color: 'green', history: [50, 80, 100, 120, 130, 142]
        },
        {
            id: '6', title: 'Saatlik Gelir', value: '$2.1k', unit: '/sa', trend: 3.4, trendDirection: 'up',
            dataStory: 'Flash satış kampanyası etkili.', color: 'pink', history: [1.2, 1.5, 1.8, 1.9, 2.0, 2.1]
        }
      ]
    };
  } else if (filter === 'Last 7 Days') {
    summary = "HAFTALIK TREND: Hafta sonu 'Data Science' modüllerinde %30 katılım artışı. B2B lisans yenilemeleri stabil.";
    pulseData = createPulseData(7, 'Gün');
    pulseData[4].churnRisk = 65; 
    pulseData[4].crmComment = "Dikkat: Abonelik iptal taleplerinde ani artış.";
    dnaData = { ...baseDNA, 
        generations: [
            { name: 'Z Kuşağı', value: 60, fill: '#22d3ee', behavior: 'Video' },
            { name: 'Y Kuşağı', value: 30, fill: '#d946ef', behavior: 'Sertifika' },
            { name: 'X Kuşağı', value: 10, fill: '#94a3b8', behavior: 'Kariyer' }
        ],
        story: { generation: "Hafta sonu Y kuşağının sertifika tamamlama oranı %15 arttı.", time: "Hafta içi akşamları desktop kullanımı artıyor." } 
    };
    experienceData = { ...baseExperience, story: "Hafta ortası yaşanan sunucu kesintisi negatif duygu durumunu %10 artırdı." };

    return {
      summary, pulseData, segments, sources, velocity, dnaData, experienceData,
      metrics: [
        {
          id: '1', title: 'Tamamlama Oranı', value: 78.5, unit: '%', trend: -2.1, trendDirection: 'down',
          dataStory: 'Hafta başı sendromu kaynaklı hafif düşüş.', color: 'cyan', history: [85, 82, 80, 79, 78, 79, 78]
        },
        {
          id: '2', title: 'Ort. Dikkat Süresi', value: 48, unit: 'sn', trend: 1.5, trendDirection: 'neutral',
          dataStory: 'Standart sapma aralığında.', color: 'pink', history: [45, 46, 48, 47, 49, 48, 48]
        },
        {
          id: '3', title: 'Haftalık Aktif', value: '45.2k', trend: 5.4, trendDirection: 'up',
          dataStory: 'Yeni kayıt kampanyası meyve veriyor.', color: 'purple', history: [40, 41, 42, 43, 44, 45]
        },
        {
          id: '4', title: 'Bilgi Tutma Skoru', value: '+14', unit: '%', trend: 4.2, trendDirection: 'up',
          dataStory: 'Tekrar algoritmaları oturmaya başladı.', color: 'cyan', history: [10, 11, 12, 13, 13.5, 14]
        },
        {
          id: '5', title: 'Sertifika Üretimi', value: '1.2k', trend: 15.0, trendDirection: 'up',
          dataStory: 'Python bootcamp mezunları artışta.', color: 'green', history: [0.8, 0.9, 1.0, 1.1, 1.15, 1.2]
        },
        {
          id: '6', title: 'Haftalık Ciro', value: '$85k', unit: '', trend: 10.2, trendDirection: 'up',
          dataStory: 'Kurumsal anlaşma (TechCorp) imzalandı.', color: 'pink', history: [60, 65, 70, 75, 80, 85]
        }
      ]
    };
  } else {
    // 30 Days or Custom
    summary = "AYLIK DÖNGÜ: Churn riski %3 azaldı. 'Liderlik' eğitimi abonelik yenilemelerinde kilit rol oynuyor.";
    pulseData = createPulseData(10, 'Hafta');
    dnaData = { ...baseDNA, story: { generation: "Son 30 günde X kuşağında %5 artış gözlemlendi (Kariyer Değişimi).", time: "Mobil kullanım oranı %75'e sabitlendi." } };
    experienceData = { ...baseExperience, story: "Aylık bazda 'İçerik Kalitesi' memnuniyeti %85 seviyesine oturdu." };

    return {
      summary, pulseData, segments, sources, velocity, dnaData, experienceData,
      metrics: [
        {
          id: '1', title: 'Tamamlama Oranı', value: 84.2, unit: '%', trend: 12.5, trendDirection: 'up',
          dataStory: '%20\'lik sektör ortalamasını 4 katına katladık!', color: 'cyan', history: [60, 65, 70, 75, 78, 80, 82, 84]
        },
        {
          id: '2', title: 'Ort. Dikkat Süresi', value: 52, unit: 'sn', trend: 5.3, trendDirection: 'up',
          dataStory: 'Odak Metresi kilitlendi. Katılım zirvede.', color: 'pink', history: [30, 35, 32, 40, 45, 48, 50, 52]
        },
        {
          id: '3', title: 'Aylık Aktif', value: '150k', trend: 8.1, trendDirection: 'up',
          dataStory: 'Sunucu yükü %65. Ölçeklenebilirlik yeşil.', color: 'purple', history: [120, 130, 135, 140, 145, 150]
        },
        {
          id: '4', title: 'Bilgi Tutma Skoru', value: '+18', unit: '%', trend: 2.4, trendDirection: 'up',
          dataStory: 'Yapay zeka pekiştirme döngüleri aktif.', color: 'cyan', history: [10, 12, 14, 15, 16, 17, 18]
        },
        {
          id: '5', title: 'Blockchain Sertifikaları', value: 892, unit: ' adet', trend: 14, trendDirection: 'up',
          dataStory: 'Yetenek hızının değişmez kanıtı.', color: 'green', history: [200, 350, 500, 650, 800, 892]
        },
        {
          id: '6', title: 'Aylık Gelir', value: '$340k', unit: '', trend: 0.8, trendDirection: 'down',
          dataStory: 'Asya bölgesinde hafif B2B düşüşü.', color: 'pink', history: [300, 310, 320, 330, 335, 340]
        }
      ]
    };
  }
};

const mockEvents: SkillEvent[] = [
  { id: 1, user: 'Ahmet K. (İstanbul)', location: 'İstanbul', action: 'Python Döngüleri bitirdi 🚀', icon: 'rocket' },
  { id: 2, user: 'Sarah J. (Londra)', location: 'Londra', action: 'Veri Bilimi Rozetini kazandı 🎓', icon: 'medal' },
  { id: 3, user: 'Yuki T. (Tokyo)', location: 'Tokyo', action: 'AI Etik Modülüne başladı 🔥', icon: 'flame' },
  { id: 4, user: 'Elena R. (Berlin)', location: 'Berlin', action: 'UX Tasarım Testini geçti 🚀', icon: 'rocket' },
  { id: 5, user: 'Mateo L. (Sao Paulo)', location: 'Sao Paulo', action: 'Blockchain Sertifikası üretti 🎓', icon: 'medal' },
];

const mockTrends: TrendingSkill[] = [
  { name: 'Python', region: 'Avrupa', growth: 145, category: 'Yazılım' },
  { name: 'Kriz Liderliği', region: 'Kuzey Amerika', growth: 88, category: 'Soft Skills' },
  { name: 'İleri Excel', region: 'Asya Pasifik', growth: 112, category: 'İş Dünyası' },
];

// Helper to get active data for AI
const getActiveContextData = (tab: string, metrics: KPIMetric[], dna: DNAUniverseData, exp: ExperienceData) => {
    switch(tab) {
        case 'dashboard': return metrics;
        case 'dna': return dna;
        case 'live': return []; // Live stream fetches its own mock data inside component, simplified here
        case 'experience': return exp;
        default: return metrics;
    }
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'dna' | 'live' | 'experience' | 'simulator' | 'offer-engine'>('dashboard');
  const [filter, setFilter] = useState<TimeFilter>('Last 24 Hours');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const initialData = generateData('Last 24 Hours');
  const [metrics, setMetrics] = useState<KPIMetric[]>(initialData.metrics);
  const [summary, setSummary] = useState<string>(initialData.summary);
  const [pulseData, setPulseData] = useState<GrowthPulseData[]>(initialData.pulseData);
  const [segments, setSegments] = useState<SegmentMetric[]>(initialData.segments);
  const [sources, setSources] = useState<SourceMetric[]>(initialData.sources);
  const [velocity, setVelocity] = useState<VelocityMetric[]>(initialData.velocity);
  const [dnaData, setDNAData] = useState<DNAUniverseData>(initialData.dnaData);
  const [experienceData, setExperienceData] = useState<ExperienceData>(initialData.experienceData);

  const handleFilterChange = (newFilter: TimeFilter, newRange?: DateRange) => {
    setFilter(newFilter);
    if (newRange) setDateRange(newRange);
    
    // Trigger Cinematic Processing Effect
    setIsProcessing(true);
    
    setTimeout(() => {
        const newData = generateData(newFilter);
        setMetrics(newData.metrics);
        setSummary(newData.summary);
        setPulseData(newData.pulseData);
        setSegments(newData.segments);
        setSources(newData.sources);
        setVelocity(newData.velocity);
        setDNAData(newData.dnaData);
        setExperienceData(newData.experienceData);
        setIsProcessing(false);
    }, 800); // 800ms delay for visual effect
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-black z-[-1]"></div>
      
      {/* Main Container */}
      <div className="flex-1 flex flex-col p-6 space-y-6 max-w-[1600px] mx-auto w-full z-10">
        
        {/* Header Section */}
        <header className="flex flex-col xl:flex-row xl:items-end justify-between border-b border-cyan-900/30 pb-6 gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-cyber font-bold text-white tracking-widest drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">
              SKILLUP HQ
            </h1>
            <p className="text-cyan-500/60 font-medium tracking-widest text-sm uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Stratejik Zaman Perspektifi Motoru
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-end gap-3 w-full md:w-auto">
             {/* Tab Switcher */}
             <div className="flex flex-wrap gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-700">
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-3 py-2 rounded font-cyber text-sm transition-all ${activeTab === 'dashboard' ? 'bg-cyan-900/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'text-slate-400 hover:text-white'}`}
                >
                  <LayoutDashboard size={16} /> <span className="hidden sm:inline">Dashboard</span>
                </button>
                <button 
                  onClick={() => setActiveTab('dna')}
                  className={`flex items-center gap-2 px-3 py-2 rounded font-cyber text-sm transition-all ${activeTab === 'dna' ? 'bg-indigo-900/50 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.3)]' : 'text-slate-400 hover:text-white'}`}
                >
                  <Dna size={16} /> <span className="hidden sm:inline">DNA</span>
                </button>
                <button 
                  onClick={() => setActiveTab('live')}
                  className={`flex items-center gap-2 px-3 py-2 rounded font-cyber text-sm transition-all ${activeTab === 'live' ? 'bg-cyan-900/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'text-slate-400 hover:text-white'}`}
                >
                  <Activity size={16} /> <span className="hidden sm:inline">Live</span>
                </button>
                <button 
                  onClick={() => setActiveTab('experience')}
                  className={`flex items-center gap-2 px-3 py-2 rounded font-cyber text-sm transition-all ${activeTab === 'experience' ? 'bg-pink-900/50 text-pink-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'text-slate-400 hover:text-white'}`}
                >
                  <Heart size={16} /> <span className="hidden sm:inline">Duygu</span>
                </button>
                <button 
                  onClick={() => setActiveTab('simulator')}
                  className={`flex items-center gap-2 px-3 py-2 rounded font-cyber text-sm transition-all ${activeTab === 'simulator' ? 'bg-emerald-900/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'text-slate-400 hover:text-white'}`}
                >
                  <Sliders size={16} /> <span className="hidden sm:inline">Simülatör</span>
                </button>
                <button 
                  onClick={() => setActiveTab('offer-engine')}
                  className={`flex items-center gap-2 px-3 py-2 rounded font-cyber text-sm transition-all ${activeTab === 'offer-engine' ? 'bg-fuchsia-900/50 text-fuchsia-300 shadow-[0_0_10px_rgba(217,70,239,0.3)]' : 'text-slate-400 hover:text-white'}`}
                >
                  <Zap size={16} /> <span className="hidden sm:inline">Otonom Motor</span>
                </button>
             </div>

             {/* Strategic Time Perspective Engine Component */}
             <div className="flex flex-col gap-2">
                 {activeTab === 'dashboard' && (
                     <div className="flex gap-2 justify-end">
                        <TrendBenchmarkEngine metrics={metrics} />
                     </div>
                 )}
                 {(activeTab !== 'simulator' && activeTab !== 'offer-engine') && (
                    <TimePerspectiveEngine 
                        currentFilter={filter} 
                        onFilterChange={handleFilterChange} 
                        isProcessing={isProcessing}
                    />
                 )}
             </div>
          </div>
        </header>

        {/* Content Switching based on Tab */}
        {activeTab === 'dashboard' ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Data Storytelling Summary Bar */}
            <div className={`transition-all duration-700 transform ${isProcessing ? 'opacity-50 blur-sm scale-95' : 'opacity-100 scale-100'}`}>
                <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900/40 border-l-4 border-indigo-500 p-4 rounded-r-lg flex items-start space-x-3 backdrop-blur-sm">
                    <Info className="text-indigo-400 mt-1 flex-shrink-0" size={20} />
                    <div>
                        <h4 className="text-xs font-cyber text-indigo-300 uppercase tracking-wider mb-1">
                            Bu Dönemdeki Müşteri Hareketliliği
                        </h4>
                        <p className="text-white text-lg font-light leading-snug">
                            {summary}
                        </p>
                    </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metrics.map(metric => (
                <KPICard 
                    key={metric.id} 
                    metric={metric} 
                    isProcessing={isProcessing}
                />
              ))}
            </div>

            {/* Growth & Engagement Pulse Section */}
            <div className="w-full">
                <GrowthPulseSection data={pulseData} isProcessing={isProcessing} />
            </div>

            {/* Segment & Opportunity Universe */}
            <div className="w-full">
                <SegmentOpportunityUniverse 
                    segments={segments} 
                    sources={sources} 
                    velocity={velocity} 
                    isProcessing={isProcessing} 
                />
            </div>

            {/* Bottom Section: Trends & Map */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              <div className="lg:col-span-3">
                <TrendingMap trends={mockTrends} />
              </div>
            </div>
          </div>
        ) : activeTab === 'dna' ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <UserDNAUniverse data={dnaData} isProcessing={isProcessing} />
          </div>
        ) : activeTab === 'live' ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <LiveLeadStream />
          </div>
        ) : activeTab === 'experience' ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <ExperienceSentimentRadar data={experienceData} isProcessing={isProcessing} />
          </div>
        ) : activeTab === 'simulator' ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <WhatIfSimulator />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 h-full">
             <AutonomousOfferEngine />
          </div>
        )}

      </div>

      {/* Footer / Live Ticker */}
      <footer className="mt-auto sticky bottom-0 z-20">
        <LiveTicker events={mockEvents} />
      </footer>

      {/* AI Strategy Consultant Button (GLOBAL) */}
      <AIBrainProtocol 
          contextType={activeTab as any} 
          data={getActiveContextData(activeTab, metrics, dnaData, experienceData)} 
      />
    </div>
  );
};

export default App;