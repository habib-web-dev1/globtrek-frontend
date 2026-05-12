import Link from "next/link";
import { Mountain, Crown, Wallet, Landmark } from "lucide-react";

const categories = [
  {
    name: "Adventure",
    desc: "Thrilling outdoor experiences",
    icon: Mountain,
    gradient: "from-orange-500 to-red-500",
    bg: "bg-orange-50",
    border: "border-orange-100 hover:border-orange-300",
    text: "text-orange-600",
    href: "/destinations?category=adventure",
  },
  {
    name: "Luxury",
    desc: "Premium 5-star escapes",
    icon: Crown,
    gradient: "from-purple-500 to-indigo-500",
    bg: "bg-purple-50",
    border: "border-purple-100 hover:border-purple-300",
    text: "text-purple-600",
    href: "/destinations?category=luxury",
  },
  {
    name: "Budget",
    desc: "Affordable world travel",
    icon: Wallet,
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100 hover:border-emerald-300",
    text: "text-emerald-600",
    href: "/destinations?category=budget",
  },
  {
    name: "Cultural",
    desc: "History & heritage tours",
    icon: Landmark,
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    border: "border-blue-100 hover:border-blue-300",
    text: "text-blue-600",
    href: "/destinations?category=cultural",
  },
];

export default function CategoryExplorer() {
  return (
    <section className="py-28 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-2">
            Explore by Type
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            What kind of trip are you planning?
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className={`group flex flex-col items-center gap-4 p-7 rounded-2xl border-2 bg-white ${cat.border} transition-all hover:shadow-lg hover:-translate-y-1`}
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${cat.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <Icon size={26} />
                </div>
                <div className="text-center">
                  <p className="font-black text-slate-900">{cat.name}</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
