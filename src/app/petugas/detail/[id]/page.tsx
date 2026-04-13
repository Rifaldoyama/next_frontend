"use client";

import { useParams } from "next/navigation";
import { usePetugasPeminjaman } from "@/hooks/petugas/usePetugasPeminjaman";
import { useEffect, useState, useCallback } from "react";
import {
  Package,
  ArrowLeft,
  Camera,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import { showError, showSuccess } from "@/lib/alert";

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

const kondisiOptions = [
  {
    value: KondisiBarang.BAGUS,
    label: "Bagus",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    persen: 0,
  },
  {
    value: KondisiBarang.RUSAK_RINGAN,
    label: "Rusak Ringan",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    persen: 20,
  },
  {
    value: KondisiBarang.RUSAK_SEDANG,
    label: "Rusak Sedang",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    persen: 50,
  },
  {
    value: KondisiBarang.RUSAK_BERAT,
    label: "Rusak Berat",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    persen: 90,
  },
  {
    value: KondisiBarang.HILANG,
    label: "Hilang",
    color: "text-red-700",
    bg: "bg-red-100",
    border: "border-red-300",
    persen: 100,
  },
];

export default function DetailPage() {
  const { id } = useParams();
  const { fetchDetail, returnBarang, handover, actionId } =
    usePetugasPeminjaman();
  const [peminjaman, setPeminjaman] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | undefined>();
  const [items, setItems] = useState<
    { barangId: string; kondisi_kembali: KondisiBarang }[]
  >([]);
  const [handoverKondisi, setHandoverKondisi] = useState<KondisiBarang | "">(
    "",
  );
  const [dendaPreview, setDendaPreview] = useState<Record<string, number>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchDetail(id as string);
        setPeminjaman(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id, fetchDetail]);

  // Reset states when peminjaman changes
  useEffect(() => {
    if (peminjaman) {
      setItems([]);
      setDendaPreview({});
      setFile(undefined);
    }
  }, [peminjaman]);

  // Fungsi hitung denda (sama dengan backend)
  const hitungDenda = useCallback((item: any, kondisi: KondisiBarang) => {
    switch (kondisi) {
      case KondisiBarang.RUSAK_RINGAN:
        return Math.floor(item.harga_satuan * item.jumlah * 0.2);
      case KondisiBarang.RUSAK_SEDANG:
        return Math.floor(item.harga_satuan * item.jumlah * 0.5);
      case KondisiBarang.RUSAK_BERAT:
        return Math.floor(item.harga_satuan * item.jumlah * 0.9);
      case KondisiBarang.HILANG:
        return Math.floor(item.harga_satuan * item.jumlah * 1);
      default:
        return 0;
    }
  }, []);

  const handleReturnChange = useCallback(
    (barangId: string, kondisi: KondisiBarang) => {
      // Update items
      setItems((prev) => {
        const filtered = prev.filter((i) => i.barangId !== barangId);
        return [...filtered, { barangId, kondisi_kembali: kondisi }];
      });

      // Update denda preview
      const item = peminjaman?.items.find((i: any) => i.barangId === barangId);
      if (item) {
        const denda = hitungDenda(item, kondisi);
        setDendaPreview((prev) => ({ ...prev, [barangId]: denda }));
      }
    },
    [peminjaman, hitungDenda],
  );

  const handleReturnSubmit = async () => {
    if (!peminjaman) return;

    if (items.length !== peminjaman.items.length) {
      alert("Semua barang wajib diisi kondisi pengembalian.");
      return;
    }

    if (!file) {
      alert("Foto pengembalian wajib diupload.");
      return;
    }

    const success = await returnBarang(id as string, items, file);
    if (success) {
      window.location.reload();
    }
  };

  const handleHandoverSubmit = async () => {
    if (!handoverKondisi) {
      showError("Pilih kondisi barang saat keluar");
      return;
    }

    if (!file) {
      showError("Foto serah terima wajib diupload");
      return;
    }

    const success = await handover(
      id as string,
      handoverKondisi as KondisiBarang,
      file,
    );
    if (success) {
      showSuccess("Serah terima berhasil");
      window.location.reload();
    }
  };

  const totalDenda = useCallback(() => {
    return Object.values(dendaPreview).reduce(
      (total, denda) => total + denda,
      0,
    );
  }, [dendaPreview]);

  const getSelectedKondisi = useCallback(
    (barangId: string) => {
      return items.find((i) => i.barangId === barangId)?.kondisi_kembali;
    },
    [items],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!peminjaman) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Data tidak ditemukan</p>
          <Link href="/petugas" className="text-blue-600 mt-4 inline-block">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Handover Form Component
  const HandoverForm = () => (
    <div className="min-h-screen bg-gray-50 p-4 text-black">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/petugas"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Serah Terima Barang</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <div className="border-b pb-3">
            <h2 className="font-semibold text-lg">
              {peminjaman.user.detail.nama_lengkap}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {peminjaman.alamat_acara}
            </p>
            <div className="flex gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(peminjaman.tanggal_mulai).toLocaleDateString()}
              </span>
              <span>→</span>
              <span>
                {new Date(peminjaman.tanggal_selesai).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Kondisi Barang Saat Keluar
            </label>
            <select
              value={handoverKondisi}
              onChange={(e) =>
                setHandoverKondisi(e.target.value as KondisiBarang)
              }
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Pilih kondisi</option>
              {kondisiOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Foto Serah Terima
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0])}
                className="hidden"
                id="handover-photo"
              />
              <label
                htmlFor="handover-photo"
                className="cursor-pointer flex flex-col items-center"
              >
                <Camera className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  {file ? file.name : "Klik untuk upload foto"}
                </span>
              </label>
            </div>
          </div>

          <button
            onClick={handleHandoverSubmit}
            disabled={actionId === id}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {actionId === id ? "Memproses..." : "Konfirmasi Serah Terima"}
          </button>
        </div>
      </div>
    </div>
  );

  // Return Form Component
  const ReturnForm = () => {
    const allItemsSelected = items.length === peminjaman.items.length;
    const hasFile = !!file;

    return (
      <div className="min-h-screen bg-gray-50 p-4 pb-24 text-black">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/petugas"
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">Pengembalian Barang</h1>
          </div>

          <div className="space-y-4">
            {peminjaman.items.map((item: any) => {
              const selectedKondisi = getSelectedKondisi(item.barangId);
              const selectedOption = kondisiOptions.find(
                (opt) => opt.value === selectedKondisi,
              );
              const currentDenda = dendaPreview[item.barangId] || 0;

              return (
                <div
                  key={item.barangId}
                  className="bg-white rounded-xl shadow-sm p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.barang.nama}
                      </p>
                      <p className="text-sm text-gray-500">
                        Jumlah: {item.jumlah} x{" "}
                        {formatRupiah(item.harga_satuan)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Total Harga:{" "}
                        {formatRupiah(item.harga_satuan * item.jumlah)}
                      </p>
                    </div>
                    <Package className="w-5 h-5 text-gray-400" />
                  </div>

                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Kondisi Pengembalian
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {kondisiOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() =>
                          handleReturnChange(item.barangId, opt.value)
                        }
                        className={`p-2 rounded-lg text-sm font-medium transition-all ${
                          selectedKondisi === opt.value
                            ? `${opt.bg} ${opt.color} border-2 ${opt.border}`
                            : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {/* Tampilkan pesan jika kondisi bagus */}
                  {selectedKondisi === KondisiBarang.BAGUS && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700">
                        ✓ Tidak ada denda, barang dalam kondisi baik
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Total Denda */}
            {totalDenda() > 0 && (
              <div className="bg-red-100 border border-red-400 rounded-lg p-4">
                <p className="font-semibold text-red-800">
                  Total Denda: {formatRupiah(totalDenda())}
                </p>
                <p className="text-sm text-red-700 mt-1">
                  ⚠️ Denda akan ditambahkan ke tagihan customer
                </p>
              </div>
            )}

            {totalDenda() === 0 && allItemsSelected && items.length > 0 && (
              <div className="bg-green-100 border border-green-400 rounded-lg p-4">
                <p className="font-semibold text-green-800">
                  ✓ Tidak ada denda
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Semua barang dalam kondisi baik
                </p>
              </div>
            )}

            {/* Progress indicator */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-sm text-gray-600 mb-2">
                Progress: {items.length} dari {peminjaman.items.length} barang
                sudah dipilih kondisinya
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(items.length / peminjaman.items.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Foto Upload */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Foto Pengembalian (Wajib)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0])}
                  className="hidden"
                  id="return-photo"
                  required
                />
                <label
                  htmlFor="return-photo"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    {file ? file.name : "Klik untuk upload foto"}
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleReturnSubmit}
              disabled={actionId === id || !allItemsSelected || !hasFile}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionId === id
                ? "Memproses..."
                : !hasFile
                  ? "📸 Upload foto pengembalian terlebih dahulu"
                  : !allItemsSelected
                    ? `📋 Pilih kondisi semua barang (${items.length}/${peminjaman.items.length})`
                    : "✅ Submit Pengembalian"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Status Display - DIPROSES (sedang diantar)
  if (peminjaman.status_pinjam === StatusPeminjaman.DIPROSES) {
    return <HandoverForm />;
  }

  // Status Display - DIPAKAI (sedang digunakan)
  if (peminjaman.status_pinjam === StatusPeminjaman.DIPAKAI) {
    return <ReturnForm />;
  }

  // Status Display - SIAP_DIPROSES (menunggu diantar)
  if (peminjaman.status_pinjam === StatusPeminjaman.SIAP_DIPROSES) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm mx-auto">
          <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Truck className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Siap Diproses</h2>
          <p className="text-gray-500 mb-4">
            Peminjaman ini sudah disetujui dan siap untuk diantar
          </p>
          <Link
            href="/petugas"
            className="text-blue-600 font-medium inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Status Display - MENUNGGU_PERSETUJUAN
  if (peminjaman.status_pinjam === StatusPeminjaman.MENUNGGU_PERSETUJUAN) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm mx-auto">
          <div className="bg-yellow-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Menunggu Persetujuan</h2>
          <p className="text-gray-500 mb-4">
            Peminjaman ini sedang menunggu persetujuan dari admin
          </p>
          <Link
            href="/petugas"
            className="text-blue-600 font-medium inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Status Display - SELESAI
  if (peminjaman.status_pinjam === StatusPeminjaman.SELESAI) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm mx-auto">
          <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Peminjaman Selesai</h2>
          <p className="text-gray-500 mb-4">
            Peminjaman ini sudah selesai dan tidak dapat diproses lebih lanjut
          </p>
          <Link
            href="/petugas"
            className="text-blue-600 font-medium inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Default - invalid status
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-sm mx-auto">
        <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-gray-500" />
        </div>
        <p className="text-gray-500 mb-4">Status tidak dapat diproses</p>
        <Link
          href="/petugas"
          className="text-blue-600 font-medium inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
