import { Sparkles, TrendingUp, Sun, Umbrella, ArrowRight } from "lucide-react";

const insights = [
  {
    icon: <TrendingUp size={20} />,
    iconColor: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    tag: "Trending",
    tagColor: "bg-blue-100 text-blue-700",
    title: "Southeast Asia Surge",
    desc: "Vietnam and Thailand bookings up 34% this month. Best time to visit before peak season.",
  },
  {
    icon: <Sun size={20} />,
    iconColor: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    tag: "Best Season",
    tagColor: "bg-amber-100 text-amber-700",
    title: "Europe Spring Window",
    desc: "April–June is ideal for Europe. AI recommends booking 3 weeks in advance for best rates.",
  },
  {
    icon: <Umbrella size={20} />,
    iconColor: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    tag: "Budget Alert",
    tagColor: "bg-emerald-100 text-emerald-700",
    title: "Bali Price Drop",
    desc: "Flight prices to Bali drop 22% in the next 2 weeks. Lock in your rate now.",
  },
];

export default function TravelInsights() {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs uppercase tracking-widest mb-4">
              <Sparkles size={12} />
              <span>AI Insights</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">
              Smart Travel <span className="text-blue-600">Intelligence</span>
            </h2>
          </div>
          <p className="text-slate-500 font-medium text-sm max-w-xs">
            Real-time data and AI insights to help you travel smarter.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {insights.map((ins) => (
            <div
              key={ins.title}
              className={`bg-white rounded-2xl p-7 border-2 ${ins.border} hover:shadow-md transition-all group`}
            >
              <div className="flex items-center justify-between mb-5">
                <div
                  className={`w-10 h-10 ${ins.bg} rounded-xl flex items-center justify-center ${ins.iconColor}`}
                >
                  {ins.icon}
                </div>
                <span
                  className={`text-xs font-black px-3 py-1 rounded-full ${ins.tagColor}`}
                >
                  {ins.tag}
                </span>
              </div>
              <h3 className="font-black text-slate-900 mb-2 text-lg">
                {ins.title}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed text-sm mb-4">
                {ins.desc}
              </p>
              <button className="flex items-center gap-1 text-blue-600 font-bold text-sm group-hover:gap-2 transition-all">
                Learn more <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
