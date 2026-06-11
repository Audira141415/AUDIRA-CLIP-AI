'use client';

import { motion } from 'framer-motion';
import { Type, AlignLeft, AlignCenter, AlignRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

import DashboardLayout from "@/components/layout/DashboardLayout";

export default function SubtitleStudio() {
  const [activePreset, setActivePreset] = useState('hormozi');

  const presets = [
    { id: 'hormozi', name: 'Hormozi Style', desc: 'Bold, word-by-word reveal, yellow highlight' },
    { id: 'neon', name: 'Cyber Neon', desc: 'Glowing text, glitch effect on keywords' },
    { id: 'minimal', name: 'Minimalist', desc: 'Clean sans-serif, subtle fade in' },
    { id: 'gaming', name: 'Gaming Fast', desc: 'High impact, shake effect on shouting' },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-black flex font-body">
      
      {/* Settings Panel */}
      <aside className="w-96 bg-surface/50 border-r border-gray-800 p-6 overflow-y-auto hidden md:block backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-secondary/20 rounded-lg">
            <Type className="w-5 h-5 text-secondary" />
          </div>
          <h2 className="text-xl font-heading font-bold">Subtitle Studio</h2>
        </div>

        <div className="space-y-8">
          {/* Presets */}
          <div className="space-y-4">
            <h3 className="text-sm text-gray-400 font-bold uppercase tracking-wider">Style Presets</h3>
            <div className="grid gap-3">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setActivePreset(preset.id)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    activePreset === preset.id 
                      ? 'bg-secondary/10 border-secondary' 
                      : 'bg-surface border-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold">{preset.name}</span>
                    {activePreset === preset.id && <CheckCircle2 className="w-4 h-4 text-secondary" />}
                  </div>
                  <p className="text-xs text-gray-500">{preset.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-4">
            <h3 className="text-sm text-gray-400 font-bold uppercase tracking-wider">Typography</h3>
            
            <div>
              <label className="text-xs mb-1 block text-gray-500">Font Family</label>
              <select className="w-full bg-surface border border-gray-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-secondary">
                <option>Inter Tight (Neo Brutal)</option>
                <option>Montserrat (Bold)</option>
                <option>Oswald (Condensed)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs mb-1 block text-gray-500">Size</label>
                <input type="number" defaultValue={64} className="w-full bg-surface border border-gray-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-secondary" />
              </div>
              <div>
                <label className="text-xs mb-1 block text-gray-500">Weight</label>
                <select className="w-full bg-surface border border-gray-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-secondary">
                  <option>900 (Black)</option>
                  <option>800 (Extra Bold)</option>
                  <option>700 (Bold)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-4">
            <h3 className="text-sm text-gray-400 font-bold uppercase tracking-wider">Appearance</h3>
            
            <div>
              <label className="text-xs mb-1 block text-gray-500">Primary Color</label>
              <div className="flex gap-2">
                {['#FFFFFF', '#00E5FF', '#7C3AED', '#22C55E', '#F59E0B', '#EF4444'].map(color => (
                  <button key={color} className="w-8 h-8 rounded-full border-2 border-gray-800" style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Preview Area */}
      <main className="flex-1 p-8 flex flex-col items-center justify-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-20 mix-blend-overlay">
        
        <div className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-2xl border border-gray-800 shadow-2xl overflow-hidden mb-8 flex flex-col justify-center items-center px-8 text-center">
          {/* Fake Video bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
          
          {/* Subtitle Preview */}
          <motion.div 
            className="relative z-10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={activePreset} // force re-render animation on change
          >
            {activePreset === 'hormozi' && (
              <h1 className="text-5xl font-black uppercase leading-tight tracking-tight drop-shadow-2xl">
                <span className="text-white">THIS IS HOW YOU </span>
                <span className="text-warning">GO VIRAL</span>
              </h1>
            )}
            
            {activePreset === 'neon' && (
              <h1 className="text-5xl font-bold italic leading-tight tracking-wide text-white" style={{ textShadow: '0 0 10px #00E5FF, 0 0 20px #00E5FF, 0 0 30px #00E5FF' }}>
                CYBERPUNK
                <br />
                AESTHETICS
              </h1>
            )}

            {activePreset === 'minimal' && (
              <h1 className="text-3xl font-medium leading-relaxed text-white opacity-90">
                Consistency is the key to mastering any skill.
              </h1>
            )}
            
            {activePreset === 'gaming' && (
              <h1 className="text-6xl font-black uppercase italic leading-none text-danger" style={{ WebkitTextStroke: '2px white' }}>
                LET'S GOOO!
              </h1>
            )}
          </motion.div>
        </div>

        <button className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-lg">
          Apply to All Clips
        </button>

      </main>
    </div>
    </DashboardLayout>
  );
}
