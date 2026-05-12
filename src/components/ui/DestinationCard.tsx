"use client";

import { MapPin, Star, ArrowRight, ImageOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface DestinationProps {
  item: {
    _id: string;
    title: string;
    location: string;
    price: number;
    rating: number;
    images: string[];
    category: string;
  };
}

const categoryColors: Record<string, string> = {
  adventure: "bg-orange-100 text-orange-700",
  luxury: "bg-purple-100 text-purple-700",
  budget: "bg-emerald-100 text-emerald-700",
  cultural: "bg-blue-100 text-blue-700",
};

// Reliable fallback images per category
const FALLBACKS: Record<string, string> = {
  adventure:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop",
  luxury:
    "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&auto=format&fit=crop",
  budget:
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop",
  cultural:
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop",
  default:
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop",
};

export default function DestinationCard({ item }: DestinationProps) {
  const catColor =
    categoryColors[item.category] || "bg-slate-100 text-slate-700";
  const fallback = FALLBACKS[item.category] || FALLBACKS.default;
  const [imgSrc, setImgSrc] = useState<string>(item.images?.[0] || fallback);
  const [imgError, setImgError] = useState(false);

  const handleError = () => {
    if (!imgError) {
      setImgError(true);
      setImgSrc(fallback);
    }
  };

  return (
    <div className="trek-card group overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        {imgError && imgSrc === fallback && (
          // Show placeholder if even fallback fails
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400">
            <ImageOff size={32} className="mb-2 opacity-40" />
            <span className="text-xs font-medium opacity-60">
              {item.location}
            </span>
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={item.title}
          onError={handleError}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        <div
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${catColor}`}
        >
          {item.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1.5">
          <h3 className="text-base font-black text-slate-900 line-clamp-1 flex-1 mr-2">
            {item.title}
          </h3>
          <div className="flex items-center gap-1 text-amber-500 font-bold shrink-0">
            <Star size={13} fill="currentColor" />
            <span className="text-sm text-slate-700">{item.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
          <MapPin size={13} className="text-slate-400" />
          <span className="font-medium">{item.location}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              From
            </p>
            <p className="text-xl font-black text-blue-600">${item.price}</p>
          </div>
          <Link
            href={`/destinations/${item._id}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
          >
            View <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
