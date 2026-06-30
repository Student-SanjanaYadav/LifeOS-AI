'use client';

import React, { useState } from 'react';
import { 
  Terminal, 
  Sparkles, 
  Loader2, 
  ShieldAlert, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';

export default function AICommandCenterPage() {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [aiOutput, setAiOutput] = useState<string | null>(null);

  const runCommandAction = (actionId: string, actionName: string) => {
    setLoadingAction(actionId);
    setAiOutput(null);

    setTimeout(() => {
      setLoadingAction(null);
      switch (actionId) {
        case 'save_day':
          setAiOutput('Emergency timeline compression applied. Bypassed Database Lab to secure Graph BFS/DFS Leetcode preparation. Deficit hours minimized.');
          break;
        case 'study_plan':
          setAiOutput('Study Plan: CPU Scheduling (4 hrs), virtual memory page fault calculations (3 hrs), precedence transaction logs validation (2 hrs).');
          break;
        case 'hackathon_plan':
          setAiOutput('Hackathon Plan: Scope avatar uploads. Build Firestore real-time collection triggers. Deploy static Next.js assets to Vercel.');
          break;
        case 'placement_prep':
          setAiOutput('Placement Prep: Prioritized sliding window string patterns. Resume point X-Y-Z alignment checked.');
          break;
        default:
          setAiOutput('Command executed successfully.');
      }
    }, 1500);
  };

  const commandsList = [
    { id: 'save_day', name: '🚨 SAVE MY DAY', desc: 'Recalculate deficits and drop secondary milestones' },
    { id: 'study_plan', name: 'Generate Study Plan', desc: 'Deconstruct OS and DBMS syllabus targets' },
    { id: 'hackathon_plan', name: 'Generate Hackathon Plan', desc: 'Rebuild MVP roadmap features and drop avatar modules' },
    { id: 'placement_prep', name: 'Placement Preparation', desc: 'Map DSA graph DFS algorithms and review resumes' }
  ];

  return (
    <div className="space-y-8 select-none font-sans max-w-5xl">
      
      {/* Header */}
      <div className="border-b border-zinc-950 pb-6">
        <h1 className="text-2xl font-black text-white tracking-tight font-outfit uppercase">AI Command Center</h1>
        <p className="text-[10px] text-zinc-555 mt-1 font-mono uppercase tracking-wider">Execute emergency timeline optimization routines and roadmap compilation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Commands Panel */}
        <div className="md:col-span-2 space-y-4">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-950 pb-2">Routines Panel</span>
          
          <div className="space-y-3">
            {commandsList.map((cmd) => (
              <div 
                key={cmd.id}
                className="p-4 bg-zinc-950/20 border border-zinc-900 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans"
              >
                <div className="space-y-1">
                  <p className="font-bold text-white text-sm">{cmd.name}</p>
                  <p className="text-zinc-500 font-light">{cmd.desc}</p>
                </div>

                <button
                  onClick={() => runCommandAction(cmd.id, cmd.name)}
                  disabled={loadingAction !== null}
                  className="px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase rounded bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  {loadingAction === cmd.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    'Execute'
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Output Console */}
        <GlassCard className="space-y-4 bg-zinc-950/20" hoverEffect={false}>
          <div className="border-b border-zinc-950 pb-2 flex items-center gap-2 text-zinc-400">
            <Terminal className="w-4 h-4" />
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Console Output</span>
          </div>

          <div className="p-4 bg-[#08080a] border border-zinc-900 rounded-lg min-h-[160px] font-mono text-[10px] text-zinc-400 leading-relaxed flex flex-col justify-between">
            {loadingAction ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10">
                <Loader2 className="w-4.5 h-4.5 animate-spin text-zinc-500" />
                <p className="text-[9px] text-zinc-600 uppercase tracking-wider animate-pulse">Running routines...</p>
              </div>
            ) : aiOutput ? (
              <p className="animate-in fade-in duration-300">{aiOutput}</p>
            ) : (
              <p className="text-zinc-600 uppercase tracking-wide text-center py-10">[AWAITING ROU.COMMAND]</p>
            )}

            <span className="text-[8px] text-zinc-650 block border-t border-zinc-950 pt-2.5 mt-4">SYS.OUT: Consolidated</span>
          </div>
        </GlassCard>

      </div>

    </div>
  );
}
