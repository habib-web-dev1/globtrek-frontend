"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  BarChart3,
  Calendar,
  ShieldCheck,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import api from "@/services/api";
import StatsCard from "@/components/ui/StatsCard";
import RecentBookings from "@/components/ui/RecentBookings";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { ShieldAlert } from "lucide-react";

function AdminContent() {
  const { isDemoAdmin } = useAuthStore();
  const [stats, setStats] = useState<{
    totalRevenue: number;
    totalUsers: number;
    totalItems: number;
    totalOrders: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/users/admin/stats")
      .then(({ data }) => setStats(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2
            className="animate-spin text-blue-600 mx-auto mb-3"
            size={40}
          />
          <p className="text-slate-500 font-medium">Loading analytics...</p>
        </div>
      </div>
    );

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Demo admin notice */}
        {isDemoAdmin && (
          <div className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
            <ShieldAlert size={18} className="text-amber-600 shrink-0" />
            <div>
              <p className="font-black text-amber-800 text-sm">
                Demo Admin Mode — Read Only
              </p>
              <p className="text-amber-600 text-xs font-medium">
                You can view all analytics and data. Edit, delete, and confirm
                actions are disabled across all admin pages.
              </p>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest mb-2">
              <ShieldCheck size={16} /> Admin Panel
            </div>
            <h1 className="text-3xl font-black text-slate-900">
              Platform <span className="text-blue-600">Overview</span>
            </h1>
            <p className="text-slate-500 font-medium">
              Real-time GlobeTrek AI performance metrics.
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all self-start">
            <Calendar size={18} /> Last 30 Days
          </button>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard
            title="Total Revenue"
            value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
            icon={<DollarSign className="text-emerald-600" size={22} />}
            trend="+12.5%"
            color="bg-emerald-50"
          />
          <StatsCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={<Users className="text-blue-600" size={22} />}
            trend="+4.2%"
            color="bg-blue-50"
          />
          <StatsCard
            title="Active Listings"
            value={stats?.totalItems || 0}
            icon={<Package className="text-orange-600" size={22} />}
            trend="+2"
            color="bg-orange-50"
          />
          <StatsCard
            title="Total Bookings"
            value={stats?.totalOrders || 0}
            icon={<TrendingUp className="text-purple-600" size={22} />}
            trend="+18%"
            color="bg-purple-50"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">
                Revenue Overview
              </h3>
              <BarChart3 className="text-slate-300" size={24} />
            </div>

            {/* Simple visual bar chart */}
            <div className="space-y-4">
              {[
                { month: "Jan", val: 65 },
                { month: "Feb", val: 78 },
                { month: "Mar", val: 55 },
                { month: "Apr", val: 90 },
                { month: "May", val: 82 },
                { month: "Jun", val: 95 },
              ].map((d) => (
                <div key={d.month} className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-400 w-8">
                    {d.month}
                  </span>
                  <div className="flex-1 bg-slate-50 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700"
                      style={{ width: `${d.val}%` }}
                    />
                  </div>
                  <span className="text-xs font-black text-slate-600 w-8">
                    {d.val}%
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                {
                  label: "Avg. Booking Value",
                  value: `$${Math.round((stats?.totalRevenue || 0) / Math.max(stats?.totalOrders || 1, 1))}`,
                },
                { label: "Conversion Rate", value: "68%" },
                { label: "Repeat Customers", value: "42%" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="bg-slate-50 rounded-2xl p-4 text-center"
                >
                  <p className="text-lg font-black text-slate-900">{m.value}</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                Recent Activity
              </h3>
              <span className="flex items-center gap-1 text-emerald-600 text-xs font-black bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUpRight size={12} /> Live
              </span>
            </div>
            <RecentBookings />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminAnalytics() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminContent />
    </ProtectedRoute>
  );
}
