import React, { useState } from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import { TimeFilter, DateRange } from '../types';

interface Props {
  currentFilter: TimeFilter;
  onFilterChange: (filter: TimeFilter, range?: DateRange) => void;
  isProcessing: boolean;
}

const TimePerspectiveEngine: React.FC<Props> = ({ currentFilter, onFilterChange, isProcessing }) => {
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const filters: { key: TimeFilter; label: string }[] = [
    { key: 'Last 24 Hours', label: 'Son 24 Saat' },
    { key: 'Last 7 Days', label: 'Son 7 Gün' },
    { key: 'Last 30 Days', label: 'Son 30 Gün' },
  ];

  const handleCustomDateChange = (type: 'start' | 'end', value: string) => {
    const newRange = { ...dateRange, [type]: value };
    setDateRange(newRange);
    onFilterChange('Custom Range', newRange);
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 bg-slate-900/60 border border-slate-800 p-2 rounded-xl backdrop-blur-md relative overflow-hidden group w-full">
      
      {/* Processing Scanline Effect */}
      {isProcessing && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent w-full h-full animate-shimmer z-0 pointer-events-none"></div>
      )}

      {/* Standard Filters */}
      <div className="flex space-x-1 z-10 relative flex-shrink-0 overflow-x-auto no-scrollbar max-w-full">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => {
              setShowCustomRange(false);
              onFilterChange(f.key);
            }}
            className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-cyber font-bold tracking-wide transition-all duration-500 relative overflow-hidden whitespace-nowrap ${
              currentFilter === f.key
                ? 'text-fuchsia-300 border border-fuchsia-500/60 shadow-[0_0_15px_rgba(217,70,239,0.3)] bg-fuchsia-900/20'
                : 'text-slate-400 border border-transparent hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {currentFilter === f.key && (
              <span className="absolute inset-0 bg-fuchsia-500/10 animate-pulse"></span>
            )}
            {f.label}
          </button>
        ))}

        {/* Custom Range Button */}
        <button
          onClick={() => {
            setShowCustomRange(!showCustomRange);
            if (!showCustomRange) onFilterChange('Custom Range', dateRange);
          }}
          className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-cyber font-bold tracking-wide transition-all duration-300 flex items-center space-x-2 border whitespace-nowrap ${
            currentFilter === 'Custom Range'
              ? 'text-cyan-300 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-cyan-900/20'
              : 'text-slate-400 border-transparent hover:text-cyan-200 hover:bg-slate-800/50'
          }`}
        >
          <Calendar size={14} />
          <span>Özel</span>
        </button>
      </div>

      {/* Date Pickers (Conditional Reveal) */}
      <div className={`flex items-center space-x-2 overflow-hidden transition-all duration-500 ease-in-out flex-shrink-0 ${showCustomRange ? 'max-w-xl opacity-100 ml-1' : 'max-w-0 opacity-0'}`}>
        <input 
            type="date" 
            value={dateRange.start}
            onChange={(e) => handleCustomDateChange('start', e.target.value)}
            onClick={(e) => {
              try { e.currentTarget.showPicker(); } catch(err) {}
            }}
            className="bg-slate-950 border border-slate-700 rounded py-1 pr-1 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 shadow-inner cursor-pointer w-[110px]"
        />
        <span className="text-slate-600 font-bold">-</span>
        <input 
            type="date" 
            value={dateRange.end}
            min={dateRange.start}
            onChange={(e) => handleCustomDateChange('end', e.target.value)}
            onClick={(e) => {
              try { e.currentTarget.showPicker(); } catch(err) {}
            }}
            className="bg-slate-950 border border-slate-700 rounded py-1 pr-1 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 shadow-inner cursor-pointer w-[110px]"
        />
      </div>

      {/* Status Indicator - Simplified to fit */}
      <div className="ml-auto hidden md:flex items-center">
          <div className="flex items-center space-x-2 px-2 py-1 bg-slate-950/40 rounded border border-slate-800/60">
            <RefreshCw size={12} className={`text-cyan-500 ${isProcessing ? 'animate-spin' : ''}`} />
            <span className="text-[10px] text-cyan-500/80 font-cyber tracking-widest uppercase whitespace-nowrap hidden lg:inline-block">
                {isProcessing ? 'HESAPLANIYOR...' : 'SİSTEM HAZIR'}
            </span>
             {/* Icon only on medium screens to prevent overflow */}
            <span className="text-[10px] text-cyan-500/80 font-cyber tracking-widest uppercase whitespace-nowrap lg:hidden">
                {isProcessing ? '...' : 'HAZIR'}
            </span>
          </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite linear;
        }
        /* Custom Date Input Styling to move icon to start */
        input[type="date"] {
            position: relative;
            padding-left: 24px; /* Reduced padding */
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
            position: absolute;
            left: 4px; /* Tighter positioning */
            top: 50%;
            transform: translateY(-50%);
            margin: 0;
            padding: 0;
            cursor: pointer;
            filter: invert(0.6); 
            width: 14px; /* Slightly smaller icon */
            height: 14px;
        }
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
            filter: invert(0.8) drop-shadow(0 0 2px #22d3ee);
        }
      `}</style>
    </div>
  );
};

export default TimePerspectiveEngine;