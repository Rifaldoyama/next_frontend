"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Buttons";
import { ZonaManagerModal } from "@/components/organisms/admin/ZonaManagerModal";
import { useAdminPeminjaman } from "@/hooks/admin/useAdminPeminjaman";
import { PeminjamanDetailModal } from "@/components/organisms/admin/PeminjamanDetailModal";
import { formatRupiah } from "@/lib/format";

export default function KelolaPeminjamanPage() {
  const [openZona, setOpenZona] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  // Ambil logic dari hook
  const {
    data,
    loading,
    approve,
    reject,
    getDetail,
    selected,
    setZona,
    setSelected,
  } = useAdminPeminjaman();

  const handleOpenDetail = (id: string) => {
    getDetail(id);
    setDetailOpen(true);
  };

  const getStatusBayarColor = (status: string) => {
    switch (status) {
      case "BELUM_BAYAR":
        return "border-gray-300 text-gray-600";
      case "MENUNGGU_VERIFIKASI":
        return "border-yellow-400 text-yellow-600";
      case "DP_DITERIMA":
        return "border-blue-500 text-blue-600";
      case "LUNAS":
        return "border-green-500 text-green-600";
      case "BATAL":
        return "border-red-500 text-red-600";
      default:
        return "border-gray-300 text-gray-600";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kelola Peminjaman</h1>
        <Button onClick={() => setOpenZona(true)}>
          Kelola Zona Pengiriman
        </Button>
      </div>

      {loading && <p>Loading data...</p>}
      {!loading && data.length === 0 && (
        <p className="text-gray-500">Belum ada data peminjaman.</p>
      )}

      <div className="grid gap-4">
        {data.map((p) => {
          const ongkirDetail = p.biayaDetails?.find(
            (b: any) => b.tipe === "ONGKIR",
          );
          const ongkir = ongkirDetail?.jumlah || 0;

          return (
            <div
              key={p.id}
              className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-center"
            >
              {/* Kolom Kiri: Info Utama */}
              <div>
                <div className="font-bold text-lg">
                  {p.user?.detail?.nama_lengkap ||
                    p.user?.username ||
                    "User Tanpa Nama"}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(p.createdAt).toLocaleDateString("id-ID")} •{" "}
                  {p.items.length} Barang
                </div>
                <div className="mt-2 flex gap-2">
                  {/* Badge Status Pinjam */}
                  <span
                    className={`px-2 py-0.5 text-xs rounded font-bold 
                    ${
                      p.status_pinjam === "MENUNGGU_PERSETUJUAN"
                        ? "bg-yellow-100 text-yellow-800"
                        : p.status_pinjam === "SIAP_DIPROSES"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100"
                    }`}
                  >
                    {p.status_pinjam}
                  </span>

                  {/* Badge Status Bayar */}
                  <span
                    className={`px-2 py-0.5 text-xs rounded font-bold border 
                  ${getStatusBayarColor(p.status_bayar)}`}
                  >
                    {p.status_bayar.replace("_", " ")}
                  </span>

                  {/* Warning jika Diantar tapi belum set zona */}
                  {p.metode_ambil === "DIANTAR" &&
                    !p.zona &&
                    p.status_pinjam === "MENUNGGU_PERSETUJUAN" && (
                      <span className="px-2 py-0.5 text-xs rounded font-bold bg-red-100 text-red-600 animate-pulse">
                        ! Butuh Set Ongkir
                      </span>
                    )}
                </div>
              </div>

              {/* Kolom Tengah: Harga */}
              <div className="text-right mr-4">
                <div className="text-xs text-gray-500">Total Tagihan</div>
                <div className="font-bold text-lg text-blue-600">
                  {formatRupiah(p.total_biaya + p.deposit)}
                </div>
                {p.metode_ambil === "DIANTAR" && (
                  <div className="text-xs text-gray-400">
                    {ongkir > 0
                      ? `Ongkir: ${formatRupiah(ongkir)}`
                      : "Ongkir belum set"}
                  </div>
                )}
              </div>

              {/* Kolom Kanan: Aksi */}
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleOpenDetail(p.id)}
                >
                  Lihat Detail & Aksi
                </Button>

                {/* Tombol Cepat (Opsional, lebih aman di dalam detail)
              {p.status_pinjam === "MENUNGGU_PERSETUJUAN" && (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    onClick={() => approve(p.id)}
                    className="w-full"
                  >
                    Acc
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => reject(p.id)}
                    className="w-full"
                  >
                    Tolak
                  </Button>
                </div>
              )} */}
              </div>
            </div>
          );
        })}
      </div>

      <ZonaManagerModal open={openZona} onClose={() => setOpenZona(false)} />

      {/* Pass selected data dari hook ke modal */}
      <PeminjamanDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        data={selected} // Data sinkron
        setZona={setZona} // Fungsi sinkron
        approve={approve}
        reject={reject}
        setSelected={setSelected}
      />
    </div>
  );
}
