export default function StatCard({
  title,
  value,
  trend,
  trendUp = true,
}: {
  title: string;
  value: string;
  trend: string;
  trendUp?: boolean;
}) {
  return (
    <div className="bg-card border border-white/5 rounded-[24px] p-6 relative overflow-hidden group hover:border-white/10 hover:-translate-y-1 transition-all duration-150 shadow-lg">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
      
      <h3 className="text-gray-400 text-sm font-medium mb-4 relative z-10">{title}</h3>
      <div className="flex items-end justify-between relative z-10">
        <div className="font-heading text-4xl font-semibold text-white tracking-tight">{value}</div>
        <div className={`text-sm font-medium mb-1 px-2 py-1 rounded-full ${trendUp ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </div>
      </div>
    </div>
  );
}
