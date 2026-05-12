"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  Briefcase,
  User,
  MapPin,
  Package,
  Loader2,
  TrendingUp,
  Clock,
  CheckCircle,
  Globe,
  Star,
  ArrowRight,
  CreditCard,
  ExternalLink,
} from "lucide-react";
import api from "@/services/api";
import ProfileForm from "@/components/forms/ProfileForm";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Link from "next/link";

type Booking = {
  _id: string;
  status: string;
  totalPrice: number;
  quantity: number;
  createdAt: string;
  itemId?: { title: string; location: string };
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-blue-100 text-blue-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

function MiniTracker({ status }: { status: string }) {
  const steps = ["pending", "paid", "confirmed"];
  const idx = steps.indexOf(status);
  if (status === "cancelled") {
    return <span className="text-xs text-red-500 font-bold">Cancelled</span>;
  }
  return (
    <div className="flex items-center gap-1 mt-1.5">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-2 h-2 rounded-full transition-all ${i <= idx ? (i === idx ? "bg-blue-500 ring-2 ring-blue-200" : "bg-emerald-500") : "bg-slate-200"}`}
          />
          {i < steps.length - 1 && (
            <div
              className={`w-5 h-0.5 ${i < idx ? "bg-emerald-400" : "bg-slate-200"}`}
            />
          )}
        </div>
      ))}
      <span
        className={`ml-1.5 text-xs font-black px-2 py-0.5 rounded-full ${STATUS_COLORS[status] || "bg-slate-100 text-slate-600"}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
}

function DashboardContent() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"overview" | "profile">(
    "overview",
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/bookings/my-bookings")
      .then(({ data }) => setBookings(data.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const paid = bookings.filter((b) => b.status === "paid").length;
  const totalSpent = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const tabs = [
    { id: "overview", label: "Overview", icon: <TrendingUp size={18} /> },
    { id: "profile", label: "Edit Profile", icon: <User size={18} /> },
  ] as const;

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header Banner */}
        <div
          className="rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #2563eb, #4338ca)" }}
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl font-black border border-white/30">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <p className="text-blue-200 text-sm font-bold uppercase tracking-widest">
                  Welcome back
                </p>
                <h1 className="text-2xl font-black">{user?.name}</h1>
                <p className="text-blue-200 text-sm font-medium">
                  {user?.email}
                </p>
              </div>
            </div>
            <Link
              href="/destinations"
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition-all self-start md:self-auto"
            >
              <Globe size={18} /> Explore <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all text-sm ${activeTab === tab.id ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                  Quick Stats
                </p>
                <div className="space-y-3">
                  {[
                    {
                      label: "Total Trips",
                      value: bookings.length,
                      color: "text-slate-900",
                    },
                    {
                      label: "Confirmed",
                      value: confirmed,
                      color: "text-emerald-600",
                    },
                    { label: "Paid", value: paid, color: "text-blue-600" },
                    {
                      label: "Pending",
                      value: pending,
                      color: "text-amber-600",
                    },
                    {
                      label: "Total Spent",
                      value: `$${totalSpent.toLocaleString()}`,
                      color: "text-blue-600",
                    },
                  ].map((s) => (
                    <div key={s.label} className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">
                        {s.label}
                      </span>
                      <span className={`font-black ${s.color}`}>{s.value}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/user/bookings"
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-bold text-sm transition-all"
                >
                  <Briefcase size={15} /> All Bookings{" "}
                  <ExternalLink size={13} />
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Total Bookings",
                      value: bookings.length,
                      icon: <Briefcase size={20} className="text-blue-600" />,
                      bg: "bg-blue-50",
                    },
                    {
                      label: "Confirmed",
                      value: confirmed,
                      icon: (
                        <CheckCircle size={20} className="text-emerald-600" />
                      ),
                      bg: "bg-emerald-50",
                    },
                    {
                      label: "Paid",
                      value: paid,
                      icon: <CreditCard size={20} className="text-blue-600" />,
                      bg: "bg-blue-50",
                    },
                    {
                      label: "Pending",
                      value: pending,
                      icon: <Clock size={20} className="text-amber-600" />,
                      bg: "bg-amber-50",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
                    >
                      <div
                        className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}
                      >
                        {stat.icon}
                      </div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-black text-slate-900">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Recent Bookings with mini tracker */}
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-slate-900">
                      Recent Journeys
                    </h3>
                    <Link
                      href="/user/bookings"
                      className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1"
                    >
                      View all <ArrowRight size={14} />
                    </Link>
                  </div>
                  {loading ? (
                    <div className="flex justify-center py-10">
                      <Loader2
                        className="animate-spin text-blue-600"
                        size={32}
                      />
                    </div>
                  ) : bookings.length > 0 ? (
                    <div className="space-y-3">
                      {bookings.slice(0, 4).map((b) => (
                        <div
                          key={b._id}
                          className="flex items-start justify-between gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all"
                        >
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                              <MapPin size={16} className="text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-slate-900 text-sm truncate">
                                {b.itemId?.title || "Destination"}
                              </p>
                              <p className="text-xs text-slate-400 font-medium">
                                {b.itemId?.location || "—"}
                              </p>
                              <MiniTracker status={b.status} />
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-black text-slate-900 text-sm">
                              ${b.totalPrice?.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-400 font-medium">
                              {new Date(b.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      <Link
                        href="/user/bookings"
                        className="flex items-center justify-center gap-2 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-2xl font-bold text-sm transition-all mt-2"
                      >
                        <Briefcase size={15} /> View All Bookings &amp; Pay{" "}
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package
                        size={48}
                        className="mx-auto text-slate-200 mb-3"
                      />
                      <p className="text-slate-500 font-medium mb-4">
                        No trips booked yet.
                      </p>
                      <Link
                        href="/destinations"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all"
                      >
                        <MapPin size={16} /> Explore Destinations
                      </Link>
                    </div>
                  )}
                </div>

                {/* Explore CTA */}
                <div
                  className="rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6"
                  style={{
                    background: "linear-gradient(135deg, #0f172a, #1e293b)",
                  }}
                >
                  <div>
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-2">
                      <Star size={14} fill="currentColor" /> AI Recommended
                    </div>
                    <h3 className="text-xl font-black mb-1">
                      Ready for your next adventure?
                    </h3>
                    <p className="text-slate-400 font-medium text-sm">
                      Our AI has curated 100+ destinations just for you.
                    </p>
                  </div>
                  <Link
                    href="/destinations"
                    className="shrink-0 flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all"
                  >
                    Browse Now <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl p-8 md:p-12 border border-slate-100 shadow-sm">
                <ProfileForm user={user} />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <ProtectedRoute requiredRole="USER">
      <DashboardContent />
    </ProtectedRoute>
  );
}
