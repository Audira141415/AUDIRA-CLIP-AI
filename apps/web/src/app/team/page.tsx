import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Team() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-heading font-bold text-white tracking-tight">Team Workspace</h2>
            <p className="text-gray-400 mt-1">Collaborate with editors and social media managers.</p>
          </div>
          <button className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2 rounded-lg transition-colors border border-white/10">
            + Invite Member
          </button>
        </div>

        <div className="bg-card border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex items-center justify-between hover:bg-surface/30">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-black font-bold">
                YO
              </div>
              <div>
                <p className="text-white font-medium">You (Admin)</p>
                <p className="text-sm text-gray-500">admin@audiraclip.ai</p>
              </div>
            </div>
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">Owner</span>
          </div>
          
          <div className="p-12 text-center text-gray-500 font-medium">
            No other team members yet. Invite your team to collaborate on video projects.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
