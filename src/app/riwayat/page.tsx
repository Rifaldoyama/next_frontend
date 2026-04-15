"use client";

import { useEffect, useState } from "react";
import {
  usePeminjamanData,
  Peminjaman,
} from "@/hooks/peminjaman/usePeminjamanData";
import { Header } from "@/components/molecules/Header";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { DetailPeminjamanModal } from "@/components/molecules/DetailPeminjamanModal";
import {
  Clock,
  Package,
  Calendar,
  CreditCard,
  ChevronRight,
  History,
} from "lucide-react";

const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:9000";

export default function HistoryPage() {
  const { data, loading, error, fetchHistory } = usePeminjamanData();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (loading) return <HistorySkeleton />;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-orange-200/20 to-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
      </div>

      <Header
        userName={user?.username || "User"}
        onLogout={handleLogout}
        isLoggedIn={!!user}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
              <History className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Riwayat Peminjaman
            </h1>
          </div>
          <p className="text-gray-500 ml-13">
            Pantau status pengajuan dan barang sewaanmu
          </p>
        </div>

        {data.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-orange-400" />
            </div>
            <p className="text-gray-500 text-lg">
              Belum ada riwayat peminjaman
            </p>
            <p className="text-sm text-gray-400 mt-1">Mulai sewa sekarang!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {data.map((sewa) => (
              <HistoryCard
                key={sewa.id}
                sewa={sewa}
                onDetail={() => setSelectedId(sewa.id)}
              />
            ))}
          </div>
        )}
      </div>

      <DetailPeminjamanModal
        id={selectedId || ""}
        open={!!selectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}

