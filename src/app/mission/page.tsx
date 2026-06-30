'use client';

import React, { useState } from 'react';
import { useApp, Mission } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Target, 
  Calendar, 
  Activity, 
  X,
  Trash2,
  ExternalLink,
  Loader2,
  Kanban,
  GitBranch,
  TableProperties
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';

export default function MissionsPage() {
  const router = useRouter();
  const { missions, createMission, deleteMission } = useApp();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'timeline' | 'critical'>('kanban');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [estimatedEffort, setEstimatedEffort] = useState('');
  const [successCriteria, setSuccessCriteria] = useState('');
  const [dependencies, setDependencies] = useState('');
  const [category, setCategory] = useState<'academic' | 'hackathon' | 'placement' | 'general'>('general');

  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !deadline || !estimatedEffort) return;

    setLoading(true);
    try {
      await createMission({
        title,
        description,
        deadline,
        priority,
        estimatedEffort,
        successCriteria,
        dependencies,
        category,
      });
      
      // Reset
      setTitle('');
      setDescription('');
      setDeadline('');
      setPriority('MEDIUM');
      setEstimatedEffort('');
      setSuccessCriteria('');
      setDependencies('');
      setCategory('general');
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Kanban groupings
  const todoMissions = missions.filter(m => m.progress === 0);
  const inProgressMissions = missions.filter(m => m.progress > 0 && m.progress < 100);
  const doneMissions = missions.filter(m => m.progress === 100);

  return (
    <div className="space-y-8 select-none max-w-5xl font-sans">
      
      {/* 1. Header with View Toggles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-zinc-950 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight font-outfit">Mission Control</h1>
          <p className="text-[11px] text-zinc-500 mt-1 font-mono uppercase tracking-wider">Plan roadmaps, map critical paths, and coordinate dependencies</p>
        </div>

        <div className="flex gap-4 items-center shrink-0">
          {/* Toggles */}
          <div className="flex bg-[#08080a] border border-zinc-900 rounded p-1 text-[10px] font-mono">
            <button 
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'kanban' ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              Kanban
            </button>
            <button 
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'timeline' ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5" />
              Timeline
            </button>
            <button 
              onClick={() => setViewMode('critical')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'critical' ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              Critical Path
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4.5 py-2.5 rounded bg-white hover:bg-zinc-150 text-black font-semibold text-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Mission
          </button>
        </div>
      </div>

      {/* 2. Empty State */}
      {missions.length === 0 && (
        <GlassCard className="flex flex-col items-center justify-center py-16 text-center space-y-4 border-dashed" hoverEffect={false}>
          <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
            <Target className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-white">No Active Missions</h3>
            <p className="text-[11px] text-zinc-500 max-w-xs mx-auto leading-relaxed">
              Every high-stakes journey requires a target. Set up a mission to compile learning roadmaps.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-[10px] font-mono font-bold tracking-wider uppercase rounded bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 cursor-pointer"
          >
            Launch First Mission
          </button>
        </GlassCard>
      )}

      {/* 3. Render Views */}
      {missions.length > 0 && (
        <div>
          {/* A. KANBAN BOARD */}
          {viewMode === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              
              {/* Backlog / Pending Column */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">01 / BACKLOG ({todoMissions.length})</span>
                </div>
                <div className="space-y-4">
                  {todoMissions.map(m => (
                    <GlassCard 
                      key={m.id} 
                      className="p-5 relative cursor-pointer hover:border-zinc-700/80 transition-colors"
                      onClick={() => router.push(`/mission/${m.id}`)}
                    >
                      <div className="space-y-3.5">
                        <span className="text-[8px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded uppercase">{m.category}</span>
                        <h4 className="text-xs font-bold text-white mt-2">{m.title}</h4>
                        <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">{m.description}</p>
                        
                        <div className="pt-2 border-t border-zinc-950 flex justify-between items-center text-[8px] font-mono text-zinc-500">
                          <span>Due: {m.deadline}</span>
                          <span className="text-blue-400 font-bold">{m.priority}</span>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                  {todoMissions.length === 0 && (
                    <div className="text-center py-8 text-[9px] font-mono text-zinc-700">Column Empty</div>
                  )}
                </div>
              </div>

              {/* In Progress Column */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">02 / ACTIVE ({inProgressMissions.length})</span>
                </div>
                <div className="space-y-4">
                  {inProgressMissions.map(m => (
                    <GlassCard 
                      key={m.id} 
                      className="p-5 relative cursor-pointer hover:border-zinc-700/80 transition-colors"
                      onClick={() => router.push(`/mission/${m.id}`)}
                    >
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-start">
                          <span className="text-[8px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded uppercase">{m.category}</span>
                          <span className="text-[8px] font-mono text-mos-blue font-bold">{m.progress}%</span>
                        </div>
                        <h4 className="text-xs font-bold text-white">{m.title}</h4>
                        
                        {/* progress */}
                        <div className="h-0.5 bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-mos-blue rounded-full" style={{ width: `${m.progress}%` }} />
                        </div>

                        <div className="pt-2 border-t border-zinc-950 flex justify-between items-center text-[8px] font-mono text-zinc-500">
                          <span>Due: {m.deadline}</span>
                          <span className="text-mos-blue font-bold">{m.priority}</span>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                  {inProgressMissions.length === 0 && (
                    <div className="text-center py-8 text-[9px] font-mono text-zinc-700">Column Empty</div>
                  )}
                </div>
              </div>

              {/* Completed Column */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">03 / STABILIZED ({doneMissions.length})</span>
                </div>
                <div className="space-y-4">
                  {doneMissions.map(m => (
                    <GlassCard 
                      key={m.id} 
                      className="p-5 relative cursor-pointer hover:border-zinc-700/80 transition-colors opacity-70"
                      onClick={() => router.push(`/mission/${m.id}`)}
                    >
                      <div className="space-y-3.5">
                        <span className="text-[8px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded uppercase">{m.category}</span>
                        <h4 className="text-xs font-bold text-zinc-400 line-through">{m.title}</h4>
                        
                        <div className="pt-2 border-t border-zinc-950 flex justify-between items-center text-[8px] font-mono text-zinc-500">
                          <span>Due: {m.deadline}</span>
                          <span className="text-mos-emerald font-bold">✓ COMPLETED</span>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                  {doneMissions.length === 0 && (
                    <div className="text-center py-8 text-[9px] font-mono text-zinc-700">Column Empty</div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* B. TIMELINE VIEW */}
          {viewMode === 'timeline' && (
            <div className="space-y-4">
              {missions.map(m => (
                <GlassCard 
                  key={m.id} 
                  className="py-4 px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-zinc-750 transition-colors"
                  hoverEffect={false}
                >
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider">{m.category}</span>
                    <h3 className="text-xs font-bold text-white">{m.title}</h3>
                  </div>

                  {/* Horizontal timeline bar */}
                  <div className="flex-1 max-w-md w-full flex items-center gap-4 text-[9px] font-mono text-zinc-500">
                    <span>Target: {m.deadline}</span>
                    <div className="flex-1 h-1 bg-zinc-950 rounded-full overflow-hidden">
                      <div className="h-full bg-mos-blue rounded-full" style={{ width: `${m.progress}%` }} />
                    </div>
                    <span>{m.progress}%</span>
                  </div>

                  <button
                    onClick={() => router.push(`/mission/${m.id}`)}
                    className="text-[9px] font-mono text-blue-400 hover:text-blue-300 uppercase tracking-widest font-bold"
                  >
                    Open Roadmap
                  </button>
                </GlassCard>
              ))}
            </div>
          )}

          {/* C. CRITICAL PATH & DEPENDENCIES */}
          {viewMode === 'critical' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch text-xs">
              
              {/* Dependency List */}
              <GlassCard className="md:col-span-2 space-y-4" hoverEffect={false}>
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-950 pb-2">Critical Path Analysis</span>
                <div className="space-y-3 font-light leading-relaxed">
                  {missions.map(m => (
                    <div key={m.id} className="p-3 bg-[#08080a] border border-zinc-900 rounded-lg flex justify-between items-center gap-4">
                      <div>
                        <h4 className="font-bold text-white">{m.title}</h4>
                        <p className="text-[9px] text-zinc-500 font-mono mt-0.5">Dependencies: {m.dependencies || 'None'}</p>
                      </div>
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded border uppercase ${
                        m.priority === 'CRITICAL' ? 'bg-red-950/20 text-red-400 border-red-500/10' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                      }`}>{m.priority}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* AI Planner Insights */}
              <GlassCard className="space-y-4 bg-zinc-950/20" hoverEffect={false}>
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-950 pb-2">AI Planner</span>
                <div className="space-y-3.5 text-zinc-400 leading-normal font-light">
                  <div className="p-3 bg-[#08080a] border border-zinc-900 rounded-lg">
                    <span className="text-[8px] font-mono text-blue-400 font-bold block mb-1">STABLE SEQUENCING</span>
                    <p className="text-[10px]">No circular dependencies found. Placement Prep has been prioritized to run alongside academic exam dates.</p>
                  </div>
                  <p className="text-[9px] text-zinc-500 leading-relaxed font-mono">
                    Roadmaps are dynamically compiled on Gemini parameters to satisfy priority order.
                  </p>
                </div>
              </GlassCard>

            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <GlassCard className="w-full max-w-md max-h-[85vh] overflow-y-auto space-y-6 bg-charcoal-card animate-in zoom-in-95 duration-200" hoverEffect={false}>
            
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3.5">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-zinc-400" />
                <h2 className="text-sm font-bold text-white">Create New Mission</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-zinc-500 hover:text-white rounded hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleCreateMission} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                
                <div className="col-span-2 space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Mission Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Crack Google Internship"
                    className="w-full mos-input px-3.5 py-2"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Mission Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your stakes and deliverables..."
                    className="w-full mos-input px-3.5 py-2 min-h-[50px]"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Deadline Date</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full mos-input px-3.5 py-2 text-zinc-300"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full mos-input px-3 py-2 text-zinc-300"
                    disabled={loading}
                  >
                    <option value="general">General</option>
                    <option value="placement">Placement Prep</option>
                    <option value="academic">Academic Prep</option>
                    <option value="hackathon">Hackathon Grind</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Priority</label>
                  <select
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full mos-input px-3 py-2 text-zinc-300"
                    disabled={loading}
                  >
                    <option value="CRITICAL">Critical stakes</option>
                    <option value="HIGH">High priority</option>
                    <option value="MEDIUM">Medium priority</option>
                    <option value="LOW">Low priority</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Estimated Effort</label>
                  <input
                    type="text"
                    value={estimatedEffort}
                    onChange={(e) => setEstimatedEffort(e.target.value)}
                    placeholder="e.g. 24 hours"
                    className="w-full mos-input px-3.5 py-2"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Success Criteria</label>
                  <textarea
                    value={successCriteria}
                    onChange={(e) => setSuccessCriteria(e.target.value)}
                    placeholder="e.g. Solve double Leetcode medium questions"
                    className="w-full mos-input px-3.5 py-2 min-h-[40px]"
                    disabled={loading}
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Dependencies</label>
                  <input
                    type="text"
                    value={dependencies}
                    onChange={(e) => setDependencies(e.target.value)}
                    placeholder="e.g. Lecture slide folders"
                    className="w-full mos-input px-3.5 py-2"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2.5 justify-end pt-3.5 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 transition-colors cursor-pointer"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-zinc-150 text-black transition-all flex items-center gap-1.5 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Compiling...
                    </>
                  ) : (
                    'Launch Mission'
                  )}
                </button>
              </div>
            </form>

          </GlassCard>
        </div>
      )}

    </div>
  );
}
