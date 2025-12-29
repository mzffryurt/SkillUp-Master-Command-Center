import React from 'react';
import { Rocket, Medal, Flame } from 'lucide-react';
import { SkillEvent } from '../types';

interface LiveTickerProps {
  events: SkillEvent[];
}

const LiveTicker: React.FC<LiveTickerProps> = ({ events }) => {
  return (
    <div className="w-full bg-slate-950 border-t border-cyan-900/50 overflow-hidden relative h-10 flex items-center">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-950 to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-950 to-transparent z-10"></div>
      
      <div className="flex animate-marquee whitespace-nowrap">
        {[...events, ...events].map((event, index) => (
          <div key={`${event.id}-${index}`} className="flex items-center space-x-2 mx-8 text-sm font-medium text-slate-300">
            <span className="text-cyan-400">
                {event.icon === 'rocket' && <Rocket size={14} />}
                {event.icon === 'medal' && <Medal size={14} />}
                {event.icon === 'flame' && <Flame size={14} />}
            </span>
            <span className="font-cyber text-xs text-cyan-200">{event.user}</span>
            <span className="opacity-50 mx-1">|</span>
            <span>{event.action}</span>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LiveTicker;