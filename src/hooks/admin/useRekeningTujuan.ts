"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export interface RekeningTujuan {
  id: string;
  nama: string;
  nomor: string;
  metode: string;
  atas_nama: string;
  instruksi?: string;
  aktif: boolean;
}

export function useRekeningTujuan() {
  const [data, setData] = useState<RekeningTujuan[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchRekening() {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/kel-pembayaran");
      setData(res);
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(id: string) {
    try {
      await apiFetch(`/api/admin/kel-pembayaran/${id}/toggle-status`, {
        method: "PATCH",
      });
      await fetchRekening(); // Refresh data
    } catch (error) {
      alert("Gagal mengubah status rekening");
    }
  }

  async function nonaktifkan(id: string) {
    await apiFetch(`/api/admin/kel-pembayaran/${id}/nonaktif`, {
      method: "PATCH",
    });

    await fetchRekening();
  }

  useEffect(() => {
    fetchRekening();
  }, []);

  return {
    data,
    loading,
    toggleStatus,
    fetchRekening,
    nonaktifkan,
  };
}
