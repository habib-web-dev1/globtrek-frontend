import { ArrowUpRight } from "lucide-react";

export default function StatsCard({ title, value, icon, trend, color }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center`}
        >
          {icon}
        </div>
        <span className="flex items-center gap-1 text-emerald-600 text-xs font-black bg-emerald-50 px-2 py-1 rounded-lg">
          <ArrowUpRight size={14} /> {trend}
        </span>
      </div>
      <div>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">
          {title}
        </p>
        <h2 className="text-3xl font-black text-slate-900">{value}</h2>
      </div>
    </div>
  );
}
