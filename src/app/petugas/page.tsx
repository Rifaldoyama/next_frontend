"use client";

import Link from "next/link";
import { usePetugasPeminjaman } from "@/hooks/petugas/usePetugasPeminjaman";
import { useEffect, useState } from "react";
import {
  Package,
  Truck,
  ClipboardList,
  Printer,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
} from "lucide-react";
import { HamburgerMenu } from "@/components/organisms/petugas/HamburgerMenu";
import { useAuthStore } from "@/store/authStore";
import { formatRupiah } from "@/lib/format";

// Status mapping constants
const StatusPeminjaman = {
  MENUNGGU_PERSETUJUAN: "MENUNGGU_PERSETUJUAN",
  SIAP_DIPROSES: "SIAP_DIPROSES",
  DIPROSES: "DIPROSES",
  DIPAKAI: "DIPAKAI",
  SELESAI: "SELESAI",
  DITOLAK: "DITOLAK",
} as const;

// Define types for better TypeScript support
interface BiayaDetail {
  tipe: string;
  jumlah: number;
}

interface Barang {
  nama: string;
}

interface PeminjamanItem {
  barang: Barang;
  jumlah: number;
}

interface UserDetail {
  nama_lengkap: string;
}

interface User {
  detail: UserDetail;
}

interface Peminjaman {
  id: string;
  user: User;
  alamat_acara?: string;
  metode_ambil: string;
  status_pinjam: string;
  status_bayar: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  biayaDetails?: BiayaDetail[];
  items: PeminjamanItem[];
  jaminan_tipe?: string;
  jaminan_status?: string;
  jaminan_detail?: string;
}

