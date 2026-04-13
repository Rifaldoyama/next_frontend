"use client";

import { useState } from "react";
import { BarangForm } from "@/components/molecules/admin/BarangForm";
import { BarangTable } from "@/components/organisms/admin/BarangTable";
import { useAdminBarang } from "@/hooks/admin/useAdminBarang";
import { useAdminKategori } from "@/hooks/admin/useAdminKategori";
import { Modal } from "@/components/atoms/Modal";
import { Button } from "@/components/atoms/Buttons";

export default function KelolaBarangPage() {
  const { barang, saveBarang, deleteBarang } = useAdminBarang();
  const { kategori } = useAdminKategori();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  // 🔍 FILTER STATE
  const [search, setSearch] = useState("");
  const [kategoriId, setKategoriId] = useState("");

  // 🔍 FILTER LOGIC
  const filteredBarang = barang.filter((item) => {
    const matchSearch = item.nama?.toLowerCase().includes(search.toLowerCase());

    const matchKategori = !kategoriId || item.kategoriId === kategoriId;

    return matchSearch && matchKategori;
  });

  const handleDelete = async (id: string, nama: string) => {
    if (confirm(`Hapus barang "${nama}"?`)) {
      try {
        await deleteBarang(id);
        alert("Barang berhasil dihapus");
      } catch (err: any) {
        alert(err.message || "Gagal menghapus barang");
      }
    }
  };

  const handleSubmit = async (data: any, file?: File | null): Promise<void> => {
    await saveBarang(data, file ?? undefined, editing?.id);
    alert(editing ? "Berhasil diperbarui" : "Berhasil ditambahkan");
    setOpen(false);
    setEditing(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white shadow-xl">
          <div className="flex flex-col justify-between lg:flex-row lg:items-center">
            <div>
              <h1 className="text-3xl font-bold">Kelola Barang</h1>
              <p className="mt-2 text-blue-100">
                Kelola dan pantau semua barang yang tersedia
              </p>
              <div className="mt-4 flex items-center space-x-4">
                <div className="rounded-full bg-blue-500/30 px-4 py-2">
                  <span className="text-sm font-medium">
                    Total Barang: {filteredBarang.length}
                  </span>
                </div>
                <div className="rounded-full bg-green-500/30 px-4 py-2">
                  <span className="text-sm font-medium">
                    Stok Tersedia:{" "}
                    {filteredBarang.reduce(
                      (acc, item) => acc + item.stok_tersedia,
                      0,
                    )}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
              className="mt-6 flex items-center space-x-2 bg-gray-500 px-6 py-3 font-semibold text-white transition-all hover:bg-gray-400 hover:shadow-lg lg:mt-0"
            >
              <span>Tambah Barang</span>
            </Button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Daftar Barang
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Semua barang yang terdaftar dalam sistem
              </p>
            </div>

            {/* FILTER */}
            <div className="flex flex-wrap gap-3">
              {/* SEARCH */}
              <div className="relative">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari barang..."
                  className="rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-blue-500 focus:outline-none"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* FILTER KATEGORI */}
              <select
                value={kategoriId}
                onChange={(e) => setKategoriId(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Semua Kategori</option>
                {kategori.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                  </option>
                ))}
              </select>

              {/* RESET */}
              {(search || kategoriId) && (
                <button
                  onClick={() => {
                    setSearch("");
                    setKategoriId("");
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* TABLE */}
          <BarangTable
            data={filteredBarang}
            onDelete={handleDelete}
            onEdit={(item) => {
              setEditing(item);
              setOpen(true);
            }}
          />

          {filteredBarang.length === 0 && (
            <p className="mt-6 text-center text-sm text-gray-500">
              Barang tidak ditemukan
            </p>
          )}
        </div>
      </div>

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <BarangForm
          initialData={editing}
          onSubmit={handleSubmit}
          onClose={() => setOpen(false)}
        />
      </Modal>
    </div>
  );
}
