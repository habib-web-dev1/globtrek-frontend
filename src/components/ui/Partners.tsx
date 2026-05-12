import { Plane, Hotel, Shield, CreditCard, Map, Globe2 } from "lucide-react";

const partners = [
  { name: "SkyWings", icon: <Plane size={18} /> },
  { name: "LuxStay", icon: <Hotel size={18} /> },
  { name: "SafeTravel", icon: <Shield size={18} /> },
  { name: "PayEasy", icon: <CreditCard size={18} /> },
  { name: "MapPro", icon: <Map size={18} /> },
  { name: "GlobalNet", icon: <Globe2 size={18} /> },
];

export default function Partners() {
  return (
    <section className="py-20 bg-slate-50 border-y border-slate-100">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs font-black text-slate-400 uppercase tracking-widest mb-8">
          Trusted Partners & Integrations
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {partners.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl border border-slate-200 text-slate-500 font-bold text-sm hover:text-blue-600 hover:border-blue-200 hover:shadow-sm transition-all cursor-default"
            >
              {p.icon}
              <span>{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
