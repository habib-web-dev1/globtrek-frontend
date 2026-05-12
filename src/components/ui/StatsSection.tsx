import { Users, Globe, Briefcase, Heart } from "lucide-react";

const stats = [
  {
    label: "Global Travelers",
    value: "12k+",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    label: "Destinations",
    value: "100+",
    icon: Globe,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    label: "Bookings Made",
    value: "8k+",
    icon: Briefcase,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    label: "Happy Travelers",
    value: "99%",
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`flex items-center gap-4 p-5 rounded-2xl border ${stat.border} ${stat.bg} hover:shadow-sm transition-all`}
              >
                <div
                  className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm`}
                >
                  <Icon size={22} className={stat.color} />
                </div>
                <div>
                  <p className={`text-2xl font-black ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-slate-600 text-sm font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
