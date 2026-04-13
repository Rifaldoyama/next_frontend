import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export function useAdminBarang() {
  const [barang, setBarang] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBarang = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/admin/barang");
      setBarang(data);
    } finally {
      setLoading(false);
    }
  };

  const saveBarang = async (payload: any, file?: File, id?: string) => {
    setError(null);
    const form = new FormData();
    form.append("data", JSON.stringify(payload));
    if (file) form.append("file", file);

    try {
      await apiFetch(id ? `/admin/barang/${id}` : "/admin/barang", {
        method: id ? "PATCH" : "POST",
        body: form,
      });
      fetchBarang();
      return { success: true };
    } catch (err: any) {
      const errorMsg = err.message || "Gagal menyimpan barang";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const deleteBarang = async (id: string) => {
    await apiFetch(`/admin/barang/${id}`, {
      method: "DELETE",
    });
    fetchBarang();
  };

  useEffect(() => {
    fetchBarang();
  }, []);

  return {
    barang,
    loading,
    fetchBarang,
    saveBarang,
    deleteBarang,
    error,
  };
}
