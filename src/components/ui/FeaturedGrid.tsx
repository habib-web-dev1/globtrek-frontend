"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import DestinationCard from "./DestinationCard";
import api from "@/services/api";

export default function FeaturedGrid() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/items", { params: { limit: 6 } })
      .then(({ data }) => setItems(data.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-32 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2">
              Top Picks
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">
              Featured <span className="text-blue-600">Destinations</span>
            </h2>
          </div>
          <Link
            href="/destinations"
            className="flex items-center gap-2 font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            View All <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item: any) => (
              <DestinationCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 font-medium">
            No destinations available yet.
          </div>
        )}
      </div>
    </section>
  );
}
