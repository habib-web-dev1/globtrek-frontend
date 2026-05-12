import { MessageSquareText, Sparkles, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function AIChatPreview() {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs uppercase tracking-widest mb-6">
            <Sparkles size={14} />
            <span>Smart AI Assistant</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 leading-tight">
            Plan your trip with{" "}
            <span className="text-blue-600">GlobeTrek AI.</span>
          </h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
            Not sure where to go? Our AI travel assistant analyzes thousands of
            destinations to suggest the perfect spot based on your mood, budget,
            and season.
          </p>
          <ul className="space-y-3 mb-10">
            {[
              "Ask about restaurants & local food",
              "Summarize guest reviews instantly",
              "Get local safety & weather tips",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-slate-700 font-medium"
              >
                <CheckCircle size={18} className="text-blue-600 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all"
          >
            <MessageSquareText size={18} /> Open AI Chat
          </Link>
        </div>

        <div className="lg:w-1/2 w-full">
          <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl">
            {/* Chat header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <MessageSquareText size={18} />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">GlobeTrek AI</h4>
                <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
                  Online
                </p>
              </div>
            </div>
            {/* Messages */}
            <div className="space-y-4 mb-6">
              <div className="bg-slate-800 text-slate-200 p-4 rounded-2xl rounded-tl-none max-w-[85%] text-sm font-medium leading-relaxed">
                I&apos;m looking for a cultural adventure in April. Any
                suggestions?
              </div>
              <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[85%] ml-auto text-sm font-medium leading-relaxed">
                Based on current weather and festivals, I recommend{" "}
                <span className="font-black">Kyoto, Japan</span> for cherry
                blossoms or <span className="font-black">Rome, Italy</span> for
                history!
              </div>
              <div className="bg-slate-800 text-slate-200 p-4 rounded-2xl rounded-tl-none max-w-[85%] text-sm font-medium">
                What&apos;s the budget for Kyoto?
              </div>
              <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[85%] ml-auto text-sm font-medium">
                A 7-day Kyoto trip averages{" "}
                <span className="font-black">$1,200–$1,800</span> including
                flights, hotels & food.
              </div>
            </div>
            {/* Input */}
            <div className="flex gap-2">
              <div className="flex-1 bg-slate-800 rounded-xl px-4 py-3 text-slate-400 text-sm font-medium">
                Ask anything about travel...
              </div>
              <button className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                <Sparkles size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
