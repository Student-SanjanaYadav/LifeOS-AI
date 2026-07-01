'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Sidebar } from '@/components/Sidebar';
import { AIChat } from '@/components/AIChat';
import { Loader2, Sparkles, Menu, X } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { loading } = useApp();
  const pathname = usePathname();

  // Sidebar mobile states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Login page should remain a clean centered card without sidebar
  const isLoginPage = pathname === '/login';
  const isLandingPage = pathname === '/';

  // Automatically close sidebar drawer when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (loading && !isLoginPage && !isLandingPage) {
    return (
      <div className="min-h-screen bg-[#f4f5f7] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] animate-pulse"></div>
        
        <div className="relative flex flex-col items-center gap-4 text-center">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 shadow-md animate-bounce">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-800 font-outfit uppercase tracking-tight">
              LifeOS AI
            </h2>
            <p className="text-[10px] text-zinc-550 font-mono tracking-widest mt-1">INITIALIZING COGNITIVE INTERVENE</p>
          </div>
          <Loader2 className="w-5 h-5 animate-spin text-blue-500 mt-2" />
        </div>
      </div>
    );
  }

  // Render sidebar layout for landing and all internal dashboards
  if (!isLoginPage) {
    return (
      <div className="flex flex-col md:flex-row h-screen w-screen bg-[#f4f5f7] overflow-hidden relative">
        
        {/* Mobile Header Bar */}
        <div className="md:hidden flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-[#f4f5f7] sticky top-0 z-40 w-full shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-650 cursor-pointer transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="font-extrabold text-sm tracking-tight text-zinc-900 font-outfit uppercase">LifeOS AI</span>
          </div>

          <div className="w-9 h-9" /> {/* Spacer */}
        </div>

        {/* Sidebar Drawer Container */}
        <div className={`
          fixed inset-y-0 left-0 z-50 md:sticky md:flex transform transition-transform duration-250 ease-in-out shrink-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          {/* Close button for mobile inside drawer */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-5 right-5 p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-600 md:hidden z-50 cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
          <Sidebar />
        </div>

        {/* Backdrop overlay drawer mask */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Workspace Frame */}
        <main className="flex-1 overflow-y-auto bg-[#f4f5f7] relative p-6 md:p-8">
          {children}
          <AIChat />
        </main>
      </div>
    );
  }

  // Pure fullscreen block for login path
  return (
    <div className="min-h-screen bg-[#f4f5f7] flex flex-col justify-center items-center">
      {children}
    </div>
  );
};
export default MainLayout;
