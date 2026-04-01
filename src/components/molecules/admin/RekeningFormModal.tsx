"use client";

import { Modal } from "@/components/atoms/Modal";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Buttons";
import { useCreateRekeningModal } from "@/hooks/admin/useCreateRekeningModal";

interface Props {
  modal: ReturnType<typeof useCreateRekeningModal>;
}

export function RekeningFormModal({ modal }: Props) {
  const { open, closeModal, form, setField, submit } = modal;

  return (
    <Modal open={open} onClose={closeModal}>
      <h2 className="text-lg font-semibold mb-4">Tambah Rekening</h2>

      <div className="space-y-3">
        <Input
          placeholder="Nama"
          value={form.nama}
          onChange={(e) => setField("nama", e.target.value)}
        />

        <Input
          placeholder="Nomor Rekening"
          value={form.nomor_rekening}
          onChange={(e) => setField("nomor_rekening", e.target.value)}
        />

        <Input
          placeholder="Atas Nama"
          value={form.atas_nama}
          onChange={(e) => setField("atas_nama", e.target.value)}
        />

        <Input
          placeholder="Instruksi"
          value={form.instruksi}
          onChange={(e) => setField("instruksi", e.target.value)}
        />

        <select
          className="border p-2 rounded w-full"
          value={form.metode}
          onChange={(e) => setField("metode", e.target.value)}
        >
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="EWALLET">E-Wallet (Dana/Ovo/Gopay)</option>{" "}
            <option value="QRIS">QRIS</option>
            <option value="CASH">Tunai</option>
        </select>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={closeModal}>
            Batal
          </Button>

          <Button onClick={submit}>Simpan</Button>
        </div>
      </div>
    </Modal>
  );
}
