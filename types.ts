export interface KPIMetric {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  trend: number; // percentage change
  trendDirection: 'up' | 'down' | 'neutral';
  dataStory: string;
  color: 'cyan' | 'pink' | 'purple' | 'green';
  history: number[]; // For sparkline
}

export interface SkillEvent {
  id: number;
  user: string;
  location: string;
  action: string;
  icon: 'rocket' | 'medal' | 'flame';
}

export interface TrendingSkill {
  name: string;
  region: string;
  growth: number;
  category: string;
}

export type TimeFilter = 'Last 24 Hours' | 'Last 7 Days' | 'Last 30 Days' | 'Custom Range';

export interface DateRange {
  start: string;
  end: string;
}

export interface GrowthPulseData {
  label: string;
  leadScore: number; // 0-100
  churnRisk: number; // 0-100
  newLeads: number;
  crmComment: string;
}

export interface SegmentMetric {
  name: string;
  value: number; // Total Opportunity Value
  fill: string;
  leadCount: number;
}

export interface SourceMetric {
  source: string;
  leadScore: number;
  volume: number;
  churnRate: number;
}

export interface VelocityMetric {
    segment: string;
    velocityDays: number; // Avg days to convert
    volume: number;
}

export interface GeoData {
  city: string;
  country: string;
  users: number;
  growth: number;
}

export interface GenerationData {
  name: string;
  value: number;
  fill: string;
  behavior: string;
}

export interface LearningTimeData {
  time: string; // "08:00", "12:00" etc
  mobile: number;
  desktop: number;
  contextLabel?: string; // e.g. "Commuters", "Night Owls"
}

export interface LoyaltyData {
  subject: string; // e.g. "Platform Engagement", "Assignment Completion"
  loyal: number;
  risk: number;
  fullMark: number;
}

// --- NEW BEHAVIORAL ECOSYSTEM TYPES ---

export type PersonaType = 'Career Hunter' | 'Curious Explorer' | 'Certificate Collector' | 'Micro Learner';
export type MatrixZone = 'Risky VIP' | 'Hidden Gem' | 'Brand Ambassador' | 'Passive';

export interface PersonaProfile {
    type: PersonaType;
    count: number;
    avgLTV: number;
    completionRate: number;
    description: string;
    color: string;
    icon: 'briefcase' | 'compass' | 'award' | 'smartphone';
}

export interface MatrixPoint {
    id: string;
    x: number; // Engagement (0-100)
    y: number; // LTV ($)
    z: number; // Bubble size (optional)
    zone: MatrixZone;
    userCount: number; // Aggregate count for this point area
}

export interface CategoryROI {
    category: string; // Python, Design etc.
    revenue: number;
    retention: number; // Months
    growth: number; // %
}

export interface DNAUniverseData {
  geo: GeoData[];
  generations: GenerationData[];
  learningTime: LearningTimeData[];
  loyalty: LoyaltyData[];
  personas: PersonaProfile[];
  matrix: MatrixPoint[];
  roi: CategoryROI[];
  story: {
    generation: string;
    time: string;
  };
}

export type SalesStage = 'New' | 'Trial' | 'Decision' | 'Payment' | 'Won';

export interface TimelineActivity {
  dayOffset: number; // 0 is today, -1 is yesterday
  type: 'module' | 'login' | 'gap' | 'payment_attempt';
  label?: string;
}

export interface LeadProfile {
  id: string;
  name: string;
  segment: string; // "Z Kuşağı", "Profesyonel"
  avatarInitials: string;
  source: 'TikTok' | 'Instagram' | 'LinkedIn' | 'Referans' | 'Direkt';
  interest: 'Yazılım' | 'Tasarım' | 'Pazarlama' | 'Veri' | 'Blockchain' | 'Liderlik';
  leadScore: number;
  status: 'Premium' | 'Freemium' | 'Riskli' | 'Yeni';
  lastActive: string; // "2 dk önce"
  preferredTime: string; // "Gece"
  completedModules: number;
  story: string; // "Ahmet Y. TikTok'tan geldi..."
  
  // CRM Specifics
  pipelineStage: SalesStage;
  potentialValue: number; // Estimated revenue in $
  timelineActivity: TimelineActivity[];
}

export interface SentimentTrend {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
  nps: number;
}

export interface WordCloudItem {
  text: string;
  weight: number; // 1-10 scale
  sentiment: 'positive' | 'negative';
}

export interface FeatureImpact {
  feature: string;
  score: number; // Positive for praise, negative for complaints
  fullMark: number; // for visual scaling
}

// --- NEW EXPERIENCE TYPES ---

export interface ExperienceRadarMetric {
    subject: string; // e.g. "Content Quality", "Video Speed"
    A: number; // Current Score (0-100)
    fullMark: number;
}

export interface StudentFeedback {
    id: string;
    user: string;
    userType: 'Premium' | 'Free';
    comment: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    highlights: string[]; // Critical words to highlight in neon
    source: 'App Store' | 'Support' | 'Twitter' | 'Anket';
}

export interface SentimentFinancial {
    segment: string; // "Promoters (9-10)", "Detractors (0-6)"
    ltv: number; // Lifetime Value $
    retention: number; // Months
    color: string;
}

export interface RecoveryAlert {
    id: string;
    user: string;
    issue: string; // e.g. "Refund Requested", "1 Star Review"
    severity: 'critical' | 'high';
    status: 'pending' | 'resolved';
}

export interface ExperienceData {
  trends: SentimentTrend[];
  words: WordCloudItem[];
  impact: FeatureImpact[];
  // New Fields
  radarData: ExperienceRadarMetric[];
  liveFeedback: StudentFeedback[];
  financialCorrelation: SentimentFinancial[];
  recoveryAlerts: RecoveryAlert[];
  story: string;
}

export interface ConsultationResult {
  title: string;
  problem: string;
  diagnosis: string;
  actions: string[]; // List of 2-3 strategic actions
  kpiTarget: string; // e.g. "NPS +5 puan" or "Churn -%2"
}

export type BenchmarkScenario = 'Week vs Week' | 'Month vs Month' | 'Year vs Year' | 'Campaign Pre/Post';

export interface BenchmarkMetric {
    name: string;
    current: number;
    previous: number;
    change: number; // percentage
    unit?: string;
}

export interface BenchmarkAnalysis {
    story: string; // "Why did it change?"
    strategyType: 'OPPORTUNITY' | 'RISK_MITIGATION';
    actionTitle: string;
    actionDetail: string;
}

export interface SimulationState {
  priceChange: number; // -50 to +50 percent
  marketingBudget: 'Limited' | 'Balanced' | 'Aggressive';
  leadQuality: 'Broad' | 'High Value';
  contentFreq: 'Monthly' | 'Weekly' | 'Daily';
}

export interface SimulationFeedback {
  risk: string;
  opportunity: string;
  warning: string;
}

export interface AutonomousOffer {
  id: string;
  type: 'UPSELL' | 'RETENTION' | 'CROSS_SELL' | 'RESTRICTION';
  title: string;
  targetSegment: string;
  targetSize: number;
  triggerReason: string; // e.g., "Propensity > 85%"
  proposal: string;
  predictedImpact: string; // e.g., "+$12k MRR"
  rationale: string;
}