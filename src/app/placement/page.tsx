'use client';

import React, { useState } from 'react';
import { 
  Briefcase, 
  Terminal, 
  Award, 
  Calendar,
  CheckCircle,
  FileCheck,
  Building,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';

export default function PlacementHubPage() {
  const [activeSubTab, setActiveSubTab] = useState<'dsa' | 'resume' | 'company'>('dsa');

  // Interactive LeetCode Problems State
  const [dsaProblems, setDsaProblems] = useState([
    { id: 1, title: 'BFS / DFS Graph Traversals', difficulty: 'Medium', status: 'Completed' },
    { id: 2, title: 'Sliding Window Pattern: Longest Substring', difficulty: 'Medium', status: 'Completed' },
    { id: 3, title: 'Dynamic Programming: 0/1 Knapsack', difficulty: 'Hard', status: 'Pending' },
    { id: 4, title: 'Two Pointers: Valid Palindrome', difficulty: 'Easy', status: 'Pending' }
  ]);

  const toggleProblemStatus = (id: number) => {
    setDsaProblems(dsaProblems.map(p => 
      p.id === id ? { ...p, status: p.status === 'Completed' ? 'Pending' : 'Completed' } : p
    ));
  };

  const solvedProblemsCount = dsaProblems.filter(p => p.status === 'Completed').length;

  // Interactive Resume Point State
  const [resumeBullet, setResumeBullet] = useState('');
  const [bulletResult, setBulletResult] = useState<string | null>(null);

  const validateResumeBullet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeBullet.trim()) return;

    // Simple heuristic for Google X-Y-Z: must contain past tense (X), metric/percentage (Y), and "by" / "using" (Z)
    const hasMetric = /\d+%|\d+\s?x|factor of \d+|saved/i.test(resumeBullet);
    const hasAction = /by\s|using\s|through\s|via\s/i.test(resumeBullet);
    const hasVerb = /accomplished|developed|optimized|built|created|reduced|increased|led/i.test(resumeBullet);

    if (hasMetric && hasAction && hasVerb) {
      setBulletResult('✓ VALID: Follows the Google X-Y-Z formula perfectly! Action verb is clear, metrics are measurable, and tools are specified.');
    } else {
      let issues = [];
      if (!hasVerb) issues.push('missing an action verb (e.g. Optimized, Built)');
      if (!hasMetric) issues.push('missing a measurable outcome/metric (e.g. by 25%, saving 5 hours)');
      if (!hasAction) issues.push('missing the implementation detail (e.g. using, by implementing)');
      setBulletResult(`⚠ REWRITE NEEDED: Your bullet point is ${issues.join(', ')}.`);
    }
  };

  // Interactive Company Pipeline State
  const [companies, setCompanies] = useState([
    { id: 1, name: 'Google Placement Exam', date: 'Tomorrow', status: 'Critical' },
    { id: 2, name: 'Stripe Software Intern', date: 'July 5', status: 'Warning' },
    { id: 3, name: 'Linear Frontend Engineer', date: 'July 10', status: 'Stable' }
  ]);

  const advanceCompanyStatus = (id: number) => {
    setCompanies(companies.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'Critical' ? 'Warning' : c.status === 'Warning' ? 'Stable' : 'Critical';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-8 select-none font-sans max-w-5xl">
      
      {/* Header */}
      <div className="border-b border-zinc-950 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight font-outfit uppercase">Internship & Placement Hub</h1>
          <p className="text-xs text-zinc-555 mt-1 font-mono uppercase tracking-wider">Track resume configurations, prioritize LeetCode problems, and monitor company timelines</p>
        </div>
        
        <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded uppercase font-bold">
          [PLACEMENT.SYS]
        </span>
      </div>

      {/* Sub Toggles */}
      <div className="flex bg-[#08080a] border border-zinc-200 rounded p-1 text-xs font-mono w-max">
        {[
          { id: 'dsa', name: 'DSA Roadmap & Problems' },
          { id: 'resume', name: 'Resume X-Y-Z Grills' },
          { id: 'company', name: 'Application Pipeline' }
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
        
        {/* A. DSA Roadmap */}
        {activeSubTab === 'dsa' && (
          <div className="space-y-6">
            <GlassCard className="space-y-4" hoverEffect={false}>
              <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold">LeetCode Priority Tracker</span>
                <span className="text-xs font-mono font-bold text-emerald-600">Solved: {solvedProblemsCount} / {dsaProblems.length}</span>
              </div>

              <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${(solvedProblemsCount / dsaProblems.length) * 100}%` }} />
              </div>

              <div className="space-y-2.5">
                {dsaProblems.map((prob) => (
                  <button
                    key={prob.id}
                    onClick={() => toggleProblemStatus(prob.id)}
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded flex justify-between items-center text-xs text-left cursor-pointer hover:bg-zinc-100 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-zinc-850">{prob.title}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Difficulty: {prob.difficulty}</p>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                      prob.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-zinc-150 text-zinc-500 border-zinc-250'
                    }`}>{prob.status}</span>
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* B. Resume & Projects */}
        {activeSubTab === 'resume' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Resume Bullet Validator */}
            <GlassCard className="space-y-4" hoverEffect={false}>
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-200 pb-2">Google X-Y-Z Formula Checker</span>
              <p className="text-xs text-zinc-650 leading-relaxed font-light">
                Google recruiters prefer bullet points formulated as: <br />
                <span className="font-mono text-zinc-800 font-medium">"Accomplished [X], as measured by [Y], by doing [Z]."</span>
              </p>

              <form onSubmit={validateResumeBullet} className="space-y-3 pt-2">
                <textarea
                  placeholder="e.g. Optimized SQL queries by 35% using indexing hooks."
                  value={resumeBullet}
                  onChange={(e) => setResumeBullet(e.target.value)}
                  className="w-full mos-input p-3 min-h-[70px] text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded bg-zinc-900 text-white text-xs font-mono font-bold uppercase cursor-pointer"
                >
                  Verify Bullet Format
                </button>
              </form>

              {bulletResult && (
                <div className={`p-3.5 rounded-lg border text-xs leading-relaxed font-mono ${
                  bulletResult.startsWith('✓') 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                    : 'bg-amber-50 border-amber-100 text-amber-700'
                }`}>
                  {bulletResult}
                </div>
              )}
            </GlassCard>

            {/* Resume Checklist */}
            <GlassCard className="space-y-4 bg-white" hoverEffect={false}>
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-200 pb-2">Resume Structure rules</span>
              <ul className="space-y-2.5 text-xs font-light text-zinc-655 pl-4 list-disc leading-relaxed">
                <li>Prioritize technical projects with active live Vercel deployments.</li>
                <li>Add Github repository link to projects section headers.</li>
                <li>Remove high-school credentials to free page height buffers.</li>
              </ul>
            </GlassCard>

          </div>
        )}

        {/* C. Company Tracker */}
        {activeSubTab === 'company' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Applications List */}
            <div className="md:col-span-2 space-y-4">
              <GlassCard className="space-y-4" hoverEffect={false}>
                <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold">Active Applications</span>
                  <span className="text-[10px] text-zinc-400">Click card status to cycle priority</span>
                </div>
                
                <div className="space-y-2.5">
                  {companies.map((comp) => (
                    <button
                      key={comp.id}
                      onClick={() => advanceCompanyStatus(comp.id)}
                      className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded flex justify-between items-center text-xs text-left cursor-pointer hover:bg-zinc-100 transition-colors"
                    >
                      <div>
                        <p className="font-bold text-zinc-850">{comp.name}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-zinc-500" />
                          Due: {comp.date}
                        </p>
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                        comp.status === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' :
                        comp.status === 'Warning' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>{comp.status}</span>
                    </button>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Preparation Strategy */}
            <GlassCard className="space-y-4 bg-white" hoverEffect={false}>
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-200 pb-2">Career Strategy</span>
              <div className="text-xs text-zinc-650 leading-relaxed font-light space-y-2">
                <p className="font-bold text-zinc-800">Action Rules:</p>
                <p>• Prioritize sliding window patterns before interviews.</p>
                <p>• Lock 90 mins for graph cycle checks focus sessions.</p>
              </div>
            </GlassCard>

          </div>
        )}

      </div>

    </div>
  );
}
