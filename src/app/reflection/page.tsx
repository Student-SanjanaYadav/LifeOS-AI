'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  BrainCircuit, 
  Sparkles, 
  CheckCircle,
  Loader2
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';

interface ReflectionLog {
  id: string;
  date: string;
  stressLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  workload: number;
  notes: string;
  aiMemoryConsolidation: string;
}

export default function ReflectionPage() {
  const { predictiveMetrics } = useApp();
  
  const [logs, setLogs] = useState<ReflectionLog[]>([
    {
      id: 'log1',
      date: '2026-06-28',
      stressLevel: 'HIGH',
      workload: 8,
      notes: 'Completed sliding window algorithms but struggled with time complexity checks. Postponed DBMS project configurations.',
      aiMemoryConsolidation: 'Google Placement Prep: Gaps noted in Graph traversal stack frames. Standard recommendation: NeetCode graph playlist.'
    },
    {
      id: 'log2',
      date: '2026-06-29',
      stressLevel: 'MEDIUM',
      workload: 6,
      notes: 'Executed 3 Focus Blocks. Completed process scheduling in OS. Rebuilt study buffer due to a deadline collision.',
      aiMemoryConsolidation: 'Academic OS Prep: Process cycles secure. DBMS buffers shifted via Save My Day Rescue Engine.'
    }
  ]);

  const [notes, setNotes] = useState('');
  const [stressLevel, setStressLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [workload, setWorkload] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      let aiMemoryConsolidation = 'AI memory consolidated. Adjusting future priority roadmaps.';
      if (notes.toLowerCase().includes('google') || notes.toLowerCase().includes('placement')) {
        aiMemoryConsolidation = 'Placement Copilot: Linked DSA algorithms to tomorrow risk. Recommended mock grids.';
      } else if (notes.toLowerCase().includes('dbms') || notes.toLowerCase().includes('semester')) {
        aiMemoryConsolidation = 'Academic DBMS: Project deadlines shifted. Scope simplification logged.';
      }

      const newLog: ReflectionLog = {
        id: 'log_' + Math.random().toString(36).substring(2, 9),
        date: new Date().toISOString().split('T')[0],
        stressLevel,
        workload,
        notes,
        aiMemoryConsolidation
      };

      setLogs([newLog, ...logs]);
      setNotes('');
      setStressLevel('MEDIUM');
      setWorkload(5);
      setSubmitting(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 select-none max-w-5xl font-sans">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-outfit">Reflection logs</h1>
        <p className="text-xs text-zinc-500 mt-1">Review stress metrics, document daily outcomes, and feed AI memory parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Reflection Form */}
        <GlassCard className="md:col-span-2 space-y-6 bg-charcoal-card" hoverEffect={false}>
          <div className="border-b border-zinc-900 pb-2.5">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Create Daily Log</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Stress Level */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Current Stress Level</label>
                <div className="flex gap-2.5">
                  {(['LOW', 'MEDIUM', 'HIGH'] as const).map((level) => {
                    const isActive = stressLevel === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setStressLevel(level)}
                        className={`flex-1 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                          isActive 
                            ? level === 'LOW' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold' :
                              level === 'MEDIUM' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold' :
                              'bg-red-500/10 border-red-500/30 text-red-400 font-bold'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Workload Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                  <span>Workload Saturation</span>
                  <span className="text-blue-400 font-bold font-mono">{workload}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={workload}
                  onChange={(e) => setWorkload(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Reflection Notes */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Reflection notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Document milestones achieved or timeline bottlenecks..."
                  className="w-full premium-input px-3.5 py-2 min-h-[80px]"
                  required
                  disabled={submitting}
                />
              </div>

            </div>

            {/* Submit */}
            <div className="flex justify-end pt-3 border-t border-zinc-900">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-zinc-100 text-black transition-colors flex items-center gap-1.5 cursor-pointer"
                disabled={submitting || !notes.trim()}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Consolidating...
                  </>
                ) : (
                  'Commit Log'
                )}
              </button>
            </div>
          </form>
        </GlassCard>

        {/* AI Memory Column */}
        <GlassCard className="space-y-4 bg-charcoal-card" hoverEffect={false}>
          <div className="border-b border-zinc-900 pb-2.5 flex items-center gap-2 text-blue-400">
            <BrainCircuit className="w-4.5 h-4.5" />
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">AI Memory Layer</span>
          </div>
          
          <div className="space-y-3.5 text-xs font-light leading-relaxed">
            <div className="p-3.5 rounded-lg bg-[#08080a] border border-zinc-900">
              <span className="text-[9px] font-mono font-bold text-blue-400 block mb-1 uppercase tracking-wider">ACTIVE SYNC MEMORY</span>
              <p className="text-zinc-400">
                Struggle points identified on Graph models. Shifting placement study priority higher. OS scheduling logs are stable.
              </p>
            </div>
            <p className="text-[10px] text-zinc-500 leading-normal font-mono">
              Consolidated memory is dynamically fed into Gemini analysis prompts to customize priority timelines.
            </p>
          </div>
        </GlassCard>

      </div>

      {/* Logs Feed */}
      <div className="space-y-4">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold border-b border-zinc-900 pb-2 block">Log History</span>
        
        {logs.map((log) => (
          <GlassCard key={log.id} className="space-y-3 bg-charcoal-card hover:border-zinc-800 transition-colors animate-in fade-in duration-200" hoverEffect={false}>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-400 font-bold">{log.date}</span>
              <div className="flex items-center gap-4 text-[10px] text-zinc-500">
                <span>
                  Stress: <strong className="text-zinc-300 font-bold">{log.stressLevel}</strong>
                </span>
                <span>
                  Workload: <strong className="text-zinc-300 font-bold">{log.workload}/10</strong>
                </span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">{log.notes}</p>
            
            <div className="pt-2.5 border-t border-zinc-900/60 flex gap-2.5 items-start text-xs leading-relaxed">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] font-mono font-bold text-blue-400 uppercase tracking-wider">AI Memory Consolidation</span>
                <p className="text-[10px] text-zinc-500 mt-0.5 font-light">{log.aiMemoryConsolidation}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

    </div>
  );
}
