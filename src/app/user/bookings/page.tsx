"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Package,
  MapPin,
  Calendar,
  DollarSign,
  XCircle,
  CheckCircle,
  Clock,
  CreditCard,
  Ticket,
  X,
} from "lucide-react";
import api from "@/services/api";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Link from "next/link";
import dynamic from "next/dynamic";

const PaymentModal = dynamic(() => import("@/components/ui/PaymentModal"), {
  ssr: false,
});

type Booking = {
  _id: string;
  status: string;
  totalPrice: number;
  quantity: number;
  createdAt: string;
  itemId?: {
    _id: string;
    title: string;
    location: string;
    images: string[];
    price: number;
    category: string;
  };
};

const STATUS: Record<
  string,
  { icon: React.ReactNode; cls: string; label: string }
> = {
  confirmed: {
    icon: <CheckCircle size={13} />,
    cls: "bg-emerald-100 text-emerald-700",
    label: "Confirmed",
  },
  paid: {
    icon: <CreditCard size={13} />,
    cls: "bg-blue-100 text-blue-700",
    label: "Paid",
  },
  pending: {
    icon: <Clock size={13} />,
    cls: "bg-amber-100 text-amber-700",
    label: "Pending",
  },
  cancelled: {
    icon: <XCircle size={13} />,
    cls: "bg-red-100 text-red-700",
    label: "Cancelled",
  },
};

function TicketModal({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Ticket header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Ticket size={18} />
            <span className="text-xs font-black uppercase tracking-widest opacity-80">
              Booking Ticket
            </span>
          </div>
          <h2 className="text-2xl font-black">
            {booking.itemId?.title || "Destination"}
          </h2>
          <p className="text-blue-200 text-sm font-medium flex items-center gap-1 mt-1">
            <MapPin size={12} /> {booking.itemId?.location || "—"}
          </p>
        </div>

        {/* Ticket tear line */}
        <div className="flex items-center px-6">
          <div className="w-5 h-5 bg-slate-100 rounded-full -ml-8 border border-slate-200" />
          <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-2" />
          <div className="w-5 h-5 bg-slate-100 rounded-full -mr-8 border border-slate-200" />
        </div>

        {/* Ticket body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                Booking ID
              </p>
              <p className="font-black text-slate-900 text-xs break-all">
                {booking._id}
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                Status
              </p>
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-black ${STATUS[booking.status]?.cls || STATUS.pending.cls}`}
              >
                {STATUS[booking.status]?.icon}{" "}
                {STATUS[booking.status]?.label || booking.status}
              </span>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                Travelers
              </p>
              <p className="font-black text-slate-900">
                {booking.quantity} person{booking.quantity > 1 ? "s" : ""}
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                Category
              </p>
              <p className="font-black text-slate-900 capitalize">
                {booking.itemId?.category || "—"}
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                Booked On
              </p>
              <p className="font-black text-slate-900 text-sm">
                {new Date(booking.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4">
              <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">
                Total Paid
              </p>
              <p className="font-black text-blue-600 text-xl">
                ${booking.totalPrice?.toLocaleString()}
              </p>
            </div>
          </div>

          {booking.status === "confirmed" && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
              <CheckCircle
                size={20}
                className="text-emerald-600 mx-auto mb-2"
              />
              <p className="font-black text-emerald-800 text-sm">
                Your booking is confirmed!
              </p>
              <p className="text-emerald-600 text-xs font-medium mt-1">
                Show this ticket at check-in.
              </p>
            </div>
          )}
          {booking.status === "pending" && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
              <Clock size={20} className="text-amber-600 mx-auto mb-2" />
              <p className="font-black text-amber-800 text-sm">
                Awaiting for confirmation
              </p>
              <p className="text-amber-600 text-xs font-medium mt-1">
                You&apos;ll be notified once confirmed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UserBookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [payingBooking, setPayingBooking] = useState<Booking | null>(null);
  const [ticketBooking, setTicketBooking] = useState<Booking | null>(null);

  const fetchBookings = () => {
    setLoading(true);
    api
      .get("/bookings/my-bookings")
      .then(({ data }) => setBookings(data.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handlePaymentSuccess = () => {
    setPayingBooking(null);
    fetchBookings(); // refresh to show updated status
  };

  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">
            My <span className="text-blue-600">Bookings</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {bookings.length} total trips
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "pending", "paid", "confirmed", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all capitalize ${filter === s ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"}`}
            >
              {s === "all"
                ? `All (${bookings.length})`
                : `${s} (${bookings.filter((b) => b.status === s).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={36} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
            <Package size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium mb-4">
              No {filter !== "all" ? filter : ""} bookings found.
            </p>
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all text-sm"
            >
              <MapPin size={16} /> Explore Destinations
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((b) => {
              const sc = STATUS[b.status] || STATUS.pending;
              const isPending = b.status === "pending";
              const isPaid = b.status === "paid";
              const isConfirmed = b.status === "confirmed";
              return (
                <div
                  key={b._id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: info */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                        <MapPin size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900">
                          {b.itemId?.title || "Destination"}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <MapPin size={12} /> {b.itemId?.location || "—"}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />{" "}
                            {new Date(b.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Package size={11} /> {b.quantity} traveler
                            {b.quantity > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: status + price + actions */}
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-3 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black ${sc.cls}`}
                      >
                        {sc.icon} {sc.label}
                      </span>
                      <div className="flex items-center gap-1 font-black text-slate-900">
                        <DollarSign size={15} className="text-blue-600" />
                        <span className="text-lg">
                          {b.totalPrice?.toLocaleString()}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        {/* Pay button — only for pending bookings */}
                        {isPending && (
                          <button
                            onClick={() => setPayingBooking(b)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-blue-200"
                          >
                            <CreditCard size={13} /> Pay Now
                          </button>
                        )}
                        {/* View Ticket — for all bookings */}
                        <button
                          onClick={() => setTicketBooking(b)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all ${isConfirmed ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                        >
                          <Ticket size={13} /> View Ticket
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Status notices */}
                  {isPending && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-amber-700 bg-amber-50 rounded-xl px-4 py-3">
                      <Clock size={14} className="shrink-0" />
                      <p className="text-xs font-medium">
                        Payment pending — click <strong>Pay Now</strong> to
                        complete your booking. It will confirm after payment.
                      </p>
                    </div>
                  )}
                  {isPaid && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-blue-700 bg-blue-50 rounded-xl px-4 py-3">
                      <CreditCard size={14} className="shrink-0" />
                      <p className="text-xs font-medium">
                        <strong>Payment received.</strong> Waiting for confirm
                        your booking.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {payingBooking && (
        <PaymentModal
          amount={payingBooking.totalPrice}
          bookingId={payingBooking._id}
          destinationTitle={payingBooking.itemId?.title || "Destination"}
          onSuccess={handlePaymentSuccess}
          onClose={() => setPayingBooking(null)}
        />
      )}

      {/* Ticket Modal */}
      {ticketBooking && (
        <TicketModal
          booking={ticketBooking}
          onClose={() => setTicketBooking(null)}
        />
      )}
    </div>
  );
}

export default function UserBookings() {
  return (
    <ProtectedRoute requiredRole="USER">
      <UserBookingsContent />
    </ProtectedRoute>
  );
}
