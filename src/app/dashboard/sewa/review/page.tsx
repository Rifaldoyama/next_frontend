"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSewaDraft } from "@/hooks/useSewaDraft";
import { useSewa } from "@/hooks/useSewa";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/atoms/Buttons";
import {
  Package,
  Boxes,
  Truck,
  Calendar,
  MapPin,
  Shield,
  Trash2,
} from "lucide-react";

export default function ReviewPage() {
  const draft = useSewaDraft();
  const { submitPeminjaman, loading, error, success } = useSewa();
  const { user, initialized, logout } = useAuthStore();
  const router = useRouter();

  const isAuthenticated = !!user;
  const isPaket = !!draft.paketId; // ✅ Cek apakah ini paket

  // Check if user is authenticated
  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [initialized, isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  // ✅ Fungsi untuk menghapus semua item (khusus paket)
  const handleClearAllPaket = () => {
    if (
      confirm(
        "Apakah Anda yakin ingin membatalkan paket ini? Semua data akan dihapus.",
      )
    ) {
      draft.clear();
      router.back();
    }
  };

  const handleSubmit = async () => {
    if (!draft.tanggal_mulai || !draft.tanggal_selesai || !draft.metode_ambil) {
      alert("Data peminjaman tidak lengkap");
      return;
    }

    try {
      const payload: any = {
        tanggal_mulai: draft.tanggal_mulai,
        tanggal_selesai: draft.tanggal_selesai,
        metode_ambil: draft.metode_ambil,
        alamat_acara: draft.alamat_acara || "",
        jaminan_tipe: draft.jaminan_tipe!,
        jaminan_detail: draft.jaminan_detail,
        nama_rekening_pengembalian:
          draft.jaminan_tipe === "DEPOSIT_UANG"
            ? draft.nama_rekening_pengembalian
            : undefined,
        bank_pengembalian:
          draft.jaminan_tipe === "DEPOSIT_UANG"
            ? draft.bank_pengembalian
            : undefined,
        nomor_rekening_pengembalian:
          draft.jaminan_tipe === "DEPOSIT_UANG"
            ? draft.nomor_rekening_pengembalian
            : undefined,
      };

      // Mode Paket
      if (draft.paketId) {
        payload.paketId = draft.paketId;
      }
      // Mode Satuan
      else {
        payload.items = draft.items.map((i) => ({
          barangId: i.barangId,
          jumlah: i.jumlah,
        }));
      }

      await submitPeminjaman(payload);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  // Redirect after success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        draft.clear();
        router.push("/riwayat");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, draft, router]);

  const handleGoBack = () => {
    // Kembali ke halaman sebelumnya
    if (draft.paketId) {
      router.back();
    } else if (draft.items.length > 0 && draft.items[0]?.kategoriId) {
      router.push(`/kategori/${draft.items[0].kategoriId}`);
    } else {
      router.push("/sewa");
    }
  };

  // Loading Auth
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-gray-600">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Page Title */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Review Peminjaman
              </h1>
              {isPaket ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                  <Boxes className="w-3 h-3" />
                  PAKET
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                  <Package className="w-3 h-3" />
                  SATUAN
                </span>
              )}
            </div>

            {/* ✅ Tombol Hapus Semua (khusus paket) */}
            {isPaket && draft.items.length > 0 && (
              <button
                onClick={handleClearAllPaket}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Hapus Paket
              </button>
            )}
          </div>
          <p className="text-gray-600">
            Periksa kembali detail peminjaman Anda
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
            <h2 className="text-lg font-semibold text-gray-900">
              Detail Penyewaan
            </h2>
          </div>

          <div className="p-6">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-500 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-green-700 text-sm">
                    Peminjaman berhasil! Anda akan dialihkan.
                  </p>
                </div>
              </div>
            )}

            {/* Rental Period Info */}
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                Periode Sewa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Tanggal Mulai</p>
                  <p className="font-medium text-gray-900">
                    {draft.tanggal_mulai
                      ? new Date(draft.tanggal_mulai).toLocaleDateString(
                          "id-ID",
                        )
                      : "-"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Tanggal Selesai</p>
                  <p className="font-medium text-gray-900">
                    {draft.tanggal_selesai
                      ? new Date(draft.tanggal_selesai).toLocaleDateString(
                          "id-ID",
                        )
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Pickup Method */}
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-green-500" />
                Metode Pengambilan
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-full mr-3 ${
                      draft.metode_ambil === "DIANTAR"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {draft.metode_ambil === "AMBIL_SENDIRI" ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {draft.metode_ambil === "AMBIL_SENDIRI"
                        ? "Diambil Sendiri"
                        : "Diantar ke Tempat"}
                    </p>
                    {draft.alamat_acara && draft.metode_ambil === "DIANTAR" && (
                      <div className="flex items-start gap-2 mt-2">
                        <MapPin className="w-3 h-3 text-gray-400 mt-0.5" />
                        <p className="text-sm text-gray-600">
                          {draft.alamat_acara}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Jaminan Info */}
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-500" />
                Jaminan
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tipe Jaminan</p>
                    <p className="font-medium text-gray-900">
                      {draft.jaminan_tipe === "DEPOSIT_UANG"
                        ? "💰 Deposit Uang"
                        : draft.jaminan_tipe === "KTP"
                          ? "🪪 KTP"
                          : "🚗 SIM"}
                    </p>
                  </div>
                  {draft.jaminan_tipe !== "DEPOSIT_UANG" &&
                    draft.jaminan_detail && (
                      <div>
                        <p className="text-sm text-gray-600">Nomor</p>
                        <p className="font-medium text-gray-900">
                          {draft.jaminan_detail}
                        </p>
                      </div>
                    )}
                </div>
                {draft.jaminan_tipe === "DEPOSIT_UANG" && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">
                      Rekening Pengembalian Deposit
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Nama:</span>{" "}
                        <span className="font-medium">
                          {draft.nama_rekening_pengembalian || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Bank:</span>{" "}
                        <span className="font-medium">
                          {draft.bank_pengembalian || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">No. Rekening:</span>{" "}
                        <span className="font-medium">
                          {draft.nomor_rekening_pengembalian || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Items List */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium text-gray-900">
                  Barang yang Disewa
                </h3>
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {draft.items.reduce((acc, curr) => acc + curr.jumlah, 0)} Unit
                </span>
              </div>

              <div className="space-y-3">
                {draft.items.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <svg
                      className="w-12 h-12 text-gray-400 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="text-gray-500">
                      Tidak ada barang yang dipilih
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleGoBack}
                      className="mt-2"
                    >
                      ← Kembali ke halaman sewa
                    </Button>
                  </div>
                ) : (
                  draft.items.map((item) => (
                    <div
                      key={item.barangId}
                      className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                        isPaket
                          ? "bg-purple-50 border border-purple-100"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">
                            {item.nama}
                          </h4>
                          {isPaket && (
                            <span className="text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">
                              Paket
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          ID: {item.barangId.slice(0, 8)}...
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {isPaket ? (
                          <div className="flex items-center bg-white border border-purple-200 rounded-lg px-4 py-2">
                            <span className="text-sm font-bold text-purple-700">
                              {item.jumlah} unit
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                              <button
                                onClick={() => {
                                  if (item.jumlah > 1) {
                                    draft.addItem({ ...item, jumlah: -1 });
                                  } else {
                                    if (confirm(`Hapus ${item.nama}?`)) {
                                      draft.removeItem(item.barangId);
                                    }
                                  }
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M20 12H4"
                                  />
                                </svg>
                              </button>

                              <div className="w-10 text-center">
                                <span className="text-sm font-bold text-blue-600 block leading-tight">
                                  {item.jumlah}
                                </span>
                                <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">
                                  Unit
                                </span>
                              </div>

                              <button
                                onClick={() => {
                                  if (
                                    item.stok !== undefined &&
                                    item.jumlah >= item.stok
                                  ) {
                                    alert(
                                      `Stok maksimal ${item.nama} adalah ${item.stok}`,
                                    );
                                    return;
                                  }
                                  draft.addItem({ ...item, jumlah: 1 });
                                }}
                                disabled={
                                  item.stok !== undefined &&
                                  item.jumlah >= item.stok
                                }
                                className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                                  item.stok !== undefined &&
                                  item.jumlah >= item.stok
                                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                                    : "hover:bg-blue-50 text-gray-500 hover:text-blue-600"
                                }`}
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                              </button>
                            </div>

                            <button
                              onClick={() => draft.removeItem(item.barangId)}
                              className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleGoBack}
                  disabled={loading}
                  className="flex-1"
                >
                  Kembali
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={loading || draft.items.length === 0}
                  className="flex-1 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    "Konfirmasi & Kirim"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm text-blue-800 font-medium">Perhatian</p>
              <p className="text-sm text-blue-700 mt-1">
                {isPaket
                  ? "Paket sudah termasuk semua barang di dalamnya. Jumlah tidak dapat diubah."
                  : "Pastikan semua data sudah benar sebelum mengirim. Data akan diverifikasi oleh admin."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
