// src/components/organisms/SewaForm.tsx
"use client";

import { useState } from "react";
import { useSewaDraft } from "@/hooks/useSewaDraft";

interface SewaFormProps {
  barang: {
    id: string;
    nama: string;
    stok_tersedia: number;
    harga_sewa: number;
  };
  onClose: () => void;
  onDone: () => void;
}

type MetodeAmbil = "AMBIL_SENDIRI" | "DIANTAR";

export function SewaForm({ barang, onClose, onDone }: SewaFormProps) {
  const {
    items,
    tanggal_mulai,
    tanggal_selesai,
    metode_ambil,
    alamat_acara,
    setMeta,
    addItem,
  } = useSewaDraft();

  // Cari apakah barang ini sudah ada di keranjang untuk menghitung sisa stok yang bisa ditambah
  const existingItem = items.find((i) => i.barangId === barang.id);
  const jumlahDiKeranjang = existingItem ? existingItem.jumlah : 0;
  const sisaStokTersedia = barang.stok_tersedia - jumlahDiKeranjang;

  const [jumlah, setJumlah] = useState<number>(1);
  const [mulai, setMulai] = useState<string>(tanggal_mulai || "");
  const [selesai, setSelesai] = useState<string>(tanggal_selesai || "");
  const [metode, setMetode] = useState<MetodeAmbil>(
    metode_ambil || "AMBIL_SENDIRI",
  );
  const [alamat, setAlamat] = useState<string>(alamat_acara || "");
  const [namaRek, setNamaRek] = useState("");
  const [bankRek, setBankRek] = useState("");
  const [nomorRek, setNomorRek] = useState("");

  const [jaminanTipe, setJaminanTipe] = useState<
    "DEPOSIT_UANG" | "KTP" | "SIM"
  >("DEPOSIT_UANG");

  const [jaminanDetail, setJaminanDetail] = useState("");

  const isFirstItem = items.length === 0;

  const handleSubmit = () => {
    // 1. Cek Tanggal
    if (!mulai || !selesai) {
      alert("Mohon isi tanggal sewa");
      return;
    }

    // 2. Cek Stok (Validasi Final)
    if (jumlah > sisaStokTersedia) {
      alert(
        `Gagal menambah barang. Stok tersedia: ${barang.stok_tersedia}, Anda sudah memiliki ${jumlahDiKeranjang} di keranjang.`,
      );
      return;
    }

    if (jumlah <= 0) {
      alert("Jumlah harus lebih dari 0");
      return;
    }

    if (jaminanTipe !== "DEPOSIT_UANG" && !jaminanDetail) {
      alert("Detail jaminan wajib diisi");
      return;
    }
    if (jaminanTipe === "DEPOSIT_UANG") {
      if (!namaRek || !bankRek || !nomorRek) {
        alert("Data rekening pengembalian wajib diisi");
        return;
      }
    }
    console.log("SUBMIT CLICKED");
    console.log("ITEM BEFORE ADD:", barang);

    // Simpan Metadata
    setMeta({
      tanggal_mulai: mulai,
      tanggal_selesai: selesai,
      metode_ambil: metode,
      alamat_acara: alamat,
      jaminan_tipe: jaminanTipe,
      jaminan_detail:
        jaminanTipe !== "DEPOSIT_UANG" ? jaminanDetail : undefined,
      nama_rekening_pengembalian:
        jaminanTipe === "DEPOSIT_UANG" ? namaRek : undefined,
      bank_pengembalian: jaminanTipe === "DEPOSIT_UANG" ? bankRek : undefined,
      nomor_rekening_pengembalian:
        jaminanTipe === "DEPOSIT_UANG" ? nomorRek : undefined,
    });

    // Masukkan ke Keranjang
    addItem({
      barangId: barang.id,
      nama: barang.nama,
      stok: barang.stok_tersedia,
      jumlah,
      source: "ITEM",
    });

    requestAnimationFrame(() => onDone());
  };

  return (
    <div className="space-y-5 p-4 sm:p-2 text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-pink-500 rounded-full" />
          <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Sewa {barang.nama}
          </h2>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-gradient-to-r from-orange-50 to-pink-50 rounded-full text-orange-700 border border-orange-100 w-fit">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Total Stok: {barang.stok_tersedia}
        </span>
      </div>

      <div className="space-y-4">
        {/* Detail Acara Card */}
        <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-4 border border-orange-100 shadow-sm">
          <h3 className="text-sm font-bold text-orange-800 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            Detail Acara
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Mulai
              </label>
              <input
                type="date"
                value={mulai}
                onChange={(e) => setMulai(e.target.value)}
                className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Selesai
              </label>
              <input
                type="date"
                value={selesai}
                onChange={(e) => setSelesai(e.target.value)}
                className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Jaminan
            </label>
            <select
              value={jaminanTipe}
              onChange={(e) => setJaminanTipe(e.target.value as any)}
              className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              <option value="DEPOSIT_UANG">Deposit Uang</option>
              <option value="KTP">KTP</option>
              <option value="SIM">SIM</option>
            </select>
          </div>

          {jaminanTipe !== "DEPOSIT_UANG" && (
            <input
              type="text"
              placeholder="Masukkan nomor identitas..."
              value={jaminanDetail}
              onChange={(e) => setJaminanDetail(e.target.value)}
              className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white mb-3"
            />
          )}

          {jaminanTipe === "DEPOSIT_UANG" && (
            <div className="space-y-2 mb-3">
              <input
                type="text"
                placeholder="Nama Pemilik Rekening"
                value={namaRek}
                onChange={(e) => setNamaRek(e.target.value)}
                className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              />
              <input
                type="text"
                placeholder="Nama Bank"
                value={bankRek}
                onChange={(e) => setBankRek(e.target.value)}
                className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              />
              <input
                type="text"
                placeholder="Nomor Rekening"
                value={nomorRek}
                onChange={(e) => setNomorRek(e.target.value)}
                className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Metode
            </label>
            <select
              value={metode}
              onChange={(e) => setMetode(e.target.value as any)}
              className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              <option value="AMBIL_SENDIRI">Ambil Sendiri</option>
              <option value="DIANTAR">Diantar</option>
            </select>
          </div>

          {metode === "DIANTAR" && (
            <input
              type="text"
              placeholder="Alamat lengkap..."
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            />
          )}
        </div>

        {/* Input Jumlah Barang */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jumlah Barang
            {jumlahDiKeranjang > 0 && (
              <span className="text-orange-600 ml-1 text-xs">
                (Sudah ada {jumlahDiKeranjang} di keranjang)
              </span>
            )}
          </label>
          <input
            type="number"
            min={1}
            max={sisaStokTersedia}
            value={jumlah}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val > sisaStokTersedia) {
                setJumlah(sisaStokTersedia);
              } else {
                setJumlah(val);
              }
            }}
            className={`w-full px-4 py-2.5 border rounded-lg shadow-sm outline-none transition-all focus:ring-2 ${
              jumlah > sisaStokTersedia
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-orange-500 focus:border-transparent"
            }`}
          />
          {sisaStokTersedia <= 0 ? (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
              <span>⚠️</span>
              Stok di keranjang sudah maksimal.
            </p>
          ) : (
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Sisa yang bisa ditambah: {sisaStokTersedia}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={handleSubmit}
          disabled={sisaStokTersedia <= 0}
          className={`flex-1 font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-[1.02] ${
            sisaStokTersedia <= 0
              ? "bg-gray-200 cursor-not-allowed text-gray-500"
              : "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg"
          }`}
        >
          {isFirstItem ? "Mulai Sewa" : "Tambah ke Keranjang"}
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 hover:border-orange-200 transition-all duration-200"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
