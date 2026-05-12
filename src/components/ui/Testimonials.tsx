import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Sarah Mitchell",
    location: "New York, USA",
    avatar: "SM",
    rating: 5,
    text: "GlobeTrek AI planned my entire Bali trip in minutes. The AI suggestions were spot-on and the booking was seamless. Absolutely loved it!",
    avatarBg: "from-blue-500 to-indigo-600",
  },
  {
    name: "Arjun Patel",
    location: "Mumbai, India",
    avatar: "AP",
    rating: 5,
    text: "The AI travel assistant is incredible. It recommended hidden gems in Japan that I would never have found on my own. 10/10 experience.",
    avatarBg: "from-purple-500 to-pink-600",
  },
  {
    name: "Emma Larsson",
    location: "Stockholm, Sweden",
    avatar: "EL",
    rating: 5,
    text: "Booked a luxury safari through GlobeTrek. The whole experience from planning to checkout was absolutely flawless. Will use again!",
    avatarBg: "from-emerald-500 to-teal-600",
  },
];

export default function Testimonials() {
  return (
    <section
      className="py-32"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-2">
            Traveler Stories
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-white">
            Loved by{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #60a5fa, #a78bfa)",
              }}
            >
              Explorers
            </span>
          </h2>
          <p className="text-slate-400 font-medium mt-4 max-w-md mx-auto">
            Join thousands of happy travelers who plan smarter with GlobeTrek
            AI.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="p-8 rounded-2xl border border-white/10 hover:border-blue-500/40 transition-all hover:shadow-xl hover:shadow-blue-900/20"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Quote size={28} className="text-blue-500/30 mb-4" />
              <p className="text-slate-300 leading-relaxed mb-6 font-medium">
                {r.text}
              </p>
              <div className="flex items-center gap-1 mb-5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className="text-amber-400"
                    fill="currentColor"
                  />
                ))}
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${r.avatarBg} rounded-full flex items-center justify-center text-white text-sm font-black`}
                >
                  {r.avatar}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{r.name}</p>
                  <p className="text-xs text-slate-400 font-medium">
                    {r.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
