import { GoogleGenAI } from "@google/genai";
import { KPIMetric, GrowthPulseData, SourceMetric, SegmentMetric, DNAUniverseData, LeadProfile, ExperienceData, BenchmarkMetric, SimulationState, AutonomousOffer } from "../types";

const processKPIsForPrompt = (metrics: KPIMetric[]) => {
  return metrics.map(m => `${m.title}: ${m.value}${m.unit || ''} (Trend: ${m.trend}%)`).join(', ');
};

export const getAIBrainInsight = async (metrics: KPIMetric[]) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const kpiSummary = processKPIsForPrompt(metrics);

  const prompt = `
    Rol: Sen "SkillUp Beyin Protokolü"sün, fütüristik bir eğitim teknolojisi ekosistemini yöneten bir yapay zekasın.
    Bağlam: Şu anki gerçek zamanlı panel verilerini analiz et: ${kpiSummary}.
    Görev: 
    1. Kritik bir patern (düzeltilmesi gereken bir düşüş veya değerlendirilmesi gereken bir artış) belirle.
    2. Yöneticiler için spesifik, yüksek etkili bir aksiyon öner.
    3. Tonun acil, fütüristik ve veri odaklı olsun (Cyberpunk tarzı).
    4. Yanıtı tamamen TÜRKÇE ver.
    
    Format: İki alana sahip bir JSON objesi döndür: "alert" (kısa uyarı başlığı) ve "action" (önerilen aksiyon).
    Markdown code block kullanma. Sadece saf JSON string döndür.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Brain Protocol Error:", error);
    return {
      alert: "SİSTEM UYARISI",
      action: "Bağlantı kararsızlığı tespit edildi. Manuel müdahale gerekli."
    };
  }
};

export const getRetentionActionSuggestion = async (dataPoints: GrowthPulseData[]) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");

    // Calculate averages for context
    const avgRisk = dataPoints.reduce((acc, curr) => acc + curr.churnRisk, 0) / dataPoints.length;
    const avgScore = dataPoints.reduce((acc, curr) => acc + curr.leadScore, 0) / dataPoints.length;

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Rol: SkillUp CRM AI Asistanı.
      Durum: Ortalama Churn Riski: %${avgRisk.toFixed(1)}, Ortalama Lider Skoru: ${avgScore.toFixed(1)}.
      
      Görev: Eğer risk yüksekse (>50) bir "Elde Tutma (Retention)" kampanyası öner. Eğer Lider Skoru yüksekse (>70) bir "Satış Kapama (Closing)" teklifi öner.
      
      Çıktı Formatı (JSON):
      {
        "type": "RETENTION" veya "CLOSING",
        "title": "Kampanya Başlığı (kısa ve vurucu)",
        "message": "Kullanıcıya gönderilecek bildirim metni",
        "targetAudience": "Hedef Kitle (Örn: Risk Skoru > 70 olanlar)"
      }
      Dil: Türkçe.
      Sadece JSON döndür.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text;
        if (!text) return null;
        return JSON.parse(text);
    } catch (error) {
        console.error("Retention Action Error:", error);
        return {
            type: "ERROR",
            title: "Veri Bağlantı Hatası",
            message: "AI motoruna şu anda ulaşılamıyor.",
            targetAudience: "Sistem Yöneticisi"
        };
    }
};

export const getSegmentOptimizationAdvice = async (sources: SourceMetric[], segments: SegmentMetric[]) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");

    const sourceDataStr = sources.map(s => `${s.source} (Skor: ${s.leadScore}, Churn: %${s.churnRate})`).join(', ');
    const segmentDataStr = segments.map(s => `${s.name} (Değer: ${s.value})`).join(', ');

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Rol: SkillUp Stratejik Pazarlama Direktörü AI.
      Veriler: Kaynaklar [${sourceDataStr}], Segmentler [${segmentDataStr}].
      
      Görev:
      1. 'Pazarlama Bütçesi'ni hangi kaynağa veya segmente kaydırmalıyız? (En yüksek verim/skor nerede?)
      2. Hangi kaynak 'Verimsiz' ve optimize edilmeli/kapatılmalı? (Yüksek churn, düşük skor).
      
      Çıktı Formatı (JSON):
      {
        "allocationAdvice": "Bütçe Tavsiyesi (Örn: LinkedIn kanalına ağırlık verin...)",
        "inefficiencyAlert": "Verimsizlik Uyarısı (Örn: X kaynağından gelenler hızlı churn oluyor...)",
        "rationale": "Mantıksal Gerekçe (Kısa, tek cümle)"
      }
      Dil: Türkçe.
      Sadece JSON döndür.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text;
        if (!text) return null;
        return JSON.parse(text);
    } catch (error) {
        console.error("Segment AI Error:", error);
        return {
            allocationAdvice: "Veri analizi tamamlanamadı.",
            inefficiencyAlert: "Bağlantı hatası.",
            rationale: "Sistem offline."
        };
    }
};

export const getUserPersonaAdvice = async (data: DNAUniverseData) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");

    const genData = data.generations.map(g => `${g.name}: %${g.value}`).join(', ');
    const timeData = `En yoğun: ${data.learningTime.reduce((a,b) => (a.mobile+a.desktop) > (b.mobile+b.desktop) ? a : b).time}`;

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
        Rol: SkillUp Kullanıcı Psikoloğu AI.
        Veriler: Kuşaklar [${genData}], En Aktif Saat [${timeData}].
        
        Görev:
        1. 'Riskli Segmente' (Churn Eğilimli) nasıl bir "Geri Kazanım" (Recovery) bildirimi atılmalı? (Kullanıcı psikolojisine oyna, örn: "Yarım kalan hedefler").
        2. 'Yüksek Puanlı Liderlere' (Sadık) ne satılmalı? (Upsell/Micro-Certificate).

        Çıktı Formatı (JSON):
        {
            "churnRecovery": {
                "strategy": "Strateji Adı",
                "notification": "Bildirim Metni",
                "trigger": "Tetikleyici (Örn: 3 gün inaktiflik)"
            },
            "upsell": {
                "product": "Önerilen Ürün (Sertifika/Modül)",
                "offer": "Teklif Metni (İndirim vb.)",
                "rationale": "Neden bu kitleye uygun?"
            }
        }
        Dil: Türkçe.
        Sadece JSON döndür.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text;
        if (!text) return null;
        return JSON.parse(text);
    } catch (error) {
        console.error("Persona AI Error:", error);
        return null;
    }
};

export const getIndividualLeadInsight = async (lead: LeadProfile) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Rol: SkillUp Bireysel Satış ve Risk Analizi AI.
    Kullanıcı Profili:
    - İsim: ${lead.name}
    - Segment: ${lead.segment}
    - Kaynak: ${lead.source}
    - İlgi: ${lead.interest}
    - Lider Skoru: ${lead.leadScore}
    - Durum: ${lead.status}
    - Tamamlanan Modül: ${lead.completedModules}
    
    Görev:
    1. 'Upsell Fırsatı': Kullanıcının ilgisine ve skoruna göre hangi ürün satılmalı?
    2. 'Risk Analizi': Churn ihtimali nedir ve nasıl önlenir?
    3. 'Skor Tahmini': Bu kullanıcının Premium'a geçme (veya kalma) olasılığı % kaçtır?

    Çıktı Formatı (JSON):
    {
      "upsell": {
        "suggestion": "Ürün/Sertifika Önerisi",
        "reason": "Neden bu kullanıcıya uygun?"
      },
      "churn": {
        "riskLevel": "Düşük/Orta/Yüksek",
        "prevention": "Kurtarma aksiyonu (bildirim/mail)"
      },
      "conversionProbability": 85 (Sadece sayı, 0-100 arası)
    }
    Dil: Türkçe.
    Sadece JSON döndür.
  `;

  try {
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
      });
      const text = response.text;
      if (!text) return null;
      return JSON.parse(text);
  } catch (error) {
      console.error("Individual Lead AI Error:", error);
      return null;
  }
};

