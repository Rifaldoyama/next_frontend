"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/Buttons";
import { useAdminKategori } from "@/hooks/admin/useAdminKategori";

export function BarangForm({
  initialData,
  onSubmit,
  onClose,
}: {
  initialData?: any;
  onSubmit: (data: any, file?: File | null) => void;
  onClose?: () => void;
}) {
  const { kategori } = useAdminKategori();

  const [form, setForm] = useState({
    nama: "",
    deskripsi: "",
    stok_total: 0,
    harga_sewa: 0,
    kategoriId: "",
    satuan: "",
    denda_telat_per_hari: 0,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        nama: initialData.nama,
        deskripsi: initialData.deskripsi ?? "",
        stok_total: initialData.stok_total ?? 0,
        harga_sewa: initialData.harga_sewa,
        kategoriId: initialData.kategoriId,
        satuan: initialData.satuan ?? "",
        denda_telat_per_hari: initialData.denda_telat_per_hari ?? 0,
      });

      if (initialData.gambar) {
        setPreview(
          `${process.env.NEXT_PUBLIC_IMAGE_URL}/${initialData.gambar}`,
        );
      }
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(f.type)) {
        alert("Format file harus JPG, PNG, atau WEBP");
        e.target.value = "";
        return;
      }
      if (f.size > 2 * 1024 * 1024) {
        alert("Ukuran file maksimal 2MB");
        e.target.value = "";
        return;
      }
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...form,
      stok_total: Number(form.stok_total),
      harga_sewa: Number(form.harga_sewa),
      denda_telat_per_hari: form.denda_telat_per_hari
        ? Number(form.denda_telat_per_hari)
        : null,
    };
    onSubmit(submitData, file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? "Edit Barang" : "Tambah Barang Baru"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Isi form berikut untuk {initialData ? "mengedit" : "menambahkan"}{" "}
            barang
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Nama & Kategori */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Nama Barang <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Masukkan nama barang"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              name="kategoriId"
              value={form.kategoriId}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              required
            >
              <option value="">-- Pilih Kategori --</option>
              {kategori.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Stok & Harga Sewa */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Stok <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                name="stok_total"
                min="0"
                value={form.stok_total}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-16 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                required
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <span className="text-sm text-gray-500">unit</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Harga Sewa <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="text-sm text-gray-500">Rp</span>
              </div>
              <input
                type="number"
                name="harga_sewa"
                min="0"
                value={form.harga_sewa}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Row 3: Satuan & Denda */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Satuan <span className="text-red-500">*</span>
            </label>
            <select
              name="satuan"
              value={form.satuan}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              required
            >
              <option value="">-- Pilih Satuan --</option>
              <option value="pcs">Pcs</option>
              <option value="unit">Unit</option>
              <option value="set">Set</option>
              <option value="meter">Meter</option>
              <option value="kg">Kg</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Denda Telat per Hari
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="text-sm text-gray-500">Rp</span>
              </div>
              <input
                type="number"
                name="denda_telat_per_hari"
                min="0"
                value={form.denda_telat_per_hari}
                onChange={handleChange}
                placeholder="0"
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>
            <p className="text-xs text-gray-500">
              Opsional, kosongkan jika tidak ada denda
            </p>
          </div>
        </div>

        {/* Row 4: Deskripsi */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Deskripsi
            </label>
            <span className="text-xs text-gray-500">
              {form.deskripsi.length}/500
            </span>
          </div>
          <textarea
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
            rows={3}
            maxLength={500}
            placeholder="Masukkan deskripsi barang (opsional)"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
        </div>

        {/* Row 5: Gambar */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Gambar Barang
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Preview Area */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              {preview ? (
                <div className="space-y-3">
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-40 w-full rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setFile(null);
                      }}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-lg hover:bg-red-600"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-center text-xs text-gray-500">
                    Gambar saat ini
                  </p>
                </div>
              ) : (
                <div className="flex h-40 flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300">
                  <svg
                    className="h-10 w-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Tidak ada gambar</p>
                </div>
              )}
            </div>

            {/* Upload Area */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 transition-colors hover:border-blue-400 hover:bg-blue-50">
                <svg
                  className="mb-2 h-10 w-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Klik untuk upload</span>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, WEBP (MAX. 2MB)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
          {onClose && (
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              size="md"
            >
              Batal
            </Button>
          )}
          <Button type="submit" variant="primary" size="md">
            {initialData ? "Simpan Perubahan" : "Tambah Barang"}
          </Button>
        </div>
      </form>
    </div>
  );
}
