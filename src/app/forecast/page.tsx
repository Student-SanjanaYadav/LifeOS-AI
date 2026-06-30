'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Flame, 
  Clock, 
  ShieldAlert, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { SuccessGauge, BurnoutChart, WorkloadRadar } from '@/components/SvgCharts';

export default function ForecastPage() {
  const router = useRouter();
  const { missions, isRescueActive, rescueResult, predictiveMetrics } = useApp();

  return (
    <div className="space-y-8 select-none font-sans max-w-5xl">
      
      {/* Page Header */}
      <div className="border-b border-zinc-950 pb-6">
        <h1 className="text-2xl font-black text-white tracking-tight font-outfit">Predictive Forecast</h1>
        <p className="text-[11px] text-zinc-500 mt-1 font-mono uppercase tracking-wider">AI timeline modeling, burnout predictions, and safety limits</p>
      </div>

      {/* Main Grid: Success Probability vs Threat radar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Success Probability */}
        <GlassCard className="space-y-6 flex flex-col justify-between bg-charcoal-card" glowColor={predictiveMetrics.successProbability < 50 ? 'red' : 'none'} hoverEffect={false}>
          <div className="border-b border-zinc-900 pb-3 flex justify-between items-center">
            <h3 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Timeline Success Probability</h3>
            <span className="text-[9px] font-mono text-zinc-600">Confidence: {predictiveMetrics.confidenceLevel}%</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8 py-4">
            <div className="shrink-0 mx-auto">
              <SuccessGauge value={predictiveMetrics.successProbability} size={130} />
            </div>
            <div className="space-y-3 flex-1 text-center sm:text-left text-xs">
              <h4 className="text-sm font-bold text-white">How Success is Calculated</h4>
              <p className="text-zinc-400 leading-relaxed font-light">
                Gemini processes active milestones, estimates effort hours relative to remaining calendar days, and flags collisions.
              </p>
              
              {!isRescueActive ? (
                <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3 text-[10px] text-zinc-400 font-light leading-normal">
                  <span className="font-bold text-amber-400 block font-mono text-[9px] uppercase">🚨 DEFICIT DETECTED</span>
                  Click **🚨 SAVE MY DAY** to boost success rate by compressing secondary requirements.
                </div>
              ) : (
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3 text-[10px] text-zinc-400 font-light leading-normal">
                  <span className="font-bold text-emerald-400 block font-mono text-[9px] uppercase">✓ RESCUE APPLIED</span>
                  Timeline compressed. Success rate raised by +{rescueResult ? (rescueResult.newProbability - rescueResult.originalProbability) : 32}%.
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Workload Threat radar */}
        <GlassCard className="space-y-6 flex flex-col justify-between bg-charcoal-card" hoverEffect={false}>
          <div className="border-b border-zinc-900 pb-3">
            <h3 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Workload Threat Index</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8 py-2">
            <div className="mx-auto shrink-0">
              <WorkloadRadar 
                metrics={[
                  { label: 'Workload', value: Math.min(10, missions.length * 2) },
                  { label: 'Collisions', value: Math.min(10, predictiveMetrics.deadlineCollisions * 3) },
                  { label: 'Complexity', value: 7 },
                  { label: 'Stress', value: Math.round(predictiveMetrics.burnoutRisk / 10) },
                  { label: 'Buffer', value: isRescueActive ? 8 : 3 },
                ]}
              />
            </div>
            <div className="space-y-3 flex-1 text-center sm:text-left text-xs">
              <h4 className="text-sm font-bold text-white">Threat Assessment</h4>
              <p className="text-zinc-400 leading-relaxed font-light">
                Stress parameters stem from overlapping exam modules. Buffer margin is currently {isRescueActive ? 'Strong' : 'Critical'}.
              </p>
              <div className="flex gap-4 font-mono text-[9px]">
                <div>
                  <span className="text-zinc-600 uppercase block">Burnout Risk</span>
                  <span className={`font-bold ${predictiveMetrics.burnoutRisk > 70 ? 'text-red-400' : 'text-zinc-300'}`}>{predictiveMetrics.burnoutRisk}%</span>
                </div>
                <div>
                  <span className="text-zinc-600 uppercase block">Collision Alerts</span>
                  <span className={`font-bold ${predictiveMetrics.deadlineCollisions > 0 ? 'text-red-400' : 'text-zinc-300'}`}>{predictiveMetrics.deadlineCollisions} Active</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

      </div>

      {/* Grid: Failure Forecast details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Burnout Risk Card */}
        <GlassCard className="space-y-4 bg-charcoal-card" hoverEffect={false}>
          <div className="flex items-center gap-2 text-mos-purple border-b border-zinc-900 pb-2">
            <Flame className="w-4.5 h-4.5" />
            <h3 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Burnout Risk</h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed font-light">
            Measures consecutive study blocks and time deficits. A deficit of {predictiveMetrics.requiredEffortRemaining} hours suggests stress is mounting.
          </p>
          <div className="pt-2">
            <span className={`text-sm font-bold font-mono ${
              predictiveMetrics.burnoutRisk > 70 ? 'text-red-400' : 'text-zinc-300'
            }`}>
              {predictiveMetrics.burnoutRisk > 70 ? 'HIGH RISK' : 'STABLE'}
            </span>
          </div>
        </GlassCard>

        {/* Tomorrow Risk Card */}
        <GlassCard className="space-y-4 bg-charcoal-card" hoverEffect={false}>
          <div className="flex items-center gap-2 text-mos-coral border-b border-zinc-900 pb-2">
            <ShieldAlert className="w-4.5 h-4.5" />
            <h3 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Tomorrow Threat Level</h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed font-light">
            Evaluates deadlines within the next 24-48 hours that do not meet safe completion thresholds (75%+ progress).
          </p>
          <div className="pt-2">
            <span className={`text-sm font-bold font-mono ${
              predictiveMetrics.tomorrowRisk > 70 ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {predictiveMetrics.tomorrowRisk > 70 ? 'CRITICAL CRISIS' : 'SECURE'}
            </span>
          </div>
        </GlassCard>

        {/* Effort Deficit Card */}
        <GlassCard className="space-y-4 bg-charcoal-card" hoverEffect={false}>
          <div className="flex items-center gap-2 text-mos-blue border-b border-zinc-900 pb-2">
            <Clock className="w-4.5 h-4.5" />
            <h3 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Effort Remaining</h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed font-light">
            The total estimated hours required to complete all milestones across active missions.
          </p>
          <div className="pt-2">
            <span className="text-sm font-bold font-mono text-white">
              {predictiveMetrics.requiredEffortRemaining} HOURS
            </span>
          </div>
        </GlassCard>

      </div>

      {/* Active Alerts List */}
      <GlassCard className="space-y-4 bg-charcoal-card" hoverEffect={false}>
        <div className="border-b border-zinc-900 pb-2.5">
          <h3 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Timeline Risk Alerts</h3>
        </div>

        {missions.length === 0 ? (
          <div className="text-center py-6 text-xs text-zinc-500">Timeline is secure. No risk parameters flagged.</div>
        ) : (
          <div className="space-y-3">
            {missions.map(m => {
              const deadlineDate = new Date(m.deadline);
              const daysRemaining = Math.max(1, Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
              
              let riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
              let riskColor = 'text-mos-emerald';
              let reason = 'Milestones are moving at a stable rate.';

              if (m.health === 'Critical' || daysRemaining <= 3) {
                riskLevel = 'HIGH';
                riskColor = 'text-mos-coral';
                reason = `Only ${daysRemaining} days remaining with ${m.milestones.filter(ms => !ms.completed).length} uncompleted tasks. Time deficit is critical.`;
              } else if (m.health === 'At Risk' || daysRemaining <= 6) {
                riskLevel = 'MEDIUM';
                riskColor = 'text-mos-amber';
                reason = `Deadline is coming up. Progress is at ${m.progress}%, lagging slightly behind safety limits.`;
              }

              return (
                <div key={m.id} className="p-4 rounded-lg bg-zinc-950/20 border border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-white">{m.title}</span>
                      <span className="text-[8px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-900 px-2 py-0.5 rounded uppercase">
                        Due in {daysRemaining} days
                      </span>
                    </div>
                    <p className="text-zinc-400 font-light leading-relaxed">{reason}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`font-mono font-extrabold ${riskColor}`}>
                      {riskLevel} RISK
                    </span>
                    <button
                      onClick={() => router.push(`/mission/${m.id}`)}
                      className="px-3.5 py-2 rounded bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white transition-colors font-mono text-[9px] cursor-pointer"
                    >
                      Audit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>

    </div>
  );
}
