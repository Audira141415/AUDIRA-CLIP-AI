'use client';
import { useState } from 'react';

export default function SocialExport() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const platforms = [
    { id: 'tiktok', name: 'TikTok', color: 'bg-black border-gray-700', hover: 'hover:border-gray-500' },
    { id: 'youtube', name: 'YouTube Shorts', color: 'bg-red-600/20 border-red-500/50', hover: 'hover:border-red-500' },
    { id: 'instagram', name: 'Instagram Reels', color: 'bg-pink-600/20 border-pink-500/50', hover: 'hover:border-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Social Export
          </h1>
          <p className="text-gray-400 mt-2">Publish your clips directly to social media.</p>
        </header>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">1. Select Platform</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`p-4 rounded-xl border transition-all text-left ${platform.color} ${platform.hover} ${
                    selectedPlatform === platform.id ? 'ring-2 ring-white scale-105' : 'opacity-70'
                  }`}
                >
                  <div className="font-medium text-lg">{platform.name}</div>
                  <div className="text-sm text-gray-400 mt-1">Not connected</div>
                </button>
              ))}
            </div>
            {selectedPlatform && (
              <button className="mt-4 px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Connect {platforms.find(p => p.id === selectedPlatform)?.name} Account
              </button>
            )}
          </div>

          <div className="border-t border-white/10 pt-6">
            <h2 className="text-xl font-semibold mb-4">2. Post Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Caption</label>
                <textarea
                  rows={4}
                  placeholder="Write an engaging caption..."
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex gap-4">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-xl py-3 font-medium transition-colors opacity-50 cursor-not-allowed">
                  Publish Now
                </button>
                <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 font-medium transition-colors opacity-50 cursor-not-allowed">
                  Schedule Post
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center">Connect an account first to enable publishing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
