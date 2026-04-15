"use client";

import { usePengembalianDeposit } from "@/hooks/admin/usePengembalianDeposit";
import { DepositFilter } from "@/components/molecules/admin/DepositFilter";
import { DepositTable } from "@/components/organisms/admin/DepositTable";

export default function PengembalianDepositPage() {
  const {
    peminjamanList,
    loading,
    setFilterStatus,
    kembalikanDeposit,
    isProcessing,
  } = usePengembalianDeposit();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">
          Pengembalian Deposit
        </h1>
        <p className="text-gray-500">
          Kelola pengembalian deposit untuk peminjaman yang sudah selesai
        </p>
      </header>

      <DepositFilter onStatusChange={setFilterStatus} />

      {loading ? (
        <div className="py-20 text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          Memuat data...
        </div>
      ) : peminjamanList.length > 0 ? (
        <DepositTable
          data={peminjamanList}
          onKembalikan={kembalikanDeposit}
          isProcessing={isProcessing}
        />
      ) : (
        <div className="bg-white border p-12 text-center rounded-xl text-gray-400">
          Tidak ada data pengembalian deposit
        </div>
      )}
    </div>
  );
}