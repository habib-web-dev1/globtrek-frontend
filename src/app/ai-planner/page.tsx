"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  Bot,
  User,
  Globe,
  MapPin,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const SUGGESTIONS = [
  "Best destinations for a honeymoon in April?",
  "Plan a 7-day adventure trip under $1500",
  "What are the safest countries for solo travel?",
  "Top cultural experiences in Southeast Asia",
  "Budget-friendly European cities to visit",
  "Best time to visit Japan for cherry blossoms",
];

export default function AIPlanner() {
  const { token, user } = useAuthStore();
  // Wait for Zustand to hydrate from localStorage before rendering auth-gated UI
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm GlobeTrek AI, your personal travel assistant. Ask me anything about destinations, itineraries, budgets, or travel tips. Where would you like to go?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const prompt = (text || input).trim();
    if (!prompt || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: prompt,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/ai/chat", { prompt });
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            data.data || "I couldn't generate a response. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      const status = axiosErr?.response?.status;
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            status === 401 || status === 403
              ? "Please sign in to use the AI planner."
              : "I'm having trouble connecting to the AI service right now. Here's a tip: Southeast Asia (Vietnam, Thailand, Cambodia) offers the best value for budget travelers, while the Maldives and Seychelles are top luxury picks. What would you like to know more about?",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Chat cleared! Ready to help you plan your next adventure. Where would you like to go?",
        timestamp: new Date(),
      },
    ]);
  };

  // Show loading skeleton while Zustand hydrates
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={36} />
      </div>
    );
  }

  // Not logged in — show feature teaser
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-900/50">
            <Sparkles size={36} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4">
            GlobeTrek <span className="text-blue-400">AI Planner</span>
          </h1>
          <p className="text-slate-400 font-medium mb-8 leading-relaxed text-lg">
            Your personal AI travel assistant. Plan trips, discover
            destinations, and get expert travel advice.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-8 text-left">
            {[
              {
                icon: <MapPin size={16} />,
                text: "Personalized destination recommendations",
              },
              {
                icon: <Lightbulb size={16} />,
                text: "AI-generated itineraries",
              },
              { icon: <Globe size={16} />, text: "Real-time travel insights" },
              { icon: <Sparkles size={16} />, text: "Budget & safety tips" },
            ].map((f) => (
              <div
                key={f.text}
                className="flex items-start gap-2.5 p-3 bg-slate-800 rounded-xl border border-slate-700"
              >
                <span className="text-blue-400 mt-0.5 shrink-0">{f.icon}</span>
                <span className="text-slate-300 text-sm font-medium">
                  {f.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all text-center"
            >
              Sign In to Chat
            </Link>
            <Link
              href="/register"
              className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all border border-slate-700 text-center"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-50 flex flex-col"
      style={{ paddingTop: "64px" }}
    >
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-16 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <p className="font-black text-slate-900 text-sm">
              GlobeTrek AI Planner
            </p>
            <p className="text-xs text-emerald-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
              Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-black">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <span className="text-sm font-bold text-slate-700">
              {user?.name}
            </span>
          </div>
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all text-sm font-bold"
          >
            <RefreshCw size={14} /> Clear
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full">
        {messages.length === 1 && (
          <div className="mb-6">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
              Try asking...
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${msg.role === "assistant" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"}`}
              >
                {msg.role === "assistant" ? (
                  <Bot size={16} />
                ) : (
                  <User size={16} />
                )}
              </div>
              <div
                className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${msg.role === "assistant" ? "bg-white border border-slate-100 shadow-sm text-slate-700 rounded-tl-none" : "bg-blue-600 text-white rounded-tr-none"}`}
              >
                {msg.content.split("\n").map((line, i, arr) => (
                  <span key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
                <p
                  className={`text-xs mt-1.5 ${msg.role === "assistant" ? "text-slate-400" : "text-blue-200"}`}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-white border border-slate-100 shadow-sm px-4 py-3 rounded-2xl rounded-tl-none">
                <div className="flex items-center gap-1.5">
                  {[0, 150, 300].map((delay) => (
                    <div
                      key={delay}
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="bg-white border-t border-slate-100 px-4 py-3">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask about destinations, itineraries, budgets..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            disabled={loading}
            autoComplete="off"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-200 flex items-center gap-2"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 font-medium mt-2">
          GlobeTrek AI can make mistakes. Verify important travel information.
        </p>
      </div>
    </div>
  );
}
