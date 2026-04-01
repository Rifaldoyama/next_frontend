"use client";

import { RekeningCard } from "@/components/molecules/admin/RekeningCard";
import { useRekeningTujuan } from "@/hooks/admin/useRekeningTujuan";

export function RekeningList() {
  const { data, loading, toggleStatus } = useRekeningTujuan();

  if (loading)
    return (
      <div className="flex justify-center p-10 text-gray-400 animate-pulse">
        Memuat daftar rekening...
      </div>
    );

  if (data.length === 0)
    return (
      <div className="text-center p-10 border-2 border-dashed rounded-xl text-gray-400">
        Belum ada rekening terdaftar.
      </div>
    );

  return (
    <div className="space-y-4">
      {data.map((rekening) => (
        <RekeningCard
          key={rekening.id}
          rekening={rekening}
          onToggleStatus={toggleStatus}
        />
      ))}
    </div>
  );
}
