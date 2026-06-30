'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter, useParams } from 'next/navigation';
import { 
  ChevronLeft, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Code, 
  Briefcase, 
  ExternalLink,
  Timer,
  Info,
  Award,
  PlayCircle,
  Terminal,
  FileText,
  FileCheck,
  CheckSquare,
  Sparkles
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';

export default function MissionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { missions, toggleMilestone, startFocusSession } = useApp();
  
  const [activeTab, setActiveTab] = useState<'milestones' | 'roadmap' | 'hub'>('milestones');
  const [hubSubTab, setHubSubTab] = useState<string>('default');

  const mission = missions.find(m => m.id === id);

  if (!mission) {
    return (
      <div className="space-y-6 text-center py-16">
        <h2 className="text-sm font-bold text-white">Mission Not Found</h2>
        <p className="text-xs text-zinc-500 max-w-xs mx-auto">The requested mission ID does not exist or has been deleted.</p>
        <button
          onClick={() => router.push('/mission')}
          className="text-xs text-blue-400 font-semibold underline cursor-pointer"
        >
          Return to Mission Control
        </button>
      </div>
    );
  }

  // --- Dynamic Hub Layouts ---

  const renderStudentHub = () => {
    // Sub tabs: study_planner, exam_strategy, revision, flashcards
    const subTabs = [
      { id: 'study_planner', name: 'Study Planner' },
      { id: 'exam_strategy', name: 'Exam Strategy' },
      { id: 'revision', name: 'Revision Generator' },
      { id: 'flashcards', name: 'Flashcards' }
    ];

    const currentSub = hubSubTab === 'default' ? 'study_planner' : hubSubTab;

    return (
      <div className="space-y-6 text-xs">
        <div className="flex bg-[#08080a] border border-zinc-900 rounded p-1 text-[9px] font-mono w-max">
          {subTabs.map(st => (
            <button
              key={st.id}
              onClick={() => setHubSubTab(st.id)}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                currentSub === st.id ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {st.name}
            </button>
          ))}
        </div>

        {currentSub === 'study_planner' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-white uppercase tracking-widest font-mono border-b border-zinc-900 pb-2">Academic Roadmap Sync</h4>
              <p className="text-zinc-400 leading-relaxed font-light">Prioritize Chapters based on historical weightage. Rebuild study hours daily to handle deficits.</p>
              <ul className="space-y-2 font-light text-zinc-400">
                <li className="flex gap-2"><span className="text-blue-400">•</span> Phase 1: High weightage systems core (Week 1-2)</li>
                <li className="flex gap-2"><span className="text-blue-400">•</span> Phase 2: Active recall mock sets (Week 3)</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-white uppercase tracking-widest font-mono border-b border-zinc-900 pb-2">Hours Block allocation</h4>
              <div className="p-3 bg-[#08080a] border border-zinc-900 rounded-lg space-y-2">
                <div className="flex justify-between font-mono text-[9px] text-zinc-500">
                  <span>Assigned Core Reading</span>
                  <span>4 Hours</span>
                </div>
                <div className="flex justify-between font-mono text-[9px] text-zinc-500">
                  <span>Assigned Labs Practice</span>
                  <span>2 Hours</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentSub === 'exam_strategy' && (
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Google-Standard CS Exam Strategy</h4>
            <div className="p-4 bg-[#08080a] border border-zinc-900 rounded-lg text-zinc-400 font-light leading-relaxed">
              Solve the past 5 years of exam papers in 2-hour slots. Prioritize OS scheduling algorithms, database normal forms, and compiler parsing rules.
            </div>
          </div>
        )}

        {currentSub === 'revision' && (
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">AI Revision Sheets</h4>
            <div className="p-4 bg-[#08080a] border border-zinc-900 rounded-lg space-y-3 font-mono text-[10px] text-zinc-400">
              <p className="text-white font-bold">1-Page Summary Core:</p>
              <p>• DBMS: B+ Trees index leaf-nodes structure. Transactions ACID properties.</p>
              <p>• OS: Virtual Memory page replacement algorithms. Semaphore lock conditions.</p>
            </div>
          </div>
        )}

        {currentSub === 'flashcards' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#08080a] border border-zinc-900 rounded-lg space-y-2 text-center">
              <span className="text-[8px] font-mono text-zinc-500 uppercase">Flashcard 01</span>
              <p className="text-xs font-bold text-white">What is a database transaction ACID property?</p>
              <p className="text-[9px] text-zinc-500 font-light pt-2 border-t border-zinc-950">Atomicity, Consistency, Isolation, Durability.</p>
            </div>
            <div className="p-4 bg-[#08080a] border border-zinc-900 rounded-lg space-y-2 text-center">
              <span className="text-[8px] font-mono text-zinc-500 uppercase">Flashcard 02</span>
              <p className="text-xs font-bold text-white">What causes thread scheduler deadlocks?</p>
              <p className="text-[9px] text-zinc-500 font-light pt-2 border-t border-zinc-950">Mutual exclusion, hold and wait, no preemption, circular wait.</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderHackathonHub = () => {
    const subTabs = [
      { id: 'architecture', name: 'Architecture' },
      { id: 'priority', name: 'Feature Priority' },
      { id: 'submission', name: 'Submission Details' },
      { id: 'demo_script', name: 'Demo Script' }
    ];

    const currentSub = hubSubTab === 'default' ? 'architecture' : hubSubTab;

    return (
      <div className="space-y-6 text-xs">
        <div className="flex bg-[#08080a] border border-zinc-900 rounded p-1 text-[9px] font-mono w-max">
          {subTabs.map(st => (
            <button
              key={st.id}
              onClick={() => setHubSubTab(st.id)}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                currentSub === st.id ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {st.name}
            </button>
          ))}
        </div>

        {currentSub === 'architecture' && (
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">BaaS & Client Architecture Stack</h4>
            <div className="p-4 bg-[#08080a] border border-zinc-900 rounded-lg font-mono text-[9px] text-zinc-400 space-y-2">
              <p>• Client layer: Next.js 15 App router (Turbopack bundler)</p>
              <p>• DB layer: Firestore Real-time collections listener</p>
              <p>• Auth: Firebase token credentials helper</p>
              <p>• AI: Gemini 1.5 API routes endpoint</p>
            </div>
          </div>
        )}

        {currentSub === 'priority' && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">MVP Scope Reduction</h4>
            <div className="space-y-2">
              <div className="p-3 bg-red-950/10 border border-red-500/10 rounded-lg text-red-400 flex justify-between items-center">
                <span>Drop Profile Settings & Avatar upload</span>
                <span className="font-mono text-[8px] font-bold">BYPASSED</span>
              </div>
              <div className="p-3 bg-emerald-950/10 border border-emerald-500/10 rounded-lg text-emerald-400 flex justify-between items-center">
                <span>Lock down Core Decompression animation demo</span>
                <span className="font-mono text-[8px] font-bold">REQUIRED</span>
              </div>
            </div>
          </div>
        )}

        {currentSub === 'submission' && (
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Vercel Deploy Sync</h4>
            <div className="p-4 bg-[#08080a] border border-zinc-900 rounded-lg text-zinc-400 font-light leading-relaxed flex justify-between items-center">
              <span>Next.js Static Generation build check: pass</span>
              <span className="font-mono text-[8px] text-emerald-400 font-bold bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/10">100% ONLINE</span>
            </div>
          </div>
        )}

        {currentSub === 'demo_script' && (
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Wow-Moment Pitch Script</h4>
            <div className="p-4 bg-[#08080a] border border-zinc-900 rounded-lg text-zinc-400 font-light leading-relaxed space-y-2">
              <p className="text-white font-bold">0-30s: Introduce the Deficit Problem</p>
              <p className="text-[10px]">Show static checklist overflowing with overlapping exams and interview preparation.</p>
              <p className="text-white font-bold mt-2">30-60s: Engage Save My Day emergency engine</p>
              <p className="text-[10px]">Click emergency switch, trigger AI timeline restructuring, demonstrate decompressed slots.</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPlacementHub = () => {
    const subTabs = [
      { id: 'dsa_tracker', name: 'DSA Tracker' },
      { id: 'resume', name: 'Resume Grills' },
      { id: 'projects', name: 'Projects Details' },
      { id: 'company', name: 'Company Tracker' }
    ];

    const currentSub = hubSubTab === 'default' ? 'dsa_tracker' : hubSubTab;

    return (
      <div className="space-y-6 text-xs">
        <div className="flex bg-[#08080a] border border-zinc-900 rounded p-1 text-[9px] font-mono w-max">
          {subTabs.map(st => (
            <button
              key={st.id}
              onClick={() => setHubSubTab(st.id)}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                currentSub === st.id ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {st.name}
            </button>
          ))}
        </div>

        {currentSub === 'dsa_tracker' && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">LeetCode Pattern priority</h4>
            <div className="space-y-2">
              <div className="p-3 bg-[#08080a] border border-zinc-900 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">BFS / DFS in Graphs</p>
                  <p className="text-[9px] text-zinc-500 mt-0.5">Topology sorting, cycle detection</p>
                </div>
                <span className="text-[8px] font-mono text-blue-400 font-bold">REQUIRED</span>
              </div>
              <div className="p-3 bg-[#08080a] border border-zinc-900 rounded-lg flex justify-between items-center opacity-40">
                <div>
                  <p className="font-bold text-zinc-500">Tries & Suffix Trees</p>
                  <p className="text-[9px] text-zinc-500 mt-0.5">Prefix matching nodes</p>
                </div>
                <span className="text-[8px] font-mono text-zinc-600">DEFERRED</span>
              </div>
            </div>
          </div>
        )}

        {currentSub === 'resume' && (
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Google Resume Checklist</h4>
            <ul className="space-y-2 text-zinc-400 font-light pl-4 list-disc">
              <li>Structure points with the **X-Y-Z** formula (Accomplished [X], measured by [Y], by doing [Z]).</li>
              <li>Include link to live deployments and GitHub repository cores.</li>
            </ul>
          </div>
        )}

        {currentSub === 'projects' && (
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Core Project Architectures</h4>
            <div className="p-4 bg-[#08080a] border border-zinc-900 rounded-lg text-zinc-400 font-light leading-relaxed">
              Prepare to answer database indexing types, server scaling limits, API authorization payloads, and concurrency locks in your mock projects.
            </div>
          </div>
        )}

        {currentSub === 'company' && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Target pipelines</h4>
            <div className="grid grid-cols-2 gap-4 font-mono text-[9px] text-zinc-400">
              <div className="p-3 bg-[#08080a] border border-zinc-900 rounded-lg">
                <span className="font-bold text-white block">Google Placement</span>
                <span className="text-zinc-500 block mt-1">Due: Tomorrow</span>
              </div>
              <div className="p-3 bg-[#08080a] border border-zinc-900 rounded-lg">
                <span className="font-bold text-white block">Stripe Internship</span>
                <span className="text-zinc-500 block mt-1">Due: July 5</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderHubContent = () => {
    switch (mission.category) {
      case 'academic': return renderStudentHub();
      case 'hackathon': return renderHackathonHub();
      case 'placement': return renderPlacementHub();
      default:
        return (
          <div className="text-center py-6 text-xs text-zinc-500 leading-normal">
            <Info className="w-5 h-5 mx-auto mb-2 text-zinc-700" />
            No specialized hub active. Standard mission settings configured.
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 select-none max-w-5xl font-sans">
      
      {/* Back button */}
      <button
        onClick={() => router.push('/mission')}
        className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-white transition-colors cursor-pointer group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Mission Control
      </button>

      {/* Mission details */}
      <GlassCard className="relative overflow-hidden space-y-6" glowColor={mission.health === 'Critical' ? 'red' : 'none'} hoverEffect={false}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-900 pb-5">
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded">
              {mission.category} mission
            </span>
            <h1 className="text-xl font-extrabold text-white mt-2 font-outfit">{mission.title}</h1>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">{mission.description}</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
            <span className={`text-[9px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded ${
              mission.health === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/10' :
              mission.health === 'At Risk' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10' :
              'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
            }`}>
              {mission.health}
            </span>
            <span className="text-[9px] font-mono text-zinc-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-zinc-600" /> Due: {mission.deadline}
            </span>
          </div>
        </div>

        {/* Detailed stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-[#08080a] border border-zinc-900 rounded-xl p-3.5">
            <p className="text-[8px] text-zinc-500 uppercase">Estimated Effort</p>
            <p className="font-bold text-white mt-1 text-sm">{mission.estimatedEffort}</p>
          </div>
          <div className="bg-[#08080a] border border-zinc-900 rounded-xl p-3.5">
            <p className="text-[8px] text-zinc-500 uppercase">Priority Level</p>
            <p className="font-bold text-white mt-1 text-sm">{mission.priority}</p>
          </div>
          <div className="bg-[#08080a] border border-zinc-900 rounded-xl p-3.5 col-span-2">
            <p className="text-[8px] text-zinc-500 uppercase">Success Criteria</p>
            <p className="text-zinc-300 font-medium mt-1 truncate">{mission.successCriteria || 'Not defined'}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] font-mono">
            <span className="text-zinc-500">Milestone Progress</span>
            <span className="text-blue-400 font-bold">{mission.progress}%</span>
          </div>
          <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                mission.health === 'Critical' ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${mission.progress}%` }}
            />
          </div>
        </div>

      </GlassCard>

      {/* Navigation tabs */}
      <div className="border-b border-zinc-900 flex gap-6 text-xs font-mono font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('milestones')}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'milestones' ? 'border-blue-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Tactical Milestones ({mission.milestones.length})
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'roadmap' ? 'border-blue-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Weekly Roadmap
        </button>
        
        {mission.category !== 'general' && (
          <button
            onClick={() => {
              setActiveTab('hub');
              setHubSubTab('default');
            }}
            className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'hub' ? 'border-blue-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {mission.category === 'academic' && 'Student Hub'}
            {mission.category === 'hackathon' && 'Hackathon Hub'}
            {mission.category === 'placement' && 'Placement Hub'}
          </button>
        )}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'milestones' && (
          <div className="space-y-4">
            {mission.milestones.map((ms) => (
              <GlassCard 
                key={ms.id} 
                className="py-4 px-6 flex items-center justify-between gap-6 hover:border-zinc-800 transition-colors animate-in fade-in duration-200"
                hoverEffect={false}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleMilestone(mission.id, ms.id)}
                    className="mt-0.5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {ms.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-700" />
                    )}
                  </button>
                  <div className="space-y-1">
                    <h3 className={`text-sm font-bold transition-all ${
                      ms.completed ? 'text-zinc-600 line-through' : 'text-white'
                    }`}>
                      {ms.title}
                    </h3>
                    <p className="text-xs text-zinc-500 font-light">{ms.description}</p>
                    <span className="inline-block text-[8px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-900 px-2 py-0.5 rounded">
                      Effort: {ms.estimatedHours} hours
                    </span>
                  </div>
                </div>

                {/* Focus trigger */}
                {!ms.completed && (
                  <button
                    onClick={() => {
                      startFocusSession(mission.id, ms.id, ms.title);
                      router.push('/focus');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-semibold cursor-pointer"
                  >
                    <Timer className="w-4 h-4 text-blue-400" />
                    <span>Focus</span>
                  </button>
                )}
              </GlassCard>
            ))}
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            {mission.roadmap && mission.roadmap.length > 0 ? (
              mission.roadmap.map((week) => (
                <GlassCard key={week.weekNumber} className="space-y-4" hoverEffect={false}>
                  <div className="flex items-center gap-3 border-b border-zinc-900 pb-2">
                    <span className="text-[8px] font-mono font-bold bg-blue-950/20 text-blue-400 px-2.5 py-0.5 rounded border border-blue-500/10">
                      WEEK {week.weekNumber}
                    </span>
                    <h3 className="text-xs font-bold text-white">{week.focus}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                    <div>
                      <p className="font-semibold text-blue-400 font-mono text-[8px] uppercase tracking-wider mb-2">Milestone Target</p>
                      <ul className="space-y-1.5 text-zinc-400 list-disc pl-4 font-light">
                        {week.milestones.map((m, idx) => <li key={idx}>{m}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-400 font-mono text-[8px] uppercase tracking-wider mb-2">Daily Subtasks</p>
                      <ul className="space-y-1.5 text-zinc-400 list-disc pl-4 font-light">
                        {week.tasks.map((t, idx) => <li key={idx}>{t}</li>)}
                      </ul>
                    </div>
                  </div>
                </GlassCard>
              ))
            ) : (
              <GlassCard className="text-center py-8" hoverEffect={false}>
                <p className="text-xs text-zinc-500">Roadmap is currently generating. Please refresh or create a new mission to trigger.</p>
              </GlassCard>
            )}
          </div>
        )}

        {activeTab === 'hub' && (
          <GlassCard className="space-y-4" hoverEffect={false}>
            {renderHubContent()}
          </GlassCard>
        )}
      </div>

    </div>
  );
}
