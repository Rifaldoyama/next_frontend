"use client";

import { Button } from "@/components/atoms/Buttons";
import { RekeningList } from "@/components/organisms/admin/RekeningList";
import { RekeningFormModal } from "@/components/molecules/admin/RekeningFormModal";
import { useCreateRekeningModal } from "@/hooks/admin/useCreateRekeningModal";
import { useRekeningTujuan } from "@/hooks/admin/useRekeningTujuan";

export default function Page() {
  const { fetchRekening } = useRekeningTujuan();

  const modal = useCreateRekeningModal(fetchRekening);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Kelola Rekening Tujuan</h1>

        <Button onClick={modal.openModal}>Tambah Pembayaran</Button>
      </div>

      <RekeningList />

      <RekeningFormModal modal={modal} />
    </div>
  );
}
