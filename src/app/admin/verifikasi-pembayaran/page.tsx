"use client";

import { usePaymentVerification } from "@/hooks/admin/usePaymentVerification";
import { PaymentFilter } from "@/components/molecules/PaymentFilter";
import { PaymentVerificationTable } from "@/components/organisms/admin/PaymentVerificationTable";

export default function VerificationPage() {
  const {
    payments,
    loading,
    setFilterType,
    setFilterDate,
    verifyPayment,
    rejectPayment,
    setFilterStatus,
  } = usePaymentVerification();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">
          Verifikasi Pembayaran
        </h1>
        <p className="text-gray-500">
          Tinjau bukti transfer masuk untuk DP dan Pelunasan
        </p>
      </header>

      <PaymentFilter
        onTypeChange={setFilterType}
        onDateChange={setFilterDate}
        onStatusChange={setFilterStatus}
      />

      {loading ? (
        <div className="py-20 text-center text-gray-500 animate-pulse">
          Memuat data pembayaran...
        </div>
      ) : payments.length > 0 ? (
        <PaymentVerificationTable
          payments={payments}
          onVerify={verifyPayment}
          onReject={rejectPayment}
        />
      ) : (
        <div className="bg-white border p-12 text-center rounded-xl text-gray-400">
          Tidak ada pembayaran yang menunggu verifikasi.
        </div>
      )}
    </div>
  );
}
