import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export function useAdminBarang() {
  const [barang, setBarang] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
    const form = new FormData();
    form.append("data", JSON.stringify(payload));
    if (file) form.append("file", file);

    await apiFetch(id ? `/admin/barang/${id}` : "/admin/barang", {
      method: id ? "PATCH" : "POST",
      body: form,
    });

    fetchBarang();
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
  };
}
