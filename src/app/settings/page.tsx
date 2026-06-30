'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Key, 
  Sliders, 
  Database, 
  CheckCircle,
  Loader2,
  Info
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { isFirebaseConfigured } from '@/services/firebase';

export default function SettingsPage() {
  const { settings, updateSettings, user } = useApp();

  const [geminiKey, setGeminiKey] = useState('');
  const [targetHours, setTargetHours] = useState(settings.targetDailyFocusHours);
  const [academicStyle, setAcademicStyle] = useState(settings.academicPrepStyle);
  const [hackathonStyle, setHackathonStyle] = useState(settings.hackathonScopeStyle);
  const [placementStyle, setPlacementStyle] = useState(settings.placementPrepStyle);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load local gemini key if configured in localStorage
  useEffect(() => {
    const key = localStorage.getItem('lifeos_local_gemini_key') || '';
    setGeminiKey(key);
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveSuccess(false);

    setTimeout(() => {
      // Save key locally
      if (geminiKey.trim()) {
        localStorage.setItem('lifeos_local_gemini_key', geminiKey.trim());
      } else {
        localStorage.removeItem('lifeos_local_gemini_key');
      }

      // Update global context settings
      updateSettings({
        geminiKeyConfigured: !!geminiKey.trim(),
        targetDailyFocusHours: targetHours,
        academicPrepStyle: academicStyle,
        hackathonScopeStyle: hackathonStyle,
        placementPrepStyle: placementStyle,
      });

      setSaveLoading(false);
      setSaveSuccess(true);
      
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="space-y-8 select-none max-w-5xl font-sans">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-outfit">Settings</h1>
        <p className="text-xs text-zinc-500 mt-1">Configure Gemini overrides, target study hours, and copilot styling rules.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* API Credentials Card */}
        <div className="md:col-span-2 space-y-6">
          
          <GlassCard className="space-y-6 bg-charcoal-card" hoverEffect={false}>
            <div className="border-b border-zinc-900 pb-2.5 flex items-center gap-2 text-zinc-400">
              <Key className="w-4.5 h-4.5" />
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Gemini API Configuration</span>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-zinc-400 leading-relaxed font-light">
                LifeOS AI uses Google Gemini to generate milestoning deconstructions and chats. Supply your own API key to override server credentials locally.
              </p>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Gemini API Key</label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder={geminiKey ? "••••••••••••••••••••••••" : "AIzaSy..."}
                  className="w-full mos-input px-3.5 py-2.5 text-zinc-300"
                />
              </div>

              <div className="flex gap-2.5 items-start bg-[#08080a] border border-zinc-900 rounded-lg p-3.5 text-zinc-500">
                <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <p className="text-[10px] leading-relaxed">
                  Keys are saved client-side inside your local browser storage. They are never written to secondary cloud databases.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Copilot preferences */}
          <GlassCard className="space-y-6 bg-charcoal-card" hoverEffect={false}>
            <div className="border-b border-zinc-900 pb-2.5 flex items-center gap-2 text-zinc-400">
              <Sliders className="w-4.5 h-4.5" />
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Target Focus & Copilot Defaults</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              
              {/* Daily hours */}
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                  <span>Daily Study Target</span>
                  <span className="text-blue-400 font-bold font-mono">{targetHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="12"
                  value={targetHours}
                  onChange={(e) => setTargetHours(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Academic style */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">Academic Prep Style</label>
                <select
                  value={academicStyle}
                  onChange={(e: any) => setAcademicStyle(e.target.value)}
                  className="w-full mos-input px-3 py-2 text-zinc-300"
                >
                  <option value="revision">Syllabus revision sheets</option>
                  <option value="notes">Lectures summary reading</option>
                  <option value="cheat_sheets">Formulas cheat sheets</option>
                </select>
              </div>

              {/* Hackathon style */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">Hackathon Scope Standard</label>
                <select
                  value={hackathonStyle}
                  onChange={(e: any) => setHackathonStyle(e.target.value)}
                  className="w-full mos-input px-3 py-2 text-zinc-300"
                >
                  <option value="mvp_only">MVP deliverables only (Aggressive)</option>
                  <option value="standard">Standard feature releases (Balanced)</option>
                </select>
              </div>

              {/* Placement style */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">Placement DSA Target</label>
                <select
                  value={placementStyle}
                  onChange={(e: any) => setPlacementStyle(e.target.value)}
                  className="w-full mos-input px-3 py-2 text-zinc-300"
                >
                  <option value="dsa_heavy">Dynamic programming / Graph heavy</option>
                  <option value="mock_interviews">Behavioral mock grills focus</option>
                </select>
              </div>

            </div>

            {/* Save Button */}
            <div className="flex gap-3 justify-end items-center pt-4 border-t border-zinc-900">
              {saveSuccess && (
                <span className="text-emerald-400 font-mono text-[9px] uppercase font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Settings Committed
                </span>
              )}
              
              <button
                type="submit"
                className="px-4 py-2.5 rounded-lg bg-white hover:bg-zinc-100 text-black font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
                disabled={saveLoading}
              >
                {saveLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Commit Settings'
                )}
              </button>
            </div>

          </GlassCard>

        </div>

        {/* Integration Status Column */}
        <div className="space-y-6">
          
          <GlassCard className="space-y-4 bg-charcoal-card" hoverEffect={false}>
            <div className="border-b border-zinc-900 pb-2.5 flex items-center gap-2 text-zinc-400">
              <Database className="w-4.5 h-4.5" />
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Infrastructure Monitor</span>
            </div>

            <div className="space-y-4 text-[10px] font-mono leading-relaxed">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                <span className="text-zinc-500">Firebase Core:</span>
                <span className={`font-bold px-2 py-0.5 rounded ${
                  isFirebaseConfigured ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {isFirebaseConfigured ? 'CONNECTED' : 'LOCAL MOCK'}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                <span className="text-zinc-500">Firestore Sync:</span>
                <span className={`font-bold px-2 py-0.5 rounded ${
                  isFirebaseConfigured && user && !user.isMock ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {isFirebaseConfigured && user && !user.isMock ? 'ACTIVE' : 'LOCALSTORAGE'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Gemini Servers:</span>
                <span className={`font-bold px-2 py-0.5 rounded ${
                  settings.geminiKeyConfigured || process.env.NEXT_PUBLIC_GEMINI_API_KEY ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {settings.geminiKeyConfigured || process.env.NEXT_PUBLIC_GEMINI_API_KEY ? 'LIVE API' : 'MOCK BACKUP'}
                </span>
              </div>
            </div>
          </GlassCard>

        </div>

      </form>

    </div>
  );
}
