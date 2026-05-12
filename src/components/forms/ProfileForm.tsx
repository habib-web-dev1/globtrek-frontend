"use client";

import { useState } from "react";
import { User, Mail, CheckCircle } from "lucide-react";

export default function ProfileForm({ user }: { user: any }) {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <h3 className="text-2xl font-black text-slate-900 mb-8">Edit Profile</h3>
      <form onSubmit={handleSave} className="space-y-6 max-w-lg">
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
              defaultValue={user?.name}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-medium"
            />
          </div>
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
              defaultValue={user?.email}
              disabled
              className="w-full pl-12 pr-4 py-4 bg-slate-100 border border-slate-200 rounded-2xl outline-none font-medium text-slate-400 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-slate-400 ml-1">
            Email cannot be changed.
          </p>
        </div>
        {saved ? (
          <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-700 rounded-2xl font-bold">
            <CheckCircle size={18} /> Profile saved successfully!
          </div>
        ) : (
          <button
            type="submit"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all"
          >
            Save Changes
          </button>
        )}
      </form>
    </div>
  );
}
