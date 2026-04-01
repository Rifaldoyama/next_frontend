"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Buttons";

export default function KategoriForm({ initialData, onSubmit, onClose }: any) {
  const [nama, setNama] = useState(initialData?.nama || "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  // State untuk switch active/inactive
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  // Setup preview awal jika sedang mode edit
  useEffect(() => {
    if (initialData?.gambar) {
      setPreview(`${process.env.NEXT_PUBLIC_IMAGE_URL}/${initialData.gambar}`);
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Kirim data nama, file, dan status isActive ke fungsi onSubmit
    onSubmit({ nama, isActive }, file);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">
        {initialData ? "Edit" : "Tambah"} Kategori
      </h2>

      {/* INPUT NAMA */}
      <div>
        <label className="text-sm font-semibold text-gray-700">Nama Kategori</label>
        <input
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="Contoh: Elektronik"
          required
        />
      </div>

      {/* INPUT GAMBAR */}
      <div>
        <label className="text-sm font-semibold text-gray-700">Gambar Kategori</label>
        <input 
          type="file" 
          onChange={handleFileChange} 
          className="block w-full text-sm mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
        />
        {preview && (
          <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-dashed flex items-center gap-4">
            <img
              src={preview}
              alt="Preview"
              className="h-20 w-20 object-cover rounded-md shadow-sm"
            />
            <p className="text-xs text-gray-400">Preview gambar saat ini</p>
          </div>
        )}
      </div>

      {/* TOGGLE SWITCH ACTIVE/INACTIVE */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border">
        <div>
          <p className="text-sm font-semibold text-gray-700">Status Kategori</p>
          <p className="text-xs text-gray-500">
            {isActive ? "Kategori tampil di aplikasi" : "Kategori disembunyikan"}
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 mt-8">
        <Button onClick={onClose} type="button" className="bg-gray-100 !text-gray-600 hover:bg-gray-200 border-none">
          Batal
        </Button>
        <Button type="submit" className="bg-blue-600 text-white shadow-lg shadow-blue-200">
          {initialData ? "Simpan Perubahan" : "Buat Kategori"}
        </Button>
      </div>
    </form>
  );
}