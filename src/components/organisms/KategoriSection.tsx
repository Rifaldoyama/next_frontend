"use client";

import { useRouter } from "next/navigation";
import { KategoriCard } from "@/components/molecules/KategoriCard";
import { Grid, Sparkles } from "lucide-react";

interface Kategori {
  id: string;
  nama: string;
  gambar?: string;
  isActive?: boolean;
}

export function KategoriSection({ items }: { items: Kategori[] }) {
  const router = useRouter();
  const filteredItems = items.filter((item) => item.isActive);
  console.log("Data Kategori:", items);

  return (
    <section className="relative">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Grid className="w-5 h-5 text-orange-500" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Kategori
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            Pilih kategori peralatan yang Anda butuhkan
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Sparkles className="w-3 h-3" />
          <span>{filteredItems.length} Kategori Tersedia</span>
        </div>
      </div>

      {/* Grid Kategori */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredItems.map((kategori) => (
          <KategoriCard
            key={kategori.id}
            nama={kategori.nama}
            gambar={kategori.gambar}
            onClick={() => router.push(`/kategori/${kategori.id}`)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Grid className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">Belum ada kategori tersedia</p>
        </div>
      )}
    </section>
  );
}
