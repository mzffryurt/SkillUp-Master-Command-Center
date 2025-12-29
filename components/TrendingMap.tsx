import React, { useState } from 'react';
import { TrendingSkill } from '../types';
import { MapPin, TrendingUp } from 'lucide-react';

interface Props {
  trends: TrendingSkill[];
}

const TrendingMap: React.FC<Props> = ({ trends }) => {
  return (
    <div className="bg-slate-900/50 border border-indigo-500/30 rounded-xl p-5 h-full backdrop-blur-sm neon-box">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-cyber text-indigo-300 text-sm tracking-wider uppercase">Küresel Yetenek Isı Haritası</h3>
        <TrendingUp className="text-indigo-400 w-4 h-4" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full content-start">
        {trends.map((trend, i) => (
           <div key={i} className="relative group p-3 rounded bg-indigo-950/30 border border-indigo-500/20 hover:border-indigo-400/60 transition-colors">
               <div className="flex items-start justify-between">
                   <div>
                       <div className="flex items-center space-x-1 text-xs text-indigo-300 mb-1">
                           <MapPin size={10} />
                           <span>{trend.region}</span>
                       </div>
                       <div className="font-bold text-white text-lg">{trend.name}</div>
                       <div className="text-xs text-slate-400">{trend.category}</div>
                   </div>
                   <div className="text-right">
                       <span className="block text-2xl font-cyber font-bold text-indigo-400">+{trend.growth}%</span>
                       <span className="text-[10px] text-indigo-300/70 uppercase">İvme</span>
                   </div>
               </div>
               {/* Animated Bar */}
               <div className="mt-3 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"
                    style={{ width: `${Math.min(trend.growth * 2, 100)}%` }}
                   />
               </div>
           </div> 
        ))}
      </div>
    </div>
  );
};

export default TrendingMap;