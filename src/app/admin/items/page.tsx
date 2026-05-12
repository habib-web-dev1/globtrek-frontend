"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  Plus,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  Search,
  Pencil,
  Trash2,
  X,
  Check,
  ShieldAlert,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import api from "@/services/api";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";

const PAGE_SIZE = 12;
const CAT_COLORS: Record<string, string> = {
  adventure: "bg-orange-100 text-orange-700",
  luxury: "bg-purple-100 text-purple-700",
  budget: "bg-emerald-100 text-emerald-700",
  cultural: "bg-blue-100 text-blue-700",
};

type FormData = {
  title: string;
  description: string;
  location: string;
  price: string;
  category: string;
  images: string;
  rating: string;
  tags: string;
};
const EMPTY_FORM: FormData = {
  title: "",
  description: "",
  location: "",
  price: "",
  category: "adventure",
  images: "",
  rating: "4.5",
  tags: "",
};

function DestinationForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: FormData;
  onSave: (f: FormData) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(initial);
  const set = (k: keyof FormData, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {(
        [
          ["Title", "title", "text", "e.g. Machu Picchu Trek"],
          ["Location", "location", "text", "e.g. Cusco, Peru"],
          ["Price ($)", "price", "number", "e.g. 1299"],
          ["Rating (0-5)", "rating", "number", "e.g. 4.8"],
          ["Image URL", "images", "text", "https://images.unsplash.com/..."],
          ["Tags (comma separated)", "tags", "text", "hiking, mountains"],
        ] as [string, keyof FormData, string, string][]
      ).map(([label, key, type, ph]) => (
        <div key={key} className="space-y-1">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
            {label}
          </label>
          <input
            type={type}
            required={key !== "tags"}
            placeholder={ph}
            value={form[key]}
            onChange={(e) => set(key, e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      ))}
      <div className="space-y-1">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
          Category
        </label>
        <select
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-400 transition-all"
        >
          {["adventure", "luxury", "budget", "cultural"].map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2 space-y-1">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
          Description
        </label>
        <textarea
          required
          rows={3}
          placeholder="Describe this destination..."
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
        />
      </div>
      <div className="md:col-span-2 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-60"
        >
          {saving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Check size={15} />
          )}{" "}
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
        >
          <X size={15} /> Cancel
        </button>
      </div>
    </form>
  );
}

function AdminItemsContent() {
  const { isDemoAdmin } = useAuthStore();
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/items", {
        params: { searchTerm: search, page, limit: PAGE_SIZE },
      });
      setItems(data.data || []);
      setTotal(data.meta?.total || 0);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const itemToForm = (item: any): FormData => ({
    title: item.title || "",
    description: item.description || "",
    location: item.location || "",
    price: String(item.price || ""),
    category: item.category || "adventure",
    images: (item.images || []).join(", "),
    rating: String(item.rating || "4.5"),
    tags: (item.tags || []).join(", "),
  });

  const parseForm = (f: FormData) => ({
    ...f,
    price: Number(f.price),
    rating: Number(f.rating),
    images: f.images
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    tags: f.tags
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  });

  const handleCreate = async (f: FormData) => {
    if (isDemoAdmin) return;
    setSaving(true);
    try {
      await api.post("/items", parseForm(f));
      setShowAdd(false);
      fetchItems();
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (f: FormData) => {
    if (isDemoAdmin || !editId) return;
    setSaving(true);
    try {
      await api.patch(`/items/${editId}`, parseForm(f));
      setEditId(null);
      fetchItems();
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (isDemoAdmin) return;
    if (!confirm("Delete this destination?")) return;
    try {
      await api.delete(`/items/${id}`);
      fetchItems();
    } catch {
      /* ignore */
    }
  };

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
                You can browse all destinations but cannot add, edit, or delete.
              </p>
            </div>
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Manage <span className="text-blue-600">Destinations</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              {total} destinations in database
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={15}
              />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all w-44"
              />
            </div>
            <button
              onClick={() => {
                setShowAdd(!showAdd);
                setEditId(null);
              }}
              disabled={isDemoAdmin}
              title={
                isDemoAdmin
                  ? "Demo admin cannot add destinations"
                  : "Add new destination"
              }
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${isDemoAdmin ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"}`}
            >
              <Plus size={15} /> Add New
            </button>
          </div>
        </div>

        {showAdd && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 mb-8">
            <h3 className="text-lg font-black text-slate-900 mb-5">
              Add New Destination
            </h3>
            <DestinationForm
              initial={EMPTY_FORM}
              onSave={handleCreate}
              onCancel={() => setShowAdd(false)}
              saving={saving}
            />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={36} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
              {items.map((item: any) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all group"
                >
                  {editId === item._id ? (
                    <div className="p-5">
                      <p className="text-sm font-black text-slate-700 mb-4">
                        Editing: {item.title}
                      </p>
                      <DestinationForm
                        initial={itemToForm(item)}
                        onSave={handleEdit}
                        onCancel={() => setEditId(null)}
                        saving={saving}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={
                            item.images?.[0] ||
                            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400"
                          }
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                        <div
                          className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-black ${CAT_COLORS[item.category] || "bg-slate-100 text-slate-600"}`}
                        >
                          {item.category}
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              if (!isDemoAdmin) {
                                setEditId(item._id);
                                setShowAdd(false);
                              }
                            }}
                            disabled={isDemoAdmin}
                            title={
                              isDemoAdmin ? "Demo admin cannot edit" : "Edit"
                            }
                            className={`p-1.5 bg-white rounded-lg shadow transition-all ${isDemoAdmin ? "text-slate-300 cursor-not-allowed" : "text-blue-600 hover:bg-blue-600 hover:text-white"}`}
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            disabled={isDemoAdmin}
                            title={
                              isDemoAdmin
                                ? "Demo admin cannot delete"
                                : "Delete"
                            }
                            className={`p-1.5 bg-white rounded-lg shadow transition-all ${isDemoAdmin ? "text-slate-300 cursor-not-allowed" : "text-red-500 hover:bg-red-600 hover:text-white"}`}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-black text-slate-900 text-sm mb-1 line-clamp-1">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-1 text-slate-400 text-xs mb-2">
                          <MapPin size={11} />
                          <span className="font-medium truncate">
                            {item.location}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-black text-blue-600">
                            ${item.price}
                          </span>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star size={11} fill="currentColor" />
                            <span className="text-xs font-bold text-slate-600">
                              {item.rating}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/destinations/${item._id}`}
                            className="flex-1 text-center py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded-lg text-xs font-bold transition-all border border-slate-100"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => {
                              if (!isDemoAdmin) {
                                setEditId(item._id);
                                setShowAdd(false);
                              }
                            }}
                            disabled={isDemoAdmin}
                            title={
                              isDemoAdmin ? "Demo admin cannot edit" : "Edit"
                            }
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1 ${isDemoAdmin ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed" : "bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 border-blue-100"}`}
                          >
                            <Pencil size={11} /> Edit
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                  )
                  .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1)
                      acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span
                        key={`e${i}`}
                        className="px-2 text-slate-400 font-bold"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${page === p ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"}`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminItems() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminItemsContent />
    </ProtectedRoute>
  );
}
