"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Globe,
  Sparkles,
  Eye,
  EyeOff,
  Zap,
  ShieldAlert,
  User,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import api from "@/services/api";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });

  const validate = () => {
    const errs = { email: "", password: "" };
    if (!form.email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters.";
    setFieldErrors(errs);
    return !errs.email && !errs.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      setAuth(data.data.user, data.data.token, false);
      router.push(
        data.data.user.role === "ADMIN"
          ? "/admin/analytics"
          : "/user/dashboard",
      );
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: "USER" | "ADMIN") => {
    const creds =
      role === "ADMIN"
        ? { email: "admin@gmail.com", password: "Admin123" }
        : { email: "rahim@gmail.com", password: "Rahim123" };
    setForm(creds);
    setIsLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", creds);
      // Demo admin gets isDemoAdmin=true — read-only access
      const isDemo = role === "ADMIN";
      setAuth(data.data.user, data.data.token, isDemo);
      router.push(
        data.data.user.role === "ADMIN"
          ? "/admin/analytics"
          : "/user/dashboard",
      );
    } catch {
      setError("Demo account not found. Please check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-16 text-white"
        style={{
          background:
            "linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #0f172a 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800')",
            backgroundSize: "cover",
          }}
        />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-500 rounded-full opacity-20 blur-3xl" />
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Globe size={36} className="text-white" />
            </div>
            <span className="text-3xl font-black tracking-tight">
              GlobeTrek<span className="text-blue-300">AI</span>
            </span>
          </div>
          <h2 className="text-4xl font-black mb-4 leading-tight">
            Your World,
            <br />
            Your Adventure
          </h2>
          <p className="text-blue-200 text-lg max-w-sm mx-auto leading-relaxed mb-10">
            AI-powered travel planning for the modern explorer. 100+
            destinations await.
          </p>
          <div className="grid grid-cols-2 gap-4 text-center">
            {[
              { val: "100+", label: "Destinations" },
              { val: "12k+", label: "Travelers" },
              { val: "99%", label: "Satisfaction" },
              { val: "24/7", label: "AI Support" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
              >
                <div className="text-2xl font-black text-white">{s.val}</div>
                <div className="text-blue-200 text-sm font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Globe size={22} className="text-white" />
            </div>
            <span className="text-xl font-black text-slate-900">
              GlobeTrek<span className="text-blue-600">AI</span>
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2">
              Welcome back
            </h1>
            <p className="text-slate-500 font-medium">
              Sign in to continue your journey
            </p>
          </div>

          {/* Demo Access */}
          <div className="mb-6 rounded-2xl border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 flex items-center gap-2 border-b border-blue-100">
              <Zap size={15} className="text-blue-600" />
              <span className="text-sm font-black text-slate-700">
                Quick Demo Access
              </span>
            </div>
            <div className="p-4 space-y-3">
              {/* Demo User */}
              <button
                type="button"
                onClick={() => handleDemoLogin("USER")}
                disabled={isLoading}
                className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm"
              >
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                  <User size={14} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-black text-sm">Demo User</p>
                  <p className="text-blue-200 text-xs font-medium">
                    Full booking & payment access
                  </p>
                </div>
                <Sparkles size={14} className="opacity-70" />
              </button>

              {/* Demo Admin */}
              <button
                type="button"
                onClick={() => handleDemoLogin("ADMIN")}
                disabled={isLoading}
                className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-sm transition-all shadow-sm"
              >
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                  <ShieldAlert size={14} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-black text-sm">Demo Admin</p>
                  <p className="text-slate-400 text-xs font-medium">
                    View-only · No edit/delete
                  </p>
                </div>
                <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-black">
                  READ ONLY
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              or sign in manually
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-medium ${fieldErrors.email ? "border-red-400 bg-red-50" : "border-slate-200"}`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-red-500 text-xs font-medium ml-1">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-4 bg-slate-50 border rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-medium ${fieldErrors.password ? "border-red-400 bg-red-50" : "border-slate-200"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-500 text-xs font-medium ml-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <ArrowRight size={18} /> Sign In
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-600 font-medium">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-bold hover:underline"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
