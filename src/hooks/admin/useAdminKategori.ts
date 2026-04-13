import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export function useAdminKategori() {
  const [kategori, setKategori] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchKategori = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/admin/kategori");
      setKategori(data);
    } catch (error) {
      console.error("Gagal mengambil kategori", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;

      const response = await apiFetch(`/admin/kategori/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: newStatus }),
      });

      console.log("Toggle status response:", response);

      await fetchKategori();

      return response;
    } catch (error) {
      console.error("Gagal mengubah status", error);
      alert("Gagal mengubah status kategori");
      throw error;
    }
  };

  const saveKategori = async (nama: string, file: File | null, id?: string) => {
    const formData = new FormData();
    formData.append("nama", nama);
    if (file) formData.append("file", file);

    const options = {
      method: id ? "PATCH" : "POST",
      body: formData,
    };

    const url = id ? `/admin/kategori/${id}` : "/admin/kategori";
    const result = await apiFetch(url, options);
    await fetchKategori();
    return result;
  };

  const deleteKategori = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return;

    try {
      await apiFetch(`/admin/kategori/${id}`, { method: "DELETE" });
      await fetchKategori();
    } catch (error) {
      console.error("Gagal menghapus kategori", error);
      alert("Gagal menghapus kategori");
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  return {
    kategori,
    loading,
    saveKategori,
    deleteKategori,
    toggleStatus,
    refresh: fetchKategori,
  };
}
