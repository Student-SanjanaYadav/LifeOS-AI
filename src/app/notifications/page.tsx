'use client';

import React from 'react';
import { 
  Bell, 
  ShieldAlert, 
  Clock, 
  Terminal, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';

export default function NotificationsPage() {
  const alerts = [
    { title: 'Timeline safe threshold breached', desc: 'Active critical milestones have deficit buffers. Decompress advised.', type: 'danger', time: '10 mins ago' },
    { title: 'AI command executed successfully', desc: 'Postponed Database Semester Lab. Rebuilt DSA timeline.', type: 'info', time: '1 hour ago' },
    { title: 'Focus target achieved', desc: 'Locked 25 mins CPU scheduling algorithms focus block.', type: 'success', time: '4 hours ago' }
  ];

  return (
    <div className="space-y-8 select-none font-sans max-w-5xl">
      
      {/* Header */}
      <div className="border-b border-zinc-950 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight font-outfit uppercase">Notifications</h1>
          <p className="text-[10px] text-zinc-550 mt-1 font-mono uppercase tracking-wider">Monitor system alarms, focus completions, and AI routines logs</p>
        </div>
        
        <span className="text-[8px] font-mono text-zinc-650 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded uppercase">
          [NOTIFICATIONS.SYS]
        </span>
      </div>

      {/* Lists */}
      <div className="space-y-4 max-w-3xl">
        {alerts.map((al, idx) => (
          <GlassCard 
            key={idx} 
            className="p-4 flex items-start gap-4 hover:border-zinc-850 transition-colors"
            hoverEffect={false}
          >
            <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
              al.type === 'danger' ? 'bg-red-950/20 text-red-400 border border-red-500/10' :
              al.type === 'success' ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/10' :
              'bg-blue-950/20 text-blue-400 border border-blue-500/10'
            }`}>
              {al.type === 'danger' ? <ShieldAlert className="w-4 h-4" /> :
               al.type === 'success' ? <CheckCircle className="w-4 h-4" /> :
               <Terminal className="w-4 h-4" />}
            </div>

            <div className="space-y-1 flex-1 text-xs">
              <div className="flex justify-between items-center">
                <p className="font-bold text-white text-sm">{al.title}</p>
                <span className="text-[8px] font-mono text-zinc-600">{al.time}</span>
              </div>
              <p className="text-zinc-500 font-light leading-relaxed">{al.desc}</p>
            </div>
          </GlassCard>
        ))}
      </div>

    </div>
  );
}
