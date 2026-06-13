'use client';

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Play, Clock, Video, Users, Download, Calendar, ArrowUpRight, ArrowDownRight, Globe2, Monitor, Smartphone, Monitor as Tv, Tablet, Laptop, BarChart3, TrendingUp, ChevronRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

export default function AnalyticsPage() {
  const metrics = [
    { title: "Total Views", value: "128.4K", trend: "+ 18.6%", up: true, icon: Play, bg: "bg-[#00E5FF]" },
    { title: "Watch Time", value: "342.7 h", trend: "+ 24.3%", up: true, icon: Clock, bg: "bg-[#F5A623]" },
    { title: "Total Videos", value: "156", trend: "+ 12.5%", up: true, icon: Video, bg: "bg-[#FFEDF4]" },
    { title: "Engagement Rate", value: "8.7%", trend: "+ 2.1%", up: true, icon: Users, bg: "bg-[#D8B4E2]" },
    { title: "Exports", value: "894", trend: "+ 15.2%", up: true, icon: Download, bg: "bg-white" }
  ];

  const topVideos = [
    { title: "AI Tools for Video Editing", duration: "02:45", views: "32.1K", eng: "12.4%", color: "bg-[#F5A623]" },
    { title: "How to Edit Faster in 2024", duration: "03:12", views: "21.8K", eng: "9.8%", color: "bg-[#00E5FF]" },
    { title: "Cinematic B-Roll Tips", duration: "04:05", views: "18.7K", eng: "8.6%", color: "bg-[#FFEDF4]" },
    { title: "Social Media Clip (Real)", duration: "00:59", views: "15.2K", eng: "11.1%", color: "bg-[#D8B4E2]" },
    { title: "Color Grading Basics", duration: "05:30", views: "12.6K", eng: "7.3%", color: "bg-black" }
  ];

  const traffic = [
    { source: "YouTube", percent: "38.6%", color: "bg-[#F5A623]" },
    { source: "Instagram", percent: "26.7%", color: "bg-[#FFEDF4]" },
    { source: "TikTok", percent: "15.4%", color: "bg-[#00E5FF]" },
    { source: "Facebook", percent: "9.8%", color: "bg-[#D8B4E2]" },
    { source: "Other", percent: "9.5%", color: "bg-gray-300" }
  ];

  const devices = [
    { source: "Desktop", percent: "52.1%", color: "bg-[#F5A623]" },
    { source: "Mobile", percent: "38.7%", color: "bg-[#FFEDF4]" },
    { source: "Tablet", percent: "6.4%", color: "bg-[#00E5FF]" },
    { source: "TV", percent: "2.8%", color: "bg-[#D8B4E2]" }
  ];

  const geo = [
    { country: "Indonesia", percent: "42.1%", w: "w-[42%]" },
    { country: "United States", percent: "18.3%", w: "w-[18%]" },
    { country: "India", percent: "9.7%", w: "w-[10%]" },
    { country: "Brazil", percent: "6.2%", w: "w-[6%]" },
    { country: "United Kingdom", percent: "4.8%", w: "w-[5%]" }
  ];

  const team = [
    { name: "Dewi Lestari", avatar: "D", created: 28, views: "45.2K", watch: "120.4 h", eng: "9.1%", exp: 312, trend: "+ 14.2%" },
    { name: "Rizky Pratama", avatar: "R", created: 36, views: "38.7K", watch: "98.6 h", eng: "8.3%", exp: 287, trend: "+ 9.7%" },
    { name: "Ardiansyah Utomo", avatar: "A", created: 24, views: "26.1K", watch: "67.3 h", eng: "7.8%", exp: 195, trend: "+ 11.3%" },
    { name: "Siti Aisyah", avatar: "S", created: 18, views: "18.4K", watch: "46.5 h", eng: "8.9%", exp: 100, trend: "+ 6.2%" },
    { name: "Bagus Setiawan", avatar: "B", created: 12, views: "12.3K", watch: "29.9 h", eng: "7.1%", exp: 58, trend: "- 3.4%" }
  ];

  return (
    <DashboardLayout>
      <div className="min-h-full bg-[#FAFAFA] text-black font-sans -m-8 p-8 relative overflow-x-hidden">
        
        {/* Background Dot Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-8">
          
          <PageHero
            title="Analytics"
            description="Track your content performance and team productivity."
            imageSrc="/images/hero_analytics.png"
            imageAlt="Analytics Hero"
            rightContent={
              <>
                <button className="flex items-center gap-2 bg-white border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <Calendar className="w-4 h-4" strokeWidth={3} /> May 1 - May 31, 2026
                </button>
                <button className="flex items-center gap-2 bg-[#F5A623] border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <Download className="w-4 h-4" strokeWidth={3} /> Export Report
                </button>
              </>
            }
          />

          {/* Tabs */}
          <div className="flex border-b-4 border-black overflow-x-auto no-scrollbar">
            {["Overview", "Content", "Audience", "Team", "Engagement", "Export"].map((tab, i) => (
              <button key={i} className={`px-6 py-3 font-black uppercase text-sm whitespace-nowrap -mb-1 transition-all ${i === 0 ? 'border-b-4 border-[#F5A623] text-black' : 'text-gray-500 hover:text-black hover:border-b-4 hover:border-black font-bold'}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {metrics.map((m, i) => (
              <div key={i} className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex flex-col justify-between">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 border-4 border-black flex items-center justify-center ${m.bg} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                    <m.icon className={`w-6 h-6 ${m.bg === 'bg-black' ? 'text-white' : 'text-black'}`} strokeWidth={3} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase text-gray-500 mb-1">{m.title}</h3>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-black">{m.value}</span>
                    <span className={`text-xs font-black flex items-center gap-0.5 ${m.up ? 'text-green-600' : 'text-red-600'}`}>
                      {m.up ? <ArrowUpRight className="w-3 h-3" strokeWidth={4} /> : <ArrowDownRight className="w-3 h-3" strokeWidth={4} />}
                      {m.trend}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Views Over Time */}
            <div className="lg:col-span-2 bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-black uppercase text-xl">Views Over Time</h2>
                  <div className="flex gap-4 mt-2 text-xs font-black">
                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-[#00E5FF] border-2 border-black"></div> Views</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-[#F5A623] border-2 border-black"></div> Watch Time</span>
                  </div>
                </div>
                <select className="bg-white border-4 border-black px-3 py-1 font-black text-sm uppercase outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <option>Daily</option>
                  <option>Weekly</option>
                </select>
              </div>
              
              {/* Fake Neo-Brutalist Bar Chart */}
              <div className="flex-1 min-h-[250px] flex items-end justify-between gap-1 pt-8 border-l-4 border-b-4 border-black pl-2 pb-2 relative">
                {/* Y-axis labels */}
                <div className="absolute left-[-30px] top-0 bottom-0 flex flex-col justify-between text-[10px] font-black text-gray-500">
                  <span>40K</span><span>30K</span><span>20K</span><span>10K</span><span>0</span>
                </div>
                
                {/* Bars */}
                {Array.from({ length: 20 }).map((_, i) => {
                  const h1 = 20 + (i * 17 % 60);
                  const h2 = 10 + (i * 23 % 40);
                  return (
                    <div key={i} className="flex-1 flex flex-col justify-end gap-1 group relative">
                      <div className="w-full bg-[#00E5FF] border-2 border-black hover:bg-[#F5A623] transition-colors relative z-10" style={{ height: `${h1}%` }}></div>
                      <div className="w-full bg-[#F5A623] border-2 border-black opacity-80" style={{ height: `${h2}%` }}></div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] font-black text-gray-500 mt-2 px-2 uppercase">
                <span>May 1</span><span>May 8</span><span>May 15</span><span>May 22</span><span>May 31</span>
              </div>
            </div>

            {/* Top Performing Videos */}
            <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col">
               <div className="flex justify-between items-center mb-6">
                <h2 className="font-black uppercase text-xl">Top Videos</h2>
                <button className="text-xs font-black uppercase text-[#F5A623] hover:underline decoration-2">View all</button>
              </div>
              
              <div className="flex text-xs font-black text-gray-500 uppercase border-b-4 border-black pb-2 mb-4">
                <div className="w-[60%]">Video</div>
                <div className="w-[20%] text-right">Views</div>
                <div className="w-[20%] text-right">Eng</div>
              </div>

              <div className="space-y-4 flex-1">
                {topVideos.map((v, i) => (
                  <div key={i} className="flex items-center gap-3 group cursor-pointer">
                    <div className={`w-12 h-10 border-2 border-black shrink-0 relative overflow-hidden ${v.color}`}>
                       <div className="absolute bottom-0 right-0 bg-black text-white text-[8px] font-black px-1 border-t-2 border-l-2 border-black">{v.duration}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-sm truncate group-hover:text-[#F5A623] transition-colors">{v.title}</h4>
                    </div>
                    <div className="w-[20%] text-right font-black text-sm">{v.views}</div>
                    <div className="w-[20%] text-right font-bold text-sm text-gray-600">{v.eng}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Charts Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Audience Retention */}
            <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="font-black uppercase text-lg mb-6">Audience Retention</h2>
              <div className="flex justify-between mb-6 border-b-2 border-black pb-4">
                <div>
                  <div className="text-[10px] font-black uppercase text-gray-500">Average</div>
                  <div className="text-2xl font-black">58% <span className="text-xs text-green-500">+6.3%</span></div>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-gray-500">Drop-off</div>
                  <div className="text-2xl font-black">2:15 <span className="text-xs text-red-500">+8.2%</span></div>
                </div>
              </div>
              
              {/* Stepped Retention Line */}
              <div className="h-32 border-l-4 border-b-4 border-black relative flex items-end">
                <div className="absolute top-0 left-0 text-[10px] font-black -ml-8">100%</div>
                <div className="absolute bottom-0 left-0 text-[10px] font-black -ml-6">0%</div>
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <polyline points="0,0 20,40 40,50 60,70 80,80 100,90" fill="none" stroke="#F5A623" strokeWidth="4" />
                </svg>
                {/* Drop-off marker */}
                <div className="absolute left-[40%] top-0 bottom-0 border-l-2 border-dashed border-red-500 flex justify-center">
                  <div className="bg-white border-2 border-black text-[10px] font-black px-1 -mt-3 absolute text-red-500">2:15</div>
                </div>
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="font-black uppercase text-lg mb-6">Traffic Sources</h2>
              <div className="flex items-center gap-6">
                {/* Fake Donut */}
                <div className="w-24 h-24 rounded-full border-4 border-black shrink-0 relative flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ background: 'conic-gradient(#F5A623 0% 38%, #FFEDF4 38% 65%, #00E5FF 65% 80%, #D8B4E2 80% 90%, #D1D5DB 90% 100%)' }}>
                  <div className="w-12 h-12 bg-white rounded-full border-4 border-black"></div>
                </div>
                <div className="flex-1 space-y-2">
                  {traffic.map((t, i) => (
                    <div key={i} className="flex justify-between items-center text-xs font-black uppercase">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 border-2 border-black ${t.color}`}></div>
                        <span>{t.source}</span>
                      </div>
                      <span>{t.percent}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Geographic Distribution */}
            <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col">
              <h2 className="font-black uppercase text-lg mb-4 flex items-center gap-2">
                <Globe2 className="w-5 h-5" /> Top Regions
              </h2>
              <div className="space-y-4 flex-1">
                {geo.map((g, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-black uppercase">
                      <span>{g.country}</span>
                      <span>{g.percent}</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 border-2 border-black">
                      <div className={`h-full bg-[#00E5FF] border-r-2 border-black ${g.w}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Team Performance Table */}
          <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black uppercase text-xl">Team Performance</h2>
              <button className="text-xs font-black uppercase text-[#F5A623] hover:underline decoration-2 flex items-center gap-1">
                View full report <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[#FAFAFA] border-y-4 border-black text-xs font-black uppercase">
                    <th className="p-4 border-r-2 border-black">Member</th>
                    <th className="p-4 border-r-2 border-black text-center">Videos Created</th>
                    <th className="p-4 border-r-2 border-black text-right">Views</th>
                    <th className="p-4 border-r-2 border-black text-right">Watch Time</th>
                    <th className="p-4 border-r-2 border-black text-right">Eng. Rate</th>
                    <th className="p-4 border-l-2 border-black text-right">Exports</th>
                  </tr>
                </thead>
                <tbody className="font-bold text-sm">
                  {team.map((t, i) => (
                    <tr key={i} className="border-b-2 border-gray-200 hover:bg-[#FFF8EB] transition-colors group">
                      <td className="p-4 border-r-2 border-gray-200 group-hover:border-black flex items-center gap-3">
                        <div className="w-8 h-8 bg-black text-[#F5A623] flex items-center justify-center font-black border-2 border-black">
                          {t.avatar}
                        </div>
                        <span className="font-black">{t.name}</span>
                      </td>
                      <td className="p-4 border-r-2 border-gray-200 group-hover:border-black text-center font-black text-lg">
                        {t.created}
                      </td>
                      <td className="p-4 border-r-2 border-gray-200 group-hover:border-black text-right">
                        {t.views}
                      </td>
                      <td className="p-4 border-r-2 border-gray-200 group-hover:border-black text-right">
                        {t.watch}
                      </td>
                      <td className="p-4 border-r-2 border-gray-200 group-hover:border-black text-right">
                        {t.eng}
                      </td>
                      <td className="p-4 flex items-center justify-end gap-4">
                        <span>{t.exp}</span>
                        {/* Mini Bar Chart */}
                        <div className="w-16 h-3 bg-gray-100 border-2 border-black shrink-0">
                          <div className="h-full bg-[#F5A623] border-r-2 border-black" style={{ width: `${(t.exp/400)*100}%` }}></div>
                        </div>
                        <span className={`text-[10px] w-12 text-right ${t.trend.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {t.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
