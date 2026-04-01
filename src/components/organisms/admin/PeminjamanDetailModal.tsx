"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/Buttons";
import { useAdminZona } from "@/hooks/admin/useAdminZona";
import { useAdminPeminjaman } from "@/hooks/admin/useAdminPeminjaman";
import { formatRupiah } from "@/lib/format";
import { showError } from "@/lib/alert";

interface Props {
  open: boolean;
  onClose: () => void;
  data: any | null; // Menerima 'selected' dari Parent
  setZona: (peminjamanId: string, zonaId: string) => Promise<any>;
  approve: (id: string) => Promise<void>;
  reject: (id: string) => Promise<void>;
  setSelected: (data: any) => void;
}

export function PeminjamanDetailModal({
  open,
  onClose,
  data: currentData,
  setZona,
  approve,
  reject,
  setSelected,
}: Props) {
  const { zona, fetchZona } = useAdminZona();
  const [selectedZona, setSelectedZona] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Efek untuk sinkronisasi dropdown internal
  useEffect(() => {
    if (open && currentData) {
      setSelectedZona(currentData.zonaId || currentData.zona?.id || "");
    }
  }, [currentData?.id, currentData?.zonaId, open]);

  if (!open || !currentData) return null;


  async function handleAssign() {
    if (!currentData || !selectedZona) return;
    setIsSubmitting(true);
    try {
      // Ini akan memicu fetchAll di Parent,
      // dan karena currentData adalah props, dia otomatis terupdate!
      await setZona(currentData.id, selectedZona);
    } catch (error) {
      showError("Gagal memperbarui zona");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col shadow-xl">
        {currentData.metode_ambil === "DIANTAR" && !currentData.zonaId && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4 border border-red-200">
            ⚠️ <strong>Perhatian:</strong> Pesanan ini meminta pengantaran.
            Silakan tentukan zona pengiriman terlebih dahulu sebelum menyetujui.
          </div>
        )}
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">Detail Transaksi</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-black text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 1. INFORMASI USER */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
            <div>
              <p className="text-sm text-gray-500 uppercase font-bold">
                Penyewa
              </p>
              <p className="font-semibold">
                {currentData.user?.detail?.nama_lengkap ||
                  currentData.user?.username ||
                  "N/A"}
              </p>
              <p className="text-sm text-gray-600">{currentData.user?.email}</p>
              <p className="text-sm text-gray-600">
                {currentData.user?.detail?.no_hp || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase font-bold">
                Metode & Alamat
              </p>
              <p className="text-sm">
                {currentData.user?.detail?.alamat || "-"}
              </p>
              <div className="mt-2">
                <span
                  className={`px-2 py-1 text-xs rounded font-bold ${currentData.metode_ambil === "DIANTAR" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}
                >
                  {currentData.metode_ambil?.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>

          {/* 2. MANAGER ZONA */}
          {currentData.metode_ambil === "DIANTAR" && (
            <div className="border p-4 rounded-lg border-blue-200 bg-blue-50">
              <h3 className="font-semibold text-blue-900 mb-2">
                Pengaturan Pengiriman
              </h3>
              <div className="flex gap-2">
                <select
                  className="border p-2 rounded flex-1 text-sm bg-white"
                  value={selectedZona}
                  onChange={(e) => setSelectedZona(e.target.value)}
                  disabled={
                    currentData.status_pinjam !== "MENUNGGU_PERSETUJUAN" || isSubmitting
                  }
                >
                  <option value="">-- Pilih Zona Pengiriman --</option>
                  {zona.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.nama} (+{formatRupiah(z.biaya)})
                    </option>
                  ))}
                </select>
                <Button
                  onClick={handleAssign}
                  disabled={isSubmitting || !selectedZona}
                  size="sm"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Menghitung...
                    </span>
                  ) : (
                    "Update Ongkir"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* 3. LIST BARANG */}
          <div className="overflow-hidden border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Barang</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {currentData.items?.map((item: any) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-3 font-medium">{item.barang.nama}</td>
                    <td className="p-3 text-center">{item.jumlah}</td>
                    <td className="p-3 text-right">
                      {formatRupiah(item.jumlah * item.harga_satuan)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-sm font-semibold">
            Status Pembayaran:
            <span className="ml-2 text-blue-600">
              {currentData.status_bayar.replace("_", " ")}
            </span>
          </div>

          {/* 4. RINCIAN BIAYA (OTOMATIS UPDATE) */}
          <div className="flex justify-end">
            <div className="w-full sm:w-1/2 space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Sewa (Multi-Hari)</span>
                <span>
                  {formatRupiah(
                    currentData.total_biaya - (currentData.biaya_tambahan || 0),
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Ongkir ({currentData.zona?.nama || "Belum Set"})</span>
                <span className="text-blue-600">
                  + {formatRupiah(currentData.biaya_tambahan || 0)}
                </span>
              </div>

              <div className="flex justify-between font-bold text-lg border-b pb-2">
                <span>Total Semua</span>
                <span>{formatRupiah(currentData.total_biaya + (currentData.deposit || 0))}</span>
              </div>

              <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                <div className="flex justify-between text-sm font-bold text-yellow-800">
                  <span>Wajib DP (30%)</span>
                  <span>{formatRupiah(currentData.nominal_dp)}</span>
                </div>
                <div className="flex justify-between text-xs text-yellow-700 mt-1">
                  <span>Sisa Pelunasan</span>
                  <span>{formatRupiah(currentData.sisa_tagihan)}</span>
                </div>
              </div>
              {currentData.jaminan_tipe === "DEPOSIT_UANG" && (
                <div className="bg-blue-50 p-3 rounded-md border border-blue-200 mt-3">
                  <div className="flex justify-between text-sm font-bold text-blue-800">
                    <span>Deposit Dibayar</span>
                    <span>{formatRupiah(currentData.deposit || 0)}</span>
                  </div>

                  <div className="flex justify-between text-sm mt-1">
                    <span>Deposit Dikembalikan</span>
                    <span>
                      {currentData.deposit_dikembalikan
                        ? formatRupiah(currentData.deposit_kembali || 0)
                        : "Belum Dikembalikan"}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm mt-1 font-semibold">
                    <span>Sisa Deposit Ditahan</span>
                    <span>
                      {formatRupiah(
                        (currentData.deposit || 0) -
                          (currentData.deposit_kembali || 0),
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <div className="flex gap-2">
            {currentData.status_pinjam === "MENUNGGU_PERSETUJUAN" && (
              <>
                <Button
                  variant="primary"
                  onClick={async () => {
                    await approve(currentData.id);
                    onClose(); // Tutup modal setelah approve
                  }}
                  // Matikan tombol jika Diantar tapi ongkir belum di-set
                  disabled={
                    currentData.metode_ambil === "DIANTAR" &&
                    !currentData.zonaId
                  }
                >
                  Setujui Peminjaman
                </Button>
                <Button
                  variant="danger"
                  onClick={async () => {
                    await reject(currentData.id);
                    onClose();
                  }}
                >
                  Tolak
                </Button>
              </>
            )}
          </div>
          <Button onClick={onClose} variant="secondary">
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
