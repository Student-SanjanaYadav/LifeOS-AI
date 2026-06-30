'use client';

import React, { useState } from 'react';
import { 
  Code, 
  Layers, 
  Terminal, 
  Play, 
  CheckSquare, 
  Sparkles,
  Award,
  ChevronRight,
  Plus
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';

export default function HackathonHubPage() {
  const [activeSubTab, setActiveSubTab] = useState<'architecture' | 'priority' | 'checklist' | 'demo'>('architecture');

  // Interactive MVP priorities State
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Decompression animation demo logic', priority: 'REQUIRED', status: 'Active' },
    { id: 2, title: 'Firebase authentication tokens helper', priority: 'REQUIRED', status: 'Active' },
    { id: 3, title: 'Avatar profile upload settings', priority: 'OPTIONAL', status: 'Bypassed' },
    { id: 4, title: 'Relational Database Index hooks', priority: 'OPTIONAL', status: 'Active' }
  ]);

  const cycleTaskStatus = (id: number) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'Active' ? 'Bypassed' : 'Active';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  // Interactive Submission Checklist State
  const [checklist, setChecklist] = useState([
    { id: 1, item: 'Static Next.js static builds compilation', checked: true },
    { id: 2, item: 'Verify live Vercel deployments deployment link', checked: true },
    { id: 3, item: 'Record 2-min pitch wow-moment video demo', checked: false },
    { id: 4, item: 'Configure Gemini API fallback key headers', checked: false }
  ]);

  const toggleChecklistItem = (id: number) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const checkedCount = checklist.filter(c => c.checked).length;

  return (
    <div className="space-y-8 select-none font-sans max-w-5xl">
      
      {/* Header */}
      <div className="border-b border-zinc-950 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight font-outfit uppercase">Hackathon Hub</h1>
          <p className="text-xs text-zinc-555 mt-1 font-mono uppercase tracking-wider">Validate ideas, compile architectures, monitor deploys, and test demo scripts</p>
        </div>
        
        <span className="text-[10px] font-mono text-purple-600 bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded uppercase font-bold">
          [HACKATHON.SYS]
        </span>
      </div>

      {/* Sub Toggles */}
      <div className="flex bg-[#08080a] border border-zinc-200 rounded p-1 text-xs font-mono w-max">
        {[
          { id: 'architecture', name: 'Architecture' },
          { id: 'priority', name: 'Feature Priority (MVP)' },
          { id: 'checklist', name: 'Submission Checklist' },
          { id: 'demo', name: 'Demo & Pitch Script' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded transition-all cursor-pointer ${
              activeSubTab === tab.id ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Panels */}
      <div>
        
        {/* A. Architecture */}
        {activeSubTab === 'architecture' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="space-y-4" hoverEffect={false}>
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-200 pb-2">Client Stack</span>
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded font-mono text-xs text-zinc-700 space-y-2 leading-relaxed">
                <p>• Client: Next.js 15 (Turbopack compiler check: pass)</p>
                <p>• Styling: CSS variables grid variables layout</p>
                <p>• Assets: Lucide Icons layout configuration</p>
              </div>
            </GlassCard>

            <GlassCard className="space-y-4" hoverEffect={false}>
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-200 pb-2">Infrastructure Layer</span>
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded font-mono text-xs text-zinc-700 space-y-2 leading-relaxed">
                <p>• Cloud DB: Firestore Real-time synchronization</p>
                <p>• AI engine: Gemini 1.5 API routes connector</p>
                <p>• Sync protocol: Serverless endpoints payload</p>
              </div>
            </GlassCard>
          </div>
        )}

        {/* B. Feature Priority */}
        {activeSubTab === 'priority' && (
          <div className="space-y-4">
            <GlassCard className="space-y-4" hoverEffect={false}>
              <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold">MVP Scope Reduction Planner</span>
                <span className="text-[10px] text-zinc-400">Click card status to bypass task</span>
              </div>
              
              <div className="space-y-2.5">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => cycleTaskStatus(task.id)}
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded flex justify-between items-center text-xs text-left cursor-pointer hover:bg-zinc-100 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-zinc-850">{task.title}</p>
                      <p className="text-[10px] text-zinc-550 mt-0.5">Priority weight: {task.priority}</p>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                      task.status === 'Active' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-zinc-100 text-zinc-400 border-zinc-200 line-through'
                    }`}>{task.status}</span>
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* C. Submission Checklist */}
        {activeSubTab === 'checklist' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Checklist items */}
            <div className="md:col-span-2 space-y-4">
              <GlassCard className="space-y-4" hoverEffect={false}>
                <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold">Submission Requirements</span>
                  <span className="text-xs font-mono font-bold text-purple-600">Tasks: {checkedCount} / {checklist.length}</span>
                </div>

                <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all duration-300" style={{ width: `${(checkedCount / checklist.length) * 100}%` }} />
                </div>

                <div className="space-y-2.5">
                  {checklist.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleChecklistItem(item.id)}
                      className="w-full p-3.5 bg-zinc-50 border border-zinc-200 rounded flex items-center justify-between text-xs text-left cursor-pointer hover:bg-zinc-100 transition-colors"
                    >
                      <span className={`${item.checked ? 'line-through text-zinc-400' : 'text-zinc-800 font-semibold'}`}>{item.item}</span>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                        item.checked ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-zinc-100 text-zinc-400 border-zinc-200'
                      }`}>
                        {item.checked ? 'COMPLETED' : 'PENDING'}
                      </span>
                    </button>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* General metadata info */}
            <GlassCard className="space-y-4 bg-white" hoverEffect={false}>
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-200 pb-2">Dev Submission specs</span>
              <div className="space-y-2.5 text-xs font-light text-zinc-650 leading-relaxed">
                <p>• Title: LifeOS AI</p>
                <p>• Tagline: Your AI Rescue System</p>
                <p>• Git repositories check: stable</p>
              </div>
            </GlassCard>

          </div>
        )}

        {/* D. Demo Script */}
        {activeSubTab === 'demo' && (
          <GlassCard className="space-y-4" hoverEffect={false}>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-200 pb-2">Wow-Moment Demo Pitch Strategy</span>
            
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-3.5 font-mono text-xs text-zinc-700 leading-relaxed">
              <p className="text-zinc-900 font-bold">0-30s: The Crisis Problem</p>
              <p>Show a static checklist overflowing with DBMS labs, exam preps, and interview calendars. Show the 35% success probability gauge.</p>
              
              <p className="text-zinc-900 font-bold pt-2">30-70s: Save My Day Intervention</p>
              <p>Deploy the emergency Coral Red switch. Watch the AI Thinking pulses map milestones, shift database tasks, drop minor files, and raise success probability to 88%.</p>
            </div>
          </GlassCard>
        )}

      </div>

    </div>
  );
}