// ==========================================
// SUB-COMPONENT: HISTORY CARD
// ==========================================
function HistoryCard({
  sewa,
  onDetail,
}: {
  sewa: Peminjaman;
  onDetail: () => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "MENUNGGU_PERSETUJUAN":
        return "bg-yellow-100 text-yellow-800";
      case "SIAP_DIPROSES":
        return "bg-blue-100 text-blue-800";
      case "DIPROSES":
        return "bg-purple-100 text-purple-800";
      case "DIPAKAI":
        return "bg-green-100 text-green-800";
      case "SELESAI":
        return "bg-gray-100 text-gray-800";
      case "DITOLAK":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      MENUNGGU_PERSETUJUAN: "Menunggu Persetujuan",
      SIAP_DIPROSES: "Siap Diproses",
      DIPROSES: "Sedang Diproses",
      DIPAKAI: "Sedang Digunakan",
      SELESAI: "Selesai",
      DITOLAK: "Ditolak",
    };
    return statusMap[status] || status;
  };

  const ongkirDetail = sewa.biayaDetails?.find((b) => b.tipe === "ONGKIR");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "MENUNGGU_PERSETUJUAN":
        return <Clock className="w-3 h-3" />;
      case "SIAP_DIPROSES":
        return <Calendar className="w-3 h-3" />;
      case "DIPROSES":
        return <Package className="w-3 h-3" />;
      case "DIPAKAI":
        return <Package className="w-3 h-3" />;
      case "SELESAI":
        return <CreditCard className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const barangItems = sewa.items || [];
  const paket = sewa.paket;

  const totalBiayaTambahan =
    sewa.biayaDetails?.reduce((sum, item) => sum + (item.jumlah || 0), 0) || 0;

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* HEADER CARD */}
      <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Tanggal Sewa
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {formatDate(sewa.tanggal_mulai)} -{" "}
              {formatDate(sewa.tanggal_selesai)}
            </p>
          </div>

          {sewa.metode_ambil === "DIANTAR" && (
            <div>
              <p className="text-xs text-gray-500 font-medium">Zona</p>
              <p className="text-sm text-gray-700">
                {ongkirDetail?.label ?? "Belum ditentukan"}
              </p>
            </div>
          )}

          {/* <div>
            <p className="text-xs text-gray-500 font-medium">DP</p>
            <p className="text-sm font-semibold text-gray-800">
              {formatRupiah(sewa.nominal_dp)}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 font-medium">Sisa Tagihan</p>
            <p className="text-sm font-semibold text-gray-800">
              {formatRupiah(sewa.sisa_tagihan)}
            </p>
          </div> */}
        </div>

        {/* Status Badge */}
        <div className="mt-3 flex justify-end">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(sewa.status_pinjam)}`}
          >
            {getStatusIcon(sewa.status_pinjam)}
            {sewa.status_pinjam}
          </span>
        </div>
        {sewa.status_pinjam === "SELESAI" && (
          <div className="mt-3 space-y-2">
            {/* Info Deposit */}
            {sewa.jaminan_tipe === "DEPOSIT_UANG" && sewa.deposit > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-1">
                  <CreditCard className="w-4 h-4" />
                  Info Deposit Jaminan
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deposit Awal:</span>
                    <span className="font-medium">
                      {formatRupiah(sewa.deposit)}
                    </span>
                  </div>
                  {/* ✅ Gunakan fallback || 0 */}
                  {(sewa.total_denda || 0) > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Potongan Denda:</span>
                      <span>- {formatRupiah(sewa.total_denda || 0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold border-t border-blue-200 pt-1 mt-1">
                    <span>Dikembalikan:</span>
                    <span
                      className={
                        sewa.deposit_dikembalikan
                          ? "text-green-600"
                          : "text-orange-600"
                      }
                    >
                      {sewa.deposit_dikembalikan
                        ? formatRupiah(sewa.deposit_kembali || 0) // ✅ Fallback
                        : "Menunggu admin"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Info Denda + Jaminan Fisik */}
            {sewa.jaminan_tipe !== "DEPOSIT_UANG" &&
              (sewa.total_denda || 0) > 0 && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50/50 p-3 rounded-lg border border-yellow-200">
                  <p className="text-sm font-medium text-yellow-800 mb-2">
                    Status Denda & Jaminan
                  </p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Denda:</span>
                      <span className="text-red-600 font-medium">
                        {formatRupiah(sewa.total_denda || 0)}
                      </span>
                    </div>
                    {(() => {
                      const dendaPayment = sewa.pembayaran?.find(
                        (p: any) => p.tipe === "DENDA",
                      );
                      return (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status Denda:</span>
                            <span
                              className={
                                !dendaPayment
                                  ? "text-orange-600"
                                  : dendaPayment.status === "PENDING"
                                    ? "text-yellow-600"
                                    : dendaPayment.status === "VERIFIED"
                                      ? "text-green-600"
                                      : "text-red-600"
                              }
                            >
                              {!dendaPayment
                                ? "Belum dibayar"
                                : dendaPayment.status === "PENDING"
                                  ? "Menunggu Verifikasi"
                                  : dendaPayment.status === "VERIFIED"
                                    ? "Lunas"
                                    : "Ditolak"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Status Jaminan:
                            </span>
                            <span
                              className={
                                sewa.jaminan_status === "DIKEMBALIKAN"
                                  ? "text-green-600"
                                  : "text-orange-600"
                              }
                            >
                              {sewa.jaminan_status === "DIKEMBALIKAN"
                                ? "Sudah dikembalikan"
                                : "Belum dikembalikan"}
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  {sewa.jaminan_tipe && (
                    <p className="text-xs text-gray-500 mt-2">
                      Jaminan: {sewa.jaminan_tipe} -{" "}
                      {sewa.jaminan_detail || "-"}
                    </p>
                  )}
                </div>
              )}
          </div>
        )}
      </div>

      {/* BODY CARD (LIST BARANG) */}
      <div className="p-5 space-y-5">
        {/* BARANG SATUAN */}
        {barangItems.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-gradient-to-b from-orange-500 to-pink-500 rounded-full" />
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Barang Satuan
              </p>
            </div>

            <div className="space-y-3">
              {barangItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 items-start group/item"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-orange-50 to-pink-50 flex-shrink-0">
                    <img
                      src={
                        item.barang?.gambar
                          ? `${IMAGE_BASE_URL}${item.barang.gambar}`
                          : "/no-image.png"
                      }
                      className="w-full h-full object-cover"
                      alt={item.barang?.nama}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm group-hover/item:text-orange-600 transition-colors">
                      {item.barang?.nama}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.jumlah} unit
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAKET */}
        {paket && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-gradient-to-b from-orange-500 to-pink-500 rounded-full" />
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Paket
              </p>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-4 border border-orange-100">
              <p className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Package className="w-4 h-4 text-orange-500" />
                {paket.nama}
              </p>
              <div className="space-y-1.5">
                {paket.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-600">{item.barang.nama}</span>
                    <span className="text-gray-500 text-xs">
                      {item.jumlah} unit
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER CARD (TOTAL & ACTION) */}
      <div className="px-5 py-4 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div>
          <p className="text-xs text-gray-500">Total Tagihan</p>
          <p className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            {formatRupiah(sewa.total_tagihan || sewa.total_sewa)}
          </p>
          {sewa.deposit > 0 && (
            <p className="text-xs text-orange-500">
              + Deposit {formatRupiah(sewa.deposit)} (akan dikembalikan)
            </p>
          )}
        </div>

        <button
          onClick={onDetail}
          className="group/btn flex items-center gap-2 px-5 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:border-orange-300 hover:shadow-md transition-all duration-200"
        >
          <span className="text-gray-700 group-hover/btn:text-orange-600 transition-colors">
            Lihat Detail
          </span>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover/btn:text-orange-500 group-hover/btn:translate-x-0.5 transition-all" />
        </button>
      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENT: SKELETON LOADING
// ==========================================
function HistorySkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
        </div>

        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse"
            >
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
              </div>
              <div className="flex gap-4 mt-4">
                <div className="w-14 h-14 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
