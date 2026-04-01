"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

export function useCreateRekeningModal(onSuccess?: () => void) {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    nomor_rekening: "",
    atas_nama: "",
    instruksi: "",
    metode: "BANK_TRANSFER",
  });

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  function setField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submit() {
    await apiFetch("/api/admin/kel-pembayaran", {
      method: "POST",
      body: JSON.stringify(form),
    });

    closeModal();

    setForm({
      nama: "",
      nomor_rekening: "",
      atas_nama: "",
      instruksi: "",
      metode: "BANK_TRANSFER",
    });

    onSuccess?.();
  }

  return {
    open,
    openModal,
    closeModal,
    form,
    setField,
    submit,
  };
}
