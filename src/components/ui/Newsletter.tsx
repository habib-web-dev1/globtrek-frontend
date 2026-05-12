import { Mail, Sparkles } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="py-28 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-slate-900 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-400 font-bold text-xs uppercase tracking-widest mb-6">
              <Sparkles size={12} /> Exclusive Access
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Join the GlobeTrek Elite
            </h2>
            <p className="text-slate-400 mb-10 max-w-lg mx-auto text-base font-medium leading-relaxed">
              Get exclusive AI-curated travel deals and destination guides
              delivered to your inbox every week.
            </p>

            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-grow">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                />
              </div>
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all whitespace-nowrap shadow-lg shadow-blue-900/30">
                Subscribe
              </button>
            </form>
            <p className="mt-5 text-sm text-slate-500 font-medium">
              No spam. Only inspiration. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
