'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, User, Loader2, ShieldAlert } from 'lucide-react';
import { isFirebaseConfigured } from '@/services/firebase';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, register, loginMock } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === 'register' && !name)) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    setErrorMsg('');
    setAuthLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleMockLogin = () => {
    setErrorMsg('');
    loginMock();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#070709] flex items-center justify-center p-6 relative select-none font-sans">
      
      {/* Background radial gradient */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-zinc-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-sm mos-panel bg-mos-panel border border-[#1a1a1f] rounded-lg overflow-hidden flex flex-col justify-between">
        
        {/* Window title bar */}
        <div className="px-4 py-3 bg-[#0d0d11] border-b border-[#15151a] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="mac-dot mac-dot-red" />
            <div className="mac-dot mac-dot-yellow" />
            <div className="mac-dot mac-dot-green" />
          </div>
          <span className="text-[9px] font-mono text-zinc-500 font-medium">pilot_auth.mos</span>
          <span className="text-[7px] font-mono text-zinc-600 font-bold bg-[#040405] px-1.5 py-0.5 rounded border border-zinc-900">
            [SYS.SEC]
          </span>
        </div>

        {/* Window Body */}
        <div className="p-6 space-y-5">
          
          <div className="text-center space-y-2">
            <div className="w-7 h-7 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-zinc-100" />
            </div>
            <h2 className="text-xs font-bold text-white tracking-tight font-outfit uppercase">LifeOS Command Center</h2>
            <p className="text-[10px] text-zinc-500 max-w-[240px] mx-auto leading-relaxed font-light">
              Enter your credentials to access active schedules.
            </p>
          </div>

          {/* Warning banner */}
          {!isFirebaseConfigured && (
            <div className="bg-amber-500/5 border border-amber-500/10 border-t-amber-500/25 rounded p-3 flex gap-2.5 items-start">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[9px]">
                <p className="font-bold text-amber-300 font-mono uppercase">DEMO FALLBACK</p>
                <p className="text-zinc-500 mt-0.5 leading-normal">Cloud services database is currently mock fallback. Session will save client-side.</p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/10 text-[10px] px-3.5 py-2.5 rounded font-mono text-red-400">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                    <User className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Commander Pilot"
                    className="w-full mos-input pl-9 pr-3.5 py-2"
                    disabled={authLoading}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                  <Mail className="w-3.5 h-3.5" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pilot@lifeos.ai"
                  className="w-full mos-input pl-9 pr-3.5 py-2"
                  disabled={authLoading}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                  <Lock className="w-3.5 h-3.5" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full mos-input pl-9 pr-3.5 py-2"
                  disabled={authLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 rounded bg-white hover:bg-zinc-100 text-black font-bold text-[10px] font-mono tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm mt-2"
            >
              {authLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : mode === 'login' ? (
                'Access cockpit'
              ) : (
                'Create Profile'
              )}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-[9px] text-zinc-500 hover:text-white transition-colors cursor-pointer"
              disabled={authLoading}
            >
              {mode === 'login' ? "Need a pilot profile? Register" : "Already registered? Sign In"}
            </button>
          </div>

          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-zinc-900"></div>
            <span className="flex-shrink mx-4 text-[8px] font-mono text-zinc-600 uppercase">Or bypass credentials</span>
            <div className="flex-grow border-t border-zinc-900"></div>
          </div>

          <button
            onClick={handleMockLogin}
            type="button"
            className="w-full py-2.5 rounded bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white font-mono text-[9px] border border-zinc-800 transition-all cursor-pointer"
          >
            ⚡ Instant Demo Login
          </button>

        </div>

      </div>

    </div>
  );
}
