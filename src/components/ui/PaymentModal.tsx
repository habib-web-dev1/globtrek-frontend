"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { X, CreditCard, Lock, CheckCircle, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import api from "@/services/api";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder"
);

const CARD_STYLE = {
  style: {
    base: {
      fontSize: "15px",
      fontFamily: "sans-serif",
      color: "#0f172a",
      "::placeholder": { color: "#94a3b8" },
    },
    invalid: { color: "#ef4444" },
  },
};

function CheckoutForm({
  amount,
  bookingId,
  destinationTitle,
  onSuccess,
  onClose,
}: {
  amount: number;
  bookingId: string;
  destinationTitle: string;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [cardComplete, setCardComplete] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    if (!cardComplete) {
      setError("Please enter your complete card details including expiry date and CVC.");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const { data } = await api.post("/payments/create-intent", { amount, bookingId });
      const clientSecret: string = data.data.clientSecret;

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: { card: cardElement } }
      );

      if (stripeError) {
        setError(stripeError.message || "Payment failed. Please check your card details.");
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        await api.patch(`/bookings/mark-paid/${bookingId}`);
        setSucceeded(true);
        setTimeout(() => { onSuccess(); onClose(); }, 2500);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(
        e?.response?.data?.message ||
        e?.message ||
        "Payment failed. Please try again with a valid card."
      );
    } finally {
      setProcessing(false);
    }
  };

  if (succeeded) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-emerald-600" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">Payment Successful!</h3>
        <p className="text-slate-500 font-medium text-sm">
          Your booking is marked as <strong>paid</strong>. The admin will confirm it shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">Booking for</p>
        <p className="font-black text-slate-900">{destinationTitle}</p>
        <p className="text-2xl font-black text-blue-600 mt-1">${amount.toLocaleString()}</p>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2">
        <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs font-medium text-amber-700">
          <p className="font-black mb-0.5">Test Mode — Use these details:</p>
          <p>Card: <span className="font-black">4242 4242 4242 4242</span></p>
          <p>Expiry: any future date (e.g. <span className="font-black">12/28</span>) · CVC: any 3 digits</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-bold text-slate-700">Card Details</label>
        <div className={`p-4 bg-slate-50 border rounded-2xl transition-all ${cardComplete ? "border-blue-400 ring-2 ring-blue-100" : "border-slate-200"}`}>
          <CardElement
            options={CARD_STYLE}
            onChange={(e) => {
              setCardComplete(e.complete);
              if (e.error) setError(e.error.message || "");
              else if (e.complete) setError("");
            }}
          />
        </div>
        {!cardComplete && !error && (
          <p className="text-xs text-slate-400 font-medium ml-1">
            Enter card number, expiry date, and CVC to continue
          </p>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
          <AlertCircle size={14} className="shrink-0" /> {error}
        </div>
      )}

      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
        <Lock size={11} /> Secured by Stripe. Card details are never stored.
      </div>

      <button
        type="submit"
        disabled={!stripe || processing || !cardComplete}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? (
          <><Loader2 size={18} className="animate-spin" /> Processing...</>
        ) : (
          <><CreditCard size={18} /> Pay ${amount.toLocaleString()}</>
        )}
      </button>

      {!cardComplete && (
        <p className="text-center text-xs text-slate-400 font-medium">
          Complete all card fields above to enable payment
        </p>
      )}
    </form>
  );
}

export default function PaymentModal({
  amount,
  bookingId,
  destinationTitle,
  onSuccess,
  onClose,
}: {
  amount: number;
  bookingId: string;
  destinationTitle: string;
  onSuccess: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
        >
          <X size={18} />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <ShieldCheck size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Secure Payment</h2>
            <p className="text-xs text-slate-400 font-medium">Powered by Stripe</p>
          </div>
        </div>
        <Elements stripe={stripePromise}>
          <CheckoutForm
            amount={amount}
            bookingId={bookingId}
            destinationTitle={destinationTitle}
            onSuccess={onSuccess}
            onClose={onClose}
          />
        </Elements>
      </div>
    </div>
  );
}
