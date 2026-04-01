"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

export function useSewa() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitPeminjaman = async (payload: {
    tanggal_mulai: string;
    tanggal_selesai: string;
    metode_ambil: "AMBIL_SENDIRI" | "DIANTAR";
    alamat_acara?: string;
    jaminan_tipe: "DEPOSIT_UANG" | "KTP" | "SIM";
    jaminan_detail?: string;
    nama_rekening_pengembalian?: string;
    bank_pengembalian?: string;
    nomor_rekening_pengembalian?: string;
    items: { barangId: string; jumlah: number }[];
  }) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await apiFetch("/api/peminjaman", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { submitPeminjaman, loading, error, success };
}
