import { Search, CalendarCheck, Map } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Find Destination",
    desc: "Search through 100+ AI-vetted global locations filtered by category, budget, and season.",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
    stepColor: "text-blue-200",
    border: "border-blue-100",
    accent: "bg-blue-600",
  },
  {
    step: "02",
    icon: CalendarCheck,
    title: "Book & Pay",
    desc: "Reserve your spot, complete secure Stripe payment, and await admin confirmation.",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100",
    stepColor: "text-emerald-200",
    border: "border-emerald-100",
    accent: "bg-emerald-600",
  },
  {
    step: "03",
    icon: Map,
    title: "Start Journey",
    desc: "Receive your AI-generated itinerary and hit the road. 24/7 support available.",
    iconColor: "text-violet-600",
    iconBg: "bg-violet-100",
    stepColor: "text-violet-200",
    border: "border-violet-100",
    accent: "bg-violet-600",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-2">
            Simple Process
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900">
            Three Steps to <span className="text-blue-600">Adventure</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 to-violet-200" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className={`relative bg-white rounded-2xl p-8 border-2 ${step.border} shadow-sm hover:shadow-md transition-all`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`w-14 h-14 ${step.iconBg} rounded-2xl flex items-center justify-center`}
                  >
                    <Icon size={26} className={step.iconColor} />
                  </div>
                  <span className={`text-5xl font-black ${step.stepColor}`}>
                    {step.step}
                  </span>
                </div>
                <div className={`w-8 h-1 ${step.accent} rounded-full mb-4`} />
                <h3 className="text-xl font-black text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
