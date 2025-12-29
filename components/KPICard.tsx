import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { KPIMetric } from '../types';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

interface KPICardProps {
  metric: KPIMetric;
  isProcessing?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({ metric, isProcessing = false }) => {
  const getColorClass = (color: string) => {
    switch (color) {
      case 'cyan': return 'text-cyan-400 border-cyan-500/30 shadow-cyan-500/20';
      case 'pink': return 'text-fuchsia-400 border-fuchsia-500/30 shadow-fuchsia-500/20';
      case 'purple': return 'text-violet-400 border-violet-500/30 shadow-violet-500/20';
      case 'green': return 'text-emerald-400 border-emerald-500/30 shadow-emerald-500/20';
      default: return 'text-cyan-400 border-cyan-500/30 shadow-cyan-500/20';
    }
  };

  const getGradientId = (id: string) => `colorGradient-${id}`;

  const chartColor = 
    metric.color === 'pink' ? '#e879f9' : 
    metric.color === 'purple' ? '#a78bfa' : 
    metric.color === 'green' ? '#34d399' : '#22d3ee';

  return (
    <div className={`relative overflow-hidden bg-slate-900/80 backdrop-blur-md border rounded-xl p-5 flex flex-col justify-between h-64 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] ${getColorClass(metric.color)} shadow-lg neon-box group`}>
      
      {/* Processing Overlay */}
      <div className={`absolute inset-0 bg-slate-950/50 backdrop-blur-sm z-20 flex items-center justify-center transition-opacity duration-500 ${isProcessing ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50 animate-pulse" />
      </div>

      {/* Decorative Corner Lines */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-current opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-current opacity-50 group-hover:opacity-100 transition-opacity" />

      {/* Header */}
      <div className="flex justify-between items-start z-10">
        <h3 className="font-cyber text-sm tracking-widest uppercase opacity-80">{metric.title}</h3>
        <Activity className="w-4 h-4 opacity-60 animate-pulse" />
      </div>

      {/* Main Value */}
      <div className="z-10 mt-2">
        <div className="flex items-baseline space-x-1">
          <span className="text-4xl font-bold font-cyber tracking-tight text-white drop-shadow-md">
            {metric.value}
          </span>
          {metric.unit && <span className="text-lg opacity-70">{metric.unit}</span>}
        </div>
        
        <div className={`flex items-center text-xs font-bold mt-1 ${metric.trendDirection === 'up' ? 'text-green-400' : 'text-red-400'}`}>
          {metric.trendDirection === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span className="ml-1">{metric.trend > 0 ? '+' : ''}{metric.trend}%</span>
        </div>
      </div>

      {/* Chart */}
      <div className="absolute bottom-12 left-0 right-0 h-20 opacity-40 group-hover:opacity-60 transition-opacity">
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metric.history.map((val, i) => ({ i, val }))}>
              <defs>
                <linearGradient id={getGradientId(metric.id)} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="val" 
                stroke={chartColor} 
                strokeWidth={2}
                fillOpacity={1} 
                fill={`url(#${getGradientId(metric.id)})`} 
                isAnimationActive={true}
              />
            </AreaChart>
         </ResponsiveContainer>
      </div>

      {/* Data Story Footer */}
      <div className="mt-auto pt-3 border-t border-white/10 z-10">
        <p className="text-xs text-slate-300 italic tracking-wide leading-tight">
          "{metric.dataStory}"
        </p>
      </div>
    </div>
  );
};

export default KPICard;