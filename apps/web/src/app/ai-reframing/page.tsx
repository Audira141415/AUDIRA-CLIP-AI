import DashboardLayout from "@/components/layout/DashboardLayout";

export default function AIReframing() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-heading font-bold text-white tracking-tight">AI Reframing</h2>
          <p className="text-gray-400 mt-1">Intelligent auto-cropping and active speaker tracking.</p>
        </div>
        
        <div className="bg-card border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl min-h-[400px]">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </div>
          <h3 className="text-xl font-heading font-bold text-white mb-2">Auto-Framing Engine</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            Upload a landscape video to let our AI automatically track faces and reframe it into vertical 9:16 format for TikTok and Reels.
          </p>
          <button className="bg-primary text-black font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors">
            Select Video to Reframe
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
