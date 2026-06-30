'use client';

import React, { useState, useEffect } from 'react';
import { useApp, Mission } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { 
  ShieldAlert, 
  Target, 
  Clock, 
  Calendar,
  AlertOctagon,
  ArrowRight,
  Loader2,
  Activity,
  Timer
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { SuccessGauge, WorkloadRadar, MissionCompass, RecoveryRing } from '@/components/SvgCharts';

export default function DashboardPage() {
  const router = useRouter();
  const { 
    user, 
    missions, 
    isRescueActive, 
    rescueResult, 
    predictiveMetrics, 
    triggerSaveMyDay, 
    deactivateRescueMode,
    focusSession
  } = useApp();

  const [isRescueModalOpen, setIsRescueModalOpen] = useState(false);
  const [loadingRescue, setLoadingRescue] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'CATCH_UP' | 'EMERGENCY' | 'SALVAGE' | 'PROTECT_TOMORROW'>('CATCH_UP');

  // Countdown timer state
  const [countdownStr, setCountdownStr] = useState('');

  const handleRescueTrigger = async () => {
    setLoadingRescue(true);
    try {
      await triggerSaveMyDay(selectedTier);
      setIsRescueModalOpen(false);
      router.push('/rescue');
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRescue(false);
    }
  };

  // Find the closest deadline and format countdown
  useEffect(() => {
    if (missions.length === 0) {
      setCountdownStr('NO STAKES');
      return;
    }
    const sorted = [...missions].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    const closest = sorted[0];

    const updateCountdown = () => {
      const diff = new Date(closest.deadline).getTime() - Date.now();
      if (diff <= 0) {
        setCountdownStr('DEADLINE PAST');
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setCountdownStr(`${days}D ${hours}H ${mins}M`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [missions]);

  // Stake breakdown stats
  const safeCount = missions.filter(m => m.health === 'Safe').length;
  const warningCount = missions.filter(m => m.health === 'At Risk' || m.health === 'Recovery Possible').length;
  const criticalCount = missions.filter(m => m.health === 'Critical' || m.health === 'Unlikely Without Sacrifice').length;

  const calendarDates = [
    { day: 'Sun', date: 28, isToday: false },
    { day: 'Mon', date: 29, isToday: false },
    { day: 'Tue', date: 30, isToday: true },
    { day: 'Wed', date: 1, isToday: false },
    { day: 'Thu', date: 2, isToday: false }
  ];

  const activities = [
    { time: '14:20', text: 'DSA prep milestone deconstructed' },
    { time: '12:00', text: 'Weekly roadmap synchronized via AI memory' },
    { time: '09:00', text: 'Focus round completed: 25 minutes' }
  ];

  return (
    <div className="space-y-8 select-none font-sans max-w-5xl">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-950 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight font-outfit uppercase">
            Mission Control
          </h1>
          <p className="text-[10px] text-zinc-550 mt-1 font-mono uppercase tracking-wider">
            User: {user?.displayName || 'Rescue Pilot'} | Status: {isRescueActive ? 'RESCUE PLAN APPLIED' : 'TIMELINE MONITORED'}
          </p>
        </div>

        {/* Calendar Strip */}
        <div className="flex gap-2">
          {calendarDates.map((d, idx) => (
            <div 
              key={idx}
              className={`flex flex-col items-center justify-center w-11 h-12 rounded border text-center transition-all ${
                d.isToday 
                  ? 'bg-white text-black border-white font-bold' 
                  : 'bg-zinc-950/40 border-zinc-900 text-zinc-500'
              }`}
            >
              <span className="text-[8px] uppercase tracking-wider font-mono font-medium">{d.day}</span>
              <span className="text-xs font-mono mt-0.5">{d.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Save My Day Command Bar */}
      <GlassCard 
        className="relative overflow-hidden border-zinc-900 bg-zinc-950/20"
        glowColor={criticalCount > 0 && !isRescueActive ? 'red' : 'none'}
        hoverEffect={false}
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-red-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-500/10 border border-red-500/10 text-[9px] font-mono font-bold text-red-400 uppercase tracking-widest">
              Emergency Switch
            </span>
            <h2 className="text-base font-bold text-white font-outfit uppercase">Save My Day</h2>
            <p className="text-xs text-zinc-400 max-w-xl leading-relaxed font-light">
              Timeline safety thresholds breached. Engaging the emergency rescue sequence decompresses Active roadmaps, postpones secondary deliverables, and locks down focus slots.
            </p>
          </div>

          <div className="shrink-0">
            {isRescueActive ? (
              <button
                onClick={() => router.push('/rescue')}
                className="px-5 py-3.5 rounded bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-850 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setIsRescueModalOpen(true)}
                className="btn-emergency-glass px-8 py-4.5 text-[10px] tracking-widest uppercase cursor-pointer text-white"
              >
                🚨 SAVE MY DAY
              </button>
            )}
          </div>
        </div>

        {/* Warning Indicator */}
        {criticalCount > 0 && !isRescueActive && (
          <div className="mt-5 pt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <span className="text-mos-coral flex items-center gap-2 font-bold font-mono text-[9px]">
              <AlertOctagon className="w-4 h-4 shrink-0" />
              COLLISION ALARM: {criticalCount} mission(s) marked critical.
            </span>
            <button
              onClick={() => setIsRescueModalOpen(true)}
              className="text-[9px] text-zinc-500 hover:text-white underline font-mono cursor-pointer animate-pulse"
            >
              Analyze scheduling conflicts
            </button>
          </div>
        )}
      </GlassCard>

      {/* Cockpit Instrument Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left Instruments: Probability, Health, Buffer */}
        <div className="space-y-6">
          
          {/* Probability Meter */}
          <GlassCard className="flex flex-col items-center justify-between min-h-[190px]" hoverEffect={false}>
            <span className="w-full text-center text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold border-b border-zinc-950 pb-2 block">Probability Meter</span>
            <div className="py-2">
              <SuccessGauge value={predictiveMetrics.successProbability} size={110} />
            </div>
            <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-wider block">[VAL.CONF]</span>
          </GlassCard>

          {/* Mission Health Compass */}
          <GlassCard className="space-y-4 bg-zinc-950/20" hoverEffect={false}>
            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-950 pb-2">Mission Health</span>
            <MissionCompass safeCount={safeCount} warningCount={warningCount} criticalCount={criticalCount} />
          </GlassCard>

          {/* Recovery Ring */}
          {isRescueActive && (
            <GlassCard className="space-y-4 bg-zinc-950/20" hoverEffect={false}>
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-950 pb-2">Recovery Ring</span>
              <RecoveryRing recoveredHours={4} totalHours={8} />
            </GlassCard>
          )}

        </div>

        {/* Center Instruments: Next Best Action, Timeline */}
        <div className="space-y-6">
          
          {/* Next Best Action */}
          <GlassCard className="space-y-4 bg-zinc-950/20" hoverEffect={false}>
            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-950 pb-2">Next Best Action</span>
            <div className="space-y-2">
              <span className="text-[8px] font-mono font-bold tracking-widest bg-blue-950/20 text-blue-400 border border-blue-500/10 px-2 py-0.5 rounded uppercase">
                STAKE FOCUS
              </span>
              <p className="text-xs font-bold text-white leading-normal">
                {isRescueActive && rescueResult 
                  ? rescueResult.nextBestAction 
                  : missions.length > 0 
                    ? `Resolve uncompleted tasks for "${missions[0].title}" immediately.`
                    : 'Create a mission in Mission Control to define a Next Best Action.'
                }
              </p>
            </div>
            
            <button
              onClick={() => router.push('/focus')}
              className="w-full py-2.5 rounded bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white transition-colors text-xs font-semibold cursor-pointer"
            >
              Open Focus Room
            </button>
          </GlassCard>

          {/* Today's Timeline */}
          <GlassCard className="space-y-4" hoverEffect={false}>
            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-950 pb-2">Today's Timeline</span>
            
            {isRescueActive && rescueResult ? (
              <div className="relative border-l border-zinc-900/60 pl-4 ml-2 space-y-4 py-1 text-xs">
                {rescueResult.recoverySchedule.slice(0, 3).map((block, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[21px] top-1 w-1.5 h-1.5 rounded-full bg-mos-coral border border-[#050507]" />
                    <div className="space-y-0.5">
                      <div className="flex gap-2 items-center">
                        <span className="text-[8px] font-mono text-zinc-500">{block.timeSlot}</span>
                        <span className="text-[7px] font-mono text-mos-coral font-bold uppercase">{block.priority}</span>
                      </div>
                      <p className="font-bold text-white leading-snug">{block.taskTitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3.5 text-xs text-zinc-400">
                <p className="font-light">No emergency timeline scheduled currently. Standard tasks active.</p>
                {missions.length > 0 ? (
                  <div className="space-y-2">
                    {missions.slice(0, 2).map(m => (
                      <div key={m.id} className="p-2.5 rounded bg-[#08080a] border border-zinc-900 flex justify-between items-center">
                        <span className="font-bold text-white truncate max-w-[130px]">{m.title}</span>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase">{m.health}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-zinc-650 font-mono text-[8px] tracking-wider">[TIMELINE EMPTY]</div>
                )}
              </div>
            )}
          </GlassCard>

        </div>

        {/* Right Instruments: Radars, Countdown, Streams */}
        <div className="space-y-6">
          
          {/* Threat Radar */}
          <GlassCard className="flex flex-col items-center justify-between min-h-[190px]" hoverEffect={false}>
            <span className="w-full text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold border-b border-zinc-950 pb-2">Threat Radar</span>
            <div className="py-2 mx-auto">
              <WorkloadRadar 
                metrics={[
                  { label: 'Workload', value: Math.min(10, missions.length * 2) },
                  { label: 'Collisions', value: Math.min(10, predictiveMetrics.deadlineCollisions * 3) },
                  { label: 'Complexity', value: 7 },
                  { label: 'Stress', value: Math.round(predictiveMetrics.burnoutRisk / 10) },
                  { label: 'Buffer', value: isRescueActive ? 8 : 2 },
                ]}
              />
            </div>
          </GlassCard>

          {/* Deadline Countdown */}
          <GlassCard className="flex flex-col justify-between min-h-[120px] bg-zinc-950/20" hoverEffect={false}>
            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-950 pb-2">Deadline Countdown</span>
            <div className="py-3 text-center">
              <span className="text-2xl font-black font-mono tracking-widest text-white">
                {countdownStr}
              </span>
            </div>
            <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-wider block">[ST.COUNTDOWN]</span>
          </GlassCard>

          {/* AI Insights notes */}
          <GlassCard className="space-y-3" hoverEffect={false}>
            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-950 pb-2">AI Insights</span>
            <p className="text-xs text-zinc-500 leading-relaxed font-light">
              {isRescueActive 
                ? 'Timeline compressed. Deferring secondary assignments has resolved tomorrow\'s hour deficit.'
                : `Timeline is ${predictiveMetrics.burnoutRisk > 60 ? 'congested' : 'clear'}. Focus cap recommended at 6 hours maximum.`
              }
            </p>
          </GlassCard>

          {/* Activity Stream */}
          <GlassCard className="space-y-4" hoverEffect={false}>
            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-950 pb-2">Activity Stream</span>
            <div className="space-y-3 text-[10px] font-mono text-zinc-400">
              {activities.map((act, idx) => (
                <div key={idx} className="flex gap-2.5 items-start">
                  <span className="text-zinc-650 shrink-0">{act.time}</span>
                  <span className="leading-relaxed">{act.text}</span>
                </div>
              ))}
            </div>
          </GlassCard>

        </div>

      </div>

      {/* SAVE MY DAY Modal Trigger */}
      {isRescueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <GlassCard className="w-full max-w-xs space-y-5 animate-in zoom-in-95 duration-200 bg-charcoal-card" hoverEffect={false}>
            
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
                <h2 className="text-sm font-bold text-white uppercase">Engage Rescue Core</h2>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-zinc-400 leading-relaxed font-light">
                Select the severity of your rescue mode. Gemini will recalculate timeline roadmaps and compile sacrifices.
              </p>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Sacrifice Severity</label>
                <select
                  value={selectedTier}
                  onChange={(e: any) => setSelectedTier(e.target.value)}
                  className="w-full premium-input px-3 py-2 text-xs text-slate-300"
                >
                  <option value="CATCH_UP">Catch Up (Mild - Delay admin items)</option>
                  <option value="EMERGENCY">Emergency (Moderate - Simplify projects)</option>
                  <option value="SALVAGE">Salvage (Aggressive - Drop minor courses)</option>
                  <option value="PROTECT_TOMORROW">Protect Tomorrow (Defensive - Build safety)</option>
                </select>
              </div>

              <div className="bg-red-950/10 border border-red-500/10 rounded-lg p-3 text-[10px] text-zinc-400 leading-normal">
                <span className="font-bold text-red-400 block mb-0.5 font-mono uppercase text-[9px]">🚨 WARNING</span>
                Activating will force-lock focus blocks and highlight dropped deliverables to secure core milestones.
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex gap-2.5 justify-end pt-3 border-t border-zinc-900">
              <button
                type="button"
                onClick={() => setIsRescueModalOpen(false)}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 transition-colors cursor-pointer"
                disabled={loadingRescue}
              >
                Cancel
              </button>
              <button
                onClick={handleRescueTrigger}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shadow-md shadow-red-900/10"
                disabled={loadingRescue}
              >
                {loadingRescue ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Engaging...
                  </>
                ) : (
                  'Deploy Rescue'
                )}
              </button>
            </div>

          </GlassCard>
        </div>
      )}

    </div>
  );
}
