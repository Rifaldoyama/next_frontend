"use client";

import { useState } from "react";
import { useSewaDraft } from "@/hooks/useSewaDraft";
import { useRouter } from "next/navigation";

interface PaketItem {
  barangId: string;
  jumlah: number;

  barang: {
    nama: string;
    gambar: string | null;
    harga_sewa?: number;
    stok_tersedia: number;
  };
}

interface PaketSewaFormProps {
  paket: {
    id: string;
    nama: string;
    deskripsi?: string;
    items: PaketItem[];
  };
  userAlamat?: string;
  onClose: () => void;
  onDone: () => void;
}

type MetodeAmbil = "AMBIL_SENDIRI" | "DIANTAR";

export function PaketSewaForm({
  paket,
  userAlamat,
  onClose,
  onDone,
}: PaketSewaFormProps) {
  const { setMeta, items } = useSewaDraft();
  const router = useRouter();

  const [mulai, setMulai] = useState("");
  const [selesai, setSelesai] = useState("");
  const [metode, setMetode] = useState<MetodeAmbil>("AMBIL_SENDIRI");
  const [jaminanTipe, setJaminanTipe] = useState<
    "DEPOSIT_UANG" | "KTP" | "SIM"
  >("DEPOSIT_UANG");
  const [namaRekening, setNamaRekening] = useState("");
  const [bankPengembalian, setBankPengembalian] = useState("");
  const [nomorRekening, setNomorRekening] = useState("");

  const [jaminanDetail, setJaminanDetail] = useState("");
  const [alamat, setAlamat] = useState(userAlamat || "");
  const [pakaiAlamatUser, setPakaiAlamatUser] = useState(true);

  const handleSubmit = () => {
    // ===== VALIDASI =====
    if (!mulai || !selesai) {
      alert("Tanggal mulai dan selesai wajib diisi");
      return;
    }

    if (metode === "DIANTAR" && !alamat) {
      alert("Alamat wajib diisi jika pilih diantar");
      return;
    }

    if (jaminanTipe === "DEPOSIT_UANG") {
      if (!namaRekening || !bankPengembalian || !nomorRekening) {
        alert("Data rekening pengembalian wajib diisi untuk deposit uang");
        return;
      }
    }

    if ((jaminanTipe === "KTP" || jaminanTipe === "SIM") && !jaminanDetail) {
      alert("Nomor identitas wajib diisi");
      return;
    }

    // Cek apakah draft sudah ada item (prevent campur mode)
    if (items.length > 0) {
      alert(
        "Keranjang berisi item satuan. Kosongkan dulu sebelum memilih paket.",
      );
      return;
    }

    // ===== SET META SEKALI =====
    setMeta({
      paketId: paket.id,
      tanggal_mulai: mulai,
      tanggal_selesai: selesai,
      metode_ambil: metode,
      alamat_acara: metode === "DIANTAR" ? alamat : undefined,
      jaminan_tipe: jaminanTipe,
      jaminan_detail:
        jaminanTipe === "DEPOSIT_UANG" ? undefined : jaminanDetail,
      nama_rekening_pengembalian:
        jaminanTipe === "DEPOSIT_UANG" ? namaRekening : undefined,
      bank_pengembalian:
        jaminanTipe === "DEPOSIT_UANG" ? bankPengembalian : undefined,
      nomor_rekening_pengembalian:
        jaminanTipe === "DEPOSIT_UANG" ? nomorRekening : undefined,
    });

    // ===== MASUKKAN SEMUA ITEM PAKET =====
    // paket.items.forEach((item) => {
    //   addItem({
    //     barangId: item.barangId,
    //     nama: item.barang.nama,
    //     stok: item.barang.stok,
    //     jumlah: item.jumlah,
    //     source: "PAKET",
    //   });
    // });

    onDone();
    router.push("/dashboard/sewa/review");
  };

  return (
    <div className="space-y-5 text-black p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Sewa Paket {paket.nama}</h2>
      </div>

      {paket.deskripsi && (
        <p className="text-sm text-gray-600">{paket.deskripsi}</p>
      )}

      {/* ===== DETAIL ITEM PAKET ===== */}
      <div className="bg-gray-50 p-3 rounded border">
        <h3 className="text-sm font-semibold mb-2">Isi Paket:</h3>
        <ul className="text-sm space-y-1">
          {paket.items.map((item) => (
            <li key={item.barangId}>
              • {item.barang.nama} ({item.jumlah} unit)
            </li>
          ))}
        </ul>
      </div>

      {/* ===== TANGGAL ===== */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-600">Tanggal Mulai</label>
          <input
            type="date"
            value={mulai}
            onChange={(e) => setMulai(e.target.value)}
            className="w-full text-sm p-2 border rounded"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600">Tanggal Selesai</label>
          <input
            type="date"
            value={selesai}
            onChange={(e) => setSelesai(e.target.value)}
            className="w-full text-sm p-2 border rounded"
          />
        </div>
      </div>

      {/* ===== METODE ===== */}
      <div>
        <label className="text-xs text-gray-600">Metode Pengambilan</label>
        <select
          value={metode}
          onChange={(e) => setMetode(e.target.value as MetodeAmbil)}
          className="w-full text-sm p-2 border rounded"
        >
          <option value="AMBIL_SENDIRI">Ambil Sendiri</option>
          <option value="DIANTAR">Diantar</option>
        </select>
      </div>
      {/* ===== JAMINAN ===== */}
      <div className="space-y-2">
        <label className="text-xs text-gray-600">Jenis Jaminan</label>
        <select
          value={jaminanTipe}
          onChange={(e) =>
            setJaminanTipe(e.target.value as "DEPOSIT_UANG" | "KTP" | "SIM")
          }
          className="w-full text-sm p-2 border rounded"
        >
          <option value="DEPOSIT_UANG">Deposit Uang</option>
          <option value="KTP">KTP</option>
          <option value="SIM">SIM</option>
        </select>

        {/* ===== JIKA KTP / SIM ===== */}
        {(jaminanTipe === "KTP" || jaminanTipe === "SIM") && (
          <input
            type="text"
            placeholder="Masukkan nomor identitas"
            value={jaminanDetail}
            onChange={(e) => setJaminanDetail(e.target.value)}
            className="w-full text-sm p-2 border rounded"
          />
        )}

        {/* ===== JIKA DEPOSIT ===== */}
        {jaminanTipe === "DEPOSIT_UANG" && (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Nama Pemilik Rekening"
              value={namaRekening}
              onChange={(e) => setNamaRekening(e.target.value)}
              className="w-full text-sm p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Bank"
              value={bankPengembalian}
              onChange={(e) => setBankPengembalian(e.target.value)}
              className="w-full text-sm p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Nomor Rekening"
              value={nomorRekening}
              onChange={(e) => setNomorRekening(e.target.value)}
              className="w-full text-sm p-2 border rounded"
            />
          </div>
        )}
      </div>

      {/* ===== ALAMAT ===== */}
      {metode === "DIANTAR" && (
        <div className="space-y-2">
          {userAlamat && (
            <label className="flex items-center text-sm gap-2">
              <input
                type="checkbox"
                checked={pakaiAlamatUser}
                onChange={() => {
                  setPakaiAlamatUser(!pakaiAlamatUser);
                  setAlamat(pakaiAlamatUser ? "" : userAlamat || "");
                }}
              />
              Gunakan alamat saya
            </label>
          )}

          <input
            type="text"
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            placeholder="Masukkan alamat lengkap"
            className="w-full text-sm p-2 border rounded"
            disabled={pakaiAlamatUser}
          />
        </div>
      )}

      {/* ===== ACTION BUTTON ===== */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Tambah Paket ke Keranjang
        </button>

        <button
          onClick={onClose}
          className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
