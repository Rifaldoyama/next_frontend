import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export function useAdminKategori() {
  const [kategori, setKategori] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchKategori = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/admin/kategori');
      setKategori(data);
    } catch (error) {
      console.error("Gagal mengambil kategori", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const formData = new FormData();
      // Kita kirim kebalikan dari status saat ini
      formData.append('isActive', String(!currentStatus));

      await apiFetch(`/admin/kategori/${id}`, {
        method: 'PATCH',
        body: formData,
      });
      
      await fetchKategori(); // Refresh data setelah berhasil
    } catch (error) {
      console.error("Gagal mengubah status", error);
      alert("Gagal mengubah status kategori");
    }
  };

  const saveKategori = async (nama: string, file: File | null, id?: string) => {
    const formData = new FormData();
    formData.append('nama', nama);
    if (file) formData.append('file', file);

    const options = {
      method: id ? 'PATCH' : 'POST',
      body: formData,
    };

    const url = id ? `/admin/kategori/${id}` : '/admin/kategori';
    const result = await apiFetch(url, options);
    await fetchKategori(); 
    return result;
  };

  const deleteKategori = async (id: string) => {
    await apiFetch(`/admin/kategori/${id}`, { method: 'DELETE' });
    await fetchKategori(); 
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  return { kategori, loading, saveKategori, deleteKategori,toggleStatus, refresh: fetchKategori };
}