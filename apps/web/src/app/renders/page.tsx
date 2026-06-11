import DashboardLayout from "@/components/layout/DashboardLayout";

export default function RenderQueue() {
  const jobs = [
    { id: "R-882", name: "TikTok Shorts Batch 1", status: "Processing", progress: 65, time: "2 mins left" },
    { id: "R-881", name: "IG Reel - Q3 Earnings", status: "Processing", progress: 30, time: "5 mins left" },
    { id: "R-880", name: "YouTube 4K Export", status: "Completed", progress: 100, time: "Done" },
    { id: "R-879", name: "Podcast Clips (Auto)", status: "Failed", progress: 0, time: "Error" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-heading font-bold text-white tracking-tight">Render Queue</h2>
            <p className="text-gray-400 mt-1">Monitor background AI tasks and export status.</p>
          </div>
          <div className="flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-lg font-medium text-sm">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Cloud Engine Online
          </div>
        </div>

        <div className="bg-card border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-surface/50">
            <div className="col-span-2">Task ID</div>
            <div className="col-span-5">Job Name</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Progress</div>
          </div>
          <div className="divide-y divide-white/5">
            {jobs.map((job) => (
              <div key={job.id} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-surface/30 transition-colors group">
                <div className="col-span-2 font-mono text-xs text-gray-400">{job.id}</div>
                <div className="col-span-5 font-medium text-white">{job.name}</div>
                <div className="col-span-2">
                  <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider ${
                    job.status === 'Processing' ? 'bg-primary/10 text-primary border border-primary/20' :
                    job.status === 'Completed' ? 'bg-success/10 text-success border border-success/20' :
                    'bg-danger/10 text-danger border border-danger/20'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <div className="col-span-3 flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{job.progress}%</span>
                    <span>{job.time}</span>
                  </div>
                  <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        job.status === 'Failed' ? 'bg-danger' : 
                        job.progress === 100 ? 'bg-success' : 'bg-gradient-to-r from-primary to-secondary'
                      }`}
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
