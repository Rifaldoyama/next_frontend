"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

export interface Zona {
  id: string;
  nama: string;
  jarak_min: number;
  jarak_max: number;
  biaya: number;
}

export function useAdminZona() {

  const [zona, setZona] = useState<Zona[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchZona() {

    setLoading(true);

    try {

      const data = await apiFetch("/api/admin/zona");
      console.log("ZONA FROM HOOK:", data);

      setZona(data ?? []);

    } catch (err) {

      console.error(err);
      setZona([]);

    } finally {

      setLoading(false);

    }

  }

  async function createZona(payload: Omit<Zona, "id">) {

    await apiFetch("/api/admin/zona", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    await fetchZona();

  }

  async function updateZona(id: string, payload: Partial<Zona>) {

    await apiFetch(`/api/admin/zona/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    await fetchZona();

  }

  async function deleteZona(id: string) {

    await apiFetch(`/api/admin/zona/${id}`, {
      method: "DELETE",
    });

    await fetchZona();

  }

  useEffect(() => {
    fetchZona();
  }, []);

  return {
    zona,
    loading,
    fetchZona,
    createZona,
    updateZona,
    deleteZona,
  };
}
