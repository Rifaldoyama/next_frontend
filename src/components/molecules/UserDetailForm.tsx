import { AuthField } from "../molecules/AuthField";
import { Button } from "../atoms/Buttons";
import { useState, useEffect } from "react";
import { FileInput } from "../atoms/FileInput";

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
    foto_ktp?: string;
  } | null;
};

type ValidationErrors = {
  nama_lengkap?: string;
  no_hp?: string;
  alamat?: string;
  no_ktp?: string;
};

export function UserDetailForm({ onSubmit, initialData }: UserDetailFormProps) {
  const [form, setForm] = useState({
    nama_lengkap: initialData?.nama_lengkap ?? "",
    no_hp: initialData?.no_hp ?? "",
    alamat: initialData?.alamat ?? "",
    no_ktp: initialData?.no_ktp ?? "",
  });

  const [fotoKtp, setFotoKtp] = useState<File | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});

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

  // Validasi function
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validasi Nama Lengkap
    if (!form.nama_lengkap || form.nama_lengkap.trim() === "") {
      newErrors.nama_lengkap = "Nama lengkap wajib diisi";
    } else if (form.nama_lengkap.length < 3) {
      newErrors.nama_lengkap = "Nama lengkap minimal 3 karakter";
    } else if (form.nama_lengkap.length > 100) {
      newErrors.nama_lengkap = "Nama lengkap maksimal 100 karakter";
    }

    // Validasi No HP
    if (!form.no_hp || form.no_hp.trim() === "") {
      newErrors.no_hp = "Nomor HP wajib diisi";
    } else {
      const phoneRegex = /^[0-9]{10,13}$/;
      if (!phoneRegex.test(form.no_hp.replace(/\s/g, ''))) {
        newErrors.no_hp = "Nomor HP harus berupa angka 10-13 digit";
      }
    }

    // Validasi Alamat
    if (!form.alamat || form.alamat.trim() === "") {
      newErrors.alamat = "Alamat wajib diisi";
    } else if (form.alamat.length < 10) {
      newErrors.alamat = "Alamat minimal 10 karakter";
    } else if (form.alamat.length > 500) {
      newErrors.alamat = "Alamat maksimal 500 karakter";
    }

    // Validasi No KTP (opsional tapi jika diisi harus valid)
    if (form.no_ktp && form.no_ktp.trim() !== "") {
      const ktpRegex = /^[0-9]{16}$/;
      if (!ktpRegex.test(form.no_ktp.replace(/\s/g, ''))) {
        newErrors.no_ktp = "Nomor KTP harus 16 digit angka";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Jalankan validasi
    if (!validateForm()) {
      return;
    }

    onSubmit({
      nama_lengkap: form.nama_lengkap || undefined,
      no_hp: form.no_hp || undefined,
      alamat: form.alamat || undefined,
      no_ktp: form.no_ktp || undefined,
      foto_ktp: fotoKtp || undefined,
    });
  };

  const handleInputChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });
    // Hapus error untuk field yang sedang diedit
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <AuthField
          label="Nama Lengkap"
          value={form.nama_lengkap}
          onChange={(e) => handleInputChange("nama_lengkap", e.target.value)}
          placeholder="Masukkan nama lengkap"
          required
        />
        {errors.nama_lengkap && (
          <p className="text-xs text-red-500 mt-1">{errors.nama_lengkap}</p>
        )}
      </div>

      <div>
        <AuthField
          label="No HP"
          value={form.no_hp}
          onChange={(e) => handleInputChange("no_hp", e.target.value)}
          placeholder="Contoh: 08123456789"
          type="tel"
          required
        />
        {errors.no_hp && (
          <p className="text-xs text-red-500 mt-1">{errors.no_hp}</p>
        )}
      </div>

      <div>
        <AuthField
          label="Alamat"
          value={form.alamat}
          onChange={(e) => handleInputChange("alamat", e.target.value)}
          placeholder="Alamat lengkap domisili"
          required
        />
        {errors.alamat && (
          <p className="text-xs text-red-500 mt-1">{errors.alamat}</p>
        )}
      </div>

      <div>
        <AuthField
          label="No KTP (Opsional)"
          value={form.no_ktp}
          onChange={(e) => handleInputChange("no_ktp", e.target.value)}
          placeholder="Nomor Induk Kependudukan"
        />
        {errors.no_ktp && (
          <p className="text-xs text-red-500 mt-1">{errors.no_ktp}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">*Kosongkan jika tidak ada</p>
      </div>

      <div className="space-y-1">
        <FileInput label="Foto KTP" onChange={setFotoKtp} />

        {initialData?.foto_ktp && !fotoKtp && (
          <p className="text-xs text-blue-600">
            ℹ️ Foto KTP lama sudah tersimpan. Biarkan kosong jika tidak ingin mengubah.
          </p>
        )}

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