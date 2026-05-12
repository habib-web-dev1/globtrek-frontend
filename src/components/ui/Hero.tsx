import { ArrowRight, Sparkles, MapPin, Star, Shield } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Image with parallax feel */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      />
      {/* Multi-layer overlay for depth */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.65) 50%, rgba(30,58,138,0.75) 100%)",
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-0"
        style={{ background: "linear-gradient(to top, #0f172a, transparent)" }}
      />

      {/* Floating stat badges */}
      <div className="absolute top-28 left-6 md:left-20 z-10 hidden md:flex items-center gap-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 text-white shadow-xl">
        <Star size={15} className="text-amber-400" fill="currentColor" />
        <div>
          <p className="text-xs font-black">4.9 / 5 Rating</p>
          <p className="text-xs text-white/60 font-medium">12,000+ travelers</p>
        </div>
      </div>
      <div className="absolute top-28 right-6 md:right-20 z-10 hidden md:flex items-center gap-2.5 bg-blue-600/80 backdrop-blur-xl border border-blue-400/30 rounded-2xl px-4 py-3 text-white shadow-xl">
        <MapPin size={15} />
        <div>
          <p className="text-xs font-black">100+ Destinations</p>
          <p className="text-xs text-blue-200 font-medium">Worldwide</p>
        </div>
      </div>
      <div className="absolute bottom-32 left-6 md:left-20 z-10 hidden lg:flex items-center gap-2.5 bg-emerald-600/70 backdrop-blur-xl border border-emerald-400/30 rounded-2xl px-4 py-3 text-white shadow-xl">
        <Shield size={15} />
        <div>
          <p className="text-xs font-black">Secure Booking</p>
          <p className="text-xs text-emerald-200 font-medium">
            Stripe protected
          </p>
        </div>
      </div>

      <div className="container relative z-10 text-center px-4 py-32 max-w-5xl mx-auto">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold mb-8 backdrop-blur-sm"
          style={{
            background: "rgba(59,130,246,0.15)",
            borderColor: "rgba(96,165,250,0.4)",
            color: "#93c5fd",
          }}
        >
          <Sparkles size={14} />
          <span>AI-Powered Travel Planning</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white leading-[1.05]">
          Explore the World <br className="hidden md:block" />
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)",
            }}
          >
            Smarter, Not Harder.
          </span>
        </h1>

        <p
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          style={{ color: "rgba(203,213,225,0.9)" }}
        >
          AI-powered travel planning with personalized itineraries, real-time
          insights, and seamless booking. Your next adventure starts here.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/destinations"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-2xl shadow-blue-900/50 transition-all hover:scale-105"
          >
            Start Exploring <ArrowRight size={18} />
          </Link>
          <Link
            href="/ai-planner"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 backdrop-blur-md"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "white",
            }}
          >
            <Sparkles size={16} /> Try AI Planner
          </Link>
        </div>

        {/* Trust indicators */}
        <div
          className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold"
          style={{ color: "rgba(148,163,184,0.8)" }}
        >
          {[
            "Free cancellation",
            "Instant confirmation",
            "24/7 AI support",
            "Best price guarantee",
          ].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </div>
      </div>
    </section>
  );
}
