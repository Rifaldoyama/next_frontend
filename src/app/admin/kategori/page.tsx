"use client";
import { useState } from "react";
import { useAdminKategori } from "@/hooks/admin/useAdminKategori";
import { KategoriTable } from "@/components/organisms/admin/KategoriTable";
import KategoriForm from "@/components/molecules/admin/KategoriForm";
import { Modal } from "@/components/atoms/Modal";
import { Button } from "@/components/atoms/Buttons";
import { Plus } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function KategoriPage() {
  const { kategori, loading, deleteKategori, toggleStatus, refresh } =
    useAdminKategori();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);

  const handleOpenAdd = () => {
    setSelectedData(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setSelectedData(item);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any, file: File | null) => {
    const formData = new FormData();
    formData.append("nama", values.nama);
    formData.append("isActive", String(values.isActive));
    if (file) formData.append("file", file);

    const method = selectedData ? "PATCH" : "POST";
    const url = selectedData
      ? `/admin/kategori/${selectedData.id}`
      : "/admin/kategori";

    try {
      await apiFetch(url, { method, body: formData });
      setIsModalOpen(false);
      refresh();
    } catch (err) {
      alert("Gagal menyimpan data");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kategori Barang</h1>
          <p className="text-sm text-gray-500">
            Kelola kategori yang akan tampil di halaman user
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="bg-blue-600 flex items-center gap-2"
        >
          <Plus size={18} /> Tambah Kategori
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <KategoriTable
          data={kategori}
          onEdit={handleOpenEdit}
          onDelete={deleteKategori}
          onToggle={toggleStatus}
        />
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <KategoriForm
          initialData={selectedData}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}
