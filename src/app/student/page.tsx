'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Layers, 
  FileText, 
  HelpCircle, 
  Plus, 
  Award,
  CheckCircle,
  HelpCircle as HelpIcon
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';

export default function StudentHubPage() {
  const [activeSubTab, setActiveSubTab] = useState<'planner' | 'revision' | 'flashcards' | 'notes'>('planner');

  // Interactive Assignments State
  const [assignments, setAssignments] = useState([
    { id: 1, title: 'Computer Networks Lab 05', status: 'Pending', due: 'Tomorrow' },
    { id: 2, title: 'DBMS Normalization Assignment', status: 'Completed', due: 'Completed' },
    { id: 3, title: 'OS Thread Mutex Implementation', status: 'Pending', due: 'July 5' }
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newDue, setNewDue] = useState('Tomorrow');

  const addAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAssignments([
      ...assignments,
      { id: Date.now(), title: newTitle, status: 'Pending', due: newDue }
    ]);
    setNewTitle('');
  };

  const toggleAssignmentStatus = (id: number) => {
    setAssignments(assignments.map(as => 
      as.id === id ? { ...as, status: as.status === 'Completed' ? 'Pending' : 'Completed' } : as
    ));
  };

  // Interactive Syllabus State
  const [syllabusItems, setSyllabusItems] = useState([
    { id: 1, topic: 'CPU scheduling & Deadlocks', subject: 'OS', done: true },
    { id: 2, topic: 'Virtual Memory Paging & TLB', subject: 'OS', done: false },
    { id: 3, topic: 'Relational Database Normalizations (1NF-BCNF)', subject: 'DBMS', done: true },
    { id: 4, topic: 'Transaction Isolation levels & Locking Protocols', subject: 'DBMS', done: false }
  ]);

  const toggleSyllabus = (id: number) => {
    setSyllabusItems(syllabusItems.map(item => 
      item.id === id ? { ...item, done: !item.done } : item
    ));
  };

  const osDone = syllabusItems.filter(i => i.subject === 'OS' && i.done).length;
  const osTotal = syllabusItems.filter(i => i.subject === 'OS').length;
  const dbDone = syllabusItems.filter(i => i.subject === 'DBMS' && i.done).length;
  const dbTotal = syllabusItems.filter(i => i.subject === 'DBMS').length;

  // Interactive Flashcards State
  const [flashcards, setFlashcards] = useState([
    { id: 1, q: 'What causes Priority Inversion in CPU scheduling?', a: 'Occurs when a low-priority thread holds a shared lock required by a high-priority thread, while a medium thread preempts the low thread.', flipped: false },
    { id: 2, q: 'What is conflict serializability in DBMS schedules?', a: 'A schedule that is conflict equivalent to some serial schedule. Tested by drawing precedence graphs with no cycles.', flipped: false }
  ]);

  const flipCard = (id: number) => {
    setFlashcards(flashcards.map(f => f.id === id ? { ...f, flipped: !f.flipped } : f));
  };

  const exams = [
    { subject: 'Operating Systems (Theory)', date: 'July 8', weight: '40%' },
    { subject: 'DBMS Semester Exam', date: 'July 12', weight: '50%' }
  ];

  return (
    <div className="space-y-8 select-none font-sans max-w-5xl">
      
      {/* Header */}
      <div className="border-b border-zinc-950 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight font-outfit uppercase">Student Hub</h1>
          <p className="text-xs text-zinc-550 mt-1 font-mono uppercase tracking-wider">Configure study planners, revise syllabus sheets, and compile recall sets</p>
        </div>
        
        <span className="text-[10px] font-mono text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded uppercase font-bold">
          [ACADEMIC.SYS]
        </span>
      </div>

      {/* Sub Toggles */}
      <div className="flex bg-[#08080a] border border-zinc-200 rounded p-1 text-xs font-mono w-max">
        {[
          { id: 'planner', name: 'Planners & Exams' },
          { id: 'revision', name: 'Revision Tracker' },
          { id: 'flashcards', name: 'Flashcard Vault' },
          { id: 'notes', name: 'AI Notes & Study Roadmaps' }
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

      {/* Tab Panels */}
      <div>
        
        {/* A. Planners & Exams */}
        {activeSubTab === 'planner' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Assignment Planner */}
            <GlassCard className="space-y-4" hoverEffect={false}>
              <div className="border-b border-zinc-200 pb-2 flex justify-between items-center">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold">Assignment Planner</span>
                <span className="text-[10px] font-mono text-zinc-400">Click card status to toggle</span>
              </div>

              {/* Add form */}
              <form onSubmit={addAssignment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="New assignment title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="flex-1 mos-input px-3.5 py-2"
                />
                <select
                  value={newDue}
                  onChange={(e) => setNewDue(e.target.value)}
                  className="mos-input px-3 py-2 text-zinc-600"
                >
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="July 5">July 5</option>
                  <option value="July 10">July 10</option>
                </select>
                <button
                  type="submit"
                  className="px-3 py-2 rounded bg-zinc-900 text-white text-xs font-mono font-bold uppercase cursor-pointer"
                >
                  Add
                </button>
              </form>

              <div className="space-y-2.5">
                {assignments.map((as) => (
                  <button
                    key={as.id}
                    onClick={() => toggleAssignmentStatus(as.id)}
                    className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded flex justify-between items-center text-xs text-left cursor-pointer hover:bg-zinc-100 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-zinc-850">{as.title}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Due: {as.due}</p>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                      as.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-650 border-red-100'
                    }`}>{as.status}</span>
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Exam Planner */}
            <GlassCard className="space-y-4" hoverEffect={false}>
              <div className="border-b border-zinc-200 pb-2">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold">Exam Semester Planner</span>
              </div>

              <div className="space-y-2.5">
                {exams.map((ex, idx) => (
                  <div key={idx} className="p-3.5 bg-zinc-50 border border-zinc-200 rounded flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-zinc-850">{ex.subject}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Exam Date: {ex.date}</p>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">Weight: {ex.weight}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

          </div>
        )}

        {/* B. Revision Tracker */}
        {activeSubTab === 'revision' && (
          <div className="space-y-4">
            <GlassCard className="space-y-4" hoverEffect={false}>
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-200 pb-2">Revision Coverage Tracker</span>
              
              <div className="space-y-4 text-xs font-light">
                {/* OS Progress */}
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-2">
                  <div className="flex justify-between font-mono text-xs text-zinc-700">
                    <span className="font-bold">Operating Systems Theory</span>
                    <span className="text-emerald-650 font-bold">{Math.round((osDone / osTotal) * 100)}% Complete</span>
                  </div>
                  <div className="h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${(osDone / osTotal) * 100}%` }} />
                  </div>
                </div>

                {/* DBMS Progress */}
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-2">
                  <div className="flex justify-between font-mono text-xs text-zinc-700">
                    <span className="font-bold">Database Management Systems</span>
                    <span className="text-blue-650 font-bold">{Math.round((dbDone / dbTotal) * 100)}% Complete</span>
                  </div>
                  <div className="h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${(dbDone / dbTotal) * 100}%` }} />
                  </div>
                </div>

                {/* Topics Checkbox Grid */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold block">Syllabus Topic Nodes (Click to complete)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {syllabusItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => toggleSyllabus(item.id)}
                        className="p-3 bg-white border border-zinc-200 rounded-lg flex items-center justify-between text-xs text-left cursor-pointer hover:bg-zinc-50 transition-colors"
                      >
                        <div>
                          <span className="text-[9px] font-mono text-zinc-400 block">[{item.subject}]</span>
                          <span className={`font-semibold text-zinc-800 ${item.done ? 'line-through text-zinc-400' : ''}`}>{item.topic}</span>
                        </div>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                          item.done ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-zinc-100 text-zinc-400 border-zinc-200'
                        }`}>
                          {item.done ? 'DONE' : 'PENDING'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </GlassCard>
          </div>
        )}

        {/* C. Flashcard Vault */}
        {activeSubTab === 'flashcards' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {flashcards.map(f => (
              <button
                key={f.id}
                onClick={() => flipCard(f.id)}
                className="w-full text-left focus:outline-none"
              >
                <GlassCard className="p-6 bg-white flex flex-col justify-between min-h-[170px] shadow-md border-t-4 border-t-zinc-400 cursor-pointer hover:border-t-blue-500 transition-all text-center space-y-3.5" hoverEffect={true}>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">Flashcard Vault (Click to flip)</span>
                  
                  {f.flipped ? (
                    <p className="text-xs text-zinc-650 leading-relaxed font-light animate-in fade-in duration-200">
                      <span className="font-bold text-emerald-600 block mb-1">ANSWER:</span>
                      {f.a}
                    </p>
                  ) : (
                    <p className="text-sm font-bold text-zinc-800 py-2 animate-in fade-in duration-200">
                      {f.q}
                    </p>
                  )}

                  <span className="text-[8px] font-mono text-zinc-400 block uppercase">
                    {f.flipped ? 'Showing Answer' : 'Click to Flip'}
                  </span>
                </GlassCard>
              </button>
            ))}
          </div>
        )}

        {/* D. AI Notes & Study Roadmaps */}
        {activeSubTab === 'notes' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* AI Notes */}
            <div className="md:col-span-2 space-y-4">
              <GlassCard className="space-y-4" hoverEffect={false}>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-200 pb-2">AI Generated Notes</span>
                
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-3 font-mono text-xs text-zinc-700 leading-relaxed">
                  <span className="text-zinc-900 font-bold block">Subject: Database Transaction Isolation levels</span>
                  <p>1. Read Uncommitted: Dirty reads possible.</p>
                  <p>2. Read Committed: Prevents dirty reads. Non-repeatable reads possible.</p>
                  <p>3. Repeatable Read: Prevents non-repeatable reads. Phantom reads possible.</p>
                  <p>4. Serializable: Full lock isolation.</p>
                </div>
              </GlassCard>
            </div>

            {/* Study Roadmaps */}
            <GlassCard className="space-y-4 bg-white" hoverEffect={false}>
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-200 pb-2">Study Roadmaps</span>
              <div className="space-y-2 text-xs font-light text-zinc-650 leading-relaxed">
                <p className="font-semibold text-zinc-800">OS Exam 5-Day Plan:</p>
                <p>• Day 1: Threading, concurrency, locks</p>
                <p>• Day 2: Process schedulers, priority inversions</p>
                <p>• Day 3: Virtual Memory paging, TLB</p>
                <p>• Day 4: File directory allocations, RAID</p>
              </div>
            </GlassCard>

          </div>
        )}

      </div>

    </div>
  );
}
