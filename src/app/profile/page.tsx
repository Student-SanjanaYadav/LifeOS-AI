'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  User, 
  Award, 
  Clock, 
  Calendar,
  CheckCircle2,
  BrainCircuit
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';

export default function ProfilePage() {
  const { user, missions } = useApp();

  const achievements = [
    { title: 'Timeline Saver', desc: 'Saved 10 deadlines via Save My Day engine', icon: Award, color: 'text-mos-coral' },
    { title: 'Focus Specialist', desc: 'Logged 20 hours in Focus Room', icon: Clock, color: 'text-blue-400' },
    { title: 'Syllabus Master', desc: 'Stabilized academic revision sets', icon: CheckCircle2, color: 'text-mos-emerald' }
  ];

  return (
    <div className="space-y-8 select-none font-sans max-w-5xl">
      
      {/* Header */}
      <div className="border-b border-zinc-950 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight font-outfit uppercase">Pilot Profile</h1>
          <p className="text-[10px] text-zinc-555 mt-1 font-mono uppercase tracking-wider">Review achievements, focus hours statistics, and credentials</p>
        </div>
        
        <span className="text-[8px] font-mono text-zinc-650 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded uppercase">
          [PROFILE.SYS]
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Profile Info */}
        <div className="md:col-span-2 space-y-6">
          <GlassCard className="p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start" hoverEffect={false}>
            <div className="w-16 h-16 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-zinc-300 font-mono text-xl shadow-inner shrink-0">
              {(user?.displayName || user?.email || 'P').charAt(0).toUpperCase()}
            </div>
            
            <div className="space-y-2 text-center sm:text-left text-xs leading-relaxed font-light">
              <span className="text-[8px] font-mono font-bold text-zinc-500 bg-zinc-900 border border-zinc-900 px-2 py-0.5 rounded uppercase">Pilot Credentials</span>
              <h2 className="text-lg font-bold text-white font-outfit mt-1">{user?.displayName || 'Rescue Pilot'}</h2>
              <p className="text-zinc-550 font-mono">{user?.email}</p>
              <p className="text-zinc-400">Authorized pilot node managing timeline safety bounds across active course schedules.</p>
            </div>
          </GlassCard>

          {/* Achievements */}
          <div className="space-y-4">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-950 pb-2">Active Achievements</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {achievements.map((ach, idx) => {
                const Icon = ach.icon;
                return (
                  <GlassCard key={idx} className="p-5 flex flex-col justify-between min-h-[140px] bg-zinc-950/20" hoverEffect={false}>
                    <Icon className={`w-5 h-5 ${ach.color}`} />
                    <div className="space-y-1 mt-4 text-xs font-light leading-normal">
                      <p className="font-bold text-white">{ach.title}</p>
                      <p className="text-[10px] text-zinc-500">{ach.desc}</p>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Focus Stats */}
        <GlassCard className="space-y-4 bg-zinc-950/20" hoverEffect={false}>
          <div className="border-b border-zinc-950 pb-2 flex items-center gap-2 text-zinc-400">
            <BrainCircuit className="w-4 h-4" />
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Focus Stats</span>
          </div>

          <div className="space-y-3.5 text-xs font-mono text-zinc-400 leading-relaxed">
            <div className="p-3 bg-[#08080a] border border-zinc-900 rounded">
              <span className="text-zinc-500">Missions Completed</span>
              <span className="font-bold text-white block mt-0.5">
                {missions.filter(m => m.progress === 100).length} of {missions.length}
              </span>
            </div>
            <div className="p-3 bg-[#08080a] border border-zinc-900 rounded">
              <span className="text-zinc-500">Stakes Monitored</span>
              <span className="font-bold text-white block mt-0.5">3 Areas</span>
            </div>
          </div>
        </GlassCard>

      </div>

    </div>
  );
}
