'use client';

import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { LogOut, User, Settings } from 'lucide-react';

export default function Topbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-20 bg-[#FAFAFA] flex items-center justify-end px-8 sticky top-0 z-10 border-b border-gray-100">
      <div className="flex items-center gap-6">
        <button className="text-gray-500 hover:text-gray-900 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button className="text-gray-500 hover:text-gray-900 transition-colors relative">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        
        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-8 h-8 bg-[#F5A623] rounded-full flex items-center justify-center text-black font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
              AU
            </div>
            <svg className={`w-4 h-4 text-gray-500 group-hover:text-black transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-4 w-56 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black py-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b-2 border-black mb-1 bg-[#FAFAFA]">
                <p className="text-sm font-black text-black uppercase">Audira User</p>
                <p className="text-xs font-bold text-gray-500 truncate mt-1">user@audira.com</p>
              </div>
              
              <button className="w-full text-left px-4 py-3 text-sm font-black uppercase text-gray-700 hover:bg-[#00E5FF] hover:text-black flex items-center gap-3 transition-colors border-b-2 border-transparent hover:border-black">
                <User className="w-4 h-4" strokeWidth={3} /> Profile
              </button>
              
              <button className="w-full text-left px-4 py-3 text-sm font-black uppercase text-gray-700 hover:bg-[#FFEDF4] hover:text-black flex items-center gap-3 transition-colors border-b-2 border-transparent hover:border-black">
                <Settings className="w-4 h-4" strokeWidth={3} /> Settings
              </button>
              
              <div className="h-1 bg-black my-1"></div>
              
              <button 
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full text-left px-4 py-3 text-sm font-black uppercase text-white bg-red-500 hover:bg-red-600 flex items-center gap-3 transition-colors"
              >
                <LogOut className="w-4 h-4" strokeWidth={3} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
