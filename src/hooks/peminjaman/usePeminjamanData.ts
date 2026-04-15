 "use client";

import { useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { apiFetchForm } from "@/services/api-form";

// 1. Definisikan Interface Sesuai JSON Backend
export interface Barang {
  nama: string;
  gambar: string | null;
}

export interface ItemPeminjaman {
  id: string;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;

  barang?: Barang;

  paket?: {
    id: string;
    nama: string;
    items: {
      id: string;
      jumlah: number;
      barang: {
        nama: string;
      };
    }[];
  };
}

export interface Pembayaran {
  id: string;
  jumlah: number;
  metode: string;
  tipe: "DP" | "PELUNASAN" | "FULL" | "DENDA" | "REFUND_DEPOSIT";
  status: "PENDING" | "VERIFIED" | "REJECTED";
  bukti_pembayaran?: string;

  rekeningTujuanId: string;

  rekeningTujuan?: {
    id: string;
    nama: string;
    nomor: string;
    atas_nama: string;
  };
  catatan?: string;
  keterangan_ditolak?: string;
  createdAt: string;
}
//untuk menampilkan detail biaya tambahan seperti ongkir, denda
export interface BiayaDetail {
  id: string;
  tipe: "ONGKIR" | "DENDA" | "DAMAGE" | "ADMIN_FEE" | "DISKON" | "OTHER";
  label: string;
  jumlah: number;
}

export interface Peminjaman {
  id: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  metode_ambil: "AMBIL_SENDIRI" | "DIANTAR";
  alamat_acara?: string;
  status_pinjam:
    | "MENUNGGU_PERSETUJUAN"
    | "SIAP_DIPROSES"
    | "DIPROSES"
    | "DIPAKAI"
    | "SELESAI"
    | "DITOLAK";
  status_bayar: string;
  nominal_dp: number;
  sisa_tagihan: number;
  biaya_tambahan?: number;

  nama_rekening_pengembalian?: string;
  bank_pengembalian?: string;
  nomor_rekening_pengembalian?: string;

  paket?: {
    id: string;
    nama: string;
    items: {
      id: string;
      jumlah: number;
      barang: {
        nama: string;
        gambar?: string;
      };
    }[];
  };

  deposit: number;

  total_tagihan: number; // Total yang harus dibayar (tanpa deposit)
  total_sewa: number; // Total sewa setelah progressive pricing
  total_biaya: number; // Total biaya + deposit
  total_nilai_asli?: number; // Nilai asli sebelum diskon
  total_hari: number; // Durasi sewa

  // Untuk deposit
  deposit_kembali?: number;
  deposit_dikembalikan?: boolean;
  total_denda?: number;

  // Untuk jaminan
  jaminan_tipe?: string;
  jaminan_detail?: string;
  jaminan_status?: string;

  zonaId?: string;
  zona?: {
    id: string;
    nama: string;
    biaya: number;
  };
  biayaDetails?: BiayaDetail[];
  items: ItemPeminjaman[];
  pembayaran?: Pembayaran[];
  createdAt: string;
  expired_at?: string;
}

export function usePeminjamanData() {
  const [data, setData] = useState<Peminjaman[]>([]);
  const [detail, setDetail] = useState<Peminjaman | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/api/peminjaman");
      setData(res);
    } catch (e: any) {
      setError(e.message || "Gagal memuat riwayat");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDetail = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const res = await apiFetch(`/api/peminjaman/${id}`);
      setDetail(res);
    } catch (e: any) {
      setError(e.message || "Gagal memuat detail");
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadBuktiBayar = async (
    id: string,
    file: File,
    tipe: "DP" | "LUNAS",
  ) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tipe", tipe);

      await apiFetchForm(`/api/peminjaman/${id}/upload-bukti`, formData);

      alert("Bukti berhasil dikirim!");
      await fetchDetail(id); // Refresh data setelah upload
    } catch (err: any) {
      alert(err.message || "Gagal upload bukti");
    } finally {
      setUploading(false);
    }
  };

  return {
    data,
    detail,
    loading,
    error,
    fetchHistory,
    fetchDetail,
    uploading,
    uploadBuktiBayar,
  };
}
