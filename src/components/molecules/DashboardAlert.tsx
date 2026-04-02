// src/components/molecules/DashboardAlert.tsx

interface DashboardAlertProps {
  status?: string;
  onOpenModal?: () => void; // Tambahkan prop ini untuk trigger modal
}

export function DashboardAlert({ status, onOpenModal }: DashboardAlertProps) {
  // 1. KONDISI: REJECTED (Ditolak)
  if (status === "REJECTED") {
    return (
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-[#ff5b52] p-4 mb-6 mx-4 mt-4 shadow-md rounded-r-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300 hover:shadow-lg">
        <div className="flex">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#ff5b52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-bold bg-gradient-to-r from-[#ff5b52] to-pink-500 bg-clip-text text-transparent">
              Verifikasi Akun Ditolak
            </p>
            <p className="text-sm text-gray-700 mt-1">
              Data Anda ditolak oleh Admin. Fitur sewa dinonaktifkan sementara.
              Silakan perbaiki data profil Anda.
            </p>
          </div>
        </div>
        {onOpenModal && (
          <button
            onClick={onOpenModal}
            className="bg-gradient-to-r from-[#ff5b52] to-pink-500 hover:from-[#e54a42] hover:to-pink-600 text-white text-sm font-semibold py-2.5 px-5 rounded-xl whitespace-nowrap transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Perbaiki Data
            </span>
          </button>
        )}
      </div>
    );
  }

  // 2. KONDISI: PENDING (Menunggu) -> Tidak butuh tombol buka modal
  if (status === "PENDING") {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 mb-6 mx-4 mt-4 shadow-md rounded-r-xl transition-all duration-300 hover:shadow-lg">
        <div className="flex">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-bold text-blue-700">
              Menunggu Verifikasi
            </p>
            <p className="text-sm text-gray-700 mt-1">
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
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-4 mb-6 mx-4 mt-4 shadow-md rounded-r-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300 hover:shadow-lg">
        <div className="flex">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-bold text-yellow-800">
              Profil Belum Lengkap
            </p>
            <p className="text-sm text-gray-700 mt-1">
              Anda belum melengkapi data diri. Silakan lengkapi KTP dan Alamat
              agar bisa melakukan penyewaan.
            </p>
          </div>
        </div>
        {onOpenModal && (
          <button
            onClick={onOpenModal}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-sm font-semibold py-2.5 px-5 rounded-xl whitespace-nowrap transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Lengkapi Sekarang
            </span>
          </button>
        )}
      </div>
    );
  }

  return null; // Jika status APPROVED, tidak muncul apa-apa
}