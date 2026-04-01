"use client";

import Link from "next/link";
import { usePetugasPeminjaman } from "@/hooks/petugas/usePetugasPeminjaman";

export default function Page() {
  const { data, loading, actionId, startDelivery, printSurat } =
    usePetugasPeminjaman();

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Tugas Petugas</h1>

      {data.map((p) => (
        <div key={p.id} className="bg-white rounded-xl shadow p-4 space-y-3">
          <div>
            <p className="font-semibold text-lg">
              {p.user.detail.nama_lengkap}
            </p>
            <p className="text-sm text-gray-500">{p.alamat_acara}</p>
          </div>

          <div className="flex justify-between">
            <span>{p.status_pinjam}</span>
            <span className="text-xs bg-green-100 px-2 py-1 rounded">
              {p.status_bayar}
            </span>
          </div>

          <div className="space-y-2">
            {/* Detail */}
            <Link
              href={`/petugas/detail/${p.id}`}
              className="block w-full text-center bg-gray-200 py-2 rounded hover:bg-gray-300"
            >
              Lihat Detail
            </Link>

            {/* Mulai Antar */}
            {p.status_pinjam === "DISETUJUI" && (
              <button
                onClick={() => startDelivery(p.id)}
                disabled={actionId === p.id}
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                Mulai Antar
              </button>
            )}

            {/* Proses Return */}
            {p.status_pinjam === "DIPAKAI" && (
              <Link
                href={`/petugas/detail/${p.id}`}
                className="block w-full text-center bg-orange-500 text-white py-2 rounded"
              >
                Proses Return
              </Link>
            )}

            {/* Cetak Surat (jika sudah DIANTAR atau DIPAKAI) */}
            {(p.status_pinjam === "DIANTAR" ||
              p.status_pinjam === "DIPAKAI" ||
              p.status_pinjam === "SELESAI") && (
              <button
                onClick={() => printSurat(p.id)}
                className="w-full bg-green-600 text-white py-2 rounded"
              >
                Cetak Surat Serah Terima
              </button>
            )}

            {p.status_pinjam === "MENUNGGU_VERIFIKASI_ADMIN" && (
              <div className="text-yellow-600 text-center">
                Menunggu Verifikasi Admin
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
