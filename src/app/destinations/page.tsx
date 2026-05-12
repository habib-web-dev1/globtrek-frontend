"use client";

import { useState, useEffect, useCallback } from "react";
import FilterSidebar from "@/components/ui/FilterSidebar";
import DestinationCard from "@/components/ui/DestinationCard";
import {
  Loader2,
  SearchX,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import api from "@/services/api";

const PAGE_SIZE = 9;

type Item = {
  _id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  images: string[];
  category: string;
};
type Filters = {
  searchTerm: string;
  category: string;
  minPrice: string;
  maxPrice: string;
};

export default function DestinationsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<Filters>({
    searchTerm: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  const fetchDestinations = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      // Strip empty params so they don't pollute the query string
      const params: Record<string, string | number> = {
        page,
        limit: PAGE_SIZE,
      };
      if (filters.searchTerm) params.searchTerm = filters.searchTerm;
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const { data } = await api.get("/items", { params });
      setItems(data.data || []);
      setTotal(data.meta?.total ?? data.data?.length ?? 0);
    } catch (err) {
      console.error("Fetch destinations error:", err);
      setError(
        "Could not load destinations. Make sure the backend is running on port 5000.",
      );
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const handleFilterChange = (f: Filters) => {
    setFilters(f);
    setPage(1);
  };

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">
            Explore <span className="text-blue-600">Destinations</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Discover handpicked destinations powered by AI
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 w-full flex-shrink-0">
            <FilterSidebar onFilterChange={handleFilterChange} />
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-6">
              <p className="text-slate-500 font-medium text-sm">
                {isLoading ? "Loading..." : `${total} destinations found`}
              </p>
              {totalPages > 1 && (
                <p className="text-slate-400 text-sm font-medium">
                  Page {page} of {totalPages}
                </p>
              )}
            </div>

            {isLoading ? (
              <div className="h-[50vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
              </div>
            ) : error ? (
              <div className="h-[50vh] flex flex-col items-center justify-center text-center gap-4">
                <AlertCircle size={48} className="text-red-300" />
                <div>
                  <p className="font-bold text-slate-700 mb-1">
                    Failed to load destinations
                  </p>
                  <p className="text-slate-400 text-sm font-medium">{error}</p>
                </div>
                <button
                  onClick={fetchDestinations}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all"
                >
                  <RefreshCw size={15} /> Retry
                </button>
              </div>
            ) : items.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
                  {items.map((item) => (
                    <DestinationCard key={item._id} item={item} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (p) =>
                            p === 1 ||
                            p === totalPages ||
                            Math.abs(p - page) <= 2,
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
                              key={`ellipsis-${i}`}
                              className="px-2 text-slate-400 font-bold"
                            >
                              …
                            </span>
                          ) : (
                            <button
                              key={p}
                              onClick={() => setPage(p as number)}
                              className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                                page === p
                                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                  : "bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                              }`}
                            >
                              {p}
                            </button>
                          ),
                        )}
                    </div>

                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="h-[50vh] flex flex-col items-center justify-center text-center">
                <SearchX size={56} className="text-slate-200 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  No destinations found
                </h3>
                <p className="text-slate-500 font-medium">
                  Try adjusting your filters or search term.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
