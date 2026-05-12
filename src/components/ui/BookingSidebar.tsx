"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { CheckCircle, Users, LogIn, Info } from "lucide-react";
import api from "@/services/api";
import Link from "next/link";

export default function BookingSidebar({
  item,
}: {
  item: { _id: string; price: number; title: string };
}) {
  const { token } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = item.price * quantity;

  const handleBook = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post("/bookings", { itemId: item._id, quantity });
      setBooked(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(
        e?.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="sticky top-28 p-7 bg-white border border-slate-100 shadow-xl rounded-3xl">
        <div className="text-center mb-5">
          <p className="text-3xl font-black text-slate-900">${item.price}</p>
          <p className="text-slate-400 font-medium text-sm">per person</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-2xl text-center mb-4">
          <Info size={18} className="text-blue-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600">
            Sign in to book this destination
          </p>
        </div>
        <Link
          href="/login"
          className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-200"
        >
          <LogIn size={18} /> Sign In to Book
        </Link>
      </div>
    );
  }

  if (booked) {
    return (
      <div className="sticky top-28 p-7 bg-white border border-slate-100 shadow-xl rounded-3xl text-center">
        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={28} className="text-emerald-600" />
        </div>
        <p className="font-black text-slate-900 text-lg mb-2">
          Booking Requested!
        </p>
        <p className="text-slate-500 text-sm font-medium mb-5">
          Your booking is pending. Go to <strong>My Bookings</strong> to
          complete payment once the admin confirms.
        </p>
        <Link
          href="/user/bookings"
          className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all text-sm"
        >
          View My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="sticky top-28 p-7 bg-white border border-slate-100 shadow-xl rounded-3xl">
      <div className="flex justify-between items-end mb-6">
        <div>
          <p className="text-3xl font-black text-slate-900">${item.price}</p>
          <p className="text-slate-400 font-medium text-sm">per person</p>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black">
          Available
        </span>
      </div>

      <div className="mb-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <Users size={12} /> Travelers
        </label>
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-black text-slate-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center"
          >
            −
          </button>
          <span className="text-xl font-black text-slate-900 w-8 text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-black text-slate-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex justify-between font-bold text-slate-900 mb-5 px-1 py-3 border-t border-slate-100">
        <span className="text-slate-500">Total</span>
        <span className="text-xl font-black text-blue-600">
          ${total.toLocaleString()}
        </span>
      </div>

      {error && (
        <p className="text-red-500 text-xs font-medium mb-3 text-center">
          {error}
        </p>
      )}

      <button
        onClick={handleBook}
        disabled={loading}
        className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading ? "Creating booking..." : "Reserve Now"}
      </button>
      <p className="text-center text-slate-400 text-xs mt-4 font-medium">
        Free cancellation up to 48 hours before departure.
      </p>
    </div>
  );
}
