import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-heading font-bold text-white tracking-tight">Settings</h2>
          <p className="text-gray-400 mt-1">Manage your workspace, API keys, and billing.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Settings Nav */}
          <aside className="w-full md:w-48 shrink-0 space-y-1">
            {['Profile', 'Workspace', 'API Keys', 'Billing & Plans', 'Team Members'].map((tab, i) => (
              <button key={tab} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${i === 3 ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                {tab}
              </button>
            ))}
          </aside>

          {/* Settings Content */}
          <main className="flex-1 space-y-6">
            <div className="bg-card border border-white/5 rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-xl font-heading font-bold text-white">Current Plan: Pro</h3>
                  <p className="text-sm text-gray-400 mt-1">You are currently on the Pro Tier. Next billing on Oct 1, 2026.</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-heading font-bold text-white">$49<span className="text-sm text-gray-500 font-sans">/mo</span></div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">AI Minutes Used</span>
                  <span className="text-white font-medium">850 / 1000 mins</span>
                </div>
                <div className="w-full h-2 bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-[85%]" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Storage Used</span>
                  <span className="text-white font-medium">250 GB / 1 TB</span>
                </div>
                <div className="w-full h-2 bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full w-[25%]" />
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors">
                  Manage Subscription
                </button>
                <button className="flex-1 bg-surface border border-white/10 text-white font-semibold py-3 rounded-xl hover:bg-white/5 transition-colors">
                  View Invoices
                </button>
              </div>
            </div>

            <div className="bg-card border border-white/5 rounded-3xl p-8 shadow-xl">
              <h3 className="text-lg font-heading font-bold text-white mb-4">Enterprise Upgrade</h3>
              <p className="text-sm text-gray-400 mb-6">Need more power? Upgrade to Enterprise for unlimited 4K cloud rendering, custom API limits, and dedicated support.</p>
              <button className="bg-gradient-to-r from-primary to-secondary text-background font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
                Contact Sales
              </button>
            </div>
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}
