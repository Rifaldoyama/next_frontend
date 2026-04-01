"use client";

import { useState } from "react";
import { Modal } from "@/components/atoms/Modal";
import { Button } from "@/components/atoms/Buttons";
import { Badge } from "@/components/atoms/Badge";
import { useAdminZona, Zona } from "@/hooks/admin/useAdminZona";

export function ZonaManagerModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { zona, loading, createZona, updateZona, deleteZona } = useAdminZona();

  const [form, setForm] = useState({
    nama: "",
    jarak_min: "",
    jarak_max: "",
    biaya: "",
  });

  async function handleCreate() {
    await createZona({
      nama: form.nama,
      jarak_min: Number(form.jarak_min),
      jarak_max: Number(form.jarak_max),
      biaya: Number(form.biaya),
    });

    setForm({
      nama: "",
      jarak_min: "",
      jarak_max: "",
      biaya: "",
    });
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex justify-between">
          <h2 className="text-lg font-bold">Kelola Zona Pengiriman</h2>

          <Button variant="secondary" onClick={onClose}>
            Tutup
          </Button>
        </div>

        {/* LIST ZONA */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {loading && <p className="text-gray-500 text-sm">Loading...</p>}

          {!loading && zona.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              Zona masih kosong
            </div>
          )}

          {zona.map((z) => (
            <div
              key={z.id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div>
                <div className="font-semibold">{z.nama}</div>

                <div className="text-sm text-gray-600">
                  {z.jarak_min} - {z.jarak_max} km
                </div>

                <Badge color="green">Rp {z.biaya.toLocaleString()}</Badge>
              </div>

              <Button
                variant="danger"
                size="sm"
                onClick={() => deleteZona(z.id)}
              >
                Hapus
              </Button>
            </div>
          ))}
        </div>

        {/* FORM TAMBAH */}
        <div className="border-t pt-4 space-y-2">
          <h3 className="font-semibold">Tambah Zona</h3>

          <input
            placeholder="Nama zona"
            className="w-full border p-2 rounded"
            value={form.nama}
            onChange={(e) =>
              setForm({
                ...form,
                nama: e.target.value,
              })
            }
          />

          <input
            placeholder="Jarak min (km)"
            type="number"
            className="w-full border p-2 rounded"
            value={form.jarak_min}
            onChange={(e) =>
              setForm({
                ...form,
                jarak_min: e.target.value,
              })
            }
          />

          <input
            placeholder="Jarak max (km)"
            type="number"
            className="w-full border p-2 rounded"
            value={form.jarak_max}
            onChange={(e) =>
              setForm({
                ...form,
                jarak_max: e.target.value,
              })
            }
          />

          <input
            placeholder="Biaya"
            type="number"
            className="w-full border p-2 rounded"
            value={form.biaya}
            onChange={(e) =>
              setForm({
                ...form,
                biaya: e.target.value,
              })
            }
          />

          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Loading..." : "Tambah Zona"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
