'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  LayoutDashboard, 
  Target, 
  ShieldAlert, 
  TrendingUp, 
  BarChart3,
  BrainCircuit,
  Timer,
  BookOpen,
  Code,
  Briefcase,
  Terminal,
  FolderOpen,
  Bell,
  User,
  Settings,
  Sparkles,
  ChevronRight,
  LogOut,
  LogIn
} from 'lucide-react';

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isRescueActive } = useApp();

  const sections = [
    {
      title: 'Cockpit',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Mission Manager', path: '/mission', icon: Target },
        { name: 'Rescue Center', path: '/rescue', icon: ShieldAlert, badge: isRescueActive ? 'ACTIVE' : null }
      ]
    },
    {
      title: 'Intelligence',
      items: [
        { name: 'Forecast', path: '/forecast', icon: TrendingUp },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
        { name: 'AI Command', path: '/ai-command', icon: Terminal }
      ]
    },
    {
      title: 'Domain Hubs',
      items: [
        { name: 'Student Hub', path: '/student', icon: BookOpen },
        { name: 'Hackathon Hub', path: '/hackathon', icon: Code },
        { name: 'Placement Hub', path: '/placement', icon: Briefcase }
      ]
    },
    {
      title: 'Execution',
      items: [
        { name: 'Focus Room', path: '/focus', icon: Timer },
        { name: 'Reflection Journal', path: '/reflection', icon: BrainCircuit },
        { name: 'Resource Library', path: '/resources', icon: FolderOpen }
      ]
    },
    {
      title: 'System',
      items: [
        { name: 'Notifications', path: '/notifications', icon: Bell },
        { name: 'Profile', path: '/profile', icon: User },
        { name: 'Settings', path: '/settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-64 border-r border-[rgba(0,0,0,0.04)] bg-[#f4f5f7] flex flex-col justify-between h-screen sticky top-0 z-30 shrink-0 select-none overflow-y-auto no-scrollbar">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-[rgba(0,0,0,0.02)] flex items-center justify-between sticky top-0 bg-[#f4f5f7] z-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-7 h-7 rounded bg-zinc-900 border border-zinc-800 shadow-md group-hover:border-zinc-700 transition-colors">
              <Sparkles className="w-3.5 h-3.5 text-zinc-100" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-zinc-900 font-outfit">
                LifeOS <span className="text-blue-500 font-medium">AI</span>
              </h1>
              <p className="text-[9px] text-zinc-550 font-mono tracking-widest uppercase">MISSION CONTROL</p>
            </div>
          </Link>
        </div>

        {/* Sections */}
        <div className="p-4 space-y-5">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1.5">
              <span className="text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-widest block px-3">
                {section.title}
              </span>
              <nav className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      className={`
                        flex items-center justify-between px-3 py-2 rounded transition-all duration-150 group text-xs
                        ${isActive 
                          ? 'bg-[rgba(0,0,0,0.03)] text-zinc-900 font-semibold border border-[rgba(0,0,0,0.05)]' 
                          : 'text-zinc-650 hover:text-zinc-900 hover:bg-[rgba(0,0,0,0.015)] border border-transparent'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-500' : 'text-zinc-400 group-hover:text-zinc-650'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge ? (
                        <span className="text-[8px] font-mono font-bold tracking-wider bg-red-955/20 text-red-500 border border-red-500/10 px-1.5 py-0.2 rounded">
                          {item.badge}
                        </span>
                      ) : (
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-zinc-400 transition-opacity" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-[rgba(0,0,0,0.02)] space-y-3 sticky bottom-0 bg-[#f4f5f7]">
        <div className="flex items-center gap-3 px-1.5 py-1">
          <div className="w-8.5 h-8.5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-zinc-300 font-mono text-xs shadow-inner">
            {(user?.displayName || user?.email || 'G').charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-zinc-900 truncate">{user?.displayName || 'Guest Pilot'}</p>
            <p className="text-[9px] text-zinc-550 truncate font-mono mt-0.5">{user?.email || 'guest@lifeos.ai'}</p>
          </div>
        </div>

        {user ? (
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-zinc-500 hover:text-red-500 hover:bg-red-500/5 transition-all text-xs border border-transparent hover:border-red-500/10 cursor-pointer group"
          >
            <LogOut className="w-3.5 h-3.5 text-zinc-500 group-hover:text-red-500 transition-colors" />
            <span>Sign Out</span>
          </button>
        ) : (
          <button
            onClick={() => router.push('/login')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-zinc-600 hover:text-blue-600 hover:bg-blue-500/5 transition-all text-xs border border-transparent hover:border-blue-500/10 cursor-pointer group"
          >
            <LogIn className="w-3.5 h-3.5 text-zinc-500 group-hover:text-blue-600 transition-colors" />
            <span>Sign In Pilot Node</span>
          </button>
        )}
      </div>
    </aside>
  );
};
