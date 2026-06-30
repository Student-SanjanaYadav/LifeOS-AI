'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft,
  Volume2,
  VolumeX
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';

export default function FocusPage() {
  const router = useRouter();
  const { 
    focusSession, 
    startFocusSession, 
    pauseFocusSession, 
    resumeFocusSession, 
    stopFocusSession, 
    missions
  } = useApp();

  // Ambient sound state
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'white' | 'lofi'>('none');
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const handleStartFallback = () => {
    const activeMission = missions.find(m => m.health === 'Critical' || m.health === 'At Risk') || missions[0];
    if (activeMission) {
      const nextTask = activeMission.milestones.find(ms => !ms.completed) || activeMission.milestones[0];
      if (nextTask) {
        startFocusSession(activeMission.id, nextTask.id, nextTask.title);
        return;
      }
    }
    startFocusSession('generic_mission', 'generic_task', 'General Productivity Focus');
  };

  const getProgressPercentage = () => {
    const total = focusSession.durationMinutes * 60;
    const elapsed = total - focusSession.timeRemainingSeconds;
    return Math.round((elapsed / total) * 100);
  };

  const toggleSound = (soundType: 'rain' | 'white' | 'lofi') => {
    if (ambientSound === soundType && isPlayingSound) {
      setIsPlayingSound(false);
    } else {
      setAmbientSound(soundType);
      setIsPlayingSound(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center select-none font-sans max-w-xl mx-auto space-y-12">
      
      {/* Back button */}
      <div className="w-full flex justify-between items-center text-xs">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors cursor-pointer group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Exit Room
        </button>
        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">[STATION.EXEC]</span>
      </div>

      {/* Task & Timer Room (Pure distraction-free) */}
      <div className="w-full flex flex-col items-center space-y-6">
        
        <div className="text-center space-y-1">
          <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
            {focusSession.isActive ? `${focusSession.type} SESSION` : 'ROOM STANDBY'}
          </p>
          <h2 className="text-sm font-semibold text-white max-w-xs truncate">
            {focusSession.isActive ? focusSession.taskTitle : 'System awaiting activation target'}
          </h2>
        </div>

        {/* Circular Dial */}
        <div className="relative flex items-center justify-center w-56 h-56 rounded-full border border-zinc-950/40">
          <svg className="absolute w-full h-full transform -rotate-90">
            <circle
              className="stroke-zinc-950/40"
              fill="transparent"
              strokeWidth="2"
              r="104"
              cx="112"
              cy="112"
            />
            {focusSession.isActive && (
              <circle
                className="stroke-mos-blue transition-all duration-1000"
                fill="transparent"
                strokeWidth="2.5"
                strokeDasharray="653"
                strokeDashoffset={653 - (getProgressPercentage() / 100) * 653}
                strokeLinecap="round"
                r="104"
                cx="112"
                cy="112"
              />
            )}
          </svg>

          <div className="text-center select-none z-10">
            <div className="text-4xl font-extralight font-mono text-white tracking-widest">
              {Math.floor(focusSession.timeRemainingSeconds / 60).toString().padStart(2, '0')}:
              {(focusSession.timeRemainingSeconds % 60).toString().padStart(2, '0')}
            </div>
            <p className="text-[8px] font-mono text-zinc-650 uppercase tracking-wider mt-1.5">
              Round: {focusSession.completedPomodoros}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {!focusSession.isActive ? (
            <button
              onClick={handleStartFallback}
              className="px-6 py-3 rounded bg-white hover:bg-zinc-100 text-black font-bold text-xs tracking-wider uppercase transition-transform hover:scale-102 cursor-pointer shadow-sm"
            >
              Start Focus Session
            </button>
          ) : (
            <>
              <button
                onClick={focusSession.isPaused ? resumeFocusSession : pauseFocusSession}
                className="px-4 py-2.5 rounded bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                {focusSession.isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={stopFocusSession}
                className="p-2.5 rounded bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 text-red-400 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

      </div>

      {/* Ambient Audio Console */}
      <GlassCard className="w-full p-4 bg-zinc-950/10 border-zinc-950 flex items-center justify-between gap-6" hoverEffect={false}>
        <div className="flex items-center gap-2 text-zinc-500">
          {isPlayingSound ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4" />}
          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider">Ambient Sound</span>
        </div>

        <div className="flex gap-2 text-[9px] font-mono">
          {[
            { id: 'rain', name: 'Rain' },
            { id: 'white', name: 'White Noise' },
            { id: 'lofi', name: 'Lo-Fi' }
          ].map(s => {
            const active = ambientSound === s.id && isPlayingSound;
            return (
              <button
                key={s.id}
                onClick={() => toggleSound(s.id as any)}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer border ${
                  active 
                    ? 'bg-blue-950/20 text-blue-400 border-blue-500/25' 
                    : 'bg-zinc-950/40 border-zinc-900 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      </GlassCard>

    </div>
  );
}
