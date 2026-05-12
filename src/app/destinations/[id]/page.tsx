"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Star, MapPin, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import api from "@/services/api";
import BookingSidebar from "@/components/ui/BookingSidebar";

export default function DestinationDetails() {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const itemRes = await api.get(`/items/${id}`);
        setItem(itemRes.data.data);

        // Fetch AI Summary using your AIServices logic
        const aiRes = await api.get(`/ai/summary/${id}`);
        setAiSummary(aiRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );

  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            {item.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-slate-500 font-medium">
            <div className="flex items-center gap-1 text-amber-500">
              <Star fill="currentColor" size={18} />
              <span className="text-slate-900 font-bold">{item.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={18} />
              <span>{item.location}</span>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest">
              {item.category}
            </span>
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 h-[500px]">
          <div className="md:col-span-2 relative rounded-[2rem] overflow-hidden shadow-lg">
            <Image
              src={item.images[0]}
              alt="main"
              fill
              className="object-cover"
            />
          </div>
          <div className="hidden md:grid grid-rows-2 gap-4 md:col-span-2">
            <div className="relative rounded-[2rem] overflow-hidden shadow-md">
              <Image
                src={item.images[1] || item.images[0]}
                alt="sub1"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative rounded-[2rem] overflow-hidden shadow-md">
              <Image
                src={item.images[2] || item.images[0]}
                alt="sub2"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold mb-4">About this destination</h2>
            <p className="text-slate-600 leading-relaxed text-lg mb-10">
              {item.description}
            </p>

            {/* AI Review Summary Section (Requirement Highlight) */}
            <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100 mb-12">
              <div className="flex items-center gap-2 text-blue-600 font-bold mb-4 uppercase tracking-tighter">
                <Sparkles size={20} />
                <span>AI Feedback Summary</span>
              </div>
              <p className="text-slate-700 italic leading-relaxed">
                "
                {aiSummary || "Our AI is analyzing recent traveler feedback..."}
                "
              </p>
            </div>
          </div>

          {/* Sticky Booking Sidebar */}
          <div className="lg:w-1/3">
            <BookingSidebar item={item} />
          </div>
        </div>
      </div>
    </div>
  );
}
