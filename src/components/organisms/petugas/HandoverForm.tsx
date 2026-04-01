"use client";

import { useState } from "react";
import { usePetugasPeminjaman } from "@/hooks/petugas/usePetugasPeminjaman";

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

  const [kondisi, setKondisi] = useState("");
  const [fotoSerahTerima, setFotoSerahTerima] = useState<File>();
  const [fotoJaminan, setFotoJaminan] = useState<File>();

  const handleSubmit = async () => {
    if (!fotoSerahTerima) {
      alert("Foto serah terima wajib diupload");
      return;
    }

    // Jika jaminan KTP/SIM wajib foto jaminan
    if (
      (peminjaman.jaminan_tipe === "KTP" ||
        peminjaman.jaminan_tipe === "SIM") &&
      !fotoJaminan
    ) {
      alert("Foto jaminan wajib diupload");
      return;
    }

    await handover(id, {
      kondisi_barang_keluar: kondisi,
      foto_serah_terima: fotoSerahTerima,
      foto_jaminan: fotoJaminan,
    });

    onSuccess();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Serah Terima Barang</h1>

      {/* Info Jaminan */}
      <div className="p-3 bg-gray-100 rounded">
        <p>
          <b>Tipe Jaminan:</b> {peminjaman.jaminan_tipe}
        </p>
      </div>

      {/* Jika KTP/SIM tampilkan upload foto jaminan */}
      {(peminjaman.jaminan_tipe === "KTP" ||
        peminjaman.jaminan_tipe === "SIM") && (
        <input
          type="file"
          onChange={(e) => setFotoJaminan(e.target.files?.[0])}
        />
      )}

      <input
        type="text"
        placeholder="Catatan kondisi barang keluar"
        value={kondisi}
        onChange={(e) => setKondisi(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        type="file"
        onChange={(e) => setFotoSerahTerima(e.target.files?.[0])}
      />

      <button
        onClick={handleSubmit}
        disabled={actionId === id}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Serahkan & Set DIPAKAI
      </button>
    </div>
  );
}
