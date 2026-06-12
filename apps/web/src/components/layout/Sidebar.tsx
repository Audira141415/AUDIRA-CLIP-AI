"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname() || "";

  const menus = [
    { name: "DASHBOARD", href: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "VIDEO LIBRARY", href: "/library", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
    { name: "EDITOR", href: "/editor", icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" },
    { name: "SUBTITLE STUDIO", href: "/subtitles", icon: "M4 6h16M4 12h8m-8 6h16" },
    { name: "AI RETRAINING", href: "/reframe", icon: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" },
    { name: "RENDER QUEUE", href: "/renders", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
    { name: "ANALYTICS", href: "/analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { name: "TEAM", href: "/team", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { name: "AI COPILOT", href: "/copilot", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
    { name: "SETTINGS", href: "/settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white h-screen flex flex-col py-6 px-5 sticky top-0 z-50 border-r-4 border-black">
      {/* Logo Area */}
      <div className="flex items-center gap-3 mb-12 px-1 cursor-pointer">
        <div className="w-9 h-9 bg-[#F5A623] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-3.5 h-3.5 bg-black" />
        </div>
        <h1 className="font-black text-2xl tracking-tighter text-black flex items-center gap-1.5 uppercase">
          AUDIRA <span className="bg-[#FFEDF4] text-black px-1.5 py-0.5 border-2 border-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">CLIP</span>
        </h1>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-3 overflow-y-auto pb-8 pr-2 custom-scrollbar">
        {menus.map((menu) => {
          const isActive = pathname === menu.href || (menu.href !== "/" && pathname.startsWith(menu.href));
          return (
            <Link
              key={menu.name}
              href={menu.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-black uppercase tracking-wider transition-all duration-150 ${
                isActive
                  ? "bg-[#F5A623] text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-[2px] -translate-x-[2px]"
                  : "bg-white text-black border-2 border-transparent hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[2px] hover:-translate-x-[2px]"
              }`}
            >
              <svg className={`w-5 h-5 shrink-0 ${isActive ? 'text-black' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2.5" d={menu.icon} />
              </svg>
              {menu.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
