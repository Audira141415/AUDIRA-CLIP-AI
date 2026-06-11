import Link from "next/link";

export default function Topbar() {
  return (
    <header className="h-16 bg-white flex items-center justify-between px-8 sticky top-0 z-10 border-b-4 border-black">
      <div className="flex items-center w-1/2">
        <div className="relative w-full max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            placeholder="Search videos, clips, projects..." 
            className="w-full bg-white border-2 border-black rounded-none py-2 pl-9 pr-4 text-sm text-black placeholder:text-gray-600 font-bold focus:outline-none focus:shadow-neu transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-black hover:text-primary hover:scale-110 transition-transform">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>
        <button className="text-black hover:text-primary hover:scale-110 transition-transform relative">
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-black" />
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </button>
        <Link href="/upload" className="bg-primary text-black text-sm font-black px-5 py-2.5 ml-2 flex items-center gap-2 border-2 border-black shadow-neu hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-neu-hover active:translate-y-[4px] active:translate-x-[4px] active:shadow-neu-active transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
          UPLOAD
        </Link>
      </div>
    </header>
  );
}
