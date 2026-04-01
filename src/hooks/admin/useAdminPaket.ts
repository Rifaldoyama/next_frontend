"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { apiFetchForm } from "@/services/api-form";

export interface PaketItem {
  id: string;
  nama: string;
  harga_final: number;
  total_paket: number;
  diskon_persen?: number;
  deskripsi?: string;
  isActive: boolean;
  items: {
    id: string;
    barangId: string;
    jumlah: number;
    barang: {
      id: string;
      nama: string;
      harga_sewa: number;
    };
  }
  gambar?: string | null;
}

export const useAdminPaket = () => {
  const [paket, setPaket] = useState<PaketItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPaket = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiFetch("/admin/paket");

      if (!Array.isArray(data)) {
        throw new Error("Response bukan array");
      }

      setPaket(data);
    } catch (err: any) {
      setError(err.message);
      setPaket([]);
    } finally {
      setLoading(false);
    }
  };

  const createPaket = async (formData: FormData) => {
    await apiFetchForm("/admin/paket", formData);
    await fetchPaket();
  };

  const updatePaket = async (id: string, formData: FormData) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/paket/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    await fetchPaket();
  };

  const togglePaket = async (id: string) => {
  await apiFetch(`/admin/paket/${id}/toggle`, {
    method: "PATCH",
  });

  await fetchPaket();
};

  useEffect(() => {
    fetchPaket();
  }, []);

  return {
    paket,
    loading,
    error,
    fetchPaket,
    createPaket,
    updatePaket,
    togglePaket,
  };
};