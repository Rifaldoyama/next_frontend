"use client";

import { useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { showError, showSuccess } from "@/lib/alert";

interface Rekening {
  id: string;
  nama: string;
  nomor: string;
  atas_nama: string;
}

export function useTransaction() {
  const [loading, setLoading] = useState(false);
  const [rekeningList, setRekeningList] = useState<Rekening[]>([]);

  // =============================
  // Fetch rekening tujuan
  // =============================
  const fetchRekening = useCallback(async () => {
    try {
      const res = await apiFetch(`/api/user/pembayaran/rekening-tujuan`);
      setRekeningList(res);
    } catch (error) {
      console.error("Gagal load rekening", error);
    }
  }, []);

  // =============================
  // Create DP / Pelunasan
  // =============================
  const createPayment = async (
    type: "DP" | "PELUNASAN",
    peminjamanId: string,
    rekeningTujuanId: string,
  ) => {
    setLoading(true);

    try {
      const endpoint =
        type === "DP"
          ? `/api/user/pembayaran/dp`
          : `/api/user/pembayaran/pelunasan`;

      const res = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
          peminjamanId,
          rekeningTujuanId,
        }),
      });

      return res;
    } catch (error: any) {
      showError(error.message || "Gagal membuat pembayaran");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Create Full Payment
  // =============================
  const createFullPayment = async (
    peminjamanId: string,
    rekeningTujuanId: string,
  ) => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/user/pembayaran/full`, {
        method: "POST",
        body: JSON.stringify({
          peminjamanId,
          rekeningTujuanId,
        }),
      });

      return res;
    } catch (error: any) {
      showError(error.message || "Gagal membuat full payment");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Upload Bukti Pembayaran
  // =============================
  const uploadProof = async (paymentId: string, file: File) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      await apiFetch(`/api/user/pembayaran/${paymentId}/upload-bukti`, {
        method: "PATCH",
        body: formData,
      });

      return true;
    } catch (error: any) {
      showError(error.message || "Upload gagal");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Reset state
  // =============================
  // const resetPayment = () => {
  //   setActiveDPId(null);
  //   setActivePelunasanId(null);
  //   setActiveFullId(null);
  // };

  return {
    loading,
    rekeningList,
    fetchRekening,
    createPayment,
    createFullPayment,
    uploadProof,
  };
}
