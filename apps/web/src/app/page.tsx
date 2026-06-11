'use client';

import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from 'framer-motion';
import { ArrowUp, Play, Zap, Smile, Search, Bell, Plus, Video, Clock, ChevronDown } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: "Total Videos", value: "128", increase: "12.5%", color: "bg-primary" },
    { label: "Total Clips", value: "532", increase: "18.2%", color: "bg-secondary" },
    { label: "Total Exports", value: "1.2K", increase: "22.1%", color: "bg-accent-teal" },
    { label: "Storage Used", value: "256 GB", increase: "8.4%", color: "bg-accent-red" },
    { label: "AI Usage", value: "78%", increase: "6.7%", color: "bg-warning" },
    { label: "Team Members", value: "12", increase: "2", color: "bg-success" },
  ];

  return (
    <DashboardLayout>
      <div className="flex-1 bg-background min-h-screen text-black font-sans p-8">
        
        {/* Top Navbar / Search area */}
        <div className="flex justify-between items-center mb-10 border-4 border-black bg-white p-4 shadow-neu">
          <div className="relative w-96">
            <Search className="w-6 h-6 absolute left-3 top-1/2 -translate-y-1/2 text-black" strokeWidth={3} />
            <input 
              type="text" 
              placeholder="SEARCH VIDEOS, CLIPS, PROJECTS..." 
              className="w-full bg-white border-4 border-black rounded-none py-3 pl-12 pr-4 text-black font-black placeholder-gray-500 focus:outline-none focus:translate-y-[-2px] focus:translate-x-[-2px] focus:shadow-neu transition-all uppercase"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="w-12 h-12 border-4 border-black bg-accent-blue shadow-neu hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-neu-hover flex items-center justify-center text-black font-black text-xl transition-all">
              ?
            </button>
            <button className="w-12 h-12 border-4 border-black bg-secondary shadow-neu hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-neu-hover flex items-center justify-center text-black relative transition-all">
              <Bell className="w-6 h-6" strokeWidth={3} />
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary border-2 border-black rounded-full animate-bounce"></span>
            </button>
            <button className="bg-primary hover:bg-white text-black border-4 border-black px-6 py-3 font-black uppercase text-lg shadow-neu hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-neu-hover transition-all flex items-center gap-2">
              <Plus className="w-6 h-6" strokeWidth={3} /> UPLOAD
            </button>
          </div>
        </div>

        {/* Welcome Header */}
        <div className="flex justify-between items-end mb-8 border-b-4 border-black pb-4">
          <div>
            <h1 className="text-5xl font-heading font-black mb-2 uppercase">Welcome back, John! 👋</h1>
            <p className="text-black font-bold text-xl bg-secondary inline-block px-2 border-2 border-black">Here's what's happening with your content today.</p>
          </div>
          <div className="text-lg text-black font-black border-4 border-black bg-white px-4 py-2 shadow-neu uppercase">
            MAY 12 - MAY 19, 2026
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={i}
              className={`border-4 border-black shadow-neu p-4 flex flex-col justify-between hover:translate-y-[-4px] hover:shadow-neu-hover transition-all ${stat.color}`}
            >
              <p className="text-sm text-black font-black uppercase mb-2 bg-white inline-block px-1 border-2 border-black w-max">{stat.label}</p>
              <h3 className="text-4xl font-black text-black mb-2">{stat.value}</h3>
              <div className="flex items-center gap-1 text-sm text-black bg-white font-black border-2 border-black px-2 py-0.5 w-max">
                <ArrowUp className="w-4 h-4" strokeWidth={3} /> {stat.increase}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Upload Activity */}
          <div className="bg-white border-4 border-black shadow-neu p-6">
            <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-2">
              <h2 className="font-black text-2xl uppercase">Upload Activity</h2>
              <button className="text-sm text-black font-black border-2 border-black px-2 hover:bg-primary transition-colors uppercase">See all</button>
            </div>
            <div className="space-y-4">
              {[
                { name: "Podcast Episode #47.mp4", time: "2 hours ago", size: "1.2 GB" },
                { name: "Webinar - Data Center.mp4", time: "5 hours ago", size: "2.1 GB" },
                { name: "Live Stream - Q&A.mp4", time: "1 day ago", size: "3.4 GB" },
                { name: "Interview with CEO.mp4", time: "2 days ago", size: "1.8 GB" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-2 hover:bg-accent-teal hover:border-black border-2 border-transparent transition-colors">
                  <div className="w-12 h-12 border-2 border-black bg-primary flex items-center justify-center flex-shrink-0 shadow-neu">
                    <Video className="w-6 h-6 text-black" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-md font-black text-black uppercase truncate max-w-[200px]">{item.name}</h4>
                    <p className="text-sm font-bold text-black mt-0.5 bg-secondary px-1 border-2 border-black inline-block">{item.time} • {item.size}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Render Queue */}
          <div className="bg-primary border-4 border-black shadow-neu p-6">
            <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-2">
              <h2 className="font-black text-2xl uppercase">Render Queue</h2>
              <button className="text-sm text-black font-black border-2 border-black px-2 hover:bg-white transition-colors uppercase">See all</button>
            </div>
            <div className="space-y-6">
              {[
                { name: "Clip #128 - Podcast", status: "45%", color: "bg-secondary" },
                { name: "Shorts Compilation #12", status: "27%", color: "bg-accent-teal" },
                { name: "Reels Pack #66", status: "Waiting in queue", color: "bg-white" },
                { name: "TikTok Pack #33", status: "Waiting in queue", color: "bg-white" }
              ].map((item, i) => (
                <div key={i} className="space-y-2 bg-white border-2 border-black p-3 shadow-neu">
                  <div className="flex justify-between text-sm font-black uppercase">
                    <span className="text-black">{item.name}</span>
                    <span className="text-black bg-primary px-1 border-2 border-black">{item.status}</span>
                  </div>
                  {item.status.includes('%') && (
                    <div className="w-full h-4 border-2 border-black bg-background overflow-hidden">
                      <div className={`h-full border-r-2 border-black ${item.color}`} style={{ width: item.status }}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="bg-white border-4 border-black shadow-neu p-6">
            <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-2">
              <h2 className="font-black text-2xl uppercase">AI Suggestions</h2>
              <button className="text-sm text-black font-black border-2 border-black px-2 hover:bg-primary transition-colors uppercase">See all</button>
            </div>
            <div className="space-y-4">
              {[
                { title: "Viral Moment Detected", desc: "In Podcast Episode #47", time: "00:12:44 - 00:13:10", icon: Zap, bg: "bg-primary" },
                { title: "High Engagement Moment", desc: "In Webinar - Data Center", time: "00:34:11 - 00:35:00", icon: Play, bg: "bg-accent-teal" },
                { title: "Funny Moment Detected", desc: "In Live Stream - Q&A", time: "00:41:03 - 00:41:45", icon: Smile, bg: "bg-secondary" }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-3 border-4 border-black shadow-neu hover:translate-y-[-2px] hover:translate-x-[-2px] transition-all bg-background cursor-pointer">
                  <div className={`w-12 h-12 border-2 border-black flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${item.bg}`}>
                    <item.icon className="w-6 h-6 text-black" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-black uppercase">{item.title}</h4>
                    <p className="text-xs font-bold text-black mt-1 bg-white border-2 border-black inline-block px-1">{item.desc}</p>
                    <p className="text-xs font-black text-black mt-1 uppercase">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
