"use client";

import { UserDetailForm } from "../molecules/UserDetailForm";

type CompleteProfileModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any; // Tambahkan props ini
};

export function CompleteProfileModal({
  open,
  onClose,
  onSubmit,
  initialData, // Terima props
}: CompleteProfileModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-md space-y-4 text-black max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold">
          {initialData ? "Perbaiki Data Diri" : "Lengkapi Data Diri"}
        </h2>

        {/* Teruskan initialData ke Form */}
        <UserDetailForm onSubmit={onSubmit} initialData={initialData} />

        <button onClick={onClose} className="text-sm text-gray-500 w-full mt-2">
          {initialData ? "Batal Perbaikan" : "Nanti saja"}
        </button>
      </div>
    </div>
  );
}
