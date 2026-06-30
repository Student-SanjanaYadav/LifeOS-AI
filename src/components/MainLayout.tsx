'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Sidebar } from '@/components/Sidebar';
import { AIChat } from '@/components/AIChat';
import { Loader2, Sparkles } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { loading } = useApp();
  const pathname = usePathname();

  // Login page should remain a clean centered card without sidebar
  const isLoginPage = pathname === '/login';
  const isLandingPage = pathname === '/';

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
            <p className="text-[10px] text-zinc-500 font-mono tracking-widest mt-1">INITIALIZING COGNITIVE INTERVENE</p>
          </div>
          <Loader2 className="w-5 h-5 animate-spin text-blue-500 mt-2" />
        </div>
      </div>
    );
  }

  // Render sidebar layout for landing and all internal dashboards
  if (!isLoginPage) {
    return (
      <div className="flex h-screen w-screen bg-[#f4f5f7] overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[#f4f5f7] relative p-8">
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
