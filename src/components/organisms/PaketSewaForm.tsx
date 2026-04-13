
"use client";

import { useState, useEffect } from "react";
import { useSewaDraft } from "@/hooks/useSewaDraft";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

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
  onClose: () => void;
  onDone: () => void;
}

type MetodeAmbil = "AMBIL_SENDIRI" | "DIANTAR";
type AlamatOption = "USER_ALAMAT" | "CUSTOM";

export function PaketSewaForm({ paket, onClose, onDone }: PaketSewaFormProps) {
  const { setMeta, items, addItem, clear } = useSewaDraft();
  const router = useRouter();
  const { user } = useAuthStore();

  // ✅ Ambil alamat langsung dari user.detail
  const displayAlamat = user?.detail?.alamat;
  const userNama = user?.detail?.nama_lengkap;

  // Form states
  const [mulai, setMulai] = useState("");
  const [selesai, setSelesai] = useState("");
  const [metode, setMetode] = useState<MetodeAmbil>("AMBIL_SENDIRI");
  const [jaminanTipe, setJaminanTipe] = useState<
    "DEPOSIT_UANG" | "KTP" | "SIM"
  >("DEPOSIT_UANG");

  // Deposit fields
  const [namaRekening, setNamaRekening] = useState("");
  const [bankPengembalian, setBankPengembalian] = useState("");
  const [nomorRekening, setNomorRekening] = useState("");

  // Jaminan fisik fields
  const [jaminanDetail, setJaminanDetail] = useState("");

  // Alamat fields
  const [alamatOption, setAlamatOption] = useState<AlamatOption>("USER_ALAMAT");
  const [customAlamat, setCustomAlamat] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper: dapatkan alamat yang akan digunakan
  const getAlamat = () => {
    if (metode !== "DIANTAR") return undefined;
    if (alamatOption === "USER_ALAMAT") return displayAlamat;
    return customAlamat;
  };

  // Reset custom alamat when switching from custom to user alamat
  useEffect(() => {
    if (alamatOption === "USER_ALAMAT") {
      setCustomAlamat("");
    }
  }, [alamatOption]);

  // Validasi form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validasi tanggal
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

    if (!selesai) {
      newErrors.selesai = "Tanggal selesai wajib diisi";
    } else if (mulai && selesai) {
      const startDate = new Date(mulai);
      const endDate = new Date(selesai);
      if (endDate < startDate) {
        newErrors.selesai = "Tanggal selesai tidak boleh sebelum tanggal mulai";
      }
    }

    // Validasi alamat untuk DIANTAR
    if (metode === "DIANTAR") {
      if (alamatOption === "USER_ALAMAT" && !displayAlamat) {
        newErrors.alamat =
          "Anda belum memiliki alamat terdaftar. Silakan isi alamat manual.";
        setAlamatOption("CUSTOM");
      }
      if (alamatOption === "CUSTOM" && !customAlamat.trim()) {
        newErrors.alamat = "Alamat tujuan wajib diisi";
      }
      if (alamatOption === "CUSTOM" && customAlamat.length < 10) {
        newErrors.alamat =
          "Alamat minimal 10 karakter (RT/RW, jalan, kelurahan, kecamatan, kota)";
      }
    }

    // Validasi jaminan
    if (jaminanTipe === "DEPOSIT_UANG") {
      if (!namaRekening.trim()) {
        newErrors.namaRekening = "Nama pemilik rekening wajib diisi";
      }
      if (!bankPengembalian.trim()) {
        newErrors.bankPengembalian = "Nama bank wajib diisi";
      }
      if (!nomorRekening.trim()) {
        newErrors.nomorRekening = "Nomor rekening wajib diisi";
      }
      if (nomorRekening && nomorRekening.length < 5) {
        newErrors.nomorRekening = "Nomor rekening minimal 5 digit";
      }
    } else {
      if (!jaminanDetail.trim()) {
        newErrors.jaminanDetail = `Nomor ${jaminanTipe} wajib diisi`;
      }
      if (jaminanDetail && jaminanDetail.length < 5) {
        newErrors.jaminanDetail = `Nomor ${jaminanTipe} minimal 5 karakter`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      const firstError = document.querySelector(".error-message");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Cek apakah draft sudah ada item (prevent campur mode)
    if (items.length > 0) {
      alert(
        "Keranjang berisi item satuan. Kosongkan dulu sebelum memilih paket.",
      );
      return;
    }

    // ✅ KOSONGKAN ITEMS SEBELUMNYA (pastikan tidak tercampur)
    clear();

    // ✅ TAMBAHKAN SEMUA ITEM PAKET KE DRAFT.ITEMS
    paket.items.forEach((item) => {
      addItem({
        barangId: item.barangId,
        nama: item.barang.nama,
        jumlah: item.jumlah,
        stok: item.barang.stok_tersedia,
        source: "PAKET",
      });
    });

    // ✅ SET META (paketId, tanggal, dll)
    setMeta({
      paketId: paket.id,
      tanggal_mulai: mulai,
      tanggal_selesai: selesai,
      metode_ambil: metode,
      alamat_acara: metode === "DIANTAR" ? getAlamat() : undefined,
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

    onDone();
    router.push("/dashboard/sewa/review");
  };

  return (
    <div className="space-y-5 text-black mt-15 md:mt-0 p-4 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-lg font-semibold text-black">
          Sewa Paket {paket.nama}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      {paket.deskripsi && (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-700">{paket.deskripsi}</p>
        </div>
      )}

      {/* ===== DETAIL ITEM PAKET ===== */}
      <div className="bg-gray-50 p-3 rounded-lg border">
        <h3 className="text-sm font-semibold text-black mb-2">📦 Isi Paket:</h3>
        <ul className="text-sm space-y-1">
          {paket.items.map((item) => (
            <li key={item.barangId} className="flex justify-between text-black">
              <span>• {item.barang.nama}</span>
              <span className="text-gray-500">{item.jumlah} unit</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ===== TANGGAL SEWA ===== */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-black">📅 Tanggal Sewa</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-600 block mb-1">
              Tanggal Mulai <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={mulai}
              onChange={(e) => setMulai(e.target.value)}
              className={`w-full text-sm p-2 border rounded text-black ${
                errors.mulai ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.mulai && (
              <p className="text-xs text-red-500 mt-1 error-message">
                {errors.mulai}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">
              Tanggal Selesai <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={selesai}
              onChange={(e) => setSelesai(e.target.value)}
              className={`w-full text-sm p-2 border rounded text-black ${
                errors.selesai ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.selesai && (
              <p className="text-xs text-red-500 mt-1">{errors.selesai}</p>
            )}
          </div>
        </div>
      </div>

      {/* ===== METODE PENGAMBILAN ===== */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-black">
          🚚 Metode Pengambilan
        </h3>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 p-3 border rounded-lg flex-1 cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              value="AMBIL_SENDIRI"
              checked={metode === "AMBIL_SENDIRI"}
              onChange={() => setMetode("AMBIL_SENDIRI")}
              className="w-4 h-4"
            />
            <span className="text-sm text-black">Ambil Sendiri</span>
          </label>
          <label className="flex items-center gap-2 p-3 border rounded-lg flex-1 cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              value="DIANTAR"
              checked={metode === "DIANTAR"}
              onChange={() => setMetode("DIANTAR")}
              className="w-4 h-4"
            />
            <span className="text-sm text-black">Diantar</span>
          </label>
        </div>
      </div>

      {/* ===== ALAMAT (khusus DIANTAR) ===== */}
      {metode === "DIANTAR" && (
        <div className="space-y-3 border-t pt-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-black">
              📍 Alamat Tujuan
            </h3>
            <span className="text-xs text-red-500">*Wajib diisi</span>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              ⚠️ Pastikan alamat lengkap dan jelas untuk memudahkan kurir.
              <br />
              Contoh: Jl. Mawar No. 10, RT 01/RW 02, Kel. Kebon Jeruk, Kec.
              Kebon Jeruk, Jakarta Barat 11530
            </p>
          </div>

          {displayAlamat ? (
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="USER_ALAMAT"
                  checked={alamatOption === "USER_ALAMAT"}
                  onChange={() => setAlamatOption("USER_ALAMAT")}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-black">
                    Gunakan alamat terdaftar
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {displayAlamat}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {userNama
                      ? `Atas nama: ${userNama}`
                      : "Nama tidak tersedia"}
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="CUSTOM"
                  checked={alamatOption === "CUSTOM"}
                  onChange={() => setAlamatOption("CUSTOM")}
                  className="w-4 h-4"
                />
                <span className="text-sm text-black">Gunakan alamat lain</span>
              </label>
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-orange-700">
                ⚠️ Anda belum memiliki alamat terdaftar. Silakan isi alamat di
                bawah.
              </p>
            </div>
          )}

          {(alamatOption === "CUSTOM" || !displayAlamat) && (
            <div>
              <textarea
                value={customAlamat}
                onChange={(e) => setCustomAlamat(e.target.value)}
                placeholder="Contoh: Jl. Mawar No. 10, RT 01/RW 02, Kel. Kebon Jeruk, Kec. Kebon Jeruk, Jakarta Barat 11530"
                className={`w-full text-sm p-3 border rounded-lg resize-none text-black ${
                  errors.alamat ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                rows={3}
              />
              {errors.alamat && (
                <p className="text-xs text-red-500 mt-1 error-message">
                  {errors.alamat}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                * Cantumkan alamat lengkap (jalan, nomor, RT/RW, kelurahan,
                kecamatan, kota, kode pos)
              </p>
            </div>
          )}
        </div>
      )}

      {/* ===== JAMINAN ===== */}
      <div className="space-y-3 border-t pt-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-black">🔒 Jaminan</h3>
          <span className="text-xs text-red-500">*Wajib dipilih</span>
        </div>

        <select
          value={jaminanTipe}
          onChange={(e) => setJaminanTipe(e.target.value as any)}
          className="w-full text-sm p-2 border border-gray-300 rounded-lg text-black"
        >
          <option value="DEPOSIT_UANG">💰 Deposit Uang</option>
          <option value="KTP">🪪 KTP</option>
          <option value="SIM">🚗 SIM</option>
        </select>

        {jaminanTipe !== "DEPOSIT_UANG" && (
          <div>
            <input
              type="text"
              placeholder={`Masukkan nomor ${jaminanTipe}`}
              value={jaminanDetail}
              onChange={(e) => setJaminanDetail(e.target.value)}
              className={`w-full text-sm p-2 border rounded-lg text-black ${
                errors.jaminanDetail
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {errors.jaminanDetail && (
              <p className="text-xs text-red-500 mt-1">
                {errors.jaminanDetail}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              * Jaminan akan ditahan dan dikembalikan setelah peminjaman selesai
            </p>
          </div>
        )}

        {jaminanTipe === "DEPOSIT_UANG" && (
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              💡 Data rekening ini akan digunakan untuk mengembalikan deposit
              setelah peminjaman selesai (dikurangi denda jika ada)
            </p>
            <div>
              <input
                type="text"
                placeholder="Nama Pemilik Rekening"
                value={namaRekening}
                onChange={(e) => setNamaRekening(e.target.value)}
                className={`w-full text-sm p-2 border rounded-lg text-black ${
                  errors.namaRekening
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {errors.namaRekening && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.namaRekening}
                </p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Nama Bank (contoh: BCA, Mandiri, BNI, BRI)"
                value={bankPengembalian}
                onChange={(e) => setBankPengembalian(e.target.value)}
                className={`w-full text-sm p-2 border rounded-lg text-black ${
                  errors.bankPengembalian
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {errors.bankPengembalian && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.bankPengembalian}
                </p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Nomor Rekening"
                value={nomorRekening}
                onChange={(e) => setNomorRekening(e.target.value)}
                className={`w-full text-sm p-2 border rounded-lg text-black ${
                  errors.nomorRekening
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {errors.nomorRekening && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.nomorRekening}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ===== ACTION BUTTON ===== */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          ✅ Tambah ke Keranjang
        </button>

        <button
          onClick={onClose}
          className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
