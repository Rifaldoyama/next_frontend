"use client";

import { useParams, useRouter } from "next/navigation";
import { usePetugasPeminjaman } from "@/hooks/petugas/usePetugasPeminjaman";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Camera,
  AlertCircle,
  CheckCircle,
  Shield,
  X,
} from "lucide-react";
import Link from "next/link";

export default function KembalikanJaminanPage() {
  const { id } = useParams();
  const router = useRouter();
  const { fetchDetail, kembalikanJaminanFisik, actionId } =
    usePetugasPeminjaman();
  const [peminjaman, setPeminjaman] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [catatan, setCatatan] = useState("");
  const [fotoBukti, setFotoBukti] = useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoBukti(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearFile = () => {
    setFotoBukti(undefined);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!peminjaman) return;

    setIsSubmitting(true);
    try {
      await kembalikanJaminanFisik(id as string, catatan, fotoBukti);
      router.push("/petugas");
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (!peminjaman) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Data tidak ditemukan</p>
          <Link href="/petugas" className="text-yellow-600 mt-4 inline-block">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Validasi: hanya untuk jaminan non-deposit
  if (peminjaman.jaminan_tipe === "DEPOSIT_UANG") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm mx-auto">
          <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Tidak Dapat Diproses</h2>
          <p className="text-gray-500 mb-4">
            Jaminan {peminjaman.jaminan_tipe} dikembalikan oleh Admin via
            transfer bank, bukan oleh petugas.
          </p>
          <Link
            href="/petugas"
            className="text-yellow-600 font-medium inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Validasi: cek apakah sudah dikembalikan
  if (peminjaman.jaminan_status === "DIKEMBALIKAN") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm mx-auto">
          <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Jaminan Sudah Dikembalikan
          </h2>
          <p className="text-gray-500 mb-4">
            Jaminan {peminjaman.jaminan_tipe} sudah dikembalikan sebelumnya.
          </p>
          <Link
            href="/petugas"
            className="text-yellow-600 font-medium inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Validasi: status harus SELESAI
  if (peminjaman.status_pinjam !== "SELESAI") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm mx-auto">
          <div className="bg-yellow-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-yellow-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Belum Selesai</h2>
          <p className="text-gray-500 mb-4">
            Peminjaman harus selesai terlebih dahulu sebelum jaminan dapat
            dikembalikan.
          </p>
          <Link
            href="/petugas"
            className="text-yellow-600 font-medium inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/petugas"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Kembalikan Jaminan</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Info Jaminan */}
          <div className="bg-yellow-50 px-5 py-4 border-b border-yellow-100">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 rounded-full p-2">
                <Shield className="w-6 h-6 text-yellow-700" />
              </div>
              <div>
                <p className="text-sm text-yellow-700 font-medium">
                  Jaminan {peminjaman.jaminan_tipe}
                </p>
                <p className="text-xs text-yellow-600 mt-0.5">
                  {peminjaman.jaminan_detail || "Tidak ada detail tambahan"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Info Customer */}
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Dikembalikan kepada:</p>
              <p className="font-medium text-gray-800">
                {peminjaman.user?.detail?.nama_lengkap}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {peminjaman.alamat_acara || "Tidak ada alamat"}
              </p>
            </div>

            {/* Catatan */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Catatan (Opsional)
              </label>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Contoh: KTP atas nama Budi telah dikembalikan dalam kondisi baik"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Foto Bukti */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Foto Bukti Pengembalian (Opsional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-yellow-500 transition cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="jaminan-photo"
                />
                <label
                  htmlFor="jaminan-photo"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    {fotoBukti ? fotoBukti.name : "Klik untuk upload foto"}
                  </span>
                </label>
              </div>

              {/* Preview Image */}
              {previewUrl && (
                <div className="mt-3 relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                  <button
                    onClick={clearFile}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Warning Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <p className="text-xs text-yellow-700">
                Pastikan jaminan fisik sudah dikembalikan ke penyewa sebelum
                konfirmasi. Setelah dikonfirmasi, status jaminan akan berubah
                menjadi "Dikembalikan".
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={actionId === id || isSubmitting}
              className="w-full bg-yellow-600 text-white py-3 rounded-lg font-medium hover:bg-yellow-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {actionId === id || isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Konfirmasi Pengembalian Jaminan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
