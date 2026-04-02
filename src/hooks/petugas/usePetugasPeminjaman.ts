// hooks/petugas/usePetugasPeminjaman.ts
import { useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { apiFetchForm } from "@/services/api-form";
import { toast } from "react-hot-toast";

// Enum yang sesuai dengan backend
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
  total_biaya: number;
  sisa_tagihan: number;
}

export function usePetugasPeminjaman() {
  const [data, setData] = useState<Peminjaman[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Coba beberapa kemungkinan endpoint
      let response;
      try {
        // Kemungkinan 1: /petugas/peminjaman
        response = await apiFetch("/petugas/peminjaman");
      } catch (error1) {
        console.log(
          "Endpoint /petugas/peminjaman failed, trying /peminjaman/petugas",
        );
        try {
          // Kemungkinan 2: /peminjaman/petugas
          response = await apiFetch("/peminjaman/petugas");
        } catch (error2) {
          console.log(
            "Endpoint /peminjaman/petugas failed, trying /api/petugas/peminjaman",
          );
          // Kemungkinan 3: dengan prefix /api
          response = await apiFetch("/api/petugas/peminjaman");
        }
      }
      setData(response);
    } catch (error: any) {
      console.error("Fetch data error:", error);
      toast.error(error.message || "Gagal memuat data");
      setData([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDetail = useCallback(async (id: string) => {
    try {
      let response;
      try {
        response = await apiFetch(`/petugas/peminjaman/${id}`);
      } catch (error1) {
        try {
          response = await apiFetch(`/peminjaman/petugas/${id}`);
        } catch (error2) {
          response = await apiFetch(`/api/petugas/peminjaman/${id}`);
        }
      }
      return response;
    } catch (error: any) {
      console.error("Fetch detail error:", error);
      toast.error(error.message || "Gagal memuat detail");
      throw error;
    }
  }, []);

  const startDelivery = useCallback(
    async (id: string) => {
      setActionId(id);
      try {
        let response;
        try {
          response = await apiFetch(
            `/petugas/peminjaman/${id}/start-delivery`,
            {
              method: "POST",
            },
          );
        } catch (error1) {
          try {
            response = await apiFetch(
              `/peminjaman/petugas/${id}/start-delivery`,
              {
                method: "POST",
              },
            );
          } catch (error2) {
            response = await apiFetch(
              `/api/petugas/peminjaman/${id}/start-delivery`,
              {
                method: "POST",
              },
            );
          }
        }
        toast.success("Pengantaran dimulai");
        await fetchData();
        return response;
      } catch (error: any) {
        console.error("Start delivery error:", error);
        toast.error(error.message || "Gagal memulai pengantaran");
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

        // Panggil API sesuai dengan endpoint yang ada
        const response = await apiFetchForm(
          `/petugas/peminjaman/${id}/handover`,
          formData,
        );

        toast.success("Barang berhasil diserahkan");
        await fetchData();
        return true;
      } catch (error: any) {
        console.error("Handover error:", error);
        toast.error(error.message || "Gagal melakukan handover");
        return false;
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
    ) => {
      setActionId(id);
      try {
        const formData = new FormData();
        formData.append("items", JSON.stringify(items));
        if (file) {
          formData.append("foto_pengembalian", file);
        }

        let response;
        try {
          response = await apiFetchForm(
            `/petugas/peminjaman/${id}/return`,
            formData,
          );
        } catch (error1) {
          try {
            response = await apiFetchForm(
              `/peminjaman/petugas/${id}/return`,
              formData,
            );
          } catch (error2) {
            response = await apiFetchForm(
              `/api/petugas/peminjaman/${id}/return`,
              formData,
            );
          }
        }

        toast.success("Pengembalian berhasil");
        await fetchData();
        return true;
      } catch (error: any) {
        console.error("Return error:", error);
        toast.error(error.message || "Gagal melakukan pengembalian");
        return false;
      } finally {
        setActionId(null);
      }
    },
    [fetchData],
  );

  const printSurat = useCallback(async (id: string) => {
    try {
      let blob;
      try {
        blob = await apiFetch(`/petugas/peminjaman/${id}/print-surat`, {
          method: "GET",
          isBlob: true,
        });
      } catch (error1) {
        try {
          blob = await apiFetch(`/peminjaman/petugas/${id}/print-surat`, {
            method: "GET",
            isBlob: true,
          });
        } catch (error2) {
          blob = await apiFetch(`/api/petugas/peminjaman/${id}/print-surat`, {
            method: "GET",
            isBlob: true,
          });
        }
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `surat_serah_terima_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Surat berhasil diunduh");
    } catch (error: any) {
      console.error("Print error:", error);
      toast.error(error.message || "Gagal mencetak surat");
    }
  }, []);

  return {
    data,
    loading,
    actionId,
    fetchData,
    fetchDetail,
    startDelivery,
    handover,
    returnBarang,
    printSurat,
  };
}