export const getSentimentAnalysis = async (data: ExperienceData) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");
  
    const words = data.words.map(w => `${w.text} (${w.sentiment})`).join(', ');
    const complaints = data.impact.filter(i => i.score < 0).map(i => i.feature).join(', ');
    const praises = data.impact.filter(i => i.score > 0).map(i => i.feature).join(', ');
    const currentNPS = data.trends[data.trends.length - 1]?.nps || 0;
  
    const ai = new GoogleGenAI({ apiKey });
  
    const prompt = `
      Rol: SkillUp Kriz Yönetimi ve Marka Stratejisti AI.
      Veriler:
      - NPS: ${currentNPS}
      - Kelime Bulutu: [${words}]
      - Şikayetler: [${complaints}]
      - Övgüler: [${praises}]
  
      Görev: Aşağıdaki 3 soruya stratejik yanıt ver:
      1. "NPS neden düşüyor/yükseliyor?" (Kök neden analizi).
      2. "Hangi alana yatırım yapılmalı?" (Kullanıcı taleplerine göre).
      3. "Hangi şikayet markayı uzun vadede zedeleyebilir?" (Risk analizi).
  
      Çıktı Formatı (JSON):
      {
        "npsRootCause": "Kök neden açıklaması",
        "investmentOpportunity": "Yatırım önerisi",
        "brandRisk": "Uzun vadeli risk uyarısı"
      }
      Dil: Türkçe.
      Sadece JSON döndür.
    `;
  
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text;
        if (!text) return null;
        return JSON.parse(text);
    } catch (error) {
        console.error("Sentiment AI Error:", error);
        return null;
    }
  };

  export const getCrisisManagementAdvice = async (radarData: any[]) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");
    const ai = new GoogleGenAI({ apiKey });

    const radarSummary = radarData.map(r => `${r.subject}: ${r.A}/100`).join(', ');

    const prompt = `
        Rol: Müşteri Deneyimi (CX) Mimarı ve Kriz Yöneticisi.
        Mevcut Deneyim Puanları (Radar): ${radarSummary}.
        
        Görev:
        1. "Kök Neden": En düşük puan alan bileşeni bul ve nedenini tahmin et.
        2. "Acil Aksiyon": Bu düşüşü durdurmak için yazılım veya operasyon ekibine ne talimat verilmeli?
        3. "Beklenen Etki": Bu aksiyon NPS'i nasıl etkiler?

        Çıktı Formatı (JSON):
        {
            "analysis": "Düşük puan analizi...",
            "action": "Önerilen aksiyon (Örn: Video sunucularını CDN'e taşı)",
            "impact": "Tahmini etki (Örn: Video şikayetlerinde %40 azalma)"
        }
        Dil: Türkçe.
        Sadece JSON döndür.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text;
        if (!text) return null;
        return JSON.parse(text);
    } catch (error) {
        console.error("Crisis AI Error:", error);
        return null;
    }
  };

  export const getStrategicConsultation = async (contextType: 'dashboard' | 'dna' | 'live' | 'experience', data: any) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");
    const ai = new GoogleGenAI({ apiKey });

    // Prepare context summary based on type
    let dataContext = "";
    if (contextType === 'dashboard') {
        dataContext = `KPI'lar: ${(data as KPIMetric[]).map(m => `${m.title}: ${m.value}`).join(', ')}`;
    } else if (contextType === 'dna') {
        const d = data as DNAUniverseData;
        dataContext = `Kuşak: ${d.generations.map(g => `${g.name} (%${g.value})`).join(', ')}. Şehirler: ${d.geo.map(g => g.city).join(',')}.`;
    } else if (contextType === 'live') {
        const leads = data as LeadProfile[];
        dataContext = `Son 5 Lider: ${leads.slice(0, 5).map(l => `${l.name} (${l.source}) - Skor: ${l.leadScore}`).join(', ')}.`;
    } else if (contextType === 'experience') {
        const e = data as ExperienceData;
        dataContext = `NPS: ${e.trends[e.trends.length-1]?.nps}. Şikayetler: ${e.impact.filter(i=>i.score<0).map(i=>i.feature).join(',')}.`;
    }

    const prompt = `
        Rol: Sen kıdemli bir Yönetim Bilişim Sistemleri (YBS) Danışmanısın.
        Şu anki Ekran: ${contextType.toUpperCase()} Paneli.
        Veri Özeti: ${dataContext}
        
        Görev: Bu veriye bakarak yönetime stratejik bir rapor sun.
        
        Adımlar:
        1. "Sorun Tanımla": Verideki en büyük darboğaz veya risk nedir?
        2. "Teşhis Koy (Neden?)": Bu sorun neden kaynaklanıyor olabilir? (Profesyonel yorum).
        3. "Aksiyon Öner": 2-3 adet net, uygulanabilir, stratejik madde.
        4. "Hedef KPI": Bu aksiyonlar sonucunda ne iyileşecek?

        Üslup: Kurumsal, net, analitik ve çözüm odaklı.

        Çıktı Formatı (JSON):
        {
            "title": "Stratejik Analiz Başlığı",
            "problem": "Sorun tanımı...",
            "diagnosis": "Teşhis ve yorum...",
            "actions": ["Aksiyon 1", "Aksiyon 2", "Aksiyon 3"],
            "kpiTarget": "Hedeflenen İyileşme (Örn: NPS +2)"
        }
        Dil: Türkçe.
        Sadece JSON döndür.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text;
        if (!text) return null;
        return JSON.parse(text);
    } catch (error) {
        console.error("Consultant AI Error:", error);
        return {
            title: "Analiz Hatası",
            problem: "Veri işlenemedi.",
            diagnosis: "Bağlantı veya model hatası.",
            actions: ["Manuel inceleme yapın."],
            kpiTarget: "-"
        };
    }
  };

  export const getTrendAnalysis = async (metrics: BenchmarkMetric[], scenario: string) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");
    const ai = new GoogleGenAI({ apiKey });

    // Identify biggest mover
    const biggestMover = metrics.reduce((prev, curr) => Math.abs(curr.change) > Math.abs(prev.change) ? curr : prev);
    const trendSummary = metrics.map(m => `${m.name}: %${m.change.toFixed(1)}`).join(', ');

    const prompt = `
        Rol: SkillUp Performans ve Trend Analisti AI.
        Senaryo: ${scenario}.
        Veriler: ${trendSummary}.
        
        En Büyük Değişim: ${biggestMover.name} (%${biggestMover.change.toFixed(1)}).
        
        Görev:
        1. "Hikaye": Bu değişim neden oldu? (Gerçekçi bir senaryo uydur. Örn: Reklam kampanyası, yeni modül, teknik arıza vb.).
        2. "Proaktif Aksiyon": Bu trendi yönetmek için ne yapmalı? (Pozitifse büyüt, Negatifse çöz).

        Çıktı Formatı (JSON):
        {
            "story": "Otomatik Karşılaştırma Hikayesi",
            "strategyType": "OPPORTUNITY" veya "RISK_MITIGATION",
            "actionTitle": "Aksiyon Başlığı",
            "actionDetail": "Aksiyon Detayı"
        }
        Dil: Türkçe.
        Sadece JSON döndür.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text;
        if (!text) return null;
        return JSON.parse(text);
    } catch (error) {
        console.error("Benchmark AI Error:", error);
        return {
            story: "Trend verisi analiz edilemedi.",
            strategyType: "RISK_MITIGATION",
            actionTitle: "Manuel Kontrol",
            actionDetail: "Sistem yanıt vermedi."
        };
    }
  };

  export const getSimulationInsight = async (state: SimulationState) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
        Rol: Sen bir Gelecek Senaryo Mimarı ve Strateji Uzmanısın (SkillUp EdTech).
        Simülasyon Değişkenleri:
        - Fiyat Değişimi: %${state.priceChange}
        - Pazarlama Bütçesi: ${state.marketingBudget}
        - Lider Kalitesi: ${state.leadQuality}
        - İçerik Sıklığı: ${state.contentFreq}
        
        Görev: Bu senaryonun olası sonuçlarını yorumla.

        Çıktı Formatı (JSON):
        {
            "risk": "Risk Yorumu (Örn: Fiyat artışı Z kuşağında kopuşa neden olabilir)",
            "opportunity": "Fırsat Yorumu (Örn: Yüksek bütçe ROI'yi artırabilir)",
            "warning": "Stratejik Uyarı (Örn: Churn oranı büyümeyi nötrleyebilir)"
        }
        Dil: Türkçe.
        Sadece JSON döndür.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text;
        if (!text) return null;
        return JSON.parse(text);
    } catch (error) {
        console.error("Simulation AI Error:", error);
        return {
            risk: "AI Bağlantısı Yok",
            opportunity: "Veri analiz edilemedi",
            warning: "Simülasyon motoru offline"
        };
    }
  };

  export const getAutonomousOfferSuggestion = async () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
        Rol: Sen "Otonom Gelir Mimarı"sın. (Autonomous Revenue Architect AI).
        Görevin: SkillUp EdTech platformunda şu an tespit edilen bir "Fırsat" veya "Risk" için OTONOM bir kampanya/teklif oluşturmak.
        
        Rastgele bir senaryo seç ve üret:
        1. UPSELL: Yüksek puanlı kullanıcılara (Propensity > 85%) premium teklif.
        2. RETENTION: Churn riski yüksek (>70%) kullanıcılara indirim.
        3. CROSS_SELL: Belirli bir dersi bitirenlere (Örn: Python) tamamlayıcı ürün (Örn: Veri Analitiği).
        4. RESTRICTION: Yoğun talep varsa ücretsiz denemeyi kısıtla (Aciliyet yarat).

        Çıktı Formatı (JSON):
        {
            "id": "OFFER-XYZ",
            "type": "UPSELL" | "RETENTION" | "CROSS_SELL" | "RESTRICTION",
            "title": "Teklif Başlığı (Örn: 'AI Tespit Etti: Sıcak Satış Fırsatı')",
            "targetSegment": "Hedef Kitle (Örn: 'Yüksek Puanlı 450 Lider')",
            "targetSize": 450 (Sayı),
            "triggerReason": "Tetiklenme Nedeni (Örn: 'Satın Alma Eğilimi > %85')",
            "proposal": "Teklif Detayı (Örn: '24 Saatlik %15 İndirim Tanımla')",
            "predictedImpact": "Tahmini Etki (Örn: '+$12k MRR')",
            "rationale": "Data Storytelling (Örn: 'Yazılım kategorisindeki talep yoğunluğu nedeniyle bu hamle ciroda +%12 artış getirecek.')"
        }
        Dil: Türkçe.
        Sadece JSON döndür.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text;
        if (!text) return null;
        return JSON.parse(text);
    } catch (error) {
        console.error("Autonomous Offer AI Error:", error);
        // Fallback mock
        return {
            id: "ERR-001",
            type: "UPSELL",
            title: "AI TESPİTİ: FIRSAT",
            targetSegment: "Aktif Kullanıcılar",
            targetSize: 120,
            triggerReason: "Yüksek Etkileşim",
            proposal: "%10 İndirim",
            predictedImpact: "+$2k MRR",
            rationale: "Bağlantı hatası nedeniyle varsayılan teklif oluşturuldu."
        };
    }
  };

  export const getPersonaTacticalAdvice = async (target: string) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
        Rol: Sen bir Davranış Bilimcisi ve Oyunlaştırma Uzmanısın.
        Hedef Segment/Bölge: "${target}".
        
        Görev: Bu kullanıcı grubu için "Davranışsal Ekonomi" prensiplerine dayalı, nokta atışı bir CRM aksiyonu öner.
        
        Örnekler:
        - "Riskli VIP" -> Kayıp korkusu (FOMO) tetikleyen kişisel mentorluk.
        - "Gizli Hazineler" -> Deneme sürümü ile 'Sahiplik Etkisi' (Endowment Effect) yaratma.

        Çıktı Formatı (JSON):
        {
            "strategyName": "Strateji Adı (Örn: Sahiplik Etkisi)",
            "tactic": "Uygulanacak Taktik (Örn: 24 Saatlik Premium Pass)",
            "message": "Kullanıcıya gidecek bildirim metni",
            "expectedResult": "Beklenen Sonuç (Örn: %15 Dönüşüm)"
        }
        Dil: Türkçe.
        Sadece JSON döndür.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text;
        if (!text) return null;
        return JSON.parse(text);
    } catch (error) {
        console.error("Persona Tactics AI Error:", error);
        return null;
    }
  };