'use client';
import { useState } from 'react';

export default function CopilotChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-tr from-primary to-secondary rounded-full shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center justify-center text-background hover:scale-105 transition-transform z-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 w-96 h-[500px] bg-card/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden transform origin-bottom-right transition-all">
          <div className="h-14 border-b border-white/5 bg-surface/50 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <h3 className="font-heading font-semibold text-white">AI Copilot</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs shrink-0">AI</div>
              <div className="bg-surface border border-white/5 p-3 rounded-2xl rounded-tl-none text-sm text-gray-200">
                Hi! I'm your Audira Copilot. I can help you clip videos, generate subtitles, or find specific moments.
              </div>
            </div>
            <div className="flex gap-3 flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-xs shrink-0">AU</div>
              <div className="bg-primary/10 border border-primary/20 p-3 rounded-2xl rounded-tr-none text-sm text-gray-200">
                Create 10 clips from the Q3 Earnings podcast.
              </div>
            </div>
          </div>

          <div className="p-3 bg-surface/50 border-t border-white/5">
            <div className="flex items-center gap-2 bg-background border border-white/10 rounded-xl p-2 focus-within:border-primary/50 transition-colors">
              <input 
                type="text" 
                placeholder="Ask AI to edit, clip, or search..." 
                className="flex-1 bg-transparent border-none outline-none text-sm text-white px-2 placeholder:text-gray-600"
              />
              <button className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
