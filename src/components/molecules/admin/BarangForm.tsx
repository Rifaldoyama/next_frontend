"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/Buttons"; // Menggunakan Button component yang sudah ada
import { useAdminKategori } from "@/hooks/admin/useAdminKategori";

export function BarangForm({
  initialData,
  onSubmit,
  onClose, // Tambah prop onClose
}: {
  initialData?: any;
  onSubmit: (data: any, file?: File | null) => void;
  onClose?: () => void; // Tambah prop onClose (opsional)
}) {
  const { kategori } = useAdminKategori();

  const [form, setForm] = useState({
    nama: "",
    deskripsi: "",
    stok_total: 0,
    harga_sewa: 0,
    kategoriId: "",
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
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  return (
    <div className="space-y-4">
      {/* HEADER DENGAN TOMBOL CLOSE */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {initialData ? "Edit Barang" : "Tambah Barang Baru"}
          </h2>
          <p className="text-xs text-gray-500">
            Isi form berikut untuk {initialData ? "mengedit" : "menambahkan"}{" "}
            barang
          </p>
        </div>

        {/* TOMBOL CLOSE - menggunakan Button component
        {onClose && (
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            size="sm"
            className="!px-2 !py-1 min-w-0"
            aria-label="Tutup"
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
          </Button>
        )} */}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form, file);
        }}
        className="space-y-4"
      >
        {/* ROW 1: NAMA & KATEGORI */}
        <div className="flex gap-4">
          <div className="flex-1 space-y-1">
            <label className="block text-xs font-medium text-gray-700">
              Nama Barang *
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Masukkan nama barang"
              required
            />
          </div>

          <div className="flex-1 space-y-1">
            <label className="block text-xs font-medium text-gray-700">
              Kategori *
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none"
              name="kategoriId"
              value={form.kategoriId}
              onChange={handleChange}
              required
            >
              <option value="" className="text-gray-400 text-sm">
                -- Pilih --
              </option>
              {kategori.map((k) => (
                <option key={k.id} value={k.id} className="text-sm">
                  {k.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ROW 2: STOK & HARGA SEWA */}
        <div className="flex gap-4">
          <div className="flex-1 space-y-1">
            <label className="block text-xs font-medium text-gray-700">
              Stok *
            </label>
            <div className="relative">
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none"
                type="number"
                name="stok_total"
                min="0"
                value={form.stok_total ?? 0}
                onChange={handleChange}
                required
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-xs text-gray-500">unit</span>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-1">
            <label className="block text-xs font-medium text-gray-700">
              Harga Sewa *
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-xs text-gray-500">Rp</span>
              </div>
              <input
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none"
                type="number"
                name="harga_sewa"
                min="0"
                value={form.harga_sewa}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* ROW 3: DESKRIPSI */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-gray-700">
              Deskripsi
            </label>
            <span className="text-xs text-gray-400">
              {form.deskripsi.length}/500
            </span>
          </div>
          <textarea
            className="h-20 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none"
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
            placeholder="Masukkan deskripsi barang (opsional)"
            maxLength={500}
          />
        </div>

        {/* ROW 4: GAMBAR BARANG - SISI DEMI SISI */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700">
            Gambar Barang
          </label>

          <div className="flex items-start gap-4">
            {/* PREVIEW AREA */}
            <div className="w-1/2">
              <div className="rounded-lg border border-gray-200 p-3">
                {preview ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-32 w-full rounded-md object-cover"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setFile(null);
                        }}
                        variant="danger"
                        size="sm"
                        className="absolute -right-2 -top-2 !px-2 !py-1 min-w-0"
                      >
                        <svg
                          className="h-3 w-3"
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
                      </Button>
                    </div>
                    <p className="text-xs text-center text-gray-500">
                      Gambar saat ini
                    </p>
                  </div>
                ) : (
                  <div className="flex h-32 flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300">
                    <svg
                      className="h-8 w-8 text-gray-400"
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
                    <p className="mt-1 text-xs text-gray-500">
                      Tidak ada gambar
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* UPLOAD AREA */}
            <div className="w-1/2">
              <div className="rounded-lg border border-gray-200 p-3">
                <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 transition-colors hover:border-blue-400 hover:bg-blue-50">
                  <svg
                    className="mb-1 h-8 w-8 text-gray-400"
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
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Klik untuk upload</span>
                  </p>
                  <p className="mt-1 text-[10px] text-gray-500">
                    PNG, JPG, GIF (MAX. 5MB)
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
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-2 pt-3">
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
