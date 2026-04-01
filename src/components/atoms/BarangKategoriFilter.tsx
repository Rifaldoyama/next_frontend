"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Kategori = {
  id: string;
  nama: string;
};

export function BarangKategoriFilter({
  value,
  onChange,
}: {
  value?: string;
  onChange: (kategoriId?: string) => void;
}) {
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchKategori = async () => {
      setLoading(true);
      try {
        const data = await apiFetch("/public/kategori");
        setKategori(data);
      } finally {
        setLoading(false);
      }
    };

    fetchKategori();
  }, []);

  return (
    <select
      value={value ?? ""}
      onChange={(e) =>
        onChange(e.target.value || undefined)
      }
      className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
      disabled={loading}
    >
      <option value="">Semua Kategori</option>

      {kategori.map((k) => (
        <option key={k.id} value={k.id}>
          {k.nama}
        </option>
      ))}
    </select>
  );
}
