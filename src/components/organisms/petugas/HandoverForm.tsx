// components/organisms/petugas/HandoverForm.tsx
"use client";

import { useState } from "react";
import { usePetugasPeminjaman } from "@/hooks/petugas/usePetugasPeminjaman";
import { Camera, CheckCircle, AlertCircle, X } from "lucide-react";

enum KondisiBarang {
  BAGUS = "BAGUS",
  RUSAK_RINGAN = "RUSAK_RINGAN",
  RUSAK_SEDANG = "RUSAK_SEDANG",
  RUSAK_BERAT = "RUSAK_BERAT",
  HILANG = "HILANG",
}

const kondisiOptions = [
  { value: KondisiBarang.BAGUS, label: "Bagus", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  { value: KondisiBarang.RUSAK_RINGAN, label: "Rusak Ringan", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
  { value: KondisiBarang.RUSAK_SEDANG, label: "Rusak Sedang", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  { value: KondisiBarang.RUSAK_BERAT, label: "Rusak Berat", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  { value: KondisiBarang.HILANG, label: "Hilang", color: "text-red-700", bg: "bg-red-100", border: "border-red-300" },
];

export default function HandoverForm({
  id,
  peminjaman,
  onSuccess,
}: {
  id: string;
  peminjaman: any;
  onSuccess: () => void;
}) {
  const { handover, actionId } = usePetugasPeminjaman();
  const [kondisi, setKondisi] = useState<KondisiBarang | "">("");
  const [fotoSerahTerima, setFotoSerahTerima] = useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoSerahTerima(file);
      // Create preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearFile = () => {
    setFotoSerahTerima(undefined);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!kondisi) {
      alert("Pilih kondisi barang saat keluar");
      return;
    }

    if (!fotoSerahTerima) {
      alert("Foto serah terima wajib diupload");
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await handover(id, kondisi as KondisiBarang, fotoSerahTerima);
      if (success) {
        onSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-5 py-4">
            <h1 className="text-white text-xl font-bold">Serah Terima Barang</h1>
            <p className="text-blue-100 text-sm mt-1">Konfirmasi penyerahan barang kepada penyewa</p>
          </div>

          <div className="p-5 space-y-5">
            {/* Info Peminjaman */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">{peminjaman.user?.detail?.nama_lengkap}</p>
                  <p className="text-sm text-gray-500 mt-1">{peminjaman.alamat_acara}</p>
                </div>
                {peminjaman.jaminan_tipe && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    Jaminan: {peminjaman.jaminan_tipe}
                  </span>
                )}
              </div>
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>📅 {new Date(peminjaman.tanggal_mulai).toLocaleDateString()} - {new Date(peminjaman.tanggal_selesai).toLocaleDateString()}</p>
                <p>📦 Total barang: {peminjaman.items?.length || 0} item</p>
              </div>
            </div>

            {/* Kondisi Barang */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Kondisi Barang Saat Keluar <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {kondisiOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setKondisi(opt.value)}
                    className={`p-3 rounded-lg text-sm font-medium transition ${
                      kondisi === opt.value
                        ? `${opt.bg} ${opt.color} border-2 ${opt.border}`
                        : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Foto Serah Terima */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Foto Serah Terima <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="handover-photo"
                />
                <label htmlFor="handover-photo" className="cursor-pointer flex flex-col items-center">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    {fotoSerahTerima ? fotoSerahTerima.name : "Klik untuk upload foto"}
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

            {/* Daftar Barang */}
            {peminjaman.items && peminjaman.items.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Daftar Barang
                </label>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                  {peminjaman.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{item.barang?.nama || item.nama}</span>
                      <span className="font-medium text-gray-800">x{item.jumlah}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warning Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <p className="text-xs text-yellow-700">
                Pastikan semua barang dalam kondisi baik dan foto serah terima jelas. 
                Setelah diserahkan, status akan berubah menjadi "Sedang Digunakan".
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={actionId === id || isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {(actionId === id || isSubmitting) ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Konfirmasi Serah Terima</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}