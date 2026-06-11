import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-heading font-bold text-white tracking-tight">Performance Analytics</h2>
          <p className="text-gray-400 mt-1">Track the virality of your generated clips.</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-card border border-white/5 rounded-3xl p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Total Views</h3>
            <p className="text-4xl font-bold text-white">1.2M</p>
            <p className="text-success text-sm mt-2 font-medium">↑ 24% this week</p>
          </div>
          <div className="bg-card border border-white/5 rounded-3xl p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Clips Generated</h3>
            <p className="text-4xl font-bold text-white">48</p>
            <p className="text-success text-sm mt-2 font-medium">↑ 12 new clips</p>
          </div>
          <div className="bg-card border border-white/5 rounded-3xl p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Avg. Virality Score</h3>
            <p className="text-4xl font-bold text-primary">92/100</p>
            <p className="text-success text-sm mt-2 font-medium">Top 5% of users</p>
          </div>
        </div>

        <div className="bg-card border border-white/5 rounded-3xl p-8 min-h-[300px] flex items-center justify-center border-dashed">
          <p className="text-gray-500 font-medium">Interactive charts will appear here after linking your TikTok and YouTube accounts.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
