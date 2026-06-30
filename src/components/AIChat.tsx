'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { geminiService, AIChatMessage } from '@/services/gemini';
import { MessageSquare, X, Send, Sparkles, Loader2, Target, Calendar } from 'lucide-react';

export const AIChat = () => {
  const { user, missions } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      role: 'model',
      content: "Hello! I am your **LifeOS AI Rescue Copilot**. I have synced with your active missions. Ask me to reschedule plans, explain your success predictions, or generate a custom recovery plan!"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!user) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue;
    setInputValue('');
    
    // Add user message
    const updatedMessages = [...messages, { role: 'user' as const, content: userText }];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      // Send message to Gemini via client service (includes context of current missions)
      const reply = await geminiService.chat(updatedMessages, missions);
      setMessages([...updatedMessages, { role: 'model' as const, content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...updatedMessages,
        { 
          role: 'model' as const, 
          content: "Sorry, I ran into a communication latency error. Please ensure your backend config or mock connection is stable." 
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-[0_0_25px_rgba(99,102,241,0.5)] border border-indigo-400/20 hover:scale-105 active:scale-95 transition-transform duration-300 cursor-pointer group"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
          </span>
          <MessageSquare className="w-6 h-6 group-hover:rotate-6 transition-transform" />
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-[380px] h-[520px] rounded-2xl glass-panel flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10 animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-[0_0_12px_rgba(99,102,241,0.3)]">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Rescue Copilot</h3>
                <p className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Missions Context Linked
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Quick Context Chips */}
          {missions.length > 0 && (
            <div className="px-4 py-2 border-b border-white/5 bg-black/40 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider font-mono font-bold shrink-0">Missions:</span>
              {missions.map(m => (
                <div 
                  key={m.id}
                  className="flex items-center gap-1 shrink-0 bg-white/5 border border-white/5 rounded-full px-2 py-0.5 text-[10px] text-slate-300 font-medium"
                >
                  <Target className={`w-3 h-3 ${m.health === 'Critical' ? 'text-red-400' : 'text-indigo-400'}`} />
                  <span className="truncate max-w-[80px]">{m.title}</span>
                </div>
              ))}
            </div>
          )}

          {/* Messages List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar bg-black/20">
            {messages.map((msg, index) => {
              const isAI = msg.role === 'model';
              return (
                <div
                  key={index}
                  className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`
                      max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed
                      ${isAI 
                        ? 'bg-slate-900/80 text-slate-200 rounded-tl-sm border border-white/5' 
                        : 'bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white rounded-tr-sm shadow-md'
                      }
                    `}
                  >
                    {isAI ? (
                      <div className="space-y-1.5 prose-invert">
                        {/* Custom minimal Markdown rendering for highlights */}
                        {msg.content.split('\n').map((line, lIdx) => {
                          if (line.startsWith('### ')) {
                            return <h4 key={lIdx} className="font-bold text-sm text-white mt-2 mb-1">{line.replace('### ', '')}</h4>;
                          }
                          if (line.startsWith('- ')) {
                            return <li key={lIdx} className="ml-3 list-disc pl-0.5">{line.replace('- ', '')}</li>;
                          }
                          // Handle bold inline blocks **text**
                          const parts = line.split(/\*\*(.*?)\*\*/);
                          return (
                            <p key={lIdx} className="m-0">
                              {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-white font-semibold">{p}</strong> : p)}
                            </p>
                          );
                        })}
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* AI Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-900/80 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 text-slate-400 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span className="text-[10px] font-mono tracking-widest uppercase">Calculating response...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-white/5 bg-black/40 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask copilot to rescue plans..."
              className="flex-1 glass-input px-3.5 py-2 text-xs"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50 disabled:hover:bg-indigo-500 transition-colors shadow-lg cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
