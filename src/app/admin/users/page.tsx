"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Trash2,
  ShieldCheck,
  User,
  RefreshCw,
  Search,
  ShieldAlert,
} from "lucide-react";
import api from "@/services/api";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";

type UserType = {
  _id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
};

function AdminUsersContent() {
  const { isDemoAdmin } = useAuthStore();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users");
      setUsers(data.data || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id: string) => {
    if (isDemoAdmin) return;
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      /* ignore */
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Demo admin notice */}
        {isDemoAdmin && (
          <div className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
            <ShieldAlert size={18} className="text-amber-600 shrink-0" />
            <div>
              <p className="font-black text-amber-800 text-sm">
                Demo Admin Mode
              </p>
              <p className="text-amber-600 text-xs font-medium">
                You can view all users but cannot delete any accounts.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Manage <span className="text-blue-600">Users</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              {users.length} registered users
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <button
              onClick={fetchUsers}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={36} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {["User", "Email", "Role", "Joined", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-4 text-xs font-black text-slate-400 uppercase tracking-widest"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((u) => (
                    <tr
                      key={u._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black ${u.role === "ADMIN" ? "bg-blue-600" : "bg-slate-400"}`}
                          >
                            {u.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="font-bold text-slate-900 text-sm">
                            {u.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500 font-medium">
                        {u.email}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black ${u.role === "ADMIN" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}
                        >
                          {u.role === "ADMIN" ? (
                            <ShieldCheck size={12} />
                          ) : (
                            <User size={12} />
                          )}
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-400 font-medium">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        {u.role !== "ADMIN" && (
                          <button
                            onClick={() => deleteUser(u._id)}
                            disabled={isDemoAdmin}
                            title={
                              isDemoAdmin
                                ? "Demo admin cannot delete users"
                                : "Delete user"
                            }
                            className={`p-2 rounded-lg transition-all ${isDemoAdmin ? "text-slate-200 cursor-not-allowed" : "text-slate-400 hover:text-red-600 hover:bg-red-50"}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-slate-400 font-medium">
                  No users found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminUsersContent />
    </ProtectedRoute>
  );
}
