'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ShieldAlert, 
  ArrowRight,
  AlertOctagon,
  Calendar,
  Clock,
  Layers,
  Award,
  BookOpen,
  Code,
  Briefcase,
  Plus,
  CheckCircle,
  FileCheck,
  Building,
  Target
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { SuccessGauge, WorkloadRadar, MissionCompass, RecoveryRing, AIThinkingFlow } from '@/components/SvgCharts';

export default function LandingPage() {
  const router = useRouter();
  
  // Interactive sequence states
  const [activePreset, setActivePreset] = useState<'academic' | 'hackathon' | 'placement'>('academic');
  const [demoState, setDemoState] = useState<'chaos' | 'processing' | 'clear'>('chaos');
  const [thinkingStep, setThinkingStep] = useState(0);

  // Home Page Expanded Hub state
  const [expandedHub, setExpandedHub] = useState<'student' | 'hackathon' | 'placement'>('student');

  // Workable feature states inside expanded hubs
  const [gpaScore, setGpaScore] = useState(3.4);
  const [isMvpOnly, setIsMvpOnly] = useState(true);
  const [solvedDsaCount, setSolvedDsaCount] = useState(12);

  // Study tasks list
  const [studentTasks, setStudentTasks] = useState([
    { id: 1, text: 'Review OS Concurrency Semaphores', done: false },
    { id: 2, text: 'Complete Normalization Lab', done: false }
  ]);

  const toggleStudentTask = (id: number) => {
    setStudentTasks(studentTasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // Stats dynamically computed based on state & preset
  const getMetrics = () => {
    if (demoState === 'chaos') {
      if (activePreset === 'academic') return { success: 68, critical: 2, burnout: 94, statusText: 'EXAMS COLLIDING' };
      if (activePreset === 'hackathon') return { success: 55, critical: 3, burnout: 88, statusText: 'SCOPE CREEP RISK' };
      return { success: 72, critical: 1, burnout: 90, statusText: 'DSA INTERVIEW THREAT' };
    }
    if (demoState === 'processing') {
      return { success: 74, critical: 1, burnout: 80, statusText: 'STABILIZING...' };
    }
    // clear
    if (activePreset === 'academic') return { success: 91, critical: 0, burnout: 32, statusText: 'TIMELINE BALANCED' };
    if (activePreset === 'hackathon') return { success: 88, critical: 0, burnout: 40, statusText: 'MVP DELIVERABLES SECURED' };
    return { success: 94, critical: 0, burnout: 28, statusText: 'DSA DRILL LOCKED IN' };
  };

  const metrics = getMetrics();

  const triggerIntervention = () => {
    setDemoState('processing');
    setThinkingStep(1);

    // AI Thinking nodes pulses
    setTimeout(() => setThinkingStep(2), 600);
    setTimeout(() => setThinkingStep(3), 1200);
    setTimeout(() => setThinkingStep(4), 1850);

    setTimeout(() => {
      setDemoState('clear');
    }, 2500);
  };

  const resetDemo = (preset: 'academic' | 'hackathon' | 'placement') => {
    setActivePreset(preset);
    setDemoState('chaos');
    setThinkingStep(0);
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#121217] flex flex-col relative select-none font-sans">
      
      {/* Editorial layout lines */}
      <div className="absolute inset-y-0 left-12 w-[1px] bg-zinc-200/50 pointer-events-none hidden lg:block"></div>
      <div className="absolute inset-y-0 right-12 w-[1px] bg-zinc-200/50 pointer-events-none hidden lg:block"></div>

      {/* Navigation */}
      <header className="px-8 md:px-12 py-6 flex items-center justify-between border-b border-zinc-200 sticky top-0 bg-[#f4f5f7]/95 backdrop-blur-md z-40">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-zinc-950 border border-zinc-800 shadow-md">
            <Sparkles className="w-4.5 h-4.5 text-zinc-100 animate-pulse" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-zinc-900 font-outfit uppercase">
            LifeOS <span className="text-blue-600 font-medium">AI</span>
          </span>
        </div>

        <button
          onClick={() => router.push('/login')}
          className="px-5 py-2.5 text-xs font-mono font-bold tracking-wider uppercase rounded bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-850 transition-all cursor-pointer mos-btn-blue-hover shadow-sm"
        >
          Open App Workspace
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl w-full mx-auto px-8 md:px-12 py-16 space-y-28">
        
        {/* Title Header */}
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-200 text-xs font-mono font-bold text-zinc-800 uppercase tracking-wider shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            ACTIVE RESCUE STATION
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-zinc-900 tracking-tight font-outfit uppercase leading-tight">
            LifeOS <span className="text-blue-600 font-semibold">AI</span>
          </h1>
          <p className="text-base md:text-lg text-zinc-655 font-light leading-relaxed">
            Your operating cockpit to decompress study schedules, drop non-critical tasks, and secure target grades when deadlines collide.
          </p>
        </section>

        {/* INTERACTIVE SIMULATOR PANEL */}
        <section className="space-y-8 max-w-4xl mx-auto">
          
          {/* Preset Selector Tabs */}
          <div className="flex justify-center gap-2.5 border-b border-zinc-200 pb-4">
            {[
              { id: 'academic', name: '📚 Academic Exam Prep', color: 'border-blue-500 text-blue-600' },
              { id: 'hackathon', name: '💻 Hackathon Build Scope', color: 'border-purple-500 text-purple-600' },
              { id: 'placement', name: '💼 LeetCode Placement Prep', color: 'border-emerald-500 text-emerald-600' }
            ].map(tab => {
              const active = activePreset === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => resetDemo(tab.id as any)}
                  className={`px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase rounded-lg border transition-all cursor-pointer ${
                    active 
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' 
                      : 'bg-white text-zinc-500 hover:text-zinc-800 border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* Status Panel */}
            <GlassCard className="p-6 bg-white border-l-4 border-l-blue-500 flex flex-col justify-between min-h-[220px] shadow-md" hoverEffect={false}>
              <div className="space-y-1">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold block border-b border-zinc-200 pb-1.5">Today Parameters</span>
                <span className="text-[10px] font-mono text-blue-600 font-bold block uppercase tracking-wider">{metrics.statusText}</span>
              </div>
              
              <div className="space-y-3.5 py-2 font-mono text-xs text-zinc-700">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 uppercase">Active Targets</span>
                  <span className="font-bold text-zinc-900 text-sm">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 uppercase">Critical Risks</span>
                  <span className={`font-bold text-sm transition-colors ${metrics.critical > 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                    {metrics.critical}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-zinc-200">
                  <span className="text-zinc-500 uppercase">Stabilization Rate</span>
                  <span className={`font-bold text-sm transition-colors ${metrics.success > 80 ? 'text-emerald-600 font-extrabold' : 'text-amber-600'}`}>
                    {metrics.success}%
                  </span>
                </div>
              </div>
              
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">[ST.ACT]</span>
            </GlassCard>

            {/* Emergency Glass Switch */}
            <GlassCard className="p-6 bg-white border-l-4 border-l-red-500 flex flex-col justify-between items-center text-center min-h-[220px] shadow-md" hoverEffect={false}>
              <span className="w-full text-left text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold border-b border-zinc-200 pb-1.5 block">Emergency Action</span>
              
              <div className="py-4">
                {demoState === 'chaos' ? (
                  <button
                    onClick={triggerIntervention}
                    className="btn-emergency-glass px-8 py-5.5 text-xs uppercase font-mono tracking-widest text-white shadow-lg cursor-pointer"
                  >
                    🚨 SAVE MY DAY
                  </button>
                ) : demoState === 'clear' ? (
                  <div className="space-y-1.5">
                    <span className="text-sm font-mono text-emerald-600 font-bold block uppercase tracking-widest animate-pulse">✓ Stabilization Applied</span>
                    <button
                      onClick={() => resetDemo(activePreset)}
                      className="text-xs font-mono text-zinc-500 hover:text-zinc-900 underline cursor-pointer mt-1"
                    >
                      Reset Simulator
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-mono text-zinc-650 tracking-wider animate-pulse block">DECOMPRESSING TIMELINE...</span>
                )}
              </div>

              <span className="text-xs font-mono text-zinc-500 uppercase block">Recover today. Protect tomorrow.</span>
            </GlassCard>

            {/* Burnout Risk Gauge */}
            <GlassCard className="p-6 bg-white border-l-4 border-l-amber-500 flex flex-col justify-between items-center text-center min-h-[220px] shadow-md" hoverEffect={false}>
              <span className="w-full text-left text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold border-b border-zinc-200 pb-1.5 block">Burnout Deficit</span>
              
              <div className="py-4.5 mx-auto">
                <span className={`text-5xl font-black font-mono tracking-tighter transition-colors duration-500 ${
                  metrics.burnout > 70 ? 'text-red-500' : 'text-zinc-600'
                }`}>{metrics.burnout}%</span>
              </div>

              <span className="text-[10px] font-mono text-zinc-550 uppercase block">[VAL.STRESS]</span>
            </GlassCard>

          </div>

          {/* Interactive Preview Dashboard Window */}
          <div className="mos-panel bg-white border border-zinc-200 rounded-lg overflow-hidden flex flex-col min-h-[300px] mt-6 shadow-lg">
            
            {/* Window title bar */}
            <div className="px-4 py-3 bg-zinc-100 border-b border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="mac-dot mac-dot-red" />
                <div className="mac-dot mac-dot-yellow" />
                <div className="mac-dot mac-dot-green" />
              </div>
              <span className="text-xs font-mono text-zinc-500 font-bold">timeline_monitor.mos</span>
              <span className="text-[9px] font-mono text-zinc-650 bg-zinc-200 px-2 py-0.5 rounded border border-zinc-300 font-bold">
                [SYS.INTERV]
              </span>
            </div>

            {/* Window body preview */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              
              {demoState === 'chaos' && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  {activePreset === 'academic' && (
                    <>
                      <div className="bg-red-500/5 border border-red-500/20 border-t-red-500/40 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-red-650 text-sm">Operating Systems Theory Exam</p>
                          <p className="text-xs text-zinc-550 mt-1 font-light">12 hours work remaining | Due Tomorrow</p>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded border border-red-200">CRITICAL</span>
                      </div>
                      <div className="bg-amber-500/5 border border-amber-500/20 border-t-amber-500/40 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-amber-650 text-sm">Database Semester Lab</p>
                          <p className="text-xs text-zinc-550 mt-1 font-light">8 hours remaining | Due Tomorrow</p>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">WARNING</span>
                      </div>
                    </>
                  )}
                  {activePreset === 'hackathon' && (
                    <>
                      <div className="bg-red-500/5 border border-red-500/20 border-t-red-500/40 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-red-650 text-sm">Write Submission Pitch Video Script</p>
                          <p className="text-xs text-zinc-550 mt-1 font-light">6 hours effort | Due in 12 hours</p>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded border border-red-200">CRITICAL</span>
                      </div>
                      <div className="bg-amber-500/5 border border-amber-500/20 border-t-amber-500/40 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-amber-650 text-sm">Build User Profile Avatar Uploads</p>
                          <p className="text-xs text-zinc-550 mt-1 font-light">5 hours remaining | Due in 12 hours</p>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">SCOPE CREEP</span>
                      </div>
                    </>
                  )}
                  {activePreset === 'placement' && (
                    <>
                      <div className="bg-red-500/5 border border-red-500/20 border-t-red-500/40 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-red-650 text-sm">Solve Google Graph BFS/DFS Questions</p>
                          <p className="text-xs text-zinc-550 mt-1 font-light">6 topics pending | Assessment tomorrow</p>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded border border-red-200">CRITICAL</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {demoState === 'processing' && (
                <div className="py-4">
                  <AIThinkingFlow step={thinkingStep} />
                </div>
              )}

              {demoState === 'clear' && (
                <div className="space-y-3.5 animate-in fade-in duration-300">
                  {activePreset === 'academic' && (
                    <>
                      <div className="bg-blue-500/5 border border-blue-500/20 border-t-blue-500/40 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-zinc-800 text-sm">⭐️ Focus Active: CPU scheduling algorithms</p>
                          <p className="text-xs text-zinc-550 mt-1 font-light">Dedicated Study roadmap locked. Delaying DBMS Lab to Sunday.</p>
                        </div>
                        <span className="text-[9px] font-mono text-blue-600 bg-blue-100 px-2 py-0.5 rounded border border-blue-200 font-bold">15:00 - 19:00</span>
                      </div>
                      <div className="bg-zinc-100 border border-zinc-200 rounded-lg p-4.5 flex justify-between items-center opacity-30">
                        <div>
                          <p className="font-bold text-zinc-400 line-through text-sm">Database Semester Lab</p>
                          <p className="text-xs text-zinc-550 mt-1 font-light">Deferred: Rescheduled to target safety buffer date</p>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-500 font-bold">POSTPONED</span>
                      </div>
                    </>
                  )}
                  {activePreset === 'hackathon' && (
                    <>
                      <div className="bg-blue-500/5 border border-blue-500/20 border-t-blue-500/40 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-zinc-800 text-sm">⭐️ Focus Active: Record Pitch Video Demo</p>
                          <p className="text-xs text-zinc-550 mt-1 font-light">Submission requirements prioritized. Bypassing avatar uploads.</p>
                        </div>
                        <span className="text-[9px] font-mono text-blue-600 bg-blue-100 px-2 py-0.5 rounded border border-blue-200 font-bold">14:00 - 17:00</span>
                      </div>
                      <div className="bg-zinc-100 border border-zinc-200 rounded-lg p-4.5 flex justify-between items-center opacity-35">
                        <div>
                          <p className="font-bold text-zinc-400 line-through text-sm">Build User Profile Avatar Uploads</p>
                          <p className="text-xs text-zinc-550 mt-1 font-light">Dropped: Decoupled optional feature from submission checklist</p>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-500 font-bold">DROPPED (MVP)</span>
                      </div>
                    </>
                  )}
                  {activePreset === 'placement' && (
                    <>
                      <div className="bg-blue-500/5 border border-blue-500/20 border-t-blue-500/40 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-zinc-800 text-sm">⭐️ Focus Active: Graph Cycle Detections</p>
                          <p className="text-xs text-zinc-550 mt-1 font-light">Targeted LeetCode drills locked. Safety index stabilized.</p>
                        </div>
                        <span className="text-[9px] font-mono text-blue-600 bg-blue-100 px-2 py-0.5 rounded border border-blue-200 font-bold">ACTIVE DRILL</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-zinc-200 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                <span>[STATION.READY]</span>
                <span>LEVEL 01 PREVIEW</span>
              </div>

            </div>

          </div>

        </section>

        {/* 2. THE STATIONS: STUDENT, HACKATHON, AND PLACEMENT INTEGRATIONS */}
        <section className="space-y-8 pt-8 border-t border-zinc-200">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 font-outfit uppercase">Integrated Domain Stations</h2>
            <p className="text-sm text-zinc-650 mt-1 font-light">Click on any hub card below to activate and view its interactive work desk panel.</p>
          </div>

          {/* Clickable Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* Student Hub Card */}
            <div
              onClick={() => setExpandedHub('student')}
              className={`text-left w-full transition-all cursor-pointer rounded-xl ${
                expandedHub === 'student' ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
            >
              <GlassCard className="p-6 bg-white border-t-4 border-t-blue-500 space-y-4 flex flex-col justify-between shadow-md h-full" hoverEffect={false}>
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-blue-600 border-b border-zinc-200 pb-2">
                    <BookOpen className="w-5 h-5" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-800">Student Hub</span>
                  </div>
                  
                  <p className="text-xs text-zinc-555 leading-relaxed font-light">
                    Align academic exam timelines, track syllabus topics coverage, and compile active recall cards before tests.
                  </p>

                  <span className="text-[10px] font-mono text-blue-600 block uppercase font-bold mt-2">👉 Click to open Work Desk</span>
                </div>

                <span className="text-[9px] font-mono text-zinc-400 block uppercase mt-4">[HUB.ACADEMIC]</span>
              </GlassCard>
            </div>

            {/* Hackathon Hub Card */}
            <div
              onClick={() => setExpandedHub('hackathon')}
              className={`text-left w-full transition-all cursor-pointer rounded-xl ${
                expandedHub === 'hackathon' ? 'ring-2 ring-purple-500 ring-offset-2' : ''
              }`}
            >
              <GlassCard className="p-6 bg-white border-t-4 border-t-purple-500 space-y-4 flex flex-col justify-between shadow-md h-full" hoverEffect={false}>
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-purple-600 border-b border-zinc-200 pb-2">
                    <Code className="w-5 h-5" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-800">Hackathon Hub</span>
                  </div>
                  
                  <p className="text-xs text-zinc-555 leading-relaxed font-light">
                    Prioritize features by MVP weight to drop optional scope, monitor build releases, and test judge video demo scripts.
                  </p>

                  <span className="text-[10px] font-mono text-purple-600 block uppercase font-bold mt-2">👉 Click to open Work Desk</span>
                </div>

                <span className="text-[9px] font-mono text-zinc-400 block uppercase mt-4">[HUB.HACKATHON]</span>
              </GlassCard>
            </div>

            {/* Placement Hub Card */}
            <div
              onClick={() => setExpandedHub('placement')}
              className={`text-left w-full transition-all cursor-pointer rounded-xl ${
                expandedHub === 'placement' ? 'ring-2 ring-emerald-500 ring-offset-2' : ''
              }`}
            >
              <GlassCard className="p-6 bg-white border-t-4 border-t-emerald-500 space-y-4 flex flex-col justify-between shadow-md h-full" hoverEffect={false}>
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-emerald-600 border-b border-zinc-200 pb-2">
                    <Briefcase className="w-5 h-5" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-800">Placement Hub</span>
                  </div>
                  
                  <p className="text-xs text-zinc-555 leading-relaxed font-light">
                    Monitor placement timelines, check resume bullet formats, and practice prioritized LeetCode graph algorithms.
                  </p>

                  <span className="text-[10px] font-mono text-emerald-600 block uppercase font-bold mt-2">👉 Click to open Work Desk</span>
                </div>

                <span className="text-[9px] font-mono text-zinc-400 block uppercase mt-4">[HUB.PLACEMENT]</span>
              </GlassCard>
            </div>

          </div>

          {/* ACTIVE EXPANDED HUB WORK DESK */}
          <div className="mt-8 border border-zinc-200 rounded-xl bg-white p-6 shadow-md transition-all duration-300">
            
            {/* Student Hub Active Desk */}
            {expandedHub === 'student' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-zinc-100 pb-3 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-blue-600">
                    <BookOpen className="w-5 h-5" />
                    <h3 className="text-base font-bold text-zinc-900 font-outfit uppercase">Active Student Work Desk</h3>
                  </div>
                  <span className="text-[10px] font-mono text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded font-bold">ONLINE</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Planners check */}
                  <div className="space-y-3">
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider font-bold block">Interactive Study Planner</span>
                    <div className="space-y-2">
                      {studentTasks.map(t => (
                        <button
                          key={t.id}
                          onClick={() => toggleStudentTask(t.id)}
                          className="w-full p-3 bg-zinc-50 border border-zinc-150 rounded-lg flex items-center justify-between text-xs hover:bg-zinc-100 transition-colors cursor-pointer text-left"
                        >
                          <span className={`${t.done ? 'line-through text-zinc-400' : 'text-zinc-800 font-medium'}`}>{t.text}</span>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                            t.done ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {t.done ? 'COMPLETED' : 'PENDING'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* GPA Predictor */}
                  <div className="space-y-3 p-4 bg-zinc-50 border border-zinc-150 rounded-lg">
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider font-bold block">GPA Target Forecast</span>
                    <p className="text-xs text-zinc-550 leading-relaxed">Adjust your daily study target hours to predict semester GPA grades index.</p>
                    
                    <div className="flex gap-4 items-center justify-between pt-2">
                      <span className="text-xs font-bold text-zinc-800">Forecast GPA:</span>
                      <span className="text-2xl font-black font-mono text-blue-600">{gpaScore.toFixed(2)}</span>
                    </div>

                    <input 
                      type="range" 
                      min="2.0" 
                      max="4.0" 
                      step="0.1" 
                      value={gpaScore}
                      onChange={(e) => setGpaScore(parseFloat(e.target.value))}
                      className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                </div>

                <div className="pt-4 border-t border-zinc-100 flex justify-end">
                  <button
                    onClick={() => router.push('/student')}
                    className="px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-850 text-white text-xs font-mono font-bold uppercase cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Open Full Student Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Hackathon Hub Active Desk */}
            {expandedHub === 'hackathon' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-zinc-100 pb-3 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-purple-600">
                    <Code className="w-5 h-5" />
                    <h3 className="text-base font-bold text-zinc-900 font-outfit uppercase">Active Hackathon Work Desk</h3>
                  </div>
                  <span className="text-[10px] font-mono text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded font-bold">ONLINE</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Scope checklist */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider font-bold block">Build Checklist</span>
                      <button
                        onClick={() => setIsMvpOnly(!isMvpOnly)}
                        className="text-[10px] font-mono text-purple-600 border border-purple-200 bg-purple-50 px-2 py-0.5 rounded hover:bg-purple-100 transition-all font-bold cursor-pointer"
                      >
                        {isMvpOnly ? 'Switch to Full Mode' : 'Switch to MVP Mode'}
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="p-3 bg-zinc-50 border border-zinc-150 rounded-lg flex items-center justify-between text-xs">
                        <span className="text-zinc-800 font-medium">Decompression Animation Engine</span>
                        <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded">REQUIRED</span>
                      </div>
                      <div className="p-3 bg-zinc-50 border border-zinc-150 rounded-lg flex items-center justify-between text-xs">
                        <span className="text-zinc-800 font-medium">Authentication Token Logic</span>
                        <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded">REQUIRED</span>
                      </div>
                      <div className={`p-3 bg-zinc-50 border border-zinc-150 rounded-lg flex items-center justify-between text-xs transition-opacity duration-300 ${
                        isMvpOnly ? 'opacity-30 line-through' : 'opacity-100'
                      }`}>
                        <span className="text-zinc-800 font-medium">Avatar Profile Image Uploads</span>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                          isMvpOnly ? 'bg-zinc-200 text-zinc-500 border-zinc-300' : 'bg-purple-50 text-purple-600 border-purple-100'
                        }`}>
                          {isMvpOnly ? 'DEFERRED (MVP)' : 'OPTIONAL'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pitch Script preview */}
                  <div className="space-y-3 p-4 bg-zinc-50 border border-zinc-150 rounded-lg">
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider font-bold block">Pitch Video Demo Log</span>
                    <p className="text-xs text-zinc-555 leading-relaxed font-mono">
                      [0-30s] Crisis display: show schedule overlaps.
                    </p>
                    <p className="text-xs text-zinc-555 leading-relaxed font-mono">
                      [30-70s] Save My Day demo: toggle switch to resolve os/db task deficits.
                    </p>
                  </div>

                </div>

                <div className="pt-4 border-t border-zinc-100 flex justify-end">
                  <button
                    onClick={() => router.push('/hackathon')}
                    className="px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-850 text-white text-xs font-mono font-bold uppercase cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Open Full Hackathon Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Placement Hub Active Desk */}
            {expandedHub === 'placement' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-zinc-100 pb-3 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Briefcase className="w-5 h-5" />
                    <h3 className="text-base font-bold text-zinc-900 font-outfit uppercase">Active Placement Work Desk</h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-bold">ONLINE</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* DSA Tracker */}
                  <div className="space-y-3 p-4 bg-zinc-50 border border-zinc-150 rounded-lg">
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider font-bold block">LeetCode Graph Problems</span>
                    <p className="text-xs text-zinc-550 leading-relaxed">Track your solved priority questions targeting company exams.</p>
                    
                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-xs font-bold text-zinc-800">Solved Graph algorithms:</span>
                      <span className="text-2xl font-black font-mono text-emerald-600">{solvedDsaCount} / 15</span>
                    </div>

                    <button
                      onClick={() => setSolvedDsaCount(Math.min(15, solvedDsaCount + 1))}
                      className="w-full py-2.5 rounded bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-xs uppercase cursor-pointer transition-colors shadow-sm"
                      disabled={solvedDsaCount >= 15}
                    >
                      {solvedDsaCount >= 15 ? 'All Solved' : 'Solve BFS/DFS Question (+1)'}
                    </button>
                  </div>

                  {/* Pipelines list */}
                  <div className="space-y-3">
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider font-bold block">Application Pipelines</span>
                    <div className="space-y-2.5">
                      <div className="p-3 bg-zinc-50 border border-zinc-150 rounded-lg flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-zinc-800">Google Placement Test</p>
                          <p className="text-[10px] text-zinc-550 mt-0.5">Due Tomorrow</p>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-red-500 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">CRITICAL</span>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="pt-4 border-t border-zinc-100 flex justify-end">
                  <button
                    onClick={() => router.push('/placement')}
                    className="px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-850 text-white text-xs font-mono font-bold uppercase cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Open Full Placement Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

          </div>

        </section>

        {/* 3. [01 / About Product] */}
        <section className="space-y-6 pt-12 border-t border-zinc-200">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold block">[01 / About Product]</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-light leading-relaxed text-zinc-655">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-900 font-outfit uppercase">Timeline Decompression</h3>
              <p>
                LifeOS replaces static checkboxes with a dynamic timeline decompression engine. When study tasks overflow, the engine calculates the required effort remaining and reorganizes deliverables to secure critical exams.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-900 font-outfit uppercase">Target Stake Alignment</h3>
              <p>
                Missions are linked to specialized Student, Hackathon, and Placement hubs. These hubs provide roadmaps, DSA trackers, and deployment validation tasks aligned directly with your daily available hours.
              </p>
            </div>
          </div>
        </section>

        {/* 4. [02 / How It Works] */}
        <section className="space-y-6 pt-12 border-t border-zinc-200">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold block">[02 / How It Works]</span>
          
          <div className="relative border-l border-zinc-200 pl-6 ml-3 space-y-6 py-2 text-sm font-light">
            <div className="relative">
              <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-zinc-350 border border-[#f4f5f7]" />
              <h4 className="font-bold text-zinc-900">01. Detect Overlaps</h4>
              <p className="text-zinc-650 mt-1 max-w-lg leading-normal">Monitors upcoming deadlines and active milestones to calculate deficit hours.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-zinc-350 border border-[#f4f5f7]" />
              <h4 className="font-bold text-zinc-900">02. Coordinate Sacrifices</h4>
              <p className="text-zinc-650 mt-1 max-w-lg leading-normal">Suggests secondary tasks or administrative files to drop or simplify.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-zinc-350 border border-[#f4f5f7]" />
              <h4 className="font-bold text-zinc-900">03. Lock Focus Blocks</h4>
              <p className="text-zinc-650 mt-1 max-w-lg leading-normal">Deploys distraction-free execution timers bound to high-stakes targets.</p>
            </div>
          </div>
        </section>

      </main>

      {/* Simple Editorial Footer */}
      <footer className="border-t border-zinc-200 py-8 text-center text-xs font-mono text-zinc-500 mt-12">
        <p>© 2026 LifeOS. Dedicated to timeline stabilization. Developed for demo deployment environments.</p>
      </footer>

    </div>
  );
}
