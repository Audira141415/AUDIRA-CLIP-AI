'use client';

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Check, ChevronRight, Lock, Video, Play, Crop, Maximize, MousePointer2, Focus, Smartphone, MonitorPlay, HelpCircle, ArrowRight } from "lucide-react";

export default function ReframePage() {
  const steps = [
    { num: 1, label: "Source", active: true },
    { num: 2, label: "Reframe", active: false },
    { num: 3, label: "Preview", active: false },
    { num: 4, label: "Export", active: false }
  ];

  const aspectRatios = [
    { label: "9:16", sub: "Portrait", desc: "1080x1920", selected: true, w: "w-8", h: "h-14" },
    { label: "1:1", sub: "Square", desc: "1080x1080", selected: false, w: "w-10", h: "h-10" },
    { label: "16:9", sub: "Landscape", desc: "1920x1080", selected: false, w: "w-14", h: "h-8" },
    { label: "4:5", sub: "Portrait", desc: "1080x1350", selected: false, w: "w-10", h: "h-12" }
  ];

  const presets = [
    { icon: MonitorPlay, label: "YouTube Shorts", desc: "9:16 • 1080x1920" },
    { icon: Smartphone, label: "Instagram Reels", desc: "9:16 • 1080x1920" },
    { icon: Video, label: "TikTok", desc: "9:16 • 1080x1920" },
    { icon: Smartphone, label: "Instagram Post", desc: "1:1 • 1080x1080" },
    { icon: MonitorPlay, label: "YouTube Video", desc: "16:9 • 1920x1080" }
  ];

  const styles = [
    { icon: Crop, label: "Smart Crop", desc: "Automatically focus on the main subject", selected: true },
    { icon: Focus, label: "Center Subject", desc: "Keep the subject in the center", selected: false },
    { icon: Maximize, label: "Dynamic", desc: "Adjust framing based on motion and action", selected: false }
  ];

  return (
    <DashboardLayout>
      <div className="flex h-full bg-[#FAFAFA] text-black font-sans -m-8 relative">
        
        {/* Background Dot Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>

        {/* Main Content Area (Left) */}
        <div className="flex-1 flex flex-col p-8 overflow-y-auto h-[calc(100vh-80px)] z-10 relative">
          
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-black uppercase flex items-center gap-3 mb-2">
              AI Reframing
              <span className="bg-[#FFEDF4] text-black text-sm px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">BETA</span>
            </h1>
            <p className="font-bold text-gray-700">Automatically reframe your video for any aspect ratio and platform.</p>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-6 mb-8">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${step.active ? 'bg-[#F5A623] text-black' : 'bg-white text-gray-400'}`}>
                  {step.num}
                </div>
                <span className={`font-black uppercase text-sm ${step.active ? 'text-black' : 'text-gray-400'}`}>{step.label}</span>
                {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300 ml-4" strokeWidth={3} />}
              </div>
            ))}
          </div>

          {/* Two Columns: Source vs Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 mb-8">
            
            {/* Source Video Panel */}
            <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col">
              <h2 className="font-black uppercase mb-4 text-lg">Source Video</h2>
              
              <div className="w-full aspect-[4/5] bg-gray-900 border-4 border-black mb-4 relative overflow-hidden flex items-center justify-center group">
                <div className="absolute inset-0 bg-[#00E5FF] opacity-10"></div>
                <Play className="w-16 h-16 text-white opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer z-10" />
                <div className="absolute bottom-2 left-2 bg-black/80 text-white font-bold text-xs px-2 py-1 border-2 border-black">01:23 / 05:48</div>
              </div>

              <div className="mb-4">
                <h3 className="font-black text-sm uppercase mb-1">Interview_Final.mp4</h3>
                <p className="font-bold text-xs text-gray-500 mb-3">1920x1080 • 05:48 • 60 FPS</p>
                <button className="w-full bg-white border-2 border-black py-2 font-black uppercase text-xs hover:bg-[#FAFAFA] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex justify-center gap-2">
                  <Lock className="w-4 h-4" /> Change Video
                </button>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-black text-sm uppercase">Audio Analysis</h3>
                  <span className="bg-[#00E5FF] border-2 border-black text-[10px] px-1 font-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">ACTIVE</span>
                </div>
                <p className="text-xs font-bold text-gray-500 mb-2">Detecting speakers and key moments...</p>
                <div className="w-full h-3 bg-gray-200 border-2 border-black overflow-hidden relative">
                  <div className="absolute top-0 left-0 h-full bg-[#F5A623] w-[80%] border-r-2 border-black"></div>
                </div>
                <div className="text-right text-xs font-black mt-1">80%</div>
              </div>

              <div>
                <h3 className="font-black text-sm uppercase mb-2">Detected Highlights</h3>
                <div className="space-y-1">
                  {[
                    { label: "Introduction", time: "00:00 - 00:18" },
                    { label: "Key Point 1", time: "01:02 - 01:42" },
                    { label: "Key Point 2", time: "02:35 - 03:10" },
                    { label: "Conclusion", time: "04:50 - 05:48" }
                  ].map((h, i) => (
                    <div key={i} className="flex justify-between items-center bg-[#FAFAFA] border-2 border-black p-2 font-bold text-xs hover:bg-[#FFEDF4] transition-colors cursor-pointer">
                      <span>{h.label}</span>
                      <span className="text-gray-500">{h.time}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-3 bg-white border-2 border-black py-2 font-black uppercase text-xs hover:bg-[#00E5FF] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
                  Edit Highlights
                </button>
              </div>
            </div>

            {/* Settings Panels */}
            <div className="flex flex-col gap-6">
              
              {/* Aspect Ratios */}
              <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="font-black uppercase mb-1 text-lg">Select Aspect Ratios</h2>
                <p className="font-bold text-sm text-gray-500 mb-4">Choose the formats you want to generate.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {aspectRatios.map((ar, i) => (
                    <div key={i} className={`border-4 border-black p-3 relative cursor-pointer hover:-translate-y-1 hover:-translate-x-1 transition-transform ${ar.selected ? 'bg-[#FFF8EB] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[#F5A623]' : 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}`}>
                      {ar.selected && (
                        <div className="absolute top-2 right-2 bg-[#F5A623] w-5 h-5 border-2 border-black flex items-center justify-center">
                          <Check className="w-3 h-3 text-black" strokeWidth={4} />
                        </div>
                      )}
                      {!ar.selected && (
                        <div className="absolute top-2 right-2 bg-white w-5 h-5 border-2 border-black"></div>
                      )}
                      <div className="h-20 flex items-center justify-center mb-2">
                        <div className={`${ar.w} ${ar.h} border-4 border-black ${ar.selected ? 'bg-[#F5A623]' : 'bg-transparent'}`}></div>
                      </div>
                      <div className="text-center">
                        <h4 className="font-black text-lg leading-tight">{ar.label}</h4>
                        <p className="font-bold text-xs uppercase">{ar.sub}</p>
                        <p className="font-bold text-[10px] text-gray-500 mt-1">{ar.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reframing Style */}
              <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="font-black uppercase mb-1 text-lg">AI Reframing Style</h2>
                <p className="font-bold text-sm text-gray-500 mb-4">Choose how AI should frame your video.</p>
                
                <div className="space-y-3">
                  {styles.map((style, i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 border-4 border-black cursor-pointer hover:-translate-y-1 hover:-translate-x-1 transition-transform ${style.selected ? 'bg-[#FFEDF4] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}`}>
                      <div className={`w-10 h-10 border-4 border-black flex items-center justify-center shrink-0 ${style.selected ? 'bg-[#F5A623]' : 'bg-gray-100'}`}>
                        <style.icon className="w-5 h-5" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black uppercase">{style.label}</h4>
                        <p className="font-bold text-xs text-gray-600">{style.desc}</p>
                      </div>
                      {style.selected && <Check className="w-6 h-6" strokeWidth={3} />}
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex items-start gap-2 bg-[#FAFAFA] border-2 border-black p-3 text-xs font-bold">
                  <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>AI will analyze the content and keep important elements in frame.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline & Key Moments */}
          <div className="mt-auto bg-white border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-black uppercase mb-1 text-lg">Timeline & Key Moments</h2>
            <p className="font-bold text-sm text-gray-500 mb-8">AI will use these moments to create the best reframed versions.</p>

            <div className="relative pt-12 pb-6 px-4">
              {/* Highlight Markers */}
              <div className="absolute top-0 left-[10%] bg-[#FFEDF4] border-4 border-black px-3 py-1 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10 -translate-x-1/2 cursor-pointer hover:-translate-y-1 transition-transform">
                <h5 className="font-black text-xs uppercase">Introduction</h5>
                <p className="text-[10px] font-bold">00:00 - 00:18</p>
                {/* Connecting Line */}
                <div className="absolute bottom-[-20px] left-1/2 w-1 h-5 bg-black -translate-x-1/2"></div>
                <div className="absolute bottom-[-24px] left-1/2 w-3 h-3 bg-black rounded-full -translate-x-1/2"></div>
              </div>

              <div className="absolute top-0 left-[35%] bg-[#00E5FF] border-4 border-black px-3 py-1 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10 -translate-x-1/2 cursor-pointer hover:-translate-y-1 transition-transform">
                <h5 className="font-black text-xs uppercase">Key Point 1</h5>
                <p className="text-[10px] font-bold">01:02 - 01:42</p>
                <div className="absolute bottom-[-20px] left-1/2 w-1 h-5 bg-black -translate-x-1/2"></div>
                <div className="absolute bottom-[-24px] left-1/2 w-3 h-3 bg-black rounded-full -translate-x-1/2"></div>
              </div>

              <div className="absolute top-0 left-[60%] bg-[#F5A623] border-4 border-black px-3 py-1 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10 -translate-x-1/2 cursor-pointer hover:-translate-y-1 transition-transform">
                <h5 className="font-black text-xs uppercase">Key Point 2</h5>
                <p className="text-[10px] font-bold">02:35 - 03:10</p>
                <div className="absolute bottom-[-20px] left-1/2 w-1 h-5 bg-black -translate-x-1/2"></div>
                <div className="absolute bottom-[-24px] left-1/2 w-3 h-3 bg-black rounded-full -translate-x-1/2"></div>
              </div>

              <div className="absolute top-0 left-[85%] bg-white border-4 border-black px-3 py-1 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10 -translate-x-1/2 cursor-pointer hover:-translate-y-1 transition-transform">
                <h5 className="font-black text-xs uppercase">Conclusion</h5>
                <p className="text-[10px] font-bold">04:50 - 05:48</p>
                <div className="absolute bottom-[-20px] left-1/2 w-1 h-5 bg-black -translate-x-1/2"></div>
                <div className="absolute bottom-[-24px] left-1/2 w-3 h-3 bg-black rounded-full -translate-x-1/2"></div>
              </div>

              {/* Time Ruler */}
              <div className="flex justify-between text-[10px] font-black mb-1 px-2 text-gray-400">
                <span>00:00</span>
                <span>01:00</span>
                <span>02:00</span>
                <span>03:00</span>
                <span>04:00</span>
                <span>05:00</span>
              </div>

              {/* Video Track Fake */}
              <div className="h-16 border-4 border-black bg-gray-900 relative overflow-hidden flex">
                <div className="w-1/6 border-r-2 border-black bg-gray-800 opacity-50"></div>
                <div className="w-1/6 border-r-2 border-black bg-gray-800 opacity-70"></div>
                <div className="w-1/6 border-r-2 border-black bg-gray-800 opacity-50"></div>
                <div className="w-1/6 border-r-2 border-black bg-gray-800 opacity-80"></div>
                <div className="w-1/6 border-r-2 border-black bg-gray-800 opacity-60"></div>
                <div className="w-1/6 bg-gray-800 opacity-50"></div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 mt-4 text-sm font-black">
                <Play className="w-5 h-5 cursor-pointer hover:text-[#F5A623]" />
                <span>01:23 / 05:48</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-[380px] shrink-0 border-l-4 border-black bg-white flex flex-col h-[calc(100vh-80px)] z-20">
          
          <div className="flex-1 overflow-y-auto">
            {/* Presets */}
            <div className="p-6 border-b-4 border-black">
              <h2 className="font-black uppercase text-xl mb-1">Reframing Presets</h2>
              <p className="font-bold text-xs text-gray-500 mb-6">Save time with optimized presets.</p>
              
              <div className="space-y-3">
                {presets.map((preset, i) => (
                  <div key={i} className="flex justify-between items-center p-3 border-4 border-black cursor-pointer hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border-2 border-black bg-[#FAFAFA] flex items-center justify-center group-hover:bg-[#FFEDF4] transition-colors">
                        <preset.icon className="w-4 h-4 text-black" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h4 className="font-black text-sm uppercase">{preset.label}</h4>
                        <p className="font-bold text-[10px] text-gray-500">{preset.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black" strokeWidth={3} />
                  </div>
                ))}
                
                <button className="w-full mt-2 bg-[#FAFAFA] border-4 border-black border-dashed py-3 font-black uppercase text-sm hover:bg-[#F5A623] hover:border-solid shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  + Custom Preset
                </button>
              </div>
            </div>

            {/* Output Settings */}
            <div className="p-6 bg-[#FAFAFA] border-b-4 border-black">
              <h2 className="font-black uppercase text-lg mb-6">Output Settings</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="font-black uppercase text-sm">Background</label>
                  <select className="bg-white border-2 border-black px-3 py-1 font-bold text-sm outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <option>Blur</option>
                    <option>Black</option>
                    <option>Color</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-black uppercase text-sm">Padding</label>
                    <span className="bg-white border-2 border-black px-2 text-xs font-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">5%</span>
                  </div>
                  <input type="range" className="w-full accent-[#F5A623]" min="0" max="20" defaultValue="5" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-black uppercase">Motion Smoothing</label>
                    <span className="text-[10px] font-bold text-gray-500">Reduce camera shake in reframed videos</span>
                  </div>
                  <div className="w-10 h-5 bg-[#00E5FF] border-2 border-black rounded-full p-0.5 cursor-pointer relative shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-3 h-3 bg-white border-2 border-black rounded-full absolute right-0.5"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-black uppercase">Auto Zoom</label>
                    <span className="text-[10px] font-bold text-gray-500">Apply subtle zoom for better composition</span>
                  </div>
                  <div className="w-10 h-5 bg-[#F5A623] border-2 border-black rounded-full p-0.5 cursor-pointer relative shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-3 h-3 bg-white border-2 border-black rounded-full absolute right-0.5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 bg-white shrink-0">
            <button className="w-full bg-[#F5A623] text-black border-4 border-black font-black uppercase text-xl px-4 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-3 group">
              Generate Videos
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </button>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
