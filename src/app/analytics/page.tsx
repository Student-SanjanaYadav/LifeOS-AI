'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  BarChart3, 
  Clock, 
  CheckCircle, 
  ShieldAlert, 
  TrendingUp,
  Activity
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { SuccessGauge, BurnoutChart } from '@/components/SvgCharts';

export default function AnalyticsPage() {
  const { predictiveMetrics } = useApp();

  // Activity log values
  const stats = [
    { label: 'Saved Deadlines', count: '14', detail: '+3 this week', color: 'text-mos-coral' },
    { label: 'Recovered Focus Hours', count: '32.5 hrs', detail: '+4.5h via Save My Day', color: 'text-blue-400' },
    { label: 'Weekly Completion Rate', count: '89%', detail: 'Safe safety margin', color: 'text-mos-emerald' }
  ];

  return (
    <div className="space-y-8 select-none font-sans max-w-5xl">
      
      {/* Header */}
      <div className="border-b border-zinc-950 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight font-outfit uppercase">Analytics Cockpit</h1>
          <p className="text-[10px] text-zinc-550 mt-1 font-mono uppercase tracking-wider">Monitor recovery ratios, saved deadlines, and focus session logs</p>
        </div>
        
        <span className="text-[8px] font-mono text-zinc-650 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded uppercase">
          [ANALYTICS.SYS]
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((st, idx) => (
          <GlassCard key={idx} className="p-5 flex flex-col justify-between min-h-[120px] bg-zinc-950/20" hoverEffect={false}>
            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-950 pb-2">{st.label}</span>
            <p className={`text-2xl font-black font-mono mt-3 ${st.color}`}>{st.count}</p>
            <p className="text-[9px] text-zinc-500 font-mono mt-1">{st.detail}</p>
          </GlassCard>
        ))}
      </div>

      {/* Main Charts block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        
        {/* Success Probability */}
        <GlassCard className="flex flex-col items-center justify-between min-h-[220px]" hoverEffect={false}>
          <span className="w-full text-center text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold border-b border-zinc-950 pb-2">Stabilization Rate</span>
          <div className="py-3">
            <SuccessGauge value={predictiveMetrics.successProbability} size={110} />
          </div>
          <span className="text-[8px] font-mono text-zinc-500 uppercase">TIMELINE MARGIN INDEX</span>
        </GlassCard>

        {/* Burnout trend */}
        <GlassCard className="flex flex-col justify-between min-h-[220px] md:col-span-2" hoverEffect={false}>
          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-950 pb-2">Burnout Risk Trends</span>
          <div className="py-2.5 px-2">
            <BurnoutChart data={[25, 38, 52, 70, predictiveMetrics.burnoutRisk]} height={110} />
          </div>
          <div className="flex justify-between items-center text-[8px] font-mono text-zinc-550 border-t border-zinc-950 pt-2 px-2">
            <span>STRESS CAP ALLOWED: 6 HOURS MAX DAILY</span>
            <span>DATA AUTO-SYNCED</span>
          </div>
        </GlassCard>

      </div>

      {/* Heatmap summary */}
      <GlassCard className="space-y-4" hoverEffect={false}>
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-950 pb-2">Execution Heatmap</span>
        
        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 text-center text-xs font-mono">
          {Array.from({ length: 14 }).map((_, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-[8px] text-zinc-600">Day {idx + 1}</span>
              <div className={`w-8 h-8 rounded border ${
                idx % 4 === 0 ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400 font-bold' :
                idx % 4 === 1 ? 'bg-blue-950/20 border-blue-500/20 text-blue-400 font-bold' :
                idx % 4 === 2 ? 'bg-amber-950/20 border-amber-500/20 text-amber-400 font-bold' :
                'bg-zinc-900 border-zinc-950 text-zinc-650'
              } flex items-center justify-center font-mono text-[9px]`}>
                {idx % 4 === 3 ? '0' : '4h'}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

    </div>
  );
}
