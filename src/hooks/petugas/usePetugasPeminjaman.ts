// hooks/petugas/usePetugasPeminjaman.ts
import { useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { apiFetchForm } from "@/services/api-form";
import { toast } from "react-hot-toast";

// Enum sesuai backend
enum StatusPeminjaman {
  MENUNGGU_PERSETUJUAN = "MENUNGGU_PERSETUJUAN",
  SIAP_DIPROSES = "SIAP_DIPROSES",
  DIPROSES = "DIPROSES",
  DIPAKAI = "DIPAKAI",
  SELESAI = "SELESAI",
  DITOLAK = "DITOLAK",
}

enum KondisiBarang {
  BAGUS = "BAGUS",
  RUSAK_RINGAN = "RUSAK_RINGAN",
  RUSAK_SEDANG = "RUSAK_SEDANG",
  RUSAK_BERAT = "RUSAK_BERAT",
  HILANG = "HILANG",
}

interface Peminjaman {
  id: string;
  user: {
    id: string;
    email: string;
    detail: {
      nama_lengkap: string;
      no_telepon: string;
      foto?: string;
    };
  };
  alamat_acara: string;
  metode_pengambilan: string;
  status_pinjam: StatusPeminjaman;
  status_bayar: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  items: Array<{
    barangId: string;
    barang: {
      nama: string;
      kode: string;
      harga_sewa_per_hari: number;
    };
    jumlah: number;
    harga_satuan: number;
  }>;
  metode_ambil: string;
  zona: {
    nama: string;
    biaya: number;
  };
  biayaDetails: Array<{
    tipe: string;
    jumlah: number;
    label: string;
  }>;
  total_biaya: number;
  sisa_tagihan: number;
}

const BASE_URL = "/api/petugas/peminjaman";

export function usePetugasPeminjaman() {
  const [data, setData] = useState<Peminjaman[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(BASE_URL);
      setData(response);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal memuat data");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDetail = useCallback(async (id: string) => {
    try {
      return await apiFetch(`${BASE_URL}/${id}`);
    } catch (error: any) {
      toast.error(error.message || "Gagal memuat detail");
      throw error;
    }
  }, []);

  const startDelivery = useCallback(
    async (id: string) => {
      setActionId(id);
      try {
        const res = await apiFetch(`${BASE_URL}/${id}/start`, {
          method: "PATCH",
        });

        toast.success("Pengantaran dimulai");
        await fetchData();
        return res;
      } catch (error: any) {
        toast.error(error.message || "Gagal memulai pengantaran");
        throw error;
      } finally {
        setActionId(null);
      }
    },
    [fetchData],
  );

  const confirmArrival = useCallback(
    async (id: string) => {
      setActionId(id);
      try {
        const res = await apiFetch(`${BASE_URL}/${id}/confirm-arrival`, {
          method: "PATCH",
        });

        toast.success("Barang telah sampai di tujuan");
        await fetchData();
        return res;
      } catch (error: any) {
        toast.error(error.message || "Gagal konfirmasi kedatangan");
        throw error;
      } finally {
        setActionId(null);
      }
    },
    [fetchData],
  );

  const handover = useCallback(
    async (id: string, kondisi: KondisiBarang, file?: File) => {
      setActionId(id);
      try {
        const formData = new FormData();
        formData.append("kondisi_barang_keluar", kondisi);

        if (file) {
          formData.append("foto_serah_terima", file);
        }

        await apiFetchForm(`${BASE_URL}/${id}/handover`, formData, {
          method: "PATCH",
        });

        toast.success("Barang berhasil diserahkan");
        await fetchData();
        return true;
      } catch (error: any) {
        toast.error(error.message || "Gagal handover");
        return false;
      } finally {
        setActionId(null);
      }
    },
    [fetchData],
  );

  const kembalikanJaminanFisik = useCallback(
    async (id: string, catatan?: string, file?: File) => {
      setActionId(id);
      try {
        const formData = new FormData();
        formData.append("status", "DIKEMBALIKAN");
        if (catatan) formData.append("catatan", catatan);
        if (file) formData.append("foto_bukti", file);

        const response = await apiFetchForm(
          `${BASE_URL}/${id}/kembalikan-jaminan`,
          formData,
          { method: "PATCH" },
        );

        toast.success("Jaminan berhasil dikembalikan");
        await fetchData();
        return response;
      } catch (error: any) {
        toast.error(error.message || "Gagal mengembalikan jaminan");
        throw error;
      } finally {
        setActionId(null);
      }
    },
    [fetchData],
  );

  const returnBarang = useCallback(
    async (
      id: string,
      items: Array<{ barangId: string; kondisi_kembali: KondisiBarang }>,
      file?: File,
      tanggal_kembali?: string,
    ) => {
      setActionId(id);
      try {
        const formData = new FormData();
        if (tanggal_kembali) {
          formData.append("tanggal_kembali", tanggal_kembali);
        }

        // ✅ FIX DI SINI
        formData.append("items", JSON.stringify(items));

        if (file) {
          formData.append("foto_pengembalian", file);
        }

        await apiFetchForm(`${BASE_URL}/${id}/return`, formData, {
          method: "PATCH",
        });

        toast.success("Pengembalian berhasil");
        await fetchData();
        return true;
      } catch (error: any) {
        toast.error(error.message || "Gagal return");
        return false;
      } finally {
        setActionId(null);
      }
    },
    [fetchData],
  );

  // ✅ PRINT SURAT
  const printSurat = useCallback(async (id: string) => {
    try {
      const blob = await apiFetch(`${BASE_URL}/${id}/surat`, {
        method: "GET",
        isBlob: true,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `surat_serah_terima_${id}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);

      toast.success("Surat berhasil diunduh");
    } catch (error: any) {
      toast.error(error.message || "Gagal download surat");
    }
  }, []);

  return {
    data,
    loading,
    actionId,
    fetchData,
    fetchDetail,
    startDelivery,
    confirmArrival,
    handover,
    returnBarang,
    kembalikanJaminanFisik,
    printSurat,
  };
}
