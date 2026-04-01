"use client";

import Image from "next/image";
import { resolveImage } from "@/lib/image";
import { Card } from "@/components/atoms/Card";
import { Package, Sparkles } from "lucide-react";

interface KategoriCardProps {
  nama: string;
  gambar?: string;
  onClick: () => void;
}

export const KategoriCard = ({ nama, gambar, onClick }: KategoriCardProps) => {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
    >
      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-pink-500/0 group-hover:from-orange-500/10 group-hover:to-pink-500/10 transition-all duration-300 z-10" />

      {/* Image Container */}
      <div className="relative w-full aspect-square sm:aspect-[4/3] overflow-hidden">
        {gambar ? (
          <Image
            src={resolveImage(gambar)!}
            alt={nama}
            fill
            unoptimized
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-pink-100 flex flex-col items-center justify-center gap-2">
            <Package className="w-8 h-8 sm:w-10 sm:h-10 text-orange-400" />
            <span className="text-xs sm:text-sm text-gray-400">No Image</span>
          </div>
        )}

        {/* Decorative Badge */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 text-center relative z-20">
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">
          {nama}
        </h3>

        {/* Decorative Line */}
        <div className="w-8 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Item Count Indicator (Optional - bisa ditambahkan jika ada data) */}
        <p className="text-xs text-gray-400 mt-1 group-hover:text-orange-500 transition-colors duration-300">
          Klik untuk lihat detail
        </p>
      </div>
    </Card>
  );
};
