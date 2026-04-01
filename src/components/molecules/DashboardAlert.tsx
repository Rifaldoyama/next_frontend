// src/components/molecules/DashboardAlert.tsx

interface DashboardAlertProps {
  status?: string;
  onOpenModal?: () => void; // Tambahkan prop ini untuk trigger modal
}

export function DashboardAlert({ status, onOpenModal }: DashboardAlertProps) {
  // 1. KONDISI: REJECTED (Ditolak)
  if (status === "REJECTED") {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 mx-4 mt-4 shadow-sm rounded-r flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex">
          <div className="flex-shrink-0 mt-0.5">❌</div>
          <div className="ml-3">
            <p className="text-sm text-red-700 font-bold">
              Verifikasi Akun Ditolak
            </p>
            <p className="text-sm text-red-600">
              Data Anda ditolak oleh Admin. Fitur sewa dinonaktifkan sementara.
              Silakan perbaiki data profil Anda.
            </p>
          </div>
        </div>
        {onOpenModal && (
          <button
            onClick={onOpenModal}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-4 rounded whitespace-nowrap transition-colors"
          >
            Perbaiki Data
          </button>
        )}
      </div>
    );
  }

  // 2. KONDISI: PENDING (Menunggu) -> Tidak butuh tombol buka modal
  if (status === "PENDING") {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 mx-4 mt-4 shadow-sm rounded-r">
        <div className="flex">
          <div className="flex-shrink-0 mt-0.5">⏳</div>
          <div className="ml-3">
            <p className="text-sm text-blue-700 font-bold">
              Menunggu Verifikasi
            </p>
            <p className="text-sm text-blue-600">
              Data Anda sedang ditinjau. Anda dapat melihat katalog, tetapi
              belum bisa menyewa.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 3. KONDISI: KOSONG / SKIP (Belum ada status karena belum isi)
  // Cocok untuk user yang klik "Skip" di awal
  if (!status || status === "UNVERIFIED") {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 mx-4 mt-4 shadow-sm rounded-r flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex">
          <div className="flex-shrink-0 mt-0.5">⚠️</div>
          <div className="ml-3">
            <p className="text-sm text-yellow-800 font-bold">
              Profil Belum Lengkap
            </p>
            <p className="text-sm text-yellow-700">
              Anda belum melengkapi data diri. Silakan lengkapi KTP dan Alamat
              agar bisa melakukan penyewaan.
            </p>
          </div>
        </div>
        {onOpenModal && (
          <button
            onClick={onOpenModal}
            className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold py-2 px-4 rounded whitespace-nowrap transition-colors"
          >
            Lengkapi Sekarang
          </button>
        )}
      </div>
    );
  }

  return null; // Jika status APPROVED, tidak muncul apa-apa
}
