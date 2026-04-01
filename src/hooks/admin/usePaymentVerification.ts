"use client";

import { useState, useCallback, useEffect } from "react";
import { apiFetch } from "@/lib/api";

interface Payment {
  id: string;
  jumlah: number;
  tipe: "DP" | "PELUNASAN";
  status: "PENDING" | "VERIFIED" | "REJECTED";
  createdAt: string;

  peminjaman: {
    id: string;
    user: {
      username: string;
    };
  };

  bukti_url?: string | null;
}

export function usePaymentVerification() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<"ALL" | "DP" | "PELUNASAN">(
    "ALL",
  );
  const [filterDate, setFilterDate] = useState("");

  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "PENDING" | "VERIFIED" | "REJECTED"
  >("ALL");

  const fetchPayments = useCallback(async () => {
    setLoading(true);

    try {
      let url = "/api/admin/kel-pembayaran/verifikasi-list";
      if (filterStatus !== "ALL") {
        url += `?status=${filterStatus}`;
      }
      const res = await apiFetch(url);

      setPayments(res);
    } catch (error) {
      console.error("Failed to fetch payments", error);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  const verifyPayment = async (id: string) => {
    try {
      await apiFetch(`/api/admin/kel-pembayaran/verifikasi/${id}`, {
        method: "PATCH",
      });
      fetchPayments(); // Refresh
      alert("Pembayaran Berhasil Diverifikasi");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const rejectPayment = async (id: string) => {
    if (!confirm("Yakin ingin menolak pembayaran ini?")) return;
    try {
      await apiFetch(`/api/admin/kel-pembayaran/tolak/${id}`, {
        method: "PATCH",
      });
      fetchPayments(); // Refresh
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Logic Filtering
  const filteredPayments = payments.filter((p) => {
    const matchType = filterType === "ALL" || p.tipe === filterType;
    const matchDate = !filterDate || p.createdAt.startsWith(filterDate);

    return matchType && matchDate;
  });

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments, filterStatus]);

  return {
    payments: filteredPayments,
    loading,
    setFilterType,
    setFilterDate,
    verifyPayment,
    setFilterStatus,
    rejectPayment,
    refresh: fetchPayments,
  };
}