export default function PetugasDashboard() {
  const {
    data,
    loading,
    fetchData,
    startDelivery,
    actionId,
    printSurat,
    confirmArrival,
  } = usePetugasPeminjaman();
  const { user, logout } = useAuthStore();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"DIANTAR" | "AMBIL_SENDIRI">(
    "DIANTAR",
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Perbaikan: Gunakan prop "items" bukan "menuItems"
  const menuItems = [
    { label: "Dashboard", href: "/petugas", icon: "Home" },
    { label: "Profile", href: "/petugas/profile", icon: "User" },
    { label: "Logout", action: logout, icon: "LogOut" },
  ];

  // Filter function that works for both tabs
  const filterData = (dataArray: Peminjaman[]) => {
    return dataArray.filter((p: Peminjaman) => {
      const matchSearch =
        p.user.detail.nama_lengkap
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        p.alamat_acara?.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        filterStatus === "ALL" || p.status_pinjam === filterStatus;

      return matchSearch && matchStatus;
    });
  };

  const dataDiantar = data.filter(
    (p: Peminjaman) => p.metode_ambil === "DIANTAR",
  );
  const dataAmbilSendiri = data.filter(
    (p: Peminjaman) => p.metode_ambil === "AMBIL_SENDIRI",
  );

  const filteredDiantar = filterData(dataDiantar);
  const filteredAmbilSendiri = filterData(dataAmbilSendiri);

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

  const getActionButton = (peminjaman: Peminjaman) => {
    const status = peminjaman.status_pinjam;
    const metode = peminjaman.metode_ambil;

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

    // START DELIVERY (SIAP_DIPROSES)
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
            {actionId === peminjaman.id
              ? "Memproses..."
              : metode === "DIANTAR"
                ? "Mulai Antar"
                : "Ambil Barang"}
          </button>
        </div>
      );
    }

    // CONFIRM ARRIVAL (DIPROSES - KHUSUS DIANTAR)
    if (status === StatusPeminjaman.DIPROSES && metode === "DIANTAR") {
      return (
        <div className="space-y-2 pt-1">
          {detailButton}
          <button
            onClick={() => confirmArrival(peminjaman.id)}
            disabled={actionId === peminjaman.id}
            className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            {actionId === peminjaman.id
              ? "Memproses..."
              : "Konfirmasi Sampai Tujuan"}
          </button>
        </div>
      );
    }

    if (status === StatusPeminjaman.DIPROSES && metode === "AMBIL_SENDIRI") {
      return (
        <div className="space-y-2 pt-1">
          {detailButton}
          <Link
            href={`/petugas/detail/${peminjaman.id}`}
            className="flex items-center justify-center gap-2 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
          >
            <Package className="w-4 h-4" />
            <span>Serah Terima Barang</span>
          </Link>
        </div>
      );
    }

    // PROCESS RETURN (DIPAKAI)
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

    // PRINT SURAT (SELESAI)
    // PRINT SURAT & KEMBALIKAN JAMINAN (SELESAI)
    if (status === StatusPeminjaman.SELESAI) {
      const isJaminanFisik =
        peminjaman.jaminan_tipe && peminjaman.jaminan_tipe !== "DEPOSIT_UANG";
      const isJaminanBelumKembali =
        peminjaman.jaminan_status !== "DIKEMBALIKAN";

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

          {/* ✅ Tombol Kembalikan Jaminan (hanya untuk jaminan fisik yang belum dikembalikan) */}
          {isJaminanFisik && isJaminanBelumKembali && (
            <Link
              href={`/petugas/kembalikan-jaminan/${peminjaman.id}`}
              className="flex items-center justify-center gap-2 w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Kembalikan Jaminan ({peminjaman.jaminan_tipe})</span>
            </Link>
          )}
        </div>
      );
    }

    // DEFAULT (MENUNGGU_PERSETUJUAN, DITOLAK, dll)
    return <div className="space-y-2 pt-1">{detailButton}</div>;
  };

  // Helper function to extract ongkir from biayaDetails
  const getOngkir = (peminjaman: Peminjaman) => {
    return (
      peminjaman.biayaDetails?.find((b: BiayaDetail) => b.tipe === "ONGKIR")
        ?.jumlah ?? 0
    );
  };

  // Render peminjaman card
  const renderPeminjamanCard = (peminjaman: Peminjaman) => (
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
            <div className="text-sm text-gray-500 mt-1 space-y-1">
              <div className="flex items-center gap-1">
                <span>📍</span>
                <span className="truncate">
                  {peminjaman.alamat_acara || "-"}
                </span>
              </div>

              <div>
                🚚 Metode:{" "}
                <span className="font-medium">
                  {peminjaman.metode_ambil === "DIANTAR"
                    ? "Diantar"
                    : "Ambil Sendiri"}
                </span>
              </div>

              {peminjaman.metode_ambil === "DIANTAR" && (
                <div>
                  📦 Ongkir:{" "}
                  <span className="text-green-600 font-medium">
                    {formatRupiah(getOngkir(peminjaman))}
                  </span>
                </div>
              )}
            </div>
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
              {new Date(peminjaman.tanggal_mulai).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>
              {new Date(peminjaman.tanggal_selesai).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Barang */}
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-xs text-gray-500 mb-1">Barang yang disewa:</p>
          <div className="flex flex-wrap gap-2">
            {peminjaman.items.map((item: PeminjamanItem, idx: number) => (
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
  );

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
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-xl font-bold text-gray-800">Petugas Dashboard</h1>
          {/* Perbaikan: Gunakan prop "items" bukan "menuItems" */}
          <HamburgerMenu items={menuItems} />
        </div>
      </header>

      {/* Content */}
      <main className="p-4 pb-20">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">Tugas Pengantaran</h2>
          <p className="text-sm text-gray-500">
            Kelola pengantaran dan pengembalian alat rental
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-3 rounded-xl shadow-sm mb-4 space-y-2">
          <input
            type="text"
            placeholder="Cari nama / alamat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg text-sm"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg text-sm"
          >
            <option value="ALL">Semua Status</option>
            <option value="MENUNGGU_PERSETUJUAN">Menunggu Persetujuan</option>
            <option value="SIAP_DIPROSES">Siap Diproses</option>
            <option value="DIPROSES">Diproses / Diantar</option>
            <option value="DIPAKAI">Sedang Digunakan</option>
            <option value="SELESAI">Selesai</option>
            <option value="DITOLAK">Ditolak</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <Truck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Diantar</p>
            <p className="text-lg font-bold">
              {
                data.filter(
                  (p: Peminjaman) =>
                    p.status_pinjam === StatusPeminjaman.DIPROSES,
                ).length
              }
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <Package className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Digunakan</p>
            <p className="text-lg font-bold">
              {
                data.filter(
                  (p: Peminjaman) =>
                    p.status_pinjam === StatusPeminjaman.DIPAKAI,
                ).length
              }
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <CheckCircle className="w-5 h-5 text-gray-600 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Selesai</p>
            <p className="text-lg font-bold">
              {
                data.filter(
                  (p: Peminjaman) =>
                    p.status_pinjam === StatusPeminjaman.SELESAI,
                ).length
              }
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4 border-b">
          <button
            onClick={() => setActiveTab("DIANTAR")}
            className={`flex-1 py-2 px-4 text-center font-medium transition-all ${
              activeTab === "DIANTAR"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Truck className="w-4 h-4" />
              <span>Diantar ({filteredDiantar.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("AMBIL_SENDIRI")}
            className={`flex-1 py-2 px-4 text-center font-medium transition-all ${
              activeTab === "AMBIL_SENDIRI"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <User className="w-4 h-4" />
              <span>Ambil Sendiri ({filteredAmbilSendiri.length})</span>
            </div>
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "DIANTAR" ? (
          <>
            {filteredDiantar.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {search || filterStatus !== "ALL"
                    ? "Tidak ada pengantaran yang sesuai dengan filter"
                    : "Belum ada tugas pengantaran"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDiantar.map(renderPeminjamanCard)}
              </div>
            )}
          </>
        ) : (
          <>
            {filteredAmbilSendiri.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {search || filterStatus !== "ALL"
                    ? "Tidak ada pengambilan sendiri yang sesuai dengan filter"
                    : "Belum ada pengambilan sendiri"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAmbilSendiri.map(renderPeminjamanCard)}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
