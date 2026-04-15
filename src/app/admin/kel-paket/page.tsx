"use client";

import { useState, useEffect } from "react";
import { useAdminPaket } from "@/hooks/admin/useAdminPaket";
import { useAdminBarang } from "@/hooks/admin/useAdminBarang";
import { Card } from "@/components/atoms/Card";
import { Badge } from "@/components/atoms/Badge";
import { Switch } from "@/components/atoms/Switch";
import { Modal } from "@/components/atoms/Modal";

export default function KelolaPaketPage() {
  const { paket, loading, error, createPaket, updatePaket, togglePaket } =
    useAdminPaket();

  const { barang } = useAdminBarang();

  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [diskon, setDiskon] = useState<number>(0);
  const [gambar, setGambar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [detailPaket, setDetailPaket] = useState<any | null>(null);
  const [selectedItems, setSelectedItems] = useState<
    { barangId: string; jumlah: number }[]
  >([]);

  /* ================= RESET ================= */
  const resetForm = () => {
    setNama("");
    setDeskripsi("");
    setDiskon(0);
    setGambar(null);
    setPreview(null);
    setSelectedItems([]);
    setEditId(null);
  };

  const handleClose = () => {
    resetForm();
    setOpenModal(false);
  };

  /* ================= PREVIEW IMAGE ================= */
  useEffect(() => {
    if (!gambar) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(gambar);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [gambar]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!nama.trim()) return alert("Nama wajib diisi");

    if (diskon < 0 || diskon > 50 || isNaN(diskon)) {
      return alert("Diskon harus antara 0 - 50");
    }

    if (selectedItems.length === 0) {
      return alert("Minimal pilih 1 barang");
    }

    for (const item of selectedItems) {
      const barangData = barang.find((b) => b.id === item.barangId);

      if (barangData && item.jumlah > barangData.stok_tersedia) {
        alert(
          `Jumlah ${barangData.nama} melebihi stok (${barangData.stok_tersedia})`,
        );
        return;
      }
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("deskripsi", deskripsi);
      formData.append("diskon_persen", String(diskon));

      // ⬇️ INI FIX PENTING
      selectedItems.forEach((item, index) => {
        formData.append(`items[${index}][barangId]`, item.barangId);
        formData.append(`items[${index}][jumlah]`, String(item.jumlah));
      });

      if (gambar) {
        formData.append("gambar", gambar);
      }

      if (editId) {
        await updatePaket(editId, formData);
      } else {
        await createPaket(formData);
      }

      handleClose();
    } catch (err) {
      console.error(err);
      alert("Gagal membuat paket");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-8 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kelola Paket</h1>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Tambah Paket
        </button>
      </div>

      {/* ================= LIST PAKET ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paket.map((p) => (
          <Card key={p.id}>
            {p.gambar && (
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${p.gambar}`}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}

            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">{p.nama}</h2>

              <Badge color={p.isActive ? "green" : "red"}>
                {p.isActive ? "Aktif" : "Nonaktif"}
              </Badge>
            </div>

            <p className="text-sm text-gray-500">
              Total: {p.total_paket.toLocaleString()}
            </p>

            <p className="text-sm text-gray-500 mb-4">
              Harga Final: Rp {p.harga_final.toLocaleString()}
            </p>

            <div className="flex justify-between items-center">
              <Switch enabled={p.isActive} onChange={() => togglePaket(p.id)} />

              <div className="flex gap-3 text-sm">
                <button
                  onClick={() => setDetailPaket(p)}
                  className="text-gray-600 hover:underline"
                >
                  Detail
                </button>

                <button
                  onClick={() => {
                    setEditId(p.id);
                    setNama(p.nama);
                    setDeskripsi(p.deskripsi || "");
                    setDiskon(p.diskon_persen || 0);

                    setPreview(
                      p.gambar
                        ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${p.gambar}`
                        : null,
                    );

                    const mappedItems =
                      p.items?.map((item: any) => ({
                        barangId: item.barangId,
                        jumlah: item.jumlah,
                      })) || [];

                    setSelectedItems(mappedItems);

                    setOpenModal(true);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      <Modal open={openModal} onClose={handleClose}>
        <div className="bg-white p-6 rounded-xl w-full max-w-lg space-y-5 relative">
          <h2 className="text-xl font-bold">
            {editId ? "Edit Paket" : "Tambah Paket"}
          </h2>

          {/* Nama Paket */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1 block">
              Nama Paket
            </label>
            <input
              type="text"
              placeholder="Masukkan nama paket"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1 block">
              Deskripsi
            </label>
            <textarea
              placeholder="Masukkan deskripsi paket"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Diskon */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1 block">
              Diskon (%)
            </label>
            <input
              type="number"
              placeholder="0 - 50"
              value={diskon}
              onChange={(e) => setDiskon(Number(e.target.value))}
              min={0}
              max={100}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Masukkan diskon dalam persen (0-50%)
            </p>
          </div>

          {/* Gambar Paket */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1 block">
              Gambar Paket
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setGambar(e.target.files?.[0] || null)}
              className="w-full border rounded-lg px-3 py-2"
            />
            {preview && (
              <div className="mt-3">
                <img
                  src={preview}
                  alt="Preview gambar paket"
                  className="w-full h-40 object-cover rounded-lg border"
                />
                <p className="text-xs text-gray-400 mt-1 text-center">
                  Preview gambar
                </p>
              </div>
            )}
          </div>

          {/* Daftar Barang */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2 block">
              Daftar Barang
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-gray-50">
              {barang.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Belum ada barang tersedia
                </p>
              ) : (
                barang.map((b) => {
                  const selected = selectedItems.find(
                    (i) => i.barangId === b.id,
                  );
                  const isStockExceeded =
                    selected && selected.jumlah > b.stok_tersedia;

                  return (
                    <div
                      key={b.id}
                      className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition"
                    >
                      <input
                        type="checkbox"
                        checked={!!selected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems((prev) => {
                              if (prev.some((i) => i.barangId === b.id))
                                return prev;
                              return [...prev, { barangId: b.id, jumlah: 1 }];
                            });
                          } else {
                            setSelectedItems((prev) =>
                              prev.filter((i) => i.barangId !== b.id),
                            );
                          }
                        }}
                        className="w-4 h-4"
                      />

                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {b.nama}
                        </p>
                        <p className="text-xs text-gray-500">
                          Stok: {b.stok_tersedia} | Harga: Rp{" "}
                          {b.harga_sewa?.toLocaleString()}
                        </p>
                      </div>

                      {selected && (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            max={b.stok_tersedia}
                            value={selected.jumlah}
                            className={`w-20 border rounded px-2 py-1 text-sm text-center ${
                              isStockExceeded ? "border-red-500 bg-red-50" : ""
                            }`}
                            onChange={(e) => {
                              let value = e.target.value;
                              // Remove leading zeros
                              if (value.length > 1 && value.startsWith("0")) {
                                value = value.replace(/^0+/, "");
                              }
                              const jumlah = Math.min(
                                b.stok_tersedia,
                                Math.max(1, Number(value || 1)),
                              );
                              setSelectedItems((prev) =>
                                prev.map((i) =>
                                  i.barangId === b.id ? { ...i, jumlah } : i,
                                ),
                              );
                            }}
                          />
                          {isStockExceeded && (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded whitespace-nowrap">
                              Maks {b.stok_tersedia}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            {selectedItems.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {selectedItems.length} barang dipilih
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              {submitting ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              onClick={handleClose}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Batal
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={!!detailPaket} onClose={() => setDetailPaket(null)}>
        {detailPaket && (
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl space-y-6 relative">
            <button
              onClick={() => setDetailPaket(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold">{detailPaket.nama}</h2>

            {detailPaket.gambar && (
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${detailPaket.gambar}`}
                className="w-full h-56 object-cover rounded-lg"
              />
            )}

            <p className="text-gray-600">
              {detailPaket.deskripsi || "Tidak ada deskripsi"}
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Total Barang</p>
                <p className="font-semibold">
                  Rp {detailPaket.total_paket.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Diskon</p>
                <p className="font-semibold">
                  {detailPaket.diskon_persen || 0}%
                </p>
              </div>

              <div>
                <p className="text-gray-500">Harga Final</p>
                <p className="font-semibold text-green-600">
                  Rp {detailPaket.harga_final.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Status</p>
                <p className="font-semibold">
                  {detailPaket.isActive ? "Aktif" : "Nonaktif"}
                </p>
              </div>
            </div>

            {/* LIST BARANG */}
            <div>
              <h3 className="font-semibold mb-3">Isi Paket</h3>

              <div className="space-y-3 max-h-52 overflow-y-auto border rounded-lg p-3">
                {detailPaket.items?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <div>
                      <p className="font-medium">{item.barang?.nama}</p>
                      <p className="text-gray-500">
                        Rp {item.barang?.harga_sewa.toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p>Qty: {item.jumlah}</p>
                      <p className="font-semibold">
                        Rp{" "}
                        {(
                          item.barang?.harga_sewa * item.jumlah
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
