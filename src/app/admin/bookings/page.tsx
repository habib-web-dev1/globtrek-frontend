"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  RefreshCw,
  CreditCard,
  Package,
  MapPin,
  User,
  ShieldAlert,
} from "lucide-react";
import api from "@/services/api";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";

type Booking = {
  _id: string;
  status: "pending" | "paid" | "confirmed" | "cancelled";
  totalPrice: number;
  quantity: number;
  createdAt: string;
  userId?: { name: string; email: string };
  itemId?: { title: string; location: string };
};

const STATUS_CFG = {
  pending: {
    icon: <Clock size={13} />,
    cls: "bg-amber-100 text-amber-700",
    label: "Pending",
    dot: "bg-amber-400",
  },
  paid: {
    icon: <CreditCard size={13} />,
    cls: "bg-blue-100 text-blue-700",
    label: "Paid",
    dot: "bg-blue-500",
  },
  confirmed: {
    icon: <CheckCircle size={13} />,
    cls: "bg-emerald-100 text-emerald-700",
    label: "Confirmed",
    dot: "bg-emerald-500",
  },
  cancelled: {
    icon: <XCircle size={13} />,
    cls: "bg-red-100 text-red-700",
    label: "Cancelled",
    dot: "bg-red-400",
  },
};

// Parcel tracker for admin view
function AdminTracker({ status }: { status: string }) {
  const steps = [
    { key: "pending", label: "Ordered", icon: Package },
    { key: "paid", label: "Paid", icon: CreditCard },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  ];
  const order = ["pending", "paid", "confirmed"];
  const idx = order.indexOf(status);
  if (status === "cancelled") return null;

  return (
    <div className="flex items-center gap-0 mt-3">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const done = i <= idx;
        const active = i === idx;
        return (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                  done
                    ? active
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-emerald-500 border-emerald-500 text-white"
                    : "bg-white border-slate-200 text-slate-300"
                }`}
              >
                <Icon size={12} />
              </div>
              <p
                className={`text-xs font-bold mt-1 ${done ? (active ? "text-blue-600" : "text-emerald-600") : "text-slate-300"}`}
              >
                {step.label}
              </p>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mb-4 mx-1 ${i < idx ? "bg-emerald-400" : "bg-slate-100"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function AdminBookingsContent() {
  const { isDemoAdmin } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/bookings");
      setBookings(data.data || []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    if (isDemoAdmin) return; // Block demo admin
    setUpdating(id);
    try {
      await api.patch(`/bookings/${id}`, { status });
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: status as Booking["status"] } : b,
        ),
      );
    } catch {
      /* ignore */
    } finally {
      setUpdating(null);
    }
  };

  const deleteBooking = async (id: string) => {
    if (isDemoAdmin) return; // Block demo admin
    if (!confirm("Delete this booking?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch {
      /* ignore */
    }
  };

  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const counts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    paid: bookings.filter((b) => b.status === "paid").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Demo admin notice */}
        {isDemoAdmin && (
          <div className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
            <ShieldAlert size={20} className="text-amber-600 shrink-0" />
            <div>
              <p className="font-black text-amber-800 text-sm">
                Demo Admin Mode
              </p>
              <p className="text-amber-600 text-xs font-medium">
                You can view all bookings but cannot confirm, cancel, or delete.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              All <span className="text-blue-600">Bookings</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              {bookings.length} total bookings
            </p>
          </div>
          <button
            onClick={fetchBookings}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm self-start"
          >
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["all", "pending", "paid", "confirmed", "cancelled"] as const).map(
            (s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all capitalize ${filter === s ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"}`}
              >
                {s === "all" ? `All (${counts.all})` : `${s} (${counts[s]})`}
                {/* Highlight paid bookings needing action */}
                {s === "paid" && counts.paid > 0 && (
                  <span className="ml-1.5 w-2 h-2 bg-blue-500 rounded-full inline-block animate-pulse" />
                )}
              </button>
            ),
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={36} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center text-slate-400 font-medium">
            No bookings found.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((b) => {
              const sc = STATUS_CFG[b.status] || STATUS_CFG.pending;
              const isPaid = b.status === "paid";
              return (
                <div
                  key={b._id}
                  className={`bg-white rounded-2xl border shadow-sm p-6 transition-all hover:shadow-md ${isPaid ? "border-blue-200 ring-1 ring-blue-100" : "border-slate-100"}`}
                >
                  {/* Paid badge */}
                  {isPaid && (
                    <div className="flex items-center gap-2 mb-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <p className="text-xs font-black text-blue-700">
                        Payment received — ready to confirm
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Left: booking info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                        <MapPin size={18} className="text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-black text-slate-900 text-sm">
                            {b.itemId?.title || "—"}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-black ${sc.cls}`}
                          >
                            {sc.icon} {sc.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                          {b.itemId?.location || ""}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 font-medium flex-wrap">
                          <span className="flex items-center gap-1">
                            <User size={11} /> {b.userId?.name || "—"}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span>{b.userId?.email || ""}</span>
                          <span className="text-slate-300">·</span>
                          <span>
                            {b.quantity} traveler{b.quantity > 1 ? "s" : ""}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span>
                            {new Date(b.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {/* Tracker */}
                        <AdminTracker status={b.status} />
                      </div>
                    </div>

                    {/* Right: price + actions */}
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <p className="text-xl font-black text-slate-900">
                        ${b.totalPrice?.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2">
                        {b.status === "pending" && (
                          <span className="px-3 py-1.5 bg-slate-100 text-slate-400 rounded-lg text-xs font-bold cursor-default">
                            Awaiting Payment
                          </span>
                        )}
                        {b.status === "paid" && (
                          <button
                            onClick={() => updateStatus(b._id, "confirmed")}
                            disabled={updating === b._id || isDemoAdmin}
                            title={
                              isDemoAdmin
                                ? "Demo admin cannot confirm"
                                : "Confirm this booking"
                            }
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${isDemoAdmin ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white shadow-sm"} disabled:opacity-60`}
                          >
                            {updating === b._id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <CheckCircle size={12} />
                            )}
                            {isDemoAdmin ? "View Only" : "Confirm"}
                          </button>
                        )}
                        {b.status === "confirmed" && (
                          <button
                            onClick={() => updateStatus(b._id, "cancelled")}
                            disabled={updating === b._id || isDemoAdmin}
                            title={
                              isDemoAdmin
                                ? "Demo admin cannot cancel"
                                : "Cancel this booking"
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isDemoAdmin ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"} disabled:opacity-50`}
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => deleteBooking(b._id)}
                          disabled={isDemoAdmin}
                          title={
                            isDemoAdmin
                              ? "Demo admin cannot delete"
                              : "Delete booking"
                          }
                          className={`p-2 rounded-lg transition-all ${isDemoAdmin ? "text-slate-200 cursor-not-allowed" : "text-slate-400 hover:text-red-600 hover:bg-red-50"}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminBookings() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminBookingsContent />
    </ProtectedRoute>
  );
}
