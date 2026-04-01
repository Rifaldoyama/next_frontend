"use client";

import { useEffect } from "react";
import { usePeminjamanData } from "@/hooks/peminjaman/usePeminjamanData";
import { TransactionPanel } from "@/components/organisms/TransactionPanel";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  // Logic Render Tombol Aksi

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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* MODAL */}
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg max-h-[90vh] overflow-y-auto text-black">
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b">
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
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : !detail ? (
            <div className="text-center text-gray-400">
              Data tidak ditemukan
            </div>
          ) : (
            <>
              {/* STATUS */}
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(detail.status_pinjam)}`}
                >
                  {detail.status_pinjam}
                </span>
              </div>

              {/* LIST BARANG */}
              <div className="space-y-4">
                {detail.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 border rounded-lg p-4"
                  >
                    <img
                      src={
                        item.barang?.gambar
                          ? `${IMAGE_BASE_URL}${item.barang.gambar}`
                          : "/placeholder.png"
                      }
                      className="w-28 h-28 object-cover rounded-lg border"
                    />

                    <div className="flex-1 space-y-1">
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
                <div className="flex justify-between">
                  <span>Jarak Pengiriman</span>
                  <span>
                    <p>Zona: {detail.zona?.nama ?? "Belum ditentukan"}</p>
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Biaya Pengiriman</span>
                  <span>{formatRupiah(detail.biaya_tambahan || 0)}</span>
                </div>

                {detail.jaminan_tipe === "DEPOSIT_UANG" && (
                  <div className="border-t pt-2 text-sm">
                    <p className="font-medium text-orange-600">
                      Rekening Pengembalian Deposit:
                    </p>
                    <p>{detail.nama_rekening_pengembalian}</p>
                    <p>{detail.bank_pengembalian}</p>
                    <p>{detail.nomor_rekening_pengembalian}</p>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Subtotal Sewa</span>
                  <span>{formatRupiah(detail.total_sewa)}</span>
                </div>

                <div className="flex justify-between font-semibold">
                  <span>Total Sewa + Ongkir</span>
                  <span>{formatRupiah(detail.total_biaya)}</span>
                </div>

                {detail.deposit > 0 && (
                  <div className="flex justify-between text-orange-600 font-medium">
                    <span>Deposit Jaminan (Dikembalikan)</span>
                    <span>{formatRupiah(detail.deposit)}</span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-lg border-t pt-2 text-blue-700">
                  <span>Total Kewajiban Awal</span>
                  <span>
                    {formatRupiah(
                      detail.total_sewa +
                        (detail.biaya_tambahan || 0) +
                        (detail.deposit || 0),
                    )}
                  </span>
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <TransactionPanel
                    detail={detail}
                    onRefresh={() => fetchDetail(id)}
                    onSuccess={() => {
                      fetchDetail(id);
                    }}
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
