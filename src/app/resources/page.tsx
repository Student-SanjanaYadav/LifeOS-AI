'use client';

import React from 'react';
import { 
  FolderOpen, 
  ExternalLink, 
  Terminal, 
  BookOpen, 
  Code, 
  Award,
  Plus
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';

export default function ResourceLibraryPage() {
  const references = [
    { title: 'Neso Academy OS Playlist', type: 'Lecture Course', host: 'YouTube', category: 'Academic' },
    { title: 'Leetcode Pattern sliding window 150', type: 'DSA Cheat Sheet', host: 'LeetCode', category: 'Placement' },
    { title: 'Next.js App router start guides', type: 'Framework Doc', host: 'Vercel', category: 'Hackathon' }
  ];

  return (
    <div className="space-y-8 select-none font-sans max-w-5xl">
      
      {/* Header */}
      <div className="border-b border-zinc-950 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight font-outfit uppercase">Resource Library</h1>
          <p className="text-[10px] text-zinc-550 mt-1 font-mono uppercase tracking-wider">Deconstruct reference materials, cheat sheets, and syllabus guides</p>
        </div>
        
        <span className="text-[8px] font-mono text-zinc-650 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded uppercase">
          [RESOURCES.SYS]
        </span>
      </div>

      {/* Grid list of resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="md:col-span-2 space-y-4">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-950 pb-2">Active resources list</span>
          
          <div className="space-y-3">
            {references.map((ref, idx) => (
              <div 
                key={idx}
                className="p-4 bg-zinc-950/20 border border-zinc-900 rounded-lg flex items-center justify-between gap-4 text-xs font-sans hover:border-zinc-800 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-900 px-1.5 py-0.2 rounded uppercase">{ref.category}</span>
                    <p className="font-bold text-white text-sm">{ref.title}</p>
                  </div>
                  <p className="text-zinc-500 font-light">{ref.type} | Host: {ref.host}</p>
                </div>

                <a 
                  href="https://google.com" 
                  target="_blank"
                  className="p-2 rounded bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer group"
                >
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Categories checklist */}
        <div className="space-y-6">
          <GlassCard className="space-y-4 bg-zinc-950/20" hoverEffect={false}>
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-950 pb-2">Library Hubs</span>
            
            <div className="space-y-2 text-xs font-light text-zinc-400">
              <div className="p-2.5 bg-zinc-900/40 border border-zinc-900 rounded flex justify-between items-center">
                <span>Academic guides</span>
                <span className="text-[9px] font-mono text-zinc-650">3 Active</span>
              </div>
              <div className="p-2.5 bg-zinc-900/40 border border-zinc-900 rounded flex justify-between items-center">
                <span>Placement cheat sheets</span>
                <span className="text-[9px] font-mono text-zinc-650">4 Active</span>
              </div>
              <div className="p-2.5 bg-zinc-900/40 border border-zinc-900 rounded flex justify-between items-center">
                <span>Hackathon roadmaps</span>
                <span className="text-[9px] font-mono text-zinc-650">2 Active</span>
              </div>
            </div>
          </GlassCard>
        </div>

      </div>

    </div>
  );
}
