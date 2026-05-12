"use client";

import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  Mountain,
  Crown,
  Wallet,
  Landmark,
} from "lucide-react";

type Filters = {
  searchTerm: string;
  category: string;
  minPrice: string;
  maxPrice: string;
};

const CATS = [
  {
    value: "adventure",
    label: "Adventure",
    icon: Mountain,
    active: "text-orange-600 bg-orange-50 border-orange-300",
  },
  {
    value: "luxury",
    label: "Luxury",
    icon: Crown,
    active: "text-purple-600 bg-purple-50 border-purple-300",
  },
  {
    value: "budget",
    label: "Budget",
    icon: Wallet,
    active: "text-emerald-600 bg-emerald-50 border-emerald-300",
  },
  {
    value: "cultural",
    label: "Cultural",
    icon: Landmark,
    active: "text-blue-600 bg-blue-50 border-blue-300",
  },
];

const PRESETS = [
  { label: "Under $500", min: "", max: "500" },
  { label: "$500-$1500", min: "500", max: "1500" },
  { label: "$1500+", min: "1500", max: "" },
];

export default function FilterSidebar({
  onFilterChange,
}: {
  onFilterChange: (p: Filters) => void;
}) {
  const [f, setF] = useState<Filters>({
    searchTerm: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  const update = (patch: Partial<Filters>) => {
    const next = { ...f, ...patch };
    setF(next);
    onFilterChange(next);
  };

  const clear = () => {
    const reset: Filters = {
      searchTerm: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    };
    setF(reset);
    onFilterChange(reset);
  };

  const hasFilters = f.searchTerm || f.category || f.minPrice || f.maxPrice;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-28">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 font-black text-slate-900">
          <SlidersHorizontal size={18} className="text-blue-600" />
          Filters
        </div>
        {hasFilters && (
          <button
            onClick={clear}
            className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      <div className="mb-5">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
          Search
        </p>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={15}
          />
          <input
            type="text"
            value={f.searchTerm}
            placeholder="Where to?"
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
            onChange={(e) => update({ searchTerm: e.target.value })}
          />
        </div>
      </div>

      <div className="mb-5">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
          Category
        </p>
        <div className="space-y-2">
          {CATS.map((cat) => {
            const Icon = cat.icon;
            const isActive = f.category === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => update({ category: isActive ? "" : cat.value })}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-bold transition-all ${isActive ? cat.active : "text-slate-600 bg-white border-slate-200 hover:bg-slate-50"}`}
              >
                <Icon size={14} />
                {cat.label}
                {isActive && <X size={12} className="ml-auto opacity-60" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-5">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
          Price Range ($)
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={f.minPrice}
            className="w-1/2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
            onChange={(e) => update({ minPrice: e.target.value })}
          />
          <input
            type="number"
            placeholder="Max"
            value={f.maxPrice}
            className="w-1/2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
            onChange={(e) => update({ maxPrice: e.target.value })}
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
          Quick Filters
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => {
            const isActive = f.minPrice === p.min && f.maxPrice === p.max;
            return (
              <button
                key={p.label}
                onClick={() => update({ minPrice: p.min, maxPrice: p.max })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${isActive ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"}`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
