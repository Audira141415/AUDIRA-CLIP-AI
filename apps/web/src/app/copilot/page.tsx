'use client';

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Zap, VolumeX, Type, Smartphone, Video, Mic, ArrowRight, Play, Lock, Eye, MousePointer2, Undo, Redo, Scissors, Trash2, Maximize, Settings2 } from "lucide-react";

export default function CopilotPage() {
  const actions = [
    { title: "Auto Highlight", desc: "Find the best moments in your video", icon: Zap, bg: "bg-[#F5A623]" },
    { title: "Auto Cut Silence", desc: "Remove silent parts automatically", icon: VolumeX, bg: "bg-[#00E5FF]" },
    { title: "Add Captions", desc: "Generate accurate captions", icon: Type, bg: "bg-[#FFEDF4]" },
    { title: "Reframe for Shorts", desc: "Convert to vertical format", icon: Smartphone, bg: "bg-white" },
    { title: "Auto B-Roll", desc: "Find and insert relevant B-roll", icon: Video, bg: "bg-[#F5A623]" },
    { title: "Improve Audio", desc: "Enhance voice and reduce noise", icon: Mic, bg: "bg-[#00E5FF]" }
  ];

  const history = [
    { action: "Created highlights", time: "2 minutes ago" },
    { action: "Added captions", time: "10 minutes ago" },
    { action: "Removed silences", time: "25 minutes ago" },
    { action: "Reframed for Shorts", time: "1 hour ago" }
  ];

  return (
    <DashboardLayout>
      <div className="flex h-full bg-[#FAFAFA] text-black font-sans -m-8">
        
        {/* Main Content Area (Left) */}
        <div className="flex-1 flex flex-col p-8 overflow-y-auto h-[calc(100vh-80px)]">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black uppercase flex items-center gap-3 mb-2">
              AI Copilot
              <span className="bg-[#FFEDF4] text-black text-sm px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">BETA</span>
            </h1>
            <p className="font-bold text-gray-700">Your AI assistant for faster, smarter video editing</p>
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
            {actions.map((item, i) => (
              <button key={i} className="bg-white border-4 border-black p-5 flex items-start gap-4 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all group">
                <div className={`w-12 h-12 border-4 border-black flex items-center justify-center shrink-0 ${item.bg} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-12 transition-transform`}>
                  <item.icon className="w-6 h-6 text-black" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="font-black text-lg uppercase">{item.title}</h3>
                  <p className="font-bold text-sm text-gray-600 leading-tight">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Prompt Box */}
          <div className="bg-white border-4 border-[#F5A623] p-6 mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative">
            <textarea 
              className="w-full h-24 bg-transparent resize-none font-bold text-xl outline-none placeholder:text-gray-400"
              placeholder="Ask anything about your video..."
            ></textarea>
            
            <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
              <div className="flex flex-wrap gap-3">
                {["Create a 30s highlight reel", "Add captions to this video", "Remove all silences", "Make it vertical for Shorts"].map((pill, i) => (
                  <button key={i} className="text-xs font-black uppercase bg-[#FAFAFA] border-2 border-black px-3 py-1.5 hover:bg-[#F5A623] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    {pill}
                  </button>
                ))}
              </div>
              <button className="bg-[#F5A623] w-12 h-12 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all shrink-0">
                <ArrowRight className="w-6 h-6 text-black" strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Suggestions */}
          <div className="mb-10">
            <h3 className="font-black uppercase mb-4">Suggestions for this video</h3>
            <div className="flex flex-wrap gap-3">
              {["Find key moments", "Add engaging subtitles", "Improve pacing", "Add background music"].map((sug, i) => (
                <button key={i} className="flex items-center gap-2 bg-white border-2 border-black px-4 py-2 font-bold text-sm hover:bg-[#00E5FF] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <Zap className="w-4 h-4" strokeWidth={2} /> {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline UI (Mockup) */}
          <div className="mt-auto border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
            {/* Toolbar */}
            <div className="bg-[#FAFAFA] border-b-4 border-black px-4 py-2 flex items-center gap-6">
              <MousePointer2 className="w-5 h-5 cursor-pointer text-[#F5A623]" strokeWidth={3} />
              <Undo className="w-5 h-5 cursor-pointer hover:text-[#F5A623]" strokeWidth={2.5} />
              <Redo className="w-5 h-5 cursor-pointer hover:text-[#F5A623]" strokeWidth={2.5} />
              <div className="w-px h-6 bg-black"></div>
              <Scissors className="w-5 h-5 cursor-pointer hover:text-[#F5A623]" strokeWidth={2.5} />
              <Trash2 className="w-5 h-5 cursor-pointer hover:text-red-500" strokeWidth={2.5} />
              <div className="flex-1"></div>
              <Maximize className="w-5 h-5 cursor-pointer hover:text-[#F5A623]" strokeWidth={2.5} />
            </div>

            {/* Time Ruler */}
            <div className="bg-white border-b-2 border-black flex h-8 text-[10px] font-black items-center px-24">
              <div className="flex-1 flex justify-between relative">
                <span>00:00</span>
                <span>00:05</span>
                <span>00:10</span>
                <span>00:15</span>
                <span>00:20</span>
                {/* Playhead */}
                <div className="absolute left-[45%] top-0 bottom-[-200px] w-0.5 bg-[#F5A623] z-10 flex flex-col items-center">
                  <div className="w-3 h-3 bg-[#F5A623] border-2 border-black -mt-1 rounded-sm rotate-45"></div>
                </div>
              </div>
            </div>

            {/* Tracks */}
            <div className="flex flex-col bg-[#FAFAFA]">
              {/* V2 */}
              <div className="flex border-b-2 border-gray-200 h-16">
                <div className="w-24 shrink-0 bg-white border-r-4 border-black flex flex-col items-center justify-center text-[10px] font-black uppercase">
                  <span className="mb-1">V2</span>
                  <div className="flex gap-2 text-gray-500"><Lock className="w-3 h-3" /><Eye className="w-3 h-3" /></div>
                </div>
                <div className="flex-1 relative p-2">
                  <div className="absolute left-10 w-48 h-12 bg-[#FFEDF4] border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center px-3 font-black text-sm">T Title Here</div>
                </div>
              </div>

              {/* V1 */}
              <div className="flex border-b-2 border-gray-200 h-20 bg-[#FFF8EB]">
                <div className="w-24 shrink-0 bg-white border-r-4 border-black flex flex-col items-center justify-center text-[10px] font-black uppercase">
                  <span className="mb-1">V1</span>
                  <div className="flex gap-2 text-gray-500"><Lock className="w-3 h-3" /><Eye className="w-3 h-3 text-black" /></div>
                </div>
                <div className="flex-1 relative p-2 flex gap-1">
                  <div className="w-[30%] h-16 bg-[#F5A623] border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex items-end p-1">
                    <span className="text-[10px] font-black bg-white border-2 border-black px-1">Clip 1</span>
                  </div>
                  <div className="w-[45%] h-16 bg-[#F5A623] border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex items-end p-1">
                     <span className="text-[10px] font-black bg-white border-2 border-black px-1">Clip 2</span>
                  </div>
                </div>
              </div>

              {/* A1 */}
              <div className="flex border-b-2 border-gray-200 h-16">
                <div className="w-24 shrink-0 bg-white border-r-4 border-black flex flex-col items-center justify-center text-[10px] font-black uppercase">
                  <span className="mb-1">A1</span>
                  <div className="flex gap-2 text-gray-500"><Lock className="w-3 h-3" /><Mic className="w-3 h-3 text-black" /></div>
                </div>
                <div className="flex-1 relative p-2">
                  <div className="absolute left-2 right-24 h-12 bg-[#00E5FF] border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center px-3 font-black text-xs">Music_Loop.mp3</div>
                </div>
              </div>

              {/* T1 */}
              <div className="flex h-16">
                <div className="w-24 shrink-0 bg-white border-r-4 border-black flex flex-col items-center justify-center text-[10px] font-black uppercase">
                  <span className="mb-1">T1</span>
                  <div className="flex gap-2 text-gray-500"><Type className="w-3 h-3 text-black" /></div>
                </div>
                <div className="flex-1 relative p-2">
                  <div className="absolute left-[30%] w-64 h-12 bg-black text-white border-4 border-[#F5A623] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center px-3 font-black text-sm">Subtitle Text Here</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-[340px] shrink-0 border-l-4 border-black bg-white flex flex-col h-[calc(100vh-80px)]">
          <div className="p-6 border-b-4 border-black flex items-center justify-between">
            <h2 className="font-black uppercase text-xl">Copilot History</h2>
            <button className="text-xs font-black uppercase text-[#F5A623] hover:underline decoration-2 underline-offset-2">See all</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.map((item, i) => (
              <div key={i} className="p-3 border-2 border-black flex justify-between items-center hover:bg-[#FAFAFA] transition-colors cursor-pointer group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5">
                <div>
                  <h4 className="font-black text-sm">{item.action}</h4>
                  <p className="text-xs font-bold text-gray-500">{item.time}</p>
                </div>
                <div className="w-8 h-8 border-2 border-black bg-white flex items-center justify-center group-hover:bg-[#00E5FF] transition-colors">
                  <Play className="w-4 h-4 fill-current" />
                </div>
              </div>
            ))}
          </div>

          {/* Info Panel */}
          <div className="p-6 border-y-4 border-black bg-[#FAFAFA]">
            <h3 className="font-black uppercase text-lg mb-4">Info</h3>
            <div className="space-y-2 text-sm font-bold">
              <div className="flex justify-between">
                <span className="text-gray-500">Video</span>
                <span>Video_01.mp4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration</span>
                <span>01:23:20</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Resolution</span>
                <span>1920x1080</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Frame Rate</span>
                <span>30 FPS</span>
              </div>
            </div>
          </div>

          {/* Copilot Settings */}
          <div className="p-6 bg-white">
            <h3 className="font-black uppercase text-lg mb-4 flex items-center gap-2">
              <Settings2 className="w-5 h-5" /> Copilot Settings
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2">AI Model</label>
                <select className="w-full bg-[#FAFAFA] border-2 border-black p-2 font-bold outline-none cursor-pointer focus:border-[#F5A623] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <option>Audira AI v1</option>
                  <option>DeepSeek R1</option>
                  <option>Qwen 2.5</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-black uppercase text-gray-500">Creativity</label>
                  <span className="text-xs font-black bg-[#FFEDF4] border-2 border-black px-1">Medium</span>
                </div>
                <input type="range" className="w-full accent-[#F5A623]" min="0" max="100" defaultValue="50" />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <label className="block text-sm font-black uppercase">Auto-apply results ⚡</label>
                  <span className="text-xs font-bold text-gray-500">Automatically apply safe changes</span>
                </div>
                {/* Custom Toggle */}
                <div className="w-12 h-6 bg-[#F5A623] border-2 border-black rounded-full p-0.5 cursor-pointer relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="w-4 h-4 bg-white border-2 border-black rounded-full absolute right-1"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
