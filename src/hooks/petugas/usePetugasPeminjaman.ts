"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";

export type StatusPeminjaman =
  | "DIAJUKAN"
  | "DISETUJUI"
  | "PROSES_PERSIAPAN"
  | "DIANTAR"
  | "SIAP_DIAMBIL"
  | "DIPAKAI"
  | "MENUNGGU_VERIFIKASI_ADMIN"
  | "SELESAI"
  | "DITOLAK";

export interface Peminjaman {
  id: string;
  status_pinjam: StatusPeminjaman;
  status_bayar: string;
  metode_ambil: string;
  alamat_acara: string;
  tanggal_mulai: string;
  tanggal_selesai: string;

  user: {
    detail: {
      nama_lengkap: string;
      no_hp: string;
    };
  };
}

export function usePetugasPeminjaman() {
  const [data, setData] = useState<Peminjaman[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/petugas/peminjaman");
      setData(Array.isArray(res) ? res : []);
    } finally {
      setLoading(false);
    }
  }, []);

  const printSurat = async (id: string) => {
    const blob = await apiFetch(`/api/petugas/peminjaman/${id}/surat`, {
      isBlob: true,
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `surat-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  };

  const fetchDetail = async (id: string) => {
    return await apiFetch(`/api/petugas/peminjaman/${id}`);
  };

  /* ================= START DELIVERY ================= */
  const startDelivery = async (id: string) => {
    setActionId(id);
    try {
      await apiFetch(`/api/petugas/peminjaman/${id}/start`, {
        method: "PATCH",
      });
      await fetchAll();
    } finally {
      setActionId(null);
    }
  };

  /* ================= HANDOVER ================= */
  const handover = async (
    id: string,
    payload: {
      kondisi_barang_keluar: string;
      foto_serah_terima: File;
      foto_jaminan?: File;
    },
  ) => {
    setActionId(id);
    try {
      const formData = new FormData();
      formData.append("kondisi_barang_keluar", payload.kondisi_barang_keluar);
      formData.append("foto_serah_terima", payload.foto_serah_terima);

      if (payload.foto_jaminan) {
        formData.append("foto_jaminan", payload.foto_jaminan);
      }

      await fetch(`/api/petugas/peminjaman/${id}/handover`, {
        method: "PATCH",
        body: formData,
      });

      await fetchAll();
    } finally {
      setActionId(null);
    }
  };

  /* ================= RETURN BARANG ================= */
  const returnBarang = async (
    id: string,
    items: { barangId: string; kondisi_kembali: string }[],
    file?: File,
  ) => {
    setActionId(id);
    try {
      const formData = new FormData();
      formData.append("items", JSON.stringify(items));

      if (file) {
        formData.append("foto_pengembalian", file); // ✅ FIXED
      }

      await fetch(`/api/petugas/peminjaman/${id}/return`, {
        method: "PATCH", // ✅ FIXED
        body: formData,
      });

      await fetchAll();
    } finally {
      setActionId(null);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    data,
    loading,
    printSurat,
    fetchDetail,
    actionId,
    startDelivery,
    handover,
    returnBarang,
  };
}
