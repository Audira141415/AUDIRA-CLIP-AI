'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Video, Scissors, Check, ChevronDown } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black font-sans selection:bg-[#F5A623] selection:text-black overflow-x-hidden">
      
      {/* Neo-brutalist Navbar */}
      <nav className="w-full bg-white border-b-4 border-black px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 bg-[#F5A623] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-4 h-4 bg-black" />
          </div>
          <h1 className="font-black text-2xl tracking-tighter text-black flex items-center gap-1.5 uppercase">
            AUDIRA <span className="bg-[#FFEDF4] text-black px-1.5 py-0.5 border-2 border-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">CLIP</span>
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-8 font-black uppercase tracking-wider text-sm">
          <Link href="#features" className="hover:underline decoration-4 underline-offset-4 decoration-[#F5A623]">Features</Link>
          <Link href="#pricing" className="hover:underline decoration-4 underline-offset-4 decoration-[#F5A623]">Pricing</Link>
          <Link href="#faq" className="hover:underline decoration-4 underline-offset-4 decoration-[#F5A623]">FAQ</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="font-black uppercase text-sm border-2 border-transparent hover:border-black px-4 py-2 transition-all">
            Log In
          </Link>
          <Link href="/dashboard" className="bg-[#F5A623] text-black border-2 border-black font-black uppercase text-sm px-5 py-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
            Go to App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Copy */}
        <div className="space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#FFEDF4] border-2 border-black px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Zap className="w-4 h-4 text-black fill-current" />
            <span className="font-black uppercase text-xs tracking-wider">Powered by Local AI Models</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter">
            Cut Videos <br />
            <span className="bg-[#F5A623] px-2 border-4 border-black inline-block mt-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg]">Like Magic.</span>
          </h1>
          
          <p className="text-xl md:text-2xl font-bold max-w-lg border-l-4 border-black pl-4">
            Audira Clip uses advanced AI (Qwen, DeepSeek) to automatically find viral moments and clip your long-form videos. No cloud required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/dashboard" className="bg-[#FFEDF4] text-black border-4 border-black font-black uppercase text-xl px-8 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-3 group">
              Start Clipping
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </Link>
            <Link href="#demo" className="bg-white text-black border-4 border-black font-black uppercase text-xl px-8 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-3">
              <Video className="w-6 h-6" strokeWidth={3} /> Watch Demo
            </Link>
          </div>
        </div>

        {/* Right: Generated Image */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Decorative background blocks */}
          <div className="absolute inset-0 bg-[#00E5FF] border-4 border-black translate-x-6 translate-y-6"></div>
          <div className="absolute inset-0 bg-[#FFEDF4] border-4 border-black translate-x-3 translate-y-3"></div>
          
          {/* The generated Hero Image */}
          <div className="relative border-4 border-black bg-white overflow-hidden aspect-square flex items-center justify-center">
            {/* Fallback pattern if image is missing, but it should load */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            <img 
              src="/hero.png" 
              alt="Neo Brutalist AI Video Editor" 
              className="w-full h-full object-cover relative z-10 mix-blend-multiply"
            />
          </div>

          {/* Floating decorative elements */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute -top-8 -right-8 bg-[#F5A623] w-20 h-20 border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <Scissors className="w-8 h-8 text-black" strokeWidth={3} />
          </motion.div>
        </motion.div>

      </main>

      {/* Marquee Banner */}
      <div className="w-full bg-[#F5A623] border-y-4 border-black py-4 overflow-hidden flex whitespace-nowrap">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="flex font-black text-2xl uppercase tracking-widest gap-8"
        >
          <span>✦ 100% LOCAL PROCESSING</span>
          <span>✦ NO DATA LEAKS</span>
          <span>✦ UNLIMITED EXPORTS</span>
          <span>✦ DEEPSEEK & QWEN POWERED</span>
          <span>✦ 100% LOCAL PROCESSING</span>
          <span>✦ NO DATA LEAKS</span>
          <span>✦ UNLIMITED EXPORTS</span>
          <span>✦ DEEPSEEK & QWEN POWERED</span>
        </motion.div>
      </div>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black uppercase mb-4">Killer Features.</h2>
          <p className="text-xl font-bold max-w-2xl mx-auto">Everything you need to go viral, running completely offline on your own hardware.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:-translate-x-2 transition-transform">
            <div className="aspect-video w-full border-4 border-black mb-6 bg-[#FFEDF4] overflow-hidden">
              <img src="/feature_clipping.png" alt="AI Auto-Clipping" className="w-full h-full object-cover mix-blend-multiply" />
            </div>
            <h3 className="text-2xl font-black uppercase mb-2">AI Auto-Clipping</h3>
            <p className="font-bold text-gray-700">DeepSeek and Qwen automatically scrub through your 2-hour podcast and extract the 3 most engaging, viral moments.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:-translate-x-2 transition-transform">
            <div className="aspect-video w-full border-4 border-black mb-6 bg-[#00E5FF] overflow-hidden">
              <img src="/feature_subtitles.png" alt="Multi-Language Subtitles" className="w-full h-full object-cover mix-blend-multiply" />
            </div>
            <h3 className="text-2xl font-black uppercase mb-2">Dynamic Subtitles</h3>
            <p className="font-bold text-gray-700">Auto-generate perfectly synced subtitles in 50+ languages with bold, trendy animations (Hormozi style) built-in.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:-translate-x-2 transition-transform">
            <div className="aspect-video w-full border-4 border-black mb-6 bg-[#F5A623] overflow-hidden">
              <img src="/feature_privacy.png" alt="100% Local Privacy" className="w-full h-full object-cover mix-blend-multiply" />
            </div>
            <h3 className="text-2xl font-black uppercase mb-2">Absolute Privacy</h3>
            <p className="font-bold text-gray-700">Your video files never leave your computer. Everything runs locally on your GPU/CPU. Zero API costs, zero data leaks.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-[#00E5FF] border-y-4 border-black py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-black uppercase mb-4">Pay Once. Clip Forever.</h2>
          <p className="text-xl font-bold max-w-2xl mx-auto mb-16">No recurring cloud subscription fees. You own the software.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left">
              <h3 className="text-3xl font-black uppercase mb-2">Starter</h3>
              <p className="font-bold text-gray-600 mb-6">For casual creators and enthusiasts.</p>
              <div className="text-6xl font-black mb-8">$0<span className="text-xl">/forever</span></div>
              <ul className="space-y-4 font-bold mb-8">
                <li className="flex gap-3 items-center"><Check className="w-6 h-6 text-[#F5A623]" strokeWidth={3} /> Max 10 minutes video length</li>
                <li className="flex gap-3 items-center"><Check className="w-6 h-6 text-[#F5A623]" strokeWidth={3} /> Basic AI Models (8B params)</li>
                <li className="flex gap-3 items-center"><Check className="w-6 h-6 text-[#F5A623]" strokeWidth={3} /> Standard Export Quality</li>
              </ul>
              <Link href="/dashboard" className="block w-full bg-white text-black border-4 border-black font-black uppercase text-xl px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-center">
                Get Started
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-[#FFEDF4] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left relative transform md:-translate-y-4">
              <div className="absolute top-0 right-0 bg-[#F5A623] border-l-4 border-b-4 border-black px-4 py-1 font-black uppercase text-sm">Best Value</div>
              <h3 className="text-3xl font-black uppercase mb-2">Pro License</h3>
              <p className="font-bold text-gray-600 mb-6">For professional agencies and power users.</p>
              <div className="text-6xl font-black mb-8">$99<span className="text-xl">/lifetime</span></div>
              <ul className="space-y-4 font-bold mb-8">
                <li className="flex gap-3 items-center"><Check className="w-6 h-6 text-[#00E5FF]" strokeWidth={3} /> Unlimited video length</li>
                <li className="flex gap-3 items-center"><Check className="w-6 h-6 text-[#00E5FF]" strokeWidth={3} /> Pro AI Models (32B+ params)</li>
                <li className="flex gap-3 items-center"><Check className="w-6 h-6 text-[#00E5FF]" strokeWidth={3} /> 4K Ultra HD Exports</li>
                <li className="flex gap-3 items-center"><Check className="w-6 h-6 text-[#00E5FF]" strokeWidth={3} /> Custom Subtitle Fonts</li>
              </ul>
              <Link href="/dashboard" className="block w-full bg-[#F5A623] text-black border-4 border-black font-black uppercase text-xl px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-center">
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-24">
        <h2 className="text-5xl font-black uppercase mb-12 text-center">Got Questions?</h2>
        <div className="space-y-4">
          {[
            { q: "What hardware do I need to run Audira Clip?", a: "For the best experience, we recommend an NVIDIA GPU with at least 8GB of VRAM to run the 8B models efficiently. However, you can also run it on CPU (though much slower)." },
            { q: "Do I need an internet connection?", a: "Only once to download the AI models! After that, you can take your laptop to a cabin in the woods and clip videos offline forever." },
            { q: "Can I use external APIs if my PC is slow?", a: "Yes! You can plug in your OpenAI, Grok, or Anthropic API keys in the settings to offload the heavy AI thinking to the cloud." }
          ].map((faq, i) => (
            <details key={i} className="group bg-white border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] open:bg-[#FFF8EB] transition-colors cursor-pointer">
              <summary className="flex justify-between items-center font-black text-xl uppercase list-none">
                {faq.q}
                <ChevronDown className="w-6 h-6 group-open:rotate-180 transition-transform" strokeWidth={3} />
              </summary>
              <p className="mt-4 font-bold text-gray-700 border-t-2 border-black pt-4">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t-4 border-[#F5A623]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-black text-2xl uppercase tracking-tighter">AUDIRA CLIP</div>
          <p className="font-bold text-gray-400 text-sm">© 2026 Audira Clip. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
