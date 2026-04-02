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
  kategoriId?: string;
  onClose: () => void;
  onDone: () => void;
}

type MetodeAmbil = "AMBIL_SENDIRI" | "DIANTAR";

// Type untuk error validation
type ValidationErrors = {
  mulai?: string;
  selesai?: string;
  jumlah?: string;
  jaminanDetail?: string;
  namaRek?: string;
  bankRek?: string;
  nomorRek?: string;
  alamat?: string;
};

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

  // State untuk error validation
  const [errors, setErrors] = useState<ValidationErrors>({});

  const isFirstItem = items.length === 0;

  // Fungsi validasi
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validasi tanggal mulai
    if (!mulai) {
      newErrors.mulai = "Tanggal mulai wajib diisi";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = new Date(mulai);
      if (startDate < today) {
        newErrors.mulai = "Tanggal mulai tidak boleh kurang dari hari ini";
      }
    }

    // Validasi tanggal selesai
    if (!selesai) {
      newErrors.selesai = "Tanggal selesai wajib diisi";
    } else if (mulai && selesai) {
      const startDate = new Date(mulai);
      const endDate = new Date(selesai);
      if (endDate <= startDate) {
        newErrors.selesai = "Tanggal selesai harus setelah tanggal mulai";
      }
    }

    // Validasi jumlah
    if (jumlah <= 0) {
      newErrors.jumlah = "Jumlah harus lebih dari 0";
    } else if (jumlah > sisaStokTersedia) {
      newErrors.jumlah = `Jumlah melebihi stok tersedia. Maksimal: ${sisaStokTersedia}`;
    }

    // Validasi jaminan
    if (jaminanTipe !== "DEPOSIT_UANG") {
      if (!jaminanDetail || jaminanDetail.trim() === "") {
        newErrors.jaminanDetail = "Nomor identitas wajib diisi";
      } else if (jaminanTipe === "KTP" && !/^[0-9]{16}$/.test(jaminanDetail.replace(/\s/g, ''))) {
        newErrors.jaminanDetail = "Nomor KTP harus 16 digit angka";
      } else if (jaminanTipe === "SIM" && !/^[0-9]{12,16}$/.test(jaminanDetail.replace(/\s/g, ''))) {
        newErrors.jaminanDetail = "Nomor SIM harus 12-16 digit angka";
      }
    }

    // Validasi data rekening (untuk deposit uang)
    if (jaminanTipe === "DEPOSIT_UANG") {
      if (!namaRek || namaRek.trim() === "") {
        newErrors.namaRek = "Nama pemilik rekening wajib diisi";
      } else if (namaRek.length < 3) {
        newErrors.namaRek = "Nama minimal 3 karakter";
      }

      if (!bankRek || bankRek.trim() === "") {
        newErrors.bankRek = "Nama bank wajib diisi";
      }

      if (!nomorRek || nomorRek.trim() === "") {
        newErrors.nomorRek = "Nomor rekening wajib diisi";
      } else if (!/^[0-9]{8,16}$/.test(nomorRek.replace(/\s/g, ''))) {
        newErrors.nomorRek = "Nomor rekening harus 8-16 digit angka";
      }
    }

    // Validasi alamat jika metode DIANTAR
    if (metode === "DIANTAR" && (!alamat || alamat.trim() === "")) {
      newErrors.alamat = "Alamat wajib diisi jika memilih DIANTAR";
    } else if (metode === "DIANTAR" && alamat && alamat.length < 10) {
      newErrors.alamat = "Alamat minimal 10 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit dengan validasi
  const handleSubmit = () => {
    // Jalankan validasi
    if (!validateForm()) {
      // Scroll ke error pertama
      const firstError = document.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
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
      kategoriId: barang.kategoriId ,
      source: "ITEM",
    });

    requestAnimationFrame(() => onDone());
  };

  // Helper untuk menghapus error saat input berubah
  const clearError = (field: keyof ValidationErrors) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
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
              <label htmlFor="tanggal_mulai" className="block text-xs font-medium text-gray-600 mb-1">
                Mulai <span className="text-red-500">*</span>
              </label>
              <input
                id="tanggal_mulai"
                type="date"
                value={mulai}
                onChange={(e) => {
                  setMulai(e.target.value);
                  clearError("mulai");
                }}
                title="Tanggal mulai sewa"
                placeholder="Pilih tanggal mulai"
                className={`w-full text-sm p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white ${errors.mulai ? "border-red-500" : "border-gray-200"
                  }`}
              />
              {errors.mulai && (
                <p className="text-xs text-red-500 mt-1 error-message">{errors.mulai}</p>
              )}
            </div>
            <div>
              <label htmlFor="tanggal_selesai" className="block text-xs font-medium text-gray-600 mb-1">
                Selesai <span className="text-red-500">*</span>
              </label>
              <input
                id="tanggal_selesai"
                type="date"
                value={selesai}
                onChange={(e) => {
                  setSelesai(e.target.value);
                  clearError("selesai");
                }}
                title="Tanggal selesai sewa"
                placeholder="Pilih tanggal selesai"
                className={`w-full text-sm p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white ${errors.selesai ? "border-red-500" : "border-gray-200"
                  }`}
              />
              {errors.selesai && (
                <p className="text-xs text-red-500 mt-1 error-message">{errors.selesai}</p>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="jaminan_tipe" className="block text-xs font-medium text-gray-600 mb-1">
              Jaminan <span className="text-red-500">*</span>
            </label>
            <select
              id="jaminan_tipe"
              value={jaminanTipe}
              onChange={(e) => {
                setJaminanTipe(e.target.value as any);
                clearError("jaminanDetail");
                clearError("namaRek");
                clearError("bankRek");
                clearError("nomorRek");
              }}
              title="Pilih jenis jaminan"
              className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              <option value="DEPOSIT_UANG">Deposit Uang</option>
              <option value="KTP">KTP</option>
              <option value="SIM">SIM</option>
            </select>
          </div>

          {jaminanTipe !== "DEPOSIT_UANG" && (
            <div className="mb-3">
              <label htmlFor="jaminan_detail" className="sr-only">
                Nomor {jaminanTipe}
              </label>
              <input
                id="jaminan_detail"
                type="text"
                placeholder={`Masukkan nomor ${jaminanTipe}...`}
                value={jaminanDetail}
                onChange={(e) => {
                  setJaminanDetail(e.target.value);
                  clearError("jaminanDetail");
                }}
                title={`Nomor ${jaminanTipe}`}
                className={`w-full text-sm p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white ${errors.jaminanDetail ? "border-red-500" : "border-gray-200"
                  }`}
              />
              {errors.jaminanDetail && (
                <p className="text-xs text-red-500 mt-1 error-message">{errors.jaminanDetail}</p>
              )}
            </div>
          )}

          {jaminanTipe === "DEPOSIT_UANG" && (
            <div className="space-y-2 mb-3">
              <div>
                <label htmlFor="nama_rekening" className="sr-only">
                  Nama Pemilik Rekening
                </label>
                <input
                  id="nama_rekening"
                  type="text"
                  placeholder="Nama Pemilik Rekening"
                  value={namaRek}
                  onChange={(e) => {
                    setNamaRek(e.target.value);
                    clearError("namaRek");
                  }}
                  title="Nama pemilik rekening"
                  className={`w-full text-sm p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white ${errors.namaRek ? "border-red-500" : "border-gray-200"
                    }`}
                />
                {errors.namaRek && (
                  <p className="text-xs text-red-500 mt-1 error-message">{errors.namaRek}</p>
                )}
              </div>
              <div>
                <label htmlFor="bank_rekening" className="sr-only">
                  Nama Bank
                </label>
                <input
                  id="bank_rekening"
                  type="text"
                  placeholder="Nama Bank"
                  value={bankRek}
                  onChange={(e) => {
                    setBankRek(e.target.value);
                    clearError("bankRek");
                  }}
                  title="Nama bank"
                  className={`w-full text-sm p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white ${errors.bankRek ? "border-red-500" : "border-gray-200"
                    }`}
                />
                {errors.bankRek && (
                  <p className="text-xs text-red-500 mt-1 error-message">{errors.bankRek}</p>
                )}
              </div>
              <div>
                <label htmlFor="nomor_rekening" className="sr-only">
                  Nomor Rekening
                </label>
                <input
                  id="nomor_rekening"
                  type="text"
                  placeholder="Nomor Rekening"
                  value={nomorRek}
                  onChange={(e) => {
                    setNomorRek(e.target.value);
                    clearError("nomorRek");
                  }}
                  title="Nomor rekening"
                  className={`w-full text-sm p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white ${errors.nomorRek ? "border-red-500" : "border-gray-200"
                    }`}
                />
                {errors.nomorRek && (
                  <p className="text-xs text-red-500 mt-1 error-message">{errors.nomorRek}</p>
                )}
              </div>
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="metode_ambil" className="block text-xs font-medium text-gray-600 mb-1">
              Metode <span className="text-red-500">*</span>
            </label>
            <select
              id="metode_ambil"
              value={metode}
              onChange={(e) => {
                setMetode(e.target.value as any);
                clearError("alamat");
              }}
              title="Pilih metode pengambilan"
              className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              <option value="AMBIL_SENDIRI">Ambil Sendiri</option>
              <option value="DIANTAR">Diantar</option>
            </select>
          </div>

          {metode === "DIANTAR" && (
            <div>
              <label htmlFor="alamat_acara" className="sr-only">
                Alamat Lengkap
              </label>
              <input
                id="alamat_acara"
                type="text"
                placeholder="Alamat lengkap..."
                value={alamat}
                onChange={(e) => {
                  setAlamat(e.target.value);
                  clearError("alamat");
                }}
                title="Alamat lengkap untuk pengantaran"
                className={`w-full text-sm p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white ${errors.alamat ? "border-red-500" : "border-gray-200"
                  }`}
              />
              {errors.alamat && (
                <p className="text-xs text-red-500 mt-1 error-message">{errors.alamat}</p>
              )}
            </div>
          )}
        </div>

        {/* Input Jumlah Barang */}
        <div>
          <label htmlFor="jumlah_barang" className="block text-sm font-medium text-gray-700 mb-2">
            Jumlah Barang <span className="text-red-500">*</span>
            {jumlahDiKeranjang > 0 && (
              <span className="text-orange-600 ml-1 text-xs">
                (Sudah ada {jumlahDiKeranjang} di keranjang)
              </span>
            )}
          </label>
          <input
            id="jumlah_barang"
            type="number"
            min={1}
            max={sisaStokTersedia}
            value={jumlah}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val > sisaStokTersedia) {
                setJumlah(sisaStokTersedia);
              } else if (isNaN(val) || val < 1) {
                setJumlah(1);
              } else {
                setJumlah(val);
              }
              clearError("jumlah");
            }}
            title="Jumlah barang yang akan disewa"
            placeholder="Masukkan jumlah barang"
            className={`w-full px-4 py-2.5 border rounded-lg shadow-sm outline-none transition-all focus:ring-2 ${errors.jumlah
                ? "border-red-500 focus:ring-red-500"
                : jumlah > sisaStokTersedia
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-orange-500 focus:border-transparent"
              }`}
          />
          {errors.jumlah ? (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1 error-message">
              <span>⚠️</span>
              {errors.jumlah}
            </p>
          ) : sisaStokTersedia <= 0 ? (
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

      {/* Summary Info */}
      <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-3 border border-orange-100">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Total yang akan disewa:</span>
          <span className="font-bold text-orange-600">{jumlah} item</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={handleSubmit}
          disabled={sisaStokTersedia <= 0}
          className={`flex-1 font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-[1.02] ${sisaStokTersedia <= 0
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