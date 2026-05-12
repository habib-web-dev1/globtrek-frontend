import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Globe,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white text-xl font-black mb-5"
            >
              <div className="bg-blue-600 p-1.5 rounded-xl">
                <Globe size={20} className="text-white" />
              </div>
              GlobeTrek<span className="text-blue-400">AI</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs text-slate-400">
              Empowering travelers with artificial intelligence. Explore, book,
              and experience the world like never before.
            </p>
            <div className="flex gap-3 mb-6">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all"
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-blue-400" />
                <span>hello@globetrekai.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-blue-400" />
                <span>+1 (555) 000-0000</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-blue-400" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-black mb-5 text-sm uppercase tracking-widest">
              Platform
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: "Explore", href: "/destinations" },
                { name: "AI Planner", href: "/login" },
                { name: "My Bookings", href: "/user/dashboard" },
                { name: "Admin Panel", href: "/admin/analytics" },
              ].map((l) => (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    className="hover:text-blue-400 transition-colors font-medium"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-black mb-5 text-sm uppercase tracking-widest">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              {["About Us", "Travel Blog", "Careers", "Press"].map((name) => (
                <li key={name}>
                  <Link
                    href="#"
                    className="hover:text-blue-400 transition-colors font-medium"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-black mb-5 text-sm uppercase tracking-widest">
              Support
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "Help Center",
                "Privacy Policy",
                "Terms of Service",
                "Contact",
              ].map((name) => (
                <li key={name}>
                  <Link
                    href="#"
                    className="hover:text-blue-400 transition-colors font-medium"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <span>© 2026 GlobeTrek AI. Built for the modern explorer.</span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
