'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Video, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('john@audira.clip');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate a network request for effect
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black font-sans selection:bg-[#F5A623] selection:text-black flex flex-col items-center justify-center relative px-6">
      {/* Background Dot Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
      
      {/* Massive Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] md:text-[20rem] font-black text-transparent opacity-10 pointer-events-none select-none z-[-1] whitespace-nowrap" style={{ WebkitTextStroke: '2px black' }}>
        ACCESS
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Logo Return Link */}
        <Link href="/" className="inline-flex items-center gap-3 mb-8 hover:-translate-y-1 hover:-translate-x-1 transition-transform group">
          <div className="w-10 h-10 bg-[#F5A623] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="w-4 h-4 bg-black" />
          </div>
          <h1 className="font-black text-2xl tracking-tighter text-black flex items-center gap-1.5 uppercase">
            AUDIRA <span className="bg-[#FFEDF4] text-black px-1.5 py-0.5 border-2 border-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">CLIP</span>
          </h1>
        </Link>

        {/* Login Box */}
        <div className="bg-white border-4 border-black p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-shadow">
          <h2 className="text-4xl font-black uppercase mb-2">Welcome Back</h2>
          <p className="font-bold text-gray-600 mb-8">Enter your credentials to access your local workspace.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block font-black uppercase text-sm">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAFAFA] border-4 border-black p-4 font-bold outline-none focus:bg-[#FFF8EB] focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block font-black uppercase text-sm">Password</label>
                <a href="#" className="font-bold text-xs underline decoration-2 hover:text-[#F5A623]">Forgot?</a>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAFAFA] border-4 border-black p-4 font-bold outline-none focus:bg-[#FFEDF4] focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Warning Message (Mock) */}
            <div className="bg-[#00E5FF] border-2 border-black p-3 text-xs font-bold flex items-start gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={3} />
              <span>Because this is a local build, any credentials will log you into the admin dashboard immediately.</span>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#F5A623] text-black border-4 border-black font-black uppercase text-xl px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#FFEDF4] transition-all flex items-center justify-center gap-3 group disabled:opacity-70"
            >
              {isLoading ? 'Authenticating...' : 'Log In'}
              {!isLoading && <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" strokeWidth={3} />}
            </button>
          </form>
        </div>
        
        <p className="text-center font-bold text-sm mt-8">
          Don't have a license? <Link href="/#pricing" className="underline decoration-2 hover:text-[#F5A623]">Buy Now</Link>
        </p>

      </div>
    </div>
  );
}
