import DashboardLayout from "@/components/layout/DashboardLayout";

export default function AICopilot() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        <div className="mb-6 shrink-0">
          <h2 className="text-3xl font-heading font-bold text-white tracking-tight">AI Copilot</h2>
          <p className="text-gray-400 mt-1">Chat with your intelligent editing assistant.</p>
        </div>

        <div className="flex-1 bg-card border border-white/5 rounded-3xl flex flex-col overflow-hidden shadow-2xl min-h-0">
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* Message */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex flex-shrink-0 items-center justify-center border border-primary/30">
                🤖
              </div>
              <div className="bg-surface border border-white/5 rounded-2xl rounded-tl-none p-4 text-sm text-gray-300 max-w-[80%] leading-relaxed">
                Hello! I'm Audira Copilot. I can help you write viral descriptions, generate hashtags, or advise you on which clips to post based on current trends. What are we working on today?
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-surface/50 border-t border-white/5">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask Copilot for engaging captions..." 
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-primary transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
