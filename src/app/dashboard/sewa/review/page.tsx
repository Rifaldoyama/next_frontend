"use client";

import { useEffect } from "react";
import { useSewaDraft } from "@/hooks/useSewaDraft";
import { useSewa } from "@/hooks/useSewa";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function ReviewPage() {
  const draft = useSewaDraft();
  // Error 'success' hilang karena useSewa sudah diperbaiki
  const { submitPeminjaman, loading, error, success } = useSewa();

  // 1. Hapus 'isAuthenticated' dari destructuring store
  const { user, initialized, logout } = useAuthStore();
  const router = useRouter();

  // 2. Buat variable isAuthenticated secara manual
  const isAuthenticated = !!user;

  // Check if user is authenticated
  useEffect(() => {
    // Pastikan sudah initialized dulu baru cek user
    if (initialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [initialized, isAuthenticated, router]);

  const handleLogout = () => {
    logout(); // Panggil fungsi logout dari destructuring
    router.replace("/login");
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

      // 🔥 MODE PAKET
      if (draft.paketId) {
        payload.paketId = draft.paketId;
      }

      // 🔥 MODE SATUAN
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

  // Efek samping jika sukses (Opsional: pindahkan clear draft ke sini)
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        draft.clear();
        router.push("/riwayat"); // Redirect setelah sukses
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Tampilan Loading Auth
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-gray-600">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  // Jika sudah init tapi tidak ada user, return null (karena useEffect akan redirect)
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Review Peminjaman
          </h1>
          <p className="text-gray-600 mt-1">
            Periksa kembali detail peminjaman Anda
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Section */}
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
              <h3 className="text-md font-medium text-gray-900 mb-3">
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
              <h3 className="text-md font-medium text-gray-900 mb-3">
                Metode Pengambilan
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-full mr-3 ${draft.metode_ambil === "DIANTAR" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}
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
                      <p className="text-sm text-gray-600 mt-1">
                        {draft.alamat_acara}
                      </p>
                    )}
                  </div>
                </div>
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
                  Terpilih
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
                    <button
                      onClick={() => router.push("/katagori")}
                      className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      ← Kembali ke halaman sewa
                    </button>
                  </div>
                ) : (
                  draft.items.map((item) => (
                    <div
                      key={item.barangId}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {item.nama}
                        </h4>
                        <p className="text-sm text-gray-600">
                          ID: {item.barangId}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                          {/* Tombol Kurang */}
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

                          {/* Display Angka */}
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
                              // Tambahkan log untuk debug jika masih error
                              console.log(
                                "Stok Item:",
                                item.stok,
                                "Jumlah Sekarang:",
                                item.jumlah,
                              );

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
                            // Nonaktifkan tombol secara visual jika sudah penuh
                            disabled={
                              item.stok !== undefined &&
                              item.jumlah >= item.stok
                            }
                            className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                              item.stok !== undefined &&
                              item.jumlah >= item.stok
                                ? "bg-gray-100 text-gray-300 cursor-not-allowed" // Style saat mentok
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

                        {/* Tombol Hapus */}
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
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  onClick={() => router.push("/sewa")}
                  disabled={loading}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Kembali
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={loading || draft.items.length === 0}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                </button>
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
                Pastikan semua data sudah benar sebelum mengirim. Data akan
                diverifikasi oleh admin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
