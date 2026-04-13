"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { BiayaDetail } from "../peminjaman/usePeminjamanData";

// Sesuaikan Enum dengan Prisma
export type StatusPeminjaman =
  | "MENUNGGU_PERSETUJUAN"
  | "SIAP_DIPROSES" 
  | "DIPROSES"
  | "DIPAKAI"
  | "SELESAI"
  | "DITOLAK";

export type StatusPembayaran =
  | "BELUM_BAYAR"
  | "MENUNGGU_VERIFIKASI"
  | "DP_DITERIMA"
  | "LUNAS"
  | "BATAL";

export type MetodePengambilan = "AMBIL_SENDIRI" | "DIANTAR";

export interface UserDetail {
  nama_lengkap: string;
  no_hp: string;
  alamat: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  detail: UserDetail;
}

export interface Barang {
  id: string;
  nama: string;
  gambar: string | null;
  harga_sewa: number;
}

export interface Item {
  id: string;
  jumlah: number;
  barang: Barang;
  harga_satuan: number;
}

export interface Zona {
  id: string;
  nama: string;
  biaya: number;
}

interface Actor {
  id: string;
  username: string;
}
// UPDATE: Sesuaikan dengan Schema Prisma Terbaru
export interface Peminjaman {
  id: string;
  status_pinjam: StatusPeminjaman;
  status_bayar: StatusPembayaran;
  metode_ambil: MetodePengambilan;
  createdAt: string;

  // Data Keuangan Baru
  biaya_tambahan: number; // Ongkir
  total_biaya: number; // Grand Total
  nominal_dp: number; // DP Wajib
  sisa_tagihan: number; // Yang harus dilunasi

  deposit: number;
  deposit_kembali: number;
  deposit_dikembalikan: boolean;
  jaminan_tipe: "DEPOSIT_UANG" | "KTP" | "LAINNYA";


  // Relasi
  user: User;
  items: Item[];
  zonaId?: string;
  zona?: Zona;

  // ✅ TAMBAHKAN INI
  approvedBy?: Actor | null;
  deliveredBy?: Actor | null;
  receivedBy?: Actor | null;

  biayaDetails?: BiayaDetail[];
   expired_at?: string;
}

export function useAdminPeminjaman() {
  const [data, setData] = useState<Peminjaman[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Peminjaman | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/peminjaman");
      const listData = res ?? [];

      // Update list utama dengan array baru
      setData([...listData]);

      // Update 'selected' dengan objek baru (clone)
      setSelected((currentSelected) => {
        if (!currentSelected) return null;
        const updated = listData.find(
          (p: Peminjaman) => p.id === currentSelected.id,
        );
        // PENTING: Gunakan {...updated} agar referensi memori berubah
        return updated ? { ...updated } : null;
      });

      return listData;
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function getDetail(id: string) {
    const peminjaman = data.find((p) => p.id === id) || null;
    setSelected(peminjaman);
  }

  async function approve(id: string) {
    if (!confirm("Yakin ingin menyetujui?")) return;
    await apiFetch(`/api/admin/peminjaman/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status_pinjam: "SIAP_DIPROSES" }),
    });
    await fetchAll();
  }

  async function reject(id: string) {
    if (!confirm("Yakin ingin menolak?")) return;
    await apiFetch(`/api/admin/peminjaman/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status_pinjam: "DITOLAK" }),
    });
    await fetchAll();
  }

  async function setZona(peminjamanId: string, zonaId: string) {
    if (loading) return;
    await apiFetch(`/api/admin/zona/assign/${peminjamanId}`, {
      method: "PATCH",
      body: JSON.stringify({ zonaId }),
    });
    return await fetchAll();
  }

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    data,
    loading,
    selected,
    setSelected,
    getDetail,
    approve,
    reject,
    setZona,
    refreshData: fetchAll,
  };
}
