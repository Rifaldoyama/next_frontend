"use client";

import { useParams } from "next/navigation";
import { usePetugasPeminjaman } from "@/hooks/petugas/usePetugasPeminjaman";
import HandoverForm from "@/components/organisms/petugas/HandoverForm";
import { useEffect, useState } from "react";

const kondisiOptions = [
  "BAGUS",
  "RUSAK_RINGAN",
  "RUSAK_SEDANG",
  "RUSAK_BERAT",
  "HILANG",
];

export default function DetailPage() {
  const { id } = useParams();
  const { fetchDetail, returnBarang, actionId } = usePetugasPeminjaman();

  const [peminjaman, setPeminjaman] = useState<any>(null);
  const [file, setFile] = useState<File | undefined>();
  const [items, setItems] = useState<
    { barangId: string; kondisi_kembali: string }[]
  >([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetchDetail(id as string);
      setPeminjaman(res);
    };
    if (id) load();
  }, [id]);

  if (!peminjaman) return <div>Loading...</div>;

  // 🔵 Tahap Handover
  if (peminjaman.status_pinjam === "DIANTAR") {
    return (
      <HandoverForm
        id={id as string}
        peminjaman={peminjaman} // ✅ TAMBAHKAN INI
        onSuccess={() => window.location.reload()}
      />
    );
  }

  // 🟢 Tahap Return
  if (peminjaman.status_pinjam === "DIPAKAI") {
    const handleChange = (barangId: string, kondisi: string) => {
      setItems((prev) => {
        const filtered = prev.filter((i) => i.barangId !== barangId);
        return [...filtered, { barangId, kondisi_kembali: kondisi }];
      });
    };

    const handleSubmit = async () => {
      if (items.length !== peminjaman.items.length) {
        alert("Semua barang wajib diisi kondisi.");
        return;
      }

      await returnBarang(id as string, items, file);
      window.location.reload();
    };

    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Pengembalian Barang</h1>

        {peminjaman.items.map((item: any) => (
          <div key={item.barangId} className="border p-3 rounded">
            <p className="font-semibold">
              {item.barang.nama} ({item.jumlah})
            </p>

            <select
              onChange={(e) => handleChange(item.barangId, e.target.value)}
              className="w-full border p-2 mt-2 rounded"
            >
              <option value="">Pilih kondisi</option>
              {kondisiOptions.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
        ))}

        <input type="file" onChange={(e) => setFile(e.target.files?.[0])} />

        <button
          onClick={handleSubmit}
          disabled={actionId === id}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Submit Return
        </button>
      </div>
    );
  }

  // 🟡 Menunggu Admin
  if (peminjaman.status_pinjam === "MENUNGGU_VERIFIKASI_ADMIN") {
    return <div>Menunggu verifikasi admin.</div>;
  }

  return <div>Status tidak bisa diproses.</div>;
}
