"use client";

import { useEffect, useState } from "react";
import { usePeminjamanData } from "@/hooks/peminjaman/usePeminjamanData";
import { TransactionPanel } from "@/components/organisms/TransactionPanel";
import { useRouter } from "next/navigation";

const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:9000";

interface Props {
  id: string;
  open: boolean;
  onClose: () => void;
}

export function DetailPeminjamanModal({ id, open, onClose }: Props) {
  const router = useRouter();
  const { detail, loading, fetchDetail } = usePeminjamanData();

  useEffect(() => {
    if (open && id) {
      fetchDetail(id);
    }
  }, [open, id, fetchDetail]);

  if (!open) return null;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const ongkir =
    detail?.biayaDetails?.find((b) => b.tipe === "ONGKIR")?.jumlah || 0;
  const ongkirDetail = detail?.biayaDetails?.find((b) => b.tipe === "ONGKIR");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DIAJUKAN":
        return "bg-yellow-100 text-yellow-800";
      case "DISETUJUI":
        return "bg-blue-100 text-blue-800";
      case "DITOLAK":
        return "bg-red-100 text-red-800";
      case "SELESAI":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const isExpired = !!(
    detail?.expired_at && new Date() > new Date(detail.expired_at)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 text-black">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold">Detail Peminjaman</h2>
            {detail && (
              <p className="text-sm text-gray-500">
                {formatDate(detail.tanggal_mulai)} -{" "}
                {formatDate(detail.tanggal_selesai)}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl transition-colors"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading...</div>
          ) : !detail ? (
            <div className="text-center text-gray-400 py-8">
              Data tidak ditemukan
            </div>
          ) : (
            <>
              {/* STATUS */}
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(detail.status_pinjam)}`}
                >
                  {detail.status_pinjam}
                </span>
              </div>

              {isExpired && detail.expired_at && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  Transaksi expired pada{" "}
                  {new Date(detail.expired_at).toLocaleString("id-ID")}
                </div>
              )}

              {/* LIST BARANG */}
              <div className="space-y-4">
                {detail.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4"
                  >
                    <img
                      src={
                        item.barang?.gambar
                          ? `${IMAGE_BASE_URL}${item.barang.gambar}`
                          : "/placeholder.png"
                      }
                      alt={item.barang?.nama || "Barang"}
                      className="w-28 h-28 object-cover rounded-lg border mx-auto sm:mx-0"
                    />

                    <div className="flex-1 space-y-1 text-center sm:text-left">
                      <h3 className="font-bold text-lg">
                        {item.barang?.nama || "Nama barang tidak tersedia"}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Jumlah: {item.jumlah} unit
                      </p>

                      <p className="text-sm text-gray-500">
                        Harga/unit: {formatRupiah(item.harga_satuan)}
                      </p>

                      <p className="font-semibold text-blue-600">
                        Subtotal: {formatRupiah(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* INFO TAMBAHAN */}
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <span className="text-gray-600">Jarak Pengiriman</span>
                  <span className="font-medium">
                    Zona pengiriman: {ongkirDetail?.label ?? "Belum ditentukan"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <span className="text-gray-600">Biaya Pengiriman</span>
                  <span className="font-medium">
                    {formatRupiah(ongkir || 0)}
                  </span>
                </div>

                {detail.jaminan_tipe === "DEPOSIT_UANG" && (
                  <div className="border-t pt-2 text-sm">
                    <p className="font-medium text-orange-600 mb-2">
                      Rekening Pengembalian Deposit:
                    </p>
                    <div className="space-y-1">
                      <p>{detail.nama_rekening_pengembalian}</p>
                      <p>{detail.bank_pengembalian}</p>
                      <p>{detail.nomor_rekening_pengembalian}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <span className="text-gray-600">Subtotal Sewa</span>
                  <span className="font-medium">
                    {formatRupiah(detail.total_sewa)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-2 font-semibold text-base">
                  <span className="text-gray-600">Total</span>
                  <span>{formatRupiah(detail.total_biaya)}</span>
                </div>

                {detail.deposit > 0 && (
                  <div className="flex flex-col sm:flex-row justify-between gap-2 text-orange-600 font-medium">
                    <span>Deposit Jaminan (Dikembalikan)</span>
                    <span>{formatRupiah(detail.deposit)}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between gap-2 font-bold text-lg border-t pt-2 text-blue-700">
                  <span>Total Kewajiban Awal</span>
                  <span>
                    {formatRupiah(
                      detail.total_sewa + ongkir + (detail.deposit || 0),
                    )}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <TransactionPanel
                    detail={detail}
                    onRefresh={() => fetchDetail(id)}
                    onSuccess={() => fetchDetail(id)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
