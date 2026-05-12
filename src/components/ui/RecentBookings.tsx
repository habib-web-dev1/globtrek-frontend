"use client";

import { useEffect, useState } from "react";
import { MapPin, Clock } from "lucide-react";
import api from "@/services/api";

export default function RecentBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/bookings")
      .then(({ data }) => setBookings(data.data?.slice(0, 6) || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-slate-50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );

  if (!bookings.length)
    return (
      <p className="text-slate-400 text-sm font-medium text-center py-8">
        No bookings yet.
      </p>
    );

  return (
    <div className="space-y-4">
      {bookings.map((b) => (
        <div
          key={b._id}
          className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <MapPin size={18} className="text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 text-sm truncate">
              {b.itemId?.title || "Destination"}
            </p>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Clock size={10} />
              {new Date(b.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex-shrink-0 ${
              b.status === "confirmed"
                ? "bg-emerald-100 text-emerald-600"
                : b.status === "cancelled"
                  ? "bg-red-100 text-red-600"
                  : "bg-amber-100 text-amber-600"
            }`}
          >
            {b.status}
          </span>
        </div>
      ))}
    </div>
  );
}
