"use client";

import { useState, useEffect } from "react";
import { Loader2, Star, Trash2, RefreshCw, ShieldAlert } from "lucide-react";
import api from "@/services/api";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";

type Review = {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId?: { name: string };
  itemId?: { title: string };
};

function AdminReviewsContent() {
  const { isDemoAdmin } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    // Fetch reviews for all items — we'll use a general approach
    try {
      // Get all items first, then fetch reviews per item
      const { data: itemsData } = await api.get("/items", {
        params: { limit: 100 },
      });
      const items = itemsData.data || [];
      const allReviews: Review[] = [];
      await Promise.all(
        items.slice(0, 20).map(async (item: any) => {
          try {
            const { data } = await api.get(`/reviews/item/${item._id}`);
            (data.data || []).forEach((r: any) =>
              allReviews.push({ ...r, itemId: { title: item.title } }),
            );
          } catch {
            /* ignore */
          }
        }),
      );
      setReviews(
        allReviews.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const deleteReview = async (id: string) => {
    if (isDemoAdmin) return;
    if (!confirm("Delete this review?")) return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
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
                You can view all reviews but cannot delete any.
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Manage <span className="text-blue-600">Reviews</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              {reviews.length} reviews found
            </p>
          </div>
          <button
            onClick={fetchReviews}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={36} />
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-20 text-center text-slate-400 font-medium">
            No reviews yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-black text-slate-900 text-sm">
                      {r.itemId?.title || "Destination"}
                    </p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      by {r.userId?.name || "Anonymous"}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteReview(r._id)}
                    disabled={isDemoAdmin}
                    title={
                      isDemoAdmin
                        ? "Demo admin cannot delete reviews"
                        : "Delete review"
                    }
                    className={`p-1.5 rounded-lg transition-all ${isDemoAdmin ? "text-slate-200 cursor-not-allowed" : "text-slate-300 hover:text-red-500 hover:bg-red-50"}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={
                        i < r.rating ? "text-amber-400" : "text-slate-200"
                      }
                      fill="currentColor"
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-500 ml-1">
                    {r.rating}/5
                  </span>
                </div>
                <p className="text-slate-600 text-sm font-medium leading-relaxed line-clamp-3">
                  {r.comment}
                </p>
                <p className="text-xs text-slate-300 font-medium mt-3">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminReviews() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminReviewsContent />
    </ProtectedRoute>
  );
}
