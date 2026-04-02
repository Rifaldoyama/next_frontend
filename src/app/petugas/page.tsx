// app/petugas/page.tsx
"use client";

import Link from "next/link";
import { usePetugasPeminjaman } from "@/hooks/petugas/usePetugasPeminjaman";
import { useEffect } from "react";
import {
  Package,
  Truck,
  ClipboardList,
  Printer,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { HamburgerMenu } from "@/components/organisms/petugas/HamburgerMenu";
import { useAuthStore } from "@/store/authStore";

// Status mapping constants
const StatusPeminjaman = {
  MENUNGGU_PERSETUJUAN: "MENUNGGU_PERSETUJUAN",
  SIAP_DIPROSES: "SIAP_DIPROSES",
  DIPROSES: "DIPROSES",
  DIPAKAI: "DIPAKAI",
  SELESAI: "SELESAI",
  DITOLAK: "DITOLAK",
} as const;

export default function PetugasDashboard() {
  const { data, loading, fetchData, startDelivery, actionId, printSurat } =
    usePetugasPeminjaman();
  const { user, logout } = useAuthStore(); // Hanya deklarasi sekali

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const menuItems = [
    { label: "Dashboard", href: "/petugas" },
    { label: "Profile", href: "/petugas/profile" },
    { label: "Logout", action: logout },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case StatusPeminjaman.MENUNGGU_PERSETUJUAN:
        return "bg-yellow-100 text-yellow-800";
      case StatusPeminjaman.SIAP_DIPROSES:
        return "bg-blue-100 text-blue-800";
      case StatusPeminjaman.DIPROSES:
        return "bg-purple-100 text-purple-800";
      case StatusPeminjaman.DIPAKAI:
        return "bg-green-100 text-green-800";
      case StatusPeminjaman.SELESAI:
        return "bg-gray-100 text-gray-800";
      case StatusPeminjaman.DITOLAK:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      [StatusPeminjaman.MENUNGGU_PERSETUJUAN]: "Menunggu Persetujuan",
      [StatusPeminjaman.SIAP_DIPROSES]: "Siap Diproses",
      [StatusPeminjaman.DIPROSES]: "Sedang Diproses",
      [StatusPeminjaman.DIPAKAI]: "Sedang Digunakan",
      [StatusPeminjaman.SELESAI]: "Selesai",
      [StatusPeminjaman.DITOLAK]: "Ditolak",
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    if (status === "LUNAS") return "bg-green-100 text-green-800";
    if (status === "BELUM_BAYAR") return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const getPaymentStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      BELUM_BAYAR: "Belum Bayar",
      MENUNGGU_VERIFIKASI_DP: "Menunggu Verifikasi DP",
      DP_DITERIMA: "DP Diterima",
      DP_DITOLAK: "DP Ditolak",
      MENUNGGU_VERIFIKASI_PELUNASAN: "Menunggu Pelunasan",
      LUNAS: "Lunas",
      DIBATALKAN: "Dibatalkan",
    };
    return statusMap[status] || status;
  };

  const getActionButton = (peminjaman: any) => {
    const status = peminjaman.status_pinjam;

    // Detail button
    const detailButton = (
      <Link
        key="detail"
        href={`/petugas/detail/${peminjaman.id}`}
        className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
      >
        <ClipboardList className="w-4 h-4" />
        <span>Lihat Detail</span>
      </Link>
    );

    // Start delivery button (SIAP_DIPROSES)
    if (status === StatusPeminjaman.SIAP_DIPROSES) {
      return (
        <div className="space-y-2 pt-1">
          {detailButton}
          <button
            onClick={() => startDelivery(peminjaman.id)}
            disabled={actionId === peminjaman.id}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Truck className="w-4 h-4" />
            {actionId === peminjaman.id ? "Memproses..." : "Mulai Antar"}
          </button>
        </div>
      );
    }

    // Process return button (DIPAKAI)
    if (status === StatusPeminjaman.DIPAKAI) {
      return (
        <div className="space-y-2 pt-1">
          {detailButton}
          <Link
            href={`/petugas/detail/${peminjaman.id}`}
            className="flex items-center justify-center gap-2 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
          >
            <Package className="w-4 h-4" />
            <span>Proses Pengembalian</span>
          </Link>
        </div>
      );
    }

    // Print button for DIPROSES (already delivered), DIPAKAI, or SELESAI
    if (
      [
        StatusPeminjaman.DIPROSES,
        StatusPeminjaman.DIPAKAI,
        StatusPeminjaman.SELESAI,
      ].includes(status as any)
    ) {
      return (
        <div className="space-y-2 pt-1">
          {detailButton}
          <button
            onClick={() => printSurat(peminjaman.id)}
            className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Surat Serah Terima</span>
          </button>
        </div>
      );
    }

    // Default
    return <div className="space-y-2 pt-1">{detailButton}</div>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
    

      {/* Content */}
      <main className="p-4 pb-20">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">Tugas Pengantaran</h2>
          <p className="text-sm text-gray-500">
            Kelola pengantaran dan pengembalian alat rental
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <Truck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Diantar</p>
            <p className="text-lg font-bold">
              {
                data.filter(
                  (p) => p.status_pinjam === StatusPeminjaman.DIPROSES,
                ).length
              }
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <Package className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Digunakan</p>
            <p className="text-lg font-bold">
              {
                data.filter((p) => p.status_pinjam === StatusPeminjaman.DIPAKAI)
                  .length
              }
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <CheckCircle className="w-5 h-5 text-gray-600 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Selesai</p>
            <p className="text-lg font-bold">
              {
                data.filter((p) => p.status_pinjam === StatusPeminjaman.SELESAI)
                  .length
              }
            </p>
          </div>
        </div>

        {data.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada tugas pengantaran</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((peminjaman) => (
              <div
                key={peminjaman.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {peminjaman.user.detail.nama_lengkap}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <span>📍</span>
                        <span className="truncate">
                          {peminjaman.alamat_acara}
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(peminjaman.status_pinjam)}`}
                      >
                        {getStatusText(peminjaman.status_pinjam)}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusColor(peminjaman.status_bayar)}`}
                      >
                        {getPaymentStatusText(peminjaman.status_bayar)}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex justify-between text-sm text-gray-600 border-t pt-2">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(
                          peminjaman.tanggal_mulai,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>
                        {new Date(
                          peminjaman.tanggal_selesai,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Barang */}
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500 mb-1">
                      Barang yang disewa:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {peminjaman.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-white px-2 py-1 rounded border"
                        >
                          {item.barang.nama} x{item.jumlah}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  {getActionButton(peminjaman)}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
