'use client';

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Search, ChevronDown, Plus, Play, Clock, CheckCircle2, AlertTriangle, Download, RefreshCw, MoreHorizontal, Folder, MonitorPlay, Smartphone, Video, ChevronLeft, ChevronRight } from "lucide-react";

export default function RenderQueuePage() {
  const stats = [
    { label: "Rendering", count: 2, icon: Play, bg: "bg-[#00E5FF]" },
    { label: "Waiting", count: 1, icon: Clock, bg: "bg-[#F5A623]" },
    { label: "Completed", count: 5, icon: CheckCircle2, bg: "bg-[#FFEDF4]" },
    { label: "Failed", count: 1, icon: AlertTriangle, bg: "bg-red-400" }
  ];

  const queue = [
    { title: "Travel Vlog - Episode 3", details: "1920x1080 • 30fps", preset: "YouTube 1080p", codec: "H.264", status: "Rendering", statusColor: "bg-[#00E5FF]", progress: 65, time: "00:01:24", totalTime: "00:03:12", outFormat: "MP4", outRes: "1080p" },
    { title: "Marketing Video", details: "1920x1080 • 30fps", preset: "Instagram Reels", codec: "H.264", status: "Rendering", statusColor: "bg-[#00E5FF]", progress: 28, time: "00:00:52", totalTime: "00:03:01", outFormat: "MP4", outRes: "1080x1920" },
    { title: "Tutorial - Color Grading", details: "3840x2160 • 30fps", preset: "Custom 4K", codec: "H.265", status: "Waiting", statusColor: "bg-[#F5A623]", progress: 0, time: "-", totalTime: "-", outFormat: "MP4", outRes: "4K" },
    { title: "Product Promo", details: "1920x1080 • 30fps", preset: "Vimeo 1080p", codec: "H.264", status: "Completed", statusColor: "bg-green-400", progress: 100, time: "-", totalTime: "-", outFormat: "MP4", outRes: "1080p" },
    { title: "Interview - John Doe", details: "1920x1080 • 30fps", preset: "YouTube 1080p", codec: "H.264", status: "Completed", statusColor: "bg-green-400", progress: 100, time: "-", totalTime: "-", outFormat: "MP4", outRes: "1080p" },
    { title: "Social Media Clip", details: "1080x1920 • 30fps", preset: "TikTok 1080x1920", codec: "H.264", status: "Completed", statusColor: "bg-green-400", progress: 100, time: "-", totalTime: "-", outFormat: "MP4", outRes: "1080x1920" },
    { title: "Event Highlight", details: "1920x1080 • 30fps", preset: "Custom", codec: "H.264", status: "Failed", statusColor: "bg-red-400", progress: 0, time: "-", totalTime: "-", outFormat: "MP4", outRes: "1080p" }
  ];

  const presets = [
    { icon: MonitorPlay, label: "YouTube 1080p", desc: "1920x1080 • H.264" },
    { icon: MonitorPlay, label: "YouTube 4K", desc: "3840x2160 • H.265" },
    { icon: Smartphone, label: "Instagram Reels", desc: "1080x1920 • H.264" },
    { icon: Video, label: "TikTok 1080x1920", desc: "1080x1920 • H.264" },
    { icon: MonitorPlay, label: "Vimeo 1080p", desc: "1920x1080 • H.264" }
  ];

  return (
    <DashboardLayout>
      <div className="flex h-full bg-[#FAFAFA] text-black font-sans -m-8 relative overflow-x-hidden">
        
        {/* Background Dot Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>

        {/* Main Content Area (Left) */}
        <div className="flex-1 flex flex-col p-8 overflow-y-auto h-[calc(100vh-80px)] z-10 relative">
          
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-black uppercase mb-2">Render Queue</h1>
            <p className="font-bold text-gray-700">Manage your render tasks and download your videos.</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b-4 border-black mb-6">
            <button className="px-6 py-3 font-black uppercase text-sm border-b-4 border-[#F5A623] text-black -mb-1">Queue</button>
            <button className="px-6 py-3 font-bold uppercase text-sm text-gray-500 hover:text-black hover:border-b-4 hover:border-black transition-all -mb-1">History</button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <div key={i} className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex justify-between items-center group">
                <div>
                  <div className="text-4xl font-black">{s.count}</div>
                  <div className="text-sm font-black uppercase text-gray-600">{s.label}</div>
                </div>
                <div className={`w-12 h-12 border-4 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${s.bg} group-hover:rotate-12 transition-transform`}>
                  <s.icon className="w-6 h-6 text-black" strokeWidth={3} />
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex gap-4 flex-1 w-full">
              {/* Filter */}
              <div className="relative w-40">
                <select className="w-full h-full bg-white border-4 border-black px-4 py-3 font-bold appearance-none outline-none cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all">
                  <option>Show All</option>
                  <option>Rendering</option>
                  <option>Completed</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" strokeWidth={3} />
              </div>
              
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={3} />
                <input 
                  type="text" 
                  placeholder="Search renders..." 
                  className="w-full bg-white border-4 border-black py-3 pl-10 pr-4 font-bold outline-none focus:border-[#F5A623] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[2px] focus:translate-x-[2px] transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button className="bg-white border-4 border-black py-3 px-6 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:bg-gray-100 transition-all whitespace-nowrap">
                Clear Completed
              </button>
              <button className="bg-[#F5A623] border-4 border-black py-3 px-6 font-black uppercase text-sm flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:bg-[#FFEDF4] transition-all whitespace-nowrap">
                <Plus className="w-5 h-5" strokeWidth={3} /> Add Render
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-[#FAFAFA] border-b-4 border-black text-xs font-black uppercase">
                    <th className="p-4 border-r-2 border-black">Video</th>
                    <th className="p-4 border-r-2 border-black">Preset</th>
                    <th className="p-4 border-r-2 border-black">Status</th>
                    <th className="p-4 border-r-2 border-black">Progress</th>
                    <th className="p-4 border-r-2 border-black">Time Left</th>
                    <th className="p-4 border-r-2 border-black">Output</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-bold text-sm">
                  {queue.map((q, i) => (
                    <tr key={i} className="border-b-2 border-gray-200 hover:bg-[#FFF8EB] transition-colors group">
                      <td className="p-4 border-r-2 border-gray-200 group-hover:border-black flex gap-4">
                        <div className="w-24 h-16 bg-gray-900 border-2 border-black shrink-0 relative overflow-hidden">
                          <img src="/feature_clipping.png" className="w-full h-full object-cover opacity-70 mix-blend-luminosity" />
                          <div className="absolute bottom-1 left-1 bg-black text-white text-[8px] font-black px-1 border-2 border-black">01:23</div>
                        </div>
                        <div className="flex flex-col justify-center">
                          <div className="font-black text-sm truncate max-w-[180px]">{q.title}</div>
                          <div className="text-gray-500 text-xs">{q.details}</div>
                        </div>
                      </td>
                      <td className="p-4 border-r-2 border-gray-200 group-hover:border-black">
                        <div className="font-black text-sm truncate max-w-[120px]">{q.preset}</div>
                        <div className="text-gray-500 text-xs">{q.codec}</div>
                      </td>
                      <td className="p-4 border-r-2 border-gray-200 group-hover:border-black">
                        <span className={`inline-flex items-center gap-2 border-2 border-black px-2 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${q.statusColor}`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="p-4 border-r-2 border-gray-200 group-hover:border-black w-48">
                        <div className="flex justify-between text-xs font-black mb-1">
                          <span>{q.progress}%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 border-2 border-black overflow-hidden relative">
                          <div className="absolute top-0 left-0 h-full border-r-2 border-black bg-black" style={{ width: `${q.progress}%` }}></div>
                        </div>
                      </td>
                      <td className="p-4 border-r-2 border-gray-200 group-hover:border-black whitespace-nowrap">
                        <div className="font-black text-sm">{q.time}</div>
                        {q.totalTime !== '-' && <div className="text-gray-500 text-xs">of {q.totalTime}</div>}
                      </td>
                      <td className="p-4 border-r-2 border-gray-200 group-hover:border-black">
                        <div className="font-black text-sm">{q.outFormat}</div>
                        <div className="text-gray-500 text-xs">{q.outRes}</div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {q.status === 'Completed' && (
                            <button className="p-1 hover:bg-[#00E5FF] border-2 border-transparent hover:border-black transition-colors rounded-sm shadow-sm">
                              <Download className="w-5 h-5" strokeWidth={2.5} />
                            </button>
                          )}
                          {q.status === 'Failed' && (
                            <button className="p-1 hover:bg-[#F5A623] border-2 border-transparent hover:border-black transition-colors rounded-sm shadow-sm">
                              <RefreshCw className="w-5 h-5" strokeWidth={2.5} />
                            </button>
                          )}
                          <button className="p-1 hover:bg-[#FFEDF4] border-2 border-transparent hover:border-black transition-colors rounded-sm shadow-sm">
                            <MoreHorizontal className="w-5 h-5" strokeWidth={2.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center text-sm font-black text-gray-500 mt-auto">
            <span>Showing 1 to 7 of 7 results</span>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black hover:bg-[#F5A623] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black">
                <ChevronLeft className="w-4 h-4" strokeWidth={3} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-[#F5A623] border-2 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black hover:bg-[#F5A623] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black">
                <ChevronRight className="w-4 h-4" strokeWidth={3} />
              </button>
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="w-[380px] shrink-0 border-l-4 border-black bg-white flex flex-col h-[calc(100vh-80px)] z-20">
          
          <div className="flex-1 overflow-y-auto">
            {/* Render Presets */}
            <div className="p-6 border-b-4 border-black bg-[#FAFAFA]">
              <h2 className="font-black uppercase text-xl mb-1">Render Presets</h2>
              <p className="font-bold text-xs text-gray-500 mb-6">Manage and create your render presets.</p>
              
              <div className="space-y-3">
                {presets.map((preset, i) => (
                  <div key={i} className="flex justify-between items-center p-3 border-4 border-black cursor-pointer hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border-2 border-black bg-[#FAFAFA] flex items-center justify-center group-hover:bg-[#00E5FF] transition-colors">
                        <preset.icon className="w-4 h-4 text-black" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h4 className="font-black text-sm uppercase">{preset.label}</h4>
                        <p className="font-bold text-[10px] text-gray-500">{preset.desc}</p>
                      </div>
                    </div>
                    <MoreHorizontal className="w-5 h-5 text-gray-400 group-hover:text-black" strokeWidth={3} />
                  </div>
                ))}
                
                <button className="w-full mt-2 bg-white border-4 border-black border-dashed py-3 font-black uppercase text-sm hover:bg-[#FFEDF4] hover:border-solid shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  + Add Custom Preset
                </button>
              </div>
            </div>

            {/* Render Settings */}
            <div className="p-6 bg-white">
              <h2 className="font-black uppercase text-lg mb-6">Render Settings</h2>
              
              <div className="space-y-5">
                
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">File Name</label>
                  <input type="text" defaultValue="Travel Vlog - Episode 3" className="w-full bg-[#FAFAFA] border-4 border-black px-4 py-3 font-bold outline-none focus:border-[#F5A623] focus:bg-[#FFF8EB] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">Output Directory</label>
                  <div className="flex">
                    <input type="text" defaultValue="/renders" className="w-full bg-[#FAFAFA] border-4 border-r-0 border-black px-4 py-3 font-bold outline-none" />
                    <button className="bg-white border-4 border-black px-4 flex items-center justify-center hover:bg-[#00E5FF] transition-colors">
                      <Folder className="w-5 h-5" strokeWidth={3} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2">Format</label>
                    <div className="relative">
                      <select className="w-full bg-[#FAFAFA] border-4 border-black px-3 py-3 font-bold outline-none appearance-none cursor-pointer">
                        <option>MP4</option>
                        <option>MOV</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" strokeWidth={3} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2">Codec</label>
                    <div className="relative">
                      <select className="w-full bg-[#FAFAFA] border-4 border-black px-3 py-3 font-bold outline-none appearance-none cursor-pointer">
                        <option>H.264</option>
                        <option>H.265</option>
                        <option>ProRes</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" strokeWidth={3} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">Resolution</label>
                  <div className="relative">
                    <select className="w-full bg-[#FAFAFA] border-4 border-black px-4 py-3 font-bold outline-none appearance-none cursor-pointer">
                      <option>1920 x 1080 (Full HD)</option>
                      <option>3840 x 2160 (4K)</option>
                      <option>1080 x 1920 (Vertical)</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" strokeWidth={3} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2">Frame Rate</label>
                    <div className="relative">
                      <select className="w-full bg-[#FAFAFA] border-4 border-black px-3 py-3 font-bold outline-none appearance-none cursor-pointer">
                        <option>30 fps</option>
                        <option>60 fps</option>
                        <option>24 fps</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" strokeWidth={3} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2">Quality</label>
                    <div className="relative">
                      <select className="w-full bg-[#FAFAFA] border-4 border-black px-3 py-3 font-bold outline-none appearance-none cursor-pointer">
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" strokeWidth={3} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="block text-xs font-black uppercase">Use Hardware Acceleration</label>
                  <div className="w-12 h-6 bg-[#F5A623] border-2 border-black rounded-full p-0.5 cursor-pointer relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-4 h-4 bg-white border-2 border-black rounded-full absolute right-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 bg-white shrink-0">
            <button className="w-full bg-[#F5A623] text-black border-4 border-black font-black uppercase text-xl px-4 py-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-3 group">
              <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" /> Render Now
            </button>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
