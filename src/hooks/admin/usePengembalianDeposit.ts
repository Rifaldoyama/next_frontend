// src/hooks/admin/usePengembalianDeposit.ts

import { showError, showSuccess } from "@/lib/alert";
import { apiFetch } from "@/lib/api";
import { useState, useEffect, useCallback } from "react";

interface PeminjamanDeposit {
  id: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  tanggal_selesai: string;
  deposit: number;
  total_denda: number;
  deposit_kembali: number;
  deposit_dikembalikan: boolean;
  status_pinjam: string;
  pembayaran: {
    id: string;
    tipe: string;
    status: string;
    jumlah: number;
    createdAt: string;
  }[];
}

export function usePengembalianDeposit() {
  const [peminjamanList, setPeminjamanList] = useState<PeminjamanDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "done">(
    "pending",
  );

  const fetchData = useCallback(async () => {
  setLoading(true);
  try {
    // ✅ Sesuaikan dengan path controller yang ada
    const data = await apiFetch(`/api/admin/kel-pembayaran/deposit?status=${filterStatus}`);
    setPeminjamanList(data);
  } catch (error: any) {
    showError(error.message || "Gagal memuat data");
  } finally {
    setLoading(false);
  }
}, [filterStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const kembalikanDeposit = async (peminjamanId: string) => {
    setIsProcessing(true);
    try {
      // ✅ Panggil API backend NestJS untuk kembalikan deposit
      const data = await apiFetch(
        `/api/admin/kel-pembayaran/deposit/${peminjamanId}/kembalikan`,
        {
          method: "POST",
        },
      );

      if (data.success) {
        showSuccess(data.message);
        await fetchData(); // Refresh data
      } else {
        showError(data.message || "Gagal mengembalikan deposit");
      }
    } catch (error: any) {
      showError(error.message || "Gagal memproses pengembalian deposit");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    peminjamanList,
    loading,
    setFilterStatus,
    kembalikanDeposit,
    isProcessing,
    refreshData: fetchData,
  };
}
