import { AuthField } from "../molecules/AuthField";
import { Button } from "../atoms/Buttons";
import { useState, useEffect } from "react"; // Tambah useEffect untuk re-sync jika initialData berubah
import { FileInput } from "../atoms/FileInput";

// Definisikan tipe data agar lebih rapi
type UserDetailData = {
  nama_lengkap?: string;
  no_hp?: string;
  alamat?: string;
  no_ktp?: string;
  foto_ktp?: File | null;
};

type UserDetailFormProps = {
  onSubmit: (data: UserDetailData) => void;
  initialData?: {
    nama_lengkap?: string;
    no_hp?: string;
    alamat?: string;
    no_ktp?: string;
    foto_ktp?: string; // URL foto lama dari DB (string)
  } | null;
};

export function UserDetailForm({ onSubmit, initialData }: UserDetailFormProps) {
  // 1. Inisialisasi State dengan data lama (jika ada)
  const [form, setForm] = useState({
    nama_lengkap: initialData?.nama_lengkap ?? "",
    no_hp: initialData?.no_hp ?? "",
    alamat: initialData?.alamat ?? "",
    no_ktp: initialData?.no_ktp ?? "",
  });

  const [fotoKtp, setFotoKtp] = useState<File | null>(null);

  // 2. Optional: Pastikan form terupdate jika initialData dimuat belakangan (async)
  useEffect(() => {
    if (initialData) {
      setForm({
        nama_lengkap: initialData.nama_lengkap ?? "",
        no_hp: initialData.no_hp ?? "",
        alamat: initialData.alamat ?? "",
        no_ktp: initialData.no_ktp ?? "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 3. Logic "Clean Submit":
    // Ubah string kosong ("") menjadi undefined.
    // Ini penting agar di parent component, field ini TIDAK di-append ke FormData,
    // sehingga backend akan tetap menggunakan data lama (existing).
    onSubmit({
      nama_lengkap: form.nama_lengkap || undefined,
      no_hp: form.no_hp || undefined,
      alamat: form.alamat || undefined,
      no_ktp: form.no_ktp || undefined,
      foto_ktp: fotoKtp || undefined, // undefined jika user tidak pilih file baru
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AuthField
        label="Nama Lengkap"
        value={form.nama_lengkap}
        onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })}
        placeholder="Masukkan nama lengkap"
      />

      <AuthField
        label="No HP"
        value={form.no_hp}
        onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
        placeholder="Contoh: 08123456789"
        type="tel"
      />

      <AuthField
        label="Alamat"
        value={form.alamat}
        onChange={(e) => setForm({ ...form, alamat: e.target.value })}
        placeholder="Alamat lengkap domisili"
      />

      <AuthField
        label="No KTP (Opsional)"
        value={form.no_ktp}
        onChange={(e) => setForm({ ...form, no_ktp: e.target.value })}
        placeholder="Nomor Induk Kependudukan"
      />

      {/* Bagian Foto KTP */}
      <div className="space-y-1">
        <FileInput label="Foto KTP" onChange={setFotoKtp} />

        {/* UX: Beri tahu user kalau foto lama aman */}
        {initialData?.foto_ktp && !fotoKtp && (
          <p className="text-xs text-blue-600">
            ℹ️ Foto KTP lama sudah tersimpan. Biarkan kosong jika tidak ingin
            mengubah.
          </p>
        )}

        {/* UX: Beri tahu user kalau dia sedang mengganti foto */}
        {fotoKtp && (
          <p className="text-xs text-green-600">
            ✅ Foto baru dipilih akan menggantikan yang lama.
          </p>
        )}
      </div>

      <div className="pt-2">
        <Button type="submit">
          {initialData ? "Simpan Perubahan" : "Simpan Data"}
        </Button>
      </div>
    </form>
  );
}
