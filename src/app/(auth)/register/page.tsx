"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Globe,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import api from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const getPasswordStrength = (pw: string) => {
    if (!pw) return { label: "", color: "", width: "0%" };
    if (pw.length < 6)
      return { label: "Too short", color: "bg-red-500", width: "25%" };
    if (pw.length < 8)
      return { label: "Weak", color: "bg-orange-500", width: "50%" };
    if (!/[A-Z]/.test(pw) || !/[0-9]/.test(pw))
      return { label: "Fair", color: "bg-amber-500", width: "75%" };
    return { label: "Strong", color: "bg-emerald-500", width: "100%" };
  };

  const validate = () => {
    const errs = { name: "", email: "", password: "" };
    if (!form.name.trim()) errs.name = "Full name is required.";
    else if (form.name.trim().length < 2)
      errs.name = "Name must be at least 2 characters.";
    if (!form.email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters.";
    setFieldErrors(errs);
    return !errs.name && !errs.email && !errs.password;
  };

  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setError("");
    try {
      await api.post("/auth/register", form);
      // Auto-login after register
      const { data } = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      setAuth(data.data.user, data.data.token);
      router.push("/user/dashboard");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const perks = [
    "AI-powered travel recommendations",
    "Instant booking confirmation",
    "Exclusive member-only deals",
    "24/7 AI travel assistant",
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 relative overflow-hidden flex-col items-center justify-center p-16 text-white">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1')] bg-cover bg-center" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-400 rounded-full opacity-20 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Globe size={36} className="text-white" />
            </div>
            <span className="text-3xl font-black tracking-tight">
              GlobeTrek<span className="text-blue-300">AI</span>
            </span>
          </div>
          <h2 className="text-4xl font-black mb-4 leading-tight">
            Start Your
            <br />
            Adventure Today
          </h2>
          <p className="text-blue-200 text-lg mb-10 max-w-sm leading-relaxed">
            Join 12,000+ travelers who plan smarter with AI-powered insights.
          </p>
          <div className="space-y-4">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={14} className="text-blue-300" />
                </div>
                <span className="text-blue-100 font-medium">{perk}</span>
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
              Create your account
            </h1>
            <p className="text-slate-500 font-medium">
              Free forever. No credit card required.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-medium ${fieldErrors.name ? "border-red-400 bg-red-50" : "border-slate-200"}`}
                />
              </div>
              {fieldErrors.name && (
                <p className="text-red-500 text-xs font-medium ml-1">
                  {fieldErrors.name}
                </p>
              )}
            </div>

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
                  minLength={6}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Min. 6 characters"
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
              {/* Password strength meter */}
              {form.password && (
                <div className="mt-2">
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} rounded-full transition-all duration-300`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p
                    className={`text-xs font-bold mt-1 ml-1 ${strength.color.replace("bg-", "text-")}`}
                  >
                    {strength.label}
                  </p>
                </div>
              )}
              {fieldErrors.password && (
                <p className="text-red-500 text-xs font-medium ml-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl text-emerald-700 text-sm font-medium">
              <ShieldCheck size={18} className="flex-shrink-0" />
              Your data is secured with industry-standard JWT encryption.
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
                  Create Free Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-600 font-medium">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-bold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
