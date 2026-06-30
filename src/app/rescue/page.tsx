'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { 
  ShieldAlert, 
  ArrowRight, 
  Play, 
  Clock, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';

export default function RescuePage() {
  const router = useRouter();
  const { 
    isRescueActive, 
    rescueResult, 
    deactivateRescueMode, 
    missions, 
    startFocusSession 
  } = useApp();

  // If no rescue is active, show onboarding blocker
  if (!isRescueActive || !rescueResult) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-6 select-none font-sans">
        <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-white font-outfit">Rescue Engine Standby</h2>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
            The Save My Day rescue systems are in standby. Go to the Dashboard and activate the intervention engine.
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-4.5 py-2 text-xs font-semibold rounded-lg bg-[#f4f4f5] hover:bg-white text-black transition-all cursor-pointer shadow-sm"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Find task for Next Best Action to link focus
  const handleLaunchNextActionFocus = () => {
    const activeMission = missions.find(m => m.health === 'Critical' || m.health === 'At Risk') || missions[0];
    if (activeMission) {
      const nextTask = activeMission.milestones.find(ms => !ms.completed) || activeMission.milestones[0];
      if (nextTask) {
        startFocusSession(activeMission.id, nextTask.id, nextTask.title);
        router.push('/focus');
        return;
      }
    }
    router.push('/focus');
  };

  const getSacrificeStyle = (type: string) => {
    switch (type) {
      case 'DROP': return 'bg-red-950/20 text-red-400 border-red-500/20';
      case 'POSTPONE': return 'bg-amber-950/20 text-amber-400 border-amber-500/20';
      case 'SIMPLIFY': return 'bg-purple-950/20 text-purple-400 border-purple-500/20';
      default: return 'bg-zinc-900 text-zinc-400 border-zinc-800';
    }
  };

  return (
    <div className="space-y-8 select-none max-w-5xl font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-red-950/10 border border-red-500/10 rounded-xl p-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-md shrink-0">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight font-outfit">RESCUE INTERVENTION ACTIVE</h1>
            <p className="text-[10px] text-red-400 mt-0.5 font-mono uppercase tracking-widest font-bold">Timeline Safe Limits Enforced</p>
          </div>
        </div>

        <button
          onClick={deactivateRescueMode}
          className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-semibold relative z-10 cursor-pointer"
        >
          Exit Rescue Mode
        </button>
      </div>

      {/* Probability Shift */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <GlassCard className="col-span-2 space-y-6 bg-charcoal-card" hoverEffect={false}>
          <div className="border-b border-zinc-900 pb-2.5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
              Explainable AI Success Boost
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8 py-2">
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-center">
                <p className="text-[9px] font-mono text-zinc-600 uppercase mb-2">Original</p>
                <div className="w-20 h-20 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-400 font-bold font-mono text-lg select-none shadow-inner">
                  {rescueResult.originalProbability}%
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-700 mt-5" />
              <div className="text-center">
                <p className="text-[9px] font-mono text-blue-400 uppercase tracking-wider font-bold mb-2">Rescued</p>
                <div className="w-20 h-20 rounded-xl bg-blue-950/20 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black font-mono text-2xl select-none shadow-md">
                  {rescueResult.newProbability}%
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-2 text-xs text-center sm:text-left">
              <span className="text-[9px] font-bold font-mono text-blue-400 uppercase bg-blue-950/20 border border-blue-500/10 px-2 py-0.5 rounded">
                +{rescueResult.newProbability - rescueResult.originalProbability}% Optimization
              </span>
              <p className="text-white font-outfit font-semibold text-sm mt-1 leading-snug">
                "{rescueResult.strategy}"
              </p>
              <p className="text-zinc-500 leading-relaxed font-light mt-1">
                {rescueResult.explanation}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Next Best Action Card */}
        <GlassCard 
          className="bg-zinc-950 border-blue-500/20 flex flex-col justify-between"
          glowColor="indigo"
          hoverEffect={false}
        >
          <div className="border-b border-zinc-900 pb-2.5">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">Next Best Action</span>
          </div>

          <div className="py-4 space-y-2 text-xs">
            <span className="text-[8px] font-mono font-bold tracking-widest bg-blue-950/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/10 uppercase">
              HIGH IMPACT TARGET
            </span>
            <p className="font-bold text-white leading-normal">
              {rescueResult.nextBestAction}
            </p>
            <p className="text-[10px] text-zinc-500">
              Focus is locked to this target. Completing this recovers 35% success margin.
            </p>
          </div>

          <button
            onClick={handleLaunchNextActionFocus}
            className="w-full py-2.5 rounded-lg bg-white hover:bg-zinc-100 text-black font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-sm transition-transform hover:scale-102 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-black stroke-none" />
            <span>Launch focus</span>
          </button>
        </GlassCard>

      </div>

      {/* Timeline Rebuilt Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recovery Schedule */}
        <GlassCard className="space-y-4" hoverEffect={false}>
          <div className="border-b border-zinc-900 pb-2.5 flex justify-between items-center">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Rebuilt Recovery Schedule</span>
            <span className="text-[9px] font-mono text-zinc-600">TIMELINE</span>
          </div>

          <div className="relative border-l border-zinc-900 pl-6 ml-3 space-y-6 py-2">
            {rescueResult.recoverySchedule.map((block, idx) => (
              <div key={idx} className="relative">
                {/* Dot */}
                <div className={`absolute -left-[30px] top-1 w-2 h-2 rounded-full border ${
                  block.priority === 'HIGH' ? 'bg-red-500 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]' :
                  block.priority === 'MEDIUM' ? 'bg-amber-500 border-amber-500' : 'bg-zinc-700 border-zinc-800'
                }`} />

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                      {block.timeSlot}
                    </span>
                    <span className={`text-[8px] font-mono font-extrabold px-1.5 py-0.2 rounded border ${
                      block.priority === 'HIGH' ? 'text-red-400 bg-red-950/20 border-red-500/10' :
                      block.priority === 'MEDIUM' ? 'text-amber-400 bg-amber-950/20 border-amber-500/10' : 'text-zinc-500 bg-zinc-900 border-zinc-800'
                    }`}>
                      {block.priority}
                    </span>
                  </div>
                  <p className="font-bold text-white">{block.taskTitle}</p>
                  <p className="text-[9px] text-zinc-500 font-mono">Duration: {block.durationMin} minutes</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Sacrifice Engine Output */}
        <GlassCard className="space-y-4" hoverEffect={false}>
          <div className="border-b border-zinc-900 pb-2.5 flex justify-between items-center">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Sacrifice Recommendations</span>
            <span className="text-[9px] font-mono text-zinc-600">COMPRESSION</span>
          </div>

          <div className="space-y-3">
            {rescueResult.sacrifices.map((sac, idx) => (
              <div 
                key={idx} 
                className="p-3.5 rounded-lg bg-zinc-950/40 border border-zinc-900 flex items-start gap-3.5 text-xs"
              >
                <div className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 mt-0.5 ${getSacrificeStyle(sac.type)}`}>
                  {sac.type}
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-white">{sac.taskTitle}</p>
                  <p className="text-[10px] text-zinc-500 font-light leading-normal">{sac.reason}</p>
                  <span className="inline-block text-[9px] font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-500/10 px-1.5 py-0.2 rounded mt-1.5">
                    +{sac.impactOnProbability}% Success Impact
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>

      {/* Fallback Plan */}
      <GlassCard className="border-zinc-800 bg-[#08080a]" hoverEffect={false}>
        <div className="flex gap-3.5 items-start text-xs leading-relaxed">
          <AlertTriangle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-white">Rescue Contingency Fallback Plan</h4>
            <p className="text-zinc-500 font-light">
              {rescueResult.fallbackPlan || "If timeline milestones slide past target limits, shift the study blocks to 07:00 tomorrow and sacrifice leisure slots."}
            </p>
          </div>
        </div>
      </GlassCard>

    </div>
  );
}
